import React from 'react';
import { paymentOptions } from '../data/initialData';
import { ArrowLeft, ExternalLink, CreditCard, Smartphone, Banknote } from 'lucide-react';

interface CashGiftsProps {
  onBack: () => void;
}

const getPaymentIcon = (name: string) => {
  switch (name) {
    case 'PayPal':
      return <CreditCard className="w-8 h-8" />;
    case 'Venmo':
      return <Smartphone className="w-8 h-8" />;
    case 'Cash App':
      return <Banknote className="w-8 h-8" />;
    default:
      return <CreditCard className="w-8 h-8" />;
  }
};

export const CashGifts: React.FC<CashGiftsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Main
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Cash Gifts
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Description */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            If you'd prefer to give a monetary gift, we've made it easy! 
            Choose any of the payment options below that work best for you.
          </p>
        </div>

        {/* Payment Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {paymentOptions.map((option, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300"
            >
              <div className="text-center">
                {/* Payment Icon */}
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white">
                    {getPaymentIcon(option.name)}
                  </div>
                </div>
                
                {/* Payment Service Name */}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {option.name}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">
                  {option.description}
                </p>
                
                {/* Identifier */}
                <div className="bg-gray-100 rounded-lg p-3 mb-4">
                  <p className="font-mono text-sm text-gray-700">
                    {option.identifier}
                  </p>
                </div>
                
                {/* Action Button */}
                <a
                  href={option.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  Send Gift via {option.name}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Thank You Message */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Thank You! 💕
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Your generosity means the world to us as we prepare for our little one's arrival. 
            Every gift helps us create a loving and safe environment for our growing family.
          </p>
        </div>
      </div>
    </div>
  );
};
