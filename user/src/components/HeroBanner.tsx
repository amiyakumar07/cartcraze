import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getFlashSaleStatus } from '../utils/flashSale';
import { ChevronRight } from 'lucide-react';

interface PromoSlide {
  id: string;
  type: 'image' | 'custom';
  image?: string;
  alt?: string;
  category?: string;
  is10RsBanner?: boolean;
}

export const HeroBanner: React.FC = () => {
  const { setActiveCategory, setActiveTab, setSubCategoryFilter } = useApp();
  const [flashStatus, setFlashStatus] = useState(getFlashSaleStatus());

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashStatus(getFlashSaleStatus());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBannerClick = (cat: string) => {
    setActiveCategory(cat);
    setSubCategoryFilter('All');
    setActiveTab('category_detail');
  };

  // Base list of graphic image banners uploaded by user
  const allBanners: PromoSlide[] = [
    {
      id: '10rs_deal_corner',
      type: 'image',
      image: '/banner_10rs_corner.jpg',
      alt: 'DAILY FRESH DEALS - ₹10 CORNER & BUY 1 GET 1 FREE',
      category: 'fruits',
      is10RsBanner: true
    },
    {
      id: '15rs_veg_deal',
      type: 'image',
      image: '/banner_15rs_veg.jpg',
      alt: 'DAILY FRESH VEG DEALS - ₹15 CORNER & 30% OFF',
      category: 'vegetables'
    },
    {
      id: 'bakery_20off_deal',
      type: 'image',
      image: '/banner_bakery_20off.jpg',
      alt: 'DAILY FRESH BAKERY DEALS - 20% OFF',
      category: 'bakery'
    },
    {
      id: 'refrigerated_deals',
      type: 'image',
      image: '/banner_refrigerated_deals.png',
      alt: 'DAILY FRESH REFRIGERATED DEALS - 20% OFF Dairy, Drinks & Meats',
      category: 'dairy'
    },
    {
      id: 'clothing_deals',
      type: 'image',
      image: '/banner_clothing_deals.png',
      alt: 'PREMIUM CLOTHING DEALS - 45% OFF Apparel & Accessories',
      category: 'snacks'
    },
    {
      id: 'fresh_deals_20off',
      type: 'image',
      image: '/fresh_deals_banner.jpg',
      alt: 'FRESH DEALS 20% OFF - Save on Farm-Fresh Vegetables',
      category: 'vegetables'
    }
  ];

  // If user has ordered today, automatically delete/hide the ₹10 banner for the rest of today!
  const visibleBanners = allBanners.filter((b) => {
    if (b.is10RsBanner && flashStatus.hasOrderedToday) {
      return false;
    }
    return true;
  });

  return (
    <div className="pt-2 pb-2 font-[Inter,sans-serif]">
      {/* ── All Banners in ONE Horizontal Line (Single Row Scroll) ── */}
      <div className="flex flex-row overflow-x-auto no-scrollbar gap-3 px-4 snap-x snap-mandatory py-1">
        {visibleBanners.map((b) => (
          <div
            key={b.id}
            onClick={() => handleBannerClick(b.category || 'fruits')}
            className="w-[300px] sm:w-[340px] shrink-0 snap-center rounded-3xl overflow-hidden shadow-xl border border-slate-100 cursor-pointer group transition-all duration-300 hover:scale-[1.01] active:scale-98"
          >
            {/* Clean Image Banner with NOTHING written on top */}
            <div className="w-full h-[155px] sm:h-[170px] bg-slate-900 overflow-hidden relative">
              <img
                src={b.image}
                alt={b.alt || 'Offer Banner'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
