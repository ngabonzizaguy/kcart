import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  Check, 
  AlertTriangle, 
  Heart, 
  CreditCard, 
  Smartphone,
  Palette,
  Layout,
  Layers,
  Type,
  MousePointer,
  Eye
} from 'lucide-react';

/**
 * DeliGoDesignSystem - Interactive documentation and showcase of the DeliGo Glass Design Language
 * 
 * This component serves as both documentation and a testing ground for the design system.
 * It demonstrates all the key patterns, components, and principles that make up the
 * DeliGo Glass Design Language.
 * 
 * Features:
 * - Interactive color palette showcase
 * - Glass morphism examples
 * - Button variants and states
 * - Typography hierarchy
 * - Icon usage patterns
 * - Layout grid examples
 * - Bilingual content patterns
 * - Mobile-safe spacing examples
 * 
 * TODO: Connect to real design token system for dynamic updates
 * TODO: Add theme switching capabilities
 * TODO: Integrate with Storybook for component documentation
 */
interface DeliGoDesignSystemProps {
  language: 'en' | 'rw';
  onBack: () => void;
}

export function DeliGoDesignSystem({ language, onBack }: DeliGoDesignSystemProps) {
  const [activeSection, setActiveSection] = useState('overview');

  // Bilingual content for the design system documentation
  const content = {
    en: {
      title: 'DeliGo Glass Design Language',
      subtitle: 'A warm, mobile-first design system for food delivery',
      overview: 'Overview',
      colors: 'Colors & Palette',
      typography: 'Typography',
      buttons: 'Buttons & CTAs',
      cards: 'Glass Cards',
      icons: 'Icons & Status',
      layouts: 'Layouts & Grids',
      // Color descriptions
      primaryColor: 'Primary Orange',
      primaryDesc: 'Used for CTAs and key actions',
      backgroundDesc: 'Warm gradient background',
      glassDesc: 'Glass morphism effects',
      successDesc: 'Success states and confirmations',
      warningDesc: 'Warnings and destructive actions',
      // Button examples
      primaryButton: 'Primary Action',
      secondaryButton: 'Secondary Action',
      destructiveButton: 'Report Issue',
      // Card examples
      standardCard: 'Standard Glass Card',
      strongCard: 'Strong Glass Modal',
      cardContent: 'This card demonstrates the standard glass morphism effect used throughout the DeliGo app.',
      // Typography
      mainHeading: 'Main Heading (H1)',
      subHeading: 'Sub Heading (H2)',
      bodyText: 'Body text provides clear, readable content with proper hierarchy.',
      // Status examples
      orderPlaced: 'Order Placed',
      inProgress: 'Preparing',
      completed: 'Delivered',
      issue: 'Issue Reported'
    },
    rw: {
      title: 'Imiterere ya DeliGo Glass',
      subtitle: 'Sisitemu y\'imiterere ishyushye, yibanze ku telefoni yo gutanga ibiryo',
      overview: 'Incamake',
      colors: 'Amabara n\'Igishushanyo',
      typography: 'Inyandiko',
      buttons: 'Buto n\'Ibikorwa',
      cards: 'Amakarita ya Glass',
      icons: 'Udushushanyo n\'Imiterere',
      layouts: 'Imiterere n\'Amatsinda',
      // Color descriptions
      primaryColor: 'Ibara ry\'Ingenzi Orange',
      primaryDesc: 'Rikoreshwa mu bikorwa by\'ingenzi',
      backgroundDesc: 'Mbuganyuma y\'amabara ashyushye',
      glassDesc: 'Ingaruka za glass morphism',
      successDesc: 'Imiterere y\'intsinzi n\'ubwemeza',
      warningDesc: 'Iburira n\'ibikorwa bibi',
      // Button examples
      primaryButton: 'Igikorwa cy\'Ingenzi',
      secondaryButton: 'Igikorwa cy\'Kabiri',
      destructiveButton: 'Tanga Ikibazo',
      // Card examples
      standardCard: 'Ikarita ya Glass Isanzwe',
      strongCard: 'Modal ya Glass Ikomeye',
      cardContent: 'Iyi karita yerekana ingaruka za glass morphism zikoreshwa muri porogaramu ya DeliGo.',
      // Typography
      mainHeading: 'Umutwe Mukuru (H1)',
      subHeading: 'Umutwe Muto (H2)',
      bodyText: 'Inyandiko z\'umubiri zitanga ibirimo byumvikana, bisomeka byoroshye bifite urutonde rw\'imbanze.',
      // Status examples
      orderPlaced: 'Ikurikira Ryashyizweho',
      inProgress: 'Birateguriwa',
      completed: 'Byatanzwe',
      issue: 'Ikibazo Cyatanzwe'
    }
  };

  // Design system sections navigation
  const sections = [
    { id: 'overview', name: content[language].overview, icon: Eye },
    { id: 'colors', name: content[language].colors, icon: Palette },
    { id: 'typography', name: content[language].typography, icon: Type },
    { id: 'buttons', name: content[language].buttons, icon: MousePointer },
    { id: 'cards', name: content[language].cards, icon: Layers },
    { id: 'icons', name: content[language].icons, icon: Package },
    { id: 'layouts', name: content[language].layouts, icon: Layout }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <h2 className="text-gray-800 mb-4">DeliGo Glass Design Language</h2>
        <p className="text-gray-600 mb-4">
          {content[language].subtitle}
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-700">Warm orange accents for appetite appeal</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-full"></div>
            <span className="text-gray-700">Glass morphism for premium feel</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-full"></div>
            <span className="text-gray-700">Cream backgrounds for warmth</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
            <span className="text-gray-700">Mobile-first with safe areas</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderColors = () => (
    <div className="space-y-6">
      {/* Primary Colors */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <h3 className="text-gray-800 mb-4">{content[language].primaryColor}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-orange-500 rounded-xl p-4 text-white">
            <div className="text-sm opacity-90">Primary</div>
            <div className="font-mono text-xs">#f97316</div>
          </div>
          <div className="bg-orange-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-90">Primary Hover</div>
            <div className="font-mono text-xs">#ea580c</div>
          </div>
        </div>
        <p className="text-gray-600 text-sm">{content[language].primaryDesc}</p>
      </div>

      {/* Background Gradients */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <h3 className="text-gray-800 mb-4">Background Gradients</h3>
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 rounded-xl p-4 h-16"></div>
          <p className="text-gray-600 text-sm">{content[language].backgroundDesc}</p>
        </div>
      </div>

      {/* Status Colors */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <h3 className="text-gray-800 mb-4">Status Colors</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-500 rounded-xl p-3 text-white text-center text-sm">
            Success #22c55e
          </div>
          <div className="bg-red-500 rounded-xl p-3 text-white text-center text-sm">
            Error #ef4444
          </div>
        </div>
      </div>
    </div>
  );

  const renderTypography = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <h1 className="text-gray-800 mb-2">{content[language].mainHeading}</h1>
        <h2 className="text-gray-800 mb-2">{content[language].subHeading}</h2>
        <h3 className="text-gray-800 mb-2">Section Heading (H3)</h3>
        <p className="text-gray-600 mb-4">{content[language].bodyText}</p>
        <label className="text-gray-700 text-sm block mb-2">Form Label</label>
        <div className="text-gray-500 text-sm">Supporting text and captions</div>
      </div>
    </div>
  );

  const renderButtons = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <h3 className="text-gray-800 mb-4">Button Variants</h3>
        <div className="space-y-4">
          {/* Primary Button */}
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12">
            {content[language].primaryButton}
          </Button>
          
          {/* Secondary Button */}
          <Button 
            variant="outline" 
            className="w-full border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12"
          >
            {content[language].secondaryButton}
          </Button>
          
          {/* Destructive Button */}
          <Button 
            variant="outline" 
            className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl h-12"
          >
            {content[language].destructiveButton}
          </Button>
          
          {/* Icon Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCards = () => (
    <div className="space-y-6">
      {/* Standard Glass Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <h3 className="text-gray-800 mb-2">{content[language].standardCard}</h3>
        <p className="text-gray-600 text-sm mb-4">{content[language].cardContent}</p>
        <Badge className="bg-orange-100 text-orange-700">Standard Glass</Badge>
      </div>

      {/* Strong Glass Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-white/30">
        <h3 className="text-gray-800 mb-2">{content[language].strongCard}</h3>
        <p className="text-gray-600 text-sm mb-4">
          This card uses stronger glass effects for modals and important overlays.
        </p>
        <Badge className="bg-orange-100 text-orange-700">Strong Glass</Badge>
      </div>
    </div>
  );

  const renderIcons = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <h3 className="text-gray-800 mb-4">Status Indicators</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Success Status */}
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
            <div className="bg-green-500 text-white rounded-full p-2">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <div className="text-green-700 text-sm font-medium">{content[language].completed}</div>
              <div className="text-green-600 text-xs">Success state</div>
            </div>
          </div>

          {/* In Progress Status */}
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
            <div className="bg-orange-500 text-white rounded-full p-2">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-orange-700 text-sm font-medium">{content[language].inProgress}</div>
              <div className="text-orange-600 text-xs">Active state</div>
            </div>
          </div>

          {/* Placed Status */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
            <div className="bg-gray-200 text-gray-600 rounded-full p-2">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <div className="text-gray-700 text-sm font-medium">{content[language].orderPlaced}</div>
              <div className="text-gray-600 text-xs">Initial state</div>
            </div>
          </div>

          {/* Issue Status */}
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
            <div className="bg-red-100 text-red-500 rounded-full p-2">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-red-700 text-sm font-medium">{content[language].issue}</div>
              <div className="text-red-600 text-xs">Error state</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLayouts = () => (
    <div className="space-y-6">
      {/* Two Column Grid */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <h3 className="text-gray-800 mb-4">Two Column Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-100 rounded-xl p-4 text-center text-orange-700">
            Action 1
          </div>
          <div className="bg-orange-100 rounded-xl p-4 text-center text-orange-700">
            Action 2
          </div>
        </div>
      </div>

      {/* Three Column Grid */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <h3 className="text-gray-800 mb-4">Three Column Grid</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-100 rounded-xl p-3 text-center text-gray-600 text-sm">
            Item 1
          </div>
          <div className="bg-gray-100 rounded-xl p-3 text-center text-gray-600 text-sm">
            Item 2  
          </div>
          <div className="bg-gray-100 rounded-xl p-3 text-center text-gray-600 text-sm">
            Item 3
          </div>
        </div>
      </div>

      {/* Mobile Safe Areas */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
        <h3 className="text-gray-800 mb-4">Mobile Safe Areas</h3>
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-3">
            <div className="text-sm text-orange-700">pt-safe - Top safe area</div>
          </div>
          <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-3">
            <div className="text-sm text-orange-700">pb-safe - Bottom safe area</div>
          </div>
          <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-3">
            <div className="text-sm text-orange-700">bottom-nav-spacing - 96px + safe area</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'colors': return renderColors();
      case 'typography': return renderTypography();
      case 'buttons': return renderButtons();
      case 'cards': return renderCards();
      case 'icons': return renderIcons();
      case 'layouts': return renderLayouts();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="flex items-center justify-between p-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{language === 'en' ? 'Back' : 'Subira'}</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-gray-800">{content[language].title}</h1>
            <p className="text-gray-600 text-sm">{content[language].subtitle}</p>
          </div>
          
          <div className="w-16" />
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-2 border border-white/20 mb-6">
          <div className="grid grid-cols-4 gap-2">
            {sections.slice(0, 4).map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                    activeSection === section.id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-xs">{section.name}</span>
                </button>
              );
            })}
          </div>
          
          {/* Second row */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            {sections.slice(4).map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                    activeSection === section.id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-xs">{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}