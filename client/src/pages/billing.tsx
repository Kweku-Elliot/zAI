import React, { useState, useContext } from 'react';
import { CreditCard, Calendar, Download, Crown, Check, X, ChevronRight, Lock, Info } from 'lucide-react';
import TopBar from '@/components/TopBar';
import { processUpgrade } from '../lib/paystack';
import { AuthContext } from '../contexts/AuthContext';
import { useCredits } from '../contexts/CreditsContext';

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const { user, profile } = useContext(AuthContext);
  const { currentCredits, planLimits, plan, getUsagePercentage } = useCredits();

  const selectedPlan = plan as 'free' | 'plus' | 'pro' | 'proplus';

  const usageData = {
    messages: { 
      used: currentCredits.aiCredits, 
      limit: planLimits.aiCredits === -1 ? Infinity : planLimits.aiCredits 
    },
    files: { 
      used: currentCredits.fileUploads, 
      limit: planLimits.fileUploads === -1 ? Infinity : planLimits.fileUploads 
    },
    voice: { 
      used: currentCredits.voiceMinutes, 
      limit: planLimits.voiceMinutes === -1 ? Infinity : planLimits.voiceMinutes 
    },
    api: { 
      used: currentCredits.apiCalls, 
      limit: planLimits.apiCalls === -1 ? Infinity : planLimits.apiCalls 
    },
    resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split('T')[0],
  };

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: billingCycle === 'monthly' ? '₵0' : '₵0',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      features: [
        '50 AI credits/month',
        '2 file uploads/month',
        'Basic AI access',
        'Community support',
      ],
      limitations: [
        'Resets monthly',
        '2 uploads max',
        'No voice',
        'No API',
        'Support only via forum',
      ],
      color: 'gray',
      gradient: ['#9CA3AF', '#6B7280'],
      current: selectedPlan === 'free',
    },
    {
      id: 'plus',
      name: 'Plus Plan',
      price: billingCycle === 'monthly' ? '₵20' : '₵216',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      features: [
        '1,000 AI credits/month',
        '10 file uploads/month',
        'Voice chat (60 min/month)',
        'Advanced AI models',
        'Email support',
      ],
      limitations: [
        'Voice minutes tracked',
        'File upload counter',
        'Advanced models unlocked',
        'Priority queue',
      ],
      color: 'blue',
      gradient: ['#3B82F6', '#60A5FA'],
      current: selectedPlan === 'plus',
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: billingCycle === 'monthly' ? '₵40' : '₵432',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      features: [
        '5,000 AI credits/month',
        '50 file uploads/month',
        'Voice chat (180 min/month)',
        'Premium AI models',
        'Priority support',
        'API access (500 calls/month)',
      ],
      limitations: [
        'Voice minutes tracked',
        'File upload counter',
        'Premium models unlocked',
        'Priority queue',
      ],
      color: 'purple',
      gradient: ['#8B5CF6', '#A78BFA'],
      current: selectedPlan === 'pro',
    },
    {
      id: 'proplus',
      name: 'Pro+ Plan',
      price: billingCycle === 'monthly' ? '₵120' : '₵1296',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      features: [
        'Unlimited everything',
        'Unlimited file uploads',
        'Unlimited voice chat',
        'Ultimate AI',
        'Dedicated support',
        'API access',
        'Early access to new features',
      ],
      limitations: [],
      color: 'red',
      gradient: ['#EF4444', '#F87171'],
      current: selectedPlan === 'proplus',
    },
  ];

  const billingHistory = [
    { id: 1, plan: 'Pro Plan', amount: '₵50.00', cycle: 'Monthly', method: 'Credit Card', status: 'Paid', date: '2023-09-15', invoice: '#' },
    { id: 2, plan: 'Pro Plan', amount: '₵50.00', cycle: 'Monthly', method: 'Credit Card', status: 'Paid', date: '2023-08-15', invoice: '#' },
    { id: 3, plan: 'Plus Plan', amount: '₵20.00', cycle: 'Monthly', method: 'PayPal', status: 'Paid', date: '2023-07-15', invoice: '#' },
  ];

  function ProgressBar({ progress }: { progress: number }) {
    return (
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${progress > 0.8 ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    );
  }

  function renderUsageCard(title: string, used: number, limit: number, unit: string) {
    const progress = limit === Infinity ? 0 : used / limit;
    const isCritical = progress > 0.8;
    const displayLimit = limit === Infinity ? '∞' : limit.toString();
    
    return (
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm" data-testid={`usage-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="flex justify-between mb-2">
          <span className="text-gray-700 font-medium">{title}</span>
          <span className={`font-medium ${isCritical ? 'text-red-500' : 'text-gray-600'}`}>
            {used}/{displayLimit} {unit}
          </span>
        </div>
        {limit !== Infinity && <ProgressBar progress={progress} />}
        {isCritical && (
          <button 
            className="mt-2 text-blue-500 text-sm font-medium" 
            type="button"
            data-testid="button-upgrade-now"
          >
            Upgrade now
          </button>
        )}
      </div>
    );
  }

  const handleUpgrade = async (plan: typeof plans[0]) => {
    if (!user || !user.email || plan.id === 'free') return;
    
    setLoading(true);
    try {
      const amount = parseInt(plan.price.replace('₵', ''));
      const result = await processUpgrade(plan.id, user.email, amount);
      
      if (result.success) {
        console.log('Payment initiated successfully');
        // You could show a success message or redirect
      } else {
        console.error('Payment failed:', result.error);
        alert('Payment initialization failed. Please try again.');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  function renderPlanCard(plan: typeof plans[0]) {
    const textClass = plan.color === 'gray' ? 'text-card-foreground' : 'text-white';

    return (
      <div key={plan.id} className={`rounded-2xl overflow-hidden mb-6 w-full ${plan.current ? 'border-2 border-primary' : ''}`}>
        <div
          className="p-6"
          style={{
            backgroundImage: `linear-gradient(135deg, ${plan.gradient[0]}, ${plan.gradient[1]})`,
            backgroundColor: plan.gradient[0], // fallback if gradient not rendered
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
              <div key={index} className="flex items-center mt-2">
                <Check size={16} color="white" />
                <span className={`${textClass} ml-2`}>{feature}</span>
              </div>
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
        {!plan.current && plan.id !== 'free' && (
          <div className="px-6 pb-6">
            <button
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              onClick={() => handleUpgrade(plan)}
              disabled={loading}
              type="button"
              data-testid={`button-upgrade-${plan.id}`}
            >
              {loading ? 'Processing...' : `Upgrade to ${plan.name}`}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-background flex flex-col pt-[calc(3rem+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] text-foreground mobile-safe-container">
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
                data-testid="toggle-billing-cycle"
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
        {/* Usage Stats */}
        <span className="text-lg font-bold text-gray-900 mb-4 block">Current Usage</span>
        {renderUsageCard('AI Credits', usageData.messages.used, usageData.messages.limit, 'credits')}
        {renderUsageCard('File Uploads', usageData.files.used, usageData.files.limit, 'files')}
        {renderUsageCard('Voice Minutes', usageData.voice.used, usageData.voice.limit, 'min')}
        {renderUsageCard('API Calls', usageData.api.used, usageData.api.limit, 'calls')}
        
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="flex items-center">
            <Info size={16} className="text-blue-600 mr-2" />
            <span className="text-blue-800 text-sm">
              Usage resets on {new Date(usageData.resetDate).toLocaleDateString()}
            </span>
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
            <ChevronRight size={20} color="#6B7280" />
          </div>
          <div className="flex items-center mt-4">
            <span className="bg-gray-100 p-3 rounded-lg">
              <span className="font-medium">•••• 4242</span>
            </span>
            <span className="ml-3">
              <span className="font-medium">Visa</span>
              <span className="text-gray-500 text-sm block">Expires 12/25</span>
            </span>
            <span className="ml-auto bg-green-100 px-2 py-1 rounded-full">
              <span className="text-green-700 text-xs font-medium">Primary</span>
            </span>
          </div>
        </div>
        {/* Billing History */}
        <span className="text-lg font-bold text-gray-900 mb-4 block">Billing History</span>
        {billingHistory.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 mb-4">
            <div className="flex justify-between">
              <span>
                <span className="font-medium text-gray-900 block">{item.plan}</span>
                <span className="text-gray-500 text-sm block">{item.date}</span>
              </span>
              <span className="items-end">
                <span className="font-medium text-gray-900 block">{item.amount}</span>
                <span className="flex items-center mt-1">
                  <span className="text-gray-500 text-sm mr-1">{item.method}</span>
                  <Lock size={12} color="#6B7280" />
                </span>
              </span>
            </div>
            <div className="flex justify-between mt-3">
              <span className="flex items-center">
                <span className="bg-green-100 p-1 rounded-full">
                  <Check size={12} color="#059669" />
                </span>
                <span className="text-green-700 text-sm ml-1">{item.status}</span>
              </span>
              <button className="flex items-center" type="button">
                <Download size={16} color="#3B82F6" />
                <span className="text-blue-500 text-sm ml-1">Invoice</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
