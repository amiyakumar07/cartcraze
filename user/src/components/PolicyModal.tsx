import React from 'react';
import { X, FileText, Lock, RefreshCw, Zap } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyType: 'terms' | 'privacy' | 'shipping' | 'cancellation' | null;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, policyType }) => {
  if (!isOpen || !policyType) return null;

  const contentMap = {
    terms: {
      title: 'Terms of Service',
      icon: FileText,
      body: [
        'Welcome to CartCraze 9-Minute Express Grocery platform.',
        '1. Service Guarantee: Orders are dispatched within 60 seconds from darkstores and delivered within 9 minutes in designated coverage zones.',
        '2. Product Quality: All fruits, vegetables, and dairy items undergo strict quality checks. If damaged, 100% refund is issued instantly.',
        '3. Pricing: All prices listed are inclusive of GST and local taxes.',
        '4. User Account: Users are responsible for maintaining confidentiality of OTP credentials.'
      ]
    },
    privacy: {
      title: 'Privacy & Security Policy',
      icon: Lock,
      body: [
        'Your privacy and data security are our top priorities.',
        '1. Encrypted GPS: LocationIQ GPS coordinates are used exclusively for darkstore range validation and real-time rider tracking.',
        '2. SSL Encryption: Payment information is processed via PCI-DSS compliant payment gateways.',
        '3. Zero Spam: We will never sell or share your phone number or email address with third-party advertisers.'
      ]
    },
    shipping: {
      title: '9-Minute Shipping & Delivery SLA',
      icon: Zap,
      body: [
        'CartCraze operates hyper-local darkstores within a 5.0 km radius.',
        '1. Free Delivery: Available on all basket totals exceeding ₹199.',
        '2. Delivery Hours: 6:00 AM to 11:30 PM daily.',
        '3. Delay Guarantee: If your delivery exceeds 15 minutes, we credit ₹50 instantly to your CartCraze Wallet.'
      ]
    },
    cancellation: {
      title: 'Cancellation & Refund Policy',
      icon: RefreshCw,
      body: [
        'We offer a hassle-free, instant refund policy.',
        '1. Pre-dispatch Cancellation: 100% free cancellation anytime before the rider leaves the darkstore.',
        '2. Instant Wallet Refunds: Refunds are credited back to your CartCraze Wallet within 5 seconds of request.',
        '3. Replacement: Damaged or expired items are replaced free of cost on your next order.'
      ]
    }
  };

  const current = contentMap[policyType];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white max-w-sm w-full rounded-3xl p-5 shadow-2xl space-y-4 border border-gray-100 relative max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-900 text-yellow-300 rounded-xl">
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-gray-900">{current.title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-gray-700 leading-relaxed font-medium">
          {current.body.map((paragraph, index) => (
            <p key={index} className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              {paragraph}
            </p>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-900 hover:bg-black text-yellow-300 font-bold text-xs py-3 rounded-xl shadow-xs transition cursor-pointer"
        >
          I UNDERSTAND &amp; AGREE
        </button>
      </div>
    </div>
  );
};
