import React, { useState } from 'react';
import { CreditCard, Download, Check, X, Lock } from 'lucide-react';
import TopBar from '@/components/TopBar';

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'plus' | 'pro' | 'proplus'>('plus');
  const [_showPaymentFlow, _setShowPaymentFlow] = useState(false);

  const _usageData = {
    messages: { used: 850, limit: 1000 },
    files: { used: 12, limit: 20 },
    voice: { used: 45, limit: 60 },
    api: { used: 150, limit: 500 },
    resetDate: '2023-10-15',
  };

  const plans = [
    {
      id: 'free',
      name: 'Free (₵0)',
      price: '₵0',
      period: '/month',
      features: [
        'AI Chat – Fast: 20 / day',
        'AI Chat – Heavy: Coming Soon',
        'AI Chat – Auto: Coming Soon',
        'CodeZ (Code Exec.): 10 / day',
        'Image Generation: None',
        'File Uploads: 20MB / day',
        'Cloud Storage: 50MB',
        'Video Generation: Coming Soon',
        'Voice Chat: Coming Soon',
        'Daily Reset',
      ],
      limitations: [],
      color: 'gray',
      gradient: ['#9CA3AF', '#6B7280'],
      current: selectedPlan === 'free',
    },
    {
      id: 'plus',
      name: 'Student (₵25)',
      price: '₵25',
      period: '/month',
      features: [
        'AI Chat – Fast: 100 / day',
        'AI Chat – Heavy: Coming Soon',
        'AI Chat – Auto: Coming Soon',
        'CodeZ (Code Exec.): 40 / day',
        'Image Generation: 20 / day',
        'File Uploads: 100MB / day',
        'Cloud Storage: 500MB',
        'Video Generation: Coming Soon',
        'Voice Chat: Coming Soon',
        'Daily Reset',
      ],
      limitations: [],
      color: 'blue',
      gradient: ['#3B82F6', '#60A5FA'],
      current: selectedPlan === 'plus',
    },
    {
      id: 'pro',
      name: 'Pro (₵70)',
      price: '₵70',
      period: '/month',
      features: [
        'AI Chat – Fast: 400 / day',
        'AI Chat – Heavy: Coming Soon',
        'AI Chat – Auto: Coming Soon',
        'CodeZ (Code Exec.): 150 / day',
        'Image Generation: 80 / day',
        'File Uploads: 500MB / day',
        'Cloud Storage: 2GB',
        'Video Generation: Coming Soon',
        'Voice Chat: Coming Soon',
        'Daily Reset',
      ],
      limitations: [],
      color: 'purple',
      gradient: ['#8B5CF6', '#A78BFA'],
      current: selectedPlan === 'pro',
    },
    {
      id: 'proplus',
      name: 'Pro+ (₵130)',
      price: '₵130',
      period: '/month',
      features: [
        'AI Chat – Fast: 1,200 / day',
        'AI Chat – Heavy: Coming Soon',
        'AI Chat – Auto: Coming Soon',
        'CodeZ (Code Exec.): 400 / day',
        'Image Generation: 200 / day',
        'File Uploads: 2GB / day',
        'Cloud Storage: 5GB',
        'Video Generation: Coming Soon',
        'Voice Chat: Coming Soon',
        'Daily Reset',
      ],
      limitations: [],
      color: 'red',
      gradient: ['#EF4444', '#F87171'],
      current: selectedPlan === 'proplus',
    },
  ];

  // Billing history will be loaded from live data in production
  

  function renderPlanCard(plan: typeof plans[0]) {
    const textClass = plan.color === 'gray' ? 'text-gray-900' : 'text-white';

    return (
      <button
        key={plan.id}
        className={`rounded-2xl overflow-hidden mb-6 w-full text-left ${plan.current ? 'border-2 border-blue-500' : ''}`}
        type="button"
        onClick={() => setSelectedPlan(plan.id as any)}
      >
        <div
          className="p-6"
          style={{
            backgroundImage: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})`,
            backgroundColor: plan.gradient[0],
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <span className={`${textClass} text-xl font-bold block`}>{plan.name}</span>
              <div className="flex items-baseline mt-1">
                <span className={`${textClass} text-3xl font-bold`}>{plan.price}</span>
                <span className={`${textClass} text-sm ml-1`}>{plan.period}</span>
              </div>
            </div>
            {plan.current && (
              <span className="bg-white/20 rounded-full p-2">
                <Check size={20} color="white" />
              </span>
            )}
          </div>
          <div className="mt-6">
            {plan.features.map((feature, index) => (
              feature === 'Daily Reset' ? (
                <div key={index} className="flex items-center mt-2">
                  <Check size={16} color="white" />
                  <span className={`${textClass} ml-2`}>{feature}</span>
                </div>
              ) : (
                <div key={index} className="flex items-center mt-2">
                  <span className={`${textClass}`}>{feature}</span>
                </div>
              )
            ))}
          </div>
          {plan.limitations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/30">
              {plan.limitations.map((limitation, index) => (
                <div key={index} className="flex items-center mt-2">
                  <X size={14} color="white" />
                  <span className={`${textClass} ml-2 text-sm`} style={{ opacity: 0.8 }}>{limitation}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </button>
    );
  }

  return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col pt-[calc(3rem+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] dark:text-white">
  <TopBar title="Billing" onBack={() => window.history.back()} />
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Billing Cycle Toggle */}
        <div className="bg-white rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">Billing Cycle</span>
            <div className="flex items-center">
              <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Monthly</span>

              <button
                role="switch"
                aria-checked={billingCycle === 'yearly'}
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>

              <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Yearly</span>
              <span className="ml-4 bg-green-100 px-2 py-1 rounded-full">
                <span className="text-green-700 text-xs font-medium">Save 10%</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Plans */}
        <span className="text-lg font-bold text-gray-900 mt-6 mb-4 block">Plans</span>
        {plans.map(renderPlanCard)}
        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CreditCard size={20} color="#6B7280" />
              <span className="font-medium text-gray-900 ml-2">Payment Methods</span>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="bg-gray-100 p-3 rounded-lg">
              <span className="font-medium">Paystack</span>
            </span>
            <span className="ml-3">
              <span className="font-medium">Mobile money</span>
              <span className="text-gray-500 text-sm block">Cards/Bank</span>
            </span>
            <span className="ml-auto bg-green-100 px-2 py-1 rounded-full">
              <span className="text-green-700 text-xs font-medium">Primary</span>
            </span>
          </div>
           <div className="flex items-center mt-4">
            <span className="bg-gray-100 p-3 rounded-lg">
              <span className="font-medium">Binance Pay</span>
            </span>
            <span className="ml-3">
              <span className="font-medium">Crypto/Fiat</span>
              <span className="text-gray-500 text-sm block">USDC/USDT/BTC</span>
            </span>
            <span className="ml-auto bg-green-100 px-2 py-1 rounded-full">
              <span className="text-green-700 text-xs font-medium">#</span>
            </span>
          </div>
                    <div className="flex items-center mt-4">
            <span className="bg-gray-100 p-3 rounded-lg">
              <span className="font-medium">Stripe</span>
            </span>
            <span className="ml-3">
              <span className="font-medium">Cards</span>
              <span className="text-gray-500 text-sm block">coming soon</span>
            </span>
            <span className="ml-auto bg-green-100 px-2 py-1 rounded-full">
              <span className="text-green-700 text-xs font-medium">#</span>
            </span>
          </div>
        </div>
        {/* Billing History (live data only) */}
        {/* Confirm & Checkout Button */}
        <button
          className="mt-8 mb-8 bg-blue-600 rounded-2xl p-5 w-full flex items-center justify-center"
          type="button"
          onClick={() => {
            // Store selected plan in localStorage for checkout page
            const plan = plans.find(p => p.id === selectedPlan);
            if (plan) {
              localStorage.setItem('selectedBillingPlan', JSON.stringify(plan));
            }
            window.location.assign('/checkout');
          }}
        >
          <span className="text-white text-lg font-bold">Confirm & Checkout</span>
        </button>
      </div>
    </div>
  );
}
