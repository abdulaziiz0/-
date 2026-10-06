import React, { useState } from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  Shield,
  Layers,
  Sparkles,
  Users,
  Compass,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

interface PRDModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const PRDModal: React.FC<PRDModalProps> = ({ isOpen, onClose, lang }) => {
  const isAr = lang === 'ar';
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/PRD.md');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E3E7DF] flex flex-col my-auto max-h-[92vh] overflow-hidden"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0B3D2E] via-[#0E4C3A] to-[#147D64] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <FileText className="w-5 h-5 text-[#C7A45B]" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {isAr
                  ? 'وثيقة متطلبات المنتج (PRD) - منصة مِجهر'
                  : 'Product Requirements Document (PRD) - MIJHAR'}
              </h3>
              <p className="text-xs text-emerald-100 opacity-90 mt-0.5">
                {isAr
                  ? 'مواءمة شاملة 100% مع معايير تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي'
                  : '100% Comprehensive Compliance with Islamic Content AI Challenge'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 min-h-[36px] bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : isAr ? 'رابط الوثيقة' : 'Copy Link'}</span>
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-sm text-[#18231F] leading-relaxed font-sans bg-[#F7F4EC]/40">
          {/* Section 1: Overview */}
          <div className="p-5 rounded-2xl bg-white border border-[#E3E7DF] shadow-xs">
            <h4 className="font-black text-base text-[#0B3D2E] mb-2 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C7A45B]" />
              <span>1. الهوية والمسار التنافسي (Challenge Track & Identity)</span>
            </h4>
            <div className="space-y-2 text-xs text-[#5A6B63]">
              <p>
                <strong>اسم المشروع:</strong> مِجهر (MIJHAR) - منصة التحقق من موثوقية المحتوى الإسلامي وعزو النصوص الشرعية.
              </p>
              <p>
                <strong>الشعار:</strong> «ما يُنسب إلى الدين، افحص دليله قبل نشره.» / “Verify the evidence before you publish.”
              </p>
              <p>
                <strong>المسار المستهدف:</strong> مسار 04: أدوات المعرفة والتحقق لتمكين المعرّفين بالإسلام وصنّاع المحتوى.
              </p>
              <p>
                <strong>الجهات الشريكة:</strong> مؤسسة باذل الأهلية (المنظمة)، سدايا SDAIA (الشريك الاستراتيجي للذكاء الاصطناعي)، وزارة الاتصالات وتقنية المعلومات MCIT (التمكين الرقمي)، آفاق المستقبل، التحول التقني TTS.
              </p>
            </div>
          </div>

          {/* Section 2: Team Distribution */}
          <div>
            <h4 className="font-black text-base text-[#0B3D2E] mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#147D64]" />
              <span>2. توزيع أدوار الفريق وتوافقها مع التحدي (Team Roles)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-[#0B3D2E]/25 bg-white shadow-2xs">
                <span className="font-bold text-[#0B3D2E] block text-sm">
                  عبدالعزيز لاحق المطيري (Abdulaziz Al-Mutairi)
                </span>
                <span className="text-[#147D64] font-semibold block mb-0.5">
                  قائد الفريق ومدير المنتج التقني (IT Lead & Product Architect)
                </span>
                <span className="text-[10px] text-[#5A6B63] font-mono block mb-1">
                  تقنية معلومات (Information Technology)
                </span>
                <p className="text-[#5A6B63]">
                  القيادة والتنسيق الشامل، إدارة متطلبات المنتج، المواءمة مع معايير تحدي باذل وسدايا، وحوكمة الميثاق الشرعي وضمان الجودة.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#147D64]/25 bg-white shadow-2xs">
                <span className="font-bold text-[#0B3D2E] block text-sm">
                  مشاري العتيبي - العصيمي (Mishari Al-Otaibi)
                </span>
                <span className="text-[#147D64] font-semibold block mb-0.5">
                  مهندس الذكاء الاصطناعي والنماذج اللغوية (Lead AI Engineer)
                </span>
                <span className="text-[10px] text-[#5A6B63] font-mono block mb-1">
                  علوم حاسب (Computer Science)
                </span>
                <p className="text-[#5A6B63]">
                  استخراج الدعاوى الدينية، هندسة الأوامر (Prompt Engineering) وفق الحزمة العلمية، تصنيف المستويات (أ/ب/ج/د)، ومقاومة الهلوسة.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#082B23]/25 bg-white shadow-2xs">
                <span className="font-bold text-[#082B23] block text-sm">
                  اصيل سمير الحارثي (Aseel Al-Harthi)
                </span>
                <span className="text-[#147D64] font-semibold block mb-0.5">
                  مهندس البرمجيات والنظم الكاملة (Lead Full-Stack Engineer)
                </span>
                <span className="text-[10px] text-[#5A6B63] font-mono block mb-1">
                  هندسة حاسب (Computer Engineering)
                </span>
                <p className="text-[#5A6B63]">
                  بناء المعمارية الكاملة الموزعة (React + Node.js + Express)، تطوير خوارزميات محرك الفحص ذي الـ 12 مرحلة، وتكامل واجهات الـ API.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#C7A45B]/35 bg-white shadow-2xs">
                <span className="font-bold text-[#7A5B15] block text-sm">
                  فهد تركي الخماش (Fahad Al-Khammash)
                </span>
                <span className="text-[#8C6D23] font-semibold block mb-0.5">
                  مهندس واجهة وتجربة المستخدم والبيانات (Frontend, UX & Data Engineer)
                </span>
                <span className="text-[10px] text-[#5A6B63] font-mono block mb-1">
                  تقنية معلومات (Information Technology)
                </span>
                <p className="text-[#5A6B63]">
                  تصميم وتطوير الواجهات التفاعلية (UX/UI)، تدقيق وربط قواعد البيانات الموثقة (المصحف والصحاح)، وتطوير وثيقة وشهادة الفحص الرسمية.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Scientific Package Compliance */}
          <div>
            <h4 className="font-black text-base text-[#0B3D2E] mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#147D64]" />
              <span>3. معايير الحزمة العلمية الأربعة (The 4 Scientific Response Levels)</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white border border-[#E3E7DF] rounded-xl flex items-start gap-2 shadow-2xs">
                <span className="font-bold text-[#147D64] shrink-0">المستوى (أ):</span>
                <span className="text-[#18231F]">معلومات أصلية مستقرة (القرآن، الأحاديث الصحيحة المعتمدة، أركان الإسلام، السيرة الأساسية): إجابة مباشرة موثقة بالعزو الدقيق.</span>
              </div>
              <div className="p-3 bg-white border border-[#E3E7DF] rounded-xl flex items-start gap-2 shadow-2xs">
                <span className="font-bold text-[#0B3D2E] shrink-0">المستوى (ب):</span>
                <span className="text-[#18231F]">شرح وتعريف واستدلال (مفاهيم، مقارنات، مقاصد، أسئلة فكرية): إجابة من المادة المعتمدة مع إظهار المرجع وتجنب القطع فيما يحتمل الخلاف.</span>
              </div>
              <div className="p-3 bg-white border border-[#E3E7DF] rounded-xl flex items-start gap-2 shadow-2xs">
                <span className="font-bold text-[#8C6D23] shrink-0">المستوى (ج):</span>
                <span className="text-[#18231F]">مسائل خلافية أو عالية الحساسية (خلاف فقهي، مسائل عقدية تفصيلية): بيان الخلاف المعتبر باعتدال والإحالة للمختص دون ترجيح آلي مستقل.</span>
              </div>
              <div className="p-3 bg-white border border-[#E3E7DF] rounded-xl flex items-start gap-2 shadow-2xs">
                <span className="font-bold text-[#8C2D19] shrink-0">المستوى (د):</span>
                <span className="text-[#18231F]">فتوى أو حالة شخصية (أحكام خاصة، نوازل أسرية): منع إصدار الحكم قطعيًا وتوجيه المستفيد فورًا للجهات الإفتائية الرسمية وهيئات كبار العلماء.</span>
              </div>
            </div>
          </div>

          {/* Section 4: Architecture */}
          <div>
            <h4 className="font-black text-base text-[#0B3D2E] mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#147D64]" />
              <span>4. الهيكلية التقنية المطبقة (Technical Stack & Modules)</span>
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-[#5A6B63] bg-white p-4 rounded-xl border border-[#E3E7DF]">
              <li><strong className="text-[#18231F]">محرك الفحص (Verification Pipeline):</strong> 12 مرحلة معالجة تنتهي بالعزو وتحديد درجة المطابقة (exact / normalized / mismatch).</li>
              <li><strong className="text-[#18231F]">قاعدة البيانات الموثقة:</strong> القرآن الكريم كاملاً برواية حفص عن عاصم، صحيحي البخاري ومسلم، وموسوعات الأحاديث.</li>
              <li><strong className="text-[#18231F]">مساعد الذكاء الاصطناعي (AI Chat):</strong> متوافق مع الحزمة العلمية عبر محرك Gemini بمحددات ضبط صارمة ومقاومة للهلوسة.</li>
              <li><strong className="text-[#18231F]">وثيقة التدقيق الرقمية (Verification Certificate):</strong> تصدير PDF، ختم الاعتماد، ورمز استجابة سريعة وتجزئة مشفرة SHA-256.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F7F4EC] border-t border-[#E3E7DF] flex items-center justify-between">
          <span className="text-xs text-[#5A6B63] font-mono">
            MIJHAR-PRD-v2.0-STABLE • Track 04
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 min-h-[38px] bg-[#0B3D2E] hover:bg-[#147D64] active:bg-[#082B23] active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all shadow-xs border border-[#0B3D2E] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-2"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
