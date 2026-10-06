/**
 * MIJHAR - Authentication & Role Selector Modal
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { Logo } from '../logo/Logo.tsx';
import { X, Shield, BookOpen, User as UserIcon, Check } from 'lucide-react';
import { UserRole } from '../../types/index.ts';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, signup, switchDemoRole, user } = useAuth();
  const { t, isRtl } = useLanguage();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    let success = false;
    if (mode === 'login') {
      success = await login(email, password);
      if (!success) setErrorMessage('بيانات الدخول غير صحيحة. يمكنك تجربة الدخول السريع أدناه.');
    } else {
      success = await signup(name, email, password);
      if (!success) setErrorMessage('تعذر إنشاء الحساب. يُرجى التحقق من الحقول.');
    }

    setLoading(false);
  };

  const handleRoleSelect = async (role: UserRole) => {
    setLoading(true);
    await switchDemoRole(role);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E3E7DF] p-6 md:p-8">
        <button
          onClick={closeAuthModal}
          className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 text-gray-400 hover:text-gray-700 rounded-lg transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <Logo variant="icon" size="lg" className="mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#082B23] font-arabic">
            {mode === 'login' ? t.authModalTitleLogin : t.authModalTitleSignup}
          </h2>
          <p className="text-xs text-[#66736C] mt-1">{t.authModalDesc}</p>
        </div>

        {errorMessage && (
          <div className="p-3 mb-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[#18231F] mb-1">{t.fieldName}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E3E7DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#147D64]"
                placeholder={isRtl ? 'مثال: عبد الله أحمد' : 'e.g., Abdullah Ahmed'}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#18231F] mb-1">{t.fieldEmail}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E3E7DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#147D64]"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#18231F] mb-1">{t.fieldPassword}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E3E7DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#147D64]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#0B3D2E] text-white rounded-lg text-sm font-semibold hover:bg-[#147D64] transition disabled:opacity-50"
          >
            {loading ? '...' : mode === 'login' ? t.btnLogin : t.btnSignup}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-xs text-[#147D64] hover:underline font-medium"
          >
            {mode === 'login' ? t.dontHaveAccount : t.alreadyHaveAccount}
          </button>
        </div>

        {/* Quick Demo Roles Selector */}
        <div className="mt-6 pt-5 border-t border-[#E3E7DF]">
          <span className="block text-[11px] font-semibold text-[#66736C] mb-3 text-center">
            {t.demoAccountsTitle}
          </span>
          <div className="space-y-2">
            <button
              onClick={() => handleRoleSelect('admin')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition ${
                user?.role === 'admin'
                  ? 'border-[#C7A45B] bg-[#C7A45B]/15 text-[#082B23]'
                  : 'border-[#E3E7DF] hover:bg-[#F7F4EC] text-[#18231F]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#C7A45B]" />
                <span>{t.demoAdminBtn}</span>
              </div>
              {user?.role === 'admin' && <Check size={14} className="text-[#147D64]" />}
            </button>

            <button
              onClick={() => handleRoleSelect('reviewer')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition ${
                user?.role === 'reviewer'
                  ? 'border-[#147D64] bg-[#147D64]/10 text-[#082B23]'
                  : 'border-[#E3E7DF] hover:bg-[#F7F4EC] text-[#18231F]'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#147D64]" />
                <span>{t.demoReviewerBtn}</span>
              </div>
              {user?.role === 'reviewer' && <Check size={14} className="text-[#147D64]" />}
            </button>

            <button
              onClick={() => handleRoleSelect('user')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition ${
                user?.role === 'user'
                  ? 'border-[#147D64] bg-[#147D64]/10 text-[#082B23]'
                  : 'border-[#E3E7DF] hover:bg-[#F7F4EC] text-[#18231F]'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserIcon size={16} className="text-[#5A6B63]" />
                <span>{t.demoUserBtn}</span>
              </div>
              {user?.role === 'user' && <Check size={14} className="text-[#147D64]" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
