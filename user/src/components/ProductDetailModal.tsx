import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, ShieldCheck, Truck, Plus, Minus, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, cart, addToCart, updateQuantity } = useApp();
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);

  if (!selectedProduct) return null;

  const cartItem = cart.find((i) => i.product.id === selectedProduct.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Guarantee at least 3 images for every product
  const productImages: string[] = Array.isArray(selectedProduct.images) && selectedProduct.images.length >= 3
    ? selectedProduct.images
    : [
        selectedProduct.image,
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80'
      ];

  const currentImg = productImages[activeImgIdx] || selectedProduct.image;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-center items-end sm:items-center p-0 sm:p-4 animate-fadeIn font-[Inter,sans-serif]">
      <div className="bg-white w-full max-w-[460px] rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl relative flex flex-col">
        {/* Top Header Actions */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-3 px-4 border-b border-gray-100 flex justify-between items-center">
          <button
            onClick={() => {
              setActiveImgIdx(0);
              setSelectedProduct(null);
            }}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-black text-xs text-slate-500 uppercase tracking-widest">Product Details</span>
          <button
            onClick={() => {
              setActiveImgIdx(0);
              setSelectedProduct(null);
            }}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Attractive Multi-Image Gallery Carousel (3 Images) ── */}
        <div className="relative bg-slate-50 p-4 flex flex-col items-center border-b border-slate-100">
          {/* Main Large Active Image View */}
          <div className="relative w-full h-64 flex items-center justify-center overflow-hidden rounded-2xl bg-white p-2 border border-slate-100 shadow-inner">
            <img
              src={currentImg}
              alt={selectedProduct.name}
              className="max-h-full max-w-full object-contain transition-all duration-300 transform hover:scale-105"
            />

            {/* Discount Badge */}
            {selectedProduct.discountPercentage > 0 && (
              <span className="absolute top-3 left-3 bg-[#006C49] text-white font-black text-[11px] px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                {selectedProduct.discountPercentage}% OFF
              </span>
            )}

            {/* Prev / Next Carousel Arrow Buttons */}
            <button
              onClick={() => setActiveImgIdx((prev) => (prev > 0 ? prev - 1 : productImages.length - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center text-slate-700 hover:bg-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveImgIdx((prev) => (prev + 1) % productImages.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center text-slate-700 hover:bg-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3 Horizontal Thumbnail Selectors */}
          <div className="flex items-center justify-center gap-3 mt-3">
            {productImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIdx(idx)}
                className={`w-14 h-14 rounded-xl border-2 p-1 bg-white overflow-hidden transition-all cursor-pointer ${
                  activeImgIdx === idx
                    ? 'border-[#006C49] ring-2 ring-emerald-200 scale-105 shadow-md'
                    : 'border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Main Details Section */}
        <div className="p-4 space-y-4">
          <div>
            <div className="flex justify-between items-start gap-2">
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-snug">{selectedProduct.name}</h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">{selectedProduct.weight}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-slate-900">₹{selectedProduct.price}</span>
                {selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-xs text-slate-400 line-through block font-medium">
                    MRP ₹{selectedProduct.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Rating badge */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-emerald-50 text-[#006C49] px-2.5 py-0.5 rounded-lg text-xs font-black border border-emerald-200">
                <Star className="w-3.5 h-3.5 fill-[#006C49]" />
                <span>{selectedProduct.rating}</span>
              </div>
              <span className="text-xs text-slate-400 font-semibold">({selectedProduct.reviewsCount} verified ratings)</span>
            </div>
          </div>

          {/* Guaranteed Express Delivery pill */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 flex items-center gap-3 text-xs text-emerald-950">
            <Truck className="w-5 h-5 text-[#006C49] shrink-0" />
            <div>
              <p className="font-extrabold text-slate-900">⚡ Delivery in 8 - 10 Minutes</p>
              <p className="text-[11px] text-slate-600 font-medium">
                Picked fresh from <strong>{selectedProduct.shopName || 'Nearest CartCraze Darkstore'}</strong>
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider mb-1">Description</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{selectedProduct.description}</p>
          </div>

          {/* Product Specifications Table */}
          <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 text-xs border border-slate-100">
            <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px] mb-2">Specifications</h3>
            {selectedProduct.shelfLife && (
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Shelf Life</span>
                <span className="font-bold text-slate-800">{selectedProduct.shelfLife}</span>
              </div>
            )}
            {selectedProduct.origin && (
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500 font-medium">Origin</span>
                <span className="font-bold text-slate-800">{selectedProduct.origin}</span>
              </div>
            )}
            {selectedProduct.storage && (
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Storage</span>
                <span className="font-bold text-slate-800">{selectedProduct.storage}</span>
              </div>
            )}
          </div>

          {/* Quality Guarantee badge */}
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#006C49]" />
            <span>100% Quality &amp; Freshness Guarantee • Easy replacement</span>
          </div>
        </div>

        {/* Bottom Sticky Action Button */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 p-3.5 shadow-lg flex justify-between items-center">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Amount</span>
            <span className="text-lg font-black text-slate-900">
              ₹{quantity > 0 ? selectedProduct.price * quantity : selectedProduct.price}
            </span>
          </div>

          {!selectedProduct.inStock ? (
            <span className="text-xs font-black text-rose-500 bg-rose-50 border border-rose-200 px-5 py-3 rounded-2xl uppercase">
              OUT OF STOCK
            </span>
          ) : quantity > 0 ? (
            <div className="flex items-center bg-[#006C49] text-white rounded-2xl p-1 shadow-md">
              <button
                onClick={() => updateQuantity(selectedProduct.id, -1)}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-black text-xs text-white">
                {quantity} in Cart
              </span>
              <button
                onClick={() => updateQuantity(selectedProduct.id, 1)}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(selectedProduct)}
              data-testid="add_to_cart_main_btn"
              className="bg-[#10B981] hover:bg-emerald-400 text-[#00422B] font-black text-sm py-3 px-6 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Add to Cart</span>
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
