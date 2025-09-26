import React, { useState } from 'react';
import TopBar from '@/components/TopBar';
import { Shield, Lock, Download, Trash2, AlertTriangle, ChevronRight } from 'lucide-react';

export default function PrivacySecuritySettingsPage({ onBack }: { onBack?: () => void }) {
  const [dataCollection, setDataCollection] = useState(true);

  const handleExportData = () => {
    alert('Your data will be prepared for export. This may take a few minutes. You will receive a download link via email.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.')) {
      alert('Your account deletion request has been submitted. You will receive an email with further instructions.');
    }
  };

  return (
  <div className="flex flex-col min-h-screen bg-background overflow-auto pt-[calc(3rem+env(safe-area-inset-top))] text-foreground mobile-safe-container">
      <TopBar title="Privacy & Security" onBack={onBack} />
      <div className="flex-1 px-4 py-4 max-w-2xl w-full mx-auto">
        {/* Data Collection Consent */}
  <div className="bg-card rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <Shield size={24} className="text-primary mr-3" />
              <div>
                <div className="text-lg font-semibold text-card-foreground">Data Collection</div>
                <div className="text-muted-foreground text-sm">Control how we collect and use your data</div>
              </div>
            </div>
            <button
              className={`w-12 h-6 rounded-full ${dataCollection ? 'bg-primary' : 'bg-muted'} flex items-center px-1 transition-all duration-300`}
              onClick={() => setDataCollection(!dataCollection)}
            >
              <span className={`w-5 h-5 bg-white rounded-full block transition-transform duration-300 ${dataCollection ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <span className="text-xs text-blue-700 dark:text-blue-200">
              {dataCollection
                ? 'Data collection is enabled. We collect usage data to improve our services.'
                : 'Data collection is disabled. We will only collect essential data required for app functionality.'}
            </span>
          </div>
        </div>

        {/* Data Management */}
  <div className="bg-card rounded-xl p-4 mb-6 shadow-sm">
          <div className="text-lg font-semibold text-card-foreground mb-4">Data Management</div>
          <button
            className="flex flex-row items-center justify-between py-3 border-b border-border w-full"
            onClick={handleExportData}
          >
            <span className="flex flex-row items-center">
              <Download size={20} className="text-primary mr-3" />
              <span className="text-base text-card-foreground">Export My Data</span>
            </span>
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
          <button
            className="flex flex-row items-center justify-between py-3 w-full"
            onClick={handleDeleteAccount}
          >
            <span className="flex flex-row items-center">
              <Trash2 size={20} className="text-red-500 mr-3" />
              <span className="text-base text-red-500">Delete Account</span>
            </span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Security Details */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-lg font-semibold text-gray-900 mb-4">Security Details</div>
          <div className="py-3 border-b border-gray-100">
            <div className="flex flex-row items-center">
              <Lock size={20} className="text-emerald-500 mr-3" />
              <span className="text-base text-gray-900">End-to-End Encryption</span>
            </div>
            <span className="text-gray-500 text-sm mt-2 ml-8 block">
              All messages are secured with military-grade encryption
            </span>
          </div>
          <div className="py-3 border-b border-gray-100">
            <div className="flex flex-row items-center">
              <Shield size={20} className="text-emerald-500 mr-3" />
              <span className="text-base text-gray-900">Two-Factor Authentication</span>
            </div>
            <span className="text-gray-500 text-sm mt-2 ml-8 block">
              Add an extra layer of security to your account
            </span>
          </div>
          <div className="py-3">
            <div className="flex flex-row items-center">
              <AlertTriangle size={20} className="text-yellow-500 mr-3" />
              <span className="text-base text-gray-900">Security Alerts</span>
            </div>
            <span className="text-gray-500 text-sm mt-2 ml-8 block">
              Receive notifications about suspicious activities
            </span>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-600">
              Our security measures protect your data at all times. We regularly audit our systems
              to ensure your information remains safe and secure.
            </span>
          </div>
        </div>
      </div>
      {/* Safe area bottom padding */}
      <div className="pb-[env(safe-area-inset-bottom)]"></div>
    </div>
  );
}
