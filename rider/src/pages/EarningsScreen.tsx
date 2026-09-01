import React, { useState } from 'react';
import type { RiderProfile } from '../App';
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, Gift, Zap, ShieldCheck, CreditCard, ChevronRight, CheckCircle2, Award } from 'lucide-react';

interface Props {
  riderProfile?: RiderProfile;
}

export const EarningsScreen: React.FC<Props> = ({ riderProfile }) => {
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('week');
  const [payoutRequested, setPayoutRequested] = useState(false);

  const todayEarnings = riderProfile?.todayEarnings || 845.5;
  const weekEarnings = todayEarnings * 5.2 + 300;
  const monthEarnings = weekEarnings * 4.2;

  const currentDisplayAmount =
    timeFilter === 'today' ? todayEarnings : timeFilter === 'week' ? weekEarnings : monthEarnings;

  const weeklyBarData = [
    { day: 'Mon', amount: 620 },
    { day: 'Tue', amount: 780 },
    { day: 'Wed', amount: 540 },
    { day: 'Thu', amount: 890 },
    { day: 'Fri', amount: 1100 },
    { day: 'Sat', amount: 1450 },
    { day: 'Sun', amount: todayEarnings }
  ];

  const maxAmount = Math.max(...weeklyBarData.map((d) => d.amount));

  const handleCashout = () => {
    setPayoutRequested(true);
    setTimeout(() => {
      alert('Instant UPI Payout of ₹' + currentDisplayAmount.toFixed(0) + ' initiated to your linked bank account!');
    }, 500);
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-24 font-sans space-y-4 p-4 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex justify-between items-center">
        <div>
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">EARNINGS &amp; PAYOUTS</span>
          <h2 className="text-base font-black text-white">Partner Earnings Wallet</h2>
        </div>
        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
          Auto UPI Payout
        </span>
      </div>

      {/* ── TIME FILTER TABS ── */}
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs">
        {(['today', 'week', 'month'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`flex-1 py-2 rounded-xl font-extrabold capitalize transition-all cursor-pointer ${
              timeFilter === filter ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {filter === 'today' ? "Today's" : filter === 'week' ? 'This Week' : 'This Month'}
          </button>
        ))}
      </div>

      {/* ── MAIN EARNINGS HERO CARD ── */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border border-emerald-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {timeFilter === 'today' ? "TODAY'S TOTAL" : timeFilter === 'week' ? 'WEEKLY TOTAL' : 'MONTHLY TOTAL'}
            </span>
            <h1 className="text-3xl font-black text-emerald-400 mt-1">
              ₹{currentDisplayAmount.toFixed(2)}
            </h1>
          </div>

          <button
            onClick={handleCashout}
            disabled={payoutRequested}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4 fill-slate-950" />
            <span>{payoutRequested ? 'Processing...' : 'INSTANT CASHOUT'}</span>
          </button>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-center font-mono text-[10px]">
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[9px]">Base Pay</span>
            <span className="text-white font-black text-xs">₹{(currentDisplayAmount * 0.7).toFixed(0)}</span>
          </div>
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[9px]">Surge Bonus</span>
            <span className="text-emerald-400 font-black text-xs">₹{(currentDisplayAmount * 0.15).toFixed(0)}</span>
          </div>
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[9px]">Incentives</span>
            <span className="text-amber-300 font-black text-xs">₹300</span>
          </div>
          <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[9px]">Tips</span>
            <span className="text-blue-300 font-black text-xs">₹{(currentDisplayAmount * 0.05).toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* ── WEEKLY EARNINGS SVG BAR CHART ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Weekly Earnings Trend</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Mon – Sun</span>
        </div>

        {/* SVG Bar Chart */}
        <div className="h-36 pt-4 flex items-end justify-between gap-2 px-2">
          {weeklyBarData.map((d, idx) => {
            const heightPercent = (d.amount / maxAmount) * 100;
            const isSun = idx === 6;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group">
                <span className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{d.amount}
                </span>
                <div className="w-full bg-slate-800 rounded-t-xl h-24 flex items-end overflow-hidden p-0.5">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isSun
                        ? 'bg-gradient-to-t from-emerald-500 to-amber-400 shadow-md'
                        : 'bg-emerald-500/70 hover:bg-emerald-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className={`text-[10px] font-bold ${isSun ? 'text-amber-400' : 'text-slate-400'}`}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── INCENTIVE CHALLENGE TRACKERS ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Active Weekend Incentive Target</span>
          </span>
          <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
            3 Days Left
          </span>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-extrabold">
            <span className="text-white">Complete 20 Weekend Deliveries</span>
            <span className="text-emerald-400">Earn ₹300 Bonus</span>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full w-[70%]" />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>14 / 20 Deliveries Completed</span>
            <span>6 More Needed</span>
          </div>
        </div>
      </div>

      {/* ── PAYOUT HISTORY LIST ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <h3 className="text-xs font-black text-white uppercase tracking-wider">Recent Bank Payout History</h3>
        <div className="space-y-2 text-xs">
          {[
            { id: 'PAY-89021', date: 'Yesterday, 11:30 PM', amount: 1240, status: 'PAID', mode: 'UPI / HDFC' },
            { id: 'PAY-88410', date: '25 Aug 2026', amount: 3450, status: 'PAID', mode: 'UPI / HDFC' },
            { id: 'PAY-87901', date: '18 Aug 2026', amount: 2890, status: 'PAID', mode: 'UPI / HDFC' }
          ].map((p) => (
            <div key={p.id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-extrabold text-white text-xs block">{p.id}</span>
                <span className="text-[10px] text-slate-400">{p.date} • {p.mode}</span>
              </div>
              <div className="text-right">
                <span className="font-black text-emerald-400 text-xs block">₹{p.amount}</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold uppercase">
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
