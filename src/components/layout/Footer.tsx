/**
 * MIJHAR - Footer Component
 */

import React from 'react';
import { Logo } from '../logo/Logo.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { ShieldCheck, BookOpen, ExternalLink, CheckCircle } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenLogoGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenLogoGuide }) => {
  const { t, isRtl } = useLanguage();

  return (
    <footer className="bg-[#082B23] text-white border-t border-[#0B3D2E] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Logo variant="horizontal" size="md" monochrome={false} className="text-white" />
            </div>
            <p className="text-sm text-[#C7A45B] font-arabic font-medium">
              «{t.tagline}»
            </p>
            <p className="text-xs text-white/70 leading-relaxed max-w-lg">
              {t.footerDisclaimer}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#147D64]/20 border border-[#147D64]/40 text-emerald-300 text-xs font-medium">
              <CheckCircle size={14} className="text-emerald-400" />
              <span>{t.systemOperational}</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C7A45B] mb-3">
              {isRtl ? 'أقسام المنصة' : 'Platform Navigation'}
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button
                  onClick={() => onSelectTab('workspace')}
                  className="hover:text-emerald-300 transition text-left rtl:text-right"
                >
                  {t.navVerify}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('dashboard')}
                  className="hover:text-emerald-300 transition text-left rtl:text-right"
                >
                  {t.navDashboard}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('sources')}
                  className="hover:text-emerald-300 transition text-left rtl:text-right"
                >
                  {t.navSources}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLogoGuide}
                  className="hover:text-emerald-300 transition text-left rtl:text-right"
                >
                  {t.logoGuide}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Ethical Boundaries */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C7A45B] mb-3">
              {isRtl ? 'الأمانة المنهجية' : 'Methodological Integrity'}
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>{isRtl ? 'لا اختلاق للمراجع الشرعية' : 'Zero fabricated citations'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <BookOpen size={14} className="text-emerald-400 shrink-0" />
                <span>{isRtl ? 'الرسم العثماني الموثق' : 'Canonical Uthmani script'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ExternalLink size={14} className="text-emerald-400 shrink-0" />
                <span>{isRtl ? 'إحالة الفتاوى لأهل الذكر' : 'Fatwa referral to scholars'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/60 gap-4">
          <p>© 2026 MIJHAR (مِجهر) - منصة التحقق من موثوقية المحتوى الإسلامي.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onSelectTab('sources')} className="hover:text-white transition">
              {t.navSources}
            </button>
            <span>•</span>
            <button onClick={() => onSelectTab('settings')} className="hover:text-white transition">
              {t.navSettings}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
