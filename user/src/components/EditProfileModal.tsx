import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Phone, Mail, MapPin, Check } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, setUserProfile } = useApp();

  const [name, setName] = useState(userProfile.name || '');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [address, setAddress] = useState(userProfile.address || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile((prev) => ({
      ...prev,
      name: name.trim() || 'Customer User',
      phone: phone.trim() || '+91 98765 43210',
      email: email.trim() || 'customer@cartcraze.app',
      address: address.trim() || 'HSR Layout Sector 1, Bengaluru'
    }));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white max-w-sm w-full rounded-3xl p-5 shadow-2xl space-y-4 border border-gray-100 relative">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-400 text-black font-black flex items-center justify-center text-sm shadow-xs">
              👤
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900">Edit Profile</h3>
              <p className="text-[10px] text-gray-400 font-medium">Update account contact details</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-center space-y-2 text-xs font-bold animate-fadeIn">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <p>Profile Details Saved Successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none focus:border-amber-400 focus:bg-white transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none focus:border-amber-400 focus:bg-white transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none focus:border-amber-400 focus:bg-white transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>Primary Delivery Address</span>
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete house address"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none focus:border-amber-400 focus:bg-white transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#fdee24] hover:bg-yellow-400 text-black font-black text-xs py-3 rounded-xl shadow-xs transition active:scale-98 cursor-pointer mt-2"
            >
              SAVE PROFILE CHANGES
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
