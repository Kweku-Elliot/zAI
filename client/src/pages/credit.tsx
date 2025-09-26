
import React from 'react';
import { useLocation } from 'wouter';
import { Wallet, CreditCard, Send, QrCode, BarChart3, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import TopBar from '@/components/TopBar';

const transactions = [
  { id: 1, title: 'AI Subscription', amount: -19.99, date: '2023-05-15', type: 'expense' },
  { id: 2, title: 'Voice Credits', amount: -4.99, date: '2023-05-12', type: 'expense' },
  { id: 3, title: 'Referral Bonus', amount: 10.00, date: '2023-05-10', type: 'income' },
  { id: 4, title: 'File Processing', amount: -2.49, date: '2023-05-08', type: 'expense' },
  { id: 5, title: 'Premium Upgrade', amount: -29.99, date: '2023-05-01', type: 'expense' },
];

export default function WalletPage() {
  // balance visibility removed — using credits view
  const credits = {
    ai: 1250,
    voice: 250,
    project: 12,
    image: 300,
  };
  const [, setLocation] = useLocation();

  return (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-[calc(3rem+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] dark:text-white">
  {/* Header */}
  <TopBar title="My Wallet" onBack={() => window.history.back()} />
      <div className="pt-12 pb-6 px-6 bg-white">
        {/* Credits Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-800 text-lg font-semibold">Credits</h3>
              <p className="text-sm text-gray-500">Your available allocation across credit types</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-blue-600 hover:underline" onClick={() => alert('Manage credits coming soon')}>Manage</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Wallet color="#0EA5A4" size={20} />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{credits.ai}</div>
                <div className="text-xs text-gray-500">AI Credits</div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <CreditCard color="#7C3AED" size={20} />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{credits.voice}</div>
                <div className="text-xs text-gray-500">Voice Tokens</div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <Send color="#4338CA" size={20} />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{credits.project}</div>
                <div className="text-xs text-gray-500">Project Credits</div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <QrCode color="#CA8A04" size={20} />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{credits.image}</div>
                <div className="text-xs text-gray-500">Image/Gen Credits</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex justify-around py-6 px-4 bg-white">
        <div className="flex flex-col items-center">
          <button
            className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2 shadow"
            onClick={() => setLocation('/send-receive')}
            type="button"
            aria-label="Send Money"
          >
            <Send color="gray" size={24} />
          </button>
          <span className="text-gray-700 dark:text-gray-300">Send</span>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2 shadow"
            onClick={() => setLocation('/send-receive')}
            type="button"
            aria-label="Request Money"
          >
            <ArrowDownLeft color="gray" size={24} />
          </button>
          <span className="text-gray-700 dark:text-gray-300">Request</span>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2 shadow"
            onClick={() => alert('Scan functionality coming soon.')}
            type="button"
            aria-label="Scan"
          >
            <QrCode color="gray" size={24} />
          </button>
          <span className="text-gray-700 dark:text-gray-300">Scan</span>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2 shadow"
            onClick={() => setLocation('/top-up')}
            type="button"
            aria-label="Top Up"
          >
            <CreditCard color="gray" size={24} />
          </button>
          <span className="text-gray-700 dark:text-gray-300">Top Up</span>
        </div>
      </div>
      {/* Recent Transactions */}
      <div className="bg-gray-100 px-4 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-900 text-xl font-bold">Recent Transactions</span>
          <button type="button" className="text-blue-600">See All</button>
        </div>
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center py-4 border-b border-gray-200">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                {transaction.type === 'income' ? (
                  <ArrowDownLeft color="green" size={24} />
                ) : (
                  <ArrowUpRight color="red" size={24} />
                )}
              </div>
              <div className="flex-1 ml-4">
                <span className="text-gray-900 font-semibold block">{transaction.title}</span>
                <span className="text-gray-500 text-sm block">{transaction.date}</span>
              </div>
              <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        {/* Analytics Section */}
        <div className="mt-6 bg-white rounded-2xl p-4 shadow">
          <div className="flex items-center mb-4">
            <BarChart3 color="gray" size={24} />
            <span className="text-gray-900 text-lg font-bold ml-2">Usage Analytics</span>
          </div>
          <div className="h-40 rounded-xl overflow-hidden mb-4">
            <img 
              src="https://images.unsplash.com/photo-1641312874336-6279a832a3dc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8VGVjaG5vbG9neSUyMGlubm92YXRpb258ZW58MHx8MHx8fDA%3D" 
              alt="Analytics" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="text-gray-600 text-center block">
            You've used 75% of your monthly AI credits
          </span>
        </div>
        {/* Cryptocurrency Section */}
        <div className="mt-6 bg-white rounded-2xl p-4 shadow mb-6">
          <div className="flex items-center mb-4">
            <Wallet color="gray" size={24} />
            <span className="text-gray-900 text-lg font-bold ml-2">Digital Assets</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-gray-600">AI Credits</span>
            <span className="text-gray-900 font-bold">1,250 credits</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Voice Tokens</span>
            <span className="text-gray-900 font-bold">250 tokens</span>
          </div>
        </div>
      </div>
    </div>
  );
}
