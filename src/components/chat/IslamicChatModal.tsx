import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  BookOpen,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { ChatMessage } from '../../types/index.ts';

interface IslamicChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

const SAMPLE_QUESTIONS = {
  ar: [
    { title: 'عبادة الكعبة؟', query: 'هل يعبد المسلمون الكعبة المشرفة أم يتجهون إليها فقط؟' },
    { title: 'مفهوم التوحيد', query: 'ما هو مفهوم التوحيد في الإسلام وأقسامه الأساسية؟' },
    { title: 'تخريج حديث', query: 'ما صحة حديث: إنما الأعمال بالنيات ومَن خرّجه؟' },
    { title: 'مسألة شخصية / فتوى', query: 'هل يصح لي أن أجمع الصلوات أثناء دراستي الجامعية؟ أفتوني' },
  ],
  en: [
    { title: 'Do Muslims worship Kaaba?', query: 'Do Muslims worship the Kaaba or face it in prayer?' },
    { title: 'Concept of Tawheed', query: 'What is the Islamic concept of Tawheed and monotheism?' },
    { title: 'Hadith Authenticity', query: 'What is the authenticity and source of: Deeds depend upon intentions?' },
    { title: 'Personal Fatwa Question', query: 'Can I combine prayers while attending my university lectures?' },
  ]
};

