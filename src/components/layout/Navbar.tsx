/**
 * MIJHAR - Primary Navigation Bar
 */

import React, { useState } from 'react';
import { Logo } from '../logo/Logo.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Globe,
  FileCheck,
  History,
  Database,
  Shield,
  Settings,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Info,
  Sparkles,
  Users,
  FileText,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenLogoGuide: () => void;
  onOpenChat: () => void;
  onOpenPRD: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenLogoGuide,
  onOpenChat,
  onOpenPRD,
}) => {
  const { t, locale, toggleLocale, isRtl } = useLanguage();
  const { user, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isReviewerOrAdmin = user?.role === 'admin' || user?.role === 'reviewer';

  const navItems = [
    { id: 'landing', label: t.navHome, icon: null },
    { id: 'workspace', label: t.navVerify, icon: FileCheck },
    { id: 'dashboard', label: t.navDashboard, icon: History },
    { id: 'sources', label: t.navSources, icon: Database },
    { id: 'team', label: isRtl ? 'الفريق والشركاء' : 'Team & Partners', icon: Users },
    ...(isReviewerOrAdmin ? [{ id: 'admin', label: t.navAdmin, icon: Shield }] : []),
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E3E7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center text-left rtl:text-right focus:outline-none"
            aria-label="MIJHAR Home"
          >
            <Logo variant="horizontal" size="md" />
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 min-h-[38px] rounded-lg text-sm font-medium transition duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-1 cursor-pointer ${
                  active
                    ? 'bg-[#0B3D2E] text-white shadow-xs'
                    : 'text-[#18231F] hover:bg-[#F7F4EC] hover:text-[#147D64]'
                }`}
              >
                {Icon && <Icon size={16} className={active ? 'text-[#C7A45B]' : 'text-[#66736C]'} />}
                <span>{item.label}</span>
                {item.id === 'admin' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#C7A45B]/20 text-[#082B23] font-semibold">
                    {user?.role === 'admin' ? 'Admin' : 'Reviewer'}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Cluster: AI Assistant, PRD, Language Switcher, Logo Guide, Auth */}
        <div className="hidden md:flex items-center gap-2">
          {/* AI Islamic Assistant Modal Button */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] bg-gradient-to-r from-[#0B3D2E] to-[#147D64] hover:from-[#082B23] hover:to-[#0E4C3A] active:scale-[0.96] text-white rounded-lg text-xs font-bold transition shadow-xs border border-[#C7A45B]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A45B] focus-visible:ring-offset-1 cursor-pointer"
            title={isRtl ? 'المساعد الذكي للتحقق الشرعي' : 'Islamic AI Assistant'}
          >
            <Sparkles size={14} className="text-[#C7A45B]" />
            <span>{isRtl ? 'المساعد الذكي' : 'AI Assistant'}</span>
          </button>

          {/* PRD Document Modal Button */}
          <button
            onClick={onOpenPRD}
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] bg-[#F7F4EC] hover:bg-[#E3E7DF] hover:border-[#147D64] active:scale-[0.96] border border-[#E3E7DF] text-[#082B23] rounded-lg text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] cursor-pointer"
            title={isRtl ? 'وثيقة متطلبات المنتج PRD' : 'Product Requirements Document'}
          >
            <FileText size={14} className="text-[#147D64]" />
            <span>{isRtl ? 'وثيقة PRD' : 'PRD'}</span>
          </button>

          {/* Logo usage guide */}
          <button
            onClick={onOpenLogoGuide}
            className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center text-[#66736C] hover:text-[#0B3D2E] hover:bg-[#F7F4EC] active:scale-95 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] cursor-pointer"
            title={t.logoGuide}
            aria-label={t.logoGuide}
          >
            <Info size={18} />
          </button>

          {/* Bilingual Language Switcher */}
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] border border-[#E3E7DF] rounded-lg text-xs font-semibold text-[#18231F] hover:border-[#147D64] hover:bg-[#F7F4EC] hover:text-[#0B3D2E] active:scale-[0.96] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] cursor-pointer"
            aria-label="Toggle language"
          >
            <Globe size={14} className="text-[#147D64]" />
            <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* User Account / Sign In */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 min-h-[38px] rounded-lg border border-[#E3E7DF] hover:border-[#147D64] bg-white transition text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#0B3D2E] text-white flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0)}
                </div>
                <span className="max-w-[110px] truncate">{user.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#147D64]/10 text-[#082B23] font-bold uppercase">
                  {user.role}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute top-full left-0 rtl:left-auto rtl:right-0 mt-2 w-48 bg-white border border-[#E3E7DF] rounded-xl shadow-lg p-2 z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-[#E3E7DF] text-xs">
                    <p className="font-bold text-[#18231F] truncate">{user.name}</p>
                    <p className="text-[#66736C] text-[10px] truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleNavClick('settings');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#18231F] hover:bg-[#F7F4EC] rounded-lg text-left rtl:text-right mt-1 transition cursor-pointer"
                  >
                    <Settings size={14} />
                    <span>{t.navSettings}</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg text-left rtl:text-right transition cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>{t.navSignOut}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-4 py-2 min-h-[38px] bg-[#0B3D2E] text-white rounded-lg text-xs font-semibold hover:bg-[#147D64] active:scale-[0.98] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-1 cursor-pointer"
            >
              <UserIcon size={14} />
              <span>{t.navSignIn}</span>
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLocale}
            className="p-2 border border-[#E3E7DF] rounded-lg text-xs font-semibold text-[#18231F]"
          >
            {locale === 'ar' ? 'EN' : 'عربي'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E3E7DF] bg-white p-4 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between p-3 min-h-[44px] rounded-xl text-sm font-medium active:scale-[0.98] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64] ${
                currentTab === item.id ? 'bg-[#0B3D2E] text-white shadow-xs' : 'text-[#18231F] hover:bg-[#F7F4EC]'
              }`}
            >
              <span>{item.label}</span>
              {item.id === 'admin' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C7A45B] text-[#082B23] font-bold">
                  {user?.role}
                </span>
              )}
            </button>
          ))}

          <div className="pt-2 pb-2 grid grid-cols-2 gap-2 border-t border-[#E3E7DF]">
            <button
              onClick={() => {
                onOpenChat();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2.5 min-h-[44px] bg-[#0B3D2E] hover:bg-[#147D64] active:scale-[0.98] text-white rounded-xl text-xs font-bold transition shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A45B]"
            >
              <Sparkles size={14} className="text-[#C7A45B]" />
              <span>{isRtl ? 'المساعد الذكي' : 'AI Assistant'}</span>
            </button>
            <button
              onClick={() => {
                onOpenPRD();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2.5 min-h-[44px] bg-[#F7F4EC] hover:bg-[#E3E7DF] active:scale-[0.98] text-[#082B23] border border-[#E3E7DF] rounded-xl text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D64]"
            >
              <FileText size={14} className="text-[#147D64]" />
              <span>{isRtl ? 'وثيقة PRD' : 'PRD'}</span>
            </button>
          </div>

          <div className="pt-3 border-t border-[#E3E7DF] flex items-center justify-between">
            <button
              onClick={onOpenLogoGuide}
              className="text-xs text-[#147D64] hover:text-[#0B3D2E] flex items-center gap-1 font-medium p-2 min-h-[44px] rounded-lg transition"
            >
              <Info size={14} />
              <span>{t.logoGuide}</span>
            </button>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-red-600 hover:text-red-700 font-semibold p-2 min-h-[44px] rounded-lg transition"
              >
                {t.navSignOut}
              </button>
            ) : (
              <button
                onClick={() => {
                  openAuthModal();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-semibold text-[#0B3D2E] hover:text-[#147D64] p-2 min-h-[44px] rounded-lg transition"
              >
                {t.navSignIn}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
