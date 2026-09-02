import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, ArrowLeft, ChevronRight, Layers, Sparkles } from 'lucide-react';

export const CategoryScreen: React.FC = () => {
  const { 
    activeTab,
    setActiveTab,
    activeCategory, 
    setActiveCategory, 
    subCategoryFilter, 
    setSubCategoryFilter,
    products
  } = useApp();

  const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'discount' | 'rating'>('relevance');

  // MODE 1: ALL CATEGORIES DIRECTORY GRID (when activeTab === 'categories')
  if (activeTab === 'categories') {
    return (
      <div className="p-4 space-y-4 pb-28 font-sans animate-fadeIn">
        {/* Title Header */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <div>
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Explore All Categories</span>
            </h2>
            <p className="text-xs text-gray-500 font-medium">9-minute express delivery to doorstep</p>
          </div>
          <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-2.5 py-1 rounded-full">
            {CATEGORIES.length} Categories
          </span>
        </div>

        {/* Category Collections Grid */}
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => {
            const catProductsCount = products.filter((p) => p.category === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSubCategoryFilter('All');
                  setActiveTab('category_detail');
                }}
                className="bg-white border border-gray-100 hover:border-amber-300 rounded-3xl p-3.5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Category Image Header */}
                <div className="w-full h-24 rounded-2xl bg-gray-50 overflow-hidden relative mb-2">
                  <img
                    src={cat.iconImage}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                  />
                  <span className="absolute top-2 right-2 bg-slate-900/90 text-yellow-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-700 backdrop-blur-xs">
                    {catProductsCount} items
                  </span>
                </div>

                {/* Category Title & Subcategories Preview */}
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-xs text-gray-900 group-hover:text-amber-600 transition-colors">
                      {cat.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>

                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {cat.subCategories.slice(0, 3).map((sub) => (
                      <span
                        key={sub}
                        className="text-[9px] font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md"
                      >
                        {sub}
                      </span>
                    ))}
                    {cat.subCategories.length > 3 && (
                      <span className="text-[9px] font-bold text-amber-600">
                        +{cat.subCategories.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // MODE 2: CATEGORY DETAIL & PRODUCTS LISTING (when activeTab === 'category_detail')
  const currentCategoryObj = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  let categoryProducts = products.filter((p) => p.category === activeCategory);

  if (subCategoryFilter && subCategoryFilter !== 'All') {
    categoryProducts = categoryProducts.filter((p) => p.subCategory === subCategoryFilter);
  }

  if (sortBy === 'price_low') {
    categoryProducts = [...categoryProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'discount') {
    categoryProducts = [...categoryProducts].sort((a, b) => b.discountPercentage - a.discountPercentage);
  } else if (sortBy === 'rating') {
    categoryProducts = [...categoryProducts].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="p-4 space-y-4 pb-28 font-sans animate-fadeIn">
      {/* Back to All Categories Button & Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <button
          onClick={() => setActiveTab('categories')}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200/80 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Categories</span>
        </button>

        <span className="text-xs text-gray-500 font-semibold">
          {categoryProducts.length} Products
        </span>
      </div>

      {/* Category Pills Header Selector */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => {
          const isSelected = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSubCategoryFilter('All');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Subcategory & Sort Header */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-black text-gray-900 flex items-center gap-1">
            <span>{currentCategoryObj.name}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </h2>

          <div className="flex items-center gap-1 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-gray-100 border-none rounded-lg text-xs font-semibold px-2 py-1 text-gray-700 focus:ring-1 focus:ring-amber-400"
            >
              <option value="relevance">Popularity</option>
              <option value="price_low">Price: Low to High</option>
              <option value="discount">Highest Discount</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Sub-category tags */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {currentCategoryObj.subCategories.map((sub) => {
            const isSubSelected = subCategoryFilter === sub;
            return (
              <button
                key={sub}
                onClick={() => setSubCategoryFilter(sub)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSubSelected
                    ? 'bg-[#10B981] text-[#00422B] font-extrabold shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product List Grid */}
      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl p-6 border border-gray-100 space-y-2">
          <span className="text-3xl block">🥬</span>
          <p className="font-bold text-gray-800 text-sm">More items coming soon!</p>
          <p className="text-xs text-gray-500">We are restocking this section right now.</p>
          <button
            onClick={() => setSubCategoryFilter('All')}
            className="mt-2 bg-[#fdee24] text-black text-xs font-extrabold px-4 py-2 rounded-xl shadow-xs cursor-pointer"
          >
            Show All {currentCategoryObj.name}
          </button>
        </div>
      )}
    </div>
  );
};
