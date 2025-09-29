import React, { useState } from 'react';
import TopBar from '@/components/TopBar';
import { Bell, Shield, Info, ChevronRight } from 'lucide-react';

const notificationTypesList = [
  { id: 'messages', name: 'Messages', enabled: false },
  { id: 'mentions', name: 'Mentions', enabled: false },
  { id: 'reactions', name: 'Reactions', enabled: false },
  { id: 'voice', name: 'Voice Messages', enabled: false },
  { id: 'files', name: 'File Sharing', enabled: false },
  { id: 'updates', name: 'App Updates', enabled: false },
];

export default function NotificationSettingsPage({ onBack }: { onBack?: () => void }) {
  const [masterNotification, setMasterNotification] = useState(true);
  const [notificationTypes] = useState(notificationTypesList);
  const [browserPermissions, setBrowserPermissions] = useState(false);

  const toggleNotificationType = (_id: string) => {
    // In a real app, this would update the specific notification type
    alert('Feature Disabled: This notification type is currently disabled');
  };

  const requestBrowserPermissions = () => {
    if (window.confirm('This feature requires mobile permissions. Would you like to enable them?')) {
      setBrowserPermissions(true);
    }
  };

  return (
  <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 overflow-auto pt-[calc(3rem+env(safe-area-inset-top))] dark:text-white">
      <TopBar title="Notifications" onBack={onBack} />
      <div className="flex-1 px-4 py-4 max-w-2xl w-full mx-auto">
        {/* Master Toggle */}
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <Bell size={24} className="text-blue-500 mr-3" />
              <div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Enable or disable all notifications</div>
              </div>
            </div>
            <button
              className={`w-12 h-6 rounded-full ${masterNotification ? 'bg-blue-500' : 'bg-gray-300'} flex items-center px-1 transition-all duration-300`}
              onClick={() => setMasterNotification(!masterNotification)}
            >
              <span className={`w-5 h-5 bg-white rounded-full block transition-transform duration-300 ${masterNotification ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Notification Types */}
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm">
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Notification Types</div>
          {notificationTypes.map((type) => (
            <button
              key={type.id}
              className="flex flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 w-full"
              onClick={() => toggleNotificationType(type.id)}
              disabled={!masterNotification}
            >
              <span className={`text-base ${masterNotification ? 'text-gray-900' : 'text-gray-400'}`}>{type.name}</span>
              <span className="flex flex-row items-center">
                <span className={`w-10 h-5 rounded-full ${type.enabled && masterNotification ? 'bg-blue-500' : 'bg-gray-300'} flex items-center px-1 transition-all duration-300 opacity-50`}>
                  <span className={`w-4 h-4 bg-white rounded-full block transition-transform duration-300 ${type.enabled && masterNotification ? 'translate-x-5' : 'translate-x-0'}`} />
                </span>
                <ChevronRight size={20} className="text-gray-400 ml-2" />
              </span>
            </button>
          ))}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg flex flex-row items-start">
            <Info size={16} className="text-blue-500 mt-0.5 mr-2" />
            <span className="text-xs text-blue-700 dark:text-blue-200">
              Notification types are currently disabled. Enable the master notification toggle to customize individual notifications.
            </span>
          </div>
        </div>

        {/* Mobile Permissions */}
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Mobile Permissions</div>
          <button
            className="flex flex-row items-center justify-between py-3 w-full"
            onClick={requestBrowserPermissions}
          >
            <div>
              <div className="text-base text-gray-900 dark:text-gray-100">Mobile Notifications</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {browserPermissions
                  ? 'Enabled - You will receive mobile notifications'
                  : 'Disabled - Enable to receive mobile notifications'}
              </div>
            </div>
            <span className="flex flex-row items-center">
              <span className={`w-10 h-5 rounded-full ${browserPermissions ? 'bg-blue-500' : 'bg-gray-300'} flex items-center px-1 transition-all duration-300`}>
                <span className={`w-4 h-4 bg-white rounded-full block transition-transform duration-300 ${browserPermissions ? 'translate-x-5' : 'translate-x-0'}`} />
              </span>
              <ChevronRight size={20} className="text-gray-400 ml-2" />
            </span>
          </button>
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span className="flex flex-row items-start">
              <Shield size={16} className="text-gray-400 mt-0.5 mr-2" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Mobile permissions allow the app to send notifications even when the mobile is closed. 
                You can manage these permissions in your mobile settings.
              </span>
            </span>
          </div>
        </div>
      </div>
      {/* Safe area bottom padding */}
      <div className="pb-[env(safe-area-inset-bottom)]"></div>
    </div>
  );
}
