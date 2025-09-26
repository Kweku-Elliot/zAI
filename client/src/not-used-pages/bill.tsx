import React, { useState } from 'react';
import { Phone, Wifi, ShoppingCart, Package, Gift, CreditCard, ArrowRight, ChevronLeft } from 'lucide-react';

export default function BillsPage() {
  const [selectedService, setSelectedService] = useState('data');
  const [amount, setAmount] = useState('');

  const services = [
    { id: 'data', title: 'Data Bundle', icon: <Wifi color="#4A90E2" size={24} />, description: 'Buy mobile data for yourself or others' },
    { id: 'airtime', title: 'Airtime', icon: <Phone color="#4A90E2" size={24} />, description: 'Top up airtime for any network' },
    { id: 'food', title: 'Food Voucher', icon: <ShoppingCart color="#4A90E2" size={24} />, description: 'Get discount on food orders' },
    { id: 'addons', title: 'Add-ons', icon: <Package color="#4A90E2" size={24} />, description: 'Extra services and features' },
    { id: 'gifts', title: 'Gift Credits', icon: <Gift color="#4A90E2" size={24} />, description: 'Send credits as gifts to friends' },
  ];

  const dataBundles = [
    { id: 1, size: '500MB', price: '$2.50', validity: '1 day' },
    { id: 2, size: '1GB', price: '$4.50', validity: '3 days' },
    { id: 3, size: '2GB', price: '$8.00', validity: '7 days' },
    { id: 4, size: '5GB', price: '$18.00', validity: '15 days' },
    { id: 5, size: '10GB', price: '$32.00', validity: '30 days' },
    { id: 6, size: '20GB', price: '$55.00', validity: '30 days' },
  ];

  const airtimeOptions = [
    { id: 1, amount: '$5.00' },
    { id: 2, amount: '$10.00' },
    { id: 3, amount: '$20.00' },
    { id: 4, amount: '$50.00' },
    { id: 5, amount: '$100.00' },
  ];

  const foodVouchers = [
    { id: 1, name: 'McDonalds', discount: '20% off', minSpend: '$15' },
    { id: 2, name: 'Starbucks', discount: '$5 off', minSpend: '$20' },
    { id: 3, name: 'Uber Eats', discount: '$10 off', minSpend: '$30' },
    { id: 4, name: 'Pizza Hut', discount: '15% off', minSpend: '$25' },
  ];

  function renderServiceOptions() {
    switch (selectedService) {
      case 'data':
        return (
          <div className="mt-4">
            <span className="text-gray-900 font-bold mb-3 block">Select Data Bundle</span>
            <div className="flex flex-wrap gap-3">
              {dataBundles.map(bundle => (
                <button
                  key={bundle.id}
                  className="bg-white rounded-xl p-4 flex-1 min-w-[45%] border border-gray-200 text-left"
                  type="button"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-gray-900 font-bold">{bundle.size}</span>
                    <span className="text-blue-600 font-bold">{bundle.price}</span>
                  </div>
                  <span className="text-gray-500 text-sm mt-2 block">{bundle.validity}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'airtime':
        return (
          <div className="mt-4">
            <span className="text-gray-900 font-bold mb-3 block">Select Amount</span>
            <div className="flex flex-wrap gap-3">
              {airtimeOptions.map(option => (
                <button
                  key={option.id}
                  className="bg-white rounded-xl p-4 flex-1 min-w-[30%] items-center border border-gray-200"
                  type="button"
                >
                  <span className="text-blue-600 font-bold">{option.amount}</span>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <span className="text-gray-900 font-bold mb-2 block">Or Enter Custom Amount</span>
              <input
                className="bg-gray-100 rounded-xl p-4 w-full"
                placeholder="Enter amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                type="number"
              />
            </div>
          </div>
        );
      case 'food':
        return (
          <div className="mt-4">
            <span className="text-gray-900 font-bold mb-3 block">Select Voucher</span>
            {foodVouchers.map(voucher => (
              <button
                key={voucher.id}
                className="bg-white rounded-xl p-4 mb-3 flex justify-between items-center border border-gray-200 w-full text-left"
                type="button"
              >
                <span>
                  <span className="text-gray-900 font-bold block">{voucher.name}</span>
                  <span className="text-gray-600 text-sm block">Min spend: {voucher.minSpend}</span>
                </span>
                <span className="text-blue-600 font-bold">{voucher.discount}</span>
              </button>
            ))}
          </div>
        );
      default:
        return (
          <div className="mt-4 bg-white rounded-xl p-6 flex items-center justify-center">
            <span className="text-gray-500 text-center">Select a service to get started</span>
          </div>
        );
    }
  }

  return (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col pt-[calc(3rem+env(safe-area-inset-top))] dark:text-white">
      {/* Top bar (sticky) */}
      <div className="sticky top-0 bg-white z-20 border-b">
        <div className="px-6 py-4 relative max-w-5xl mx-auto">
          <button onClick={() => window.history.back()} aria-label="Go back" className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-gray-100">
            <ChevronLeft size={20} color="#374151" />
          </button>
          <div className="text-center">
            <h1 className="text-gray-900 text-2xl font-bold">Bills & Services</h1>
          </div>
        </div>
      </div>
      <div className="px-4 pt-6">
        <p className="text-gray-600 text-center mb-4">Purchase bundles, airtime, food vouchers and more</p>
      </div>
      <div className="flex-1 px-4 pt-4 overflow-y-auto">
        {/* Service Selection */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <span className="text-gray-900 text-lg font-bold mb-4 block">Select Service</span>
          <div className="flex flex-wrap gap-3">
            {services.map(service => (
              <button
                key={service.id}
                className={`flex-1 min-w-[45%] rounded-xl p-4 flex flex-col items-center ${selectedService === service.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}
                type="button"
                onClick={() => setSelectedService(service.id)}
              >
                {service.icon}
                <span className="text-gray-900 font-semibold mt-2 block">{service.title}</span>
                <span className="text-gray-500 text-xs text-center mt-1 block">{service.description}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Service Options */}
        <div className="mt-6 bg-white rounded-2xl p-4 shadow">
          {renderServiceOptions()}
        </div>
        {/* Payment Method */}
        <div className="mt-6 bg-white rounded-2xl p-4 shadow">
          <div className="flex items-center mb-4">
            <CreditCard color="gray" size={24} />
            <span className="text-gray-900 text-lg font-bold ml-2">Payment Method</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
            <span className="text-gray-900">Wallet Balance</span>
            <span className="text-gray-900 font-bold">$1,248.75</span>
          </div>
          <div className="mt-4 flex justify-between items-center p-4 bg-gray-50 rounded-xl">
            <span className="text-gray-900">AI Credits</span>
            <span className="text-gray-900 font-bold">1,250 credits</span>
          </div>
        </div>
        {/* Purchase Button */}
        <button className="mt-6 mb-8 bg-blue-600 rounded-2xl p-5 flex items-center justify-center w-full" type="button">
          <span className="text-white text-lg font-bold mr-2">Purchase Now</span>
          <ArrowRight color="white" size={24} />
        </button>
      </div>
    </div>
  );
}
