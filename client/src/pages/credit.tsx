
import React, { useState, useContext } from 'react';
import { useLocation } from 'wouter';
import { Wallet, CreditCard, Send, QrCode, BarChart3, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import TopBar from '@/components/TopBar';
import QRCodeComponent from '../components/QRCode';
import QRScannerComponent from '../components/QRScanner';
import { AuthContext } from '../contexts/AuthContext';

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
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const { user } = useContext(AuthContext);

  const handleQRScan = (result: string) => {
    setScanResult(result);
    console.log('QR Scan result:', result);
    // Here you would handle the scanned QR code - could be a wallet address, payment request, etc.
    alert(`QR Code scanned: ${result}`);
  };

  const handleSendCredits = () => {
    setLocation('/send-receive');
  };

  const handleReceiveCredits = () => {
    setLocation('/send-receive');
  };

  const handleTopUp = () => {
    setLocation('/billing');
  };

  // Generate a wallet address for QR code
  const walletAddress = user?.id ? `zenux_wallet_${user.id}` : 'zenux_wallet_demo';

  return (
  <div className="min-h-screen bg-background pt-[calc(3rem+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] text-foreground mobile-safe-container">
  {/* Header */}
  <TopBar title="My Wallet" onBack={() => window.history.back()} />
      <div className="pt-12 pb-6 px-6 bg-card">
        {/* Credits Card */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-card-foreground text-lg font-semibold">Credits</h3>
              <p className="text-sm text-muted-foreground">Your available allocation across credit types</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-primary hover:underline" onClick={handleTopUp}>Manage</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center p-3 bg-muted rounded-lg">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Wallet color="#0EA5A4" size={20} />
              </div>
              <div>
                <div className="text-lg font-bold text-card-foreground">{credits.ai}</div>
                <div className="text-xs text-muted-foreground">AI Credits</div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-muted rounded-lg">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <CreditCard color="#7C3AED" size={20} />
              </div>
              <div>
                <div className="text-lg font-bold text-card-foreground">{credits.voice}</div>
                <div className="text-xs text-muted-foreground">Voice Tokens</div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-muted rounded-lg">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <Send color="#4338CA" size={20} />
              </div>
              <div>
                <div className="text-lg font-bold text-card-foreground">{credits.project}</div>
                <div className="text-xs text-muted-foreground">Project Credits</div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-muted rounded-lg">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <QrCode color="#CA8A04" size={20} />
              </div>
              <div>
                <div className="text-lg font-bold text-card-foreground">{credits.image}</div>
                <div className="text-xs text-muted-foreground">Image/Gen Credits</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex justify-around py-6 px-4 bg-card">
        <div className="flex flex-col items-center">
          <button
            className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-2 shadow hover:bg-muted/80"
            onClick={handleSendCredits}
            type="button"
            aria-label="Send Credits"
          >
            <Send className="text-muted-foreground" size={24} />
          </button>
          <span className="text-muted-foreground">Send</span>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-2 shadow hover:bg-muted/80"
            onClick={handleReceiveCredits}
            type="button"
            aria-label="Request Credits"
          >
            <ArrowDownLeft className="text-muted-foreground" size={24} />
          </button>
          <span className="text-muted-foreground">Request</span>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-2 shadow hover:bg-muted/80"
            onClick={() => setShowQRScanner(true)}
            type="button"
            aria-label="Scan QR Code"
          >
            <QrCode className="text-muted-foreground" size={24} />
          </button>
          <span className="text-muted-foreground">Scan</span>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-2 shadow hover:bg-muted/80"
            onClick={handleTopUp}
            type="button"
            aria-label="Top Up"
          >
            <CreditCard className="text-muted-foreground" size={24} />
          </button>
          <span className="text-muted-foreground">Top Up</span>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="px-4 mb-4">
        <div className="bg-card rounded-2xl p-6 shadow border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-card-foreground text-lg font-semibold">Your Wallet QR</h3>
            <button 
              className="text-sm text-primary hover:underline"
              onClick={() => navigator.clipboard.writeText(walletAddress)}
              type="button"
            >
              Copy Address
            </button>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-xl mb-4">
              <QRCodeComponent value={walletAddress} size={200} />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code to receive credits
            </p>
            <p className="text-xs text-muted-foreground text-center mt-2 break-all">
              {walletAddress}
            </p>
          </div>
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

      {/* QR Scanner Component */}
      <QRScannerComponent 
        isOpen={showQRScanner}
        onScan={handleQRScan}
        onClose={() => setShowQRScanner(false)}
      />
    </div>
  );
}
