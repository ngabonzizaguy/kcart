import React from 'react';
import { Home, Search, History, User, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import type { Screen } from '../../../../types';

interface BottomNavigationProps {
  language: 'en' | 'rw';
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onAIAssistantOpen: () => void;
}

interface TabItem {
  id: Screen;
  icon: React.ComponentType<{ className?: string }>;
  label: { en: string; rw: string };
  badge?: number;
}

export function BottomNavigation({ 
  language, 
  currentScreen, 
  onNavigate,
  onAIAssistantOpen
}: BottomNavigationProps) {
  
  // Navigation tabs (without cart, to accommodate FAB in center)
  const leftTabs: TabItem[] = [
    {
      id: 'home',
      icon: Home,
      label: { en: 'Home', rw: 'Intango' }
    },
    {
      id: 'search',
      icon: Search,
      label: { en: 'Search', rw: 'Shakisha' }
    }
  ];

  const rightTabs: TabItem[] = [
    {
      id: 'orders',
      icon: History,
      label: { en: 'Orders', rw: 'Amateka' }
    },
    {
      id: 'profile',
      icon: User,
      label: { en: 'Profile', rw: 'Umuyoboro' }
    }
  ];

  const renderNavItem = (tab: TabItem) => {
    const IconComponent = tab.icon;
    const isActive = currentScreen === tab.id;
    
    return (
      <button
        key={tab.id}
        onClick={() => onNavigate(tab.id)}
        className="relative flex flex-col items-center justify-center py-3 px-2 min-w-0 flex-1 transition-all"
      >
        {/* Icon */}
        <motion.div
          animate={{ 
            scale: isActive ? 1.1 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative mb-1"
        >
          <IconComponent 
            className={`w-6 h-6 transition-colors ${
              isActive ? 'text-orange-500' : 'text-gray-500'
            }`} 
          />
        </motion.div>
        
        {/* Label */}
        <span className={`text-xs transition-colors font-medium truncate ${
          isActive ? 'text-orange-500' : 'text-gray-500'
        }`}>
          {tab.label[language]}
        </span>
      </button>
    );
  };

  // AI FAB Component with premium modern design
  const renderAIFAB = () => {
    return (
      <div className="relative flex items-center justify-center">
        {/* Outer glow ring - centered pulse */}
        <motion.div
          className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/30 to-orange-600/30 flex items-center justify-center"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.2, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 7.5,
            ease: "easeInOut"
          }}
        />
        
        <motion.button
          onClick={onAIAssistantOpen}
          className="relative w-14 h-14 bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 rounded-full shadow-2xl shadow-orange-500/40 flex items-center justify-center overflow-hidden group"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 25px 50px -12px rgba(249, 115, 22, 0.5)"
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              "0 20px 40px -10px rgba(249, 115, 22, 0.3)",
              "0 25px 50px -12px rgba(249, 115, 22, 0.5)",
              "0 20px 40px -10px rgba(249, 115, 22, 0.3)",
            ]
          }}
          transition={{
            boxShadow: {
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 7.5,
              ease: "easeInOut"
            }
          }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/10"
            animate={{
              background: [
                "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 40%, rgba(255,255,255,0.1) 100%)",
                "linear-gradient(225deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)",
                "linear-gradient(315deg, rgba(255,255,255,0.3) 0%, transparent 40%, rgba(255,255,255,0.1) 100%)",
                "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 40%, rgba(255,255,255,0.1) 100%)",
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
            animate={{
              x: ["100%", "-100%"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 6,
              ease: "easeInOut"
            }}
          />
          
          {/* AI Icon with subtle animation */}
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-7 h-7 text-white relative z-10 drop-shadow-sm" />
          </motion.div>
          
          {/* Micro-interaction sparkles */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.4) 1px, transparent 1px)",
                "radial-gradient(circle at 60% 20%, rgba(255,255,255,0.6) 1px, transparent 1px), radial-gradient(circle at 30% 80%, rgba(255,255,255,0.4) 1px, transparent 1px)",
                "radial-gradient(circle at 80% 60%, rgba(255,255,255,0.6) 1px, transparent 1px), radial-gradient(circle at 20% 40%, rgba(255,255,255,0.4) 1px, transparent 1px)",
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 1px, transparent 1px), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.4) 1px, transparent 1px)",
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.button>
        

      </div>
    );
  };

  return (
    <>
      {/* Bottom Navigation - Professional FAB design with glassmorphism */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Glass background with subtle gradient */}
        <div className="bg-gradient-to-t from-white/95 via-white/90 to-white/80 backdrop-blur-xl border-t border-white/20 shadow-2xl shadow-black/5">
          <div className="relative flex items-end justify-between px-6 pt-3 pb-4 h-20">
            {/* Left Navigation Items */}
            <div className="flex justify-around flex-1 mr-8">
              {leftTabs.map(renderNavItem)}
            </div>
            
            {/* AI FAB in Center - Elevated */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-6 z-10">
              {renderAIFAB()}
            </div>
            
            {/* Right Navigation Items */}
            <div className="flex justify-around flex-1 ml-8">
              {rightTabs.map(renderNavItem)}
            </div>
          </div>
        </div>
        
        {/* Bottom safe area with gradient continuation */}
        <div className="h-safe-bottom bg-gradient-to-b from-white/90 to-white/95" />
      </div>
    </>
  );
}