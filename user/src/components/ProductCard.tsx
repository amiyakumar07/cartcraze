import React, { useState } from 'react';
import type { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Plus, Minus, Clock } from 'lucide-react';
import { getFlashSaleStatus } from '../utils/flashSale';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateQuantity, setSelectedProduct } = useApp();
  const [adding, setAdding] = useState(false);

  const flashStatus = getFlashSaleStatus();
  const isFlashActive = flashStatus.isActiveNow && !flashStatus.isQuotaExhausted;

  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 300);
  };

  return (
    <div
      className="bg-white border border-[#e8e8e8] rounded-[16px] overflow-hidden card-lift cursor-pointer relative flex flex-col"
      style={{ minWidth: 0 }}
    >
      {/* ── Flash Sale Badge or Discount Badge ── */}
      {isFlashActive ? (
        <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-[5px] leading-none tracking-tight animate-pulse flex items-center gap-0.5">
          🔥 ₹1 SALE
        </span>
      ) : product.discountPercentage > 0 ? (
        <span className="absolute top-2 left-2 z-10 bg-[#256fef] text-white text-[10px] font-black px-1.5 py-0.5 rounded-[5px] leading-none tracking-tight">
          {product.discountPercentage}% OFF
        </span>
      ) : null}

      {/* ── Delivery Time Badge ── */}
      <span className="absolute top-2 right-2 z-10 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm border border-gray-100 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded-[5px] shadow-sm">
        <Clock className="w-2.5 h-2.5 text-[#0c831f]" />
        {product.deliveryTimeMinutes}m
      </span>

      {/* ── Product Image ── */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="bg-[#f8f9fb] flex items-center justify-center h-[120px] w-full overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80';
          }}
          className="h-[100px] w-full object-contain p-1 hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* ── Horizontal divider ── */}
      <div className="h-px bg-[#f0f0f0] mx-0" />

      {/* ── Product Info ── */}
      <div className="p-2.5 flex flex-col flex-1">
        {/* Weight / Pack size & Buy 2 offer badge */}
        <div className="flex justify-between items-center mb-1 text-[10px]">
          <span className="bg-gray-100 text-gray-700 font-extrabold px-1.5 py-0.5 rounded-md border border-gray-200">
            {product.weight || '500 g'}
          </span>
          {product.hasBuy2Offer !== false && (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-2xs">
              🏷️ 2+ = 5% OFF
            </span>
          )}
        </div>

        {/* Name */}
        <h4
          onClick={() => setSelectedProduct(product)}
          className="text-[13px] font-bold text-[#1d1d1d] leading-[1.3] line-clamp-2 mb-2 cursor-pointer hover:text-[#0c831f] transition-colors"
        >
          {product.name}
        </h4>

        {/* ── Price Row + ADD Button ── */}
        <div className="flex items-center justify-between mt-auto">
          {/* Pricing */}
          <div className="flex flex-col">
            {isFlashActive ? (
              <>
                <span className="text-[14px] font-black text-red-600 leading-none flex items-center gap-1">
                  ₹1
                  <span className="text-[9px] bg-red-100 text-red-700 px-1 py-0.2 rounded font-extrabold">9-10 PM</span>
                </span>
                <span className="text-[11px] text-[#c2c2c2] line-through leading-tight mt-0.5">
                  ₹{product.price}
                </span>
              </>
            ) : (
              <>
                <span className="text-[14px] font-black text-[#1d1d1d] leading-none">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-[11px] text-[#c2c2c2] line-through leading-tight mt-0.5">
                    ₹{product.originalPrice}
                  </span>
                )}
              </>
            )}
          </div>

          {/* ADD / Stepper */}
          {!product.inStock ? (
            <span className="text-[10px] font-black text-red-500 bg-red-50 border border-red-200 px-2 py-1 rounded-[8px] uppercase">
              Out of Stock
            </span>
          ) : quantity > 0 ? (
            /* Stepper — Blinkit green style */
            <div className="flex items-center bg-[#0c831f] text-white rounded-[10px] overflow-hidden h-[32px]">
              <button
                onClick={() => updateQuantity(product.id, -1)}
                className="w-8 h-full flex items-center justify-center hover:bg-[#0a7019] transition-colors"
                aria-label="Decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-black text-[13px]">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, 1)}
                className="w-8 h-full flex items-center justify-center hover:bg-[#0a7019] transition-colors"
                aria-label="Increase"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* ADD Button — Blinkit green */
            <button
              onClick={handleAdd}
              className={`flex items-center gap-1 text-[#0c831f] border-2 border-[#0c831f] bg-white font-black text-[13px] py-1.5 px-3 rounded-[10px] transition-all active:scale-95 btn-ripple hover:bg-[#0c831f] hover:text-white ${
                adding ? 'scale-95 opacity-80' : ''
              }`}
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
