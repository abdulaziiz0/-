/**
 * MIJHAR - Verification Workspace Component
 * High-focus input interface with word/char counters, content types, presets, and real verification execution.
 */

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { VerificationRun } from '../../types/index.ts';
import {
  Send,
  Loader2,
  Sparkles,
  FileText,
  AlertCircle,
  CheckCircle2,
  Copy,
  RotateCcw,
} from 'lucide-react';

interface WorkspaceProps {
  onVerificationComplete: (run: VerificationRun) => void;
  initialText?: string;
}

export const WorkspacePage: React.FC<WorkspaceProps> = ({
  onVerificationComplete,
  initialText = '',
}) => {
  const { t, isRtl } = useLanguage();
  const { user } = useAuth();

  const [text, setText] = useState(initialText);
  const [contentType, setContentType] = useState<VerificationRun['contentType']>('article');
  const [selectedLanguage, setSelectedLanguage] = useState<'auto' | 'ar' | 'en'>('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Demonstration Presets
  const samplePresets = [
    {
      id: 'comprehensive',
      title: t.sample1,
      text: `قال تعالى: {يَا أَيُّهَا الَّذِينَ آمَنُوا إِن جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوا}\nوروي أن النبي صلى الله عليه وسلم قال: «إنما الأعمال بالنيات وإنما لكل امرئ ما نوى»\nوكما قال الله: {وقضى ربك ألا تعبد إلا إياه وبالوالدين إحسانا}\nفهل يجوز لي قصر الصلاة والجمع وأنا مسافر لمدة ستة أشهر في بعثة دراسية؟`,
      type: 'article' as const,
    },
    {
      id: 'mismatch',
      title: t.sample2,
      text: `قال الله تعالى في محكم التنزيل: {وقضى ربك ألا تعبد إلا إياه وبالوالدين إحسانا إما يبلغن عندك الكبر أحدهما أو كلاهما فلا تقل لهما أف}`,
      type: 'social_post' as const,
    },
    {
      id: 'specialist',
      title: t.sample3,
      text: `ما حكم صيام الست من شوال قبل قضاء ما عليّ من أيام رمضان لعذر المرض، وهل أؤجر إن أخرت القضاء إلى شعبان؟ أفتوني مأجورين.`,
      type: 'other' as const,
    },
    {
      id: 'hadith',
      title: t.sample4,
      text: `عن أنس بن مالك رضي الله عنه عن النبي صلى الله عليه وسلم قال: «لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه» متفق عليه.`,
      type: 'educational' as const,
    },
  ];

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setErrorMessage(isRtl ? 'الرجاء كتابة أو لصق النص أولاً.' : 'Please enter text first.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'guest',
        },
        body: JSON.stringify({
          text,
          contentType,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'فشل الفحص الإسنادي.');
      }

      const data = await response.json();
      if (data.run) {
        onVerificationComplete(data.run);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'حدث خطأ في الاتصال بالخادم.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPreset = (presetText: string, type: VerificationRun['contentType']) => {
    setText(presetText);
    setContentType(type);
    setErrorMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#082B23] font-arabic">
          {t.workspaceTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#66736C] mt-1">{t.workspaceSubtitle}</p>
      </div>

      {/* Preset selector pill buttons */}
      <div className="mb-6 p-4 bg-white rounded-2xl border border-[#E3E7DF] shadow-2xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#0B3D2E]">
          <Sparkles size={14} className="text-[#C7A45B]" />
          <span>{t.sampleSelector}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {samplePresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset.text, preset.type)}
              className="text-xs px-3.5 py-2 min-h-[38px] rounded-xl border border-[#E3E7DF] hover:border-[#147D64] hover:bg-[#F7F4EC] hover:text-[#0B3D2E] active:scale-[0.98] text-[#18231F] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] cursor-pointer text-left rtl:text-right"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E3E7DF] shadow-md p-5 sm:p-7 space-y-5">
        {/* Controls row: Content Type & Language override */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E3E7DF] text-xs">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-[#18231F]">{t.contentTypeLabel}</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as any)}
              className="px-2.5 py-1.5 bg-[#F7F4EC] border border-[#E3E7DF] rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#147D64] focus:outline-none"
            >
              <option value="article">{t.typeArticle}</option>
              <option value="social_post">{t.typeSocial}</option>
              <option value="sermon_draft">{t.typeSermon}</option>
              <option value="educational">{t.typeEducational}</option>
              <option value="ai_generated">{t.typeAiGenerated}</option>
              <option value="other">{t.typeOther}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#66736C]">{isRtl ? 'لغة النص:' : 'Text Language:'}</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as any)}
              className="px-2 py-1 bg-white border border-[#E3E7DF] rounded-lg text-xs text-[#18231F]"
            >
              <option value="auto">{isRtl ? 'كشف تلقائي' : 'Auto Detect'}</option>
              <option value="ar">العربية (Arabic)</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            rows={9}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full p-4 text-sm sm:text-base border border-[#E3E7DF] rounded-xl focus:ring-2 focus:ring-[#147D64] focus:border-[#147D64] focus:outline-none leading-relaxed font-arabic placeholder:text-gray-400 bg-white"
            disabled={isLoading}
          />

          {/* Quick Clear Button */}
          {text.length > 0 && !isLoading && (
            <button
              type="button"
              onClick={() => setText('')}
              className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center text-[#66736C] hover:text-[#0B3D2E] hover:bg-[#F7F4EC] active:scale-90 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] cursor-pointer bg-white/90 shadow-2xs border border-[#E3E7DF]/60"
              title="Clear text"
              aria-label="Clear text"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>

        {/* Counters and limits */}
        <div className="flex items-center justify-between text-xs text-[#66736C]">
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-[#18231F]">{charCount}</strong> {t.charCount}
            </span>
            <span>•</span>
            <span>
              <strong className="text-[#18231F]">{wordCount}</strong> {t.wordCount}
            </span>
          </div>
          <span className="text-[11px] text-gray-400">
            {isRtl ? 'الحد الأقصى: 50,000 حرف' : 'Max: 50,000 chars'}
          </span>
        </div>

        {/* Error notice */}
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 animate-in fade-in">
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || charCount === 0}
            className="w-full py-3.5 px-6 min-h-[50px] bg-[#0B3D2E] hover:bg-[#147D64] active:bg-[#082B23] active:scale-[0.98] text-white font-bold rounded-xl text-base shadow-md shadow-[#0B3D2E]/15 transition-all duration-150 flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin text-[#C7A45B]" />
                <span>{t.btnSubmitting}</span>
              </>
            ) : (
              <>
                <Send size={18} className="text-[#C7A45B]" />
                <span>{t.btnSubmit}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
