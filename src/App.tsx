/**
 * MIJHAR (مِجهر) - Primary Application Shell
 * Connects Providers, Navigation, Workspace, Results, Dashboard, Sources, Admin, and Settings.
 */

import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { WorkspacePage } from './components/workspace/WorkspacePage.tsx';
import { ResultsPage } from './components/results/ResultsPage.tsx';
import { DashboardPage } from './components/dashboard/DashboardPage.tsx';
import { SourceTransparencyPage } from './components/sources/SourceTransparencyPage.tsx';
import { AdminReviewPage } from './components/admin/AdminReviewPage.tsx';
import { SettingsPage } from './components/settings/SettingsPage.tsx';
import { TeamAndPartnersSection } from './components/team/TeamAndPartnersSection.tsx';
import { LogoUsageGuideModal } from './components/logo/LogoUsageGuideModal.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { IslamicChatModal } from './components/chat/IslamicChatModal.tsx';
import { PRDModal } from './components/docs/PRDModal.tsx';
import { VerificationRun } from './types/index.ts';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const { locale, isRtl } = useLanguage();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [currentRun, setCurrentRun] = useState<VerificationRun | null>(null);
  const [workspaceInitialText, setWorkspaceInitialText] = useState<string>('');
  const [isLogoGuideOpen, setIsLogoGuideOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPRDOpen, setIsPRDOpen] = useState(false);

  const handleStartVerification = () => {
    setCurrentTab('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerificationComplete = (run: VerificationRun) => {
    setCurrentRun(run);
    setCurrentTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDemoReport = async () => {
    try {
      const res = await fetch('/api/verifications/run-demo-sample');
      if (res.ok) {
        const data = await res.json();
        if (data.run) {
          setCurrentRun(data.run);
          setCurrentTab('results');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback: switch to dashboard or workspace
    setCurrentTab('workspace');
  };

  const handleRecheckText = (text: string) => {
    setWorkspaceInitialText(text);
    setCurrentTab('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistoryRun = (run: VerificationRun) => {
    setCurrentRun(run);
    setCurrentTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EC] text-[#18231F] selection:bg-[#147D64]/20 selection:text-[#0B3D2E] relative">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenLogoGuide={() => setIsLogoGuideOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenPRD={() => setIsPRDOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentTab === 'landing' && (
          <>
            <LandingPage
              onStartVerification={handleStartVerification}
              onViewDemoReport={handleViewDemoReport}
            />
            {/* Embedded Team & Partners on Landing */}
            <div className="border-t border-[#E3E7DF]">
              <TeamAndPartnersSection lang={locale} onOpenPRD={() => setIsPRDOpen(true)} />
            </div>
          </>
        )}

        {currentTab === 'workspace' && (
          <WorkspacePage
            onVerificationComplete={handleVerificationComplete}
            initialText={workspaceInitialText}
          />
        )}

        {currentTab === 'results' && currentRun && (
          <ResultsPage run={currentRun} onRecheck={handleRecheckText} />
        )}

        {currentTab === 'results' && !currentRun && (
          <WorkspacePage onVerificationComplete={handleVerificationComplete} />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            onNewVerification={() => setCurrentTab('workspace')}
            onSelectRun={handleSelectHistoryRun}
          />
        )}

        {currentTab === 'sources' && <SourceTransparencyPage />}

        {currentTab === 'team' && (
          <TeamAndPartnersSection lang={locale} onOpenPRD={() => setIsPRDOpen(true)} />
        )}

        {currentTab === 'admin' && <AdminReviewPage />}

        {currentTab === 'settings' && <SettingsPage />}
      </main>

      {/* Floating AI Islamic Assistant Button */}
      <div className="fixed bottom-6 end-6 z-40 print:hidden">
        <button
          onClick={() => setIsChatOpen(true)}
          className="flex items-center gap-2.5 px-4.5 py-3 min-h-[48px] bg-gradient-to-r from-[#0B3D2E] to-[#147D64] hover:from-[#082B23] hover:to-[#0E4C3A] active:scale-[0.96] text-white rounded-full shadow-xl border-2 border-[#C7A45B]/80 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A45B] focus-visible:ring-offset-2 cursor-pointer"
          aria-label={isRtl ? 'المساعد الذكي للتحقق الإسلامي' : 'Islamic AI Assistant'}
        >
          <Sparkles className="w-5 h-5 text-[#C7A45B] animate-pulse" />
          <span className="font-bold text-xs sm:text-sm">
            {isRtl ? 'المساعد الذكي' : 'AI Assistant'}
          </span>
        </button>
      </div>

      {/* Footer */}
      <Footer onSelectTab={setCurrentTab} onOpenLogoGuide={() => setIsLogoGuideOpen(true)} />

      {/* Modals */}
      <LogoUsageGuideModal
        isOpen={isLogoGuideOpen}
        onClose={() => setIsLogoGuideOpen(false)}
      />
      <AuthModal />
      <IslamicChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        lang={locale}
      />
      <PRDModal
        isOpen={isPRDOpen}
        onClose={() => setIsPRDOpen(false)}
        lang={locale}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
