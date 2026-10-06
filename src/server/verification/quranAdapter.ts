/**
 * MIJHAR - Deterministic Quran Verification Adapter
 * Matches user claims against canonical Uthmani Quran text.
 * Distinguishes exact match, normalized match, partial match, and text mismatch with word diffs.
 */

import { EvidenceRecord, MatchPrecision } from '../../types/index.ts';
import { normalizeArabicText, VERIFIED_QURAN_VERSES } from '../db/seedData.ts';

export interface QuranVerificationResult {
  matched: boolean;
  status: 'supported' | 'text_mismatch' | 'unverified_in_available_sources';
  evidence: EvidenceRecord[];
  reasonAr: string;
  reasonEn: string;
  limitationsAr: string;
  limitationsEn: string;
  matchType: MatchPrecision;
}

// Compute word-level difference between claimed text and authentic Ayah
function analyzeWordDifference(claimedWords: string[], authenticWords: string[]) {
  const missingWords: string[] = [];
  const addedWords: string[] = [];
  const changedWords: { claimed: string; authentic: string }[] = [];

  const authenticSet = new Set(authenticWords);
  const claimedSet = new Set(claimedWords);

  for (const c of claimedWords) {
    if (!authenticSet.has(c)) {
      // Find closest word in authentic
      const closest = authenticWords.find((a) => a.includes(c) || c.includes(a));
      if (closest) {
        changedWords.push({ claimed: c, authentic: closest });
      } else {
        addedWords.push(c);
      }
    }
  }

  for (const a of authenticWords) {
    if (!claimedSet.has(a) && !changedWords.some((cw) => cw.authentic === a)) {
      missingWords.push(a);
    }
  }

  return { missingWords, addedWords, changedWords };
}

