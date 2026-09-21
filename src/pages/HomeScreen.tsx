import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { AddressSearchModal } from '../components/AddressSearchModal';
import { LocationPermissionModal } from '../components/LocationPermissionModal';
import { submitWaitlistApi } from '../services/api';
import { ServiceUnavailableView } from '../components/ServiceUnavailableView';
import { MapPin, Navigation, Search, Bell, CheckCircle2, AlertTriangle, ArrowRight, Store, Clock } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { 
    setActiveCategory, 
    setActiveTab, 
    searchQuery, 
    setSubCategoryFilter,
    products,
    userProfile,
    userCoords,
    activeStore,
    deliveryEta,
    nearestStoreInfo,
    serviceabilityStatus,
    checkStoreCoverage,
    setUserProfile,
    setUserCoords
  } = useApp();

  // Modal triggers
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Waitlist form state
  const [waitlistPhone, setWaitlistPhone] = useState('');
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistError, setWaitlistError] = useState('');
  const [showWaitlistInline, setShowWaitlistInline] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(1420);
  const [switchedToast, setSwitchedToast] = useState<string | null>(null);

  const handleVote = () => {
    if (!hasVoted) {
      setHasVoted(true);
      setVoteCount((prev) => prev + 1);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = waitlistPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setWaitlistError('Please enter a valid 10-digit mobile number');
      return;
    }

    setWaitlistLoading(true);
    setWaitlistError('');
    try {
      const res = await submitWaitlistApi({
        phone: cleanPhone,
        lat: userCoords?.lat,
        lon: userCoords?.lon,
        address: userProfile.address || 'Customer Location'
      });
      if (res && res.success) {
        setWaitlistSubmitted(true);
      } else {
        setWaitlistError(res?.message || 'Failed to register interest. Please try again.');
      }
    } catch {
      setWaitlistError('Network error. Please try again.');
    } finally {
      setWaitlistLoading(false);
    }
  };

  // Filter products if search query is typed
  const filteredProducts = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const circularCategories = [
    {
      id: 'fruits',
      name: 'Fruits & Veggies',
      icon: '🍎',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      matchCats: ['fruits', 'vegetables']
    },
    {
      id: 'dairy',
      name: 'Dairy & Eggs',
      icon: '🥛',
      bg: 'bg-blue-50 text-blue-700 border-blue-100',
      matchCats: ['dairy & eggs', 'dairy']
    },
    {
      id: 'bakery',
      name: 'Bakery & Bread',
      icon: '🍞',
      bg: 'bg-amber-50 text-amber-800 border-amber-100',
      matchCats: ['bakery']
    },
    {
      id: 'snacks',
      name: 'Snacks & Munchies',
      icon: '🍟',
      bg: 'bg-orange-50 text-orange-700 border-orange-100',
      matchCats: ['snacks']
    },
    {
      id: 'beverages',
      name: 'Cold Drinks',
      icon: '🥤',
      bg: 'bg-cyan-50 text-cyan-700 border-cyan-100',
      matchCats: ['beverages']
    },
    {
      id: 'staples',
      name: 'Pantry Staples',
      icon: '🌾',
      bg: 'bg-yellow-50 text-yellow-800 border-yellow-100',
      matchCats: ['pantry staples', 'staples']
    }
  ];

  // Group real products for homepage shelves
  const produceItems = products.filter((p) => ['fruits', 'vegetables'].includes(p.category.toLowerCase()));
  const dairyBakeryItems = products.filter((p) => ['dairy & eggs', 'dairy', 'bakery'].includes(p.category.toLowerCase()));
  const snacksBeveragesItems = products.filter((p) => ['snacks', 'beverages'].includes(p.category.toLowerCase()));
  const staplesItems = products.filter((p) => ['pantry staples', 'staples'].includes(p.category.toLowerCase()));

  // ─────────────────────────────────────────────────────────────
  // 1. STATE: LOCATION REQUIRED
  // ─────────────────────────────────────────────────────────────
  if (serviceabilityStatus === 'LOCATION_REQUIRED') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[72vh] px-5 py-8 text-center animate-fadeIn font-sans">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner mb-5 border border-emerald-100 relative">
          <MapPin className="w-10 h-10 text-[#00676d]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
        </div>

        <h2 className="text-xl font-black text-gray-900 tracking-tight mb-2">
          Set Your Delivery Location
        </h2>
        <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-6">
          CartCraze delivers fresh groceries within 5 km of our active stores. Set your location to see real-time inventory and delivery times.
        </p>

        <div className="w-full max-w-xs space-y-2.5">
          <button
            onClick={() => setShowPermissionModal(true)}
            className="w-full bg-[#00676d] hover:bg-[#00555a] text-white font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Use Current Device Location</span>
          </button>

          <button
            onClick={() => setShowSearchModal(true)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Search className="w-4 h-4 text-gray-500" />
            <span>Search Delivery Address</span>
          </button>
        </div>

        <div className="mt-8 p-3 bg-amber-50/80 border border-amber-200/60 rounded-2xl max-w-xs text-left">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px] mb-1">
            <Store className="w-3.5 h-3.5 text-amber-700" />
            <span>Store #01 Now Delivering</span>
          </div>
          <p className="text-[10px] text-amber-800 leading-normal">
            Currently operational in <strong>Jaydev Vihar, Bhubaneswar</strong> within 5 km.
          </p>
        </div>

        <LocationPermissionModal
          isOpen={showPermissionModal}
          onClose={() => setShowPermissionModal(false)}
          onOpenManualSearch={() => setShowSearchModal(true)}
        />

        <AddressSearchModal
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onSelectAddress={(addr, coords) => {
            setUserProfile((prev) => ({ ...prev, address: addr }));
            localStorage.setItem('cartcraze_user_selected_address', addr);
            if (coords) setUserCoords(coords);
          }}
        />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. STATE: STORE UNAVAILABLE (Outside 5 km service radius)
  // ─────────────────────────────────────────────────────────────
  if (serviceabilityStatus === 'UNAVAILABLE') {
    return <ServiceUnavailableView />;
  }

  // ─────────────────────────────────────────────────────────────
  // 3. STATE: SERVICEABLE (Within 5 km radius)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full pb-20 pt-1 animate-fadeIn font-sans">
      {/* Store & Delivery Badge */}
      <div className="px-4 mb-3">
        <div className="bg-gradient-to-r from-[#00676d] to-[#00828a] text-white rounded-2xl p-3 shadow-md flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Store className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="text-[11px] font-extrabold uppercase tracking-wide truncate">
                {activeStore?.name || 'CartCraze Store - Jaydev Vihar'}
              </span>
            </div>
            <p className="text-[10px] text-emerald-100 truncate">
              Delivering to {userProfile.address || 'Jaydev Vihar, Bhubaneswar'}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-black shrink-0">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>{deliveryEta}</span>
          </div>
        </div>
      </div>

      {/* Search Results Display if active */}
      {searchQuery ? (
        <section className="px-4 py-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-[#131b2e]">
              Search Results for <span className="text-[#00676d]">"{searchQuery}"</span>
            </h3>
            <span className="text-xs text-[#6e797a] font-medium">{filteredProducts.length} items</span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-2xl p-6 shadow-2xs border border-gray-100">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="font-bold text-[#131b2e] text-sm">No items matching "{searchQuery}"</p>
              <p className="text-xs text-[#6e797a] mt-1">Try searching for "Apples", "Milk", "Bread", or "Chips"</p>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Circular Category Bubbles */}
          <div className="px-4 mb-4">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-800">Shop by Category</h3>
              <button
                onClick={() => setActiveTab('categories')}
                className="text-[11px] font-bold text-[#00676d] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
              {circularCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSubCategoryFilter('All');
                    setActiveTab('category_detail');
                  }}
                  className="flex flex-col items-center p-2 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 shadow-2xs hover:shadow-sm transition active:scale-95 text-center cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-1.5 border ${cat.bg}`}>
                    {cat.icon}
                  </div>
                  <span className="text-[11px] font-bold text-gray-800 leading-tight line-clamp-2">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Fresh Produce */}
          {produceItems.length > 0 && (
            <section className="px-4 mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Fresh Farm Produce</h3>
                  <p className="text-[10px] text-gray-500 font-medium">Daily harvested fruits &amp; vegetables</p>
                </div>
                <button
                  onClick={() => {
                    setActiveCategory('fruits');
                    setActiveTab('category_detail');
                  }}
                  className="text-xs font-bold text-[#00676d] flex items-center gap-0.5 hover:underline"
                >
                  <span>See all</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {produceItems.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Section 2: Dairy & Morning Essentials */}
          {dairyBakeryItems.length > 0 && (
            <section className="px-4 mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Dairy, Bread &amp; Eggs</h3>
                  <p className="text-[10px] text-gray-500 font-medium">Farm fresh milk, butter &amp; artisan bakes</p>
                </div>
                <button
                  onClick={() => {
                    setActiveCategory('dairy');
                    setActiveTab('category_detail');
                  }}
                  className="text-xs font-bold text-[#00676d] flex items-center gap-0.5 hover:underline"
                >
                  <span>See all</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {dairyBakeryItems.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Section 3: Snacks & Munchies */}
          {snacksBeveragesItems.length > 0 && (
            <section className="px-4 mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Snacks &amp; Cold Drinks</h3>
                  <p className="text-[10px] text-gray-500 font-medium">Chips, chocolates, juices &amp; refreshments</p>
                </div>
                <button
                  onClick={() => {
                    setActiveCategory('snacks');
                    setActiveTab('category_detail');
                  }}
                  className="text-xs font-bold text-[#00676d] flex items-center gap-0.5 hover:underline"
                >
                  <span>See all</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {snacksBeveragesItems.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Section 4: Kitchen Staples */}
          {staplesItems.length > 0 && (
            <section className="px-4 mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Atta, Rice, Dal &amp; Oil</h3>
                  <p className="text-[10px] text-gray-500 font-medium">Pantry staples for daily home cooking</p>
                </div>
                <button
                  onClick={() => {
                    setActiveCategory('staples');
                    setActiveTab('category_detail');
                  }}
                  className="text-xs font-bold text-[#00676d] flex items-center gap-0.5 hover:underline"
                >
                  <span>See all</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {staplesItems.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Modals */}
      <AddressSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectAddress={(addr, coords) => {
          setUserProfile((prev) => ({ ...prev, address: addr }));
          localStorage.setItem('cartcraze_user_selected_address', addr);
          if (coords) setUserCoords(coords);
        }}
      />

      <LocationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onOpenManualSearch={() => setShowSearchModal(true)}
      />
    </div>
  );
};
