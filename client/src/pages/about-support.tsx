import React from 'react';
import TopBar from '@/components/TopBar';
import { Info, Globe, Mail, Users, Heart, ExternalLink } from 'lucide-react';

const appInfo = {
  name: 'Zenux AI',
  version: '1.2.4',
  build: '245',
};

const features = [
  'Image/Video-Generation',
  'Advaced Proceesing',
  'AI-Powered Code Exervution',
  'Multimodality',
];

const externalLinks = [
  { name: 'Website', url: 'https://zenux-ai.example.com', icon: Globe },
  { name: 'Documentation', url: 'https://docs.zenux-ai.example.com', icon: Info },
  { name: 'Support Center', url: 'https://support.zenux-ai.example.com', icon: Mail },
  { name: 'Community Forum', url: 'https://community.zenux-ai.example.com', icon: Users },
];

const credits = [
  { name: 'Vite', role: 'Framework' },
  { name: 'TailWind', role: 'Styling' },
  { name: 'Lucide Icons', role: 'Icon Library' },
  { name: 'Capacitor', role: 'Development Tools' },
];

export default function AboutSupportSettingsPage({ onBack }: { onBack?: () => void }) {
  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener');
  };

  return (
  <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 overflow-auto pt-[calc(3rem+env(safe-area-inset-top))] dark:text-white">
      <TopBar title="About" onBack={onBack} />
      <div className="flex-1 px-4 py-4 max-w-2xl w-full mx-auto">
        {/* App Information */}
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-500 dark:bg-blue-700 rounded-full flex items-center justify-center mb-3">
            <span className="text-white text-2xl font-bold">Z</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{appInfo.name}</div>
          <div className="text-gray-500 dark:text-gray-400 mt-1">Version {appInfo.version} (Build {appInfo.build})</div>
          <div className="text-gray-400 dark:text-gray-500 text-sm mt-2">Advanced AI Chat Platform</div>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm">
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Key Features</div>
          <div className="flex flex-row flex-wrap gap-2">
            {features.map((feature, index) => (
              <span key={index} className="bg-blue-50 dark:bg-blue-900 px-3 py-2 rounded-full text-blue-700 dark:text-blue-200 text-sm">{feature}</span>
            ))}
          </div>
        </div>

        {/* External Resources */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="text-lg font-semibold text-gray-900 mb-4">External Resources</div>
          {externalLinks.map((link, index) => {
            const IconComponent = link.icon;
            return (
              <button
                key={index}
                className="flex flex-row items-center justify-between py-3 border-b border-gray-100 last:border-0 w-full"
                onClick={() => openLink(link.url)}
              >
                <span className="flex flex-row items-center">
                  <IconComponent size={20} className="text-blue-500" />
                  <span className="text-base text-gray-900 ml-3">{link.name}</span>
                </span>
                <ExternalLink size={20} className="text-gray-400" />
              </button>
            );
          })}
        </div>

        {/* Credits */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="text-lg font-semibold text-gray-900 mb-4">Credits &amp; Acknowledgements</div>
          {credits.map((credit, index) => (
            <div key={index} className="flex flex-row items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <span className="text-base text-gray-900">{credit.name}</span>
              <span className="text-gray-500 text-sm">{credit.role}</span>
            </div>
          ))}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex flex-row items-start">
            <Heart size={16} className="text-gray-400 mt-0.5 mr-2" />
            <span className="text-xs text-gray-600">
              We appreciate all the open-source projects and libraries that made this application possible.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex flex-col items-center mb-4">
            <span className="text-gray-500 text-sm">© 2023 Zenux AI Technologies</span>
            <span className="text-gray-400 text-xs mt-1">All rights reserved</span>
          </div>
          <div className="flex flex-row justify-center gap-4">
            <button className="text-blue-500 text-sm">Terms of Service</button>
            <button className="text-blue-500 text-sm">Privacy Policy</button>
            <button className="text-blue-500 text-sm">Licenses</button>
          </div>
        </div>
      </div>
     
      {/* Safe area bottom padding */}
      <div className="pb-[env(safe-area-inset-bottom)]"></div>
    </div>
  );
}