export function verifyQuranClaim(claimText: string): QuranVerificationResult {
  // Extract quoted text if present (e.g. {قل هو الله أحد} or «...»)
  const quoteMatch = claimText.match(/[«"'{](.+?)[»"'}]+/);
  const coreText = quoteMatch ? quoteMatch[1] : claimText;

  // Strip introductory Quran phrases like "قال تعالى:" or "قوله تعالى:"
  const strippedText = coreText.replace(
    /^(?:قال\s+الله\s+تعالى|قال\s+تعالى|قوله\s+تعالى|في\s+القرآن(?:\s+الكريم)?|سورة\s+[^\s]+|في\s+محكم\s+التنزيل|كقوله)[:\s]*/,
    ''
  );

  const cleanClaim = normalizeArabicText(claimText);
  const cleanCore = normalizeArabicText(strippedText);

  if (!cleanClaim || cleanClaim.length < 4) {
    return {
      matched: false,
      status: 'unverified_in_available_sources',
      evidence: [],
      reasonAr: 'نص الاقتباس القرآني مقتضب جداً ولا يحتوي على كلمات كافية للتحقق القطعي.',
      reasonEn: 'Quran quotation is too brief to verify conclusively.',
      limitationsAr: 'التحقق يتطلب جملة أو عبارة دالة من الآية الكريمة.',
      limitationsEn: 'Verification requires sufficient distinct verse phrases.',
      matchType: 'none',
    };
  }

  const claimWords = (cleanCore.length >= 4 ? cleanCore : cleanClaim).split(/\s+/).filter(Boolean);

  // 1. Check exact match or substring in normalized text
  for (const ayah of VERIFIED_QURAN_VERSES) {
    // Exact or normalized match within this Ayah
    if (ayah.textClean === cleanClaim || ayah.textClean === cleanCore) {
      return {
        matched: true,
        status: 'supported',
        matchType: 'exact',
        evidence: [
          {
            id: `ev-q-${ayah.id}`,
            sourceId: 'source-quran-uthmani',
            sourceNameAr: 'مصحف المدينة النبوية (رواية حفص عن عاصم)',
            sourceNameEn: 'King Fahd Glorious Quran Complex',
            locator: `سورة ${ayah.surahNameAr}: الآية ${ayah.ayahNumber}`,
            locatorUrl: `https://quran.ksu.edu.sa/index.php#aya=${ayah.surahNumber}_${ayah.ayahNumber}`,
            excerptOriginal: ayah.textUthmani,
            edition: ayah.edition,
            matchType: 'exact',
            confidenceScore: 1.0,
          },
        ],
        reasonAr: `مطابق تماماً لنص الآية الكريمة (${ayah.ayahNumber}) من سورة ${ayah.surahNameAr} بالرسم العثماني.`,
        reasonEn: `Exact match with Ayah ${ayah.ayahNumber} of Surah ${ayah.surahNameEn} in canonical Uthmani script.`,
        limitationsAr: 'النص مطابق للرواية المعتمدة (حفص عن عاصم).',
        limitationsEn: 'Verified according to the standard Hafs narration.',
      };
    }

    // Substring match (User quoted part of a longer Ayah or verse contained within user claim)
    if (
      ayah.textClean.includes(cleanClaim) ||
      ayah.textClean.includes(cleanCore) ||
      (cleanCore.length > 10 && cleanCore.includes(ayah.textClean))
    ) {
      return {
        matched: true,
        status: 'supported',
        matchType: 'partial',
        evidence: [
          {
            id: `ev-q-${ayah.id}`,
            sourceId: 'source-quran-uthmani',
            sourceNameAr: 'مصحف المدينة النبوية (رواية حفص عن عاصم)',
            sourceNameEn: 'King Fahd Glorious Quran Complex',
            locator: `سورة ${ayah.surahNameAr}: الآية ${ayah.ayahNumber}`,
            locatorUrl: `https://quran.ksu.edu.sa/index.php#aya=${ayah.surahNumber}_${ayah.ayahNumber}`,
            excerptOriginal: ayah.textUthmani,
            edition: ayah.edition,
            matchType: 'partial',
            confidenceScore: 0.98,
          },
        ],
        reasonAr: `الاقتباس يمثل جزءاً صحيحاً من الآية ${ayah.ayahNumber} من سورة ${ayah.surahNameAr}، وموافق للرسم العثماني.`,
        reasonEn: `Quotation is a verified segment of Ayah ${ayah.ayahNumber}, Surah ${ayah.surahNameEn}.`,
        limitationsAr: `الاقتباس مجتزأ من الآية، والآية كاملة في المصحف: {${ayah.textUthmani}}.`,
        limitationsEn: `Quotation is partial. Full canonical verse: {${ayah.textUthmani}}.`,
      };
    }
  }

  // 2. Check for Near Match / Text Mismatch (e.g. single word substitution or typo)
  let bestCandidate: {
    ayah: (typeof VERIFIED_QURAN_VERSES)[0];
    overlapScore: number;
    diff: ReturnType<typeof analyzeWordDifference>;
  } | null = null;

  for (const ayah of VERIFIED_QURAN_VERSES) {
    const ayahWords = ayah.textClean.split(/\s+/).filter(Boolean);
    let commonCount = 0;
    for (const w of claimWords) {
      if (ayahWords.includes(w)) commonCount++;
    }
    const overlapRatio = (2 * commonCount) / (claimWords.length + Math.min(ayahWords.length, claimWords.length * 1.5));

    // If more than 60% of significant words match a specific verse, it is likely a quoted verse with a discrepancy
    if (overlapRatio >= 0.55 && commonCount >= 3) {
      if (!bestCandidate || overlapRatio > bestCandidate.overlapScore) {
        const diff = analyzeWordDifference(claimWords, ayahWords);
        bestCandidate = { ayah, overlapScore: overlapRatio, diff };
      }
    }
  }

  if (bestCandidate && bestCandidate.overlapScore >= 0.6) {
    const { ayah, diff } = bestCandidate;
    const changedSummaryAr = diff.changedWords.length
      ? diff.changedWords.map((cw) => `ورد في النص «${cw.claimed}» والأصل «${cw.authentic}»`).join('، ')
      : 'تفاوت في بعض الكلمات';

    return {
      matched: true,
      status: 'text_mismatch',
      matchType: 'mismatch',
      evidence: [
        {
          id: `ev-q-${ayah.id}`,
          sourceId: 'source-quran-uthmani',
          sourceNameAr: 'مصحف المدينة النبوية (رواية حفص عن عاصم)',
          sourceNameEn: 'King Fahd Glorious Quran Complex',
          locator: `سورة ${ayah.surahNameAr}: الآية ${ayah.ayahNumber}`,
          locatorUrl: `https://quran.ksu.edu.sa/index.php#aya=${ayah.surahNumber}_${ayah.ayahNumber}`,
          excerptOriginal: ayah.textUthmani,
          edition: ayah.edition,
          matchType: 'mismatch',
          confidenceScore: 0.85,
          mismatchDetails: {
            claimedSegment: claimText,
            authenticSegment: ayah.textUthmani,
            missingWords: diff.missingWords.slice(0, 5),
            addedWords: diff.addedWords.slice(0, 5),
            changedWords: diff.changedWords,
          },
        },
      ],
      reasonAr: `تفاوت لفظي مع الآية ${ayah.ayahNumber} من سورة ${ayah.surahNameAr}: ${changedSummaryAr}. يُرجى مراجعة الرسم والتصويب.`,
      reasonEn: `Textual mismatch with Ayah ${ayah.ayahNumber} of Surah ${ayah.surahNameEn}. Discrepancies detected between claimed quotation and canonical Uthmani text.`,
      limitationsAr: 'المنصة تسجل التفاوت اللفظي لتيسير التصحيح والتثبت، ولا تنسب ذلك لتحريف مقصود.',
      limitationsEn: 'Discrepancy is recorded for editorial correction; no presumption of intent is implied.',
    };
  }

  // 3. Not found in available corpus
  return {
    matched: false,
    status: 'unverified_in_available_sources',
    matchType: 'none',
    evidence: [],
    reasonAr: 'لم يُعثر على نص مطابق أو مقارب لهذا الاقتباس ضمن الآيات المفهرسة حالياً في مصحف مجمع الملك فهد.',
    reasonEn: 'No matching or near-matching verse found in the currently indexed King Fahd Complex corpus.',
    limitationsAr: 'عدم العثور على النص في الفهرس الحالي قد يعني اختلافاً كبيراً في الصياغة أو الحاجة لتوسيع الفهرس الشامل.',
    limitationsEn: 'Absence from current index means unverified in available sources; it does not constitute a religious judgment.',
  };
}
