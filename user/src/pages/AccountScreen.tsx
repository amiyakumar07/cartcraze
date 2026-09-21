import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddressSearchModal } from '../components/AddressSearchModal';
import { AddressManagerModal } from '../components/AddressManagerModal';
import { 
  Package, 
  MapPin, 
  Phone, 
  MessageCircle, 
  LogOut, 
  LogIn, 
  Store, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Headphones
} from 'lucide-react';

export const AccountScreen: React.FC = () => {
  const { 
    userProfile, 
    setUserProfile, 
    setUserCoords, 
    setActiveTab, 
    logoutUser, 
    currentOrder, 
    orderHistory,
    deliveryEta,
    serviceabilityStatus,
    activeStore
  } = useApp();

  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);

  const handleSupportWhatsApp = () => {
    const text = encodeURIComponent('Hi CartCraze Support, I need assistance with my account/orders.');
    window.open(`https://wa.me/919800011111?text=${text}`, '_blank');
  };

  const displayName = userProfile.name?.trim() || (userProfile.phone ? `Customer (${userProfile.phone.slice(-4)})` : 'CartCraze Customer');
  const displayPhone = userProfile.phone || 'No mobile linked';

  return (
    <div className="flex flex-col w-full pb-32 px-4 space-y-3 font-sans animate-fadeIn pt-3">
      {/* 1. User Profile Header Card */}
      <section className="bg-white p-3.5 rounded-2xl shadow-2xs flex items-center justify-between border border-[#eaedff]">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00676d] to-[#6ffbbe] text-white flex items-center justify-center text-lg font-black shadow-2xs ring-2 ring-[#00676d]/20 shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm font-extrabold text-[#131b2e] truncate">{displayName}</h2>
              {userProfile.isLoggedIn && (
                <span className="bg-[#006a48]/15 text-[#006a48] text-[8px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  VERIFIED
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#6e797a] truncate">{displayPhone}</p>
          </div>
        </div>

        {userProfile.isLoggedIn ? (
          <button 
            onClick={() => setActiveTab('login')}
            className="text-[11px] font-bold text-[#00676d] bg-[#f2f3ff] hover:bg-[#eaedff] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            Switch
          </button>
        ) : (
          <button 
            onClick={() => setActiveTab('login')}
            className="flex items-center gap-1 bg-[#00676d] text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-xs active:scale-95 transition-transform cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
        )}
      </section>

      {/* 2. Operational Darkstore Badge */}
      <section className="bg-gradient-to-r from-[#00676d] to-[#004e53] text-white p-3.5 rounded-2xl shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Store className="w-4 h-4 text-[#6ffbbe]" />
            <span className="text-xs font-black tracking-wide">Fulfillment Store #01</span>
          </div>
          <span className="text-[9px] bg-white/20 backdrop-blur-xs text-white px-2 py-0.5 rounded-full font-bold uppercase">
            Active Hub
          </span>
        </div>
        <p className="text-xs font-bold text-white/90">
          CartCraze Express — Jaydev Vihar, Bhubaneswar
        </p>
        <div className="flex items-center justify-between text-[10px] text-white/80 pt-1 border-t border-white/15">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#6ffbbe]" />
            <span>Delivery ETA: <strong>{deliveryEta || '10-18 min'}</strong></span>
          </div>
          <span>Service Radius: <strong>5.0 km</strong></span>
        </div>
      </section>

      {/* 3. Active Order Status (if any) */}
      {currentOrder && (
        <section className="bg-white rounded-2xl shadow-2xs p-3 border border-emerald-200 bg-emerald-50/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006a48] animate-ping" />
              <h4 className="text-xs font-black text-[#131b2e]">Active Delivery in Transit</h4>
            </div>
            <span className="text-[10px] font-extrabold text-[#006a48] bg-[#006a48]/10 px-2 py-0.5 rounded-full">
              {currentOrder.id}
            </span>
          </div>
          <p className="text-[11px] text-[#6e797a]">
            {currentOrder.items?.length || 1} items • Total ₹{currentOrder.finalTotal}
          </p>
          <button
            onClick={() => setActiveTab('track_order')}
            className="mt-2.5 w-full bg-[#00676d] hover:bg-[#00555a] text-white text-xs font-extrabold py-2 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Live Delivery Tracking</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </section>
      )}

      {/* 4. Orders History */}
      <section className="bg-white rounded-2xl shadow-2xs p-1.5 border border-[#eaedff]">
        <div className="px-3 pt-2 pb-1.5 flex items-center justify-between">
          <h4 className="text-[10px] font-extrabold text-[#6e797a] uppercase tracking-wider">
            Order History
          </h4>
          <span className="text-[10px] text-gray-400 font-bold">{orderHistory.length} Orders</span>
        </div>

        {orderHistory.length > 0 ? (
          <div className="space-y-1">
            {orderHistory.slice(0, 3).map((order) => (
              <div
                key={order.id}
                onClick={() => setActiveTab('track_order')}
                className="flex items-center justify-between p-2.5 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#00676d]/10 flex items-center justify-center text-[#00676d] shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#131b2e] truncate">{order.id}</p>
                    <p className="text-[10px] text-[#6e797a] truncate">
                      {order.items?.length || 1} items • ₹{order.finalTotal} • {order.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {order.status || 'CONFIRMED'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-xs font-semibold text-gray-500">No past orders found.</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Your placed orders will appear here automatically.</p>
          </div>
        )}
      </section>

      {/* 5. Saved Addresses & Preferences */}
      <section className="bg-white rounded-2xl shadow-2xs p-1.5 space-y-0.5 border border-[#eaedff]">
        <div className="px-3 pt-2 pb-1">
          <h4 className="text-[10px] font-extrabold text-[#6e797a] uppercase tracking-wider">
            Delivery Location &amp; Addresses
          </h4>
        </div>
        <div 
          onClick={() => setShowSearchModal(true)}
          className="flex items-center justify-between p-2.5 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#00676d]/10 flex items-center justify-center text-[#00676d] shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#131b2e] truncate">Current Delivery Address</p>
              <p className="text-[10px] text-[#6e797a] truncate">
                {userProfile.address || 'Select Bhubaneswar delivery location'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#00676d] shrink-0">Change</span>
        </div>

        <div 
          onClick={() => setShowAddressModal(true)}
          className="flex items-center justify-between p-2.5 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#131b2e] truncate">Saved Addresses</p>
              <p className="text-[10px] text-[#6e797a] truncate">
                {userProfile.savedAddresses?.length || 1} address stored
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
        </div>
      </section>

      {/* 6. Help & Support */}
      <section className="bg-white rounded-2xl shadow-2xs p-1.5 space-y-0.5 border border-[#eaedff]">
        <div className="px-3 pt-2 pb-1">
          <h4 className="text-[10px] font-extrabold text-[#6e797a] uppercase tracking-wider">
            Help &amp; Support
          </h4>
        </div>
        <div 
          onClick={handleSupportWhatsApp}
          className="flex items-center justify-between p-2.5 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#25D366] shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#131b2e] truncate">WhatsApp Helpdesk</p>
              <p className="text-[10px] text-[#6e797a] truncate">Direct 24/7 customer service chat</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
        </div>

        <div 
          onClick={() => {
            window.location.href = 'mailto:support@cartcraze.in?subject=CartCraze%20Customer%20Query';
          }}
          className="flex items-center justify-between p-2.5 hover:bg-[#f2f3ff] rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#131b2e] truncate">Email Support</p>
              <p className="text-[10px] text-[#6e797a] truncate">support@cartcraze.in</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
        </div>
      </section>

      {/* 7. Logout & App Info */}
      <div className="flex flex-col items-center justify-center pt-2 pb-6 space-y-2">
        {userProfile.isLoggedIn && (
          <button 
            onClick={logoutUser}
            className="flex items-center justify-center space-x-1.5 text-red-600 hover:text-red-700 py-2 px-6 hover:bg-red-50 rounded-full transition-colors active:scale-95 text-xs font-bold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        )}
        <div className="text-center">
          <p className="text-[10px] text-[#6e797a] font-medium">CartCraze Hyperlocal Express v2.4.1</p>
          <p className="text-[9px] text-[#6e797a]/70 uppercase tracking-widest mt-0.5 font-bold">Store #01 Jaydev Vihar, Bhubaneswar</p>
        </div>
      </div>

      {/* Modals */}
      <AddressSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectAddress={(addr, coords) => {
          setUserProfile((prev) => ({ ...prev, address: addr }));
          localStorage.setItem('cartcraze_user_selected_address', addr);
          if (coords) setUserCoords(coords);
        }}
      />

      <AddressManagerModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
      />
    </div>
  );
};

export default AccountScreen;
