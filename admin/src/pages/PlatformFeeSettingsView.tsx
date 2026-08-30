import React, { useState } from 'react';
import type { PlatformSettings } from '../types';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

interface PlatformFeeSettingsViewProps {
  settings: PlatformSettings;
  onUpdateSettings: (newSettings: PlatformSettings) => void;
}

export const PlatformFeeSettingsView: React.FC<PlatformFeeSettingsViewProps> = ({
  settings,
  onUpdateSettings
}) => {
  const [formData, setFormData] = useState<PlatformSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-white">Global Platform Rules &amp; Financial Settings</h2>
          <p className="text-xs text-slate-400">Configure global commission rates, delivery thresholds, and anti-fraud filters</p>
        </div>
        <Settings className="w-6 h-6 text-amber-400" />
      </div>

      {saveSuccess && (
        <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold p-4 rounded-2xl flex items-center gap-2 shadow-lg animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Global Platform Rules updated and propagated to all 14 Darkstores!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-200 block">Darkstore Partner Commission Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.commissionRatePercent}
              onChange={(e) => setFormData({ ...formData, commissionRatePercent: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-white focus:border-amber-400 outline-none"
            />
            <span className="text-[10px] text-slate-500 block">Percentage deducted per merchant sale</span>
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-200 block">Free Delivery Min Order Threshold (₹)</label>
            <input
              type="number"
              value={formData.deliveryFeeThreshold}
              onChange={(e) => setFormData({ ...formData, deliveryFeeThreshold: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-white focus:border-amber-400 outline-none"
            />
            <span className="text-[10px] text-slate-500 block">Orders above this amount get free delivery</span>
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-200 block">Platform Convenience Fee (₹)</label>
            <input
              type="number"
              value={formData.platformFee}
              onChange={(e) => setFormData({ ...formData, platformFee: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-white focus:border-amber-400 outline-none"
            />
            <span className="text-[10px] text-slate-500 block">Fixed handling fee per customer cart</span>
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-200 block">Anti-Fraud Engine Protection</label>
            <select
              value={formData.fraudProtectionStrictness}
              onChange={(e) => setFormData({ ...formData, fraudProtectionStrictness: e.target.value as any })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-amber-400 outline-none"
            >
              <option value="LOW">LOW — Basic Phone Verification</option>
              <option value="MEDIUM">MEDIUM — Device Fingerprinting</option>
              <option value="STRICT_MAX">STRICT_MAX — AI Intrusion &amp; Device Lockouts</option>
            </select>
            <span className="text-[10px] text-slate-500 block">Behavioral anomaly &amp; promo abuse shield</span>
          </div>
        </div>

        {/* Emergency Maintenance Toggle */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between bg-slate-950 p-4 rounded-2xl border">
          <div>
            <span className="font-extrabold text-white text-xs block">Emergency System Maintenance Lock</span>
            <span className="text-[10px] text-slate-400">Temporarily pause customer order placement nationwide</span>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, maintenanceMode: !formData.maintenanceMode })}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
              formData.maintenanceMode
                ? 'bg-red-950 text-red-300 border-red-800'
                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
            }`}
          >
            {formData.maintenanceMode ? '● MAINTENANCE LOCK ACTIVE' : 'SYSTEM NORMAL'}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-amber-400 hover:bg-amber-300 text-black font-black text-xs py-3.5 rounded-2xl shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4 text-black stroke-[2.5]" />
          <span>SAVE &amp; APPLY PLATFORM RULES</span>
        </button>
      </form>
    </div>
  );
};
