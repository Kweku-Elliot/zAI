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
     <div className="flex flex-col min-h-screen bg-background pt-[calc(3rem+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] text-foreground mobile-safe-container">
      {/* Header */}
      <TopBar title="Appearance & Theme" onBack={onBack} />

      <div className="flex-1 px-4 py-4 max-w-2xl w-full mx-auto">
        {/* Theme Selection */}
  <div className="bg-card rounded-xl p-4 mb-6 border border-border">
          <div className="text-card-foreground font-semibold mb-4">Theme</div>
          <div className="flex flex-col gap-3">
            {themes.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  className={`flex flex-row items-center p-3 rounded-lg border transition-all ${theme === item.id ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
                  onClick={() => setTheme(item.id as 'light' | 'dark' | 'system')}
                >
                  <IconComponent size={20} className="mr-3" color={theme === item.id ? '#2563EB' : '#6B7280'} />
                  <span className={`font-medium ${theme === item.id ? 'text-primary' : 'text-card-foreground'}`}>{item.name}</span>
                  {theme === item.id && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-primary-foreground block" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Currency Selection */}
  <div className="bg-card rounded-xl p-4 mb-6 border border-border">
          <div className="text-card-foreground font-semibold mb-4">Currency</div>
          <div className="flex flex-col gap-3">
            {currencies.map((item) => (
              <button
                key={item.id}
                className={`flex flex-row items-center p-3 rounded-lg border transition-all ${currency === item.id ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
                onClick={() => setCurrency(item.id)}
              >
                <DollarSign size={20} className="mr-3" color={currency === item.id ? '#2563EB' : '#6B7280'} />
                <div className="flex-1 text-left">
                  <span className={`font-medium ${currency === item.id ? 'text-primary' : 'text-card-foreground'}`}>{item.name}</span>
                  <div className="text-muted-foreground text-sm">{item.symbol}</div>
                </div>
                {currency === item.id && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary-foreground block" />
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
