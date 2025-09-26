import React, { useState } from 'react';
import { Check, X, ChevronLeft, Crown } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free Plan',
    price: (cycle: string) => (cycle === 'monthly' ? '₵0' : '₵0'),
    period: (cycle: string) => (cycle === 'monthly' ? '/month' : '/year'),
    color: 'gray',
    gradient: ['#9CA3AF', '#6B7280'],
  },
  {
    id: 'plus',
    name: 'Plus Plan',
    price: (cycle: string) => (cycle === 'monthly' ? '₵20' : '₵204'),
    period: (cycle: string) => (cycle === 'monthly' ? '/month' : '/year'),
    color: 'blue',
    gradient: ['#3B82F6', '#60A5FA'],
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: (cycle: string) => (cycle === 'monthly' ? '₵50' : '₵510'),
    period: (cycle: string) => (cycle === 'monthly' ? '/month' : '/year'),
    color: 'purple',
    gradient: ['#8B5CF6', '#A78BFA'],
  },
  {
    id: 'business',
    name: 'Business Plan',
    price: (cycle: string) => (cycle === 'monthly' ? '₵100' : '₵1020'),
    period: (cycle: string) => (cycle === 'monthly' ? '/month' : '/year'),
    color: 'gold',
    gradient: ['#F59E0B', '#FBBF24'],
  },
];

type FeatureCategory = {
  category: string;
  features: Array<{
    name: string;
    limits: Array<string | boolean>;
  }>;
};

const featureCategories: FeatureCategory[] = [
  // ...existing featureCategories from your code...
];

export default function PlanComparisonPage() {
  const [selectedPlan, setSelectedPlan] = useState('plus');
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div className="min-h-screen bg-background flex flex-col mobile-safe-container text-foreground">
      {/* Header */}
      <div className="bg-card pt-12 pb-4 px-4">
        <div className="flex items-center mb-4">
          <button className="mr-4" type="button">
            <ChevronLeft size={24} color="#1F2937" />
          </button>
          <span className="text-xl font-bold text-card-foreground">Plan Comparison</span>
        </div>
        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-4">
          <div className="flex bg-muted rounded-full p-1">
            <button
              className={`px-4 py-2 rounded-full ${billingCycle === 'monthly' ? 'bg-card shadow-sm' : ''}`}
              type="button"
              onClick={() => setBillingCycle('monthly')}
            >
              <span className={`font-medium ${billingCycle === 'monthly' ? 'text-card-foreground' : 'text-muted-foreground'}`}>Monthly</span>
            </button>
            <button
              className={`px-4 py-2 rounded-full ${billingCycle === 'yearly' ? 'bg-white shadow-sm' : ''}`}
              type="button"
              onClick={() => setBillingCycle('yearly')}
            >
              <span className={`font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>Yearly</span>
            </button>
          </div>
        </div>
        {/* Save Banner */}
        {billingCycle === 'yearly' && (
          <div className="bg-green-50 rounded-lg p-3 flex items-center justify-center">
            <span className="text-green-700 font-medium">Save 15% with annual billing</span>
          </div>
        )}
      </div>
      {/* Plan Headers */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex px-4 py-4">
          <div className="w-40" />
          {plans.map((plan) => (
            <div key={plan.id} className="w-60 mx-2">
              <div
                className="rounded-2xl p-4"
                style={{ background: `linear-gradient(90deg, ${plan.gradient[0]}, ${plan.gradient[1]})` }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-white text-lg font-bold">{plan.name}</span>
                  <div className="flex items-baseline mt-1">
                    <span className="text-white text-2xl font-bold">{plan.price(billingCycle)}</span>
                    <span className="text-white text-sm ml-1">{plan.period(billingCycle)}</span>
                  </div>
                  {selectedPlan === plan.id ? (
                    <div className="mt-3 bg-white/20 rounded-full px-3 py-1 flex items-center">
                      <Crown size={14} color="white" />
                      <span className="text-white text-sm font-medium ml-1">Current Plan</span>
                    </div>
                  ) : (
                    <button
                      className="mt-3 bg-white rounded-full px-4 py-2"
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <span className={`text-${plan.color}-600 font-medium`}>
                        {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Features Comparison */}
      <div className="flex-1 px-4 overflow-y-auto">
        {featureCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <span className="text-lg font-bold text-gray-900 mb-3 block">{category.category}</span>
            {category.features.map((feature, featureIndex) => (
              <div
                key={featureIndex}
                className={`flex items-center py-3 ${featureIndex !== category.features.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="w-40">
                  <span className="text-gray-700 font-medium">{feature.name}</span>
                </div>
                {feature.limits.map((limit, planIndex) => (
                  <div key={planIndex} className="w-60 mx-2 flex items-center justify-center">
                    {typeof limit === 'boolean' ? (
                      limit ? (
                        <span className="bg-green-100 rounded-full p-2">
                          <Check size={16} color="#059669" />
                        </span>
                      ) : (
                        <span className="bg-gray-100 rounded-full p-2">
                          <X size={16} color="#6B7280" />
                        </span>
                      )
                    ) : (
                      <span className="text-gray-700 text-center">{limit}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
        {/* CTA Section */}
        <div className="py-8">
          <span className="block text-center text-gray-500 mb-4">Questions about our plans?</span>
          <button className="bg-white rounded-full py-3 px-6 border border-gray-300 mx-auto block" type="button">
            <span className="text-blue-600 font-medium">Contact Sales</span>
          </button>
        </div>
      </div>
      {/* Safe area bottom padding */}
      <div className="pb-[env(safe-area-inset-bottom)]"></div>
    </div>
  );
}
