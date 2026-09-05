import React from "react";
import { Star, Trophy, Timer, ShieldCheck, TrendingUp } from 'lucide-react';
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useCountUp } from "../hooks/useCountUp";
import type { RatingBreakdown, CustomerReview, PerformanceBadge } from "../types";

const ratingBreakdown: RatingBreakdown[] = [
  { stars: 5, percentage: 85, count: 340 },
  { stars: 4, percentage: 10, count: 40 },
  { stars: 3, percentage: 3, count: 12 },
  { stars: 2, percentage: 1, count: 4 },
  { stars: 1, percentage: 1, count: 4 },
];

const badges: PerformanceBadge[] = [
  { id: '1', title: 'Top 5%', description: 'Rider in City', icon: 'trophy', color: 'amber' },
  { id: '2', title: 'Punctual', description: '98% On-time', icon: 'timer', color: 'emerald' },
  { id: '3', title: 'Professional', description: 'Great Service', icon: 'shield', color: 'blue' },
];

const reviews: CustomerReview[] = [
  {
    id: '1',
    rating: 5,
    comment: "Fast delivery! The rider was very polite and handled my fragile groceries with care. Highly recommend.",
    date: 'Today',
    tags: ['Polite', 'Careful'],
    customerName: 'Priya S.',
  },
  {
    id: '2',
    rating: 5,
    comment: "Arrived earlier than expected and followed my delivery instructions perfectly.",
    date: 'Yesterday',
    tags: ['Fast'],
    customerName: 'Rahul M.',
  },
];

const colorMap = {
  amber: 'bg-amber-500/10 text-amber-400',
  emerald: 'bg-emerald-500/10 text-emerald-400',
  blue: 'bg-blue-500/10 text-blue-400',
  purple: 'bg-purple-500/10 text-purple-400',
  rose: 'bg-rose-500/10 text-rose-400',
};

export const RatingsScreen: React.FC = () => {
  const ratingCount = useCountUp(48, 800, 0); // 4.8 * 10 for animation
  const totalReviews = ratingBreakdown.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="min-h-full bg-fleet-950 text-fleet-50 pb-24 animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-fleet-950/95 backdrop-blur-xl border-b border-fleet-800/50 px-5 py-4">
        <h1 className="text-xl font-display font-bold text-white">Ratings</h1>
        <p className="text-[10px] text-fleet-500 font-bold tracking-wider uppercase mt-0.5">Last 30 days</p>
      </header>

      <div className="px-5 pt-5 space-y-5">
        {/* Rating Overview */}
        <div className="grid grid-cols-2 gap-3">
          <Card variant="elevated" className="text-center py-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -mr-8 -mt-8" />
            <div className="relative">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-display font-bold text-white">{(ratingCount / 10).toFixed(1)}</span>
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              </div>
              <p className="text-xs text-fleet-500 font-bold mt-2">Overall Rating</p>
              <div className="flex items-center justify-center gap-1 mt-3">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400">+0.2 this week</span>
              </div>
            </div>
          </Card>

          <Card variant="default" className="py-4">
            <p className="text-[10px] text-fleet-500 font-bold uppercase tracking-wider mb-3">Breakdown</p>
            <div className="space-y-2">
              {ratingBreakdown.map((r) => (
                <div key={r.stars} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-fleet-500 w-3">{r.stars}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <div className="flex-1 h-1.5 bg-fleet-800 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        r.stars >= 4 ? "bg-amber-500" : r.stars === 3 ? "bg-fleet-600" : "bg-rose-500"
                      )}
                      style={{ width: `${r.percentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-fleet-500 w-6 text-right">{r.percentage}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Badges */}
        <div>
          <h3 className="text-sm font-bold text-fleet-100 mb-3">Performance Badges</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-5 px-5">
            {badges.map((badge) => (
              <Card key={badge.id} variant="glass" className="flex-none w-[140px] text-center py-5 border-fleet-700/50">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3", colorMap[badge.color])}>
                  {badge.icon === 'trophy' && <Trophy className="w-6 h-6" />}
                  {badge.icon === 'timer' && <Timer className="w-6 h-6" />}
                  {badge.icon === 'shield' && <ShieldCheck className="w-6 h-6" />}
                </div>
                <p className="text-sm font-bold text-fleet-100">{badge.title}</p>
                <p className="text-[10px] text-fleet-500 mt-1">{badge.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-fleet-100">Recent Feedback</h3>
            <button className="text-xs font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer">View All</button>
          </div>
          <div className="space-y-3">
            {reviews.map((review) => (
              <Card key={review.id} variant="default" className="animate-fade-in-up">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn("w-4 h-4", i < review.rating ? "text-amber-400 fill-amber-400" : "text-fleet-700")} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-fleet-500 font-bold">{review.date}</span>
                </div>
                <p className="text-sm text-fleet-300 leading-relaxed mb-3">"{review.comment}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {review.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-fleet-800 rounded-lg text-[10px] font-bold text-fleet-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-fleet-600 font-medium">— {review.customerName}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import { cn } from "../utils/cn";
