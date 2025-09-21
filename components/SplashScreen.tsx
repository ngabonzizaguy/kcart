import React, { useState } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { OnboardingCarousel } from './OnboardingCarousel';
import { LoginScreen } from './LoginScreen';
import { HomeScreen } from './HomeScreen';

interface SplashScreenProps {
  onLanguageSelect?: (language: 'en' | 'rw') => void;
  onSkipToLogin?: () => void;
}

export function SplashScreen({ onLanguageSelect, onSkipToLogin }: SplashScreenProps = {}) {
  const [language, setLanguage] = useState<'en' | 'rw'>('en');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const handleGetStarted = () => {
    if (onLanguageSelect) {
      onLanguageSelect(language);
    } else {
      setShowLogin(true);
    }
  };

  const startOnboarding = () => {
    if (onLanguageSelect) {
      onLanguageSelect(language);
    } else {
      setShowOnboarding(true);
    }
  };

  const handleSkipIntro = () => {
    if (onSkipToLogin) {
      onSkipToLogin();
    } else {
      setShowLogin(true);
    }
  };

  const handleBackToSplash = () => {
    setShowLogin(false);
    setShowOnboarding(false);
  };

  const handleLogin = () => {
    setIsGuest(false);
    setShowHome(true);
  };

  const handleContinueAsGuest = () => {
    setIsGuest(true);
    setShowHome(true);
  };

  // Show home screen
  if (showHome) {
    return (
      <HomeScreen
        language={language}
        onLanguageChange={setLanguage}
        isGuest={isGuest}
      />
    );
  }

  // Show login screen
  if (showLogin) {
    return (
      <LoginScreen
        language={language}
        onLanguageChange={setLanguage}
        onBack={handleBackToSplash}
        onLogin={handleLogin}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  // Show onboarding carousel
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col">
        {/* Header with Language Selector */}
        <div className="flex justify-end p-6">
          <LanguageSelector 
            selectedLanguage={language} 
            onLanguageChange={setLanguage} 
          />
        </div>

        {/* Onboarding Carousel */}
        <OnboardingCarousel 
          language={language} 
          onGetStarted={handleGetStarted} 
        />
      </div>
    );
  }

  // Show initial splash screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col items-center justify-center p-6">
      {/* Language Selector */}
      <div className="absolute top-6 right-6">
        <LanguageSelector 
          selectedLanguage={language} 
          onLanguageChange={setLanguage} 
        />
      </div>

      {/* Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-8">
          {/* DeliGo Logo */}
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-6">
            <div className="text-6xl font-bold text-orange-500 text-center">
              DeliGo
            </div>
            <div className="text-orange-400 text-center mt-2">
              🍽️
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            {language === 'en' ? 'Welcome to DeliGo' : 'Murakaza neza kuri DeliGo'}
          </h1>
          <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
            {language === 'en' 
              ? 'Your favorite food delivered fast and fresh to your doorstep' 
              : 'Ibiryo ukunze byoherezwa byihuse kandi bishya ku rugi rwawe'
            }
          </p>
        </div>

        {/* Get Started Button */}
        <button
          onClick={startOnboarding}
          className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg"
        >
          {language === 'en' ? 'Get Started' : 'Tangira'}
        </button>

        {/* Skip Option */}
        <button
          onClick={handleSkipIntro}
          className="mt-6 text-gray-500 hover:text-gray-700 transition-colors"
        >
          {language === 'en' ? 'Skip intro' : 'Simbuka intangiriro'}
        </button>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-sm">
        {language === 'en' ? '© 2025 DeliGo. All rights reserved.' : '© 2025 DeliGo. Uburenganzira bwose'}
      </div>
    </div>
  );
}