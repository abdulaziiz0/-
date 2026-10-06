/**
 * MIJHAR - Scholarly Reviewer & Administrator Workspace
 * Role-gated interface to adjudicate flagged findings, toggle source availability, and view audit events.
 */

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { AuditEvent, EvidenceSource, HumanReviewItem, VerificationStatus } from '../../types/index.ts';
import { Shield, CheckCircle2, Clock, ToggleLeft, ToggleRight, AlertCircle, FileText, Check } from 'lucide-react';

export const AdminReviewPage: React.FC = () => {
  const { t, isRtl } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'reviews' | 'sources' | 'audits'>('reviews');
  const [reviews, setReviews] = useState<HumanReviewItem[]>([]);
  const [sources, setSources] = useState<EvidenceSource[]>([]);
  const [audits, setAudits] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Decision form state
  const [selectedReview, setSelectedReview] = useState<HumanReviewItem | null>(null);
  const [decisionStatus, setDecisionStatus] = useState<VerificationStatus>('supported');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const isAuthorized = user?.role === 'admin' || user?.role === 'reviewer';

  const loadData = () => {
    if (!isAuthorized) return;
    setLoading(true);

    Promise.all([
      fetch('/api/admin/reviews', { headers: { 'x-user-id': user?.id || '' } }).then((r) => r.json()),
      fetch('/api/sources').then((r) => r.json()),
      user?.role === 'admin'
        ? fetch('/api/admin/audits', { headers: { 'x-user-id': user?.id || '' } }).then((r) => r.json())
        : Promise.resolve({ audits: [] }),
    ])
      .then(([revData, srcData, audData]) => {
        setReviews(revData.reviews || []);
        setSources(srcData.sources || []);
        setAudits(audData.audits || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-[#E3E7DF] text-center space-y-4 shadow-sm">
        <Shield size={40} className="mx-auto text-amber-600" />
        <h2 className="text-lg font-bold text-[#082B23] font-arabic">
          {isRtl ? 'صلاحية غير كافية' : 'Unauthorized Access'}
        </h2>
        <p className="text-xs text-[#66736C]">
          {isRtl
            ? 'هذه المساحة مخصصة للمراجعين الشرعيين والمشرفين فقط. يمكنك التبديل لحساب "مشرف" أو "مراجع" من نافذة الدخول.'
            : 'This workspace requires certified reviewer or admin privileges.'}
        </p>
      </div>
    );
  }

  const handleSaveDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;

    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
        },
        body: JSON.stringify({
          reviewId: selectedReview.id,
          decision: decisionStatus,
          notes: decisionNotes,
        }),
      });

      if (res.ok) {
        setActionSuccess(t.decisionSavedSuccess);
        setSelectedReview(null);
        setDecisionNotes('');
        loadData();
        setTimeout(() => setActionSuccess(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleSource = async (sourceId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/sources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || '',
        },
        body: JSON.stringify({
          sourceId,
          isConfigured: !currentStatus,
        }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E3E7DF]">
        <div>
          <span className="text-[11px] font-bold text-[#C7A45B] uppercase tracking-wider">
            {isRtl ? 'إدارة وضبط الجودة الإسنادية' : 'Scholarly Verification & Audit Suite'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#082B23] font-arabic mt-1">
            {t.adminTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#66736C] mt-1">{t.adminSubtitle}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#F7F4EC] p-1 rounded-xl border border-[#E3E7DF] self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-1.5 min-h-[36px] rounded-lg transition-all duration-150 active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] ${
              activeTab === 'reviews'
                ? 'bg-[#0B3D2E] text-white shadow-xs'
                : 'text-[#18231F] hover:bg-white hover:text-[#0B3D2E]'
            }`}
          >
            {t.tabReviews} ({reviews.filter((r) => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3.5 py-1.5 min-h-[36px] rounded-lg transition-all duration-150 active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] ${
              activeTab === 'sources'
                ? 'bg-[#0B3D2E] text-white shadow-xs'
                : 'text-[#18231F] hover:bg-white hover:text-[#0B3D2E]'
            }`}
          >
            {t.tabSourcesMgmt}
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('audits')}
              className={`px-3.5 py-1.5 min-h-[36px] rounded-lg transition-all duration-150 active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] ${
                activeTab === 'audits'
                  ? 'bg-[#0B3D2E] text-white shadow-xs'
                  : 'text-[#18231F] hover:bg-white hover:text-[#0B3D2E]'
              }`}
            >
              {t.tabAuditLog}
            </button>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-[#147D64]/10 text-[#0B3D2E] border border-[#147D64]/20 rounded-xl text-xs flex items-center gap-2">
          <Check size={16} className="text-[#147D64]" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 1. Reviews Queue Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-[#E3E7DF] text-center text-xs text-[#66736C]">
              {isRtl ? 'لا توجد دعاوى معلقة للمراجعة البشرية حالياً.' : 'No pending review items at this time.'}
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 bg-white rounded-2xl border border-[#E3E7DF] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E3E7DF]">
                    <span className="font-bold text-[#0B3D2E]">
                      {isRtl ? 'طلب مراجعة إسنادية' : 'Review Request'} #{rev.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        rev.status === 'resolved'
                          ? 'bg-[#147D64]/10 text-[#0B3D2E] border-[#147D64]/25'
                          : 'bg-[#C7A45B]/15 text-[#8C6D23] border-[#C7A45B]/30'
                      }`}
                    >
                      {rev.status === 'resolved' ? 'معتمد' : 'معلّق'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#66736C] block mb-1">
                      {t.reviewClaimOriginal}
                    </span>
                    <p className="p-3 bg-[#F7F4EC] rounded-xl text-xs font-arabic border border-[#E3E7DF]">
                      «{rev.claimOriginalText}»
                    </p>
                  </div>

                  <div className="text-xs text-[#18231F]">
                    <strong className="text-[#66736C]">{t.reviewUserNote}</strong>{' '}
                    <span>{rev.userNote || 'طلب فحص وتدقيق'}</span>
                  </div>

                  {rev.status === 'resolved' ? (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                      <div>
                        <strong>{isRtl ? 'المراجع:' : 'Reviewer:'}</strong> {rev.reviewerName}
                      </div>
                      <div>
                        <strong>{isRtl ? 'القرار:' : 'Decision:'}</strong> {rev.reviewerDecision}
                      </div>
                      <div>
                        <strong>{isRtl ? 'الملاحظات:' : 'Notes:'}</strong> {rev.reviewerNotes}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedReview(rev);
                        setDecisionStatus(rev.currentStatus);
                      }}
                      className="px-4 py-2 min-h-[38px] bg-[#0B3D2E] hover:bg-[#147D64] active:bg-[#082B23] active:scale-[0.98] text-white rounded-xl text-xs font-semibold transition-all shadow-xs border border-[#0B3D2E] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-2"
                    >
                      {isRtl ? 'اتخاذ قرار شرعي في الدعوى' : 'Adjudicate Finding'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Decision Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E3E7DF] shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#082B23] font-arabic">
              {isRtl ? 'تسجيل قرار المراجع الشرعي المعتمد' : 'Record Reviewer Decision'}
            </h3>

            <p className="p-3 bg-[#F7F4EC] rounded-lg text-xs font-arabic border border-[#E3E7DF]">
              «{selectedReview.claimOriginalText}»
            </p>

            <form onSubmit={handleSaveDecision} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">{t.reviewDecisionLabel}</label>
                <select
                  value={decisionStatus}
                  onChange={(e) => setDecisionStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-[#E3E7DF] rounded-lg focus:ring-2 focus:ring-[#147D64] focus:outline-none"
                >
                  <option value="supported">{t.status_supported}</option>
                  <option value="text_mismatch">{t.status_text_mismatch}</option>
                  <option value="needs_review">{t.status_needs_review}</option>
                  <option value="refer_to_specialist">{t.status_refer_to_specialist}</option>
                  <option value="unverified_in_available_sources">
                    {t.status_unverified_in_available_sources}
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">{t.reviewNotesLabel}</label>
                <textarea
                  rows={4}
                  required
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder={
                    isRtl
                      ? 'دوّن المسوغ الشرعي، المرجع الدقيق، أو سبب التعديل...'
                      : 'Provide scholarly rationale and exact citation...'
                  }
                  className="w-full p-3 border border-[#E3E7DF] rounded-lg focus:ring-2 focus:ring-[#147D64] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E3E7DF]">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 min-h-[38px] bg-white border border-[#E3E7DF] text-[#082B23] rounded-xl text-xs font-semibold hover:bg-[#F7F4EC] hover:border-[#147D64]/50 hover:text-[#0B3D2E] active:bg-[#EDE8DC] active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64]"
                >
                  {t.btnClose}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 min-h-[38px] bg-[#0B3D2E] hover:bg-[#147D64] active:bg-[#082B23] active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all shadow-xs border border-[#0B3D2E] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-2"
                >
                  {t.btnSaveDecision}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Sources Management Tab */}
      {activeTab === 'sources' && (
        <div className="bg-white rounded-2xl border border-[#E3E7DF] shadow-xs overflow-hidden">
          <div className="divide-y divide-[#E3E7DF]">
            {sources.map((src) => (
              <div
                key={src.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-[#082B23] font-arabic">
                    {src.nameAr} ({src.nameEn})
                  </h4>
                  <p className="text-xs text-[#66736C]">{src.coverage}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      src.isConfigured
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {src.isConfigured ? t.configuredBadge : t.unconfiguredBadge}
                  </span>

                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleToggleSource(src.id, src.isConfigured)}
                      className="px-3.5 py-1.5 min-h-[36px] text-xs font-semibold bg-white border border-[#E3E7DF] text-[#082B23] hover:bg-[#F7F4EC] hover:border-[#147D64]/50 hover:text-[#0B3D2E] active:scale-[0.98] rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64]"
                    >
                      {t.toggleSourceBtn}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Audit Log Tab */}
      {activeTab === 'audits' && user?.role === 'admin' && (
        <div className="bg-white rounded-2xl border border-[#E3E7DF] shadow-xs overflow-x-auto">
          <table className="w-full text-xs text-left rtl:text-right">
            <thead className="bg-[#F7F4EC] text-[#66736C] border-b border-[#E3E7DF]">
              <tr>
                <th className="p-3">{t.auditColTime}</th>
                <th className="p-3">{t.auditColUser}</th>
                <th className="p-3">{t.auditColAction}</th>
                <th className="p-3">{t.auditColEntity}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E7DF]">
              {audits.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/50">
                  <td className="p-3 font-mono text-[11px] text-gray-500">
                    {new Date(a.timestamp).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}
                  </td>
                  <td className="p-3 font-medium text-[#18231F]">{a.userEmail}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 font-mono text-[10px] text-gray-700">
                      {a.action}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 font-mono text-[11px]">{a.entityType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
