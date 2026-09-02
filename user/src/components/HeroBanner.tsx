import React from 'react';
import { useApp } from '../context/AppContext';
import { ChevronRight } from 'lucide-react';

interface PromoSlide {
  id: string;
  type: 'image' | 'custom';
  image?: string;
  alt?: string;
  badge?: string;
  title?: string;
  highlightText?: string;
  subtitle?: string;
  buttonText?: string;
  category?: string;
  bgGradient?: string;
  accentColor?: string;
  badgeColor?: string;
  tag?: string;
}

export const HeroBanner: React.FC = () => {
  const { setActiveCategory, setActiveTab, setSubCategoryFilter } = useApp();

  const handleBannerClick = (cat: string) => {
    setActiveCategory(cat);
    setSubCategoryFilter('All');
    setActiveTab('category_detail');
  };

  const banners: PromoSlide[] = [
    {
      id: '1rs_mega_deal',
      type: 'image',
      image: '/one_rs_deal_banner.jpg',
      alt: 'MEGA DEAL ₹1 ONLY - GROCERY MART',
      category: 'fruits'
    },
    {
      id: 'fresh_deals_20off',
      type: 'image',
      image: '/fresh_deals_banner.jpg',
      alt: 'FRESH DEALS 20% OFF - Save on Farm-Fresh Vegetables',
      category: 'vegetables'
    },
    {
      id: 'dairy_banner',
      type: 'custom',
      badge: '🥛 PURE DAIRY & EGGS',
      title: 'FRESH A2 COW MILK',
      highlightText: 'Delivered Every Morning',
      subtitle: 'Pasteurized Gir Cow milk • Organic certified farms',
      buttonText: 'Explore Dairy',
      category: 'dairy',
      bgGradient: 'linear-gradient(135deg, #451A03 0%, #78350F 50%, #92400E 100%)',
      accentColor: '#FBBF24',
      badgeColor: '#FCD34D',
      image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=85',
      tag: 'FARM DIRECT'
    },
    {
      id: 'bakery_banner',
      type: 'custom',
      badge: '🥐 ARTISANAL BAKERY',
      title: 'ZERO MAIDA BREAD',
      highlightText: 'Baked Fresh Daily',
      subtitle: 'Sourdough loaves & buttery croissants • Oven-warm delivery',
      buttonText: 'Browse Bakery',
      category: 'bakery',
      bgGradient: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 50%, #7C3AED 100%)',
      accentColor: '#C084FC',
      badgeColor: '#E9D5FF',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=85',
      tag: 'HOT FROM OVEN'
    }
  ];

  return (
    <div className="pt-2 pb-2 font-[Inter,sans-serif]">
      {/* ── All Banners in ONE Horizontal Line (Single Row Scroll) ── */}
      <div className="flex flex-row overflow-x-auto no-scrollbar gap-3 px-4 snap-x snap-mandatory py-1">
        {banners.map((b) => (
          <div
            key={b.id}
            onClick={() => handleBannerClick(b.category || 'fruits')}
            className="w-[300px] sm:w-[340px] shrink-0 snap-center rounded-3xl overflow-hidden shadow-xl border border-slate-100 cursor-pointer group transition-all duration-300 hover:scale-[1.01] active:scale-98"
          >
            {b.type === 'image' ? (
              /* Clean Image Banner with NOTHING written on top */
              <div className="w-full h-[155px] sm:h-[170px] bg-slate-900 overflow-hidden relative">
                <img
                  src={b.image}
                  alt={b.alt || 'Offer Banner'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            ) : (
              /* Custom Styled Banner */
              <div
                className="w-full h-[155px] sm:h-[170px] p-4 text-white relative overflow-hidden flex flex-col justify-between"
                style={{ background: b.bgGradient }}
              >
                <div className="absolute right-0 bottom-0 top-0 w-[45%] flex items-end justify-end overflow-hidden pointer-events-none">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                    style={{ maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 35%, #000 100%)' }}
                  />
                </div>

                <div className="flex justify-between items-start z-10 gap-2">
                  <span className="text-[9.5px] font-black px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 tracking-wider uppercase">
                    {b.badge}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-black/40 backdrop-blur-md text-amber-300 border border-amber-400/30">
                    {b.tag}
                  </span>
                </div>

                <div className="z-10 my-1 max-w-[62%] space-y-0.5">
                  <h3 className="text-base font-black leading-tight drop-shadow-md text-white tracking-tight">
                    {b.title}
                  </h3>
                  <p className="text-[11px] font-black drop-shadow-sm" style={{ color: b.badgeColor }}>
                    {b.highlightText}
                  </p>
                </div>

                <div className="z-10">
                  <button
                    className="text-[11px] font-black py-1.5 px-3.5 rounded-xl transition-all flex items-center gap-1 text-slate-950 shadow-md"
                    style={{ background: b.accentColor }}
                  >
                    <span>{b.buttonText}</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
