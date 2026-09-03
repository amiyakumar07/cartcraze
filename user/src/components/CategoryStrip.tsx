import React from 'react';
import { CATEGORIES } from '../data/products';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';

const CAT_EMOJIS: Record<string, string> = {
  fruits: '🍎',
  vegetables: '🥦',
  dairy: '🥛',
  bakery: '🥐',
  clothes: '👕',
  meat: '🥩',
  snacks: '🍿',
  beverages: '🧃',
  pantry: '🌾',
};

export const CategoryStrip: React.FC = () => {
  const { setActiveCategory, setSubCategoryFilter, setActiveTab } = useApp();

  return (
    <div className="bg-white pt-3 pb-3 mb-2 rounded-2xl shadow-2xs border border-slate-100">
      <div className="flex justify-between items-center px-4 mb-2.5">
        <h2 className="text-[13px] font-black text-slate-900 uppercase tracking-wide">
          Shop by Category
        </h2>
        <button
          onClick={() => setActiveTab('categories')}
          className="flex items-center gap-0.5 text-[11px] font-extrabold text-[#006C49] hover:underline cursor-pointer figma-spring"
        >
          See All ({CATEGORIES.length}) <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Horizontal pill category scroll */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar px-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setSubCategoryFilter('All');
              setActiveTab('category_detail');
            }}
            className="flex flex-col items-center gap-1.5 min-w-[76px] max-w-[76px] focus:outline-none cursor-pointer group px-1 figma-spring"
          >
            <div className="w-[58px] h-[58px] rounded-[18px] overflow-hidden bg-slate-50 border border-slate-200/80 group-hover:border-[#006C49] group-hover:shadow-md transition-all duration-300 relative">
              <img
                src={cat.iconImage}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-0">
                {CAT_EMOJIS[cat.id] || '🛒'}
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-[#006C49] text-center leading-tight w-full truncate transition-colors">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
