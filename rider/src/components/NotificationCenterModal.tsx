import React, { useState } from 'react';
import { X, Bell, Zap, Gift, ShieldAlert, Check } from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationItem {
  id: string;
  type: 'ORDER' | 'EARNING' | 'SYSTEM';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'EARNING',
      title: 'Weekend Incentive Bonus Credited!',
      message: '₹300 bonus credited for completing 20 deliveries this weekend.',
      time: '10m ago',
      read: false
    },
    {
      id: 'notif-2',
      type: 'ORDER',
      title: 'Delivery Completed #CC-9402',
      message: 'Customer verified OTP. ₹85 credited to your earnings wallet.',
      time: '1h ago',
      read: false
    },
    {
      id: 'notif-3',
      type: 'SYSTEM',
      title: 'Rain Surge Pricing Active in HSR Sector 1',
      message: 'Extra +₹15 per delivery order active until 9:00 PM tonight.',
      time: '3h ago',
      read: true
    }
  ]);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 font-sans text-white relative max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-white">Rider Notifications</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="text-[10px] text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3 h-3" />
              <span>Mark All Read</span>
            </button>
            <button onClick={onClose} className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                n.read
                  ? 'bg-slate-800/40 border-slate-700/40 text-slate-400'
                  : 'bg-gradient-to-r from-slate-800 to-slate-800/90 border-amber-500/30 text-white shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <h4 className="text-xs font-extrabold flex items-center gap-1.5">
                  {n.type === 'EARNING' && <Gift className="w-3.5 h-3.5 text-amber-400" />}
                  {n.type === 'ORDER' && <Zap className="w-3.5 h-3.5 text-emerald-400" />}
                  {n.type === 'SYSTEM' && <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />}
                  <span>{n.title}</span>
                </h4>
                <span className="text-[9px] text-slate-500 font-mono shrink-0">{n.time}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-normal">{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
