/**
 * MIJHAR - Logo Usage & Brand Identity Guidelines Modal
 */

import React from 'react';
import { Logo, MijharIconSvg } from './Logo.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { X, CheckCircle, AlertTriangle, Palette } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoUsageGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { isRtl } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-[#E3E7DF] p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E3E7DF]">
          <div>
            <h2 className="text-xl font-bold text-[#082B23] font-arabic">
              {isRtl ? 'دليل استخدام شعار وهوية مِجهر' : 'MIJHAR Brand & Logo Usage Guide'}
            </h2>
            <p className="text-xs text-[#66736C]">
              {isRtl
                ? 'فلسفة التصميم، الألوان المعتمدة، وضوابط القياس والمساحات الحرة'
                : 'Design philosophy, color system, spacing rules, and minimum dimensions'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Concept Showcase */}
        <div className="mt-6 space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-[#0B3D2E] uppercase tracking-wider mb-3">
              {isRtl ? 'فلسفة الشعار' : 'Logo Concept'}
            </h3>
            <p className="text-sm text-[#18231F] leading-relaxed">
              {isRtl
                ? 'يجمع شعار مِجهر بين عدسة الفحص والتدقيق التي ترمز إلى الاستدلال، ونجمة إسلامية ثمانية هندسية معاصرة ترمز إلى الانضباط المنهجي والجماليات الإسلامية الهادئة دون بهرجة أو زخارف مستهلكة.'
                : 'The MIJHAR mark merges an inspection lens symbolizing evidence with a contemporary eight-point Islamic star symbolizing methodological discipline and serene aesthetics without clichéd tropes.'}
            </p>
          </div>

          {/* Variants Grid */}
          <div>
            <h3 className="text-sm font-semibold text-[#0B3D2E] uppercase tracking-wider mb-3">
              {isRtl ? 'النماذج المعتمدة للشعار' : 'Official Lockup Variants'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#F7F4EC] rounded-xl border border-[#E3E7DF] flex flex-col items-center justify-center gap-2 text-center">
                <Logo variant="horizontal" size="md" />
                <span className="text-xs text-[#66736C] mt-2">
                  {isRtl ? 'النموذج الأفقي الرئيسي (عربي + إنجليزي)' : 'Primary Horizontal Lockup'}
                </span>
              </div>
              <div className="p-4 bg-[#F7F4EC] rounded-xl border border-[#E3E7DF] flex flex-col items-center justify-center gap-2 text-center">
                <Logo variant="arabic-only" size="md" />
                <span className="text-xs text-[#66736C] mt-2">
                  {isRtl ? 'النموذج العربي المخصص' : 'Arabic Lockup'}
                </span>
              </div>
              <div className="p-4 bg-[#082B23] text-white rounded-xl border border-[#0B3D2E] flex flex-col items-center justify-center gap-2 text-center">
                <div className="flex items-center gap-3">
                  <MijharIconSvg size={36} monochrome />
                  <span className="text-2xl font-bold font-arabic">مِجهر</span>
                </div>
                <span className="text-xs text-white/70 mt-2">
                  {isRtl ? 'النموذج الأحادي على خلفيات داكنة' : 'Monochrome on Dark Backgrounds'}
                </span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#E3E7DF] flex flex-col items-center justify-center gap-2 text-center">
                <MijharIconSvg size={44} />
                <span className="text-xs text-[#66736C] mt-2">
                  {isRtl ? 'الأيقونة المنفردة (أيقونة التطبيق والمفضلة)' : 'Standalone App / Favicon Mark'}
                </span>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <h3 className="text-sm font-semibold text-[#0B3D2E] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Palette size={16} />
              {isRtl ? 'لوحة الألوان الرسمية' : 'Official Color System'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-[#E3E7DF] bg-[#0B3D2E] text-white text-xs">
                <div className="font-bold">Deep Emerald</div>
                <div className="font-mono text-[11px] opacity-80">#0B3D2E</div>
              </div>
              <div className="p-3 rounded-lg border border-[#E3E7DF] bg-[#082B23] text-white text-xs">
                <div className="font-bold">Dark Forest</div>
                <div className="font-mono text-[11px] opacity-80">#082B23</div>
              </div>
              <div className="p-3 rounded-lg border border-[#E3E7DF] bg-[#147D64] text-white text-xs">
                <div className="font-bold">Islamic Jade</div>
                <div className="font-mono text-[11px] opacity-80">#147D64</div>
              </div>
              <div className="p-3 rounded-lg border border-[#E3E7DF] bg-[#C7A45B] text-[#082B23] text-xs">
                <div className="font-bold">Muted Gold</div>
                <div className="font-mono text-[11px] opacity-80">#C7A45B</div>
              </div>
            </div>
          </div>

          {/* Rules: Do & Don't */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2 mb-2">
                <CheckCircle size={16} />
                {isRtl ? 'إرشادات الاستخدام الموصى بها' : 'Usage Guidelines'}
              </h4>
              <ul className="text-xs text-emerald-800 space-y-1.5 list-disc list-inside">
                <li>{isRtl ? 'الحفاظ على المساحة الحرة بمقدار نصف قطر العدسة حول الشعار.' : 'Maintain clear space equal to 50% of the lens diameter.'}</li>
                <li>{isRtl ? 'الحد الأدنى لارتفاع الأيقونة في الشاشات الرقمية 24 بكسل.' : 'Minimum icon height on digital displays is 24px.'}</li>
                <li>{isRtl ? 'استخدام خط IBM Plex Sans Arabic مع الشعار العربي.' : 'Use IBM Plex Sans Arabic for accompanying typography.'}</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-2">
                <AlertTriangle size={16} />
                {isRtl ? 'محظورات التصميم' : 'Avoidances'}
              </h4>
              <ul className="text-xs text-amber-800 space-y-1.5 list-disc list-inside">
                <li>{isRtl ? 'تجنب مطّ الشعار أو تغيير نسبة العرض إلى الارتفاع.' : 'Never distort aspect ratio or stretch the mark.'}</li>
                <li>{isRtl ? 'تجنب وضع الشعار على خلفيات صور مشتتة أو زخارف مزدحمة.' : 'Never place the logo over busy photographic backgrounds.'}</li>
                <li>{isRtl ? 'عدم استبدال النجمة الثمانية برموز مساجد نمطية.' : 'Do not replace the 8-point geometric star with generic clipart.'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#E3E7DF] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0B3D2E] text-white rounded-lg text-sm font-medium hover:bg-[#147D64] transition"
          >
            {isRtl ? 'فهمت ذلك' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
