/**
 * MIJHAR - User Dashboard & Verification History
 */

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { VerificationRun } from '../../types/index.ts';
import {
  History,
  FileCheck,
  Trash2,
  ExternalLink,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

interface DashboardProps {
  onNewVerification: () => void;
  onSelectRun: (run: VerificationRun) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({
  onNewVerification,
  onSelectRun,
}) => {
  const { t, isRtl } = useLanguage();
  const { user } = useAuth();

  const [runs, setRuns] = useState<VerificationRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchHistory = () => {
    setLoading(true);
    fetch('/api/verifications', {
      headers: { 'x-user-id': user?.id || 'guest' },
    })
      .then((res) => (res.ok ? res.json() : { runs: [] }))
      .then((data) => setRuns(data.runs || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(isRtl ? 'هل تريد حذف هذا التقرير؟' : 'Delete this report?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/verifications/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user?.id || 'guest' },
      });
      if (res.ok) {
        setRuns((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm(t.confirmClearHistory)) return;
    try {
      const res = await fetch('/api/verifications', {
        method: 'DELETE',
        headers: { 'x-user-id': user?.id || 'guest' },
      });
      if (res.ok) {
        setRuns([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Aggregated Stats
  const totalClaims = runs.reduce((acc, r) => acc + (r.totalClaimsCount || 0), 0);
  const totalSupported = runs.reduce((acc, r) => acc + (r.statusCounts?.supported || 0), 0);
  const totalMismatches = runs.reduce((acc, r) => acc + (r.statusCounts?.text_mismatch || 0), 0);
  const totalSpecialist = runs.reduce((acc, r) => acc + (r.statusCounts?.refer_to_specialist || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E3E7DF]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#082B23] font-arabic">
            {t.dashTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#66736C] mt-1">{t.dashSubtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {runs.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs px-3.5 py-2 min-h-[40px] text-red-700 bg-red-50/60 hover:bg-red-100 hover:text-red-800 rounded-xl border border-red-200 transition-all font-semibold active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              {t.btnClearAll}
            </button>
          )}
          <button
            onClick={onNewVerification}
            className="flex items-center gap-2 px-4 py-2.5 min-h-[40px] bg-[#0B3D2E] hover:bg-[#147D64] active:bg-[#082B23] active:scale-[0.98] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs border border-[#0B3D2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-2 cursor-pointer"
          >
            <PlusCircle size={16} className="text-[#C7A45B]" />
            <span>{t.dashBtnNew}</span>
          </button>
        </div>
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E3E7DF] shadow-2xs">
          <span className="text-xs text-[#66736C] font-medium">{t.statTotalRuns}</span>
          <span className="block text-2xl font-bold text-[#082B23] mt-1">{runs.length}</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E3E7DF] shadow-2xs">
          <span className="text-xs text-[#147D64] font-medium">{t.statSupported}</span>
          <span className="block text-2xl font-bold text-[#0B3D2E] mt-1">{totalSupported}</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E3E7DF] shadow-2xs">
          <span className="text-xs text-[#8C6D23] font-medium">{t.statMismatches}</span>
          <span className="block text-2xl font-bold text-[#7A5B15] mt-1">{totalMismatches}</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E3E7DF] shadow-2xs">
          <span className="text-xs text-[#0B3D2E] font-medium">{t.statSpecialist}</span>
          <span className="block text-2xl font-bold text-[#082B23] mt-1">{totalSpecialist}</span>
        </div>
      </div>

      {/* Runs List */}
      {loading ? (
        <div className="p-12 text-center text-[#66736C] flex flex-col items-center justify-center gap-3">
          <Loader2 size={24} className="animate-spin text-[#147D64]" />
          <span className="text-xs">{isRtl ? 'جارٍ تحميل السجل...' : 'Loading history...'}</span>
        </div>
      ) : runs.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-[#E3E7DF] text-center space-y-4 shadow-2xs">
          <History size={40} className="mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-[#082B23] font-arabic">{t.dashEmptyTitle}</h3>
          <p className="text-xs text-[#66736C] max-w-sm mx-auto">{t.dashEmptyDesc}</p>
          <button
            onClick={onNewVerification}
            className="px-6 py-2.5 min-h-[40px] bg-[#0B3D2E] hover:bg-[#147D64] active:bg-[#082B23] active:scale-[0.98] text-white rounded-xl text-xs font-semibold transition-all shadow-xs border border-[#0B3D2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-2 cursor-pointer"
          >
            {t.dashBtnNew}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E3E7DF] shadow-sm overflow-hidden">
          <div className="divide-y divide-[#E3E7DF]">
            {runs.map((r) => (
              <div
                key={r.id}
                onClick={() => onSelectRun(r)}
                className="p-5 hover:bg-[#F7F4EC]/60 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#082B23] font-arabic truncate max-w-md">
                      {r.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#147D64]/10 text-[#0B3D2E] border border-[#147D64]/20 font-semibold">
                      {r.contentType}
                    </span>
                  </div>

                  <p className="text-xs text-[#66736C] line-clamp-1 max-w-xl font-arabic">
                    {r.originalText}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span>{new Date(r.createdAt).toLocaleString(isRtl ? 'ar-SA' : 'en-US')}</span>
                    <span>•</span>
                    <span>
                      {r.totalClaimsCount} {isRtl ? 'دعاوى' : 'claims'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="flex items-center gap-1.5 text-xs">
                    {r.statusCounts.supported > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-[#147D64]/10 text-[#0B3D2E] border border-[#147D64]/20 font-bold text-[11px]">
                        ✓ {r.statusCounts.supported}
                      </span>
                    )}
                    {r.statusCounts.text_mismatch > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-[#C7A45B]/15 text-[#7A5B15] border border-[#C7A45B]/30 font-bold text-[11px]">
                        ≠ {r.statusCounts.text_mismatch}
                      </span>
                    )}
                    {r.statusCounts.refer_to_specialist > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-[#0B3D2E]/10 text-[#082B23] border border-[#0B3D2E]/20 font-bold text-[11px]">
                        ⚖ {r.statusCounts.refer_to_specialist}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleDelete(r.id, e)}
                    disabled={deletingId === r.id}
                    className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-gray-400 hover:text-red-700 hover:bg-red-50 active:scale-90 rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    title={t.btnDelete}
                    aria-label={t.btnDelete}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
