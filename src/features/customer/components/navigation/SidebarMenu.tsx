import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  HelpCircle, 
  Globe, 
  Shield, 
  Sparkles, 
  LogOut,
  ChevronRight,
  Bell,
  Gift,
  Users
} from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button';
import { Separator } from '@legacy/ui/separator';
import { Switch } from '@legacy/ui/switch';
import { motion } from 'motion/react';
import { LanguageSelectionModal } from '@legacy/LanguageSelectionModal';
import type { Screen } from '../../../../types';

interface SidebarMenuProps {
  language: 'en' | 'rw';
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: Screen) => void;
  onLanguageChange: (language: 'en' | 'rw') => void;
  onLogout: () => void;
}

interface MenuItem {
  id: string;
  title: { en: string; rw: string };
  description?: { en: string; rw: string };
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  type?: 'navigation' | 'toggle' | 'action';
  isToggled?: boolean;
}

export function SidebarMenu({ 
  language, 
  isOpen, 
  onClose, 
  onNavigate, 
  onLanguageChange, 
  onLogout 
}: SidebarMenuProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const content = {
    en: {
      title: 'Menu',
      subtitle: 'DeliGo Settings & More',
      account: 'Account & Services',
      preferences: 'Preferences',
      support: 'Support & Info',
      version: 'Version 1.0.0'
    },
    rw: {
      title: 'Ibikubiye',
      subtitle: 'Igenamiterere rya DeliGo n\'Ibindi',
      account: 'Konti n\'Ubufasha',
      preferences: 'Ibyifuzo',
      support: 'Ubufasha n\'Amakuru',
      version: 'Verisiyo 1.0.0'
    }
  };

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange(languageCode as 'en' | 'rw');
  };

  const handleOpenLanguageModal = () => {
    setShowLanguageModal(true);
  };

  const menuSections = [
    {
      title: content[language].account,
      items: [
        {
          id: 'ai-settings',
          title: { en: 'AI Assistant', rw: 'Umufasha wa AI' },
          description: { en: 'Customize AI features & recommendations', rw: 'Hindura ibiranga bya AI n\'ibyifuzo' },
          icon: Sparkles,
          action: () => {
            onClose();
            onNavigate('ai-settings');
          },
          type: 'navigation' as const
        },
        {
          id: 'blockchain',
          title: { en: 'Blockchain Center', rw: 'Ikigo cya Blockchain' },
          description: { en: 'Transaction history & smart contracts', rw: 'Amateka y\'ibikorwa n\'amasezerano yubwenge' },
          icon: Shield,
          action: () => {
            onClose();
            onNavigate('blockchain');
          },
          type: 'navigation' as const
        },
        {
          id: 'loyalty-rewards',
          title: { en: 'Loyalty & Rewards', rw: 'Ibihembo n\'Ingwate' },
          description: { en: 'Earn points and redeem rewards', rw: 'Gwinjiza amanota no gufata ibihembo' },
          icon: Gift,
          action: () => {
            onClose();
            onNavigate('loyalty-rewards');
          },
          type: 'navigation' as const
        },
        {
          id: 'referrals',
          title: { en: 'Referrals', rw: 'Kwegurira Abandi' },
          description: { en: 'Invite friends and earn bonuses', rw: 'Tugurira inshuti ubone ibihembo' },
          icon: Users,
          action: () => {
            onClose();
            onNavigate('referrals');
          },
          type: 'navigation' as const
        }
      ]
    },
    {
      title: content[language].preferences,
      items: [
        {
          id: 'language',
          title: { en: 'Language', rw: 'Ururimi' },
          description: { 
            en: language === 'en' ? 'English (US)' : 'Kinyarwanda',
            rw: language === 'en' ? 'Icyongereza' : 'Ikinyarwanda'
          },
          icon: Globe,
          action: handleOpenLanguageModal,
          type: 'navigation' as const
        },
        {
          id: 'notifications',
          title: { en: 'Notifications', rw: 'Ubutumwa' },
          description: { en: 'Order updates and promotions', rw: 'Amakuru y\'ibisabwa n\'ibyishimira' },
          icon: Bell,
          action: (checked: boolean) => setNotifications(checked),
          type: 'toggle' as const,
          isToggled: notifications
        }
      ]
    },
    {
      title: content[language].support,
      items: [
        {
          id: 'help',
          title: { en: 'Help & Support', rw: 'Ubufasha' },
          description: { en: 'FAQ and customer support', rw: 'Ibibazo bikunze kubazwa n\'ubufasha' },
          icon: HelpCircle,
          action: () => {
            onClose();
            alert(language === 'en' 
              ? 'Opening help center...' 
              : 'Gufungura ikigo cy\'ubufasha...'
            );
          },
          type: 'navigation' as const
        }
      ]
    }
  ];

  return (
    <>
      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', ease: 'anticipate', duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-80 bg-card/95 backdrop-blur-md border-r border-border/50 shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border/20 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-foreground text-lg font-medium">{content[language].title}</h2>
              <p className="text-muted-foreground text-sm">{content[language].subtitle}</p>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-accent/50 transition-colors"
              aria-label={language === 'en' ? 'Close menu' : 'Funga ibikubiye'}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          
          {/* DeliGo Logo */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-500/10 to-orange-600/20 rounded-2xl">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div>
              <p className="text-foreground font-medium">{content[language].version}</p>
              <p className="text-muted-foreground text-xs">DeliGo</p>
            </div>
          </div>
        </div>

        {/* Menu Content - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-6 pb-32">
            {menuSections.map((section, sectionIndex) => (
              <div key={section.title} className="mb-8">
                <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wide">
                  {section.title}
                </h3>
                
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const IconComponent = item.icon;
                    
                    if (item.type === 'toggle') {
                      return (
                        <div
                          key={item.id}
                          className="w-full p-5 rounded-2xl hover:bg-accent/30 transition-all duration-200 group min-h-[72px]"
                        >
                          <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div className="w-12 h-12 bg-muted/50 group-hover:bg-orange-500/10 rounded-xl flex items-center justify-center transition-colors">
                              <IconComponent className="w-6 h-6 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-foreground font-medium text-sm group-hover:text-orange-500 transition-colors">
                                {item.title[language]}
                              </h4>
                              {item.description && (
                                <p className="text-muted-foreground text-xs leading-relaxed">
                                  {item.description[language]}
                                </p>
                              )}
                            </div>

                            {/* Switch */}
                            <div className="flex-shrink-0">
                              <Switch
                                checked={item.isToggled || false}
                                onCheckedChange={item.action}
                                className="data-[state=checked]:bg-orange-500"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        className="w-full p-5 rounded-2xl hover:bg-accent/30 transition-all duration-200 text-left group min-h-[72px]"
                      >
                        <div className="flex items-center gap-4">
                          {/* Icon */}
                          <div className="w-12 h-12 bg-muted/50 group-hover:bg-orange-500/10 rounded-xl flex items-center justify-center transition-colors">
                            <IconComponent className="w-6 h-6 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-foreground font-medium text-sm group-hover:text-orange-500 transition-colors">
                              {item.title[language]}
                            </h4>
                            {item.description && (
                              <p className="text-muted-foreground text-xs leading-relaxed">
                                {item.description[language]}
                              </p>
                            )}
                          </div>

                          {/* Action Indicator */}
                          <div className="flex-shrink-0">
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {sectionIndex < menuSections.length - 1 && (
                  <Separator className="mt-6 opacity-30" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 bg-card/95 backdrop-blur-md p-6 flex-shrink-0">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full h-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Sign Out' : 'Gusohoka'}
          </Button>
        </div>
      </motion.div>

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        isOpen={showLanguageModal}
        currentLanguage={language}
        onClose={() => setShowLanguageModal(false)}
        onLanguageSelect={handleLanguageSelect}
      />
    </>
  );
}