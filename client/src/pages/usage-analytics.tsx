import React from 'react';
import TopBar from '@/components/TopBar';
import { ChevronRight, BarChart2, Zap, FileText, Mic, MessageCircle } from 'lucide-react';

const planLimits = {
  name: 'Premium Plan',
  messages: { used: 8500, limit: 10000 },
  files: { used: 42, limit: 50 },
  voice: { used: 120, limit: 200 },
  tokens: { used: 180000, limit: 250000 },
};

const calculatePercentage = (used: number, limit: number) => {
  return Math.min(100, (used / limit) * 100);
};

const getProgressColor = (percentage: number) => {
  if (percentage < 70) return 'bg-green-500';
  if (percentage < 90) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default function UsageAnalyticsSettingsPage({ onBack }: { onBack?: () => void }) {
  return (
  <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 overflow-auto pt-[calc(3rem+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] dark:text-white">
      <TopBar title="Usage & Analytics" onBack={onBack} />
      <div className="flex-1 px-4 py-4 max-w-2xl w-full mx-auto">
        {/* Plan Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-row items-center justify-between mb-4">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Current Plan</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-300">{planLimits.name}</span>
          </div>
          <button className="flex flex-row items-center justify-between bg-blue-50 dark:bg-blue-900 rounded-lg p-3 w-full">
            <span className="font-medium text-blue-700 dark:text-blue-300">Upgrade Plan</span>
            <ChevronRight size={20} className="text-blue-500 dark:text-blue-300" />
          </button>
        </div>

        {/* Usage Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm">
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Usage Statistics</div>
          {/* Messages */}
          <div className="mb-5">
            <div className="flex flex-row items-center justify-between mb-2">
              <span className="flex flex-row items-center">
                <MessageCircle size={20} className="text-blue-500 dark:text-blue-300 mr-2" />
                <span className="text-base text-gray-900 dark:text-gray-100">Messages</span>
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {planLimits.messages.used.toLocaleString()} / {planLimits.messages.limit.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(calculatePercentage(planLimits.messages.used, planLimits.messages.limit))}`}
                style={{ width: `${calculatePercentage(planLimits.messages.used, planLimits.messages.limit)}%` }}
              />
            </div>
          </div>
          {/* Files */}
          <div className="mb-5">
            <div className="flex flex-row items-center justify-between mb-2">
              <span className="flex flex-row items-center">
                <FileText size={20} className="text-blue-500 mr-2" />
                <span className="text-base text-gray-900">Files</span>
              </span>
              <span className="text-sm text-gray-500">
                {planLimits.files.used} / {planLimits.files.limit}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(calculatePercentage(planLimits.files.used, planLimits.files.limit))}`}
                style={{ width: `${calculatePercentage(planLimits.files.used, planLimits.files.limit)}%` }}
              />
            </div>
          </div>
          {/* Voice */}
          <div className="mb-5">
            <div className="flex flex-row items-center justify-between mb-2">
              <span className="flex flex-row items-center">
                <Mic size={20} className="text-blue-500 mr-2" />
                <span className="text-base text-gray-900">Voice Minutes</span>
              </span>
              <span className="text-sm text-gray-500">
                {planLimits.voice.used} / {planLimits.voice.limit}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(calculatePercentage(planLimits.voice.used, planLimits.voice.limit))}`}
                style={{ width: `${calculatePercentage(planLimits.voice.used, planLimits.voice.limit)}%` }}
              />
            </div>
          </div>
          {/* Tokens */}
          <div>
            <div className="flex flex-row items-center justify-between mb-2">
              <span className="flex flex-row items-center">
                <Zap size={20} className="text-blue-500 mr-2" />
                <span className="text-base text-gray-900">AI Tokens</span>
              </span>
              <span className="text-sm text-gray-500">
                {planLimits.tokens.used.toLocaleString()} / {planLimits.tokens.limit.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(calculatePercentage(planLimits.tokens.used, planLimits.tokens.limit))}`}
                style={{ width: `${calculatePercentage(planLimits.tokens.used, planLimits.tokens.limit)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-row items-center justify-between mb-4">
            <span className="text-lg font-semibold text-gray-900">Analytics</span>
            <BarChart2 size={20} className="text-blue-500" />
          </div>
          <div className="flex flex-row justify-between mb-3">
            <span className="text-gray-500">Messages Sent</span>
            <span className="font-medium">12,450</span>
          </div>
          <div className="flex flex-row justify-between mb-3">
            <span className="text-gray-500">Files Shared</span>
            <span className="font-medium">68</span>
          </div>
          <div className="flex flex-row justify-between mb-3">
            <span className="text-gray-500">Voice Minutes</span>
            <span className="font-medium">185</span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-gray-500">AI Tokens Used</span>
            <span className="font-medium">215,750</span>
          </div>
        </div>

        {/* Upgrade Suggestions */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-lg font-semibold text-gray-900 mb-4">Upgrade Suggestions</div>
          <div className="p-3 bg-blue-50 rounded-lg mb-3">
            <span className="font-medium text-blue-800 mb-1 block">Approaching Message Limit</span>
            <span className="text-sm text-blue-700">
              You've used 85% of your monthly message allowance. Consider upgrading for unlimited messages.
            </span>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <span className="font-medium text-yellow-800 mb-1 block">Voice Minutes</span>
            <span className="text-sm text-yellow-700">
              You have 80 minutes remaining. Upgrade for unlimited voice features.
            </span>
          </div>
          <button className="mt-4 flex flex-row items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 w-full">
            <span className="font-bold text-white">Upgrade to Pro Plan</span>
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
