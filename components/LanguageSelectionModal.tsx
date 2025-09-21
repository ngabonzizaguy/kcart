import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Check, Globe, Search } from 'lucide-react';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';

interface Language {
  code: string;
  name: string;
  localName: string;
  region: string;
  flag: string;
  isActive?: boolean;
  isRecommended?: boolean;
}

interface LanguageSelectionModalProps {
  isOpen: boolean;
  currentLanguage: 'en' | 'rw';
  onClose: () => void;
  onLanguageSelect: (languageCode: string) => void;
}

const languages: Language[] = [
  { code: 'en', name: 'English', localName: 'English', region: 'Global', flag: '🇺🇸', isRecommended: true },
  { code: 'rw', name: 'Kinyarwanda', localName: 'Ikinyarwanda', region: 'Rwanda', flag: '🇷🇼', isRecommended: true },
  { code: 'sw', name: 'Swahili', localName: 'Kiswahili', region: 'East Africa', flag: '🇰🇪' },
  { code: 'fr', name: 'French', localName: 'Français', region: 'France', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', localName: 'Español', region: 'Spain', flag: '🇪🇸' },
  { code: 'ar', name: 'Arabic', localName: 'العربية', region: 'Middle East', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', localName: '中文', region: 'China', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', localName: 'हिन्दी', region: 'India', flag: '🇮🇳' },
  { code: 'ja', name: 'Japanese', localName: '日本語', region: 'Japan', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', localName: '한국어', region: 'South Korea', flag: '🇰🇷' },
  { code: 'pt', name: 'Portuguese', localName: 'Português', region: 'Portugal', flag: '🇵🇹' },
  { code: 'de', name: 'German', localName: 'Deutsch', region: 'Germany', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', localName: 'Italiano', region: 'Italy', flag: '🇮🇹' },
  { code: 'ru', name: 'Russian', localName: 'Русский', region: 'Russia', flag: '🇷🇺' },
  { code: 'tr', name: 'Turkish', localName: 'Türkçe', region: 'Turkey', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', localName: 'Nederlands', region: 'Netherlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', localName: 'Polski', region: 'Poland', flag: '🇵🇱' },
  { code: 'vi', name: 'Vietnamese', localName: 'Tiếng Việt', region: 'Vietnam', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', localName: 'ไทย', region: 'Thailand', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', localName: 'Bahasa Indonesia', region: 'Indonesia', flag: '🇮🇩' }
];

export function LanguageSelectionModal({ 
  isOpen, 
  currentLanguage, 
  onClose, 
  onLanguageSelect 
}: LanguageSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const content = {
    en: {
      title: 'Choose Language',
      subtitle: 'Select your preferred language for DeliGo',
      recommended: 'Recommended',
      search: 'Search languages...',
      apply: 'Apply Language',
      cancel: 'Cancel',
      currentlyUsing: 'Currently using'
    },
    rw: {
      title: 'Hitamo Ururimi',
      subtitle: 'Hitamo ururimi ushaka gukoresha muri DeliGo',
      recommended: 'Byasabwe',
      search: 'Shakisha indimi...',
      apply: 'Emeza Ururimi',
      cancel: 'Kuraguza',
      currentlyUsing: 'Ururimi ukoresha'
    }
  };

  // Filter languages based on search query
  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.localName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate recommended and other languages
  const recommendedLanguages = filteredLanguages.filter(lang => lang.isRecommended);
  const otherLanguages = filteredLanguages.filter(lang => !lang.isRecommended);

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode as 'en' | 'rw');
  };

  const handleApply = () => {
    onLanguageSelect(selectedLanguage);
    onClose();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-semibold">{content[currentLanguage].title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label={content[currentLanguage].cancel}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white/90 text-sm">{content[currentLanguage].subtitle}</p>
          </div>

          {/* Search */}
          <div className="p-6 pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder={content[currentLanguage].search}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-12 h-12 bg-white/80 border-white/30 rounded-xl focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50"
              />
            </div>
          </div>

          {/* Language List */}
          <div className="px-6 pb-6 max-h-96 overflow-y-auto scrollbar-hide">
            {/* Recommended Languages */}
            {recommendedLanguages.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-orange-100 text-orange-700 text-xs px-2 py-1">
                    {content[currentLanguage].recommended}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {recommendedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        selectedLanguage === lang.code
                          ? 'border-orange-500 bg-orange-50/80'
                          : 'border-gray-200/50 hover:border-orange-300 hover:bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{lang.flag}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">{lang.name}</span>
                              {currentLanguage === lang.code && (
                                <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                                  {content[currentLanguage].currentlyUsing}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{lang.localName}</p>
                            <p className="text-xs text-gray-500">{lang.region}</p>
                          </div>
                        </div>
                        {selectedLanguage === lang.code && (
                          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Other Languages */}
            {otherLanguages.length > 0 && (
              <div>
                {recommendedLanguages.length > 0 && (
                  <div className="border-t border-gray-200/50 pt-4 mb-3">
                    <p className="text-sm text-gray-500 font-medium">
                      {currentLanguage === 'en' ? 'Other Languages' : 'Izindi Ndimi'}
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  {otherLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        selectedLanguage === lang.code
                          ? 'border-orange-500 bg-orange-50/80'
                          : 'border-gray-200/50 hover:border-orange-300 hover:bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{lang.flag}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">{lang.name}</span>
                              {currentLanguage === lang.code && (
                                <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                                  {content[currentLanguage].currentlyUsing}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{lang.localName}</p>
                            <p className="text-xs text-gray-500">{lang.region}</p>
                          </div>
                        </div>
                        {selectedLanguage === lang.code && (
                          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {filteredLanguages.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  {currentLanguage === 'en' 
                    ? 'No languages found matching your search'
                    : 'Nta rurimi rwabonetse mu bushakashatsi bwawe'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-200/50 p-6">
            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                {content[currentLanguage].cancel}
              </Button>
              <Button
                onClick={handleApply}
                className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
                disabled={selectedLanguage === currentLanguage}
              >
                {content[currentLanguage].apply}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}