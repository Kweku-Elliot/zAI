import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

interface PlanLimits {
  aiCredits: number;
  voiceMinutes: number;
  fileUploads: number;
  imageGeneration: number;
  apiCalls: number;
}

interface CreditsUsage {
  aiCredits: number;
  voiceMinutes: number;
  fileUploads: number;
  imageGeneration: number;
  apiCalls: number;
}

interface CreditsContextType {
  currentCredits: CreditsUsage;
  planLimits: PlanLimits;
  plan: string;
  refreshCredits: () => Promise<void>;
  trackUsage: (feature: string, amount: number) => Promise<void>;
  getRemainingCredits: (feature: keyof CreditsUsage) => number;
  getUsagePercentage: (feature: keyof CreditsUsage) => number;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    aiCredits: 50,
    voiceMinutes: 0,
    fileUploads: 2,
    imageGeneration: 0,
    apiCalls: 0,
  },
  plus: {
    aiCredits: 1000,
    voiceMinutes: 60,
    fileUploads: 10,
    imageGeneration: 20,
    apiCalls: 100,
  },
  pro: {
    aiCredits: 5000,
    voiceMinutes: 180,
    fileUploads: 50,
    imageGeneration: 100,
    apiCalls: 500,
  },
  proplus: {
    aiCredits: -1, // unlimited
    voiceMinutes: -1, // unlimited
    fileUploads: -1, // unlimited
    imageGeneration: -1, // unlimited
    apiCalls: -1, // unlimited
  },
};

export const CreditsContext = createContext<CreditsContextType | null>(null);

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useContext(AuthContext);
  const [currentCredits, setCurrentCredits] = useState<CreditsUsage>({
    aiCredits: 0,
    voiceMinutes: 0,
    fileUploads: 0,
    imageGeneration: 0,
    apiCalls: 0,
  });

  const plan = profile?.plan || 'free';
  const planLimits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  const refreshCredits = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/usage-analytics/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        // Process the usage analytics data
        const usage: CreditsUsage = {
          aiCredits: 0,
          voiceMinutes: 0,
          fileUploads: 0,
          imageGeneration: 0,
          apiCalls: 0,
        };

        // Calculate current month's usage
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        data.analytics?.forEach((entry: any) => {
          const entryDate = new Date(entry.createdAt);
          if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
            switch (entry.feature) {
              case 'chat':
                usage.aiCredits += entry.amount;
                break;
              case 'voice_transcription':
                usage.voiceMinutes += entry.amount;
                break;
              case 'file_analysis':
                usage.fileUploads += entry.amount;
                break;
              case 'image_gen':
                usage.imageGeneration += entry.amount;
                break;
              case 'api_call':
                usage.apiCalls += entry.amount;
                break;
            }
          }
        });

        setCurrentCredits(usage);
      }
    } catch (error) {
      console.error('Failed to refresh credits:', error);
    }
  };

  const trackUsage = async (feature: string, amount: number) => {
    if (!user?.id) return;

    try {
      await fetch('/api/usage-analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          feature,
          usageType: getUsageType(feature),
          amount,
          cost: calculateCost(feature, amount),
          metadata: {
            plan,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      // Refresh credits after tracking usage
      await refreshCredits();
    } catch (error) {
      console.error('Failed to track usage:', error);
    }
  };

  const getUsageType = (feature: string): string => {
    switch (feature) {
      case 'chat': return 'tokens';
      case 'voice_transcription': return 'minutes';
      case 'file_analysis': return 'files';
      case 'image_gen': return 'requests';
      case 'api_call': return 'requests';
      default: return 'requests';
    }
  };

  const calculateCost = (feature: string, amount: number): number => {
    const rates: Record<string, number> = {
      chat: 0.001, // per token
      voice_transcription: 0.1, // per minute
      file_analysis: 0.05, // per file
      image_gen: 0.2, // per request
      api_call: 0.01, // per request
    };
    return (rates[feature] || 0) * amount;
  };

  const getRemainingCredits = (feature: keyof CreditsUsage): number => {
    const limit = planLimits[feature];
    if (limit === -1) return -1; // unlimited
    return Math.max(0, limit - currentCredits[feature]);
  };

  const getUsagePercentage = (feature: keyof CreditsUsage): number => {
    const limit = planLimits[feature];
    if (limit === -1) return 0; // unlimited
    if (limit === 0) return 100; // not available
    return Math.min(100, (currentCredits[feature] / limit) * 100);
  };

  useEffect(() => {
    if (user?.id) {
      refreshCredits();
    }
  }, [user?.id]);

  return (
    <CreditsContext.Provider value={{
      currentCredits,
      planLimits,
      plan,
      refreshCredits,
      trackUsage,
      getRemainingCredits,
      getUsagePercentage,
    }}>
      {children}
    </CreditsContext.Provider>
  );
}

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
};