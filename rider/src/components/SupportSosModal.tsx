import React, { useState } from 'react';
import { X, ShieldAlert, PhoneCall, Headphones, MessageSquare, AlertTriangle, CheckCircle2, ChevronRight, Fuel, Car, HelpCircle } from 'lucide-react';

interface SupportSosModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'support' | 'sos';
}

export const SupportSosModal: React.FC<SupportSosModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'support'
}) => {
  const [activeTab, setActiveTab] = useState<'support' | 'sos'>(initialTab);
  const [sosTriggered, setSosTriggered] = useState(false);

  if (!isOpen) return null;

  const handleTriggerSos = () => {
    setSosTriggered(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 font-sans text-white relative">
        {/* Top Header & Tabs */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <div className="flex gap-2 bg-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('support')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'support' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Partner Support</span>
            </button>
            <button
              onClick={() => setActiveTab('sos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sos' ? 'bg-red-600 text-white shadow-sm animate-pulse' : 'text-red-400 hover:text-red-300'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>1-TAP SOS</span>
            </button>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {activeTab === 'support' ? (
          <div className="space-y-3.5 text-xs">
            <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-500/30 p-3.5 rounded-2xl flex items-center gap-3">
              <PhoneCall className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-extrabold text-white text-xs">24/7 Rider Dispatch Support</h4>
                <p className="text-[10px] text-slate-400">Avg resolution time: &lt; 2 mins</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Common Delivery Assistance</span>
              {[
                { title: 'Customer Unreachable / Wrong Address', icon: AlertTriangle },
                { title: 'Darkstore Delay / Items Packed Pending', icon: Fuel },
                { title: 'Vehicle Breakdown / Flat Tyre', icon: Car },
                { title: 'Payment Issue / COD Dispute', icon: HelpCircle }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => alert(`Support Ticket Created for: "${item.title}". Rider Dispatch Officer is calling you now.`)}
                    className="w-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 p-3 rounded-2xl flex items-center justify-between transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-slate-200 text-xs">{item.title}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href="tel:+919800011111"
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-2xl text-center text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <PhoneCall className="w-4 h-4 fill-slate-950" />
                <span>Call Support Line</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-center py-2">
            {!sosTriggered ? (
              <>
                <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-500 border-2 border-red-500 flex items-center justify-center mx-auto text-3xl animate-bounce">
                  🚨
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Emergency Assistance Alert</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                    Tap SOS below to instantly dispatch your live GPS location to CartCraze Emergency Command &amp; Local Patrol.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerSos}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-950 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                  <span>TRIGGER EMERGENCY SOS ALERT</span>
                </button>
              </>
            ) : (
              <div className="space-y-3 p-4 bg-red-950/60 border border-red-800 rounded-2xl text-left">
                <div className="flex items-center gap-2 text-red-400 font-extrabold text-xs">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />
                  <span>EMERGENCY SOS DISPATCHED</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Your live GPS coordinates (Sector 1, HSR Layout) have been transmitted to CartCraze Safety Command. An emergency operator is calling your phone now.
                </p>
                <button
                  onClick={() => setSosTriggered(false)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel Alarm (False Alarm)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
