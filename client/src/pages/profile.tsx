import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import TopBar from '@/components/TopBar';
import { ChevronLeft, Mail } from 'lucide-react';

const avatarImages = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&auto=format&fit=crop&q=60',
];

export default function ProfileSettingsPage({ onBack }: { onBack?: () => void }) {
  const { profile, user } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [email, setEmail] = useState(profile?.email || user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || avatarImages[0]);
  const [bio, setBio] = useState(profile?.bio || '');
  const [language, setLanguage] = useState(profile?.language || 'en');
  const [theme, setTheme] = useState(profile?.theme || 'system');
  const [currency, setCurrency] = useState(profile?.currency || 'GHS');
  const [notificationsEnabled, setNotificationsEnabled] = useState(profile?.notifications_enabled ?? true);
  const [dataCollectionConsent, setDataCollectionConsent] = useState(profile?.data_collection_consent ?? false);
  const [subscriptionPlan, setSubscriptionPlan] = useState(profile?.subscription_plan || 'free');
  const [subscriptionStatus, setSubscriptionStatus] = useState(profile?.subscription_status || 'active');
  const [createdAt, setCreatedAt] = useState(profile?.created_at || '');

  useEffect(() => {
    setDisplayName(profile?.display_name || '');
    setEmail(profile?.email || user?.email || '');
    setAvatarUrl(profile?.avatar_url || avatarImages[0]);
    setBio(profile?.bio || '');
    setLanguage(profile?.language || 'en');
    setTheme(profile?.theme || 'system');
    setCurrency(profile?.currency || 'GHS');
    setNotificationsEnabled(profile?.notifications_enabled ?? true);
    setDataCollectionConsent(profile?.data_collection_consent ?? false);
    setSubscriptionPlan(profile?.subscription_plan || 'free');
    setSubscriptionStatus(profile?.subscription_status || 'active');
    setCreatedAt(profile?.created_at || '');
  }, [profile, user]);

  return (
  <div className="flex flex-col min-h-screen bg-background pt-[calc(3rem+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] text-foreground mobile-safe-container">
      {/* Header */}
      <TopBar title="Profile Settings" onBack={onBack} />

      <div className="flex-1 px-4 py-4 max-w-2xl w-full mx-auto overflow-auto">
        {/* Profile Picture Section */}
        <div className="bg-card rounded-xl p-4 mb-6 border border-border">
          <div className="text-card-foreground font-semibold mb-4">Profile Picture</div>
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={avatarUrl}
                className="w-24 h-24 rounded-full object-cover"
                alt="Profile"
                onError={e => { e.currentTarget.src = avatarImages[0]; }}
              />
            </div>
            <div className="flex flex-row mt-4 gap-3">
              {avatarImages.map((avatar, index) => (
                <button key={index} className={`w-12 h-12 rounded-full overflow-hidden border-2 ${avatarUrl === avatar ? 'border-primary' : 'border-border'}`} onClick={() => setAvatarUrl(avatar)}>
                  <img src={avatar} className="w-full h-full object-cover" alt="Avatar" />
                </button>
              ))}
            </div>
            {/* No upload button, only avatar selection and placeholder */}
          </div>
        </div>

                
        <div className="bg-card rounded-xl p-4 mb-6 border border-border">
          <div className="text-card-foreground font-semibold mb-4">Personal Information</div>
          <div className="mb-4">
            <div className="text-muted-foreground text-sm mb-1">Display Name</div>
            <input
              className="bg-background rounded-lg px-4 py-3 text-foreground border border-border w-full"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <div className="text-muted-foreground text-sm mb-1">Email Address</div>
            <div className="flex flex-row items-center bg-background rounded-lg px-4 py-3 border border-border">
              <Mail size={20} className="text-gray-400 mr-2" />
              <input
                className="flex-1 text-gray-800 dark:text-gray-100 bg-transparent outline-none"
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                disabled
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="text-gray-500 text-sm mb-1">Bio</div>
            <textarea
              className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 w-full"
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={2}
            />
          </div>
          <div className="mb-4">
            <div className="text-gray-500 text-sm mb-1">Language</div>
            <input
              className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 w-full"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <div className="text-gray-500 text-sm mb-1">Theme</div>
            <input
              className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 w-full"
              value={theme}
              onChange={e => setTheme(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <div className="text-gray-500 text-sm mb-1">Currency</div>
            <input
              className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 w-full"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <div className="text-gray-500 text-sm mb-1">Notifications Enabled</div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={e => setNotificationsEnabled(e.target.checked)}
            />
          </div>
          <div className="mb-4">
            <div className="text-gray-500 text-sm mb-1">Data Collection Consent</div>
            <input
              type="checkbox"
              checked={dataCollectionConsent}
              onChange={e => setDataCollectionConsent(e.target.checked)}
            />
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="text-gray-800 font-semibold mb-4">Account Information</div>
          <div className="mb-3">
            <div className="text-gray-500 text-sm">Member Since</div>
            <div className="text-gray-800 font-medium">{createdAt ? new Date(createdAt).toLocaleDateString() : ''}</div>
          </div>
          <div className="mb-3">
            <div className="text-gray-500 text-sm">Account Status</div>
            <div className="text-green-600 font-medium">{subscriptionStatus}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Subscription Plan</div>
            <div className="text-gray-800 font-medium">{subscriptionPlan}</div>
          </div>
        </div>

        {/* Save Button */}
        <button className="bg-blue-600 rounded-xl py-4 mb-4 w-full text-white font-semibold text-center">Save Changes</button>
      </div>
    </div>
  );
}
