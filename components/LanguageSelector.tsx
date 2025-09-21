import React from 'react';
import { Button } from './ui/button';

interface LanguageSelectorProps {
  selectedLanguage: 'en' | 'rw';
  onLanguageChange: (language: 'en' | 'rw') => void;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full p-1">
      <Button
        variant={selectedLanguage === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onLanguageChange('en')}
        className={`rounded-full px-4 py-2 transition-all ${
          selectedLanguage === 'en' 
            ? 'bg-orange-500 text-white hover:bg-orange-600' 
            : 'text-gray-700 hover:bg-white/30 hover:text-gray-900'
        }`}
      >
        EN
      </Button>
      <Button
        variant={selectedLanguage === 'rw' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onLanguageChange('rw')}
        className={`rounded-full px-4 py-2 transition-all ${
          selectedLanguage === 'rw' 
            ? 'bg-orange-500 text-white hover:bg-orange-600' 
            : 'text-gray-700 hover:bg-white/30 hover:text-gray-900'
        }`}
      >
        RW
      </Button>
    </div>
  );
}