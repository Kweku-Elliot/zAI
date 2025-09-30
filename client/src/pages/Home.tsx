import React from 'react';
import TopBar from '@/components/TopBar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <TopBar title="Zenux Home" onBack={() => { /* noop */ }} />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome to Zenux AI</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Start chatting with the AI or explore the tools in the sidebar.</p>
      </div>
    </div>
  );
}
