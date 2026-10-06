/**
 * MIJHAR - Traceable Hadith Verification Adapter
 * Searches canonical indexed Hadith collections (Sahih al-Bukhari, Sahih Muslim, Sunan, etc.)
 * Strictly reports source provenance and grades recorded by original sources.
 * Absence is never labeled fabricated — only unverified in available sources!
 */

import { EvidenceRecord, MatchPrecision } from '../../types/index.ts';
import { normalizeArabicText, VERIFIED_HADITH_RECORDS } from '../db/seedData.ts';

export interface HadithVerificationResult {
  matched: boolean;
  status: 'supported' | 'unverified_in_available_sources' | 'needs_review';
  evidence: EvidenceRecord[];
  reasonAr: string;
  reasonEn: string;
  limitationsAr: string;
  limitationsEn: string;
  matchType: MatchPrecision;
}

export function verifyHadithClaim(claimText: string): HadithVerificationResult {
  // Extract quoted text if present (e.g. «...» or "..." or {...})
  const quoteMatch = claimText.match(/[«"'{](.+?)[»"'}]+/);
  const coreText = quoteMatch ? quoteMatch[1] : claimText;

  // Also strip common prefixes like "وروي في الصحيح:" or "قال النبي صلى الله عليه وسلم:"
  const strippedText = coreText.replace(
    /^(?:قال\s+رسول\s+الله(?:\s+صلى\s+الله\s+عليه\s+وسلم)?|قال\s+النبي(?:\s+صلى\s+الله\s+عليه\s+وسلم)?|وروي\s+في\s+الصحيح(?:ين)?|روي\s+في\s+الصحيح(?:ين)?|روي\s+عن|أخرج\s+البخاري|أخرج\s+مسلم|رواه\s+البخاري|رواه\s+مسلم|في\s+الحديث)[:\s]*/,
    ''
  );

  const cleanClaim = normalizeArabicText(claimText);
  const cleanCore = normalizeArabicText(strippedText);

  if (!cleanClaim || cleanClaim.length < 5) {
    return {
      matched: false,
      status: 'unverified_in_available_sources',
      evidence: [],
      reasonAr: 'نص الحديث المستخرج وجيز للغاية ولا يحمل ألفاظاً كافية للمطابقة المعجمية المعتمدة.',
      reasonEn: 'Extracted hadith text is too brief for lexical verification.',
      limitationsAr: 'يتطلب عزو الحديث نصاً يحتوي على جملة من المتن أو اسم الراوي.',
      limitationsEn: 'Verification requires substantive wording or narrator attribution.',
      matchType: 'none',
    };
  }

  const claimWords = (cleanCore.length > 5 ? cleanCore : cleanClaim).split(/\s+/).filter((w) => w.length > 2);

  // 1. Direct or substring match in authentic Matn
  for (const hadith of VERIFIED_HADITH_RECORDS) {
    const cleanMatn = normalizeArabicText(hadith.matnAr);
    if (
      cleanMatn.includes(cleanClaim) ||
      cleanClaim.includes(cleanMatn) ||
      cleanMatn.includes(cleanCore) ||
      cleanCore.includes(cleanMatn)
    ) {
      const matchType: MatchPrecision = cleanMatn === cleanCore || cleanMatn === cleanClaim ? 'exact' : 'partial';
      return {
        matched: true,
        status: 'supported',
        matchType,
        evidence: [
          {
            id: `ev-h-${hadith.id}`,
            sourceId: `source-${hadith.collectionSlug}`,
            sourceNameAr: hadith.collection,
            sourceNameEn: hadith.collection,
            locator: `${hadith.collection}: ${hadith.bookNameAr}، ${hadith.chapterAr} (حديث رقم ${hadith.hadithNumber})`,
            locatorUrl: hadith.locatorUrl,
            excerptOriginal: hadith.matnAr,
            excerptTranslation: hadith.matnEn,
            grade: hadith.reportedGrade,
            edition: hadith.edition,
            matchType,
            confidenceScore: matchType === 'exact' ? 1.0 : 0.96,
          },
        ],
        reasonAr: `وُجد الحديث مخرجاً في ${hadith.collection}، برواية ${hadith.narrator}، وحكم المصدر: [${hadith.reportedGrade}].`,
        reasonEn: `Found in ${hadith.collection} narrated by ${hadith.narrator}. Source reported grade: [${hadith.reportedGrade}].`,
        limitationsAr: `الحكم المذكور هو نص المنقول في المصدر وليس اجتهاداً من المنصة. رقم المرجع: ${hadith.hadithNumber}.`,
        limitationsEn: `Grading is strictly as reported by the source. Reference number: ${hadith.hadithNumber}.`,
      };
    }
  }

  // 2. Lexical keyword intersection match
  let bestHadith: (typeof VERIFIED_HADITH_RECORDS)[0] | null = null;
  let bestScore = 0;

  for (const hadith of VERIFIED_HADITH_RECORDS) {
    const cleanMatn = normalizeArabicText(hadith.matnAr);
    const matnWords = cleanMatn.split(/\s+/).filter((w) => w.length > 2);

    let matchCount = 0;
    for (const cw of claimWords) {
      if (matnWords.includes(cw)) matchCount++;
    }

    const score = (2 * matchCount) / (claimWords.length + Math.min(matnWords.length, claimWords.length * 1.5));
    if (score > 0.45 && matchCount >= 3 && score > bestScore) {
      bestScore = score;
      bestHadith = hadith;
    }
  }

  if (bestHadith) {
    return {
      matched: true,
      status: 'supported',
      matchType: 'partial',
      evidence: [
        {
          id: `ev-h-${bestHadith.id}`,
          sourceId: `source-${bestHadith.collectionSlug}`,
          sourceNameAr: bestHadith.collection,
          sourceNameEn: bestHadith.collection,
          locator: `${bestHadith.collection}: ${bestHadith.bookNameAr} (حديث رقم ${bestHadith.hadithNumber})`,
          locatorUrl: bestHadith.locatorUrl,
          excerptOriginal: bestHadith.matnAr,
          excerptTranslation: bestHadith.matnEn,
          grade: bestHadith.reportedGrade,
          edition: bestHadith.edition,
          matchType: 'partial',
          confidenceScore: 0.88,
        },
      ],
      reasonAr: `مطابقة دلالية مع حديث مخرج في ${bestHadith.collection} برواية ${bestHadith.narrator} (حكم المصدر: ${bestHadith.reportedGrade}).`,
      reasonEn: `Substantive match with hadith in ${bestHadith.collection} from ${bestHadith.narrator} (Source grade: ${bestHadith.reportedGrade}).`,
      limitationsAr: 'المنصة تشير إلى توافق المتن في الجمل الرئيسة مع إمكانية وجود اختلاف في الروايات والزوائد.',
      limitationsEn: 'Corresponds in primary phrases; minor wording differences may exist between variant narrations.',
    };
  }

  // 3. Not found in configured corpus
  return {
    matched: false,
    status: 'unverified_in_available_sources',
    matchType: 'none',
    evidence: [],
    reasonAr: 'لم يُعثر على هذا الحديث في مجموعات الأحاديث المعتمدة والمفهرسة حالياً في مِجهر (صحيح البخاري، صحيح مسلم، والسنن الأساسية).',
    reasonEn: 'This narration was not found in MIJHAR’s currently indexed canonical Hadith collections.',
    limitationsAr: 'تنبيه: عدم العثور على الحديث في المصادر المتاحة لا يقتضي أبداً أنه مكذوب أو موضوع؛ بل يعني عدم توفر دليل في النطاق المفهرس حالياً.',
    limitationsEn: 'CRITICAL PRINCIPLE: Absence from the currently indexed corpus does NOT mean fabricated; it solely denotes unverified in available sources.',
  };
}
