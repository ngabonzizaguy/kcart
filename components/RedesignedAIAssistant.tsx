import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageCircle, 
  Camera, 
  Mic, 
  Brain, 
  TrendingUp,
  X,
  ChevronRight,
  Heart
} from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';

interface AIAssistantOption {
  id: string;
  title: { en: string; rw: string };
  description: { en: string; rw: string };
  icon: React.ComponentType<{ className?: string }>;
  badge?: { en: string; rw: string };
  action: () => void;
}

interface RedesignedAIAssistantProps {
  language: 'en' | 'rw';
  isOpen: boolean;
  onClose: () => void;
  onOptionSelect: (optionId: string) => void;
}

export function RedesignedAIAssistant({ 
  language, 
  isOpen, 
  onClose, 
  onOptionSelect 
}: RedesignedAIAssistantProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Content translations
  const content = {
    en: {
      title: 'AI Assistant',
      subtitle: 'How can I help you today?',
      description: 'Choose from AI-powered features to enhance your food delivery experience',
      quickActions: 'Quick Actions',
      smartFeatures: 'Smart Features'
    },
    rw: {
      title: 'Umufasha wa AI',
      subtitle: 'Mbese nashobora kugufasha gute uyu munsi?',
      description: 'Hitamo mu biranga bya AI kugira ngo wongerwe ubunyangamugayo mu gutumiza ibiryo',
      quickActions: 'Ibikorwa Byihuse',
      smartFeatures: 'Ibikoresho Byubwenge'
    }
  };

  // AI Assistant options with iOS-style design
  const aiOptions: AIAssistantOption[] = [
    {
      id: 'chat',
      title: { en: 'Chat with AI', rw: 'Ganira na AI' },
      description: { en: 'Ask questions about restaurants, menu items, or get recommendations', rw: 'Baza ibibazo ku bibanza, ibiryo, cyangwa usabe ibyifuzo' },
      icon: MessageCircle,
      badge: { en: 'Popular', rw: 'Bikunda' },
      action: () => onOptionSelect('chat')
    },
    {
      id: 'food-scan',
      title: { en: 'Scan Food', rw: 'Sikana Ibiryo' },
      description: { en: 'Take a photo of food to get nutritional info and similar dishes', rw: 'Foto ibiryo ubona amakuru y\'intungamubiri n\'ibiryo bisa' },
      icon: Camera,
      action: () => onOptionSelect('food-scan')
    },
    {
      id: 'voice-order',
      title: { en: 'Voice Order', rw: 'Gutumiza mu majwi' },
      description: { en: 'Place orders using voice commands for hands-free experience', rw: 'Tumiza ukoresha amajwi kugira ubone ubunyangamugayo' },
      icon: Mic,
      badge: { en: 'New', rw: 'Gishya' },
      action: () => onOptionSelect('voice-order')
    },
    {
      id: 'smart-recommendations',
      title: { en: 'Smart Recommendations', rw: 'Ibyifuzo Byubwenge' },
      description: { en: 'Get personalized food suggestions based on your preferences and history', rw: 'Bona ibyifuzo byihariye bishingiye ku byakunze n\'amateka yawe' },
      icon: Brain,
      action: () => onOptionSelect('smart-recommendations')
    },
    {
      id: 'trend-analysis',
      title: { en: 'Food Trends', rw: 'Icyerekezo cy\'Ibiryo' },
      description: { en: 'Discover trending dishes and popular restaurants in your area', rw: 'Shakisha ibiryo bikunda n\'ibibanza bikunda mu gace kawe' },
      icon: TrendingUp,
      action: () => onOptionSelect('trend-analysis')
    },
    {
      id: 'dietary-assistant',
      title: { en: 'Dietary Assistant', rw: 'Umufasha mu Kurya' },
      description: { en: 'Get help with dietary restrictions, allergies, and nutrition goals', rw: 'Bona ubufasha mu bujura bwo kurya, allergie, n\'intego z\'intungamubiri' },
      icon: Heart,
      action: () => onOptionSelect('dietary-assistant')
    }
  ];

  // Handle option selection with animation
  const handleOptionSelect = (option: AIAssistantOption) => {
    setSelectedOption(option.id);
    
    // Animate selection then execute action
    setTimeout(() => {
      option.action();
      onClose();
      setSelectedOption(null);
    }, 200);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[80vh] bg-background/80 backdrop-blur-xl border-t border-border/30 rounded-t-3xl"
      >
        {/* Header with Glassy Effect */}
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-3">
            {/* AI Icon with Glow Effect */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-orange-600/30 rounded-2xl blur-lg" />
            </div>
            
            <div>
              <SheetTitle className="text-foreground text-xl font-semibold">
                {content[language].title}
              </SheetTitle>
              <div className="text-muted-foreground text-sm">
                {content[language].subtitle}
              </div>
            </div>
          </div>
          <SheetDescription className="text-muted-foreground text-sm text-left">
            {content[language].description}
          </SheetDescription>
        </SheetHeader>

        {/* Options Grid with Glass Morphism */}
        <div className="space-y-6 pb-6 overflow-y-auto scrollbar-hide">
          {/* Quick Actions Section */}
          <div>
            <h3 className="text-foreground font-medium mb-4 px-1">
              {content[language].quickActions}
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {aiOptions.slice(0, 3).map((option) => {
                const IconComponent = option.icon;
                const isSelected = selectedOption === option.id;
                
                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full p-5 text-left rounded-3xl border transition-all duration-200 ${
                      isSelected 
                        ? 'bg-primary/10 border-primary/30 scale-95' 
                        : 'bg-card/60 backdrop-blur-md border-border/30 hover:bg-card/80 hover:border-border/50'
                    }`}
                    whileTap={{ scale: 0.98 }}
                    layout
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon Container with Glass Effect */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                        isSelected 
                          ? 'bg-primary/20 border border-primary/30' 
                          : 'bg-gradient-to-br from-muted/50 to-muted/80 backdrop-blur-sm'
                      }`}>
                        <IconComponent className={`w-6 h-6 transition-colors ${
                          isSelected ? 'text-primary' : 'text-foreground'
                        }`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-foreground font-medium">
                            {option.title[language]}
                          </h4>
                          {option.badge && (
                            <Badge 
                              variant="secondary" 
                              className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20"
                            >
                              {option.badge[language]}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {option.description[language]}
                        </p>
                      </div>

                      {/* Arrow Indicator */}
                      <ChevronRight className={`w-5 h-5 transition-all ${
                        isSelected 
                          ? 'text-primary translate-x-1' 
                          : 'text-muted-foreground group-hover:translate-x-1'
                      }`} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Smart Features Section */}
          <div>
            <h3 className="text-foreground font-medium mb-4 px-1">
              {content[language].smartFeatures}
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {aiOptions.slice(3).map((option) => {
                const IconComponent = option.icon;
                const isSelected = selectedOption === option.id;
                
                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full p-5 text-left rounded-3xl border transition-all duration-200 ${
                      isSelected 
                        ? 'bg-primary/10 border-primary/30 scale-95' 
                        : 'bg-card/60 backdrop-blur-md border-border/30 hover:bg-card/80 hover:border-border/50'
                    }`}
                    whileTap={{ scale: 0.98 }}
                    layout
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon Container */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                        isSelected 
                          ? 'bg-primary/20 border border-primary/30' 
                          : 'bg-gradient-to-br from-muted/50 to-muted/80 backdrop-blur-sm'
                      }`}>
                        <IconComponent className={`w-6 h-6 transition-colors ${
                          isSelected ? 'text-primary' : 'text-foreground'
                        }`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-foreground font-medium mb-1">
                          {option.title[language]}
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {option.description[language]}
                        </p>
                      </div>

                      {/* Arrow Indicator */}
                      <ChevronRight className={`w-5 h-5 transition-all ${
                        isSelected 
                          ? 'text-primary translate-x-1' 
                          : 'text-muted-foreground'
                      }`} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CSS for hiding scrollbars */}
        <style>
          {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
      </SheetContent>
    </Sheet>
  );
}