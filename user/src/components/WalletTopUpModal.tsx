import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Wallet, Gift, Plus, CheckCircle2 } from 'lucide-react';

interface WalletTopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletTopUpModal: React.FC<WalletTopUpModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, setUserProfile } = useApp();

  const [topUpAmount, setTopUpAmount] = useState<number>(250);
  const [activeTab, setActiveTab] = useState<'topup' | 'coins'>('topup');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + topUpAmount,
      freshCoins: prev.freshCoins + Math.floor(topUpAmount * 0.1)
    }));
    setSuccessMsg(`Successfully added ₹${topUpAmount} to CartCraze Wallet!`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleRedeemCoins = (coinsToRedeem: number, rupeeDiscount: number) => {
    if (userProfile.freshCoins < coinsToRedeem) {
      alert(`You need at least ${coinsToRedeem} CartCoins to redeem this voucher.`);
      return;
    }
    setUserProfile((prev) => ({
      ...prev,
      freshCoins: prev.freshCoins - coinsToRedeem,
      walletBalance: prev.walletBalance + rupeeDiscount
    }));
    setSuccessMsg(`Redeemed ${coinsToRedeem} CartCoins for ₹${rupeeDiscount} Wallet Cash!`);
    setTimeout(() => {
      setSuccessMsg('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white max-w-sm w-full rounded-3xl p-5 shadow-2xl space-y-4 border border-gray-100 relative">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-900 rounded-xl">
              <Wallet className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900">Wallet &amp; CartCoins</h3>
              <p className="text-[10px] text-gray-400 font-medium">Balance &amp; Rewards Center</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('topup')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'topup' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Add Money (₹{userProfile.walletBalance})
          </button>
          <button
            onClick={() => setActiveTab('coins')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'coins' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            CartCoins ({userProfile.freshCoins} pts)
          </button>
        </div>

        {successMsg ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-center space-y-2 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p>{successMsg}</p>
          </div>
        ) : activeTab === 'topup' ? (
          <form onSubmit={handleTopUpSubmit} className="space-y-4">
            <div className="bg-gradient-to-r from-gray-900 to-slate-800 text-white rounded-2xl p-4 flex justify-between items-center shadow-md">
              <div>
                <span className="text-[10px] text-gray-300 font-medium block">CURRENT BALANCE</span>
                <span className="text-2xl font-black text-white">₹{userProfile.walletBalance}</span>
              </div>
              <span className="bg-emerald-400 text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                Instant Cashback 10%
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-800 block">Select Top-Up Amount</span>
              <div className="grid grid-cols-4 gap-2">
                {[100, 250, 500, 1000].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      topUpAmount === amt
                        ? 'bg-amber-400 border-amber-500 text-black shadow-2xs'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700">Custom Amount (₹)</label>
              <input
                type="number"
                min={10}
                max={10000}
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 outline-none focus:border-amber-400 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#fdee24] hover:bg-yellow-400 text-black font-black text-xs py-3.5 rounded-xl shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>ADD ₹{topUpAmount} VIA INSTANT UPI</span>
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 text-amber-950 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="text-xs font-black block">{userProfile.freshCoins} CartCoins Available</span>
                  <span className="text-[10px] text-amber-800">Earn 10 points on every ₹100 order</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-800 block">Redeem Vouchers</span>
              
              <div className="p-3 border border-gray-100 bg-gray-50 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-xs text-gray-900 block">₹50 Wallet Cash</span>
                  <span className="text-[10px] text-gray-500">Requires 50 CartCoins</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRedeemCoins(50, 50)}
                  className="bg-gray-900 hover:bg-black text-yellow-300 font-bold text-[11px] px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  Redeem
                </button>
              </div>

              <div className="p-3 border border-gray-100 bg-gray-50 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-xs text-gray-900 block">₹120 Wallet Cash</span>
                  <span className="text-[10px] text-gray-500">Requires 100 CartCoins</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRedeemCoins(100, 120)}
                  className="bg-gray-900 hover:bg-black text-yellow-300 font-bold text-[11px] px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  Redeem
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
