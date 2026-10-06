/**
 * MIJHAR - Typed In-Memory & Persistent Storage Engine
 * Handles Users, Documents, VerificationRuns, Claims, Evidence, HumanReviews, and Audit Events.
 */

import {
  AuditEvent,
  Claim,
  EvidenceRecord,
  EvidenceSource,
  HumanReviewItem,
  User,
  VerificationRun,
  VerificationStatus,
} from '../../types/index.ts';
import { VERIFIED_HADITH_RECORDS, VERIFIED_QURAN_VERSES, VERIFIED_SOURCES } from './seedData.ts';

// Pre-configured users
const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'د. عبد الله المنصور (مشرف عام)',
    email: 'admin@mijhar.org',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-reviewer-1',
    name: 'الشيخ محمد البصري (مراجع شرعي)',
    email: 'reviewer@mijhar.org',
    role: 'reviewer',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-demo-1',
    name: 'يزيد الشمري (كاتب محتوى)',
    email: 'eng.yazed0@gmail.com',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
];

class MemoryStore {
  private users: Map<string, User> = new Map();
  private userPasswords: Map<string, string> = new Map(); // demo hash/secret
  private verificationRuns: Map<string, VerificationRun> = new Map();
  private humanReviews: Map<string, HumanReviewItem> = new Map();
  private auditEvents: AuditEvent[] = [];
  private sources: Map<string, EvidenceSource> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    // Seed users
    for (const u of INITIAL_USERS) {
      this.users.set(u.id, u);
      this.userPasswords.set(u.email.toLowerCase(), 'mijhar1234');
    }

    // Seed sources
    for (const s of VERIFIED_SOURCES) {
      this.sources.set(s.id, { ...s });
    }

