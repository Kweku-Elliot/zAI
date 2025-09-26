import { storage } from "../storage";

interface BillPaymentRequest {
  userId: string;
  provider: string;
  product: string;
  phoneNumber: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}

interface BillPaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  reference?: string;
}

interface PaymentProvider {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
  supportedServices: string[];
}

class BillsService {
  private providers: Map<string, PaymentProvider> = new Map();

  constructor() {
    // Initialize payment providers
    this.setupProviders();
  }

  private setupProviders() {
    // MTN Mobile Money
    if (process.env.MTN_MOMO_API_KEY) {
      this.providers.set('mtn_momo', {
        id: 'mtn_momo',
        name: 'MTN Mobile Money',
        apiUrl: 'https://sandbox.momodeveloper.mtn.com',
        apiKey: process.env.MTN_MOMO_API_KEY,
        supportedServices: ['telecom', 'utility', 'food']
      });
    }

    // Vodafone Cash
    if (process.env.VODAFONE_CASH_API_KEY) {
      this.providers.set('vodafone_cash', {
        id: 'vodafone_cash',
        name: 'Vodafone Cash',
        apiUrl: 'https://api.vodafone.com.gh/cash',
        apiKey: process.env.VODAFONE_CASH_API_KEY,
        supportedServices: ['telecom', 'utility', 'transport']
      });
    }

    // AirtelTigo Money
    if (process.env.AIRTELTIGO_API_KEY) {
      this.providers.set('airteltigo_money', {
        id: 'airteltigo_money',
        name: 'AirtelTigo Money',
        apiUrl: 'https://api.airteltigo.com.gh/money',
        apiKey: process.env.AIRTELTIGO_API_KEY,
        supportedServices: ['telecom', 'utility']
      });
    }
  }

