import React from 'react';
import TopBar from '@/components/TopBar';
import { User, Palette, Globe, Bell, Shield, BarChart3, Info, CreditCard, Download, Headphones, ChevronRight } from 'lucide-react';

const settingCategories = [
  { id: 'profile', title: 'Profile', icon: User, color: 'bg-blue-100', iconColor: '#2563EB' },
  { id: 'appearance', title: 'Appearance', icon: Palette, color: 'bg-purple-100', iconColor: '#9333EA' },
  { id: 'language', title: 'Language & Region', icon: Globe, color: 'bg-green-100', iconColor: '#16A34A' },
  { id: 'notifications', title: 'Notifications', icon: Bell, color: 'bg-orange-100', iconColor: '#EA580C' },
  { id: 'privacy', title: 'Privacy & Security', icon: Shield, color: 'bg-red-100', iconColor: '#DC2626' },
  { id: 'analytics', title: 'Usage & Analytics', icon: BarChart3, color: 'bg-cyan-100', iconColor: '#0891B2' },
  { id: 'about', title: 'About', icon: Info, color: 'bg-gray-100', iconColor: '#6B7280' },
];

const quickActions = [
  { id: 'personality', title: 'Personality', icon: CreditCard, color: 'bg-indigo-100', iconColor: '#4F46E5' },
  { id: 'export', title: 'Export Data', icon: Download, color: 'bg-emerald-100', iconColor: '#059669' },
  { id: 'support', title: 'Support', icon: Headphones, color: 'bg-amber-100', iconColor: '#D97706' },
];

import { useState } from 'react';
import AppearanceSettingsPage from './appearance';
import ProfileSettingsPage from './profile';
import LanguageSettingsPage from './language';
import NotificationSettingsPage from './notifications';
import PrivacySecuritySettingsPage from './privacy-security';
import AboutSupportSettingsPage from './about-support';
import UsageAnalyticsSettingsPage from './usage-analytics';

export default function SettingsPage() {
  const [current, setCurrent] = useState<'main' | 'appearance' | 'profile' | 'language' | 'notifications' | 'privacy' | 'about' | 'usage'>('main');
  const handleBack = () => setCurrent('main');
  if (current === 'appearance') {
    return <AppearanceSettingsPage onBack={handleBack} />;
  }
  if (current === 'profile') {
    return <ProfileSettingsPage onBack={handleBack} />;
  }
  if (current === 'language') {
    return <LanguageSettingsPage onBack={handleBack} />;
  }
  if (current === 'notifications') {
    return <NotificationSettingsPage onBack={handleBack} />;
  }
  if (current === 'privacy') {
    return <PrivacySecuritySettingsPage onBack={handleBack} />;
  }
  if (current === 'about') {
    return <AboutSupportSettingsPage onBack={handleBack} />;
  }
  if (current === 'usage') {
    return <UsageAnalyticsSettingsPage onBack={handleBack} />;
  }
  return (
  <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 pt-[calc(3rem+env(safe-area-inset-top))] dark:text-white">
      <TopBar title="Settings" onBack={() => window.history.back()} />

      <div className="flex-1 px-4 py-4 max-w-2xl w-full mx-auto">
        {/* Quick Actions */}
        <div className="mb-6">
          <div className="text-gray-500 text-sm font-semibold mb-3">QUICK ACTIONS</div>
          <div className="flex flex-row gap-3">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.id}
                  className="flex-1 bg-white rounded-xl p-4 flex flex-col items-center justify-center border border-gray-200"
                >
                  <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-2`}>
                    <IconComponent size={24} stroke={action.iconColor} />
                  </div>
                  <div className="text-gray-800 font-medium">{action.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Categories */}
        <div className="mb-4">
          <div className="text-gray-500 text-sm font-semibold mb-3">SETTINGS</div>
          <div className="flex flex-row flex-wrap gap-3">
            {settingCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  className="w-[48%] bg-white rounded-xl p-4 border border-gray-200 mb-2"
                  onClick={() => {
                    if (category.id === 'appearance') setCurrent('appearance');
                    if (category.id === 'profile') setCurrent('profile');
                    if (category.id === 'language') setCurrent('language');
                    if (category.id === 'notifications') setCurrent('notifications');
                    if (category.id === 'privacy') setCurrent('privacy');
                    if (category.id === 'about') setCurrent('about');
                    if (category.id === 'analytics') setCurrent('usage');
                  }}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center mr-3`}>
                      <IconComponent size={20} stroke={category.iconColor} />
                    </div>
                    <div className="text-gray-800 font-medium flex-1">{category.title}</div>
                    <ChevronRight size={20} stroke="#9CA3AF" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Plan Info */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-800 font-semibold">Current Plan</div>
              <div className="text-gray-500 text-sm">Free Plan</div>
            </div>
            <button className="bg-blue-600 rounded-full px-4 py-2 text-white font-medium">Upgrade</button>
          </div>
        </div>
      </div>
      {/* Safe area bottom padding */}
      <div className="pb-[env(safe-area-inset-bottom)]"></div>
    </div>
  );
}
