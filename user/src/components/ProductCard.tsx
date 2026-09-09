import React, { useState } from 'react';
import type { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Plus, Minus, Star, Clock } from 'lucide-react';
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
    <div className="bg-white border border-gray-100 rounded-2xl p-2.5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative group">
      {/* Discount/Flash Badge */}
      {isFlashActive ? (
        <div className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md z-10 animate-pulse">
          ₹1 SALE
        </div>
      ) : product.discountPercentage > 0 ? (
        <div className="absolute top-2.5 right-2.5 bg-pink-50 text-pink-600 text-[10px] font-black px-1.5 py-0.5 rounded-md z-10">
          -{product.discountPercentage}%
        </div>
      ) : null}

      {/* Image Preview & Click to open Detail Modal */}
      <div 
        onClick={() => setSelectedProduct(product)}
        className="h-28 w-full flex items-center justify-center p-1 cursor-pointer overflow-hidden relative rounded-xl bg-gray-50/60 group-hover:bg-gray-50 transition-colors"
      >
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute bottom-1 left-1.5 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-gray-700 shadow-2xs">
          <Clock className="w-2.5 h-2.5 text-amber-500" />
          <span>{product.deliveryTimeMinutes}m</span>
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-0.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-2.5 h-2.5 fill-amber-400" />
            </div>
            <span className="font-bold text-gray-700">{product.rating}</span>
            <span>({product.reviewsCount})</span>
          </div>

          <h4 
            onClick={() => setSelectedProduct(product)}
            className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2 cursor-pointer hover:text-amber-600 transition-colors mb-0.5"
          >
            {product.name}
          </h4>
          <p className="text-[11px] text-gray-500 mb-2">{product.weight}</p>
        </div>

        {/* Pricing & Add/Stepper Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-50 mt-auto">
          <div>
            <span className="font-extrabold text-sm text-gray-900">₹{isFlashActive ? 1 : product.price}</span>
            {(!isFlashActive && product.originalPrice > product.price) || (isFlashActive) ? (
              <span className="text-[10px] text-gray-400 line-through ml-1">
                ₹{product.price}
              </span>
            ) : null}
          </div>

          {/* Stepper or Add Button */}
          {!product.inStock ? (
            <span className="text-[10px] font-black text-red-500 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-lg uppercase">
              OUT OF STOCK
            </span>
          ) : quantity > 0 ? (
            <div className="flex items-center bg-gray-900 text-white rounded-lg p-0.5 shadow-xs">
              <button
                onClick={() => updateQuantity(product.id, -1)}
                className="w-6 h-6 flex items-center justify-center text-white hover:bg-gray-800 rounded-md transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-5 text-center font-bold text-xs text-yellow-300">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(product.id, 1)}
                className="w-6 h-6 flex items-center justify-center text-white hover:bg-gray-800 rounded-md transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="bg-[#fdee24] hover:bg-yellow-400 text-black font-extrabold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all active:scale-95 shadow-2xs"
            >
              <span>ADD</span>
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
