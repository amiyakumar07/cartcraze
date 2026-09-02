import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ArrowLeft, Search as SearchIcon, X, Mic, Filter, ChevronDown } from 'lucide-react';

export const SearchScreen: React.FC = () => {
  const { searchQuery, setSearchQuery, products, setActiveTab } = useApp();
  const [localQuery, setLocalQuery] = useState(searchQuery || 'Milk');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string | null>(null);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string | null>(null);

  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (localQuery.trim()) {
      const q = localQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q))
      );
    }

    if (selectedPriceFilter === 'Low to High') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (selectedPriceFilter === 'High to Low') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (selectedPriceFilter === 'Under ₹50') {
      result = result.filter((p) => p.price <= 50);
    }

    if (selectedRatingFilter) {
      result = result.filter((p) => (p.rating || 4.5) >= selectedRatingFilter);
    }

    if (selectedBrandFilter) {
      result = result.filter((p) => p.name.toLowerCase().includes(selectedBrandFilter.toLowerCase()));
    }

    return result;
  }, [products, localQuery, selectedPriceFilter, selectedRatingFilter, selectedBrandFilter]);

  const handleResetFilters = () => {
    setSelectedPriceFilter(null);
    setSelectedRatingFilter(null);
    setSelectedBrandFilter(null);
  };

  return (
    <div className="bg-[#F4FBF4] min-h-screen pb-24 font-[Inter,sans-serif] animate-fadeIn">
      {/* ── Top Header Search Bar ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-emerald-100 shadow-2xs p-3">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            data-testid="search_back_btn"
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#006C49]" />
          </button>

          <div className="relative flex-1 flex items-center bg-slate-100 rounded-2xl border border-slate-200 focus-within:border-[#006C49] focus-within:bg-white transition-all">
            <SearchIcon className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => {
                setLocalQuery(e.target.value);
                setSearchQuery(e.target.value);
              }}
              placeholder="Search groceries..."
              data-testid="search_text_input"
              className="w-full pl-10 pr-9 py-2.5 bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            {localQuery ? (
              <button
                onClick={() => {
                  setLocalQuery('');
                  setSearchQuery('');
                }}
                className="absolute right-3 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Mic className="absolute right-3.5 w-4 h-4 text-[#006C49]" />
            )}
          </div>
        </div>
      </div>

      {/* ── Results Header & Filter Chips ── */}
      <div className="p-4 space-y-3 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900">
            {filteredProducts.length} results for "{localQuery || 'All Items'}"
          </h2>
        </div>

        {/* Filter Chips Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {/* Price Filter Chip */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowPriceDropdown(!showPriceDropdown)}
              data-testid="filter_price"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                selectedPriceFilter
                  ? 'bg-emerald-50 text-[#006C49] border-[#006C49]'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              <span>{selectedPriceFilter ? `Price: ${selectedPriceFilter}` : 'Price'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showPriceDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 min-w-[150px] text-xs">
                {['All Prices', 'Price: Low to High', 'Price: High to Low', 'Under ₹50'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedPriceFilter(opt === 'All Prices' ? null : opt);
                      setShowPriceDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-slate-800 font-semibold"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rating Filter Chip */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowRatingDropdown(!showRatingDropdown)}
              data-testid="filter_rating"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                selectedRatingFilter
                  ? 'bg-emerald-50 text-[#006C49] border-[#006C49]'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              <span>{selectedRatingFilter ? `Rating: ${selectedRatingFilter}★+` : 'Rating'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showRatingDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 min-w-[150px] text-xs">
                <button
                  onClick={() => { setSelectedRatingFilter(null); setShowRatingDropdown(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-slate-800 font-semibold"
                >
                  All Ratings
                </button>
                <button
                  onClick={() => { setSelectedRatingFilter(4.5); setShowRatingDropdown(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-slate-800 font-semibold"
                >
                  4.5★ and above
                </button>
                <button
                  onClick={() => { setSelectedRatingFilter(4.0); setShowRatingDropdown(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-slate-800 font-semibold"
                >
                  4.0★ and above
                </button>
              </div>
            )}
          </div>

          {/* Reset Filters Pill */}
          <button
            onClick={handleResetFilters}
            data-testid="filter_reset_btn"
            className="flex items-center gap-1 px-3 py-1.5 bg-[#10B981] text-[#00422B] font-bold text-xs rounded-full shrink-0 hover:bg-emerald-400 transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* ── Product Grid ── */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs mt-4">
            <SearchIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-900 text-base mb-1">No products found</h3>
            <p className="text-xs text-slate-500 font-medium">Try adjusting your search keywords or clearing filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
