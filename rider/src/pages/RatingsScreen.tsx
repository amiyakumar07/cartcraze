import React from 'react';
import { Star, Award, ShieldCheck, ThumbsUp, Heart, Zap, MessageSquare, CheckCircle2 } from 'lucide-react';

export const RatingsScreen: React.FC = () => {
  const reviews = [
    { id: 'rev-1', customerName: 'Amiya S.', rating: 5, time: '2h ago', comment: 'Super fast 9-min delivery! Cold beverages were ice cold.', badge: 'Lightning Fast' },
    { id: 'rev-2', customerName: 'Priya M.', rating: 5, time: 'Yesterday', comment: 'Very polite rider, handled bakery items with zero damage.', badge: 'Careful Handling' },
    { id: 'rev-3', customerName: 'Rahul K.', rating: 5, time: '2 days ago', comment: 'Always on time in HSR Layout! Highly recommended rider.', badge: 'On-Time Master' },
    { id: 'rev-4', customerName: 'Sneha R.', rating: 4, time: '3 days ago', comment: 'Quick delivery despite rain.', badge: 'Rain Champ' }
  ];

  return (
    <div className="bg-slate-950 text-white min-h-screen pb-24 font-sans space-y-4 p-4 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex justify-between items-center">
        <div>
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">RATINGS &amp; REVIEWS</span>
          <h2 className="text-base font-black text-white">Partner Performance Ratings</h2>
        </div>
        <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
          Top 1% Rated
        </span>
      </div>

      {/* ── OVERALL RATING SCORE HERO CARD ── */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-emerald-950/80 border border-amber-500/40 rounded-3xl p-5 shadow-2xl flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Customer Satisfaction Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-400">4.92</span>
            <div className="flex text-amber-400 text-sm">
              {'★★★★★'.split('').map((star, idx) => (
                <span key={idx}>{star}</span>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Based on 148 customer ratings in last 30 days</p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-400 flex flex-col items-center justify-center font-black text-xl shadow-lg shrink-0">
          <Star className="w-6 h-6 fill-amber-400 text-amber-400 animate-pulse" />
        </div>
      </div>

      {/* ── PERFORMANCE BADGES GRID ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Earned Performance Badges</span>
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              ⚡
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs">Lightning Rider</h4>
              <span className="text-[9px] text-slate-400 font-mono">100+ 9-min deliveries</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              🌟
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs">Customer Favorite</h4>
              <span className="text-[9px] text-slate-400 font-mono">98% 5-star ratings</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              🛡️
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs">Zero Spills</h4>
              <span className="text-[9px] text-slate-400 font-mono">100% item safety</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-sm shrink-0">
              🎯
            </div>
            <div>
              <h4 className="font-extrabold text-white text-xs">On-Time Guarantee</h4>
              <span className="text-[9px] text-slate-400 font-mono">96% SLA compliance</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CUSTOMER REVIEWS & FEEDBACK LIST ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>Recent Customer Feedback</span>
        </h3>

        <div className="space-y-2.5">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white">{rev.customerName}</span>
                  <span className="text-amber-400 font-bold text-[11px]">{'★'.repeat(rev.rating)}</span>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">{rev.time}</span>
              </div>
              <p className="text-[11px] text-slate-300 italic">"{rev.comment}"</p>
              <span className="inline-block bg-slate-800 text-emerald-400 text-[9px] font-extrabold px-2 py-0.5 rounded-md border border-slate-700">
                🏷️ {rev.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
