import React, { useState } from 'react';
import type { InventoryItem } from '../types';
import { X, Plus, Package, Upload, Link, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

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
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [image, setImage] = useState('');
  const [image2, setImage2] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');

  if (!isOpen) return null;

  const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scale = MAX_WIDTH / img.width;
        if (scale < 1) {
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setImage(dataUrl);
      };
      img.src = evt.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const finalMainImage = image.trim() || DEFAULT_FALLBACK_IMAGE;

    const newProduct: InventoryItem = {
      id: 'inv-' + Date.now(),
      name,
      category,
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price) * 1.3,
      weight: weight || '1 Pack',
      stockCount: Number(stockCount) || 0,
      inStock: Number(stockCount) > 0,
      image: finalMainImage,
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
    setImage2('');
    setUploadFileName('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
            <Package className="w-5 h-5 text-amber-500" />
            <span>Add New Store Product SKU</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Fresh Organic Strawberries (250g)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-medium text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-semibold bg-white text-xs"
              >
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Dairy &amp; Eggs">Dairy &amp; Eggs</option>
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
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-medium text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Store Selling Price (₹) *</label>
              <input
                type="number"
                required
                placeholder="120"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-bold text-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">MRP Price (₹)</label>
              <input
                type="number"
                placeholder="160"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-medium text-xs"
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
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-bold text-emerald-700 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Shelf Location</label>
              <input
                type="text"
                placeholder="Aisle 2 - Bay A"
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-medium text-xs"
              />
            </div>
          </div>

          {/* ── DUAL-MODE PRODUCT IMAGE INPUT (FILE UPLOAD OR URL LINK) ── */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <label className="font-extrabold text-slate-800 block text-xs">Product Image Source *</label>
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    imageInputMode === 'upload' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    imageInputMode === 'url' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Link className="w-3 h-3" />
                  <span>Image URL</span>
                </button>
              </div>
            </div>

            {imageInputMode === 'upload' ? (
              <div className="space-y-2">
                <label className="border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/50 p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-amber-500 mb-1 transition-colors" />
                  <span className="font-bold text-slate-800 text-xs">Click to Upload Product Image</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG, WEBP from your phone/device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {uploadFileName && (
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Uploaded: {uploadFileName}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="Paste direct Image URL (e.g. https://images.unsplash.com/...)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-medium text-xs"
                />
              </div>
            )}

            {/* Live Image Preview Container */}
            {image && (
              <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-2 flex items-center gap-3">
                <img
                  src={image}
                  alt="Product Preview"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                  }}
                  className="w-14 h-14 object-contain bg-white rounded-xl border border-slate-200 shadow-2xs"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-extrabold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Image Ready for Listing</span>
                  </span>
                  <p className="text-[10px] text-slate-400 truncate font-mono">{image.substring(0, 40)}...</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setImage(''); setUploadFileName(''); }}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-3 bg-[#fdee24] hover:bg-yellow-400 text-black font-black text-sm py-3.5 rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-black stroke-[3]" />
            <span>Publish Product to Store Inventory</span>
          </button>
        </form>
      </div>
    </div>
  );
};
