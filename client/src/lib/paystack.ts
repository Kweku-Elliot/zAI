
import axios from 'axios';

// Use the current origin for web environment
const SERVER = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:3000`;

export async function initializePayment(email: string, amountKobo: number) {
  const resp = await axios.post(`${SERVER}/api/paystack/initialize`, { email, amount: amountKobo });
  return resp.data;
}

export async function verifyPayment(reference: string) {
  const resp = await axios.post(`${SERVER}/api/paystack/verify`, { reference });
  return resp.data;
}

export async function processUpgrade(plan: string, email: string, amount: number) {
  try {
    const paymentData = await initializePayment(email, amount * 100); // Convert to kobo
    
    // In a real app, you would integrate with Paystack's payment modal
    // For now, we'll simulate the payment flow
    const paymentUrl = paymentData.authorization_url;
    
    // Open payment window
    window.open(paymentUrl, '_blank');
    
    return { success: true, paymentUrl, reference: paymentData.reference };
  } catch (error) {
    console.error('Payment initialization failed:', error);
    return { success: false, error: 'Payment initialization failed' };
  }
}

export default { initializePayment, verifyPayment, processUpgrade };
