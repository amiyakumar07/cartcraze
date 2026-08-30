import React, { useState } from 'react';
import type { SecurityLog } from '../types';
import { ShieldAlert, Filter, Download, Terminal, Search } from 'lucide-react';

interface SecurityAuditViewProps {
  logs: SecurityLog[];
}

export const SecurityAuditView: React.FC<SecurityAuditViewProps> = ({ logs }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter((log) => {
    const matchesSev = filterSeverity === 'ALL' || log.severity === filterSeverity;
    const matchesSearch = log.eventType.toLowerCase().includes(search.toLowerCase()) ||
                          log.ipAddress.includes(search) ||
                          log.details.toLowerCase().includes(search.toLowerCase());
    return matchesSev && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm uppercase">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Cyber Security &amp; Firewall Audit Logs</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Real-time authentication attempts, IP rate-limiting, and fraud blocks</p>
        </div>

        <button
          onClick={() => alert('Exporting encrypted audit log CSV...')}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-2xl border border-slate-700 flex items-center gap-2 transition-all active:scale-95"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export Audit Log (Encrypted CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Event Type, IP Address, or Keyword..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:border-amber-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-500 mr-1" />
          {['ALL', 'INFO', 'WARNING', 'CRITICAL'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filterSeverity === sev
                  ? 'bg-amber-400 text-black shadow-xs font-black'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Security Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Event Type</th>
                <th className="p-4">Origin IP &amp; Location</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Event Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-400 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="p-4 font-bold text-amber-300">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{log.eventType}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="text-white font-bold block">{log.ipAddress}</span>
                    <span className="text-[10px] text-slate-500">{log.location}</span>
                  </td>

                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                      log.severity === 'INFO'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : log.severity === 'WARNING'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-red-950 text-red-300 border-red-800 animate-pulse'
                    }`}>
                      {log.severity}
                    </span>
                  </td>

                  <td className="p-4 text-slate-300 text-xs font-sans">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