    // Seed a demonstration verification run showcasing all status behaviors honestly
    const demoRunId = 'run-demo-sample';
    const demoClaims: Claim[] = [
      {
        id: 'claim-demo-1',
        verificationRunId: demoRunId,
        orderIndex: 0,
        originalText: 'قال تعالى: {يَا أَيُّهَا الَّذِينَ آمَنُوا إِن جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوا}',
        claimType: 'quran_quotation',
        claimSummaryAr: 'اقتباس قرآني من سورة الحجرات في شأن التثبت من الأخبار',
        claimSummaryEn: 'Quranic quotation from Surah Al-Hujurat on verifying news',
        status: 'supported',
        statusReasonAr: 'موافق تماماً للرسم العثماني المعتمد برواية حفص عن عاصم (مقتطع من صدر الآية 6).',
        statusReasonEn: 'Exact match with verified Uthmani script (Hafs edition, opening of Ayah 6).',
        limitationsAr: 'الاقتباس جزء من الآية الكريمة، وبقية الآية: {أَن تُصِيبُوا قَوْمًا بِجَهَالَةٍ فَتُصْبِحُوا عَلَىٰ مَا فَعَلْتُمْ نَادِمِينَ}.',
        limitationsEn: 'The quote is a partial verse; the complete ayah continues with warnings against acting on ignorance.',
        extractedConfidence: 0.98,
        requiresHumanReview: false,
        evidence: [
          {
            id: 'ev-demo-1',
            sourceId: 'source-quran-uthmani',
            sourceNameAr: 'مصحف المدينة النبوية (رواية حفص عن عاصم)',
            sourceNameEn: 'King Fahd Glorious Quran Complex',
            locator: 'سورة الحجرات: الآية 6',
            locatorUrl: 'https://quran.ksu.edu.sa/index.php#aya=49_6',
            excerptOriginal: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِن جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوا أَن تُصِيبُوا قَوْمًا بِجَهَالَةٍ فَتُصْبِحُوا عَلَىٰ مَا فَعَلْتُمْ نَادِمِينَ',
            matchType: 'exact',
            confidenceScore: 1.0,
            edition: 'مصحف المدينة النبوية - مجمع الملك فهد',
          },
        ],
      },
      {
        id: 'claim-demo-2',
        verificationRunId: demoRunId,
        orderIndex: 1,
        originalText: 'وروي أن النبي صلى الله عليه وسلم قال: «إنما الأعمال بالنيات وإنما لكل امرئ ما نوى»',
        claimType: 'hadith_attribution',
        claimSummaryAr: 'حديث إنما الأعمال بالنيات المنسوب للنبي صلى الله عليه وسلم',
        claimSummaryEn: 'Hadith attributing actions according to intentions',
        status: 'supported',
        statusReasonAr: 'مخرج في الصحيحين البخاري ومسلم برواية أمير المؤمنين عمر بن الخطاب رضي الله عنه.',
        statusReasonEn: 'Recorded in both Sahih al-Bukhari and Sahih Muslim from Umar ibn al-Khattab (RA).',
        limitationsAr: 'المتن المذكور هو صدر الحديث، وللحديث بقية في الهجرة مقيدة بالسبب.',
        limitationsEn: 'Quotation represents the principal opening sentence of the agreed-upon hadith.',
        extractedConfidence: 0.96,
        requiresHumanReview: false,
        evidence: [
          {
            id: 'ev-demo-2',
            sourceId: 'source-bukhari',
            sourceNameAr: 'صحيح البخاري',
            sourceNameEn: 'Sahih al-Bukhari',
            locator: 'كتاب بدء الوحي: حديث رقم 1',
            locatorUrl: 'https://sunnah.com/bukhari:1',
            excerptOriginal: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.',
            excerptTranslation: 'Actions are judged by motives, so each man will have what he intended...',
            grade: 'صحيح - متفق عليه',
            matchType: 'exact',
            confidenceScore: 0.99,
            edition: 'صحيح البخاري - طبعة بولاق والترقيم المعياري',
          },
        ],
      },
      {
        id: 'claim-demo-3',
        verificationRunId: demoRunId,
        orderIndex: 2,
        originalText: 'وكما قال الله: {وقضى ربك ألا تعبد إلا إياه وبالوالدين إحسانا}',
        claimType: 'quran_quotation',
        claimSummaryAr: 'اقتباس قرآني مع اختلاف طفيف في لفظ (تعبد)',
        claimSummaryEn: 'Quran quotation with typographical discrepancy on word (تعبد / تعبدوا)',
        status: 'text_mismatch',
        statusReasonAr: 'تفاوت لفظي: كُتبت في النص {ألا تعبد} بينما اللفظ العثماني الموثق في المصحف الشريف بالجمع {أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ}.',
        statusReasonEn: 'Textual mismatch: claimed text uses singular (ألا تعبد) whereas canonical Uthmani text is plural (أَلَّا تَعْبُدُوا).',
        limitationsAr: 'التفاوت يمس ضبط الكلمة رسماً وقراءة، وننبه على لزوم التدقيق قبل النشر دون اتهام بالتحريف العمدي.',
        limitationsEn: 'The discrepancy affects script and morphology; MIJHAR notes the variance for correction without attributing malice.',
        extractedConfidence: 0.94,
        requiresHumanReview: false,
        evidence: [
          {
            id: 'ev-demo-3',
            sourceId: 'source-quran-uthmani',
            sourceNameAr: 'مصحف المدينة النبوية (رواية حفص عن عاصم)',
            sourceNameEn: 'King Fahd Glorious Quran Complex',
            locator: 'سورة الإسراء: الآية 23',
            locatorUrl: 'https://quran.ksu.edu.sa/index.php#aya=17_23',
            excerptOriginal: 'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا',
            matchType: 'mismatch',
            confidenceScore: 0.88,
            edition: 'مصحف المدينة النبوية - مجمع الملك فهد',
            mismatchDetails: {
              claimedSegment: 'ألا تعبد',
              authenticSegment: 'أَلَّا تَعْبُدُوا',
              changedWords: [{ claimed: 'تعبد', authentic: 'تَعْبُدُوا' }],
            },
          },
        ],
      },
      {
        id: 'claim-demo-4',
        verificationRunId: demoRunId,
        orderIndex: 3,
        originalText: 'فهل يجوز لي قصر الصلاة والجمع وأنا مسافر لمدة ستة أشهر في بعثة دراسية؟',
        claimType: 'personal_religious_question',
        claimSummaryAr: 'استفتاء شخصي حول رخصة الجمع والقصر في السفر الطويل للدارس',
        claimSummaryEn: 'Personal religious inquiry regarding travel prayer concession during long study abroad',
        status: 'refer_to_specialist',
        statusReasonAr: 'منصة مِجهر ليست جهة إفتاء؛ مسائل الفتوى الشخصية ومناطات الأحكام الفردية تستوجب الرجوع لدور الإفتاء المعتمدة وهيئات كبار العلماء.',
        statusReasonEn: 'MIJHAR is not a fatwa engine; personal legal verdicts and context-specific circumstances require consultation with recognized official Muftis.',
        limitationsAr: 'المسألة فيها تفصيل خلافي معتبر بين الفقهاء في تقدير مدة الإقامة التي ينقطع بها السفر، ولا يجوز للأنظمة الآلية توليد فتوى فيها.',
        limitationsEn: 'This question involves classical juristic debate regarding maximum residency thresholds for travel dispensations.',
        extractedConfidence: 0.99,
        requiresHumanReview: true,
        evidence: [],
      },
    ];

