import React, { useState, useContext } from 'react';
import { ArrowLeft, CreditCard, Wallet, Gift, ShieldCheck, Check } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { AuthContext } from '../contexts/AuthContext';
import { useLocation } from 'wouter';

export default function CheckoutPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('paystack');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [, setLocation] = useLocation();

  const paymentMethods = [
    { id: 'paystack', title: 'Paystack', icon: <CreditCard color="#4A90E2" size={24} />, description: 'Pay with card, bank, or mobile money' },
    { id: 'wallet', title: 'Wallet Balance', icon: <Wallet color="#4A90E2" size={24} />, balance: '$1,248.75' },
    { id: 'credits', title: 'AI Credits', icon: <Gift color="#4A90E2" size={24} />, balance: '1,250 credits' },
  ];

  const orderDetails = {
    item: 'Pro Plan Subscription',
    price: '₵40.00',
    validity: '30 days',
    description: 'Full access to all Pro features for 30 days',
  };

  const orderSummary = {
    subtotal: '₵40.00',
    tax: '₵2.40',
    total: '₵42.40',
  };

  // Paystack configuration
  const config = {
    reference: (new Date()).getTime().toString(),
    email: user?.email || 'user@example.com',
    amount: 4240, // Amount in pesewas (₵42.40 = 4240 pesewas)
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_b6ee01322eab1d6a01dbbe029c0e5eea4afd9a75',
    currency: 'GHS',
    metadata: {
      custom_fields: [
        {
          display_name: "Plan",
          variable_name: "plan",
          value: "Pro Plan"
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    console.log('Payment successful!', reference);
    setLocation('/payment-confirmed');
  };

  const onClose = () => {
    console.log('Payment cancelled');
    setLoading(false);
  };

  const handlePayment = () => {
    if (selectedPaymentMethod === 'paystack') {
      setLoading(true);
      initializePayment({ onSuccess, onClose });
    } else {
      alert(`Payment with ${paymentMethods.find(m => m.id === selectedPaymentMethod)?.title} coming soon!`);
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col pb-[env(safe-area-inset-bottom)] dark:text-white">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 bg-white">
        <div className="flex items-center mb-2">
          <button className="mr-3" type="button">
            <ArrowLeft color="#2C3E50" size={24} />
          </button>
          <span className="text-gray-900 dark:text-gray-100 text-2xl font-bold">Checkout</span>
        </div>
        <span className="text-gray-600 dark:text-gray-400">Review your order and payment details</span>
      </div>
      <div className="flex-1 px-4 pt-4 overflow-y-auto">
        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow mb-6">
          <span className="text-gray-900 dark:text-gray-100 text-lg font-bold mb-4 block">Order Summary</span>
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900 rounded-xl mb-4">
            <div>
              <span className="text-gray-900 dark:text-gray-100 font-bold block">{orderDetails.item}</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm mt-1 block">{orderDetails.description}</span>
            </div>
            <span className="text-gray-900 dark:text-gray-100 font-bold">{orderDetails.price}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="text-gray-900 dark:text-gray-100">{orderSummary.subtotal}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">Tax</span>
            <span className="text-gray-900 dark:text-gray-100">{orderSummary.tax}</span>
          </div>
          <div className="flex justify-between py-3 border-t border-gray-200 dark:border-gray-700 mt-2">
            <span className="text-gray-900 dark:text-gray-100 font-bold">Total</span>
            <span className="text-gray-900 dark:text-gray-100 font-bold text-lg">{orderSummary.total}</span>
          </div>
        </div>
        {/* Payment Method */}
        <div className="mt-6 bg-white rounded-2xl p-4 shadow mb-6">
          <span className="text-gray-900 dark:text-gray-100 text-lg font-bold mb-4 block">Payment Method</span>
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              className={`flex items-center p-4 rounded-xl mb-3 w-full text-left ${
                selectedPaymentMethod === method.id ? 'bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700' : 'bg-gray-50 dark:bg-gray-800'
              }`}
              type="button"
              onClick={() => setSelectedPaymentMethod(method.id)}
              data-testid={`button-payment-${method.id}`}
            >
              <span className="mr-3">{method.icon}</span>
              <span className="flex-1">
                <span className="text-gray-900 dark:text-gray-100 font-semibold block">{method.title}</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm block">
                  {method.balance ? `Balance: ${method.balance}` : method.description || ''}
                </span>
              </span>
              {selectedPaymentMethod === method.id && (
                <span className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center">
                  <Check color="white" size={16} />
                </span>
              )}
            </button>
          ))}
        </div>
        {/* Security Info */}
        <div className="mt-6 bg-white rounded-2xl p-4 shadow mb-6">
          <div className="flex items-center mb-3">
            <ShieldCheck color="#2ECC71" size={24} />
            <span className="text-gray-900 dark:text-gray-100 text-lg font-bold ml-2">Secure Payment</span>
          </div>
          <span className="text-gray-600 dark:text-gray-400 block">
            Your payment information is encrypted and securely processed. <br />
            We do not store your credit card details.
          </span>
        </div>
        {/* Confirm Button */}
        <button 
          className="mt-6 mb-8 bg-blue-600 rounded-2xl p-5 w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" 
          type="button"
          onClick={handlePayment}
          disabled={loading}
          data-testid="button-confirm-payment"
        >
          <span className="text-white text-lg font-bold">
            {loading ? 'Processing...' : 'Confirm Payment'}
          </span>
        </button>
      </div>
    </div>
  );
}
