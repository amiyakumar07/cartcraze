import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface FloatingCartBarProps {
  itemCount: IntCount;
  subtotal: number;
  onViewCart: () => void;
}

type IntCount = number;

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  itemCount,
  subtotal,
  onViewCart
}) => {
  if (itemCount <= 0) return null;

  return (
    <div className="fixed bottom-[68px] left-0 right-0 z-40 px-4 max-w-md mx-auto pointer-events-auto">
      <div 
        onClick={onViewCart}
        className="bg-[#131B2E] text-white rounded-2xl p-3 px-4 shadow-xl flex items-center justify-between cursor-pointer hover:bg-[#1a253d] transition-all transform active:scale-[0.99] border border-emerald-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="relative bg-emerald-500 text-white w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-sm">
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#131B2E]">
              {itemCount}
            </span>
          </div>
          <div>
            <div className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">
              {itemCount} {itemCount === 1 ? 'Item' : 'Items'} in Cart
            </div>
            <div className="text-base font-black text-white">
              ₹{subtotal % 1 === 0 ? subtotal : subtotal.toFixed(2)}
            </div>
          </div>
        </div>

        <button 
          onClick={onViewCart}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <span>View Cart</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
