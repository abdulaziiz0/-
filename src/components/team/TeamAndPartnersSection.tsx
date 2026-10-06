import React from 'react';
import {
  Users,
  ShieldCheck,
  Award,
  Sparkles,
  FileCode2,
  BookOpen,
  Layout,
  ExternalLink,
  Building2,
  CheckCircle2,
  Compass,
  Layers,
} from 'lucide-react';

interface TeamAndPartnersSectionProps {
  lang: 'ar' | 'en';
  onOpenPRD?: () => void;
}

export const TeamAndPartnersSection: React.FC<TeamAndPartnersSectionProps> = ({
  lang,
  onOpenPRD,
}) => {
  const isAr = lang === 'ar';

  const teamMembers = [
    {
      name: isAr ? 'عبدالعزيز لاحق المطيري' : 'Abdulaziz Al-Mutairi',
      role: isAr
        ? 'قائد الفريق ومدير المنتج التقني'
        : 'IT Lead & Technical Product Architect',
      category: isAr ? 'قيادة المشروع وإدارة المنتج' : 'Product Leadership & Architecture',
      major: isAr ? 'تقنية معلومات (Information Technology)' : 'Information Technology (IT)',
      icon: <FileCode2 className="w-5 h-5 text-[#0B3D2E]" />,
      tagColor: 'bg-[#0B3D2E]/10 text-[#0B3D2E] border-[#0B3D2E]/20',
      initials: 'عم',
      responsibilities: isAr
        ? [
            'القيادة الشاملة والتنسيق الفني، ومواءمة مخرجات المنصة 100% مع معايير تحدي باذل وسدايا.',
            'إدارة متطلبات المنتج وهندسة تدفق الفحص وفق مستويات الحزمة العلمية الأربعة (أ، ب، ج، د).',
            'حوكمة الميثاق الشرعي وضوابط الإحالة الإلزامية لدور الإفتاء وضمان جودة النظام.',
          ]
        : [
            'Overall team leadership and 100% technical alignment with challenge standards.',
            'Product management & workflow architecture adhering to 4-tier scientific guidelines.',
            'Governance of non-fatwa compliance, official referrals, and QA assurance.',
          ],
    },
    {
      name: isAr ? 'مشاري العتيبي (العصيمي)' : 'Mishari Al-Otaibi',
      role: isAr ? 'مهندس الذكاء الاصطناعي والنماذج اللغوية' : 'Lead AI Engineer & NLP Specialist',
      category: isAr ? 'هندسة الذكاء الاصطناعي' : 'AI & NLP Engineering',
      major: isAr ? 'علوم حاسب (Computer Science)' : 'Computer Science (CS)',
      icon: <Sparkles className="w-5 h-5 text-[#147D64]" />,
      tagColor: 'bg-[#147D64]/10 text-[#147D64] border-[#147D64]/20',
      initials: 'مع',
      responsibilities: isAr
        ? [
            'بناء وتوجيه نماذج استخراج الدعاوى الدينية وتصنيفها لنوعها الشرعي بدقة متناهية.',
            'هندسة الأوامر (Prompt Engineering) الصارمة وفق الحزمة العلمية لتحدي التعريف بالإسلام.',
            'تطوير آليات منع الهلوسة وحماية الأوامر من الاختراق وحصر الإجابات بالمصادر المعتمدة.',
          ]
        : [
            'Engineering claim extraction models and religious classification via Gemini.',
            'Prompt engineering adhering to the challenge 4-tier scientific response rubric.',
            'Implementing anti-hallucination guardrails and verified corpus grounding.',
          ],
    },
    {
      name: isAr ? 'اصيل سمير الحارثي' : 'Aseel Al-Harthi',
      role: isAr ? 'مهندس البرمجيات والنظم الكاملة' : 'Lead Full-Stack & Systems Engineer',
      category: isAr ? 'تطوير البرمجيات والنظم' : 'Full-Stack Software Engineering',
      major: isAr ? 'هندسة حاسب (Computer Engineering)' : 'Computer Engineering',
      icon: <Layers className="w-5 h-5 text-[#082B23]" />,
      tagColor: 'bg-[#082B23]/10 text-[#082B23] border-[#082B23]/20',
      initials: 'اح',
      responsibilities: isAr
        ? [
            'بناء الهيكلية البرمجية الموزعة والشاملة للمنصة (React 19 + Node.js + Express).',
            'تطوير خوارزميات محرك الفحص الإسنادي ذي الـ 12 مرحلة والمطابقة الحتمية للنصوص.',
            'تكامل واجهات برمجة التطبيقات (REST APIs)، ونظام التجزئة الرقمية المشفرة (SHA-256).',
          ]
        : [
            'Building distributed full-stack architecture (React 19 + Node.js + Express).',
            'Developing the 12-stage deterministic verification engine algorithms.',
            'REST API endpoints integration and cryptographic SHA-256 certificate security.',
          ],
    },
    {
      name: isAr ? 'فهد تركي الخماش' : 'Fahad Al-Khammash',
      role: isAr ? 'مهندس واجهة وتجربة المستخدم والبيانات' : 'Frontend, UX & Data Engineer',
      category: isAr ? 'واجهة وتجربة المستخدم وهندسة البيانات' : 'Frontend, UX & Data Engineering',
      major: isAr ? 'تقنية معلومات (Information Technology)' : 'Information Technology (IT)',
      icon: <Layout className="w-5 h-5 text-[#C7A45B]" />,
      tagColor: 'bg-[#C7A45B]/15 text-[#8C6D23] border-[#C7A45B]/30',
      initials: 'فخ',
      responsibilities: isAr
        ? [
            'تصميم وتطوير الواجهات التفاعلية وتجربة المستخدم الحديثة المتوافقة مع RTL/LTR.',
            'هندسة وربط قواعد البيانات الشرعية الموثقة (مصحف المدينة، الصحاح، الدرر السنية).',
            'تطوير وثيقة وشهادة الفحص الرسمية القابلة للطباعة والتصدير كـ PDF ولوحة الشفافية.',
          ]
        : [
            'Designing intuitive, accessible user flows supporting RTL/LTR and WCAG AAA.',
            'Indexing and structuring verified corpora (King Fahd Complex, Sahih Bukhari & Muslim).',
            'Building printable official verification certificates and transparency dashboard.',
          ],
    },
  ];

  const partners = [
    {
      nameAr: 'مؤسسة باذل الأهلية للتعريف بالإسلام',
      nameEn: 'BATHL Foundation',
      roleAr: 'المؤسسة المنظمة للتحدي والمرجعية الإشرافية للحزمة العلمية',
      roleEn: 'Organizing Foundation & Scientific Package Authority',
      badge: isAr ? 'الجهة المنظمة' : 'Organizing Entity',
      badgeColor: 'bg-[#0B3D2E] text-white',
    },
    {
      nameAr: 'الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا - SDAIA)',
      nameEn: 'Saudi Data & AI Authority (SDAIA)',
      roleAr: 'الشريك الاستراتيجي لتمكين وتطوير حلول الذكاء الاصطناعي الوطنية',
      roleEn: 'Strategic National AI Partner',
      badge: isAr ? 'شريك استراتيجي' : 'Strategic Partner',
      badgeColor: 'bg-[#147D64] text-white',
    },
    {
      nameAr: 'وزارة الاتصالات وتقنية المعلومات (MCIT)',
      nameEn: 'Ministry of Communications and Information Technology',
      roleAr: 'شريك التمكين الرقمي ودعم المبادرات الابتكارية لخدمة المحتوى الرقمي',
      roleEn: 'Digital Enablement Partner',
      badge: isAr ? 'شريك التمكين' : 'Enablement Partner',
      badgeColor: 'bg-[#082B23] text-white',
    },
    {
      nameAr: 'آفاق المستقبل (Future Frontiers)',
      nameEn: 'Future Frontiers',
      roleAr: 'الشريك التنفيذي والتطويري لمسارات الابتكار وحاضنات التحدي',
      roleEn: 'Development & Executive Partner',
      badge: isAr ? 'شريك تنفيذي' : 'Executive Partner',
      badgeColor: 'bg-[#C7A45B] text-[#082B23]',
    },
    {
      nameAr: 'التحول التقني (TTS.SA)',
      nameEn: 'Technical Transformation (TTS.SA)',
      roleAr: 'شريك الاستضافة والحلول السحابية والبنية الرقمية',
      roleEn: 'Cloud Infrastructure Partner',
      badge: isAr ? 'شريك تقني' : 'Technical Partner',
      badgeColor: 'bg-[#0B3D2E] text-white',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Track & Challenge Header Badge */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#147D64]/10 border border-[#147D64]/20 text-[#0B3D2E] text-xs font-bold mb-4 shadow-xs">
          <Compass className="w-4 h-4 text-[#147D64]" />
          <span>
            {isAr
              ? 'تحدي الذكاء الاصطناعي في التعريف بالإسلام • مسار 04: أدوات المعرفة والتحقق'
              : 'AI Challenge for Introducing Islam • Track 04: Knowledge & Verification Tools'}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#0B3D2E] tracking-tight">
          {isAr ? 'فريق العمل والجهات الشريكة في التحدي' : 'Team Members & Official Partners'}
        </h2>
        <p className="mt-3 text-sm text-[#5A6B63] leading-relaxed">
          {isAr
            ? 'تم بناء منصة مِجهر بكفاءات وطنية متكاملة تجمع بين هندسة البرمجيات، الذكاء الاصطناعي، العلوم الشرعية، وتصميم تجربة المستخدم لتحقيق أعلى درجات الموثوقية.'
            : 'MIJHAR is engineered by a multidisciplinary team combining software architecture, AI engineering, Islamic scholarly rigor, and UX design.'}
        </p>

        {/* PRD & Documentation Link Banner */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onOpenPRD && (
            <button
              onClick={onOpenPRD}
              className="px-4 py-2 bg-[#0B3D2E] hover:bg-[#082B23] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileCode2 className="w-4 h-4 text-[#C7A45B]" />
              <span>{isAr ? 'عرض وثيقة متطلبات المنتج (PRD)' : 'View Full PRD Document'}</span>
            </button>
          )}
          <span className="text-xs text-[#5A6B63] bg-white px-3.5 py-1.5 rounded-xl border border-[#E3E7DF] shadow-2xs font-medium">
            {isAr ? 'مطابقة متطلبات التحدي: 100%' : 'Challenge Compliance: 100%'}
          </span>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 border border-[#E3E7DF] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Member Avatar / Initial */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B3D2E] to-[#147D64] text-white flex items-center justify-center font-black text-xl shadow-xs border-2 border-[#C7A45B]/50">
                  {member.initials}
                </div>
                <div className="p-2.5 bg-[#F7F4EC] rounded-xl border border-[#E3E7DF] text-[#147D64]">
                  {member.icon}
                </div>
              </div>

              {/* Title & Role */}
              <h3 className="font-bold text-base text-[#18231F] mb-1">
                {member.name}
              </h3>
              <p className="text-xs font-semibold text-[#147D64] mb-2 leading-snug">
                {member.role}
              </p>

              <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md border mb-3 ${member.tagColor}`}>
                {member.category}
              </span>

              <p className="text-[11px] text-[#5A6B63] mb-4 font-mono font-medium">
                {member.major}
              </p>

              {/* Responsibilities */}
              <div className="space-y-2 border-t border-[#E3E7DF] pt-3">
                <span className="text-[11px] font-bold text-[#0B3D2E] block mb-1">
                  {isAr ? 'المهام في التحدي:' : 'Challenge Scope:'}
                </span>
                {member.responsibilities.map((resp, rIdx) => (
                  <div key={rIdx} className="flex items-start gap-1.5 text-xs text-[#5A6B63] leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#147D64] shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Official Challenge Entities & Partners */}
      <div className="bg-[#EFECE3]/70 rounded-3xl p-6 sm:p-10 border border-[#E3E7DF] shadow-2xs">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#147D64] uppercase tracking-wider mb-2 bg-white px-3 py-1 rounded-full border border-[#E3E7DF]">
            <Building2 className="w-4 h-4 text-[#C7A45B]" />
            <span>{isAr ? 'الرعاية والشراكات المؤسسية' : 'Institutional Partnerships'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#0B3D2E]">
            {isAr ? 'الجهات الراعية والممكنة للتحدي' : 'Official Challenge Sponsoring Bodies'}
          </h3>
          <p className="text-xs text-[#5A6B63] mt-1 font-medium">
            {isAr
              ? 'تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي والتعريف به'
              : 'AI Challenge in Service of Introducing Islam'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((partner, pIdx) => (
            <div
              key={pIdx}
              className="bg-white p-5 rounded-2xl border border-[#E3E7DF] shadow-xs flex flex-col justify-between hover:border-[#147D64]/50 transition-colors"
            >
              <div>
                <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-3 ${partner.badgeColor}`}>
                  {partner.badge}
                </span>
                <h4 className="font-bold text-sm text-[#0B3D2E] mb-1.5 leading-snug">
                  {isAr ? partner.nameAr : partner.nameEn}
                </h4>
                <p className="text-xs text-[#5A6B63] leading-relaxed">
                  {isAr ? partner.roleAr : partner.roleEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
