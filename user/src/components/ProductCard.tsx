import React, { useState } from 'react';
import type { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Plus, Minus, Zap, Camera } from 'lucide-react';
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

  const imagesCount = Array.isArray(product.images) ? product.images.length : 1;

  return (
    <div
      className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-[#006C49]/40 hover:shadow-xl figma-spring figma-shimmer-card cursor-pointer relative flex flex-col justify-between h-[285px] w-full group shadow-2xs"
      style={{ minWidth: 0 }}
    >
      {/* ── Top Left: Discount / Flash Sale Badge ── */}
      {isFlashActive ? (
        <span className="absolute top-2 left-2 z-10 bg-rose-600 text-white text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-md animate-pulse flex items-center gap-1 uppercase tracking-wider">
          🔥 ₹10 SALE
        </span>
      ) : product.discountPercentage > 0 ? (
        <span className="absolute top-2 left-2 z-10 bg-[#006C49] text-white text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-xs tracking-wider uppercase">
          {product.discountPercentage}% OFF
        </span>
      ) : null}

      {/* ── Top Right: 8-10 Mins Delivery Speed Badge with Figma Beacon Ring ── */}
      <span className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-md border border-slate-200/80 text-slate-800 text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-2xs figma-beacon">
        <Zap className="w-2.5 h-2.5 text-[#006C49] fill-[#006C49] animate-bounce" />
        {product.deliveryTimeMinutes || 9}m
      </span>

      {/* ── Product Image Container ── */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="bg-gradient-to-b from-slate-50 via-slate-50/60 to-white flex items-center justify-center h-[130px] w-full overflow-hidden relative shrink-0"
      >
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80';
          }}
          className="h-[110px] w-full object-contain p-2.5 group-hover:scale-108 transition-transform duration-500 ease-out drop-shadow-sm"
          loading="lazy"
        />

        {/* Multi-Photo Gallery Indicator Pill */}
        {imagesCount > 1 && (
          <span className="absolute bottom-2 right-2 text-[9px] font-black bg-slate-900/80 text-white px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-sm opacity-85 group-hover:opacity-100 transition-opacity">
            <Camera className="w-2.5 h-2.5" />
            {imagesCount}
          </span>
        )}
      </div>

      {/* ── Horizontal Hairline Divider ── */}
      <div className="h-px bg-slate-100 mx-0 shrink-0" />

      {/* ── Product Info Section ── */}
      <div className="p-3 flex flex-col justify-between flex-1 min-h-0 bg-white">
        {/* Weight & Offer Row */}
        <div className="flex justify-between items-center h-[20px] shrink-0 text-[10px]">
          <span className="bg-slate-100 text-slate-700 font-black px-2 py-0.5 rounded-md border border-slate-200/60 truncate max-w-[80px]">
            {product.weight || '500 g'}
          </span>
          {product.hasBuy2Offer !== false && (
            <span className="bg-emerald-50 text-[#006C49] border border-emerald-200/80 text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0">
              🏷️ 2+ = 5% OFF
            </span>
          )}
        </div>

        {/* Product Title (2-line truncated) */}
        <div className="h-[36px] flex items-center my-1 shrink-0">
          <h4
            onClick={() => setSelectedProduct(product)}
            className="text-[12.5px] font-black text-slate-900 leading-[1.3] line-clamp-2 cursor-pointer group-hover:text-[#006C49] transition-colors"
          >
            {product.name}
          </h4>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between h-[34px] shrink-0 mt-auto pt-1">
          {/* Price Container */}
          <div className="flex flex-col justify-center">
            {isFlashActive ? (
              <>
                <span className="text-sm font-black text-rose-600 leading-none flex items-center gap-1">
                  ₹10
                  <span className="text-[8px] bg-rose-100 text-rose-700 px-1 py-0.2 rounded font-black">DEAL</span>
                </span>
                <span className="text-[10px] text-slate-400 line-through leading-tight mt-0.5 font-medium">
                  MRP ₹{product.price}
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-black text-slate-900 leading-none">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-[10px] text-slate-400 line-through leading-tight mt-0.5 font-medium">
                    MRP ₹{product.originalPrice}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Action Button (ADD or Stepper) */}
          {!product.inStock ? (
            <span className="text-[9px] font-black text-rose-500 bg-rose-50 border border-rose-200 px-2 py-1 rounded-xl uppercase tracking-wider">
              OUT OF STOCK
            </span>
          ) : quantity > 0 ? (
            /* Quantity Stepper Pill */
            <div className="flex items-center bg-[#006C49] text-white rounded-xl overflow-hidden h-[32px] shadow-sm">
              <button
                onClick={() => updateQuantity(product.id, -1)}
                className="w-7 h-full flex items-center justify-center hover:bg-emerald-800 transition-colors cursor-pointer"
                aria-label="Decrease"
              >
                <Minus className="w-3 h-3 stroke-[3]" />
              </button>
              <span className="w-5 text-center font-black text-xs">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, 1)}
                className="w-7 h-full flex items-center justify-center hover:bg-emerald-800 transition-colors cursor-pointer"
                aria-label="Increase"
              >
                <Plus className="w-3 h-3 stroke-[3]" />
              </button>
            </div>
          ) : (
            /* Modern ADD Button */
            <button
              onClick={handleAdd}
              className={`flex items-center gap-1.5 border-2 border-[#006C49] text-[#006C49] bg-white font-black text-xs py-1 px-3.5 rounded-xl transition-all active:scale-95 hover:bg-[#006C49] hover:text-white shadow-2xs uppercase tracking-wider ${
                adding ? 'scale-95 opacity-80' : ''
              }`}
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
