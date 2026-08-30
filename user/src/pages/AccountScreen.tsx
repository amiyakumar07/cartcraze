import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, Gift, ShoppingBag, MapPin, CreditCard, ChevronRight, LogOut, RefreshCw, FileText, ShieldAlert, Lock, UserCheck, Edit3, Plus, Radio } from 'lucide-react';
import { EditProfileModal } from '../components/EditProfileModal';
import { AddressManagerModal } from '../components/AddressManagerModal';
import { WalletTopUpModal } from '../components/WalletTopUpModal';
import { PolicyModal } from '../components/PolicyModal';

export const AccountScreen: React.FC = () => {
  const { userProfile, orderHistory, currentOrder, setActiveTab, addToCart, logoutUser } = useApp();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddressManager, setShowAddressManager] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [activePolicy, setActivePolicy] = useState<'terms' | 'privacy' | 'shipping' | 'cancellation' | null>(null);

  // GUEST MODE (USER NOT LOGGED IN)
  if (!userProfile.isLoggedIn) {
    return (
      <div className="p-4 space-y-4 pb-24 animate-fadeIn">
        {/* Top Login / Signup Call to Action Banner */}
        <div className="bg-[#fdee24] border border-yellow-400 text-black rounded-3xl p-6 shadow-md space-y-3 text-center relative overflow-hidden">
          <div className="w-14 h-14 bg-black text-yellow-300 rounded-full flex items-center justify-center mx-auto text-2xl shadow-sm">
            👤
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Login to CartCraze</h2>
            <p className="text-xs text-gray-800 font-medium max-w-xs mx-auto mt-1 leading-relaxed">
              Unlock 9-minute express deliveries, wallet balance, saved addresses, and past order history!
            </p>
          </div>
          
          <button
            onClick={() => setActiveTab('login')}
            className="w-full bg-black hover:bg-gray-800 text-yellow-300 font-black text-sm py-3.5 px-6 rounded-2xl shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-yellow-300" />
            <span>LOGIN / SIGNUP NOW</span>
          </button>
        </div>

        {/* Guest Saved Addresses Banner */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-amber-500" />
            <div>
              <span className="font-extrabold text-xs text-gray-900 block">Saved Delivery Addresses</span>
              <span className="text-[11px] text-gray-400">Login to access your saved home/work locations</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('login')}
            className="text-xs font-black text-amber-600 hover:underline cursor-pointer"
          >
            Login
          </button>
        </div>

        {/* App Policies & Terms & Conditions Section */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>App Policies &amp; Legal Terms</span>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            <button
              onClick={() => setActivePolicy('terms')}
              className="w-full flex items-center justify-between py-2.5 hover:text-amber-600 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-800">Terms of Service</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => setActivePolicy('privacy')}
              className="w-full flex items-center justify-between py-2.5 hover:text-amber-600 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-800">Privacy &amp; Data Policy</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => setActivePolicy('shipping')}
              className="w-full flex items-center justify-between py-2.5 hover:text-amber-600 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-800">Shipping &amp; Delivery SLA</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => setActivePolicy('cancellation')}
              className="w-full flex items-center justify-between py-2.5 hover:text-amber-600 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-800">Cancellation &amp; Refund Policy</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Policy Modal */}
        <PolicyModal
          isOpen={!!activePolicy}
          onClose={() => setActivePolicy(null)}
          policyType={activePolicy}
        />
      </div>
    );
  }

  // LOGGED IN USER MODE
  return (
    <div className="p-4 space-y-4 pb-24 animate-fadeIn font-sans">
      {/* User Header Profile Card */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between z-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-yellow-400 text-black font-black text-xl flex items-center justify-center border-2 border-white shadow-md">
              {userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'CU'}
            </div>
            <div>
              <h2 className="text-base font-extrabold">{userProfile.name}</h2>
              <p className="text-xs text-gray-300 font-medium">{userProfile.phone}</p>
              <p className="text-[11px] text-gray-400">{userProfile.email}</p>
            </div>
          </div>

          <button 
            onClick={() => setShowEditProfile(true)}
            className="text-xs font-bold text-yellow-300 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* Quick Balance & Coins Banner */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
          <div 
            onClick={() => setShowWalletModal(true)}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 flex items-center justify-between cursor-pointer hover:bg-white/20 transition"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-400 text-black rounded-xl">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-gray-300 block font-medium">CartCraze Wallet</span>
                <span className="font-black text-sm text-white">₹{userProfile.walletBalance}</span>
              </div>
            </div>
            <Plus className="w-4 h-4 text-yellow-300" />
          </div>

          <div 
            onClick={() => setShowWalletModal(true)}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 flex items-center justify-between cursor-pointer hover:bg-white/20 transition"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-400 text-black rounded-xl">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-gray-300 block font-medium">CartCoins</span>
                <span className="font-black text-sm text-white">{userProfile.freshCoins} pts</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-300" />
          </div>
        </div>
      </div>

      {/* ACTIVE ORDER LIVE TRACKING BANNER */}
      {currentOrder && (
        <div
          onClick={() => setActiveTab('track')}
          className="bg-slate-900 text-white rounded-3xl p-4 shadow-xl border border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#fdee24] text-black rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-md">
              🛵
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-400 uppercase">Live Order #{currentOrder.id}</span>
                <span className="text-[9px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full uppercase">
                  {currentOrder.status || 'ON THE WAY'}
                </span>
              </div>
              <p className="text-xs font-bold text-white mt-0.5">Tap to Track Rider Live on GPS Map</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-400" />
        </div>
      )}

      {/* Order History Section */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs font-extrabold text-gray-900">
            <ShoppingBag className="w-4 h-4 text-amber-500" />
            <span>Past Orders ({orderHistory.length})</span>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold">Saved in account</span>
        </div>

        {orderHistory.length > 0 ? (
          <div className="space-y-3 divide-y divide-gray-100">
            {orderHistory.map((order) => (
              <div key={order.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <span className="font-bold text-gray-900">Order #{order.id}</span>
                    <span className="text-gray-400 block text-[10px]">{order.date} • {order.items.length} items</span>
                  </div>
                  <span className="font-black text-sm text-gray-900">₹{order.finalTotal}</span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl text-[11px]">
                  <span className="text-gray-600 truncate max-w-[200px]">
                    {order.items.map((i) => i.product.name).join(', ')}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveTab('track')}
                      className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-[10px] px-2.5 py-1 rounded-lg transition-transform active:scale-95 shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <Radio className="w-3 h-3" />
                      <span>TRACK</span>
                    </button>
                    <button
                      onClick={() => {
                        order.items.forEach((i) => addToCart(i.product));
                        setActiveTab('cart');
                      }}
                      className="flex items-center gap-1 bg-[#fdee24] hover:bg-yellow-400 text-black font-extrabold text-[10px] px-2.5 py-1 rounded-lg transition-transform active:scale-95 shadow-2xs cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>REORDER</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-gray-500">
            <p className="font-semibold text-gray-700">No past orders yet</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Your placed orders will appear here for easy reordering</p>
          </div>
        )}
      </div>

      {/* Account Settings & Preferences Links */}
      <div className="bg-white rounded-2xl p-2 border border-gray-100 divide-y divide-gray-100 text-xs">
        <button 
          onClick={() => setActiveTab('track')}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Radio className="w-4 h-4 text-amber-500" />
            <div>
              <span className="font-bold text-gray-900 block">Live Order Tracking &amp; GPS</span>
              <span className="text-[11px] text-gray-400">
                {currentOrder ? `Track active order #${currentOrder.id} live` : 'View live delivery status & map telemetry'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button 
          onClick={() => setShowAddressManager(true)}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-gray-500" />
            <div>
              <span className="font-bold text-gray-900 block">Saved Delivery Addresses</span>
              <span className="text-[11px] text-gray-400 truncate max-w-[220px] block">{userProfile.address}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button 
          onClick={() => setShowWalletModal(true)}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-gray-500" />
            <div>
              <span className="font-bold text-gray-900 block">Saved Payment &amp; Wallet</span>
              <span className="text-[11px] text-gray-400">CartCraze Wallet (Bal ₹{userProfile.walletBalance})</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button 
          onClick={() => setActivePolicy('terms')}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-gray-500" />
            <div>
              <span className="font-bold text-gray-900 block">Terms, Privacy &amp; SLA</span>
              <span className="text-[11px] text-gray-400">9-Minute Delivery Guarantee &amp; Policies</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button 
          onClick={logoutUser}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-xl transition-colors text-red-600 font-bold cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Log Out</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />

      <AddressManagerModal
        isOpen={showAddressManager}
        onClose={() => setShowAddressManager(false)}
      />

      <WalletTopUpModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />

      <PolicyModal
        isOpen={!!activePolicy}
        onClose={() => setActivePolicy(null)}
        policyType={activePolicy}
      />
    </div>
  );
};
