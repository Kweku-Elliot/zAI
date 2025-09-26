import React from 'react';
import { ArrowLeft, Printer, Share2, Download, Home, Wallet, Users, Send } from 'lucide-react';

const receiptDetails = {
  orderId: '#ORD-789456',
  date: 'May 15, 2023',
  time: '14:30 PM',
  item: 'Data Bundle - 5GB',
  validity: '15 days',
  amount: '$19.08',
  paymentMethod: 'Wallet Balance',
  transactionId: 'TXN-987654123',
  status: 'Completed',
};

export default function ReceiptPage() {
  const handlePrint = () => {
    alert('Printing functionality would be implemented here');
  };
  const handleShare = () => {
    alert('Sharing functionality would be implemented here');
  };
  const handleDownload = () => {
    alert('Downloading functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col dark:text-white">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 bg-white">
        <div className="flex items-center mb-2">
          <button className="mr-3" type="button">
            <ArrowLeft color="#2C3E50" size={24} />
          </button>
          <span className="text-gray-900 dark:text-gray-100 text-2xl font-bold">Payment Receipt</span>
        </div>
        <span className="text-gray-600 dark:text-gray-400">Detailed transaction information</span>
      </div>
      <div className="flex-1 px-4 pt-4 overflow-y-auto">
  {/* Receipt Card */}
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow mb-6">
          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full">
              <span className="text-green-700 dark:text-green-300 font-bold text-center">Payment Successful</span>
            </div>
          </div>
          {/* Receipt Header */}
          <div className="flex flex-col items-center mb-6">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{receiptDetails.amount}</span>
            <span className="text-gray-600 dark:text-gray-400 mt-1">{receiptDetails.item}</span>
          </div>
          {/* Receipt Details */}
          <div className="border-t border-b border-gray-200 py-4 my-4">
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Order ID</span>
              <span className="text-gray-900 dark:text-gray-100 font-semibold">{receiptDetails.orderId}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Date & Time</span>
              <span className="text-gray-900 dark:text-gray-100">{receiptDetails.date} at {receiptDetails.time}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Item</span>
              <span className="text-gray-900 dark:text-gray-100">{receiptDetails.item}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Validity</span>
              <span className="text-gray-900 dark:text-gray-100">{receiptDetails.validity}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Amount</span>
              <span className="text-gray-900 dark:text-gray-100 font-bold">{receiptDetails.amount}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
              <span className="text-gray-900 dark:text-gray-100">{receiptDetails.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
              <span className="text-gray-900 dark:text-gray-100">{receiptDetails.transactionId}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Status</span>
              <span className="text-green-600 dark:text-green-400 font-bold">{receiptDetails.status}</span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-around mt-4">
            <button className="flex flex-col items-center p-3" type="button" onClick={handlePrint}>
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2">
                <Printer color="#4A90E2" size={24} />
              </div>
              <span className="text-gray-700 dark:text-gray-300">Print</span>
            </button>
            <button className="flex flex-col items-center p-3" type="button" onClick={handleShare}>
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2">
                <Share2 color="#4A90E2" size={24} />
              </div>
              <span className="text-gray-700 dark:text-gray-300">Share</span>
            </button>
            <button className="flex flex-col items-center p-3" type="button" onClick={handleDownload}>
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2">
                <Download color="#4A90E2" size={24} />
              </div>
              <span className="text-gray-700 dark:text-gray-300">Download</span>
            </button>
          </div>
        </div>
        {/* Additional Info */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow mb-6">
          <span className="text-gray-900 dark:text-gray-100 font-bold mb-3 block">Transaction Details</span>
          <span className="text-gray-600 dark:text-gray-400 mb-2 block">• Your data bundle will be activated within 24 hours</span>
          <span className="text-gray-600 dark:text-gray-400 mb-2 block">• You'll receive a confirmation SMS shortly</span>
          <span className="text-gray-600 dark:text-gray-400 block">• Check your usage in the 'My Bundles' section</span>
        </div>
        {/* Navigation Options */}
        <div className="mt-6 mb-8 bg-white rounded-2xl p-4 shadow">
          <span className="text-gray-900 dark:text-gray-100 text-lg font-bold mb-4 block text-center">Quick Actions</span>
          <div className="flex flex-wrap gap-4">
            <button className="flex-1 min-w-[40%] bg-blue-50 dark:bg-blue-900 rounded-xl p-4 flex flex-col items-center" type="button">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-700 flex items-center justify-center mb-2">
                <Home color="#4A90E2" size={24} />
              </div>
              <span className="text-gray-700 dark:text-blue-300 font-medium">Home</span>
            </button>
            <button className="flex-1 min-w-[40%] bg-green-50 dark:bg-green-900 rounded-xl p-4 flex flex-col items-center" type="button">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-700 flex items-center justify-center mb-2">
                <Wallet color="#2ECC71" size={24} />
              </div>
              <span className="text-gray-700 dark:text-green-300 font-medium">Wallet</span>
            </button>
            <button className="flex-1 min-w-[40%] bg-purple-50 dark:bg-purple-900 rounded-xl p-4 flex flex-col items-center" type="button">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-700 flex items-center justify-center mb-2">
                <Users color="#9B59B6" size={24} />
              </div>
              <span className="text-gray-700 dark:text-purple-300 font-medium">Group Chat</span>
            </button>
            <button className="flex-1 min-w-[40%] bg-orange-50 dark:bg-orange-900 rounded-xl p-4 flex flex-col items-center" type="button">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-700 flex items-center justify-center mb-2">
                <Send color="#F39C12" size={24} />
              </div>
              <span className="text-gray-700 dark:text-orange-300 font-medium">Send Money</span>
            </button>
          </div>
        </div>
      </div>
      {/* Safe area bottom padding */}
      <div className="pb-[env(safe-area-inset-bottom)]"></div>
    </div>
  );
}
