import React from 'react';
import { CheckCircle, Home, Receipt } from 'lucide-react';

export default function PaymentConfirmedPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6 py-12">
      {/* Confirmation Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center shadow-lg w-full max-w-md">
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle color="#2ECC71" size={48} />
        </div>
        {/* Success Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 text-center mb-8">
          Your transaction has been processed successfully
        </p>
        {/* Order Details */}
        <div className="w-full bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">Order ID</span>
            <span className="text-gray-900 font-semibold">#ORD-789456</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">Item</span>
            <span className="text-gray-900">Data Bundle - 5GB</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">Amount</span>
            <span className="text-gray-900 font-bold">$19.08</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">Date</span>
            <span className="text-gray-900">May 15, 2023</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
            <span className="text-gray-900">Wallet Balance</span>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex w-full gap-3">
          <button className="flex-1 flex flex-row items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl p-4" type="button">
            <Receipt color="#4A90E2" size={20} />
            <span className="text-blue-600 dark:text-blue-300 font-bold ml-2">View Receipt</span>
          </button>
          <button className="flex-1 flex flex-row items-center justify-center bg-blue-600 rounded-xl p-4" type="button">
            <Home color="white" size={20} />
            <span className="text-white font-bold ml-2">Home</span>
          </button>
        </div>
      </div>
      {/* Additional Info */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow w-full max-w-md">
        <h3 className="text-gray-900 dark:text-gray-100 font-bold mb-3">What's Next?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-2">• Your data bundle will be activated within 24 hours</p>
        <p className="text-gray-600 dark:text-gray-400 mb-2">• You'll receive a confirmation SMS shortly</p>
        <p className="text-gray-600 dark:text-gray-400">• Check your usage in the 'My Bundles' section</p>
      </div>
      {/* Safe area bottom padding */}
      <div className="pb-[env(safe-area-inset-bottom)]"></div>
    </div>
  );
}
