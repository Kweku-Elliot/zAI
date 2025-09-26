
import React, { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, User, Search, QrCode, Send, Plus, Clock, CheckCircle } from 'lucide-react';

type Transaction = {
  id: string;
  name: string;
  avatar: string;
  amount: string;
  date: string;
  type: 'sent' | 'received';
  status: 'completed' | 'pending';
};

type Contact = {
  id: string;
  name: string;
  avatar: string;
  lastTransaction?: string;
};

const recentTransactions: Transaction[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
    amount: '$120.00',
    date: '2023-05-15',
    type: 'received',
    status: 'completed'
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
    amount: '$45.50',
    date: '2023-05-14',
    type: 'sent',
    status: 'completed'
  },
  {
    id: '3',
    name: 'Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
    amount: '$75.00',
    date: '2023-05-12',
    type: 'sent',
    status: 'completed'
  },
  {
    id: '4',
    name: 'David Brown',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
    amount: '$200.00',
    date: '2023-05-10',
    type: 'received',
    status: 'completed'
  },
];

const quickContacts: Contact[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
    lastTransaction: '$120.00'
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
    lastTransaction: '$45.50'
  },
  {
    id: '3',
    name: 'Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
    lastTransaction: '$75.00'
  },
  {
    id: '4',
    name: 'David Brown',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
    lastTransaction: '$200.00'
  },
];

export default function SendReceivePage() {
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  return (
    <div className="min-h-screen bg-background text-foreground pb-[env(safe-area-inset-bottom)] mobile-safe-container">
      {/* Header */}
      <div className="bg-card p-4 shadow-sm">
  <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">Send &amp; Receive</h2>
      </div>
      {/* Tab Selector */}
      <div className="flex bg-white mx-4 mt-4 rounded-xl p-1 shadow-sm">
        <button
          className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'send' ? 'bg-blue-500 dark:bg-blue-700' : 'bg-transparent'}`}
          type="button"
          onClick={() => setActiveTab('send')}
        >
          <span className={`font-medium ${activeTab === 'send' ? 'text-white dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>Send Money</span>
        </button>
        <button
          className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'receive' ? 'bg-blue-500 dark:bg-blue-700' : 'bg-transparent'}`}
          type="button"
          onClick={() => setActiveTab('receive')}
        >
          <span className={`font-medium ${activeTab === 'receive' ? 'text-white dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>Receive Money</span>
        </button>
      </div>
      {/* Send/Receive Content */}
      <div className="px-4 py-4">
        {activeTab === 'send' ? (
          <>
            {/* Amount Input */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6">
              <span className="text-gray-500 dark:text-gray-400 text-sm mb-2 block">Enter Amount</span>
              <div className="flex items-end">
                <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">$</span>
                <input
                  className="flex-1 text-3xl font-bold text-gray-900 dark:text-gray-100 ml-2 outline-none bg-transparent"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  type="number"
                />
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                {[10, 25, 50, 100].map(val => (
                  <button key={val} className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2" type="button" onClick={() => setAmount(val.toString())}>
                    <span className="text-gray-700 dark:text-gray-300">${val}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Recipient Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-6">
              <span className="text-gray-500 dark:text-gray-400 text-sm mb-3 block">Send To</span>
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3 mb-4">
                <Search color="#9CA3AF" size={20} className="mr-2" />
                <input
                  className="flex-1 text-gray-900 dark:text-gray-100 outline-none bg-transparent"
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                  placeholder="Search contacts or enter phone number"
                  type="text"
                />
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-sm mb-3 block">Quick Send</span>
              <div className="flex overflow-x-auto max-h-24">
                {quickContacts.map(item => (
                  <div key={item.id} className="flex flex-col items-center mr-4">
                    <div className="relative">
                      <img src={item.avatar} alt={item.name} className="w-14 h-14 rounded-full object-cover" />
                      <span className="absolute -bottom-1 right-0 bg-blue-500 dark:bg-blue-700 rounded-full p-1">
                        <Plus color="white" size={12} />
                      </span>
                    </div>
                    <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">{item.name.split(' ')[0]}</span>
                    {item.lastTransaction && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{item.lastTransaction}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Send Button */}
            <button className="bg-blue-500 dark:bg-blue-700 rounded-2xl py-4 w-full text-white font-bold text-lg shadow-md" type="button">
              Send Money
            </button>
          </>
        ) : (
          <>
            {/* Receive Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6 flex flex-col items-center">
              <span className="text-gray-500 dark:text-gray-400 text-sm mb-4">Your QR Code</span>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-6 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl flex items-center justify-center">
                  <div className="bg-black w-48 h-48 rounded-lg" />
                </div>
              </div>
              <div className="w-full">
                <span className="text-gray-500 dark:text-gray-400 text-sm mb-2 block">Your Wallet Address</span>
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3">
                  <span className="flex-1 text-gray-900 dark:text-gray-100 font-medium">a1b2c3d4-e5f6-7890-ghij</span>
                  <button type="button">
                    <Send color="#9CA3AF" size={20} />
                  </button>
                </div>
              </div>
            </div>
            {/* Request Button */}
            <button className="bg-blue-500 dark:bg-blue-700 rounded-2xl py-4 w-full text-white font-bold text-lg shadow-md mb-6" type="button">
              Request Money
            </button>
            {/* Share Options */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
              <span className="text-gray-500 dark:text-gray-400 text-sm mb-3 block">Share Your Wallet Address</span>
              <div className="flex justify-around">
                <div className="flex flex-col items-center">
                  <div className="bg-blue-100 dark:bg-blue-700 rounded-full p-3">
                    <QrCode color="#3B82F6" size={24} />
                  </div>
                  <span className="mt-2 text-gray-700 dark:text-blue-300">QR Code</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-green-100 dark:bg-green-700 rounded-full p-3">
                    <User color="#10B981" size={24} />
                  </div>
                  <span className="mt-2 text-gray-700 dark:text-green-300">Contacts</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-purple-100 dark:bg-purple-700 rounded-full p-3">
                    <Send color="#8B5CF6" size={24} />
                  </div>
                  <span className="mt-2 text-gray-700 dark:text-purple-300">Share</span>
                </div>
              </div>
            </div>
          </>
        )}
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mt-6">
          <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
            <span className="font-bold text-gray-900 dark:text-gray-100">Recent Transactions</span>
            <button type="button" className="text-blue-500 dark:text-blue-300">View All</button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentTransactions.map(item => (
              <div key={item.id} className="flex items-center py-3 px-2">
                <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1 ml-3">
                  <span className="font-medium text-gray-900 dark:text-gray-100 block">{item.name}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm block">{item.date}</span>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
                    {item.type === 'sent' ? (
                      <ArrowUpCircle color="#EF4444" size={16} className="mr-1" />
                    ) : (
                      <ArrowDownCircle color="#10B981" size={16} className="mr-1" />
                    )}
                    <span className={`font-medium ${item.type === 'sent' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-300'}`}>{item.type === 'sent' ? '-' : '+'}{item.amount}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    {item.status === 'completed' ? (
                      <CheckCircle color="#10B981" size={12} className="mr-1" />
                    ) : (
                      <Clock color="#9CA3AF" size={12} className="mr-1" />
                    )}
                    <span className={`text-xs ${item.status === 'completed' ? 'text-green-500 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}>{item.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
