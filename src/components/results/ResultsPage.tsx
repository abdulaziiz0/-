/**
 * MIJHAR - Verification Results & Evidence Inspection Page
 * Detailed claim cards, status filters, typographical diffing, human review flagging, and printable report.
 */

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { Claim, VerificationRun, VerificationStatus } from '../../types/index.ts';
import { VerificationCertificateModal } from '../certificate/VerificationCertificateModal.tsx';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  Printer,
  Edit3,
  Flag,
  ExternalLink,
  BookOpen,
  Filter,
  Check,
  ChevronDown,
  Info,
  Award,
  FileCheck2
} from 'lucide-react';

interface ResultsPageProps {
  run: VerificationRun;
  onRecheck: (text: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ run, onRecheck }) => {
  const { t, isRtl, locale } = useLanguage();
  const { user } = useAuth();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [flagModalClaim, setFlagModalClaim] = useState<Claim | null>(null);
  const [userNote, setUserNote] = useState('');
  const [flagSubmitted, setFlagSubmitted] = useState(false);
  const [isSubmittingFlag, setIsSubmittingFlag] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  // Status Badge Helper
  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'supported':
        return {
          label: t.status_supported,
          bg: 'bg-[#147D64]/10 text-[#0B3D2E] border-[#147D64]/30',
          icon: CheckCircle2,
        };
      case 'text_mismatch':
        return {
          label: t.status_text_mismatch,
          bg: 'bg-[#C7A45B]/20 text-[#7A5B15] border-[#C7A45B]/40',
          icon: AlertTriangle,
        };
      case 'refer_to_specialist':
        return {
          label: t.status_refer_to_specialist,
          bg: 'bg-[#0B3D2E]/10 text-[#082B23] border-[#0B3D2E]/30',
          icon: ShieldAlert,
        };
      case 'needs_review':
        return {
          label: t.status_needs_review,
          bg: 'bg-[#147D64]/10 text-[#147D64] border-[#147D64]/30',
          icon: Info,
        };
      case 'unverified_in_available_sources':
      default:
        return {
          label: t.status_unverified_in_available_sources,
          bg: 'bg-[#E3E7DF]/60 text-[#5A6B63] border-[#CBD2C9]',
          icon: HelpCircle,
        };
    }
  };

  const filteredClaims = run.claims.filter((c) => {
    if (activeFilter === 'all') return true;
    return c.status === activeFilter;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagModalClaim) return;

    setIsSubmittingFlag(true);
    try {
      const res = await fetch(`/api/verifications/${run.id}/flag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'guest',
        },
        body: JSON.stringify({
          claimId: flagModalClaim.id,
          userNote,
        }),
      });

      if (res.ok) {
        setFlagSubmitted(true);
        setTimeout(() => {
          setFlagModalClaim(null);
          setFlagSubmitted(false);
          setUserNote('');
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingFlag(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E3E7DF]">
        <div>
          <span className="text-[11px] font-bold text-[#147D64] uppercase tracking-wider">
            {isRtl ? 'تقرير فحص إسنادي معتمد' : 'Verified Evidence Report'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#082B23] font-arabic mt-1">
            {run.title || t.resultsTitle}
          </h1>
          <p className="text-xs text-[#66736C] mt-1">
            {isRtl ? 'المحرك:' : 'Engine:'} {run.engineVersion} • {new Date(run.createdAt).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button
            onClick={() => setIsCertificateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 min-h-[40px] bg-gradient-to-r from-[#0B3D2E] to-[#147D64] hover:from-[#082B23] hover:to-[#0B3D2E] active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all shadow-xs border border-[#C7A45B]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A45B] focus-visible:ring-offset-2 cursor-pointer"
          >
            <Award size={14} className="text-[#C7A45B]" />
            <span>{isRtl ? 'إصدار وثيقة الفحص والشهادة' : 'Issue Official Certificate'}</span>
          </button>
          <button
            onClick={() => onRecheck(run.originalText)}
            className="flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] bg-white border border-[#E3E7DF] text-[#082B23] rounded-xl text-xs font-semibold hover:bg-[#F7F4EC] hover:border-[#147D64]/50 hover:text-[#0B3D2E] active:bg-[#EDE8DC] active:scale-[0.98] transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-2 cursor-pointer"
          >
            <Edit3 size={14} className="text-[#147D64]" />
            <span>{t.btnRecheck}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] bg-[#0B3D2E] hover:bg-[#147D64] active:bg-[#082B23] active:scale-[0.98] text-white rounded-xl text-xs font-semibold transition-all shadow-xs border border-[#0B3D2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-2 cursor-pointer"
          >
            <Printer size={14} className="text-[#C7A45B]" />
            <span>{t.btnExport}</span>
          </button>
        </div>
      </div>

      {/* Summary Box with Metrics */}
      <div className="bg-white rounded-2xl border border-[#E3E7DF] p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#0B3D2E] uppercase tracking-wider">
          {t.summaryHeading}
        </h2>
        <p className="text-sm text-[#18231F] leading-relaxed">
          {isRtl ? run.summaryAr : run.summaryEn}
        </p>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#E3E7DF]">
          <div className="p-3 bg-[#147D64]/10 rounded-xl border border-[#147D64]/20 text-center">
            <span className="block text-2xl font-bold text-[#0B3D2E]">
              {run.statusCounts.supported || 0}
            </span>
            <span className="text-xs text-[#147D64] font-medium">{t.status_supported}</span>
          </div>

          <div className="p-3 bg-[#C7A45B]/15 rounded-xl border border-[#C7A45B]/30 text-center">
            <span className="block text-2xl font-bold text-[#7A5B15]">
              {run.statusCounts.text_mismatch || 0}
            </span>
            <span className="text-xs text-[#8C6D23] font-medium">{t.status_text_mismatch}</span>
          </div>

          <div className="p-3 bg-[#0B3D2E]/10 rounded-xl border border-[#0B3D2E]/20 text-center">
            <span className="block text-2xl font-bold text-[#082B23]">
              {run.statusCounts.refer_to_specialist || 0}
            </span>
            <span className="text-xs text-[#0B3D2E] font-medium">{t.status_refer_to_specialist}</span>
          </div>

          <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#E3E7DF] text-center">
            <span className="block text-2xl font-bold text-[#18231F]">
              {run.statusCounts.unverified_in_available_sources || 0}
            </span>
            <span className="text-xs text-[#66736C] font-medium">{t.status_unverified_in_available_sources}</span>
          </div>
        </div>

        {/* Disclaimer / Trust Notice */}
        <div className="p-3.5 bg-[#F7F4EC] rounded-xl border border-[#E3E7DF] text-xs text-[#66736C] leading-relaxed">
          <strong>{isRtl ? 'تنبيه الأمانة:' : 'Integrity Notice:'}</strong>{' '}
          {isRtl ? run.disclaimerAr : run.disclaimerEn}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 print:hidden">
        <span className="text-xs font-semibold text-[#66736C] flex items-center gap-1">
          <Filter size={14} />
          {isRtl ? 'تصفية حسب الحالة:' : 'Filter by Status:'}
        </span>
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 min-h-[38px] rounded-xl text-xs font-semibold active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-1 cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#0B3D2E] text-white shadow-xs border border-[#0B3D2E]'
              : 'bg-white border border-[#E3E7DF] text-[#18231F] hover:bg-[#F7F4EC] hover:border-[#147D64]/50 hover:text-[#0B3D2E]'
          }`}
        >
          {t.filterAll} ({run.claims.length})
        </button>
        {(['supported', 'text_mismatch', 'refer_to_specialist', 'unverified_in_available_sources'] as VerificationStatus[]).map(
          (st) => {
            const count = run.statusCounts[st] || 0;
            if (count === 0) return null;
            const badge = getStatusBadge(st);
            return (
              <button
                key={st}
                onClick={() => setActiveFilter(st)}
                className={`px-3.5 py-1.5 min-h-[38px] rounded-xl text-xs font-semibold active:scale-[0.98] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-1 cursor-pointer ${
                  activeFilter === st
                    ? 'bg-[#0B3D2E] text-white shadow-xs border border-[#0B3D2E]'
                    : 'bg-white border border-[#E3E7DF] text-[#18231F] hover:bg-[#F7F4EC] hover:border-[#147D64]/50 hover:text-[#0B3D2E]'
                }`}
              >
                {badge.label} ({count})
              </button>
            );
          }
        )}
      </div>

      {/* Claim Cards List */}
      <div className="space-y-6">
        {filteredClaims.map((claim, index) => {
          const badge = getStatusBadge(claim.status);
          const BadgeIcon = badge.icon;
          const evidence = claim.evidence[0];

          return (
            <div
              key={claim.id}
              className="bg-white rounded-2xl border border-[#E3E7DF] p-6 shadow-sm hover:shadow-md transition space-y-5"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E3E7DF] gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#082B23] text-white flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-[#0B3D2E] font-arabic">
                    {claim.claimSummaryAr}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                  >
                    <BadgeIcon size={14} />
                    <span>{badge.label}</span>
                  </span>

                  <button
                    onClick={() => setFlagModalClaim(claim)}
                    className="p-1.5 text-gray-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                    title={t.btnFlagError}
                    aria-label={t.btnFlagError}
                  >
                    <Flag size={14} />
                  </button>
                </div>
              </div>

              {/* User Claim Excerpt */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#66736C] uppercase tracking-wider block">
                  {t.originalClaimQuote}
                </span>
                <blockquote className="p-3.5 bg-[#F7F4EC] rounded-xl border border-[#E3E7DF] text-sm text-[#18231F] font-arabic leading-relaxed font-medium">
                  {claim.originalText}
                </blockquote>
              </div>

              {/* Typographical Diff Box (if text_mismatch) */}
              {claim.status === 'text_mismatch' && evidence?.mismatchDetails && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle size={15} />
                    {t.mismatchHighlightTitle}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200">
                      <span className="block text-[10px] text-red-600 font-bold mb-1">
                        {t.claimedWord}:
                      </span>
                      <p className="text-sm font-arabic line-through text-red-700">
                        {evidence.mismatchDetails.claimedSegment}
                      </p>
                    </div>
                    <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-300">
                      <span className="block text-[10px] text-emerald-700 font-bold mb-1">
                        {t.authenticWord}:
                      </span>
                      <p className="text-sm font-quran text-emerald-900 font-bold">
                        {evidence.mismatchDetails.authenticSegment}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Retrieved Canonical Evidence (if exists) */}
              {evidence && (
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={15} />
                      {t.evidenceFound}
                    </span>
                    {evidence.locatorUrl && (
                      <a
                        href={evidence.locatorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#147D64] hover:underline flex items-center gap-1"
                      >
                        <span>{isRtl ? 'فحص المصدر' : 'Open Source'}</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  <p className="text-sm sm:text-base font-quran text-[#0B3D2E] leading-loose bg-white p-3.5 rounded-lg border border-emerald-200">
                    «{evidence.excerptOriginal}»
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-emerald-800">
                    <div>
                      <strong>{t.sourceLabel}</strong> {evidence.sourceNameAr}
                    </div>
                    <div>
                      <strong>{t.locatorLabel}</strong> {evidence.locator}
                    </div>
                    {evidence.grade && (
                      <div>
                        <strong>{t.gradeLabel}</strong>{' '}
                        <span className="font-bold text-emerald-900">{evidence.grade}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Scientific Explanation and Limitations */}
              <div className="space-y-2 pt-2 border-t border-[#E3E7DF] text-xs">
                <div>
                  <strong className="text-[#082B23]">{t.reasonHeading}</strong>{' '}
                  <span className="text-[#18231F] leading-relaxed">
                    {isRtl ? claim.statusReasonAr : claim.statusReasonEn}
                  </span>
                </div>
                <div>
                  <strong className="text-[#66736C]">{t.limitationsHeading}</strong>{' '}
                  <span className="text-[#66736C] leading-relaxed">
                    {isRtl ? claim.limitationsAr : claim.limitationsEn}
                  </span>
                </div>
              </div>

              {/* Human Review Status (if flagged) */}
              {claim.humanReviewStatus && (
                <div className="p-3 bg-[#0B3D2E]/5 rounded-xl border border-[#0B3D2E]/20 text-xs text-[#082B23] flex items-center justify-between">
                  <span>
                    <strong>{isRtl ? 'حالة المراجعة البشرية:' : 'Scholarly Review Status:'}</strong>{' '}
                    {claim.humanReviewStatus === 'reviewed'
                      ? isRtl ? 'تمت مراجعتها واعتمادها' : 'Reviewed by Scholar'
                      : isRtl ? 'قيد المراجعة في جدول التدقيق الشرعي' : 'In Review Queue'}
                  </span>
                  {claim.humanReviewNotes && (
                    <span className="text-[11px] text-[#0B3D2E] italic">
                      {claim.humanReviewNotes}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Flag / Human Review Modal */}
      {flagModalClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E3E7DF] p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#082B23] font-arabic">
              {t.flagModalTitle}
            </h3>
            <p className="text-xs text-[#66736C]">{t.flagModalDesc}</p>

            <blockquote className="p-3 bg-[#F7F4EC] rounded-lg text-xs font-arabic border border-[#E3E7DF] text-gray-800">
              «{flagModalClaim.originalText}»
            </blockquote>

            {flagSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                <Check size={16} />
                <span>{t.flagSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleFlagSubmit} className="space-y-4">
                <textarea
                  rows={4}
                  required
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder={t.flagModalNotePlaceholder}
                  className="w-full p-3 text-xs border border-[#E3E7DF] rounded-xl focus:ring-2 focus:ring-[#147D64] focus:outline-none leading-relaxed"
                />

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E3E7DF]">
                  <button
                    type="button"
                    onClick={() => setFlagModalClaim(null)}
                    className="px-4 py-2 min-h-[38px] bg-white border border-[#E3E7DF] text-[#082B23] rounded-xl text-xs font-semibold hover:bg-[#F7F4EC] hover:border-[#147D64]/50 hover:text-[#0B3D2E] active:bg-[#EDE8DC] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64]"
                  >
                    {t.btnClose}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingFlag}
                    className="px-5 py-2 min-h-[38px] bg-[#0B3D2E] hover:bg-[#147D64] active:bg-[#082B23] active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all shadow-xs border border-[#0B3D2E] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-2"
                  >
                    {isSubmittingFlag ? '...' : t.btnSubmitFlag}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Official Verification Certificate Modal */}
      <VerificationCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        run={run}
        lang={locale}
      />
    </div>
  );
};
