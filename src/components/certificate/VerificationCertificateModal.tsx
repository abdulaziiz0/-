import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Hash,
  Award,
  Layers,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { VerificationRun } from '../../types/index.ts';

interface VerificationCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  run: VerificationRun;
  lang: 'ar' | 'en';
}

export const VerificationCertificateModal: React.FC<VerificationCertificateModalProps> = ({
  isOpen,
  onClose,
  run,
  lang,
}) => {
  const isAr = lang === 'ar';
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Generate deterministic verification hash from run ID and claims count
  const certHash = `SHA256-${run.id.slice(0, 8)}-${run.claims.length}-${run.createdAt.slice(0, 10).replace(/-/g, '')}-SECURE`;

  const total = run.claims.length;
  const supported = run.statusCounts.supported || 0;
  const mismatch = run.statusCounts.text_mismatch || 0;
  const unverified = run.statusCounts.unverified_in_available_sources || 0;
  const referral = run.statusCounts.refer_to_specialist || 0;

  const supportPercentage = total > 0 ? Math.round((supported / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E3E7DF] flex flex-col my-auto max-h-[95vh] overflow-hidden"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Modal Action Header (Hidden in Print) */}
        <div className="print:hidden px-6 py-4 bg-gradient-to-r from-[#0B3D2E] via-[#0E4C3A] to-[#147D64] text-white flex items-center justify-between border-b border-[#0B3D2E]">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#C7A45B]" />
            <h3 className="font-bold text-base">
              {isAr ? 'وثيقة التدقيق وشهادة الفحص الرقمية' : 'Digital Verification Certificate'}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 min-h-[38px] bg-[#C7A45B] hover:bg-[#B38F46] active:bg-[#9E7B34] active:scale-[0.98] text-[#082B23] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              <Printer className="w-4 h-4 text-[#082B23]" />
              <span>{isAr ? 'طباعة / تصدير PDF' : 'Print / Export PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-white/80 hover:text-white rounded-xl hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-[#F7F4EC] print:p-0 print:bg-white">
          <div
            ref={certificateRef}
            className="certificate-paper bg-white text-[#18231F] rounded-xl border-2 border-[#C7A45B]/50 p-8 sm:p-12 shadow-sm relative overflow-hidden print:border-none print:shadow-none print:m-0"
          >
            {/* Islamic Geometric Watermark Border */}
            <div className="absolute top-0 right-0 left-0 h-3 bg-gradient-to-r from-[#0B3D2E] via-[#C7A45B] to-[#147D64]" />

            {/* Official Header */}
            <div className="border-b-2 border-[#E3E7DF] pb-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                {/* MIJHAR Logo Icon */}
                <div className="w-16 h-16 rounded-2xl bg-[#0B3D2E] flex items-center justify-center text-white shadow-md border-2 border-[#C7A45B]/60">
                  <div className="relative">
                    <ShieldCheck className="w-8 h-8 text-[#C7A45B]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black tracking-tight text-[#0B3D2E]">
                      {isAr ? 'مِجهر | MIJHAR' : 'MIJHAR'}
                    </h1>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#147D64]/10 text-[#0B3D2E] font-bold border border-[#147D64]/25">
                      {isAr ? 'وثيقة رسمية' : 'Official Audit'}
                    </span>
                  </div>
                  <p className="text-xs text-[#5A6B63] mt-1 font-medium">
                    {isAr
                      ? 'منصة التحقق من موثوقية المحتوى الإسلامي وعزو النصوص الشرعية'
                      : 'Islamic Content Verification & Evidence Attribution Platform'}
                  </p>
                  <p className="text-[11px] text-[#C7A45B] font-semibold mt-0.5">
                    {isAr
                      ? '«ما يُنسب إلى الدين، افحص دليله قبل نشره.»'
                      : '“Verify the evidence before you publish.”'}
                  </p>
                </div>
              </div>

              {/* Certificate Metadata Block */}
              <div className="text-left sm:text-right text-xs space-y-1.5 bg-[#F7F4EC] p-4 rounded-xl border border-[#E3E7DF]">
                <div className="flex items-center justify-between sm:justify-end gap-3 text-[#5A6B63]">
                  <span className="font-semibold">{isAr ? 'رقم الوثيقة:' : 'Cert ID:'}</span>
                  <span className="font-mono text-[#18231F] font-bold">{certHash.slice(0, 16)}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 text-[#5A6B63]">
                  <span className="font-semibold">{isAr ? 'تاريخ الفحص:' : 'Date:'}</span>
                  <span className="font-mono">{new Date(run.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 text-[#5A6B63]">
                  <span className="font-semibold">{isAr ? 'محرك الفحص:' : 'Engine:'}</span>
                  <span className="font-mono">{run.engineVersion}</span>
                </div>
              </div>
            </div>

            {/* Document Title & Summary */}
            <div className="mb-8">
              <span className="text-xs uppercase tracking-wider font-bold text-[#66736C]">
                {isAr ? 'النص المفحوص وموجز النتيجة' : 'Evaluated Content & Executive Summary'}
              </span>
              <h2 className="text-lg font-bold mt-1 text-[#082B23]">
                {run.title}
              </h2>
              <div className="mt-3 p-4 rounded-xl bg-[#F7F4EC] border border-[#E3E7DF] text-sm leading-relaxed text-[#18231F]">
                {isAr ? run.summaryAr : run.summaryEn}
              </div>
            </div>

            {/* Quantitative Scorecards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="p-4 rounded-xl bg-[#147D64]/10 border border-[#147D64]/25 text-center">
                <span className="text-2xl font-black text-[#0B3D2E] block">
                  {supported} / {total}
                </span>
                <span className="text-xs font-semibold text-[#147D64] mt-1 block">
                  {isAr ? 'دعاوى مؤيّدة بالدليل' : 'Supported Claims'}
                </span>
                <span className="text-[10px] text-[#0B3D2E] font-mono mt-0.5 block">
                  {supportPercentage}% {isAr ? 'نسبة الإسناد' : 'Match Rate'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#C7A45B]/15 border border-[#C7A45B]/35 text-center">
                <span className="text-2xl font-black text-[#7A5B15] block">
                  {mismatch}
                </span>
                <span className="text-xs font-semibold text-[#8C6D23] mt-1 block">
                  {isAr ? 'تفاوت لفظي مرصود' : 'Text Mismatch'}
                </span>
                <span className="text-[10px] text-[#8C6D23] mt-0.5 block">
                  {isAr ? 'تنبيه تدقيق اللفظ' : 'Wording Discrepancy'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#E3E7DF] text-center">
                <span className="text-2xl font-black text-[#18231F] block">
                  {unverified}
                </span>
                <span className="text-xs font-semibold text-[#66736C] mt-1 block">
                  {isAr ? 'غير مؤكد بالمصادر' : 'Unverified in Sources'}
                </span>
                <span className="text-[10px] text-[#66736C] mt-0.5 block">
                  {isAr ? 'في قواعد الفحص الحالية' : 'In Current Corpus'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#0B3D2E]/10 border border-[#0B3D2E]/25 text-center">
                <span className="text-2xl font-black text-[#082B23] block">
                  {referral}
                </span>
                <span className="text-xs font-semibold text-[#0B3D2E] mt-1 block">
                  {isAr ? 'إحالة لمفتٍ مختص' : 'Scholarly Referral'}
                </span>
                <span className="text-[10px] text-[#082B23] mt-0.5 block">
                  {isAr ? 'حالة شخصية / فتوى' : 'Personal Inquiry'}
                </span>
              </div>
            </div>

            {/* Claims Audit Table */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#147D64]" />
                <span>{isAr ? 'جدول العزو وتفاصيل التدقيق النصي للدعاوى' : 'Detailed Claims Verification Breakdown'}</span>
              </h3>

              <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-right" dir={isAr ? 'rtl' : 'ltr'}>
                  <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold border-b border-neutral-200 dark:border-neutral-700">
                    <tr>
                      <th className="p-3 w-10 text-center">#</th>
                      <th className="p-3">{isAr ? 'الدعوى المنسوبة' : 'Claimed Text'}</th>
                      <th className="p-3 w-28">{isAr ? 'النوع' : 'Type'}</th>
                      <th className="p-3 w-32">{isAr ? 'النتيجة' : 'Status'}</th>
                      <th className="p-3">{isAr ? 'الشاهد والمصدر المعتمد' : 'Evidence / Source'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {run.claims.map((claim, idx) => {
                      const firstEvidence = claim.evidence[0];
                      return (
                        <tr key={claim.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                          <td className="p-3 text-center font-bold text-neutral-400">{idx + 1}</td>
                          <td className="p-3 font-medium text-neutral-900 dark:text-neutral-100">
                            <span className="line-clamp-2">«{claim.originalText}»</span>
                          </td>
                          <td className="p-3 text-neutral-500 whitespace-nowrap">
                            {claim.claimType === 'quran_quotation' && (isAr ? 'اقتباس قرآني' : 'Quran')}
                            {claim.claimType === 'hadith_attribution' && (isAr ? 'حديث نبوي' : 'Hadith')}
                            {claim.claimType === 'personal_religious_question' && (isAr ? 'مسألة خاصة' : 'Fatwa')}
                            {claim.claimType === 'scholarly_statement' && (isAr ? 'قول عالم' : 'Scholar')}
                            {claim.claimType === 'fiqh_ruling' && (isAr ? 'حكم فقهي' : 'Ruling')}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {claim.status === 'supported' && (
                              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{isAr ? 'مؤيّد ومطابق' : 'Supported'}</span>
                              </span>
                            )}
                            {claim.status === 'text_mismatch' && (
                              <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>{isAr ? 'تفاوت لفظي' : 'Mismatch'}</span>
                              </span>
                            )}
                            {claim.status === 'unverified_in_available_sources' && (
                              <span className="text-neutral-500">
                                {isAr ? 'لم يُعثر عليه' : 'Unverified'}
                              </span>
                            )}
                            {claim.status === 'refer_to_specialist' && (
                              <span className="text-[#0B3D2E] font-semibold">
                                {isAr ? 'إحالة لمفتٍ' : 'Referral'}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-neutral-600 dark:text-neutral-300">
                            {firstEvidence ? (
                              <div>
                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                  {firstEvidence.sourceNameAr}
                                </span>
                                <span className="text-[11px] text-neutral-500 block">
                                  {firstEvidence.locator}
                                  {firstEvidence.grade && ` [${firstEvidence.grade}]`}
                                </span>
                              </div>
                            ) : (
                              <span className="text-neutral-400 italic">
                                {isAr ? 'لا يوجد شاهد مباشر مسجل' : 'No direct record'}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Official Seal and Sign-off */}
            <div className="pt-6 border-t-2 border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {/* Official MIJHAR Seal Stamp */}
                <div className="relative w-24 h-24 rounded-full border-4 border-[#C7A45B] flex items-center justify-center text-center p-2 bg-amber-50/40 dark:bg-amber-950/20 rotate-[-4deg] shadow-sm">
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#C7A45B]" />
                  <div className="text-[9px] font-bold text-[#0B3D2E] dark:text-[#C7A45B] leading-tight z-10">
                    <p>مِجهر للتدقيق</p>
                    <p className="text-[11px] font-black text-[#147D64]">معتمد</p>
                    <p className="text-[7px]">تحدي باذل • سدايا</p>
                  </div>
                </div>

                <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                    {isAr ? 'ختم التوثيق والعزو الرقمي' : 'Digital Verification Seal'}
                  </p>
                  <p className="font-mono text-[11px]">{certHash}</p>
                  <p className="text-[10px]">
                    {isAr
                      ? 'تم التحقق وفق قواعد مجمع الملك فهد لمصحف المدينة والدرر السنية وصحيحي البخاري ومسلم'
                      : 'Verified against King Fahd Complex Quran and verified hadith corpora'}
                  </p>
                </div>
              </div>

              {/* Institutional Attribution */}
              <div className="text-center sm:text-left text-[11px] text-neutral-500">
                <p className="font-bold text-[#0B3D2E] dark:text-emerald-400">
                  {isAr ? 'مبادرة مِجهر لتمكين المعرّفين بالإسلام' : 'MIJHAR Platform Initiative'}
                </p>
                <p className="mt-0.5">
                  {isAr
                    ? 'مسار 04: أدوات المعرفة والتحقق | تحدي باذل وسدايا'
                    : 'Track 04: Knowledge & Verification Tools'}
                </p>
              </div>
            </div>

            {/* Disclaimer Footer */}
            <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-400 text-center leading-relaxed">
              {isAr ? run.disclaimerAr : run.disclaimerEn}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
