/**
 * MIJHAR (مِجهر) - Core Domain Types & Data Model
 * Strict TypeScript types for Islamic Content Verification
 */

export type ClaimType =
  | 'quran_quotation'              // اقتباس قرآني
  | 'hadith_attribution'           // حديث نبوي منسوب
  | 'fiqh_ruling'                  // حكم فقهي أو شرعي
  | 'scholarly_statement'          // قول منسوب لعالم أو فقيه
  | 'religious_terminology'        // مصطلح ديني أو عقدي
  | 'personal_religious_question'  // سؤال شخصي أو استفتاء
  | 'other_uncertain';             // دعوى أخرى غير محددة

export type VerificationStatus =
  | 'supported'                       // مؤيّد بدليل موثّق
  | 'needs_review'                    // يتطلب مراجعة وسياقاً إضافياً
  | 'disputed'                        // مسألة خلافية معتبرة في المصادر
  | 'unverified_in_available_sources' // لم يُعثر عليه في المصادر المتاحة
  | 'refer_to_specialist'             // يُحال إلى مفتٍ أو عالم مختص
  | 'text_mismatch'                   // تفاوت لفظي بين الاقتباس والنص الموثق
  | 'processing_error';               // تعذر التحقق لخلل فني

export type MatchPrecision = 'exact' | 'normalized' | 'partial' | 'mismatch' | 'none';

export type UserRole = 'user' | 'reviewer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface QuranAyahRecord {
  id: string;
  surahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  ayahNumber: number;
  textUthmani: string;
  textClean: string; // diacritics stripped, normalized for deterministic search
  riwayah: string; // e.g. "حفص عن عاصم"
  edition: string; // e.g. "مصحف المدينة النبوية - مجمع الملك فهد"
}

export interface HadithRecord {
  id: string;
  collection: string;         // e.g. "صحيح البخاري" / "Sahih al-Bukhari"
  collectionSlug: string;     // e.g. "bukhari"
  bookNumber?: number;
  bookNameAr: string;
  bookNameEn: string;
  hadithNumber: number | string;
  chapterAr: string;
  chapterEn?: string;
  narrator: string;           // الصحابي راوي الحديث
  matnAr: string;             // نص الحديث بالعربية
  matnEn?: string;            // English translation
  reportedGrade: string;      // حكم المصدر (صحيح، حسن، متفق عليه)
  gradeSource: string;        // مَن حكم عليه في المصدر
  locatorUrl: string;         // رابط المرجع
  edition: string;
  dataVersion: string;
}

export interface EvidenceSource {
  id: string;
  nameAr: string;
  nameEn: string;
  type: 'quran_corpus' | 'hadith_collection' | 'fiqh_compilation' | 'scholarly_encyclopedia';
  publisherAr: string;
  publisherEn: string;
  coverage: string;
  version: string;
  lastUpdated: string;
  isConfigured: boolean;      // True if indexed & callable; False if planned/unavailable
  licenseNoteAr: string;
  licenseNoteEn: string;
  recordsCount?: number;
}

export interface EvidenceRecord {
  id: string;
  sourceId: string;
  sourceNameAr: string;
  sourceNameEn: string;
  locator: string;            // e.g., "سورة البقرة: الآية 255" or "صحيح البخاري: حديث 1"
  locatorUrl?: string;
  excerptOriginal: string;    // The verified reference text from the source
  excerptTranslation?: string;
  grade?: string;
  edition: string;
  matchType: MatchPrecision;
  confidenceScore: number;    // 0.0 - 1.0 (Extraction/Match confidence, not religious correctness!)
  mismatchDetails?: {
    claimedSegment: string;
    authenticSegment: string;
    missingWords?: string[];
    addedWords?: string[];
    changedWords?: { claimed: string; authentic: string }[];
  };
}

export interface Claim {
  id: string;
  verificationRunId: string;
  orderIndex: number;
  originalText: string;       // Exact segment from user text
  claimType: ClaimType;
  claimSummaryAr: string;
  claimSummaryEn: string;
  status: VerificationStatus;
  statusReasonAr: string;
  statusReasonEn: string;
  limitationsAr: string;
  limitationsEn: string;
  extractedConfidence: number;
  evidence: EvidenceRecord[];
  requiresHumanReview: boolean;
  humanReviewStatus?: 'pending' | 'reviewed' | 'escalated';
  humanReviewNotes?: string;
}

export interface VerificationRun {
  id: string;
  userId: string;
  title: string;
  originalText: string;
  detectedLanguage: 'ar' | 'en' | 'mixed';
  contentType: 'article' | 'social_post' | 'sermon_draft' | 'educational' | 'ai_generated' | 'other';
  createdAt: string;
  completedAt?: string;
  status: 'processing' | 'completed' | 'partial' | 'error';
  engineVersion: string;
  aiModelUsed?: string;
  isAiAssisted: boolean;
  totalClaimsCount: number;
  statusCounts: Record<VerificationStatus, number>;
  claims: Claim[];
  summaryAr: string;
  summaryEn: string;
  disclaimerAr: string;
  disclaimerEn: string;
  flaggedByUsersCount?: number;
}

export interface HumanReviewItem {
  id: string;
  verificationRunId: string;
  claimId: string;
  claimOriginalText: string;
  currentStatus: VerificationStatus;
  userNote?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewerDecision?: VerificationStatus;
  reviewerNotes?: string;
  reviewedAt?: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  entityType: 'verification' | 'claim' | 'source' | 'human_review' | 'auth';
  entityId: string;
  metadata?: Record<string, unknown>;
}

export interface VerificationRequest {
  text: string;
  language?: 'ar' | 'en' | 'auto';
  contentType: VerificationRun['contentType'];
}

export interface SystemHealth {
  status: 'healthy' | 'degraded';
  geminiConfigured: boolean;
  quranCorpusLoaded: boolean;
  quranAyatCount: number;
  hadithCorpusLoaded: boolean;
  hadithRecordsCount: number;
  sourcesConfiguredCount: number;
  sourcesTotalCount: number;
  uptimeSeconds: number;
  engineVersion: string;
}

export interface TeamMember {
  id: string;
  name: string;
  major: string;
  roleTitleAr: string;
  roleTitleEn: string;
  challengeRoleCategory: 'ai_engineer' | 'frontend_app_dev' | 'islamic_knowledge_specialist' | 'ux_designer';
  responsibilitiesAr: string[];
  responsibilitiesEn: string[];
  avatarFallback: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  level?: 'a_established' | 'b_explanation' | 'c_disputed' | 'd_fatwa_referral';
  sources?: {
    name: string;
    locator?: string;
    url?: string;
  }[];
  isReferredToSpecialist?: boolean;
}

export interface VerificationCertificate {
  certificateId: string;
  verificationRunId: string;
  issueDate: string;
  issuedTo: string;
  documentTitle: string;
  totalClaimsCount: number;
  supportedCount: number;
  textMismatchCount: number;
  referralCount: number;
  digitalSignatureHash: string;
  issuerOrgAr: string;
  issuerOrgEn: string;
  canonicalStandards: string[];
}
