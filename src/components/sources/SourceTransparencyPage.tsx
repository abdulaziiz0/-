/**
 * MIJHAR - Source Transparency & Corpus Coverage Page
 * Full disclosure of indexed vs planned canonical databases, publishers, and licensing.
 */

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { EvidenceSource } from '../../types/index.ts';
import { Database, CheckCircle, Clock, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';

export const SourceTransparencyPage: React.FC = () => {
  const { t, isRtl } = useLanguage();
  const [sources, setSources] = useState<EvidenceSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sources')
      .then((res) => (res.ok ? res.json() : { sources: [] }))
      .then((data) => setSources(data.sources || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#082B23] font-arabic">
          {t.sourcesPageTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#66736C] mt-1">{t.sourcesPageSubtitle}</p>
      </div>

      {/* Critical Limitation Banner */}
      <div className="p-4 sm:p-5 bg-[#C7A45B]/15 border border-[#C7A45B]/35 rounded-2xl flex items-start gap-3">
        <AlertTriangle size={20} className="text-[#8C6D23] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-[#082B23] leading-relaxed">
          <strong className="block text-sm font-arabic font-bold text-[#082B23]">
            {isRtl ? 'بيان الشفافية وحدود التغطية المنهجية' : 'Methodological Transparency & Scope Notice'}
          </strong>
          <p>{t.sourceLimitationsAlert}</p>
        </div>
      </div>

      {/* Sources Grid/Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sources.map((src) => (
          <div
            key={src.id}
            className={`p-6 rounded-2xl border transition flex flex-col justify-between space-y-4 ${
              src.isConfigured
                ? 'bg-white border-[#E3E7DF] shadow-xs'
                : 'bg-white/70 border-dashed border-[#E3E7DF] opacity-80'
            }`}
          >
            <div className="space-y-3">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    src.isConfigured
                      ? 'bg-[#147D64]/10 text-[#0B3D2E] border-[#147D64]/25'
                      : 'bg-[#C7A45B]/15 text-[#8C6D23] border-[#C7A45B]/30'
                  }`}
                >
                  {src.isConfigured ? <CheckCircle size={14} /> : <Clock size={14} />}
                  <span>{src.isConfigured ? t.configuredBadge : t.unconfiguredBadge}</span>
                </span>

                <span className="text-[11px] font-mono text-gray-400">
                  {src.type}
                </span>
              </div>

              {/* Source Name */}
              <div>
                <h3 className="text-base font-bold text-[#082B23] font-arabic">
                  {isRtl ? src.nameAr : src.nameEn}
                </h3>
                <p className="text-xs text-[#147D64] font-medium mt-0.5">
                  {isRtl ? src.publisherAr : src.publisherEn}
                </p>
              </div>

              {/* Coverage and Edition */}
              <div className="text-xs space-y-1.5 pt-2 border-t border-[#E3E7DF] text-[#18231F]">
                <div>
                  <strong className="text-[#66736C]">{t.colCoverage}:</strong> {src.coverage}
                </div>
                <div>
                  <strong className="text-[#66736C]">{t.colVersion}:</strong> {src.version}
                </div>
                <div>
                  <strong className="text-[#66736C]">{t.colLicense}:</strong>{' '}
                  <span className="text-gray-600">
                    {isRtl ? src.licenseNoteAr : src.licenseNoteEn}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="pt-3 border-t border-[#E3E7DF] flex items-center justify-between text-[11px] text-gray-400">
              <span>{isRtl ? `آخر تحديث: ${src.lastUpdated}` : `Updated: ${src.lastUpdated}`}</span>
              {src.recordsCount && (
                <span>
                  {src.recordsCount.toLocaleString()} {isRtl ? 'سجل مفهرس' : 'records'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
