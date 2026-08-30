import React, { useState } from 'react';
import type { InventoryItem } from '../types';
import { X, Plus, Package } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: InventoryItem) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Fruits');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [stockCount, setStockCount] = useState('25');
  const [shelfLocation, setShelfLocation] = useState('Aisle 1');
  const [image, setImage] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const newProduct: InventoryItem = {
      id: 'inv-' + Date.now(),
      name,
      category,
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price) * 1.3,
      weight: weight || '1 Pack',
      stockCount: Number(stockCount) || 0,
      inStock: Number(stockCount) > 0,
      image: image || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=300&q=80',
      barcode: '890' + Math.floor(10000000 + Math.random() * 90000000),
      shelfLocation: shelfLocation || 'General Storage'
    };

    onAddProduct(newProduct);
    onClose();

    // Reset form
    setName('');
    setPrice('');
    setOriginalPrice('');
    setWeight('');
    setImage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100 relative">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
            <Package className="w-5 h-5 text-amber-500" />
            <span>Add New Inventory Product</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Product Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Fresh Organic Bananas"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-semibold bg-white"
              >
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Dairy & Eggs">Dairy & Eggs</option>
                <option value="Bakery">Bakery</option>
                <option value="Snacks">Snacks</option>
                <option value="Beverages">Beverages</option>
                <option value="Pantry">Pantry</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Weight / Unit</label>
              <input
                type="text"
                placeholder="e.g. 500g Pack"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Store Selling Price (₹)</label>
              <input
                type="number"
                required
                placeholder="120"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">MRP Price (₹)</label>
              <input
                type="number"
                placeholder="160"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Initial Stock Count</label>
              <input
                type="number"
                value={stockCount}
                onChange={(e) => setStockCount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Shelf Location</label>
              <input
                type="text"
                placeholder="Aisle 2 - Bay A"
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Product Images (2 to 3 URLs) *</label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Image 1 (Main Cover URL)"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-medium text-xs"
              />
              <input
                type="text"
                placeholder="Image 2 (Angle View URL)"
                value={image2}
                onChange={(e) => setImage2(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-medium text-xs"
              />
              <input
                type="text"
                placeholder="Image 3 (Nutrition / Details URL)"
                value={image3}
                onChange={(e) => setImage3(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-medium text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#fdee24] hover:bg-yellow-400 text-black font-black text-sm py-3 rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-black stroke-[3]" />
            <span>Add Product to Store Inventory</span>
          </button>
        </form>
      </div>
    </div>
  );
};
