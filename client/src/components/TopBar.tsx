import React from 'react';
import { ChevronLeft } from 'lucide-react';

type TopBarProps = {
  title: string;
  onBack?: () => void;
};

const TopBar = React.forwardRef<HTMLDivElement, TopBarProps>(({ title, onBack }, ref) => {
  return (
    <div ref={ref} className="bg-white pt-[env(safe-area-inset-top)] pt-12 pb-4 px-4 shadow-sm fixed top-0 left-0 w-full z-30">
      <div className="flex items-center justify-between">
        <button className="p-2" onClick={onBack || (() => window.history.back())} aria-label="Go back">
          <ChevronLeft size={24} color="#2C3E50" />
        </button>
        <span className="text-lg font-bold text-gray-800">{title}</span>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>
    </div>
  );
});

export default TopBar;