export const IslamicChatModal: React.FC<IslamicChatModalProps> = ({ isOpen, onClose, lang }) => {
  const isAr = lang === 'ar';
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: isAr
        ? 'مرحباً بك في المساعد الذكي لمنصة مِجهر. هذا النظام مدرب وفق ضوابط "الحزمة العلمية لتحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي" برعاية مؤسسة باذل وسدايا. يقدم إجابات مؤصلة بالدليل من المصادر المعتمدة، ويلتزم بالامتناع التام عن الفتوى الفردية.'
        : 'Welcome to MIJHAR AI Assistant. Adhering to the Scientific Package for Islamic Content (BATHL Foundation & SDAIA), this assistant provides referenced explanations from canonical sources and strictly refers personal fatwas to official authorities.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      level: 'a_established',
      sources: [
        { name: isAr ? 'مجمع الملك فهد لطباعة المصحف' : 'King Fahd Quran Complex' },
        { name: isAr ? 'موسوعة الدرر السنية' : 'Dorar Hadith Encyclopedia' },
        { name: isAr ? 'المستودع الدعوي الرقمي' : 'Digital Dawa Repository' },
      ],
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input.trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!response.ok) {
        throw new Error('Failed to get chat response');
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || (isAr ? 'عذراً، لم أتمكن من الحصول على إجابة.' : 'Sorry, could not generate a response.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        level: data.level,
        sources: data.sources || [],
        isReferredToSpecialist: data.isReferredToSpecialist,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: isAr
          ? 'تعذر الاتصال بخدمة الذكاء الاصطناعي مؤقتاً. يرجى التأكد من الاتصال وإعادة المحاولة.'
          : 'Unable to reach the AI service. Please verify connection and retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        level: 'd_fatwa_referral',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getLevelBadge = (level?: ChatMessage['level']) => {
    switch (level) {
      case 'a_established':
        return {
          label: isAr ? 'المستوى (أ) أصل مستقر' : 'Level (A) Established Principle',
          color: 'bg-[#147D64]/10 text-[#0B3D2E] border-[#147D64]/30',
        };
      case 'b_explanation':
        return {
          label: isAr ? 'المستوى (ب) بيان واستدلال' : 'Level (B) Sourced Explanation',
          color: 'bg-[#0B3D2E]/10 text-[#082B23] border-[#0B3D2E]/25',
        };
      case 'c_disputed':
        return {
          label: isAr ? 'المستوى (ج) مسألة خلافية معتبرة' : 'Level (C) Disputed Subject',
          color: 'bg-[#C7A45B]/20 text-[#7A5B15] border-[#C7A45B]/40',
        };
      case 'd_fatwa_referral':
        return {
          label: isAr ? 'المستوى (د) إحالة لدار الإفتاء' : 'Level (D) Fatwa Referral',
          color: 'bg-[#8C2D19]/10 text-[#8C2D19] border-[#8C2D19]/25',
        };
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-3xl h-[88vh] max-h-[750px] bg-white rounded-2xl shadow-2xl border border-[#E3E7DF] flex flex-col overflow-hidden"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#0B3D2E] via-[#0E4C3A] to-[#147D64] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <Sparkles className="w-5 h-5 text-[#C7A45B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg leading-tight">
                  {isAr ? 'مساعد مِجهر المعرفي والشرعي' : 'MIJHAR Islamic AI Assistant'}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#C7A45B]/30 border border-[#C7A45B]/60 text-amber-200">
                  {isAr ? 'مدعوم بالحزمة العلمية' : 'Scientific Package Compliant'}
                </span>
              </div>
              <p className="text-xs text-emerald-100 opacity-90 mt-0.5">
                {isAr
                  ? 'إجابات مؤصلة بالدليل • امتناع صارم عن الفتوى الفردية • مواءمة معايير مؤسسة باذل وسدايا'
                  : 'Sourced answers • Anti-fatwa guardrails • Aligned with BATHL & SDAIA challenge standards'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Challenge Scientific Compliance Banner */}
        <div className="px-4 py-2 bg-[#C7A45B]/15 border-b border-[#C7A45B]/30 flex items-center gap-2 text-xs text-[#082B23]">
          <ShieldCheck className="w-4 h-4 text-[#8C6D23] shrink-0" />
          <span>
            {isAr
              ? 'تنبيه: هذا المساعد للإفادة العلمية والتوثيق فقط ولا يستقل بالفتوى الشخصية. تُحال الوقائع الفردية لمفتي مؤهل.'
              : 'Notice: This assistant is strictly for evidence verification and scholarly context. Individual fatwas are referred to qualified muftis.'}
          </span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F7F4EC]/60">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const levelInfo = getLevelBadge(msg.level);

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
              >
                <div
                  className={`relative max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 shadow-xs text-sm ${
                    isUser
                      ? 'bg-[#0B3D2E] text-white rounded-br-none'
                      : 'bg-white text-[#18231F] border border-[#E3E7DF] rounded-bl-none'
                  }`}
                >
                  {/* Assistant Header: Level badge */}
                  {!isUser && levelInfo && (
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${levelInfo.color}`}>
                        {levelInfo.label}
                      </span>
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.text)}
                        className="text-neutral-400 hover:text-[#0B3D2E] p-1.5 min-w-[28px] min-h-[28px] flex items-center justify-center rounded-lg hover:bg-black/5 active:scale-90 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64]"
                        title={isAr ? 'نسخ الإجابة' : 'Copy'}
                        aria-label={isAr ? 'نسخ الإجابة' : 'Copy'}
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}

                  {/* Main Text */}
                  <div className="leading-relaxed whitespace-pre-wrap font-sans text-[#18231F]">
                    {msg.text}
                  </div>

                  {/* Fatwa Referral Alert */}
                  {msg.isReferredToSpecialist && (
                    <div className="mt-3 p-2.5 rounded-lg bg-[#8C2D19]/10 border border-[#8C2D19]/25 flex items-start gap-2 text-xs text-[#8C2D19]">
                      <AlertCircle className="w-4 h-4 shrink-0 text-[#8C2D19] mt-0.5" />
                      <div>
                        <strong className="block font-semibold">
                          {isAr ? 'توجيه بالإحالة الشرعية:' : 'Scholarly Referral Required:'}
                        </strong>
                        <span>
                          {isAr
                            ? 'نظراً لأن المسألة تتعلق بفتوى فردية أو نازلة شخصية، يرجى التوجه إلى دور الإفتاء الرسمية المعتمدة (كالرئاسة العامة للبحوث العلمية والإفتاء).'
                            : 'Since this concerns a personalized religious case, please consult an accredited official fatwa council.'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Sources Footnote */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#E3E7DF]">
                      <div className="text-[11px] font-medium text-[#5A6B63] flex items-center gap-1 mb-1.5">
                        <BookOpen className="w-3 h-3 text-[#147D64]" />
                        <span>{isAr ? 'المصادر المعتمدة المسندة:' : 'Referenced Canonical Sources:'}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1 text-[11px] bg-[#F7F4EC] text-[#18231F] px-2 py-0.5 rounded border border-[#E3E7DF]"
                          >
                            <span className="font-medium">{src.name}</span>
                            {src.locator && <span className="opacity-75">({src.locator})</span>}
                            {src.url && (
                              <a
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#147D64] hover:text-[#0B3D2E]"
                              >
                                <ExternalLink className="w-2.5 h-2.5 inline" />
                              </a>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div
                    className={`mt-1.5 text-[10px] text-right ${
                      isUser ? 'text-emerald-100' : 'text-[#8A9791]'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 p-3 text-sm text-[#5A6B63] bg-white rounded-xl w-fit shadow-xs border border-[#E3E7DF]">
              <Sparkles className="w-4 h-4 text-[#147D64] animate-spin" />
              <span>
                {isAr
                  ? 'جاري فحص المسألة في المستودعات المعتمدة وتطبيق ضوابط الحزمة العلمية...'
                  : 'Analyzing question against verified corpora under scientific guidelines...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-2.5 bg-[#FAF8F2] border-t border-[#E3E7DF]">
          <div className="text-[11px] text-[#5A6B63] font-medium mb-1.5 px-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C7A45B]" />
            <span>{isAr ? 'أسئلة نموذجية لاختبار الضوابط العلمية:' : 'Sample queries testing scientific rules:'}</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {(isAr ? SAMPLE_QUESTIONS.ar : SAMPLE_QUESTIONS.en).map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item.query)}
                className="shrink-0 px-3 py-1.5 min-h-[32px] rounded-full bg-white hover:bg-[#F7F4EC] border border-[#E3E7DF] text-[#18231F] transition-all hover:border-[#147D64]/60 hover:text-[#0B3D2E] active:scale-[0.97] text-[11px] font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64]"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#E3E7DF]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isAr
                  ? 'اكتب سؤالك أو النص الشرعي للتحقق منه (مثال: هل يعبد المسلمون الكعبة؟ أو عزو حديث)...'
                  : 'Ask a question or input a religious claim to verify...'
              }
              className="flex-1 px-4 py-2.5 bg-[#F7F4EC]/60 border border-[#E3E7DF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#147D64] text-sm text-[#18231F] placeholder-[#8A9791]"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-5 py-2.5 min-h-[42px] bg-[#0B3D2E] hover:bg-[#147D64] active:bg-[#082B23] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-xs shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-2"
            >
              <span>{isAr ? 'إرسال' : 'Send'}</span>
              <Send className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
