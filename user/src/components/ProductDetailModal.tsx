import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, ShieldCheck, Truck, Plus, Minus, ArrowLeft } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, cart, addToCart, updateQuantity } = useApp();

  if (!selectedProduct) return null;

  const cartItem = cart.find((i) => i.product.id === selectedProduct.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-end sm:items-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-[440px] rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl relative flex flex-col">
        {/* Top Header Actions */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md p-3 border-b border-gray-100 flex justify-between items-center">
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-xs text-gray-500 uppercase tracking-wider">Product Details</span>
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Image Section */}
        <div className="relative bg-gray-50 p-6 flex justify-center items-center h-64 border-b border-gray-100">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="max-h-full object-contain drop-shadow-md"
          />
          {selectedProduct.discountPercentage > 0 && (
            <span className="absolute top-4 left-4 bg-pink-500 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-xs">
              SAVE {selectedProduct.discountPercentage}%
            </span>
          )}
        </div>

        {/* Main Details */}
        <div className="p-4 space-y-4">
          <div>
            <div className="flex justify-between items-start gap-2">
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-snug">{selectedProduct.name}</h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{selectedProduct.weight}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-gray-900">₹{selectedProduct.price}</span>
                {selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-xs text-gray-400 line-through block">
                    MRP ₹{selectedProduct.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Rating badge */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-md text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-green-600" />
                <span>{selectedProduct.rating}</span>
              </div>
              <span className="text-xs text-gray-400">({selectedProduct.reviewsCount} verified reviews)</span>
            </div>
          </div>

          {/* Guaranteed Express Delivery pill */}
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-2.5 flex items-center gap-3 text-xs text-amber-900">
            <Truck className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-bold">Guaranteed Delivery in 9 Minutes</p>
              <p className="text-[11px] text-amber-700">
                Picked fresh from <strong>{selectedProduct.shopName || 'Nearest CartCraze Darkstore'}</strong> (5km Coverage)
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wider mb-1">Description</h3>
            <p className="text-xs text-gray-600 leading-relaxed">{selectedProduct.description}</p>
          </div>

          {/* Product Specifications Table */}
          <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-xs">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-2">Specifications</h3>
            {selectedProduct.shelfLife && (
              <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                <span className="text-gray-500">Shelf Life</span>
                <span className="font-semibold text-gray-800">{selectedProduct.shelfLife}</span>
              </div>
            )}
            {selectedProduct.origin && (
              <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                <span className="text-gray-500">Origin</span>
                <span className="font-semibold text-gray-800">{selectedProduct.origin}</span>
              </div>
            )}
            {selectedProduct.storage && (
              <div className="flex justify-between">
                <span className="text-gray-500">Storage</span>
                <span className="font-semibold text-gray-800">{selectedProduct.storage}</span>
              </div>
            )}
          </div>

          {/* Nutrition Info if available */}
          {selectedProduct.nutrition && (
            <div>
              <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wider mb-2">Nutritional Values (per 100g)</h3>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-emerald-50 rounded-xl p-2">
                  <span className="block text-[10px] text-emerald-600 font-medium">Calories</span>
                  <span className="font-bold text-emerald-900">{selectedProduct.nutrition.calories}</span>
                </div>
                <div className="bg-blue-50 rounded-xl p-2">
                  <span className="block text-[10px] text-blue-600 font-medium">Carbs</span>
                  <span className="font-bold text-blue-900">{selectedProduct.nutrition.carbs}</span>
                </div>
                <div className="bg-purple-50 rounded-xl p-2">
                  <span className="block text-[10px] text-purple-600 font-medium">Protein</span>
                  <span className="font-bold text-purple-900">{selectedProduct.nutrition.protein}</span>
                </div>
                <div className="bg-amber-50 rounded-xl p-2">
                  <span className="block text-[10px] text-amber-600 font-medium">Fat</span>
                  <span className="font-bold text-amber-900">{selectedProduct.nutrition.fat}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quality Guarantee badge */}
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Quality Guarantee • Easy replacement if not satisfied</span>
          </div>
        </div>

        {/* Bottom Sticky Action Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-3 shadow-lg flex justify-between items-center">
          <div>
            <span className="text-[10px] text-gray-400 block">Total Price</span>
            <span className="text-lg font-black text-gray-900">
              ₹{quantity > 0 ? selectedProduct.price * quantity : selectedProduct.price}
            </span>
          </div>

          {!selectedProduct.inStock ? (
            <span className="text-xs font-black text-red-500 bg-red-50 border border-red-200 px-5 py-3 rounded-xl uppercase">
              OUT OF STOCK
            </span>
          ) : quantity > 0 ? (
            <div className="flex items-center bg-gray-900 text-white rounded-xl p-1 shadow-md">
              <button
                onClick={() => updateQuantity(selectedProduct.id, -1)}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-black text-sm text-yellow-300">
                {quantity} in Basket
              </span>
              <button
                onClick={() => updateQuantity(selectedProduct.id, 1)}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(selectedProduct)}
              className="bg-[#fdee24] hover:bg-yellow-400 text-black font-extrabold text-sm py-3 px-6 rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <span>Add to Basket</span>
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
