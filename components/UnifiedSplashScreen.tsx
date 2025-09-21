import React, { useState } from 'react';
import { SplashScreen } from './SplashScreen';
import { RoleSelectionScreen } from './RoleSelectionScreen';
import { RoleSpecificOnboarding } from './RoleSpecificOnboarding';
import { LoginScreen } from './LoginScreen';
import { MainApp } from './MainApp';
import { VendorDashboard } from './VendorDashboard';
import { ErrorBoundary } from './ErrorBoundary';

/**
 * UnifiedSplashScreen - Production Role-Aware User Journey
 * 
 * PRODUCTION-READY COMPLETE FLOW:
 * 1. SplashScreen - DeliGo branding + language selection
 * 2. RoleSelectionScreen - Choose Customer or Vendor experience
 * 3. RoleSpecificOnboarding - Role-appropriate feature walkthrough
 * 4. LoginScreen - Role-aware authentication (Phone/Demo modes)
 * 5. MainApp (customers) or VendorDashboard (vendors)
 * 
 * TESTING FLOWS AVAILABLE:
 * - Customer Flow: Complete food delivery experience
 * - Vendor Flow: Restaurant management dashboard
 * - Language Selection: English/Kinyarwanda support
 * - Demo Modes: Immediate access without authentication
 * 
 * PRODUCTION FEATURES:
 * - No URL parameters required
 * - Complete working experiences for both roles
 * - Seamless navigation and state management
 * - Mobile-first responsive design
 * - Error handling and fallback states
 */
interface UnifiedSplashScreenProps {
  onComplete?: () => void;
}

type FlowStep = 'splash' | 'roleSelection' | 'onboarding' | 'login' | 'app';
type UserRole = 'customer' | 'vendor' | null;

export function UnifiedSplashScreen({ onComplete }: UnifiedSplashScreenProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('splash');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'rw'>('en');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Error recovery function
  const handleError = (errorMessage: string) => {
    console.error('UnifiedSplashScreen Error:', errorMessage);
    setError(errorMessage);
    // Auto-recover after 3 seconds by going back to splash
    setTimeout(() => {
      setError(null);
      setCurrentStep('splash');
      setSelectedRole(null);
    }, 3000);
  };

  // Handle language selection from SplashScreen
  const handleLanguageSelection = (language: 'en' | 'rw') => {
    setSelectedLanguage(language);
    setCurrentStep('roleSelection');
  };

  // Handle role selection
  const handleRoleSelection = (role: 'customer' | 'vendor') => {
    setSelectedRole(role);
    setCurrentStep('onboarding');
  };

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setCurrentStep('login');
  };

  // Handle login completion
  const handleLoginComplete = () => {
    setIsAuthenticated(true);
    setCurrentStep('app');
  };

  // Handle navigation back steps
  const handleBackToSplash = () => {
    setCurrentStep('splash');
    setSelectedRole(null);
  };

  const handleBackToRoleSelection = () => {
    setCurrentStep('roleSelection');
  };

  const handleBackToOnboarding = () => {
    setCurrentStep('onboarding');
  };

  // Skip entire onboarding flow (for returning users)
  const handleSkipToLogin = () => {
    setCurrentStep('login');
  };

  // Direct login for testing
  const handleGuestLogin = () => {
    setIsAuthenticated(true);
    setCurrentStep('app');
  };

  // Show error state if something goes wrong
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">The app will restart automatically in a moment...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full animate-pulse w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  // Render appropriate screen based on current step
  return (
    <ErrorBoundary>
      {(() => {
        try {
          switch (currentStep) {
            case 'splash':
              return (
                <SplashScreen 
                  onLanguageSelect={handleLanguageSelection}
                  onSkipToLogin={handleSkipToLogin}
                />
              );

            case 'roleSelection':
              return (
                <RoleSelectionScreen
                  language={selectedLanguage}
                  onRoleSelect={handleRoleSelection}
                  onBack={handleBackToSplash}
                />
              );

            case 'onboarding':
              if (!selectedRole) {
                // Fallback to role selection if no role selected
                return (
                  <RoleSelectionScreen
                    language={selectedLanguage}
                    onRoleSelect={handleRoleSelection}
                    onBack={handleBackToSplash}
                  />
                );
              }
              return (
                <RoleSpecificOnboarding
                  language={selectedLanguage}
                  userRole={selectedRole}
                  onComplete={handleOnboardingComplete}
                  onBack={handleBackToRoleSelection}
                />
              );

            case 'login':
              return (
                <LoginScreen
                  language={selectedLanguage}
                  userRole={selectedRole}
                  onLoginSuccess={handleLoginComplete}
                  onGuestLogin={handleGuestLogin}
                  onBack={handleBackToOnboarding}
                />
              );

            case 'app':
              // Render appropriate app based on user role
              if (selectedRole === 'vendor') {
                return (
                  <VendorDashboard
                    language={selectedLanguage}
                    onBack={() => setCurrentStep('login')}
                  />
                );
              } else {
                // Default to customer experience (including guest users)
                return (
                  <MainApp 
                    initialLanguage={selectedLanguage}
                    onLogout={() => setCurrentStep('login')}
                  />
                );
              }

            default:
              return (
                <SplashScreen 
                  onLanguageSelect={handleLanguageSelection}
                  onSkipToLogin={handleSkipToLogin}
                />
              );
          }
        } catch (err) {
          // Handle any rendering errors
          handleError(err instanceof Error ? err.message : 'Unknown error occurred');
          return null;
        }
      })()}
    </ErrorBoundary>
  );
}