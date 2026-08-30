import React from 'react';
import type { AdminUser, AdminActiveTab } from '../types';
import {
  ShieldCheck,
  Server,
  ShieldAlert,
  Users,
  Settings,
  Lock,
  LogOut,
  LayoutDashboard,
  Radio,
  ExternalLink,
  ShoppingBag,
  Store,
  Bike,
  Compass
} from 'lucide-react';

interface AdminNavbarProps {
  admin: AdminUser;
  activeTab: AdminActiveTab;
  setActiveTab: (tab: AdminActiveTab) => void;
  onLockSession: () => void;
  onLogout: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  admin,
  activeTab,
  setActiveTab,
  onLockSession,
  onLogout
}) => {
  return (
    <header className="bg-slate-950 text-slate-100 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      {/* Top Threat Level & Session Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap justify-between items-center gap-4 text-xs">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-400 text-black font-black text-xs px-3 py-1 rounded-xl shadow-xs tracking-wider uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-black stroke-[3]" />
            <span>CARTCRAZE SUPER ADMIN</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Encrypted Session: <strong className="text-slate-200">{admin.sessionToken}</strong></span>
          </div>
        </div>

        {/* ECOSYSTEM QUICK LAUNCH APP LINKS */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-inner">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 hidden lg:inline">
            Ecosystem:
          </span>
          
          {/* User App Link */}
          <a
            href="http://localhost:5173/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-amber-500 hover:text-black text-slate-200 px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer shadow-xs"
            title="Open Customer Storefront App (Port 5173)"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>User Store</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          {/* Shop / Partner App Link */}
          <a
            href="http://localhost:3030/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-amber-500 hover:text-black text-slate-200 px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer shadow-xs"
            title="Open Darkstore Manager Shop App (Port 3030)"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Shop App</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          {/* Rider App Link */}
          <a
            href="http://localhost:5050/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-amber-500 hover:text-black text-slate-200 px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer shadow-xs"
            title="Open Rider Delivery App (Port 5050)"
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Rider App</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>

        {/* Right Security Threat Badge & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex bg-emerald-950/80 border border-emerald-800 text-emerald-400 px-3 py-1 rounded-full font-bold text-[11px] items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SYSTEM SECURE</span>
          </div>

          <button
            onClick={onLockSession}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-xl font-bold transition-colors cursor-pointer"
            title="Lock Current Session"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 px-2.5 py-1.5 rounded-xl font-bold transition-colors cursor-pointer"
            title="Terminate Admin Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-900 border-t border-slate-800/80 px-4">
        <nav className="max-w-7xl mx-auto flex space-x-1 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'overview' as AdminActiveTab, label: 'Global Platform Overview', icon: LayoutDashboard },
            { id: 'darkstores' as AdminActiveTab, label: 'Darkstore Network Control', icon: Server },
            { id: 'approvals' as AdminActiveTab, label: 'Partner Approvals (Shops/Riders)', icon: ShieldCheck },
            { id: 'locationiq' as AdminActiveTab, label: 'Live LocationIQ Fleet Map', icon: Compass },
            { id: 'security_logs' as AdminActiveTab, label: 'Security & Audit Logs', icon: ShieldAlert },
            { id: 'users' as AdminActiveTab, label: 'User & Fraud Control', icon: Users },
            { id: 'settings' as AdminActiveTab, label: 'Platform Fees & Rules', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
