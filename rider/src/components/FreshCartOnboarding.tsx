import React from "react";
import { Bike, Wallet, Clock, ArrowRight } from 'lucide-react';
import { Button } from "./ui/Button";

interface Props {
  onJoin?: () => void;
  onSignIn?: () => void;
}

export const FreshCartOnboarding: React.FC<Props> = ({ onJoin, onSignIn }) => {
  return (
    <div className="min-h-full bg-fleet-950 text-fleet-50 flex flex-col animate-fade-in">
      {/* Hero Image Area */}
      <div className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fleet-950/50 to-fleet-950 z-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-fleet-950 to-fleet-950" />

        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-20 h-full flex flex-col justify-end p-8">
          <h1 className="text-5xl font-display font-bold tracking-tight">
            <span className="gradient-text">CartCraze</span>
          </h1>
          <p className="text-lg text-fleet-400 font-medium mt-2">Rider Partner</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 pb-8 -mt-4 relative z-30">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-white">
              Deliver Fresh.<br />Earn Fast.
            </h2>
            <p className="text-sm text-fleet-500 mt-3 leading-relaxed">
              Turn your free time into earnings. Join our elite fleet of delivery partners.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-fleet-900/80 rounded-2xl border border-fleet-800/50">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Wallet className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-fleet-100">Up to ₹30,000/mo</p>
                <p className="text-xs text-fleet-500">Competitive per-delivery payouts</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-fleet-900/80 rounded-2xl border border-fleet-800/50">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Wallet className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-fleet-100">Instant Payouts</p>
                <p className="text-xs text-fleet-500">Cash out whenever you need</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-fleet-900/80 rounded-2xl border border-fleet-800/50">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-fleet-100">Flexible Hours</p>
                <p className="text-xs text-fleet-500">Choose when and where to ride</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button variant="primary" fullWidth onClick={onJoin} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Join Now
            </Button>
            <Button variant="secondary" fullWidth onClick={onSignIn}>
              Sign In to Account
            </Button>
          </div>

          <p className="text-[10px] text-fleet-600 text-center leading-relaxed">
            By joining, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreshCartOnboarding;
