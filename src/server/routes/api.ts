/**
 * MIJHAR - Express API Routes
 * Clean REST endpoints for authentication, verification, source transparency, and admin review.
 */

import { Router, Request, Response } from 'express';
import { db } from '../db/store.ts';
import { VERIFIED_HADITH_RECORDS, VERIFIED_QURAN_VERSES } from '../db/seedData.ts';
import { runVerificationPipeline } from '../verification/pipeline.ts';
import { generateChatResponseWithGemini } from '../gemini.ts';

export const apiRouter = Router();

// Helper to extract authenticated user
function getAuthUser(req: Request) {
  const userId = (req.headers['x-user-id'] as string) || 'user-demo-1';
  return db.getUserById(userId) || db.getUserById('user-demo-1');
}

// 1. Health check
apiRouter.get('/health', (_req: Request, res: Response) => {
  const sources = db.getSources();
  const configuredSources = sources.filter((s) => s.isConfigured).length;

  res.json({
    status: 'healthy',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    quranCorpusLoaded: true,
    quranAyatCount: VERIFIED_QURAN_VERSES.length,
    hadithCorpusLoaded: true,
    hadithRecordsCount: VERIFIED_HADITH_RECORDS.length,
    sourcesConfiguredCount: configuredSources,
    sourcesTotalCount: sources.length,
    uptimeSeconds: Math.floor(process.uptime()),
    engineVersion: '1.2.0-core',
  });
});

// 2. Authentication
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'غير مسجل الدخول' });
  }
  res.json({ user });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان.' });
  }

  const user = db.getUserByEmail(email);
  if (!user || !db.verifyPassword(email, password)) {
    return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
  }

  db.addAudit({
    userId: user.id,
    userEmail: user.email,
    action: 'login',
    entityType: 'auth',
    entityId: user.id,
  });

  res.json({ user, token: `token-${user.id}` });
});

apiRouter.post('/auth/signup', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'جميع الحقول مطلوبة.' });
  }
  if (db.getUserByEmail(email)) {
    return res.status(409).json({ error: 'البريد الإلكتروني مسجل مسبقاً.' });
  }

  const user = db.createUser(
    {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'user',
    },
    password
  );

  db.addAudit({
    userId: user.id,
    userEmail: user.email,
    action: 'signup',
    entityType: 'auth',
    entityId: user.id,
  });

  res.status(201).json({ user, token: `token-${user.id}` });
});

apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (user) {
    db.addAudit({
      userId: user.id,
      userEmail: user.email,
      action: 'logout',
      entityType: 'auth',
      entityId: user.id,
    });
  }
  res.json({ success: true });
});

// 3. Sources
apiRouter.get('/sources', (_req: Request, res: Response) => {
  res.json({ sources: db.getSources() });
});

apiRouter.post('/admin/sources', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'صلاحية مسؤول مطلوبة لتعديل المصادر.' });
  }

  const { sourceId, isConfigured } = req.body;
  if (!sourceId || typeof isConfigured !== 'boolean') {
    return res.status(400).json({ error: 'معرّف المصدر والحالة مطلوبان.' });
  }

  const ok = db.toggleSourceStatus(sourceId, isConfigured, user.id);
  if (!ok) {
    return res.status(404).json({ error: 'المصدر غير موجود.' });
  }

  res.json({ success: true, sources: db.getSources() });
});

// 4. Verification Workflow
apiRouter.post('/verify', async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const userId = user?.id || 'guest';

  const { text, language, contentType } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'النص المراد فحصه مطلوب.' });
  }

  try {
    const run = await runVerificationPipeline(
      {
        text,
        language: language || 'auto',
        contentType: contentType || 'article',
      },
      userId
    );
    res.json({ run });
  } catch (err: any) {
    console.error('Verification error:', err);
    res.status(400).json({ error: err.message || 'حدث خطأ أثناء معالجة الفحص.' });
  }
});

apiRouter.get('/verifications', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const runs = db.getVerificationRunsForUser(user?.id || 'user-demo-1');
  res.json({ runs });
});

