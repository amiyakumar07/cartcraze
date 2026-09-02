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
      className="bg-white border border-[#e8e8e8] rounded-[16px] overflow-hidden card-lift cursor-pointer relative flex flex-col justify-between h-[280px] w-full shadow-2xs"
      style={{ minWidth: 0 }}
    >
      {/* ── Flash Sale Badge or Discount Badge ── */}
      {isFlashActive ? (
        <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-[5px] leading-none tracking-tight animate-pulse flex items-center gap-0.5">
          🔥 ₹10 SALE
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

      {/* ── Product Image Container (Fixed Height) ── */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="bg-slate-50 flex items-center justify-center h-[125px] w-full overflow-hidden relative shrink-0 group/img"
      >
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80';
          }}
          className="h-[105px] w-full object-contain p-2 group-hover/img:scale-110 transition-transform duration-500 drop-shadow-xs"
          loading="lazy"
        />
        {Array.isArray(product.images) && product.images.length > 1 && (
          <span className="absolute bottom-1.5 right-1.5 text-[9px] font-black bg-slate-900/80 text-white px-1.5 py-0.5 rounded-md backdrop-blur-xs opacity-80 group-hover/img:opacity-100 transition-opacity">
            {product.images.length} Photos 📷
          </span>
        )}
      </div>

      {/* ── Horizontal divider ── */}
      <div className="h-px bg-[#f0f0f0] mx-0 shrink-0" />

      {/* ── Product Info (Fixed Flex Section) ── */}
      <div className="p-2.5 flex flex-col justify-between flex-1 min-h-0">
        {/* Weight / Pack size & Buy 2 offer badge */}
        <div className="flex justify-between items-center h-[20px] shrink-0 text-[10px]">
          <span className="bg-gray-100 text-gray-700 font-extrabold px-1.5 py-0.5 rounded-md border border-gray-200 truncate max-w-[70px]">
            {product.weight || '500 g'}
          </span>
          {product.hasBuy2Offer !== false && (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-2xs shrink-0">
              🏷️ 2+ = 5% OFF
            </span>
          )}
        </div>

        {/* Name (Fixed 2-Line Height) */}
        <div className="h-[36px] flex items-center my-1 shrink-0">
          <h4
            onClick={() => setSelectedProduct(product)}
            className="text-[12.5px] font-bold text-[#1d1d1d] leading-[1.3] line-clamp-2 cursor-pointer hover:text-[#0c831f] transition-colors"
          >
            {product.name}
          </h4>
        </div>

        {/* ── Price Row + ADD Button (Fixed Bottom Row) ── */}
        <div className="flex items-center justify-between h-[32px] shrink-0 mt-auto">
          {/* Pricing */}
          <div className="flex flex-col justify-center">
            {isFlashActive ? (
              <>
                <span className="text-[13.5px] font-black text-red-600 leading-none flex items-center gap-1">
                  ₹10
                  <span className="text-[8.5px] bg-red-100 text-red-700 px-1 py-0.2 rounded font-extrabold">DEAL</span>
                </span>
                <span className="text-[10.5px] text-[#c2c2c2] line-through leading-tight mt-0.5">
                  ₹{product.price}
                </span>
              </>
            ) : (
              <>
                <span className="text-[13.5px] font-black text-[#1d1d1d] leading-none">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-[10.5px] text-[#c2c2c2] line-through leading-tight mt-0.5">
                    ₹{product.originalPrice}
                  </span>
                )}
              </>
            )}
          </div>

          {/* ADD / Stepper */}
          {!product.inStock ? (
            <span className="text-[9.5px] font-black text-red-500 bg-red-50 border border-red-200 px-1.5 py-1 rounded-[8px] uppercase">
              Out of Stock
            </span>
          ) : quantity > 0 ? (
            /* Stepper — Eco-Emerald style */
            <div className="flex items-center bg-[#006C49] text-white rounded-[10px] overflow-hidden h-[30px]">
              <button
                onClick={() => updateQuantity(product.id, -1)}
                className="w-7 h-full flex items-center justify-center hover:bg-[#005237] transition-colors"
                aria-label="Decrease"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-5 text-center font-black text-[12px]">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, 1)}
                className="w-7 h-full flex items-center justify-center hover:bg-[#005237] transition-colors"
                aria-label="Increase"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            /* ADD Button — Eco-Emerald green */
            <button
              onClick={handleAdd}
              className={`flex items-center gap-1 text-[#006C49] border-2 border-[#006C49] bg-white font-black text-[12.5px] py-1 px-2.5 rounded-[10px] transition-all active:scale-95 btn-ripple hover:bg-[#006C49] hover:text-white ${
                adding ? 'scale-95 opacity-80' : ''
              }`}
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="w-3 h-3" />
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
