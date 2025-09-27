import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import TopBar from '@/components/TopBar';
import { Sun, Moon, Monitor, DollarSign, ChevronLeft } from 'lucide-react';

const themes = [
  { id: 'light', name: 'Light', icon: Sun },
  { id: 'dark', name: 'Dark', icon: Moon },
  { id: 'system', name: 'System', icon: Monitor },
];

const currencies = [
  { id: 'GHS', name: 'Cedis', symbol: 'GHS' },
  { id: 'USD', name: 'Euro', symbol: '€' },
];

export default function AppearanceSettingsPage({ onBack }: { onBack?: () => void }) {
  const { theme, setTheme } = useTheme();
  const [currency, setCurrency] = useState('USD');

  return (
     <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pt-[calc(3rem+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] dark:text-white">
      {/* Header */}
      <TopBar title="Appearance & Theme" onBack={onBack} />

      <div className="flex-1 px-4 py-4 max-w-2xl w-full mx-auto">
        {/* Theme Selection */}
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="text-gray-800 dark:text-gray-100 font-semibold mb-4">Theme</div>
          <div className="flex flex-col gap-3">
            {themes.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  className={`flex flex-row items-center p-3 rounded-lg border transition-all ${theme === item.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-200 dark:border-gray-700 dark:bg-gray-900'}`}
                  onClick={() => setTheme(item.id as 'light' | 'dark' | 'system')}
                >
                  <IconComponent size={20} className="mr-3" color={theme === item.id ? '#2563EB' : '#6B7280'} />
                  <span className={`font-medium ${theme === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-100'}`}>{item.name}</span>
                  {theme === item.id && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white dark:bg-gray-700 block" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Currency Selection */}
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="text-gray-800 dark:text-gray-100 font-semibold mb-4">Currency</div>
          <div className="flex flex-col gap-3">
            {currencies.map((item) => (
              <button
                key={item.id}
                className={`flex flex-row items-center p-3 rounded-lg border transition-all ${currency === item.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-200 dark:border-gray-700 dark:bg-gray-900'}`}
                onClick={() => setCurrency(item.id)}
              >
                <DollarSign size={20} className="mr-3" color={currency === item.id ? '#2563EB' : '#6B7280'} />
                <div className="flex-1 text-left">
                  <span className={`font-medium ${currency === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-100'}`}>{item.name}</span>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">{item.symbol}</div>
                </div>
                {currency === item.id && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-white block" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