apiRouter.get('/verifications/:id', (req: Request, res: Response) => {
  const run = db.getVerificationRun(req.params.id);
  if (!run) {
    return res.status(404).json({ error: 'تقرير الفحص غير موجود.' });
  }
  res.json({ run });
});

apiRouter.delete('/verifications/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const ok = db.deleteVerificationRun(req.params.id, user?.id || 'user-demo-1');
  if (!ok) {
    return res.status(404).json({ error: 'تعذر حذف التقرير أو عدم توفر الصلاحية.' });
  }
  res.json({ success: true });
});

apiRouter.delete('/verifications', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const count = db.clearUserHistory(user?.id || 'user-demo-1');
  res.json({ success: true, deletedCount: count });
});

// 5. Human Review & Flagging
apiRouter.post('/verifications/:id/flag', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { claimId, userNote } = req.body;

  if (!claimId) {
    return res.status(400).json({ error: 'معرّف الدعوى مطلوب.' });
  }

  const reviewItem = db.flagClaimForReview(
    req.params.id,
    claimId,
    userNote || 'إبلاغ المستخدم عن ملاحظة أو تفاوت محتمل',
    user?.id || 'guest'
  );

  if (!reviewItem) {
    return res.status(404).json({ error: 'الدعوى أو التقرير غير موجود.' });
  }

  res.json({ success: true, reviewItem });
});

apiRouter.get('/admin/reviews', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'reviewer' && user.role !== 'admin')) {
    return res.status(403).json({ error: 'صلاحية مراجع شرعي أو مسؤول مطلوبة.' });
  }

  res.json({ reviews: db.getPendingReviews() });
});

apiRouter.post('/admin/reviews', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || (user.role !== 'reviewer' && user.role !== 'admin')) {
    return res.status(403).json({ error: 'صلاحية مراجع شرعي أو مسؤول مطلوبة.' });
  }

  const { reviewId, decision, notes } = req.body;
  if (!reviewId || !decision || !notes) {
    return res.status(400).json({ error: 'معرف المراجعة، القرار، والملاحظات مطلوبة.' });
  }

  const ok = db.recordReviewerDecision(reviewId, user.id, decision, notes);
  if (!ok) {
    return res.status(400).json({ error: 'تعذر حفظ قرار المراجعة.' });
  }

  res.json({ success: true });
});

apiRouter.get('/admin/audits', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'صلاحية مسؤول مطلوبة لعرض سجل التدقيق.' });
  }

  res.json({ audits: db.getAuditEvents(50) });
});

// 6. Scientific AI Islamic Chat Assistant (Trained on Challenge Guidelines)
apiRouter.post('/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'نص السؤال مطلوب.' });
  }

  try {
    const chatResponse = await generateChatResponseWithGemini(message, history || []);
    res.json(chatResponse);
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({ error: 'حدث خطأ أثناء معالجة المحادثة الذكية.' });
  }
});

