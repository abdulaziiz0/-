/**
 * MIJHAR - Settings & Privacy Controls
 */

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { Globe, User as UserIcon, Shield, Trash2, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { t, locale, setLocale, isRtl } = useLanguage();
  const { user } = useAuth();
  const [deleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteHistory = async () => {
    if (!confirm(t.confirmClearHistory)) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/verifications', {
        method: 'DELETE',
        headers: { 'x-user-id': user?.id || 'guest' },
      });
      if (res.ok) {
        setDeleted(true);
        setTimeout(() => setDeleted(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#082B23] font-arabic">
          {t.settingsTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#66736C] mt-1">{t.settingsSubtitle}</p>
      </div>

      <div className="space-y-6">
        {/* 1. Language Setting */}
        <div className="bg-white rounded-2xl border border-[#E3E7DF] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0B3D2E]">
            <Globe size={18} className="text-[#147D64]" />
            <h3>{t.langSectionTitle}</h3>
          </div>
          <p className="text-xs text-[#66736C]">{t.langSectionDesc}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocale('ar')}
              className={`px-4 py-2.5 min-h-[40px] rounded-xl text-xs font-bold border transition-all duration-150 active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-2 ${
                locale === 'ar'
                  ? 'bg-[#0B3D2E] text-white border-[#0B3D2E] shadow-xs'
                  : 'bg-white border-[#E3E7DF] text-[#18231F] hover:bg-[#F7F4EC] hover:border-[#147D64]/50 hover:text-[#0B3D2E]'
              }`}
            >
              العربية (Default RTL)
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`px-4 py-2.5 min-h-[40px] rounded-xl text-xs font-bold border transition-all duration-150 active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-2 ${
                locale === 'en'
                  ? 'bg-[#0B3D2E] text-white border-[#0B3D2E] shadow-xs'
                  : 'bg-white border-[#E3E7DF] text-[#18231F] hover:bg-[#F7F4EC] hover:border-[#147D64]/50 hover:text-[#0B3D2E]'
              }`}
            >
              English (LTR)
            </button>
          </div>
        </div>

        {/* 2. Account Profile */}
        <div className="bg-white rounded-2xl border border-[#E3E7DF] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0B3D2E]">
            <UserIcon size={18} className="text-[#147D64]" />
            <h3>{t.accountSectionTitle}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#E3E7DF]">
              <span className="block text-[#66736C]">{t.accountName}</span>
              <span className="font-bold text-[#18231F] text-sm mt-0.5 block">
                {user?.name || 'مستخدم تجريبي'}
              </span>
            </div>
            <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#E3E7DF]">
              <span className="block text-[#66736C]">{t.accountEmail}</span>
              <span className="font-bold text-[#18231F] text-sm mt-0.5 block truncate">
                {user?.email || 'user@mijhar.org'}
              </span>
            </div>
            <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#E3E7DF]">
              <span className="block text-[#66736C]">{t.accountRole}</span>
              <span className="font-bold text-[#147D64] text-sm mt-0.5 block uppercase">
                {user?.role === 'admin'
                  ? t.roleAdmin
                  : user?.role === 'reviewer'
                  ? t.roleReviewer
                  : t.roleUser}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Privacy & Data Deletion */}
        <div className="bg-white rounded-2xl border border-[#E3E7DF] p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0B3D2E]">
            <Shield size={18} className="text-[#C7A45B]" />
            <h3>{t.privacySectionTitle}</h3>
          </div>
          <p className="text-xs text-[#66736C] leading-relaxed">{t.privacyDesc}</p>

          <div className="pt-2">
            <button
              onClick={handleDeleteHistory}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2.5 min-h-[40px] bg-red-50 hover:bg-red-100 hover:text-red-800 text-red-700 border border-red-200 rounded-xl text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-50"
            >
              <Trash2 size={15} />
              <span>{deleting ? '...' : t.btnDeleteAllData}</span>
            </button>
            {deleted && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-700 mt-2">
                <CheckCircle2 size={14} />
                {isRtl ? 'تم حذف كافة السجلات بنجاح.' : 'All data successfully cleared.'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
