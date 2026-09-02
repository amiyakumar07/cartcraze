import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { HeroBanner } from '../components/HeroBanner';
import { ArrowRight, Zap, Clock } from 'lucide-react';

/* ── Category emoji/icon fallbacks ── */
const CAT_EMOJIS: Record<string, string> = {
  fruits: '🍎',
  vegetables: '🥦',
  dairy: '🥛',
  bakery: '🥐',
  snacks: '🍿',
  beverages: '🧃',
  pantry: '🌾',
  meat: '🍗',
};

export const HomeScreen: React.FC = () => {
  const {
    setActiveCategory,
    setActiveTab,
    searchQuery,
    setSubCategoryFilter,
    products
  } = useApp();

  /* ── Flash Deals Countdown ── */
  const [dealTimeLeft, setDealTimeLeft] = useState(7450);
  useEffect(() => {
    const t = setInterval(() => setDealTimeLeft((p) => (p > 0 ? p - 1 : 7200)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(dealTimeLeft / 3600);
  const m = Math.floor((dealTimeLeft % 3600) / 60);
  const s = dealTimeLeft % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  /* ── Product Slices ── */
  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const flashDeals = products.filter((p) => p.discountPercentage >= 28).slice(0, 6);
  const trendingProducts = products.slice(0, 8);
  const dairyProducts = products.filter((p) => p.category === 'dairy').slice(0, 4);
  const freshVeg = products.filter((p) => p.category === 'vegetables').slice(0, 4);

  /* ────────────────────────────────────────── */
  return (
    <div className="bg-[#f1f2f6] min-h-full pb-24 font-[Inter,sans-serif] animate-fadeIn">

      {/* ════════ SEARCH RESULTS ════════ */}
      {searchQuery ? (
        <div className="bg-white p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-gray-900">
              Results for <span className="text-[#0c831f]">"{searchQuery}"</span>
            </h3>
            <span className="text-xs text-gray-400 font-medium">{filteredProducts.length} items</span>
          </div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-bold text-gray-800 text-sm mb-1">No results for "{searchQuery}"</p>
              <p className="text-xs text-gray-500">Try "Apples", "Milk", "Bread" or "Avocado"</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* ════════ CATEGORIES STRIP ════════ */}
          <div className="bg-white pt-3 pb-3 mb-2">
            <div className="flex justify-between items-center px-4 mb-2.5">
              <h2 className="text-[13px] font-black text-gray-900 uppercase tracking-wide">Shop by Category</h2>
              <button
                onClick={() => setActiveTab('categories')}
                className="flex items-center gap-0.5 text-[11px] font-bold text-[#0c831f] hover:underline cursor-pointer"
              >
                See All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Horizontal pill-style category scroll — exactly like Blinkit */}
            <div className="flex gap-0 overflow-x-auto no-scrollbar px-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSubCategoryFilter('All');
                    setActiveTab('category_detail');
                  }}
                  className="flex flex-col items-center gap-1.5 min-w-[74px] max-w-[74px] focus:outline-none cursor-pointer group px-1"
                >
                  <div className="w-[56px] h-[56px] rounded-[16px] overflow-hidden bg-[#f8f9fb] border border-[#ebebeb] group-hover:border-[#0c831f] group-hover:shadow-md transition-all duration-200 relative">
                    <img
                      src={cat.iconImage}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-0">
                      {CAT_EMOJIS[cat.id]}
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-700 group-hover:text-[#0c831f] text-center leading-tight w-full truncate transition-colors">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ════════ HERO BANNERS ════════ */}
          <div className="bg-white py-3 px-3 mb-2">
            <HeroBanner />
          </div>

          {/* ════════ FLASH DEALS SECTION ════════ */}
          <div className="bg-white mb-2">
            {/* Section header */}
            <div className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-[#f5f5f5]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-red-500 rounded-lg animate-pulse">
                  <Zap className="w-3.5 h-3.5 fill-white text-white" />
                </div>
                <div>
                  <h2 className="text-[14px] font-black text-gray-900 leading-none">⚡ Flash Deals</h2>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Up to 36% off • Limited stock</p>
                </div>
              </div>
              {/* Countdown */}
              <div className="flex items-center gap-1 bg-[#111] text-white text-[11px] font-black px-2.5 py-1.5 rounded-xl font-mono">
                <Clock className="w-3 h-3 text-yellow-400 shrink-0" />
                <span>{pad(h)}:{pad(m)}:{pad(s)}</span>
              </div>
            </div>

            {/* Horizontal scroll row like Blinkit */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar p-3">
              {flashDeals.map((p) => (
                <div key={p.id} className="min-w-[145px] max-w-[145px]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>

          {/* ════════ PROMOTIONAL STRIP — 2 banners ════════ */}
          <div className="px-3 mb-2 grid grid-cols-2 gap-2">
            {/* Fresh Fruits promo */}
            <div
              onClick={() => { setActiveCategory('fruits'); setSubCategoryFilter('All'); setActiveTab('category_detail'); }}
              className="rounded-[16px] overflow-hidden h-[90px] relative cursor-pointer card-lift"
              style={{ background: 'linear-gradient(135deg,#065f46,#047857)' }}
            >
              <div className="absolute inset-0 p-3 flex flex-col justify-center z-10">
                <span className="text-[9px] font-black text-emerald-300 uppercase tracking-widest mb-0.5">Fresh Produce</span>
                <p className="text-white font-black text-[13px] leading-tight">Fruits &<br/>Veggies</p>
                <span className="text-[10px] text-emerald-200 font-semibold mt-1">Up to 40% OFF →</span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=200&q=70"
                alt="Fruits"
                className="absolute right-[-8px] bottom-[-8px] w-20 h-20 object-cover rounded-full opacity-40"
              />
            </div>

            {/* Dairy promo */}
            <div
              onClick={() => { setActiveCategory('dairy'); setSubCategoryFilter('All'); setActiveTab('category_detail'); }}
              className="rounded-[16px] overflow-hidden h-[90px] relative cursor-pointer card-lift"
              style={{ background: 'linear-gradient(135deg,#7c2d12,#b45309)' }}
            >
              <div className="absolute inset-0 p-3 flex flex-col justify-center z-10">
                <span className="text-[9px] font-black text-amber-300 uppercase tracking-widest mb-0.5">Daily Fresh</span>
                <p className="text-white font-black text-[13px] leading-tight">Milk &<br/>Dairy</p>
                <span className="text-[10px] text-amber-200 font-semibold mt-1">Daily Delivery →</span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=200&q=70"
                alt="Dairy"
                className="absolute right-[-8px] bottom-[-8px] w-20 h-20 object-cover rounded-full opacity-40"
              />
            </div>
          </div>

          {/* ════════ TRENDING NOW ════════ */}
          <div className="bg-white mb-2">
            <div className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-[#f5f5f5]">
              <div>
                <h2 className="text-[14px] font-black text-gray-900 leading-none">🔥 Trending Now</h2>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Most ordered this week</p>
              </div>
              <button
                onClick={() => setActiveTab('categories')}
                className="text-[11px] font-bold text-[#0c831f] flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* 2-column grid inside white card */}
            <div className="grid grid-cols-2 gap-3 p-3">
              {trendingProducts.slice(0, 6).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* ════════ DAIRY ESSENTIALS ════════ */}
          {dairyProducts.length > 0 && (
            <div className="bg-white mb-2">
              <div className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-[#f5f5f5]">
                <div>
                  <h2 className="text-[14px] font-black text-gray-900 leading-none">🥛 Dairy Essentials</h2>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Sourced every morning from organic farms</p>
                </div>
                <button
                  onClick={() => { setActiveCategory('dairy'); setSubCategoryFilter('All'); setActiveTab('category_detail'); }}
                  className="text-[11px] font-bold text-[#0c831f] flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar p-3">
                {dairyProducts.map((p) => (
                  <div key={p.id} className="min-w-[145px] max-w-[145px]">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════ FRESH VEGETABLES ════════ */}
          {freshVeg.length > 0 && (
            <div className="bg-white mb-2">
              <div className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-[#f5f5f5]">
                <div>
                  <h2 className="text-[14px] font-black text-gray-900 leading-none">🥦 Fresh Vegetables</h2>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Farm to doorstep • Daily harvest</p>
                </div>
                <button
                  onClick={() => { setActiveCategory('vegetables'); setSubCategoryFilter('All'); setActiveTab('category_detail'); }}
                  className="text-[11px] font-bold text-[#0c831f] flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 p-3">
                {freshVeg.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}

          {/* ════════ APP FOOTER STRIP ════════ */}
          <div className="bg-white mx-0 px-4 py-5 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              🛡️ <strong className="text-slate-600">100% Safe</strong> • Fresh Guaranteed • Free Delivery Above ₹199
            </p>
            <p className="text-[10px] text-slate-300 mt-1">© 2026 CartCraze Quick Commerce. All rights reserved.</p>
          </div>
        </>
      )}
    </div>
  );
};
