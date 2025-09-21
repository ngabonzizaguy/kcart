import React, { useState } from 'react';
import { AIChatScreen } from './AIChatScreen';
import { FoodScanScreen } from './FoodScanScreen';
import { VoiceOrderScreen } from './VoiceOrderScreen';
import { SmartRecommendationsScreen } from './SmartRecommendationsScreen';
import { TrendAnalysisScreen } from './TrendAnalysisScreen';
import { DietaryAssistantScreen } from './DietaryAssistantScreen';
import { AISettings } from './AISettings';
import { RedesignedAIAssistant } from './RedesignedAIAssistant';

interface AIFeaturesNavigatorProps {
  language: 'en' | 'rw';
  onBack: () => void;
  initialScreen?: string;
  onNavigateToVendor?: (vendorId: string) => void;
  onNavigateToCart?: () => void;
  onAddToCart?: (item: any) => void;
}

type AIScreen = 
  | 'assistant'
  | 'chat'
  | 'food-scan'
  | 'voice-order'
  | 'smart-recommendations'
  | 'trend-analysis'
  | 'dietary-assistant'
  | 'settings';

/**
 * AIFeaturesNavigator - Central navigation hub for all AI features
 * 
 * Features:
 * - Redesigned AI Assistant with modern glass design
 * - Chat interface for conversational AI
 * - Food scanning with camera and nutritional analysis
 * - Voice ordering with speech recognition
 * - Smart food recommendations based on preferences
 * - Food trends and analytics dashboard
 * - Dietary assistant for restrictions and nutrition goals
 * - AI settings and preferences management
 * 
 * Design:
 * - Follows DeliGo Glass Design Language
 * - Mobile-first responsive layout
 * - Smooth transitions between screens
 * - Consistent warm color palette with orange accents
 * - Bilingual support (English/Kinyarwanda)
 * 
 * Navigation:
 * - Each screen can navigate back to the main assistant
 * - Settings can be accessed from any screen
 * - Maintains navigation history for smooth user experience
 */
export function AIFeaturesNavigator({ 
  language, 
  onBack, 
  initialScreen = 'assistant',
  onNavigateToVendor,
  onNavigateToCart,
  onAddToCart
}: AIFeaturesNavigatorProps) {
  const [currentScreen, setCurrentScreen] = useState<AIScreen>(initialScreen as AIScreen);
  const [screenHistory, setScreenHistory] = useState<AIScreen[]>(['assistant']);

  const navigateToScreen = (screen: AIScreen) => {
    setScreenHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const navigateBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop(); // Remove current screen
      const previousScreen = newHistory[newHistory.length - 1];
      
      setScreenHistory(newHistory);
      setCurrentScreen(previousScreen);
    } else {
      // If no history, go back to main app
      onBack();
    }
  };

  const handleOptionSelect = (optionId: string) => {
    switch (optionId) {
      case 'chat':
        navigateToScreen('chat');
        break;
      case 'food-scan':
        navigateToScreen('food-scan');
        break;
      case 'voice-order':
        navigateToScreen('voice-order');
        break;
      case 'smart-recommendations':
        navigateToScreen('smart-recommendations');
        break;
      case 'trend-analysis':
        navigateToScreen('trend-analysis');
        break;
      case 'dietary-assistant':
        navigateToScreen('dietary-assistant');
        break;
      case 'settings':
        navigateToScreen('settings');
        break;
      default:
        console.log('Unknown AI option:', optionId);
    }
  };

  // Render current screen
  switch (currentScreen) {
    case 'assistant':
      return (
        <RedesignedAIAssistant
          language={language}
          isOpen={true}
          onClose={onBack}
          onOptionSelect={handleOptionSelect}
        />
      );

    case 'chat':
      return (
        <AIChatScreen
          language={language}
          onBack={navigateBack}
          onNavigateToVendor={(vendorId) => {
            if (onNavigateToVendor) {
              onNavigateToVendor(vendorId);
            } else {
              console.log('Navigate to vendor:', vendorId);
              alert(language === 'en' ? `Navigating to ${vendorId} restaurant...` : `Kujya kuri resitora ${vendorId}...`);
            }
          }}
          onNavigateToCart={() => {
            if (onNavigateToCart) {
              onNavigateToCart();
            } else {
              console.log('Navigate to cart');
              alert(language === 'en' ? 'Opening cart...' : 'Gufungura cart...');
            }
          }}
          onAddToCart={onAddToCart}
        />
      );

    case 'food-scan':
      return (
        <FoodScanScreen
          language={language}
          onBack={navigateBack}
        />
      );

    case 'voice-order':
      return (
        <VoiceOrderScreen
          language={language}
          onBack={navigateBack}
        />
      );

    case 'smart-recommendations':
      return (
        <SmartRecommendationsScreen
          language={language}
          onBack={navigateBack}
        />
      );

    case 'trend-analysis':
      return (
        <TrendAnalysisScreen
          language={language}
          onBack={navigateBack}
        />
      );

    case 'dietary-assistant':
      return (
        <DietaryAssistantScreen
          language={language}
          onBack={navigateBack}
        />
      );

    case 'settings':
      return (
        <AISettings
          language={language}
          onBack={navigateBack}
        />
      );

    default:
      return (
        <RedesignedAIAssistant
          language={language}
          isOpen={true}
          onClose={onBack}
          onOptionSelect={handleOptionSelect}
        />
      );
  }
}