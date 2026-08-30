import React, { useState } from 'react';
import type { InventoryItem } from '../types';
import { Plus, Search } from 'lucide-react';

interface InventoryViewProps {
  inventory: InventoryItem[];
  onToggleInStock: (id: string) => void;
  onUpdateStockCount: (id: string, delta: number) => void;
  onOpenAddModal: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  onToggleInStock,
  onUpdateStockCount,
  onOpenAddModal
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.barcode.includes(search);
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['All', 'Fruits', 'Vegetables', 'Dairy & Eggs', 'Bakery', 'Snacks'];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Action Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Darkstore Inventory &amp; Stock Manager</h2>
          <p className="text-xs text-slate-500 font-medium">{inventory.length} SKUs registered in Darkstore #14</p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="bg-[#fdee24] hover:bg-yellow-400 text-black font-black text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-black stroke-[3]" />
          <span>Add New Product SKU</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Product Title or Barcode..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-yellow-400 outline-none"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table / Empty State */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredInventory.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
              📦
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">No Inventory Products Added Yet</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Your store catalog is currently empty. Click "+ Add New Product SKU" above to upload your store catalog with multi-image support, stock counts, shelf locations, and barcodes.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-2 bg-[#fdee24] hover:bg-yellow-400 text-black font-black text-xs px-5 py-2.5 rounded-2xl shadow-md inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-black stroke-[3]" />
              <span>Add Your First Product</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Product SKU</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Store Price</th>
                  <th className="p-3.5">Shelf Location</th>
                  <th className="p-3.5 text-center">In Stock Status</th>
                  <th className="p-3.5 text-center">Stock Units</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-contain rounded-xl bg-slate-50 p-1 border border-slate-100 flex-shrink-0"
                      />
                      <div>
                        <span className="font-extrabold text-slate-900 block text-xs leading-snug">{item.name}</span>
                        <span className="text-[10px] text-slate-400">{item.weight} • Barcode: {item.barcode}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-bold text-slate-700">
                    {item.category}
                  </td>

                  <td className="p-3.5">
                    <span className="font-extrabold text-slate-900">₹{item.price}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-[10px] text-slate-400 line-through block">₹{item.originalPrice}</span>
                    )}
                  </td>

                  <td className="p-3.5 font-semibold text-slate-600">
                    <span className="bg-slate-100 px-2 py-1 rounded-md text-[11px] border border-slate-200">
                      {item.shelfLocation}
                    </span>
                  </td>

                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => onToggleInStock(item.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all border ${
                        item.inStock
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {item.inStock ? '● IN STOCK' : 'OUT OF STOCK'}
                    </button>
                  </td>

                  <td className="p-3.5 text-center">
                    <div className="inline-flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                      <button
                        onClick={() => onUpdateStockCount(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-200 rounded-lg font-black"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-extrabold text-xs text-slate-900">
                        {item.stockCount}
                      </span>
                      <button
                        onClick={() => onUpdateStockCount(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-slate-200 rounded-lg font-black"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
};
