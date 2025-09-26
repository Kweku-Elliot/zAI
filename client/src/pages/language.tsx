import React, { useState } from 'react';
import TopBar from '@/components/TopBar';
import { ChevronLeft, Check } from 'lucide-react';

const languages = [
  { id: 'en', name: 'English', flag: '🇺🇸', region: 'United States' },
  { id: 'es', name: 'Español', flag: '🇪🇸', region: 'España' },
  { id: 'fr', name: 'Français', flag: '🇫🇷', region: 'France' },
  { id: 'de', name: 'Deutsch', flag: '🇩🇪', region: 'Deutschland' },
  { id: 'ja', name: '日本語', flag: '🇯🇵', region: '日本' },
  { id: 'zh', name: '中文', flag: '🇨🇳', region: '中国' },
  { id: 'ko', name: '한국어', flag: '🇰🇷', region: '대한민국' },
  { id: 'pt', name: 'Português', flag: '🇵🇹', region: 'Portugal' },
];

export default function LanguageSettingsPage({ onBack }: { onBack?: () => void }) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const selectLanguage = (id: string) => {
    setSelectedLanguage(id);
    // Persist selection if needed
  };

  return (
  <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pt-[calc(3rem+env(safe-area-inset-top))] dark:text-white">
      {/* Header */}
      <TopBar title="Language" onBack={onBack} />
  <div className="flex-1 px-4 py-4 max-w-2xl w-full mx-auto overflow-auto">
  <div className="text-gray-500 dark:text-gray-400 text-sm mb-3">Select your preferred language</div>
        <div className="flex flex-col gap-3">
          {languages.map((lang) => (
            <button
              key={lang.id}
              className={`flex flex-row items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-all ${selectedLanguage === lang.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => selectLanguage(lang.id)}
            >
              <span className="text-xl mr-3">{lang.flag}</span>
              <div className="flex-1 text-left">
                <div className="text-base text-gray-800 dark:text-gray-100">{lang.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{lang.region}</div>
              </div>
              {selectedLanguage === lang.id && <Check size={20} className="text-emerald-500 dark:text-emerald-400" />}
            </button>
          ))}
        </div>
      </div>
      {/* Safe area bottom padding */}
      <div className="pb-[env(safe-area-inset-bottom)]"></div>
    </div>
  );
}
