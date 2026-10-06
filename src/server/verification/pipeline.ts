/**
 * MIJHAR - Core Verification Pipeline
 * Implements the full 12-step verification workflow.
 * Coordinates claim extraction, Quran/Hadith adapters, specialist referral, and reporting.
 */

import {
  Claim,
  VerificationRequest,
  VerificationRun,
  VerificationStatus,
} from '../../types/index.ts';
import { db } from '../db/store.ts';
import { extractClaimsWithGemini } from '../gemini.ts';
import { verifyHadithClaim } from './hadithAdapter.ts';
import { verifyQuranClaim } from './quranAdapter.ts';

export async function runVerificationPipeline(
  req: VerificationRequest,
  userId: string
): Promise<VerificationRun> {
  const rawText = (req.text || '').trim();

  // 1. Validation
  if (!rawText) {
    throw new Error('النص المدخل فارغ. يُرجى كتابة أو لصق النص المراد فحصه.');
  }
  if (rawText.length > 50000) {
    throw new Error('النص يتجاوز الحد الأقصى المسموح به (50,000 حرف).');
  }

  // 2. Language Detection
  const arabicLettersCount = (rawText.match(/[\u0600-\u06FF]/g) || []).length;
  const englishLettersCount = (rawText.match(/[a-zA-Z]/g) || []).length;
  let detectedLang: 'ar' | 'en' | 'mixed' = 'ar';
  if (englishLettersCount > arabicLettersCount * 2) {
    detectedLang = 'en';
  } else if (englishLettersCount > 20 && arabicLettersCount > 20) {
    detectedLang = 'mixed';
  }

  // 3. Extract candidate claims (Gemini or deterministic fallback)
  const extractionResult = await extractClaimsWithGemini(rawText, req.contentType || 'article');
  const extractedDtos = extractionResult.claims;

  const runId = `run-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const claims: Claim[] = [];
  const statusCounts: Record<VerificationStatus, number> = {
    supported: 0,
    needs_review: 0,
    disputed: 0,
    unverified_in_available_sources: 0,
    refer_to_specialist: 0,
    text_mismatch: 0,
    processing_error: 0,
  };

  // 4. Process each claim through its domain-specific adapter
  for (let idx = 0; idx < extractedDtos.length; idx++) {
    const dto = extractedDtos[idx];
    const claimId = `claim-${runId}-${idx + 1}`;

    // RULE: Personal religious question or fatwa inquiry -> ALWAYS refer_to_specialist!
    if (dto.claimType === 'personal_religious_question' || dto.isPersonalQuestion) {
      const claim: Claim = {
        id: claimId,
        verificationRunId: runId,
        orderIndex: idx,
        originalText: dto.originalText,
        claimType: 'personal_religious_question',
        claimSummaryAr: dto.claimSummaryAr || 'سؤال أو استفتاء شخصي في حكم شرعي',
        claimSummaryEn: dto.claimSummaryEn || 'Personal religious question or ruling inquiry',
        status: 'refer_to_specialist',
        statusReasonAr:
          'مِجهر منصة توثيقية إسنادية وليست جهة إفتاء شرعي؛ الفتاوى الشخصية تتطلب استيفاء تفاصيل المستفتي ومراجعة هيئات الإفتاء الرسمية.',
        statusReasonEn:
          'MIJHAR is an evidence verification engine, not a fatwa authority. Personal religious inquiries require consultation with certified Islamic scholars and official fatwa councils.',
        limitationsAr: 'المنصة لا تصدر أحكاماً شخصية بالحلال أو الحرام أو الإجزاء في العبادات والمعاملات الفردية.',
        limitationsEn: 'The platform strictly abstains from generating personal rulings or declarations of permissible/prohibited.',
        extractedConfidence: 0.99,
        requiresHumanReview: true,
        evidence: [],
      };
      statusCounts.refer_to_specialist++;
      claims.push(claim);
      continue;
    }

    // Quran Quotation Adapter
    if (dto.claimType === 'quran_quotation') {
      const quranRes = verifyQuranClaim(dto.originalText);
      const claim: Claim = {
        id: claimId,
        verificationRunId: runId,
        orderIndex: idx,
        originalText: dto.originalText,
        claimType: 'quran_quotation',
        claimSummaryAr: dto.claimSummaryAr || 'اقتباس من القرآن الكريم',
        claimSummaryEn: dto.claimSummaryEn || 'Quotation from the Holy Quran',
        status: quranRes.status,
        statusReasonAr: quranRes.reasonAr,
        statusReasonEn: quranRes.reasonEn,
        limitationsAr: quranRes.limitationsAr,
        limitationsEn: quranRes.limitationsEn,
        extractedConfidence: 0.95,
        requiresHumanReview: quranRes.status === 'text_mismatch',
        evidence: quranRes.evidence,
      };
      statusCounts[quranRes.status]++;
      claims.push(claim);
      continue;
    }

    // Hadith Attribution Adapter
    if (dto.claimType === 'hadith_attribution') {
      const hadithRes = verifyHadithClaim(dto.originalText);
      const claim: Claim = {
        id: claimId,
        verificationRunId: runId,
        orderIndex: idx,
        originalText: dto.originalText,
        claimType: 'hadith_attribution',
        claimSummaryAr: dto.claimSummaryAr || 'حديث منسوب للنبي صلى الله عليه وسلم',
        claimSummaryEn: dto.claimSummaryEn || 'Hadith attributed to the Prophet (PBUH)',
        status: hadithRes.status,
        statusReasonAr: hadithRes.reasonAr,
        statusReasonEn: hadithRes.reasonEn,
        limitationsAr: hadithRes.limitationsAr,
        limitationsEn: hadithRes.limitationsEn,
        extractedConfidence: 0.93,
        requiresHumanReview: hadithRes.status === 'needs_review',
        evidence: hadithRes.evidence,
      };
      statusCounts[hadithRes.status]++;
      claims.push(claim);
      continue;
    }

    // Scholarly Statement or Fiqh Ruling
    if (dto.claimType === 'scholarly_statement' || dto.claimType === 'fiqh_ruling') {
      // Check if text cites an indexed source or general statement
      const claim: Claim = {
        id: claimId,
        verificationRunId: runId,
        orderIndex: idx,
        originalText: dto.originalText,
        claimType: dto.claimType,
        claimSummaryAr: dto.claimSummaryAr || 'قول فقهي أو مذهبي منسوب',
        claimSummaryEn: dto.claimSummaryEn || 'Attributed scholarly or juristic statement',
        status: 'needs_review',
        statusReasonAr:
          'المقولات الفقهية وأقوال الأئمة تحتاج إلى مراجعة سياق المسألة وكتب الفقه المعتمدة للتأكد من نسبة القول واستقراره.',
        statusReasonEn:
          'Scholarly attributions and juristic rulings require contextual examination in classical references to ensure fidelity of attribution.',
        limitationsAr: 'الموسوعات الفقهية الشاملة قيد الربط الفني في مِجهر.',
        limitationsEn: 'Comprehensive fiqh encyclopedias are in progressive indexing phase.',
        extractedConfidence: 0.85,
        requiresHumanReview: true,
        evidence: [],
      };
      statusCounts.needs_review++;
      claims.push(claim);
      continue;
    }

    // Fallback: Check if the text matches Quran or Hadith anyway
    const tryQuran = verifyQuranClaim(dto.originalText);
    if (tryQuran.matched) {
      const claim: Claim = {
        id: claimId,
        verificationRunId: runId,
        orderIndex: idx,
        originalText: dto.originalText,
        claimType: 'quran_quotation',
        claimSummaryAr: 'اقتباس قرآني تم التحقق من رسمه',
        claimSummaryEn: 'Quranic quotation identified and verified',
        status: tryQuran.status,
        statusReasonAr: tryQuran.reasonAr,
        statusReasonEn: tryQuran.reasonEn,
        limitationsAr: tryQuran.limitationsAr,
        limitationsEn: tryQuran.limitationsEn,
        extractedConfidence: 0.9,
        requiresHumanReview: tryQuran.status === 'text_mismatch',
        evidence: tryQuran.evidence,
      };
      statusCounts[tryQuran.status]++;
      claims.push(claim);
      continue;
    }

    const tryHadith = verifyHadithClaim(dto.originalText);
    if (tryHadith.matched) {
      const claim: Claim = {
        id: claimId,
        verificationRunId: runId,
        orderIndex: idx,
        originalText: dto.originalText,
        claimType: 'hadith_attribution',
        claimSummaryAr: 'حديث نبوي وُجد في المصادر المعتمدة',
        claimSummaryEn: 'Hadith found in canonical collections',
        status: tryHadith.status,
        statusReasonAr: tryHadith.reasonAr,
        statusReasonEn: tryHadith.reasonEn,
        limitationsAr: tryHadith.limitationsAr,
        limitationsEn: tryHadith.limitationsEn,
        extractedConfidence: 0.88,
        requiresHumanReview: false,
        evidence: tryHadith.evidence,
      };
      statusCounts[tryHadith.status]++;
      claims.push(claim);
      continue;
    }

    // Otherwise: unverified_in_available_sources
    const claim: Claim = {
      id: claimId,
      verificationRunId: runId,
      orderIndex: idx,
      originalText: dto.originalText,
      claimType: dto.claimType,
      claimSummaryAr: dto.claimSummaryAr || 'دعوى شرعية غير موثقة في المصادر المتاحة',
      claimSummaryEn: dto.claimSummaryEn || 'Religious claim not verified in available sources',
      status: 'unverified_in_available_sources',
      statusReasonAr:
        'لم يُعثر على إسناد أو نص مطابق لهذه الدعوى ضمن المصادر والمجموعات المفهرسة حالياً في المنصة.',
      statusReasonEn:
        'No direct attribution or text match was identified within the currently indexed collections.',
      limitationsAr: 'عدم العثور على الدليل لا ينفي صحته مطلقاً؛ بل يبيّن حدود التغطية المفهرسة في مِجهر.',
      limitationsEn: 'Absence from available sources indicates lack of documented evidence in this corpus, not falsification.',
      extractedConfidence: 0.8,
      requiresHumanReview: false,
      evidence: [],
    };
    statusCounts.unverified_in_available_sources++;
    claims.push(claim);
  }

  // 5. Generate high-level summary
  const totalClaims = claims.length;
  const title =
    rawText.slice(0, 50).replace(/[\n\r]+/g, ' ') + (rawText.length > 50 ? '...' : '');

  const summaryAr = `تم فحص النص واستخراج ${totalClaims} دعاوى واقتباسات شرعية: (${statusCounts.supported} مدعومة بأدلة موثقة، ${statusCounts.text_mismatch} تفاوت لفظي دقيق، ${statusCounts.refer_to_specialist} إحالة لمختصين، ${statusCounts.unverified_in_available_sources} غير موثقة في المصادر المتاحة).`;
  const summaryEn = `Analysis completed on ${totalClaims} extracted claims: (${statusCounts.supported} supported with evidence, ${statusCounts.text_mismatch} textual mismatches, ${statusCounts.refer_to_specialist} specialist referrals, ${statusCounts.unverified_in_available_sources} unverified in current sources).`;

  const run: VerificationRun = {
    id: runId,
    userId,
    title,
    originalText: rawText,
    detectedLanguage: detectedLang,
    contentType: req.contentType,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    status: 'completed',
    engineVersion: '1.2.0-core',
    isAiAssisted: extractionResult.usedAi,
    aiModelUsed: extractionResult.usedAi ? 'gemini-3.8-flash' : undefined,
    totalClaimsCount: totalClaims,
    statusCounts,
    claims,
    summaryAr,
    summaryEn,
    disclaimerAr:
      'تنبيه منهجي: نتائج مِجهر تنحصر في التوثيق النصي المقارن ولا تُمثّل فتوى شرعية أو تزكية مطلقة للنص. ما لم يُعثر عليه في المصادر لا يعني بطلانه أو وضعه.',
    disclaimerEn:
      'Methodological Notice: MIJHAR findings are confined to comparative source documentation and do not constitute a fatwa or blanket endorsement. Absence from sources does not denote fabrication.',
  };

  db.saveVerificationRun(run);

  db.addAudit({
    userId,
    userEmail: db.getUserById(userId)?.email || 'user',
    action: 'verification_run_completed',
    entityType: 'verification',
    entityId: runId,
    metadata: {
      totalClaims,
      supported: statusCounts.supported,
      mismatch: statusCounts.text_mismatch,
      usedAi: extractionResult.usedAi,
    },
  });

  return run;
}