  async processBillPayment(request: BillPaymentRequest): Promise<BillPaymentResponse> {
    try {
      // Validate user
      const user = await storage.getUser(request.userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Check user balance (if using wallet)
      if (request.paymentMethod === 'wallet') {
        const balance = await this.getUserBalance(request.userId);
        if (balance < request.amount) {
          return {
            success: false,
            message: 'Insufficient wallet balance'
          };
        }
      }

      // Get payment provider
      const provider = this.providers.get(request.paymentMethod);
      if (!provider) {
        return {
          success: false,
          message: 'Payment provider not supported'
        };
      }

      // Process payment based on service type
      const paymentResult = await this.processPaymentWithProvider(provider, request);
      
      if (paymentResult.success) {
        // Record transaction
        await this.recordTransaction(request, paymentResult.transactionId!);
        
        // Update user balance if using wallet
        if (request.paymentMethod === 'wallet') {
          await this.deductFromWallet(request.userId, request.amount);
        }

        // Send confirmation (SMS/Email)
        await this.sendPaymentConfirmation(request, paymentResult.transactionId!);
      }

      return paymentResult;
    } catch (error: any) {
      console.error('Bill payment error:', error);
      return {
        success: false,
        message: 'Payment processing failed: ' + error.message
      };
    }
  }

  private async processPaymentWithProvider(
    provider: PaymentProvider, 
    request: BillPaymentRequest
  ): Promise<BillPaymentResponse> {
    
    const transactionId = this.generateTransactionId();
    
    try {
      // Simulate different provider API calls
      switch (provider.id) {
        case 'mtn_momo':
          return await this.processMTNMoMoPayment(request, transactionId);
        case 'vodafone_cash':
          return await this.processVodafoneCashPayment(request, transactionId);
        case 'airteltigo_money':
          return await this.processAirtelTigoPayment(request, transactionId);
        default:
          return {
            success: false,
            message: 'Provider not implemented'
          };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Provider error: ${error.message}`
      };
    }
  }

  private async processMTNMoMoPayment(
    request: BillPaymentRequest, 
    transactionId: string
  ): Promise<BillPaymentResponse> {
    
    // Simulate MTN MoMo API call
    const requestBody = {
      amount: request.amount,
      currency: request.currency,
      externalId: transactionId,
      payer: {
        partyIdType: "MSISDN",
        partyId: request.phoneNumber
      },
      payerMessage: `Payment for ${request.product}`,
      payeeNote: `Bill payment - ${request.provider}`
    };

    // In production, make actual API call to MTN
    // const response = await fetch(`${provider.apiUrl}/collection/v1_0/requesttopay`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${accessToken}`,
    //     'X-Reference-Id': transactionId,
    //     'X-Target-Environment': 'sandbox',
    //     'Content-Type': 'application/json',
    //     'Ocp-Apim-Subscription-Key': provider.apiKey
    //   },
    //   body: JSON.stringify(requestBody)
    // });

    // Simulate successful response
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      success: true,
      transactionId,
      message: 'Payment successful via MTN Mobile Money',
      reference: `MTN${transactionId.slice(-8)}`
    };
  }

  private async processVodafoneCashPayment(
    request: BillPaymentRequest, 
    transactionId: string
  ): Promise<BillPaymentResponse> {
    
    // Simulate Vodafone Cash API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      transactionId,
      message: 'Payment successful via Vodafone Cash',
      reference: `VF${transactionId.slice(-8)}`
    };
  }

  private async processAirtelTigoPayment(
    request: BillPaymentRequest, 
    transactionId: string
  ): Promise<BillPaymentResponse> {
    
    // Simulate AirtelTigo API call
    await new Promise(resolve => setTimeout(resolve, 1800));

    return {
      success: true,
      transactionId,
      message: 'Payment successful via AirtelTigo Money',
      reference: `AT${transactionId.slice(-8)}`
    };
  }

  private async getUserBalance(userId: string): Promise<number> {
    // Get user wallet balance from storage
    const user = await storage.getUser(userId);
    return user?.walletBalance || 0;
  }

  private async deductFromWallet(userId: string, amount: number): Promise<void> {
    // Deduct amount from user wallet
    const user = await storage.getUser(userId);
    if (user) {
      const newBalance = (user.walletBalance || 0) - amount;
      await storage.updateUser(userId, { walletBalance: newBalance });
    }
  }

  private async recordTransaction(
    request: BillPaymentRequest, 
    transactionId: string
  ): Promise<void> {
    
    const transaction = {
      id: transactionId,
      userId: request.userId,
      type: 'bill_payment',
      amount: request.amount,
      currency: request.currency,
      provider: request.provider,
      product: request.product,
      phoneNumber: request.phoneNumber,
      paymentMethod: request.paymentMethod,
      status: 'completed',
      timestamp: new Date().toISOString()
    };

    // Save transaction record
    await storage.saveTransaction(transaction);
  }

  private async sendPaymentConfirmation(
    request: BillPaymentRequest, 
    transactionId: string
  ): Promise<void> {
    
    // Send SMS confirmation
    const message = `Your ${request.product} payment of ${request.currency} ${request.amount} has been successful. Reference: ${transactionId.slice(-8)}`;
    
    // In production, integrate with SMS service
    console.log(`SMS to ${request.phoneNumber}: ${message}`);
  }

  private generateTransactionId(): string {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getBillsHistory(userId: string, limit: number = 50): Promise<any[]> {
    try {
      // Get user's bill payment history
      const transactions = await storage.getUserTransactions(userId, 'bill_payment', limit);
      return transactions || [];
    } catch (error: any) {
      console.error('Error fetching bills history:', error);
      return [];
    }
  }

  async getAvailableProviders(): Promise<any[]> {
    return Array.from(this.providers.values()).map(provider => ({
      id: provider.id,
      name: provider.name,
      supportedServices: provider.supportedServices
    }));
  }

  async validatePhoneNumber(phoneNumber: string, provider: string): Promise<boolean> {
    // Basic phone number validation for Ghana
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Ghana numbers should be 10 digits (without country code) or 13 with +233
    if (cleanNumber.length === 10) {
      // Check if starts with valid prefixes for each provider
      const prefixes: Record<string, string[]> = {
        'mtn_momo': ['024', '025', '053', '054', '055', '059'],
        'vodafone_cash': ['020', '050'],
        'airteltigo_money': ['026', '027', '028', '056', '057']
      };

      const providerPrefixes = prefixes[provider];
      if (providerPrefixes) {
        return providerPrefixes.some(prefix => cleanNumber.startsWith(prefix));
      }
    }

    return false;
  }
}

export const billsService = new BillsService();