    const demoRun: VerificationRun = {
      id: demoRunId,
      userId: 'user-demo-1',
      title: 'فحص مقال: فضل التثبت وبر الوالدين ورخص السفر',
      originalText: `قال تعالى: {يَا أَيُّهَا الَّذِينَ آمَنُوا إِن جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوا}\nوروي أن النبي صلى الله عليه وسلم قال: «إنما الأعمال بالنيات وإنما لكل امرئ ما نوى»\nوكما قال الله: {وقضى ربك ألا تعبد إلا إياه وبالوالدين إحسانا}\nفهل يجوز لي قصر الصلاة والجمع وأنا مسافر لمدة ستة أشهر في بعثة دراسية؟`,
      detectedLanguage: 'ar',
      contentType: 'article',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3590000).toISOString(),
      status: 'completed',
      engineVersion: '1.2.0-core',
      isAiAssisted: true,
      aiModelUsed: 'gemini-3.8-flash',
      totalClaimsCount: 4,
      statusCounts: {
        supported: 2,
        needs_review: 0,
        disputed: 0,
        unverified_in_available_sources: 0,
        refer_to_specialist: 1,
        text_mismatch: 1,
        processing_error: 0,
      },
      claims: demoClaims,
      summaryAr: 'تم استخراج 4 دعاوى واقتباسات شرعية: وُجدت شواهد موثقة لاقتباسين، ورُصد تفاوت لفظي دقيق في آية كريمة يستوجب التصحيح، وأُحيل الاستفتاء الشخصي للمفتين المختصين.',
      summaryEn: '4 religious claims extracted: 2 supported by canonical texts, 1 Quranic text mismatch detected requiring correction, and 1 personal religious question referred to specialists.',
      disclaimerAr: 'نتائج مِجهر توثيقية إسنادية ولا تعني إقرار صحة المقال كلياً أو إصدار حكم شرعي. ما لم يُعثر عليه في المصادر لا يعني بطلانه.',
      disclaimerEn: 'Results are documented textual findings and do not constitute an endorsement or a religious ruling. Absence from indexed sources does not denote fabrication.',
      flaggedByUsersCount: 0,
    };

    this.verificationRuns.set(demoRunId, demoRun);

    // Initial audit event
    this.addAudit({
      userId: 'user-admin-1',
      userEmail: 'admin@mijhar.org',
      action: 'system_initialized',
      entityType: 'verification',
      entityId: demoRunId,
      metadata: { engine: '1.2.0-core', corpusAyat: VERIFIED_QURAN_VERSES.length, corpusHadith: VERIFIED_HADITH_RECORDS.length },
    });
  }

  // User management
  public getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public getUserByEmail(email: string): User | undefined {
    const norm = email.toLowerCase().trim();
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === norm) return u;
    }
    return undefined;
  }

  public verifyPassword(email: string, pass: string): boolean {
    const stored = this.userPasswords.get(email.toLowerCase().trim());
    return stored === pass || pass === 'mijhar1234'; // demo fallback
  }

  public createUser(user: Omit<User, 'id' | 'createdAt'>, password?: string): User {
    const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullUser: User = {
      ...user,
      id,
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, fullUser);
    if (password) {
      this.userPasswords.set(user.email.toLowerCase().trim(), password);
    }
    return fullUser;
  }

  // Verification Runs
  public saveVerificationRun(run: VerificationRun): VerificationRun {
    this.verificationRuns.set(run.id, run);
    return run;
  }

  public getVerificationRun(id: string): VerificationRun | undefined {
    return this.verificationRuns.get(id);
  }

  public getVerificationRunsForUser(userId: string): VerificationRun[] {
    const list: VerificationRun[] = [];
    for (const r of this.verificationRuns.values()) {
      if (r.userId === userId) {
        list.push(r);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public deleteVerificationRun(id: string, userId: string): boolean {
    const run = this.verificationRuns.get(id);
    if (!run) return false;
    // ownership check
    if (run.userId !== userId) {
      const user = this.getUserById(userId);
      if (user?.role !== 'admin') return false;
    }
    this.verificationRuns.delete(id);
    this.addAudit({
      userId,
      userEmail: this.getUserById(userId)?.email || 'unknown',
      action: 'delete_verification',
      entityType: 'verification',
      entityId: id,
    });
    return true;
  }

  public clearUserHistory(userId: string): number {
    let count = 0;
    for (const [id, r] of this.verificationRuns.entries()) {
      if (r.userId === userId) {
        this.verificationRuns.delete(id);
        count++;
      }
    }
    this.addAudit({
      userId,
      userEmail: this.getUserById(userId)?.email || 'unknown',
      action: 'clear_user_history',
      entityType: 'verification',
      entityId: userId,
      metadata: { deletedCount: count },
    });
    return count;
  }

  // Human Review & Flagging
  public flagClaimForReview(
    runId: string,
    claimId: string,
    userNote: string,
    userId: string
  ): HumanReviewItem | null {
    const run = this.verificationRuns.get(runId);
    if (!run) return null;
    const claim = run.claims.find((c) => c.id === claimId);
    if (!claim) return null;

    claim.requiresHumanReview = true;
    claim.humanReviewStatus = 'pending';
    claim.humanReviewNotes = userNote;
    run.flaggedByUsersCount = (run.flaggedByUsersCount || 0) + 1;

    const reviewId = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const reviewItem: HumanReviewItem = {
      id: reviewId,
      verificationRunId: runId,
      claimId,
      claimOriginalText: claim.originalText,
      currentStatus: claim.status,
      userNote,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.humanReviews.set(reviewId, reviewItem);

    this.addAudit({
      userId,
      userEmail: this.getUserById(userId)?.email || 'user',
      action: 'flag_claim_for_review',
      entityType: 'claim',
      entityId: claimId,
      metadata: { runId, userNote },
    });

    return reviewItem;
  }

  public recordReviewerDecision(
    reviewId: string,
    reviewerId: string,
    decision: VerificationStatus,
    notes: string
  ): boolean {
    const review = this.humanReviews.get(reviewId);
    if (!review) return false;
    const reviewer = this.getUserById(reviewerId);
    if (!reviewer || (reviewer.role !== 'reviewer' && reviewer.role !== 'admin')) {
      return false;
    }

    review.reviewerId = reviewerId;
    review.reviewerName = reviewer.name;
    review.reviewerDecision = decision;
    review.reviewerNotes = notes;
    review.reviewedAt = new Date().toISOString();
    review.status = 'resolved';

    // Update claim in the run
    const run = this.verificationRuns.get(review.verificationRunId);
    if (run) {
      const claim = run.claims.find((c) => c.id === review.claimId);
      if (claim) {
        claim.status = decision;
        claim.humanReviewStatus = 'reviewed';
        claim.humanReviewNotes = `قرار المراجع: ${notes}`;
      }
    }

    this.addAudit({
      userId: reviewerId,
      userEmail: reviewer.email,
      action: 'reviewer_decision_recorded',
      entityType: 'human_review',
      entityId: reviewId,
      metadata: { newStatus: decision, notes },
    });

    return true;
  }

  public getPendingReviews(): HumanReviewItem[] {
    return Array.from(this.humanReviews.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Sources Management
  public getSources(): EvidenceSource[] {
    return Array.from(this.sources.values());
  }

  public toggleSourceStatus(sourceId: string, isConfigured: boolean, adminUserId: string): boolean {
    const src = this.sources.get(sourceId);
    if (!src) return false;
    src.isConfigured = isConfigured;
    this.addAudit({
      userId: adminUserId,
      userEmail: this.getUserById(adminUserId)?.email || 'admin',
      action: 'toggle_source_status',
      entityType: 'source',
      entityId: sourceId,
      metadata: { newStatus: isConfigured },
    });
    return true;
  }

  // Auditing
  public addAudit(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
    const fullEvent: AuditEvent = {
      ...event,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.auditEvents.push(fullEvent);
    if (this.auditEvents.length > 500) {
      this.auditEvents.shift();
    }
    return fullEvent;
  }

  public getAuditEvents(limit = 50): AuditEvent[] {
    return [...this.auditEvents].reverse().slice(0, limit);
  }
}

export const db = new MemoryStore();
