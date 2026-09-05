import React, { useState } from 'react';
import { MapPin, Phone, CheckCircle2, Package, Navigation, ArrowLeft, Banknote } from 'lucide-react';
import { LocationIQMap } from '../components/LocationIQMap';
import { SwipeToConfirm } from '../components/SwipeToConfirm';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import type { RiderOrder } from '../types';
import type { AppTab } from '../types';

interface Props {
  activeOrder: RiderOrder | null;
  onComplete: (id: string) => void;
  setActiveTab: (tab: AppTab) => void;
}

export const ActiveDeliveryScreen: React.FC<Props> = ({ activeOrder, onComplete, setActiveTab }) => {
  const [step, setStep] = useState<'PICKUP' | 'DELIVERING' | 'DONE'>('PICKUP');
  const [confirming, setConfirming] = useState(false);
  const [inputOtp, setInputOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  if (!activeOrder) {
    return (
      <div className="min-h-full bg-fleet-950 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-fleet-800 flex items-center justify-center mb-5 border border-fleet-700">
          <Package className="w-10 h-10 text-fleet-600" />
        </div>
        <h2 className="text-lg font-display font-bold text-fleet-100 mb-2">No Active Delivery</h2>
        <p className="text-sm text-fleet-500 mb-6 max-w-xs">
          Go online on the Home screen to receive assigned darkstore orders
        </p>
        <Button variant="primary" onClick={() => setActiveTab('orders')}>
          Back to Queue
        </Button>
      </div>
    );
  }

  const isPrepaid = activeOrder.paymentMethod !== 'COD' && activeOrder.paymentStatus !== 'UNPAID';

  const handleVerifyOtpAndComplete = async () => {
    if (isPrepaid) {
      const targetOtp = activeOrder.otp || '4829';
      if (inputOtp.trim() !== targetOtp) {
        setOtpError('Incorrect OTP. Ask customer for their 4-digit code.');
        return;
      }
    }
    setOtpError('');
    setConfirming(true);
    await onComplete(activeOrder.id);
    setStep('DONE');
    setConfirming(false);
  };

  const steps = [
    { id: 'PICKUP' as const, label: 'Pickup', icon: Package },
    { id: 'DELIVERING' as const, label: 'En Route', icon: Navigation },
    { id: 'DONE' as const, label: 'Delivered', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-full bg-fleet-950 text-fleet-50 pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-fleet-950/95 backdrop-blur-xl border-b border-fleet-800/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveTab('orders')} className="p-2 rounded-xl bg-fleet-800 hover:bg-fleet-700 text-fleet-300 transition cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-fleet-100">Active Delivery</h2>
            <p className="text-[10px] text-fleet-500 font-mono">#{activeOrder.id}</p>
          </div>
          <Badge 
            variant={step === 'DONE' ? 'success' : step === 'DELIVERING' ? 'info' : 'warning'} 
            size="sm" 
            className="ml-auto"
          >
            {step === 'DONE' ? 'Completed' : step === 'DELIVERING' ? 'En Route' : 'Pickup'}
          </Badge>
        </div>
      </div>

      {/* Map */}
      <div className="px-5 mt-4">
        <LocationIQMap
          step={step}
          riderName={activeOrder.customerName}
          destLat={activeOrder.customerLat}
          destLon={activeOrder.customerLon}
          customerName={activeOrder.customerName}
          customerAddress={activeOrder.deliveryAddress}
        />
      </div>

      {/* Progress Steps */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-6">
          {steps.map((s, idx) => {
            const isActive = step === s.id;
            const isPast = steps.findIndex(x => x.id === step) > idx;
            const Icon = s.icon;
            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                    isActive ? 'bg-amber-500 text-fleet-950 shadow-lg shadow-amber-500/20' :
                    isPast ? 'bg-emerald-500 text-white' : 'bg-fleet-800 text-fleet-600'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    'text-[10px] font-bold',
                    isActive ? 'text-amber-400' : isPast ? 'text-emerald-400' : 'text-fleet-600'
                  )}>{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={cn(
                    'flex-1 h-0.5 mx-2 rounded-full',
                    isPast ? 'bg-emerald-500' : 'bg-fleet-800'
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Cards */}
        <div className="space-y-3">
          {/* Pickup Step */}
          <Card className={cn(
            'transition-all border-l-4',
            step === 'PICKUP' ? 'border-l-amber-500 bg-fleet-800' : 'border-l-emerald-500 opacity-60'
          )}>
            <div className="flex items-start gap-3">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                step !== 'PICKUP' ? 'bg-emerald-500' : 'bg-amber-500'
              )}>
                {step !== 'PICKUP' ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Package className="w-4 h-4 text-fleet-950" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-fleet-100">Pickup from Darkstore</p>
                <p className="text-xs text-fleet-400 mt-0.5">{activeOrder.restaurantName}</p>
                <p className="text-[11px] text-fleet-500">{activeOrder.restaurantAddress}</p>

                {step === 'PICKUP' && (
                  <div className="mt-4 space-y-3">
                    <SwipeToConfirm
                      label="Swipe when picked up"
                      confirmLabel="Picked up!"
                      variant="primary"
                      onConfirm={async () => {
                        try {
                          await fetch(`http://localhost:4000/api/orders/${activeOrder.id}/status`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: 'PICKED_UP', riderId: 'rider-001' })
                          });
                        } catch (e) { console.warn(e); }
                        setStep('DELIVERING');
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Delivery Step */}
          <Card className={cn(
            'transition-all border-l-4',
            step === 'DELIVERING' ? 'border-l-blue-500 bg-fleet-800' : 
            step === 'DONE' ? 'border-l-emerald-500 opacity-60' : 'border-l-fleet-700 opacity-40'
          )}>
            <div className="flex items-start gap-3">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                step === 'DONE' ? 'bg-emerald-500' : step === 'DELIVERING' ? 'bg-blue-500' : 'bg-fleet-700'
              )}>
                {step === 'DONE' ? <CheckCircle2 className="w-4 h-4 text-white" /> : <MapPin className="w-4 h-4 text-white" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-fleet-100">Customer Dropoff</p>
                <p className="text-xs text-fleet-400 mt-0.5">{activeOrder.customerName}</p>
                <p className="text-[11px] text-fleet-500">{activeOrder.deliveryAddress}</p>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-base font-display font-bold text-white">₹{activeOrder.finalTotal}</span>
                  <Badge variant={isPrepaid ? 'success' : 'warning'} size="sm">
                    {isPrepaid ? 'Prepaid' : 'Collect Cash'}
                  </Badge>
                </div>

                {step === 'DELIVERING' && (
                  <div className="mt-4 space-y-3">
                    <a
                      href={`tel:${activeOrder.customerPhone}`}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-fleet-800 hover:bg-fleet-700 text-fleet-100 text-sm font-bold rounded-xl border border-fleet-700 transition cursor-pointer"
                    >
                      <Phone className="w-4 h-4 text-emerald-400" /> Call Customer
                    </a>

                    {isPrepaid ? (
                      <div className="p-4 bg-fleet-900 rounded-xl border border-fleet-700 space-y-3">
                        <label className="text-xs font-bold text-fleet-400 block">Enter Customer OTP</label>
                        <input
                          type="text"
                          maxLength={4}
                          value={inputOtp}
                          onChange={(e) => { setInputOtp(e.target.value); setOtpError(''); }}
                          placeholder="4-digit code"
                          className="w-full bg-fleet-800 border border-fleet-700 rounded-xl px-4 py-3 text-center font-mono text-lg font-bold text-white focus:outline-none focus:border-emerald-500 transition"
                        />
                        {otpError && <p className="text-xs font-bold text-rose-400">{otpError}</p>}
                        <SwipeToConfirm
                          label="Swipe to deliver"
                          confirmLabel="Delivered!"
                          disabled={confirming || inputOtp.length < 4}
                          onConfirm={handleVerifyOtpAndComplete}
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 space-y-3">
                        <p className="text-xs font-bold text-amber-400 flex items-center gap-2">
                          <Banknote className="w-4 h-4" /> Collect ₹{activeOrder.finalTotal} cash
                        </p>
                        <SwipeToConfirm
                          label="Swipe when paid & delivered"
                          confirmLabel="Completed!"
                          variant="amber"
                          onConfirm={handleVerifyOtpAndComplete}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Done Celebration */}
          {step === 'DONE' && (
            <div className="animate-scale-in">
              <Card className="bg-emerald-500/10 border-emerald-500/20 text-center py-8">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-display font-bold text-fleet-100 mb-1">Delivery Complete!</h3>
                <p className="text-sm text-fleet-400 mb-5">₹{Math.max(30, Math.round(activeOrder.finalTotal * 0.1))} added to earnings</p>
                <Button variant="primary" onClick={() => setActiveTab('orders')}>
                  Back to Queue
                </Button>
              </Card>
            </div>
          )}

          {/* Payout Card */}
          <Card variant="default" className="flex items-center justify-between">
            <span className="text-xs text-fleet-500 font-medium">Trip Payout</span>
            <div className="text-right">
              <span className="text-lg font-display font-bold text-fleet-100">₹75.00</span>
              <p className="text-[10px] text-fleet-600">Base + Express bonus</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
