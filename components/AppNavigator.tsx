import React, { useState } from 'react';
import { Button } from './ui/button';
import { SplashScreen } from './SplashScreen';
import { HomeScreen } from './HomeScreen';
import { VendorProfile } from './VendorProfile';
import { CartScreen } from './CartScreen';
import { OrderTracking } from './OrderTracking';
import { LoginScreen } from './LoginScreen';
import { BlockchainCenter } from './BlockchainCenter';
import { AIFeaturesNavigator } from './AIFeaturesNavigator';
import { ScrollTest } from './ScrollTest';

type Screen = 'splash' | 'login' | 'home' | 'vendor' | 'cart' | 'tracking' | 'blockchain' | 'ai' | 'scroll-test';

/**
 * Development Navigator Component
 * This component allows easy navigation between all screens for testing purposes.
 * In production, this would be replaced with proper routing or the main SplashScreen flow.
 */
export function AppNavigator() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [language, setLanguage] = useState<'en' | 'rw'>('en');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      
      case 'login':
        return (
          <LoginScreen
            language={language}
            onLanguageChange={setLanguage}
            onBack={() => setCurrentScreen('splash')}
            onLogin={() => setCurrentScreen('home')}
            onContinueAsGuest={() => setCurrentScreen('home')}
          />
        );
      
      case 'home':
        return (
          <HomeScreen
            language={language}
            onLanguageChange={setLanguage}
            isGuest={false}
          />
        );
      
      case 'vendor':
        return (
          <VendorProfile
            language={language}
            onBack={() => setCurrentScreen('home')}
          />
        );
      
      case 'cart':
        return (
          <CartScreen
            language={language}
            onBack={() => setCurrentScreen('vendor')}
            onCheckout={() => setCurrentScreen('tracking')}
          />
        );
      
      case 'tracking':
        return (
          <OrderTracking
            language={language}
            onBack={() => setCurrentScreen('cart')}
          />
        );

      case 'blockchain':
        return (
          <BlockchainCenter
            language={language}
            onBack={() => setCurrentScreen('home')}
          />
        );

      case 'ai':
        return (
          <AIFeaturesNavigator
            language={language}
            onBack={() => setCurrentScreen('home')}
          />
        );

      case 'scroll-test':
        return (
          <ScrollTest
            onBack={() => setCurrentScreen('home')}
          />
        );
      
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="size-full relative">
      {/* Development Navigation Bar - Only show in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-white p-2 z-50 flex gap-2 overflow-x-auto">
          <Button
            size="sm"
            variant={currentScreen === 'splash' ? 'default' : 'ghost'}
            onClick={() => setCurrentScreen('splash')}
            className="text-xs whitespace-nowrap"
          >
            Splash
          </Button>
          <Button
            size="sm"
            variant={currentScreen === 'login' ? 'default' : 'ghost'}
            onClick={() => setCurrentScreen('login')}
            className="text-xs whitespace-nowrap"
          >
            Login
          </Button>
          <Button
            size="sm"
            variant={currentScreen === 'home' ? 'default' : 'ghost'}
            onClick={() => setCurrentScreen('home')}
            className="text-xs whitespace-nowrap"
          >
            Home
          </Button>
          <Button
            size="sm"
            variant={currentScreen === 'vendor' ? 'default' : 'ghost'}
            onClick={() => setCurrentScreen('vendor')}
            className="text-xs whitespace-nowrap"
          >
            Vendor
          </Button>
          <Button
            size="sm"
            variant={currentScreen === 'cart' ? 'default' : 'ghost'}
            onClick={() => setCurrentScreen('cart')}
            className="text-xs whitespace-nowrap"
          >
            Cart
          </Button>
          <Button
            size="sm"
            variant={currentScreen === 'tracking' ? 'default' : 'ghost'}
            onClick={() => setCurrentScreen('tracking')}
            className="text-xs whitespace-nowrap"
          >
            Tracking
          </Button>
          <Button
            size="sm"
            variant={currentScreen === 'blockchain' ? 'default' : 'ghost'}
            onClick={() => setCurrentScreen('blockchain')}
            className="text-xs whitespace-nowrap"
          >
            Blockchain
          </Button>
          <Button
            size="sm"
            variant={currentScreen === 'ai' ? 'default' : 'ghost'}
            onClick={() => setCurrentScreen('ai')}
            className="text-xs whitespace-nowrap"
          >
            AI Features
          </Button>
          <Button
            size="sm"
            variant={currentScreen === 'scroll-test' ? 'default' : 'ghost'}
            onClick={() => setCurrentScreen('scroll-test')}
            className="text-xs whitespace-nowrap"
          >
            Scroll Test
          </Button>
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant={language === 'en' ? 'default' : 'ghost'}
              onClick={() => setLanguage('en')}
              className="text-xs"
            >
              EN
            </Button>
            <Button
              size="sm"
              variant={language === 'rw' ? 'default' : 'ghost'}
              onClick={() => setLanguage('rw')}
              className="text-xs"
            >
              RW
            </Button>
          </div>
        </div>
      )}
      
      {/* Main Screen Content */}
      <div className={process.env.NODE_ENV === 'development' ? 'pt-12' : ''}>
        {renderScreen()}
      </div>
    </div>
  );
}