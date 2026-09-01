import React from 'react';
import { Check, Clock, Store, MapPin, PackageCheck, ShieldCheck } from 'lucide-react';

export type DeliveryStepId =
  | 'ASSIGNED'
  | 'GOING_TO_STORE'
  | 'ARRIVED_AT_STORE'
  | 'PICKED_UP'
  | 'GOING_TO_CUSTOMER'
  | 'DELIVERED';

interface DeliveryStepperProps {
  currentStatus: string;
}

const STEPS: { id: DeliveryStepId; label: string; icon: React.ElementType }[] = [
  { id: 'ASSIGNED', label: 'Accepted', icon: Check },
  { id: 'GOING_TO_STORE', label: 'To Store', icon: Store },
  { id: 'ARRIVED_AT_STORE', label: 'At Store', icon: Clock },
  { id: 'PICKED_UP', label: 'Picked Up', icon: PackageCheck },
  { id: 'GOING_TO_CUSTOMER', label: 'En Route', icon: MapPin },
  { id: 'DELIVERED', label: 'Delivered', icon: ShieldCheck }
];

export const DeliveryStepper: React.FC<DeliveryStepperProps> = ({ currentStatus }) => {
  const getStepIndex = (status: string): number => {
    switch (status) {
      case 'ASSIGNED':
        return 0;
      case 'GOING_TO_STORE':
      case 'EN_ROUTE_STORE':
        return 1;
      case 'ARRIVED_AT_STORE':
      case 'AT_STORE':
        return 2;
      case 'PICKED_UP':
        return 3;
      case 'GOING_TO_CUSTOMER':
      case 'EN_ROUTE':
        return 4;
      case 'DELIVERED':
        return 5;
      default:
        return 1;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute left-4 right-4 top-4 h-0.5 bg-slate-800 -z-0" />
        <div
          className="absolute left-4 top-4 h-0.5 bg-emerald-500 transition-all duration-500 -z-0"
          style={{
            width: `${(currentIndex / (STEPS.length - 1)) * 90}%`
          }}
        />

        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center gap-1.5 z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : isCurrent
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20 font-black animate-pulse'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <span
                className={`text-[9px] font-extrabold tracking-tight ${
                  isCurrent ? 'text-amber-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
