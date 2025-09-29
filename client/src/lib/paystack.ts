
import axios from 'axios';
import Constants from 'expo-constants';

const SERVER = Constants.expoConfig?.extra?.REACT_NATIVE_SERVER_URL || 'http://10.0.2.2:8787';

export async function initializePayment(email: string, amountKobo: number) {
  const resp = await axios.post(`${SERVER}/api/paystack/initialize`, { email, amount: amountKobo });
  return resp.data;
}

export default { initializePayment };
