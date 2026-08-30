import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
}

export interface ReadyForPickupProps {
  orderId: string;
  customerName: string;
  deliveryAddress: string;
  placedAt?: string; // ISO timestamp or time string
  items: OrderItem[];
  onMarkReady: () => Promise<void>;
  isInitiallyReady?: boolean;
}

export const ReadyForPickup: React.FC<ReadyForPickupProps> = ({
  orderId,
  customerName,
  deliveryAddress,
  placedAt,
  items,
  onMarkReady,
  isInitiallyReady = false,
}) => {
  const [checked, setChecked] = useState<Set<string>>(
    isInitiallyReady ? new Set(items.map((i) => i.id)) : new Set()
  );
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(isInitiallyReady);
  const [minutesAgo, setMinutesAgo] = useState(2);

  // Live timer for elapsed time calculation
  useEffect(() => {
    const calculateElapsed = () => {
      if (!placedAt) {
        setMinutesAgo(4);
        return;
      }
      const placedDate = new Date(placedAt).getTime();
      if (isNaN(placedDate)) {
        setMinutesAgo(4);
        return;
      }
      const diffMs = Date.now() - placedDate;
      const mins = Math.max(1, Math.floor(diffMs / 60000));
      setMinutesAgo(mins);
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [placedAt]);

  const allChecked = items.length > 0 && checked.size === items.length;

  const toggle = (id: string) => {
    if (confirmed) return;
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = async () => {
    if (!allChecked || confirming) return;
    setConfirming(true);
    try {
      await onMarkReady(); // PATCH /api/orders/:id/status { status: "READY_FOR_PICKUP" }
      setConfirmed(true);
    } catch (err) {
      console.error('Failed to mark ready:', err);
    } finally {
      setConfirming(false);
    }
  };

  // Urgency indicator pill styling based on elapsed time
  const urgencyClass =
    minutesAgo >= 15
      ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
      : minutesAgo >= 10
      ? 'bg-amber-100 text-amber-900 border-amber-300'
      : 'bg-emerald-50 text-emerald-800 border-emerald-200';

  return (
    <div className="bg-white rounded-[20px] shadow-xl p-6 border border-gray-100 space-y-4">
      {/* Header with Order ID & Live Elapsed Time Pill */}
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono text-xs font-bold text-[#728479] tracking-wider uppercase">
          ORDER #{orderId}
        </span>

        {/* Live Elapsed Time Flag */}
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${urgencyClass}`}>
          <Clock className="w-3.5 h-3.5" />
          <span>Placed {minutesAgo} min ago</span>
        </span>
      </div>

      <div>
        <h3 className="font-serif text-xl font-medium text-gray-900 mt-1 mb-0.5">
          {customerName}
        </h3>
        <p className="text-[13px] text-[#728479] leading-snug">{deliveryAddress}</p>
      </div>

      {/* Checklist Gate Items */}
      <div className="border-t border-[#DCE6DF] pt-3.5 divide-y divide-dashed divide-[#DCE6DF]">
        {items.map((item) => {
          const isChecked = checked.has(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggle(item.id)}
              className="flex items-center gap-3 py-2.5 cursor-pointer select-none group transition-colors"
            >
              <div
                className={`w-[22px] h-[22px] rounded-[7px] border-[1.6px] flex items-center justify-center transition-colors shrink-0 ${
                  isChecked
                    ? 'bg-[#00C985] border-[#00C985]'
                    : 'border-[#DCE6DF] group-hover:border-emerald-500'
                }`}
              >
                {isChecked && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#08201A"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </div>
              <span className={`flex-1 text-sm font-medium ${isChecked ? 'text-[#9DB0A4] line-through' : 'text-gray-900'}`}>
                {item.name}
              </span>
              <span className="font-mono text-[11.5px] font-bold text-[#728479]">
                ×{item.qty}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2.5 my-2 font-mono text-[10.5px] uppercase tracking-wide text-[#728479]">
        <span className="font-bold">
          {checked.size} / {items.length} packed
        </span>
        <div className="flex-1 h-[4px] bg-[#DCE6DF] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00C985] rounded-full transition-[width] duration-300"
            style={{ width: `${items.length > 0 ? (checked.size / items.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Checklist Gate Action Button */}
      {!confirmed ? (
        <button
          onClick={handleConfirm}
          disabled={!allChecked || confirming}
          className={`w-full py-[15px] rounded-2xl font-bold text-[15px] transition-all cursor-pointer ${
            allChecked
              ? 'bg-[#00C985] text-[#08201A] shadow-md hover:bg-[#048F63] hover:text-white active:scale-98'
              : 'bg-[#EFF5F0] text-[#9DB0A4] border border-[#DCE6DF] cursor-not-allowed'
          }`}
        >
          {confirming
            ? 'Marking ready…'
            : allChecked
            ? 'Mark ready for pickup'
            : 'Check off all items to continue'}
        </button>
      ) : (
        <div className="flex items-center gap-2.5 px-4 py-3.5 bg-[#EAFBF3] border border-[#BEEBD6] rounded-2xl text-[13.5px] text-[#048F63] font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00C985] animate-pulse" />
          <span>Ready for pickup — waiting for a rider</span>
        </div>
      )}
    </div>
  );
};
