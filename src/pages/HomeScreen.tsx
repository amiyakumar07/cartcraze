import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { HeroBanner } from '../components/HeroBanner';
import { ArrowRight, Flame, Layers, Clock, Zap } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { 
    setActiveCategory, 
    setActiveTab, 
    searchQuery, 
    setSubCategoryFilter,
    products
  } = useApp();

  // Flash Deals Countdown Timer
  const [dealTimeLeft, setDealTimeLeft] = useState(7450); // ~2 hours 04 mins in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setDealTimeLeft((prev) => (prev > 0 ? prev - 1 : 7200));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(dealTimeLeft / 3600);
  const minutes = Math.floor((dealTimeLeft % 3600) / 60);
  const seconds = dealTimeLeft % 60;

  // Filter products if search query is typed
  const filteredProducts = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const trendingProducts = products.slice(0, 6);
  const flashDeals = products.filter((p) => p.discountPercentage >= 30).slice(0, 4);
  const dairyProducts = products.filter((p) => p.category === 'dairy');

  return (
    <div className="p-4 space-y-6 pb-24 font-sans animate-fadeIn">
      {/* If Search is Active */}
      {searchQuery ? (
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-gray-900">
              Search Results for <span className="text-amber-600">"{searchQuery}"</span>
            </h3>
            <span className="text-xs text-gray-500 font-medium">{filteredProducts.length} items found</span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="font-bold text-gray-800 text-sm">No products matching "{searchQuery}"</p>
              <p className="text-xs text-gray-500 mt-1">Try searching for "Apples", "Milk", "Bread", or "Avocado"</p>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Categories Horizontal Scroll */}
          <section className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Categories</h3>
              <button 
                onClick={() => setActiveTab('categories')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-0.5 cursor-pointer"
              >
                <span>See All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSubCategoryFilter('All');
                    setActiveTab('category_detail');
                  }}
                  className="flex flex-col items-center gap-1.5 min-w-[70px] group focus:outline-none cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 p-1 flex items-center justify-center shadow-2xs group-hover:scale-105 group-hover:border-amber-300 transition-all">
                    <img
                      src={cat.iconImage}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-700 group-hover:text-gray-900 truncate max-w-[72px]">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Promotional Hero Banner Carousel */}
          <HeroBanner />

          {/* Flash Deals with Live Countdown */}
          <section className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 rounded-3xl p-4 space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-red-500 text-white rounded-xl shadow-xs animate-bounce">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-red-950 flex items-center gap-1">
                    <span>⚡ FLASH DEALS</span>
                  </h3>
                  <p className="text-[10px] text-red-700 font-semibold">Up to 36% OFF • Stock ending fast</p>
                </div>
              </div>

              {/* Countdown badge */}
              <div className="bg-slate-900 text-white px-2.5 py-1 rounded-xl font-mono text-xs font-black shadow-xs flex items-center gap-1">
                <Clock className="w-3 h-3 text-yellow-400" />
                <span>
                  {hours < 10 ? `0${hours}` : hours}:{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {flashDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Shop by Category Grid */}
          <section>
            <div className="flex items-center gap-1.5 mb-3">
              <Layers className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-extrabold text-gray-900">Shop by Category</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Category Card 1 */}
              <div 
                onClick={() => {
                  setActiveCategory('fruits');
                  setSubCategoryFilter('All');
                  setActiveTab('category_detail');
                }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-3.5 flex justify-between items-center relative overflow-hidden h-24 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="z-10">
                  <span className="font-extrabold text-sm text-emerald-950 block leading-tight">Fresh<br/>Produce</span>
                  <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-block bg-white/80 px-2 py-0.5 rounded-full">Up to 40% OFF</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=200&q=80"
                  alt="Fresh Produce"
                  className="absolute right-[-10px] bottom-[-10px] w-24 h-24 object-cover rounded-full group-hover:scale-110 transition-transform duration-300 shadow-xs"
                />
              </div>

              {/* Category Card 2 */}
              <div 
                onClick={() => {
                  setActiveCategory('dairy');
                  setSubCategoryFilter('All');
                  setActiveTab('category_detail');
                }}
                className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-2xl p-3.5 flex justify-between items-center relative overflow-hidden h-24 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="z-10">
                  <span className="font-extrabold text-sm text-amber-950 block leading-tight">Dairy &amp;<br/>Eggs</span>
                  <span className="text-[10px] text-amber-800 font-semibold mt-1 inline-block bg-white/80 px-2 py-0.5 rounded-full">Daily Fresh</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=200&q=80"
                  alt="Dairy & Eggs"
                  className="absolute right-[-10px] bottom-[-10px] w-24 h-24 object-cover rounded-full group-hover:scale-110 transition-transform duration-300 shadow-xs"
                />
              </div>

              {/* Category Card 3 */}
              <div 
                onClick={() => {
                  setActiveCategory('bakery');
                  setSubCategoryFilter('All');
                  setActiveTab('category_detail');
                }}
                className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-3.5 flex justify-between items-center relative overflow-hidden h-24 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="z-10">
                  <span className="font-extrabold text-sm text-orange-950 block leading-tight">Bakery &amp;<br/>Breads</span>
                  <span className="text-[10px] text-orange-800 font-semibold mt-1 inline-block bg-white/80 px-2 py-0.5 rounded-full">Zero Maida</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80"
                  alt="Bakery"
                  className="absolute right-[-10px] bottom-[-10px] w-24 h-24 object-cover rounded-full group-hover:scale-110 transition-transform duration-300 shadow-xs"
                />
              </div>

              {/* Category Card 4 */}
              <div 
                onClick={() => {
                  setActiveCategory('snacks');
                  setSubCategoryFilter('All');
                  setActiveTab('category_detail');
                }}
                className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-3.5 flex justify-between items-center relative overflow-hidden h-24 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="z-10">
                  <span className="font-extrabold text-sm text-purple-950 block leading-tight">Snacks &amp;<br/>Munchies</span>
                  <span className="text-[10px] text-purple-800 font-semibold mt-1 inline-block bg-white/80 px-2 py-0.5 rounded-full">Cravings</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=200&q=80"
                  alt="Snacks"
                  className="absolute right-[-10px] bottom-[-10px] w-24 h-24 object-cover rounded-full group-hover:scale-110 transition-transform duration-300 shadow-xs"
                />
              </div>
            </div>
          </section>

          {/* Trending Now Section */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-red-500 fill-red-500" />
                <h3 className="text-base font-extrabold text-gray-900">Trending Now</h3>
              </div>
              <span className="text-xs text-gray-400 font-medium">Under 9 mins delivery</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Dairy Essentials Spotlight Section */}
          {dairyProducts.length > 0 && (
            <section className="bg-sky-50/70 border border-sky-100 rounded-3xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-extrabold text-sky-950">Daily Milk & Fresh Dairy</h3>
                  <p className="text-[11px] text-sky-700 font-medium">Sourced every morning from organic farms</p>
                </div>
                <button 
                  onClick={() => {
                    setActiveCategory('dairy');
                    setActiveTab('category_detail');
                  }}
                  className="text-xs font-bold text-sky-800 bg-white px-3 py-1.5 rounded-xl shadow-2xs hover:bg-sky-100 cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {dairyProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};
