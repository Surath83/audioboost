"use client";

import { useState, useEffect } from "react";
import { SettingsProvider } from "@/contexts/settings-context";
import HomePage from "@/components/home-page";
import ProfilePage from "@/components/profile-page";
import TuningPage from "@/components/tuning-page";
import BottomNav from "@/components/bottom-nav";
import MobileFrame from "@/components/mobile-frame";
import LoginPage from "@/components/login-page";
import SignupPage from "@/components/signup-page";
import { useAuth } from "@/hooks/use-auth";
import { AuthProvider } from "@/contexts/auth-context";
import AppLoading from "@/components/app-loading";
import { useAudioProcessor } from "@/hooks/use-audio-processor";
import { useNotifications } from "@/hooks/use-notifications";

type Page = "login" | "signup" | "app";

function AppContent() {
  const [activeTab, setActiveTab] = useState<"home" | "tuning" | "profile">("home");
  const { user, isInitialized } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>("login");

  const { showNotification, closeNotification } = useNotifications();
  const audioProcessor = useAudioProcessor();

  // ✅ Only run on client
  const isBrowser = typeof window !== "undefined" && typeof navigator !== "undefined";

  useEffect(() => {
    if (isInitialized) {
      if (user) {
        setCurrentPage("app");
      } else if (currentPage !== "signup") {
        setCurrentPage("login");
        if (audioProcessor.status === "running") {
          audioProcessor.stopProcessing();
        }
      }
    }
  }, [user, isInitialized, currentPage, audioProcessor]);

  useEffect(() => {
    if (!isBrowser) return; // prevent SSR errors

    if (audioProcessor.status === "running") {
      showNotification("Dhvani is Active", "Audio processing is running in the background.");
    } else {
      closeNotification();
    }

    return () => {
      closeNotification();
    };
  }, [audioProcessor.status, showNotification, closeNotification, isBrowser]);

  useEffect(() => {
    if (!isBrowser) return;

    const handleBeforeUnload = () => {
      if (audioProcessor.status === "running") {
        audioProcessor.stopProcessing();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [audioProcessor, isBrowser]);

  if (!isInitialized) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <MobileFrame>
          <AppLoading />
        </MobileFrame>
      </main>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage audioProcessor={audioProcessor} />;
      case "tuning":
        return <TuningPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <HomePage audioProcessor={audioProcessor} />;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <LoginPage onNavigateToSignup={() => setCurrentPage("signup")} />;
      case "signup":
        return <SignupPage onNavigateToLogin={() => setCurrentPage("login")} />;
      case "app":
        return (
          <>
            <div className="flex-1 overflow-y-auto bg-background text-foreground relative">
              {renderContent()}
            </div>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </>
        );
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <MobileFrame>{renderPage()}</MobileFrame>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
}
