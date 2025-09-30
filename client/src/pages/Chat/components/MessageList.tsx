import React from 'react';
import { MarkdownMessage } from '@/components/MarkdownMessage';

export default function MessageList({ messages, onCopy, onResend, onRewrite }: { messages: any[]; onCopy: (t: string) => void; onResend: (id: string) => void; onRewrite: (t: string, id: string) => void; }) {
  return (
    <div className="flex flex-col min-h-full pb-[50px] w-full">
      <div className="flex-1" />
      <div className="space-y-4 px-2 pb-4 w-full">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col my-3 w-full ${msg.isAI ? 'items-start' : 'items-end'}`}>
            {/* Show attached file above user message if present */}
            {!msg.isAI && msg.file && (
              <div className="flex items-center mb-2 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                {msg.file.url && msg.file.type?.startsWith('image/') ? (
                  <img src={msg.file.url} alt={msg.file.name} className="w-10 h-10 object-cover rounded" />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-900 rounded">
                    {/* Generic file icon SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-8 0h8m-8 0v12a1 1 0 001 1h6a1 1 0 001-1V7m-8 0h8" />
                    </svg>
                  </div>
                )}
                <div className="ml-2 flex flex-col">
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-100">{msg.file.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{msg.file.type}</span>
                  {msg.file.uploadedName && (
                    <span className="text-xs text-green-600 dark:text-green-400">Uploaded as: {msg.file.uploadedName}</span>
                  )}
                </div>
              </div>
            )}
            <div className={`max-w-[90vw] sm:max-w-[85%] rounded-2xl p-4 break-words ${msg.isAI ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-tl-none' : 'bg-blue-600 rounded-br-none'} ${msg.isAI ? '' : 'ml-auto'}`}>
              {msg.isAI ? (
                <div className="prose dark:prose-invert prose-sm max-w-none"><MarkdownMessage text={msg.text} /></div>
              ) : (
                <span className="text-sm text-white">{msg.text}</span>
              )}
            </div>
            <div className={`w-full mt-1 px-4 ${msg.isAI ? 'justify-start' : 'justify-end'} flex`}>
              {msg.isAI ? (
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); onResend(msg.id); }} title="Resend" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-600 dark:text-gray-300"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onCopy(msg.text); }} title="Copy" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-600 dark:text-gray-300"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); onCopy(msg.text); }} title="Copy" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-500 dark:text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onRewrite(msg.text, msg.id); }} title="Rewrite" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-500 dark:text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
