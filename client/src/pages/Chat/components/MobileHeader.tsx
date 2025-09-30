import React from 'react';

export default function MobileHeader({ title, onToggle }: { title: string; onToggle: () => void; }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 md:hidden">
      <button onClick={onToggle} className="p-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
        </svg>
      </button>
      <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</span>
      <div className="w-6" />
    </div>
  );
}
