import React, { useState } from 'react';

const onboardingData = [
  {
    id: 1,
    title: "Smart AI Chat",
    description:
      "Experience next-generation conversations with our intelligent AI assistant that understands context and provides meaningful responses.",
    image:
      "https://images.unsplash.com/photo-1694903110330-cc64b7e1d21d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 2,
    title: "Wallet & MoMo Transfers",
    description:
      "Securely send and receive money with our integrated wallet system. Pay bills, transfer funds, and manage your finances seamlessly.",
    image:
      "https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Yml0Y29pbnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 3,
    title: "Affordable Stua",
    description:
      "Get exclusive data bundles and services designed specifically for students at prices that won't break the bank.",
    image:
      "https://images.unsplash.com/photo-1515073838964-4d4d56a58b21?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8U3R1ZGVudCUyMGxlYXJuZXIlMjBwdXBpbCUyMGVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 4,
    title: "Personalized Experience",
    description:
      "Enjoy a tailored experience with smart recommendations based on your preferences and usage patterns.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D",
  },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => Math.min(c + 1, onboardingData.length - 1));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#4A90E2] to-[#6A5ACD] dark:from-gray-900 dark:to-gray-900 flex items-center justify-center">
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <img
          src={onboardingData[current].image}
          alt={onboardingData[current].title}
          className="w-40 h-40 object-cover rounded-xl mb-6"
        />
  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
          {onboardingData[current].title}
        </h2>
  <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          {onboardingData[current].description}
        </p>
        <div className="flex gap-2 mb-6">
          {onboardingData.map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full ${idx === current ? 'bg-blue-500 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-700'}`}
            />
          ))}
        </div>
        <div className="flex w-full justify-between">
          <button
            className="px-6 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 font-semibold"
            onClick={prev}
            disabled={current === 0}
          >
            Previous
          </button>
          <button
            className="px-6 py-2 rounded-xl bg-blue-600 dark:bg-blue-700 text-white font-semibold"
            onClick={next}
            disabled={current === onboardingData.length - 1}
          >
            Next
          </button>
        </div>
      </div>
      {/* Safe area bottom padding */}
      <div className="pb-[env(safe-area-inset-bottom)]"></div>
    </div>
  );
}
