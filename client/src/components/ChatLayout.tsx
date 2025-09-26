import React, { PropsWithChildren } from 'react';

export default function ChatLayout({ children }: PropsWithChildren) {
  // Use full viewport height and ensure child flex containers can size correctly
  return (
    <div className="h-screen w-full bg-gray-50">
      <div className="flex h-full w-full">
        {children}
      </div>
    </div>
  );
}
