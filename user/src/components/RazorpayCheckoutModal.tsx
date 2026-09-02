import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, QrCode, CreditCard, Wallet, Building, X, Loader2, Lock } from 'lucide-react';

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  amount: number;
  currency?: string;
  onClose: () => Unit;
  onPaymentSuccess: (method: string, paymentId: string) => void;
}

type Unit = void;

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  isOpen,
  amount,
  currency = '₹',
  onClose,
  onPaymentSuccess
}) => {
  if (!isOpen) return null;

  const [selectedMethod, setSelectedMethod] = useState<string>('Google Pay UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentStep, setPaymentStep] = useState<1 | 2 | 3>(1);

  const handleProcessPayment = () => {
    setPaymentStep(2);
    setTimeout(() => {
      setPaymentStep(3);
      setTimeout(() => {
        const paymentId = `pay_rzp_${Math.random().toString(36).substring(2, 10)}`;
        onPaymentSuccess(selectedMethod, paymentId);
      }, 1000);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn font-[Inter,sans-serif]">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl relative flex flex-col">
        {/* Branded Navy Header */}
        <div className="bg-[#0C2340] text-white p-4.5 rounded-t-3xl flex items-center justify-between shadow-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base text-[#528FF0] tracking-wider">CARTCRAZE PAY</span>
              <span className="bg-[#02A95C] text-white font-bold text-[9px] px-1.5 py-0.5 rounded uppercase">
                SECURE
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">CartCraze Express Delivery</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Amount to Pay</span>
            <span className="text-lg font-black text-white">
              {currency}{amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 space-y-4 flex-1">
          {paymentStep === 1 && (
            <>
              <h3 className="text-sm font-extrabold text-slate-900">Select Payment Method</h3>

              {/* UPI Options */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-[#006C49] block px-1">UPI (Instant & Zero Fee)</span>

                {[
                  { id: 'Google Pay UPI', name: 'Google Pay UPI', desc: 'Fast 1-tap UPI app payment' },
                  { id: 'PhonePe UPI', name: 'PhonePe UPI', desc: 'Pay via PhonePe app' },
                  { id: 'Custom UPI ID', name: 'Enter UPI ID / VPA', desc: 'Enter mobile@upi or VPA' }
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedMethod(opt.id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      selectedMethod === opt.id
                        ? 'bg-emerald-50 border-[#006C49] ring-1 ring-[#006C49]'
                        : 'bg-white border-slate-200 hover:bg-slate-100/60'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#006C49] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-xs text-slate-900">{opt.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{opt.desc}</p>
                    </div>
                    {selectedMethod === opt.id && <CheckCircle2 className="w-4 h-4 text-[#006C49]" />}
                  </div>
                ))}

                {selectedMethod === 'Custom UPI ID' && (
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter UPI ID (e.g. mobile@oksbi)"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#006C49]"
                  />
                )}
              </div>

              {/* Cards & Net Banking */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 block px-1">Cards & NetBanking</span>

                {[
                  { id: 'Credit / Debit Card', name: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay, Diners' },
                  { id: 'Net Banking', name: 'Net Banking', desc: 'HDFC, ICICI, SBI, Axis & all major banks' }
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedMethod(opt.id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      selectedMethod === opt.id
                        ? 'bg-emerald-50 border-[#006C49] ring-1 ring-[#006C49]'
                        : 'bg-white border-slate-200 hover:bg-slate-100/60'
                    }`}
                  >
                    {opt.id === 'Credit / Debit Card' ? (
                      <CreditCard className="w-5 h-5 text-slate-700 shrink-0" />
                    ) : (
                      <Building className="w-5 h-5 text-slate-700 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-xs text-slate-900">{opt.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{opt.desc}</p>
                    </div>
                    {selectedMethod === opt.id && <CheckCircle2 className="w-4 h-4 text-[#006C49]" />}
                  </div>
                ))}

                {selectedMethod === 'Credit / Debit Card' && (
                  <div className="space-y-2 pt-1 text-xs">
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number (16-digits)"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-semibold focus:outline-none focus:border-[#006C49]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-semibold focus:outline-none focus:border-[#006C49]"
                      />
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-semibold focus:outline-none focus:border-[#006C49]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleProcessPayment}
                data-testid="razorpay_confirm_pay_btn"
                className="w-full py-3.5 bg-[#0C2340] hover:bg-slate-900 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
              >
                <Lock className="w-4 h-4 text-[#528FF0]" />
                <span>Pay {currency}{amount.toFixed(2)} Securely</span>
              </button>
            </>
          )}

          {paymentStep === 2 && (
            <div className="py-12 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-[#528FF0] animate-spin mx-auto" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Connecting to Secure Payment Gateway...</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Authenticating with {selectedMethod}. Please do not press back or refresh.
                </p>
              </div>
            </div>
          )}

          {paymentStep === 3 && (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-[#006C49] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-black text-[#006C49]">Payment Verified & Received!</h3>
              <p className="text-xs text-slate-500 font-semibold">
                Transaction Reference ID: pay_${Math.random().toString(36).substring(2, 10)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