// 7. Team & Partner Data
apiRouter.get('/team', (_req: Request, res: Response) => {
  const teamMembers = [
    {
      id: 'member-1',
      name: 'عبدالعزيز لاحق المطيري',
      englishName: 'Abdulaziz Al-Mutairi',
      major: 'تقنية معلومات (Information Technology)',
      roleTitleAr: 'قائد الفريق ومدير المنتج التقني (IT Lead & Product Architect)',
      roleTitleEn: 'IT Lead & Technical Product Architect',
      challengeRoleCategory: 'technical_product_lead',
      responsibilitiesAr: [
        'قيادة وتنسيق الفريق والمواءمة الشاملة مع معايير تحدي باذل وسدايا',
        'إدارة متطلبات منصة مِجهر ومطابقة معايير الحزمة العلمية والمستويات الأربعة',
        'حوكمة الامتثال للميثاق الشرعي وضوابط الإحالة للإفتاء الرسمي وضمان جودة المنتج'
      ],
      avatarInitials: 'عم'
    },
    {
      id: 'member-2',
      name: 'مشاري العتيبي (العصيمي)',
      englishName: 'Mishari Al-Otaibi',
      major: 'علوم حاسب (Computer Science)',
      roleTitleAr: 'مهندس الذكاء الاصطناعي والنماذج اللغوية (Lead AI Engineer)',
      roleTitleEn: 'Lead AI Engineer & NLP Specialist',
      challengeRoleCategory: 'ai_engineer',
      responsibilitiesAr: [
        'تطوير وتوجيه نماذج الذكاء الاصطناعي (Gemini) لاستخراج وتصنيف الدعاوى بدقة',
        'هندسة الأوامر (Prompt Engineering) وفق الحزمة العلمية لفرز المستويات (أ/ب/ج/د)',
        'بناء أنظمة منع الهلوسة وحماية الأوامر من الاختراق وحصر الإجابات بالمصادر المعتمدة'
      ],
      avatarInitials: 'مع'
    },
    {
      id: 'member-3',
      name: 'اصيل سمير الحارثي',
      englishName: 'Aseel Al-Harthi',
      major: 'هندسة حاسب (Computer Engineering)',
      roleTitleAr: 'مهندس البرمجيات والنظم الكاملة (Lead Full-Stack & Systems Engineer)',
      roleTitleEn: 'Lead Full-Stack & Systems Engineer',
      challengeRoleCategory: 'frontend_app_dev',
      responsibilitiesAr: [
        'بناء وتطوير الهيكلية البرمجية الشاملة للمنصة (React + Node.js + Express)',
        'تطوير وتكامل خوارزميات محرك الفحص الإسنادي ذي الـ 12 مرحلة والمطابقة الحتمية',
        'بناء واجهات الربط البرمجي (APIs)، نظام التشفير الرقمي وتوليد شهادات الاعتماد'
      ],
      avatarInitials: 'اح'
    },
    {
      id: 'member-4',
      name: 'فهد تركي الخماش',
      englishName: 'Fahad Al-Khammash',
      major: 'تقنية معلومات (Information Technology)',
      roleTitleAr: 'مهندس واجهة وتجربة المستخدم والبيانات (Frontend, UX & Data Engineer)',
      roleTitleEn: 'Frontend, UX & Data Engineer',
      challengeRoleCategory: 'ux_designer',
      responsibilitiesAr: [
        'تصميم وتطوير الواجهات التفاعلية وتجربة المستخدم السلسة المتوافقة مع RTL/LTR',
        'هندسة وتدقيق قواعد البيانات الموثقة (مصحف مجمع الملك فهد، وصحيحي البخاري ومسلم)',
        'تطوير وثيقة وشهادة الفحص الرسمية (PDF) ولوحة الشفافية وإمكانية الوصول'
      ],
      avatarInitials: 'فخ'
    }
  ];

  res.json({
    team: teamMembers,
    partners: [
      {
        nameAr: 'مؤسسة باذل الأهلية للتعريف بالإسلام',
        nameEn: 'BATHL Foundation',
        roleAr: 'المؤسسة المنظمة للتحدي وصاحبة الحزمة العلمية والمرجعية الشرعية',
        badge: 'الجهة المنظمة'
      },
      {
        nameAr: 'الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا - SDAIA)',
        nameEn: 'Saudi Data & AI Authority',
        roleAr: 'الشريك الاستراتيجي لتمكين حلول الذكاء الاصطناعي المتقدمة بالمملكة',
        badge: 'شريك استراتيجي'
      },
      {
        nameAr: 'وزارة الاتصالات وتقنية المعلومات (MCIT)',
        nameEn: 'Ministry of Communications and Information Technology',
        roleAr: 'شريك التمكين الرقمي ودعم المبادرات التقنية الوطنية',
        badge: 'شريك التمكين'
      },
      {
        nameAr: 'آفاق المستقبل (Future Frontiers)',
        nameEn: 'Future Frontiers',
        roleAr: 'الشريك التطويري والتنفيذي للتحدي',
        badge: 'شريك تنفيذي'
      },
      {
        nameAr: 'التحول التقني (TTS.SA)',
        nameEn: 'Technical Transformation',
        roleAr: 'شريك الاستضافة والحلول السحابية التقنية',
        badge: 'شريك تقني'
      }
    ]
  });
});
