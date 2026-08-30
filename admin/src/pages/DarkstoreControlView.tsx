import React from 'react';
import type { DarkstoreNode } from '../types';
import { Server, Power } from 'lucide-react';

interface DarkstoreControlViewProps {
  darkstores: DarkstoreNode[];
  onToggleStoreStatus: (storeId: string) => void;
}

export const DarkstoreControlView: React.FC<DarkstoreControlViewProps> = ({
  darkstores,
  onToggleStoreStatus
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Master Darkstore Network Controller</h2>
          <p className="text-xs text-slate-400">Enable, pause, or lock fulfillment nodes across all cities</p>
        </div>
        <span className="bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold text-xs px-3.5 py-1.5 rounded-full">
          {darkstores.filter((d) => d.status === 'ONLINE').length} / {darkstores.length} Darkstores Live
        </span>
      </div>

      {/* Darkstores Master Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Darkstore Node</th>
                <th className="p-4">City / Region</th>
                <th className="p-4">Manager Contact</th>
                <th className="p-4">Today's Orders</th>
                <th className="p-4">Today's Sales</th>
                <th className="p-4">Uptime SLA</th>
                <th className="p-4 text-center">Master Control Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {darkstores.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs font-semibold">
                    No active darkstores registered yet. Waiting for shop partner onboarding and Super Admin approval.
                  </td>
                </tr>
              ) : (
                darkstores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-800 rounded-2xl border border-slate-700 text-amber-400">
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-white text-xs block">{store.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Node ID: {store.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-bold text-slate-300">
                    {store.city}
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-slate-200 block">{store.managerName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{store.managerPhone}</span>
                  </td>

                  <td className="p-4 font-extrabold text-white">
                    {store.dailyOrders} Orders
                  </td>

                  <td className="p-4 font-black text-amber-400">
                    ₹{store.revenue}
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-md text-[11px]">
                      {store.uptimePercent}%
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => onToggleStoreStatus(store.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all border shadow-xs ${
                        store.status === 'ONLINE'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                          : 'bg-red-950 text-red-300 border-red-800 hover:bg-red-900'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{store.status === 'ONLINE' ? 'ONLINE (ACTIVE)' : 'PAUSED / OFF'}</span>
                    </button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
