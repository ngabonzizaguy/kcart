import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MessageCircle, 
  Camera, 
  Mic, 
  Search, 
  Heart,
  Share2,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { motion, AnimatePresence } from 'motion/react';

interface FABAction {
  id: string;
  title: { en: string; rw: string };
  description: { en: string; rw: string };
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  action: () => void;
}

interface FloatingActionButtonProps {
  language: 'en' | 'rw';
  onActionSelect: (actionId: string) => void;
}

export function FloatingActionButton({ language, onActionSelect }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  // Content translations
  const content = {
    en: {
      title: 'Quick Actions',
      subtitle: 'What would you like to do?',
      description: 'Access AI features and quick actions to enhance your experience'
    },
    rw: {
      title: 'Ibikorwa Byihuse',
      subtitle: 'Ese ushaka gukora iki?',
      description: 'Koresha ibikoresho bya AI n\'ibikorwa byihuse kugira wongerwe ubunyangamugayo'
    }
  };

  // FAB action options
  const fabActions: FABAction[] = [
    {
      id: 'ai-chat',
      title: { en: 'AI Assistant', rw: 'Umufasha wa AI' },
      description: { en: 'Chat with AI for recommendations', rw: 'Ganira na AI usabe ibyifuzo' },
      icon: MessageCircle,
      color: 'from-blue-500 to-blue-600',
      action: () => onActionSelect('ai-chat')
    },
    {
      id: 'scan-food',
      title: { en: 'Scan Food', rw: 'Sikana Ibiryo' },
      description: { en: 'Take photo to identify dishes', rw: 'Foto kugira umenye ibiryo' },
      icon: Camera,
      color: 'from-green-500 to-green-600',
      action: () => onActionSelect('scan-food')
    },
    {
      id: 'voice-search',
      title: { en: 'Voice Search', rw: 'Gushakisha mu majwi' },
      description: { en: 'Search using voice commands', rw: 'Shakisha ukoresha amajwi' },
      icon: Mic,
      color: 'from-purple-500 to-purple-600',
      action: () => onActionSelect('voice-search')
    },
    {
      id: 'quick-search',
      title: { en: 'Quick Search', rw: 'Gushakisha Byihuse' },
      description: { en: 'Fast restaurant and food search', rw: 'Gushakisha ibibanza n\'ibiryo byihuse' },
      icon: Search,
      color: 'from-orange-500 to-orange-600',
      action: () => onActionSelect('quick-search')
    },
    {
      id: 'favorites',
      title: { en: 'Favorites', rw: 'Ibyakunze' },
      description: { en: 'View your saved restaurants', rw: 'Reba ibibanza byawe byabitswe' },
      icon: Heart,
      color: 'from-red-500 to-red-600',
      action: () => onActionSelect('favorites')
    },
    {
      id: 'share',
      title: { en: 'Share App', rw: 'Sangira Porogaramu' },
      description: { en: 'Invite friends to DeliGo', rw: 'Tugurira inshuti muri DeliGo' },
      icon: Share2,
      color: 'from-teal-500 to-teal-600',
      action: () => onActionSelect('share')
    }
  ];

  // Track user interactions to show pulse effect
  useEffect(() => {
    const handleInteraction = () => {
      setLastInteraction(Date.now());
      setShowPulse(false);
    };

    // Add event listeners for user interactions
    const events = ['click', 'touch', 'scroll', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleInteraction);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, []);

  // Show pulse effect after 60 seconds of inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceLastInteraction = Date.now() - lastInteraction;
      if (timeSinceLastInteraction >= 60000 && !isOpen) { // 60 seconds
        setShowPulse(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastInteraction, isOpen]);

  // Handle action selection
  const handleActionSelect = (action: FABAction) => {
    action.action();
    setIsOpen(false);
    setLastInteraction(Date.now());
    setShowPulse(false);
  };

  // Handle FAB click
  const handleFABClick = () => {
    setIsOpen(true);
    setLastInteraction(Date.now());
    setShowPulse(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-20 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="relative">
          {/* Pulse Animation */}
          <AnimatePresence>
            {showPulse && (
              <motion.div
                className="absolute inset-0 bg-primary rounded-full"
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ 
                  scale: [1, 1.5, 1], 
                  opacity: [0.7, 0, 0.7] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            )}
          </AnimatePresence>

          {/* FAB Button */}
          <Button
            onClick={handleFABClick}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-white/20"
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="w-8 h-8 text-white" />
            </motion.div>
          </Button>
        </div>
      </motion.div>

      {/* Modal Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="bottom" 
          className="h-[70vh] bg-background/95 backdrop-blur-xl border-t border-border/30 rounded-t-3xl"
        >
          {/* Header */}
          <SheetHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-foreground text-xl font-semibold">
                  {content[language].title}
                </SheetTitle>
                <div className="text-muted-foreground text-sm">
                  {content[language].subtitle}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-3 h-auto rounded-2xl bg-card/50 hover:bg-card"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <SheetDescription className="text-muted-foreground text-sm text-left">
              {content[language].description}
            </SheetDescription>
          </SheetHeader>

          {/* Actions Grid */}
          <div className="grid grid-cols-2 gap-4 pb-6 overflow-y-auto scrollbar-hide">
            {fabActions.map((action) => {
              const IconComponent = action.icon;
              
              return (
                <motion.button
                  key={action.id}
                  onClick={() => handleActionSelect(action)}
                  className="p-6 bg-card/60 backdrop-blur-md border border-border/30 rounded-3xl text-left hover:bg-card/80 hover:border-border/50 transition-all duration-200 min-h-[120px]"
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="space-y-3">
                    {/* Icon with Gradient Background */}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div>
                      <h4 className="text-foreground font-medium mb-1">
                        {action.title[language]}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {action.description[language]}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
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
    </>
  );
}