/**
 * MIJHAR - Public Landing Page
 * Hero with subtle Islamic geometric pattern, interactive demonstration sample,
 * 12-stage workflow breakdown, ethical principles, and FAQ.
 */

import React from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { Logo } from '../logo/Logo.tsx';
import {
  Shield,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Search,
  ExternalLink,
  ChevronDown,
  Layers,
  FileCheck,
} from 'lucide-react';

interface LandingPageProps {
  onStartVerification: () => void;
  onViewDemoReport: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartVerification,
  onViewDemoReport,
}) => {
  const { t, isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with Islamic Geometric Backdrop */}
      <section className="relative overflow-hidden bg-islamic-pattern text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 p-8 sm:p-12 lg:p-16 border border-[#147D64]/30 shadow-2xl">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#147D64]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C7A45B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#147D64]/30 border border-[#C7A45B]/40 text-[#C7A45B] text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#C7A45B] animate-pulse" />
            <span>{t.heroBadge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-arabic leading-tight">
            {t.heroTitle}
          </h1>

          {/* Arabic Tagline Quote */}
          <p className="text-xl sm:text-2xl text-[#C7A45B] font-arabic font-medium">
            «{t.tagline}»
          </p>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Trust Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
              <CheckCircle size={14} className="text-[#C7A45B]" />
              {t.heroTrustBadge1}
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
              <BookOpen size={14} className="text-[#147D64]" />
              {t.heroTrustBadge2}
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
              <Shield size={14} className="text-[#C7A45B]" />
              {t.heroTrustBadge3}
            </span>
          </div>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartVerification}
              className="w-full sm:w-auto px-8 py-4 min-h-[52px] bg-[#C7A45B] hover:bg-[#d8b56c] active:scale-[0.98] text-[#082B23] font-bold rounded-xl text-base shadow-lg shadow-[#C7A45B]/20 transition-all duration-150 flex items-center justify-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A45B] focus-visible:ring-offset-2 cursor-pointer"
            >
              <span>{t.heroCtaPrimary}</span>
              <ArrowIcon size={18} className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </button>

            <button
              onClick={onViewDemoReport}
              className="w-full sm:w-auto px-6 py-4 min-h-[52px] bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white font-medium rounded-xl text-sm border border-white/20 transition-all duration-150 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 cursor-pointer"
            >
              <FileCheck size={16} className="text-[#C7A45B]" />
              <span>{isRtl ? 'معاينة تقرير إسنادي نموذجي' : 'Inspect Sample Verification Report'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Demonstration Card - Labeled Demo Slice */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-[#E3E7DF] shadow-md p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E3E7DF] gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B3D2E] bg-[#147D64]/10 border border-[#147D64]/20 px-2.5 py-1 rounded-md">
                {isRtl ? 'نموذج توضيحي حي (Live Demonstration Slice)' : 'Live Demonstration Slice'}
              </span>
              <h2 className="text-lg font-bold text-[#082B23] mt-2 font-arabic">
                {isRtl
                  ? 'كيف يفصل مِجهر بين الاقتباس الصحيح، التفاوت اللفظي، والاستفتاء؟'
                  : 'How MIJHAR Distinguishes Supported Text, Typographical Mismatch, and Fatwa Referrals'}
              </h2>
            </div>
            <button
              onClick={onViewDemoReport}
              className="text-xs font-semibold text-[#147D64] hover:text-[#0B3D2E] active:scale-95 flex items-center gap-1.5 self-start sm:self-auto p-1.5 rounded-lg hover:bg-[#147D64]/10 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] cursor-pointer"
            >
              <span>{isRtl ? 'فتح التقرير الكامل' : 'Open Full Report'}</span>
              <ArrowIcon size={14} />
            </button>
          </div>

          {/* 3 mini cards previewing the 3 primary outcomes */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Supported Quote */}
            <div className="p-4 rounded-xl border border-[#147D64]/30 bg-[#147D64]/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#0B3D2E] mb-2">
                  <span>{t.cardClaimType_quran}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#147D64]/20 text-[#0B3D2E] text-[10px]">
                    {t.status_supported}
                  </span>
                </div>
                <p className="text-xs font-quran text-[#0B3D2E] leading-loose">
                  «يَا أَيُّهَا الَّذِينَ آمَنُوا إِن جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوا»
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#147D64]/20 text-[11px] text-[#0B3D2E]">
                <strong>{t.sourceLabel}</strong> سورة الحجرات: الآية 6 (مصحف المدينة)
              </div>
            </div>

            {/* Mismatch */}
            <div className="p-4 rounded-xl border border-[#C7A45B]/40 bg-[#C7A45B]/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#7A5B15] mb-2">
                  <span>{t.cardClaimType_quran}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#C7A45B]/30 text-[#7A5B15] text-[10px]">
                    {t.status_text_mismatch}
                  </span>
                </div>
                <p className="text-xs text-[#7A5B15] font-arabic">
                  النص الوارد: {`{وقضى ربك ألا تعبد...}`}
                </p>
                <div className="mt-1 text-[11px] text-[#8C6D23]">
                  <span className="line-through text-red-600">تعبد</span> ←{' '}
                  <span className="font-bold text-[#0B3D2E]">تَعْبُدُوا</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#C7A45B]/30 text-[11px] text-[#7A5B15]">
                <strong>{isRtl ? 'التنبيه:' : 'Diff:'}</strong> رصد تفاوت لفظي دقيق وتصويبه
              </div>
            </div>

            {/* Specialist Referral */}
            <div className="p-4 rounded-xl border border-[#0B3D2E]/25 bg-[#0B3D2E]/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#082B23] mb-2">
                  <span>{t.cardClaimType_personal}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#0B3D2E]/15 text-[#0B3D2E] text-[10px]">
                    {t.status_refer_to_specialist}
                  </span>
                </div>
                <p className="text-xs text-[#18231F] font-arabic">
                  «هل يجوز لي قصر الصلاة والجمع وأنا مسافر لمدة ستة أشهر؟»
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#0B3D2E]/20 text-[11px] text-[#082B23]">
                <strong>{isRtl ? 'القرار:' : 'Action:'}</strong> مِجهر ليس مفتياً؛ يُحال لهيئات الإفتاء
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Workflow Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#147D64]">
            {t.workflowTitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#082B23] font-arabic mt-1">
            {t.workflowSubtitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-[#E3E7DF] shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-[#0B3D2E]/10 border border-[#0B3D2E]/15 text-[#0B3D2E] flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="font-bold text-[#082B23] text-sm mb-2">{t.step1Title}</h3>
            <p className="text-xs text-[#66736C] leading-relaxed">{t.step1Desc}</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E3E7DF] shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-[#0B3D2E]/10 border border-[#0B3D2E]/15 text-[#0B3D2E] flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="font-bold text-[#082B23] text-sm mb-2">{t.step2Title}</h3>
            <p className="text-xs text-[#66736C] leading-relaxed">{t.step2Desc}</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E3E7DF] shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-[#0B3D2E]/10 border border-[#0B3D2E]/15 text-[#0B3D2E] flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="font-bold text-[#082B23] text-sm mb-2">{t.step3Title}</h3>
            <p className="text-xs text-[#66736C] leading-relaxed">{t.step3Desc}</p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-[#E3E7DF] shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-[#0B3D2E]/10 border border-[#0B3D2E]/15 text-[#0B3D2E] flex items-center justify-center font-bold text-lg mb-4">
              4
            </div>
            <h3 className="font-bold text-[#082B23] text-sm mb-2">{t.step4Title}</h3>
            <p className="text-xs text-[#66736C] leading-relaxed">{t.step4Desc}</p>
          </div>
        </div>
      </section>

      {/* Trust & Principles Section */}
      <section className="bg-[#0B3D2E] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C7A45B]">
              {t.principlesTitle}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-arabic mt-1">
              {isRtl ? 'الضوابط الشرعية والأمانة المنهجية' : 'Ethical Safeguards & Methodological Principles'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-base font-bold text-[#C7A45B] flex items-center gap-2 mb-2 font-arabic">
                <Shield size={18} />
                {t.principle1Title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {t.principle1Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-base font-bold text-[#C7A45B] flex items-center gap-2 mb-2 font-arabic">
                <BookOpen size={18} />
                {t.principle2Title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {t.principle2Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-base font-bold text-[#C7A45B] flex items-center gap-2 mb-2 font-arabic">
                <AlertTriangle size={18} />
                {t.principle3Title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {t.principle3Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-base font-bold text-[#C7A45B] flex items-center gap-2 mb-2 font-arabic">
                <CheckCircle size={18} />
                {t.principle4Title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {t.principle4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-[#082B23] font-arabic text-center mb-8">
          {isRtl ? 'الأسئلة الشائعة حول المنصة' : 'Frequently Asked Questions'}
        </h2>

        <div className="space-y-4">
          <div className="p-5 bg-white rounded-xl border border-[#E3E7DF]">
            <h3 className="font-bold text-sm text-[#082B23] font-arabic mb-2">
              {isRtl
                ? 'هل يعتبر مِجهر تطبيقاً للإفتاء أو إصدار الأحكام؟'
                : 'Does MIJHAR issue religious fatwas or judicial rulings?'}
            </h3>
            <p className="text-xs text-[#66736C] leading-relaxed">
              {isRtl
                ? 'قطعاً لا. مِجهر أداة تحقق إسنادي نصي بين كتابة المحتوى ونشره، وظيفتها عزو الآيات والأحاديث لمصادرها وتنبيه الكاتب للخطأ اللفظي. الأسئلة الشخصية والمسائل الاجتهادية تُحال للعلماء والمفتين المعتمدين.'
                : 'No. MIJHAR is strictly an evidence-first textual verification layer. It matches quotations against verified canonical datasets and refers all personal juristic questions to certified human authorities.'}
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-[#E3E7DF]">
            <h3 className="font-bold text-sm text-[#082B23] font-arabic mb-2">
              {isRtl
                ? 'إذا لم يجد مِجهر حديثاً، هل يعني ذلك أنه مكذوب؟'
                : 'If MIJHAR does not find a Hadith, does that mean it is fabricated?'}
            </h3>
            <p className="text-xs text-[#66736C] leading-relaxed">
              {isRtl
                ? 'لا. قاعدة المنصة الراسخة هي أن "العدم لا يعني الوضع". إذا لم يُعثر على الحديث فذلك يعني فقط أنه "غير موثق في المصادر المتاحة حالياً"، حيث لا يدعي النظام تغطية كل كتب التراث.'
                : 'Never. Absence from the indexed database merely means "unverified in available sources", reflecting the platform’s current indexing boundaries.'}
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-[#E3E7DF]">
            <h3 className="font-bold text-sm text-[#082B23] font-arabic mb-2">
              {isRtl
                ? 'ما هي الطبعة المعتمدة للمصحف الشريف في مِجهر؟'
                : 'Which edition of the Holy Quran is used for verification?'}
            </h3>
            <p className="text-xs text-[#66736C] leading-relaxed">
              {isRtl
                ? 'تعتمد المنصة طبعة مصحف المدينة النبوية برواية حفص عن عاصم، الصادرة عن مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة.'
                : 'MIJHAR verifies against the King Fahd Glorious Quran Printing Complex edition in the standard Hafs narration.'}
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={onStartVerification}
            className="px-8 py-3.5 min-h-[48px] bg-[#0B3D2E] hover:bg-[#147D64] active:scale-[0.98] text-white font-bold rounded-xl text-sm shadow-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-2 cursor-pointer"
          >
            {t.heroCtaPrimary}
          </button>
        </div>
      </section>
    </div>
  );
};
