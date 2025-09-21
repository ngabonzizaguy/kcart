import React, { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Sparkles, ChefHat, HelpCircle, MessageCircle, Zap, Utensils, Search, ArrowRight, Settings } from 'lucide-react';
import { AISettings } from './AISettings';

interface AIAssistantProps {
  language: 'en' | 'rw';
  context?: 'home' | 'vendor' | 'cart' | 'tracking';
  isOpen?: boolean;
  onClose?: () => void;
}

interface AssistantOption {
  id: string;
  title: { en: string; rw: string };
  description: { en: string; rw: string };
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  featured?: boolean;
}

export function AIAssistant({ language, context = 'home', isOpen: controlledOpen, onClose }: AIAssistantProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };
  const handleOpen = () => {
    if (controlledOpen === undefined) {
      setInternalOpen(true);
    }
  };

  const content = {
    en: {
      title: 'AI Assistant',
      subtitle: 'How can I help you today?',
      smartMeals: 'Smart Meals',
      smartMealsDesc: 'Get personalized meal recommendations',
      orderHelp: 'Order Help',
      orderHelpDesc: 'Get assistance with your order',
      chatVendor: 'Chat with Vendor',
      chatVendorDesc: 'Connect directly with the restaurant',
      findFood: 'Find Food',
      findFoodDesc: 'Discover new restaurants near you',
      trackOrder: 'Track Order',
      trackOrderDesc: 'Get real-time delivery updates',
      nutritionInfo: 'Nutrition Info',
      nutritionInfoDesc: 'Get nutritional information',
      aiSettings: 'AI Settings',
      aiSettingsDesc: 'Customize AI preferences',
      featuredTitle: 'Quick Actions',
      allOptionsTitle: 'More Options',
      poweredBy: 'Powered by AI'
    },
    rw: {
      title: 'Umufasha wa AI',
      subtitle: 'Nshobora kugufasha nte uyu munsi?',
      smartMeals: 'Ibiryo Byubwenge',
      smartMealsDesc: 'Boneka ibiryo byawe byihariye',
      orderHelp: 'Ubufasha bw\'Ikurikira',
      orderHelpDesc: 'Boneka ubufasha ku kurikira ryawe',
      chatVendor: 'Ikiganiro n\'Ububanza',
      chatVendorDesc: 'Vugana na resitora',
      findFood: 'Shakisha Ibiryo',
      findFoodDesc: 'Menya ibibanza bishya hafi yawe',
      trackOrder: 'Gukurikirana Ikurikira',
      trackOrderDesc: 'Boneka amakuru ya nyuma',
      nutritionInfo: 'Amakuru y\'Intungamubiri',
      nutritionInfoDesc: 'Boneka amakuru y\'intungamubiri',
      aiSettings: 'Igenamiterere rya AI',
      aiSettingsDesc: 'Hindura ibyifuzo bya AI',
      featuredTitle: 'Ibikorwa Byihuse',
      allOptionsTitle: 'Amahitamo Andi',
      poweredBy: 'Bikozwe na AI'
    }
  };

  const getContextualOptions = (): AssistantOption[] => {
    const baseOptions: AssistantOption[] = [
      {
        id: 'smart-meals',
        title: content[language].smartMeals,
        description: content[language].smartMealsDesc,
        icon: ChefHat,
        featured: true,
        action: () => {
          handleClose();
          alert(language === 'en' 
            ? 'AI is analyzing your preferences to suggest perfect meals...' 
            : 'AI irimo isesengura ibyo ukunze kugira ngo ikugire ibyifuzo byiza...'
          );
        }
      },
      {
        id: 'order-help',
        title: content[language].orderHelp,
        description: content[language].orderHelpDesc,
        icon: HelpCircle,
        featured: true,
        action: () => {
          handleClose();
          alert(language === 'en' 
            ? 'Opening order assistance chat...' 
            : 'Gufungura ikiganiro cy\'ubufasha...'
          );
        }
      }
    ];

    // AI Settings option for all contexts
    const settingsOption: AssistantOption = {
      id: 'ai-settings',
      title: content[language].aiSettings,
      description: content[language].aiSettingsDesc,
      icon: Settings,
      action: () => {
        handleClose();
        setShowSettings(true);
      }
    };

    // Add context-specific options
    switch (context) {
      case 'home':
        return [
          ...baseOptions,
          {
            id: 'find-food',
            title: content[language].findFood,
            description: content[language].findFoodDesc,
            icon: Search,
            action: () => {
              handleClose();
              alert(language === 'en' 
                ? 'AI is searching for restaurants near you...' 
                : 'AI irimo gushakisha ibibanza biri hafi yawe...'
              );
            }
          },
          settingsOption
        ];
      
      case 'vendor':
        return [
          ...baseOptions,
          {
            id: 'chat-vendor',
            title: content[language].chatVendor,
            description: content[language].chatVendorDesc,
            icon: MessageCircle,
            featured: true,
            action: () => {
              handleClose();
              alert(language === 'en' 
                ? 'Connecting you with the restaurant...' 
                : 'Kuguhuzaguza na resitora...'
              );
            }
          },
          {
            id: 'nutrition-info',
            title: content[language].nutritionInfo,
            description: content[language].nutritionInfoDesc,
            icon: Utensils,
            action: () => {
              handleClose();
              alert(language === 'en' 
                ? 'Loading nutritional information...' 
                : 'Gutangiza amakuru y\'intungamubiri...'
              );
            }
          },
          settingsOption
        ];
      
      case 'cart':
      case 'tracking':
        return [
          ...baseOptions,
          {
            id: 'track-order',
            title: content[language].trackOrder,
            description: content[language].trackOrderDesc,
            icon: Zap,
            featured: true,
            action: () => {
              handleClose();
              alert(language === 'en' 
                ? 'Getting real-time order updates...' 
                : 'Kubona amakuru ya nyuma y\'ikurikira...'
              );
            }
          },
          settingsOption
        ];
      
      default:
        return [...baseOptions, settingsOption];
    }
  };

  // Show AI Settings page
  if (showSettings) {
    return (
      <AISettings
        language={language}
        onBack={() => setShowSettings(false)}
      />
    );
  }

  const options = getContextualOptions();
  const featuredOptions = options.filter(option => option.featured);
  const regularOptions = options.filter(option => !option.featured);

  return (
    <>
      {/* AI Assistant Modal Sheet */}
      <Sheet open={isOpen} onOpenChange={(open) => open ? handleOpen() : handleClose()}>
        <SheetContent 
          side="bottom" 
          className="bg-background border-t border-border rounded-t-3xl h-[70vh] flex flex-col"
        >
          {/* Drag Handle */}
          <div className="mx-auto w-12 h-1.5 bg-muted rounded-full mb-4 flex-shrink-0"></div>
          
          <SheetHeader className="text-center pb-4 flex-shrink-0">
            {/* AI Icon */}
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <SheetTitle className="text-foreground text-xl font-medium">
              {content[language].title}
            </SheetTitle>
            
            <SheetDescription className="text-muted-foreground">
              {content[language].subtitle}
            </SheetDescription>
            
            {/* Status Indicator */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground text-xs">{content[language].poweredBy}</span>
            </div>
          </SheetHeader>

          {/* Content - Now scrollable naturally */}
          <div className="flex-1 min-h-0">
            {/* Featured Options */}
            {featuredOptions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-foreground font-medium mb-3 px-2">
                  {content[language].featuredTitle}
                </h3>
                <div className="space-y-3">
                  {featuredOptions.map((option) => {
                    const IconComponent = option.icon;
                    
                    return (
                      <button
                        key={option.id}
                        onClick={option.action}
                        className="w-full p-4 bg-card border-2 border-border rounded-2xl hover:border-orange-300 hover:bg-orange-50 hover:shadow-lg transition-all duration-300 text-left group"
                      >
                        <div className="flex items-center gap-3">
                          {/* Option Icon */}
                          <div className="w-12 h-12 bg-orange-100 group-hover:bg-orange-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300">
                            <IconComponent className="w-6 h-6 text-orange-600" />
                          </div>

                          {/* Option Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-card-foreground group-hover:text-orange-700 transition-colors font-medium mb-1">
                              {option.title[language]}
                            </h4>
                            <p className="text-muted-foreground text-sm">
                              {option.description[language]}
                            </p>
                          </div>

                          {/* Arrow Indicator */}
                          <div className="text-orange-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all duration-200">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Regular Options */}
            {regularOptions.length > 0 && (
              <div className="mb-4">
                <h3 className="text-foreground font-medium mb-3 px-2">
                  {content[language].allOptionsTitle}
                </h3>
                <div className="space-y-2">
                  {regularOptions.map((option) => {
                    const IconComponent = option.icon;
                    
                    return (
                      <button
                        key={option.id}
                        onClick={option.action}
                        className="w-full p-3 bg-card border border-border rounded-xl hover:border-orange-200 hover:bg-orange-50 hover:shadow-md transition-all duration-200 text-left group"
                      >
                        <div className="flex items-center gap-3">
                          {/* Option Icon */}
                          <div className="w-10 h-10 bg-muted group-hover:bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                            <IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-orange-600 transition-colors" />
                          </div>

                          {/* Option Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-card-foreground group-hover:text-orange-700 transition-colors font-medium text-sm mb-1">
                              {option.title[language]}
                            </h4>
                            <p className="text-muted-foreground text-xs">
                              {option.description[language]}
                            </p>
                          </div>

                          {/* Arrow Indicator */}
                          <div className="text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-200">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}