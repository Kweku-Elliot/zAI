import React from 'react';
import { Plus, Sparkles, Wallet, Code, Layers, Settings2, Trophy, Users, X } from 'lucide-react';
import type { ChatSession } from '@/types';

export default function Sidebar({
  chatSessions,
  onNewChat,
  onSelectChat,
  user,
  onSignOut,
  navigateTo,
  onClose,
}: {
  chatSessions: ChatSession[] | null | undefined;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  user?: any;
  onSignOut: () => void;
  navigateTo: (p: string) => void;
  onClose?: () => void;
}) {
  return (
    <div className="absolute md:relative z-10 md:z-0 inset-y-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col min-h-0 md:flex transition-all duration-300 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">Zenux AI</span>
          {onClose && (
            <button onClick={onClose} className="md:hidden p-2 rounded-md ml-2">
              <X size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>
        <button onClick={onNewChat} className="flex items-center justify-center bg-blue-600 rounded-lg p-3 mt-4 w-full hover:bg-blue-700 dark:hover:bg-blue-800">
          <Plus size={20} stroke="white" />
          <span className="text-white font-semibold ml-2">New Chat</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-y-2 gap-x-2 p-3 border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => navigateTo('/image-video-gen')} className="items-center p-2 flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-1">
            <Sparkles size={20} color="#3B82F6" />
          </div>
          <span className="text-gray-600 dark:text-gray-300 text-xs">Generate</span>
        </button>
        <button onClick={() => navigateTo('/credit')} className="items-center p-2 flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-1">
            <Wallet size={20} color="#10B981" />
          </div>
          <span className="text-gray-600 dark:text-gray-300 text-xs">Credit</span>
        </button>
        <button onClick={() => navigateTo('/code-execution')} className="items-center p-2 flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-1">
            <Code size={20} color="#EF4444" />
          </div>
          <span className="text-gray-600 dark:text-gray-300 text-xs">Codez</span>
        </button>
        <button onClick={() => navigateTo('/project-setup')} className="items-center p-2 flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-1">
            <Layers size={20} color="#6366F1" />
          </div>
          <span className="text-gray-600 dark:text-gray-300 text-xs">Projects</span>
        </button>
        <button onClick={() => navigateTo('/settings')} className="items-center p-2 flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-1">
            <Settings2 size={20} color="#4B5563" />
          </div>
          <span className="text-gray-600 dark:text-gray-300 text-xs">Settings</span>
        </button>
        {user ? (
          <button onClick={() => { onSignOut(); navigateTo('/'); }} className="items-center p-2 flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg w-full">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-1">
              <Trophy size={20} color="#EF4444" />
            </div>
            <span className="text-gray-600 dark:text-gray-300 text-xs">Logout</span>
          </button>
        ) : (
          <button onClick={() => navigateTo('/login')} className="items-center p-2 flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg w-full">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-1">
              <Users size={20} color="#3B82F6" />
            </div>
            <span className="text-gray-600 dark:text-gray-300 text-xs">Login</span>
          </button>
        )}
      </div>

      <div className="flex-1 p-2 overflow-y-auto min-h-0">
        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold px-2 py-2 block">RECENT CHATS</span>
        {chatSessions && chatSessions.length > 0 ? (
          chatSessions.map((chat) => (
            <button key={chat.id} onClick={() => onSelectChat(chat.id)} className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-2">
                <span className="text-gray-600 dark:text-gray-300 font-medium">{chat.title?.charAt(0) || '?'}</span>
              </div>
              <div className="flex-1">
                <span className="text-gray-800 dark:text-gray-100 text-sm font-medium truncate block">{chat.title}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs block">{new Date(chat.lastMessageAt || chat.createdAt).toLocaleString()}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="px-2 text-xs text-gray-500">No recent chats yet. Start a conversation to create one.</div>
        )}
      </div>

      <div className="flex-none p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">Plan: Free</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs mt-1 block">Upgrade for more features</span>
            </div>
            <button onClick={() => navigateTo('/billing')} className="ml-3 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-1 rounded-lg text-sm">Upgrade</button>
          </div>
        </div>
      </div>
    </div>
  );
}
