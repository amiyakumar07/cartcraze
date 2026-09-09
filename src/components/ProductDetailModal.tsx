import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, cart, addToCart, removeFromCart, setActiveTab, getCartCount } = useApp();
  const [selectedPack, setSelectedPack] = useState<'500ml' | '1L' | 'pack4'>('1L');
  const [isWishlisted, setIsWishlisted] = useState(true);
  const [accordionOpen, setAccordionOpen] = useState<{ [key: string]: boolean }>({
    features: true,
    nutrition: true,
    storage: false
  });

  if (!selectedProduct) return null;

  const cartItem = cart.find((i) => i.product.id === selectedProduct.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const cartCount = getCartCount();

  const toggleAccordion = (key: string) => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePackChange = (pack: '500ml' | '1L' | 'pack4') => {
    setSelectedPack(pack);
  };

  const getPackPrice = () => {
    if (selectedPack === '500ml') return { price: 28, mrp: 30, discount: '7% OFF', save: '₹2' };
    if (selectedPack === 'pack4') return { price: 210, mrp: 232, discount: '10% OFF', save: '₹22' };
    return { 
      price: selectedProduct.price || 54, 
      mrp: selectedProduct.originalPrice || 58, 
      discount: '7% OFF', 
      save: '₹4' 
    };
  };

  const packInfo = getPackPrice();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-end sm:items-center p-0 animate-fadeIn font-sans">
      <div className="bg-[#faf8ff] w-full max-w-[440px] rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl relative flex flex-col pb-24">
        
        {/* Fixed Header */}
        <div className="sticky top-0 z-20 bg-[#faf8ff]/95 backdrop-blur-xl px-4 py-2.5 border-b border-[#dae2fd]/60 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <button 
              aria-label="Go Back" 
              onClick={() => setSelectedProduct(null)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#131b2e] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="text-sm font-bold text-[#131b2e] truncate">Product Details</h1>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#6e797a] hover:bg-[#eaedff] hover:text-[#131b2e]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Top Action Utility Row */}
        <div className="px-4 py-2 flex items-center justify-between bg-white border-b border-[#dae2fd]/40">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00865c]/10 text-[#006a48] text-[9px] font-extrabold uppercase">
              <span className="material-symbols-outlined text-[13px]">bolt</span>
              10 Mins Delivery
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#f2f3ff] text-[#3e494a] text-[9px] font-bold">
              <span className="inline-block w-2 h-2 rounded-full bg-[#006a48]"></span>
              100% Veg
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button 
              aria-label="Share" 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: selectedProduct.name, url: window.location.href }).catch(() => {});
                } else {
                  alert('Link copied to clipboard!');
                }
              }}
              className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#131b2e] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>

            <button 
              aria-label="Add to Wishlist" 
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#fb7800] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}>
                favorite
              </span>
            </button>

            <button 
              aria-label="Cart" 
              onClick={() => {
                setSelectedProduct(null);
                setActiveTab('cart');
              }}
              className="relative w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#131b2e] hover:bg-[#eaedff] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#fb7800] text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Media Gallery Carousel */}
        <section className="relative bg-white flex flex-col items-center pt-2 pb-4 px-4">
          <div className="relative w-full aspect-square max-w-xs rounded-2xl bg-[#f2f3ff] overflow-hidden flex items-center justify-center shadow-2xs">
            <div className="absolute top-3 left-3 z-10 bg-[#00676d] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
              7% OFF
            </div>
            <img 
              className="w-full h-full object-contain p-4" 
              alt={selectedProduct.name} 
              src={selectedProduct.image} 
            />
            {/* Dots */}
            <div className="absolute bottom-2.5 inset-x-0 flex justify-center items-center gap-1.5">
              <span className="w-5 h-1.5 rounded-full bg-[#00676d] transition-all"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#bdc9ca]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#bdc9ca]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#bdc9ca]"></span>
            </div>
          </div>
        </section>

        {/* Core Product Header & Pricing */}
        <section className="bg-white px-4 pt-3 pb-4 mb-2 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-[#00676d]/10 text-[#00676d] text-[9px] font-extrabold tracking-wider uppercase">
                Amul Official Store
              </span>
              <span className="material-symbols-outlined text-[#00676d] text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#6e797a] text-xs">
              <span className="material-symbols-outlined text-[#fb7800] text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span className="font-bold text-[#131b2e]">{selectedProduct.rating || 4.8}</span>
              <span className="text-[10px]">({selectedProduct.reviewsCount || '24,812'})</span>
            </div>
          </div>

          <h2 className="text-base font-extrabold text-[#131b2e] leading-snug mb-1">
            {selectedProduct.name}
          </h2>
          <p className="text-xs text-[#6e797a] mb-3">
            Tetra Pak • No Added Preservatives • Fortified with Vitamin A &amp; D
          </p>

          {/* Pack Variant Selector */}
          <div className="mb-3">
            <span className="text-[10px] text-[#6e797a] uppercase tracking-wider block mb-1.5 font-bold">
              Select Pack Size
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => handlePackChange('500ml')}
                className={`px-3 py-1.5 rounded-xl text-left flex flex-col transition-all text-xs ${
                  selectedPack === '500ml' 
                    ? 'bg-[#00676d] text-white shadow-xs' 
                    : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                <span className="font-bold">500 ml</span>
                <span className={`text-[10px] ${selectedPack === '500ml' ? 'text-white/80' : 'text-[#6e797a]'}`}>₹28</span>
              </button>

              <button 
                onClick={() => handlePackChange('1L')}
                className={`px-3 py-1.5 rounded-xl text-left flex flex-col transition-all text-xs relative ${
                  selectedPack === '1L' 
                    ? 'bg-[#00676d] text-white shadow-xs' 
                    : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                <span className="absolute -top-2 right-1 bg-[#fb7800] text-white text-[8px] font-extrabold px-1 rounded">
                  Best Value
                </span>
                <span className="font-bold">1 Litre</span>
                <span className={`text-[10px] ${selectedPack === '1L' ? 'text-white/80' : 'text-[#6e797a]'}`}>₹54</span>
              </button>

              <button 
                onClick={() => handlePackChange('pack4')}
                className={`px-3 py-1.5 rounded-xl text-left flex flex-col transition-all text-xs ${
                  selectedPack === 'pack4' 
                    ? 'bg-[#00676d] text-white shadow-xs' 
                    : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                <span className="font-bold">Pack of 4</span>
                <span className={`text-[10px] ${selectedPack === 'pack4' ? 'text-white/80' : 'text-[#6e797a]'}`}>₹210</span>
              </button>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#131b2e]">₹{packInfo.price}</span>
            <span className="text-xs text-[#6e797a] line-through">MRP ₹{packInfo.mrp}</span>
            <span className="px-1.5 py-0.2 rounded bg-[#00865c] text-white text-[9px] font-extrabold">
              SAVE {packInfo.save} ({packInfo.discount})
            </span>
          </div>
          <span className="text-[10px] text-[#6e797a] mt-0.5 block">Inclusive of all taxes</span>
        </section>

        {/* Hyperlocal Delivery ETA */}
        <section className="px-4 mb-2.5">
          <div className="bg-white p-3 rounded-2xl flex items-start gap-2.5 shadow-2xs border border-[#eaedff]">
            <div className="w-9 h-9 rounded-xl bg-[#ffdbc8] flex items-center justify-center text-[#994700] shrink-0">
              <span className="material-symbols-outlined text-[20px]">electric_bolt</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#131b2e]">10-12 Mins Fast Delivery</h3>
                <span className="text-[#006a48] text-[9px] font-extrabold bg-[#00865c]/10 px-2 py-0.5 rounded-full">
                  FASTEST
                </span>
              </div>
              <p className="text-[11px] text-[#3e494a] truncate mt-0.5">To: Flat B-402, Green Glen Heights, Bellandur</p>
              <p className="text-[10px] text-[#6e797a] flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[13px]">storefront</span>
                Dispatched from CartCraze DarkStore #14
              </p>
            </div>
          </div>
        </section>

        {/* Specifications Accordions */}
        <section className="px-4 mb-2.5 space-y-2">
          {/* Accordion 1: Highlights */}
          <div className="bg-white rounded-2xl p-3 shadow-2xs border border-[#eaedff]">
            <div 
              onClick={() => toggleAccordion('features')}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00676d] text-[18px]">eco</span>
                <h4 className="text-xs font-bold text-[#131b2e]">Key Features &amp; Benefits</h4>
              </div>
              <span className="material-symbols-outlined text-[#6e797a] text-[18px]">
                {accordionOpen.features ? 'expand_less' : 'expand_more'}
              </span>
            </div>
            {accordionOpen.features && (
              <ul className="mt-2 space-y-1 text-[11px] text-[#3e494a] list-disc pl-4">
                <li>Direct UHT treatment kills micro-organisms while retaining natural milk goodness.</li>
                <li>No added artificial preservatives, chemical stabilizers, or synthetic colors.</li>
                <li>Zero contamination: untouched by human hands during the processing cycle.</li>
                <li>Enriched with natural Calcium and Vitamin D3 for strong bones and energy.</li>
              </ul>
            )}
          </div>

          {/* Accordion 2: Nutritional Info */}
          <div className="bg-white rounded-2xl p-3 shadow-2xs border border-[#eaedff]">
            <div 
              onClick={() => toggleAccordion('nutrition')}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00676d] text-[18px]">nutrition</span>
                <h4 className="text-xs font-bold text-[#131b2e]">Nutritional Information (per 100ml)</h4>
              </div>
              <span className="material-symbols-outlined text-[#6e797a] text-[18px]">
                {accordionOpen.nutrition ? 'expand_less' : 'expand_more'}
              </span>
            </div>
            {accordionOpen.nutrition && (
              <div className="grid grid-cols-4 gap-1.5 mt-2 text-center">
                <div className="bg-[#f2f3ff] p-1.5 rounded-xl">
                  <span className="block text-xs font-bold text-[#131b2e]">58 kcal</span>
                  <span className="text-[9px] text-[#6e797a]">Energy</span>
                </div>
                <div className="bg-[#f2f3ff] p-1.5 rounded-xl">
                  <span className="block text-xs font-bold text-[#131b2e]">3.1 g</span>
                  <span className="text-[9px] text-[#6e797a]">Protein</span>
                </div>
                <div className="bg-[#f2f3ff] p-1.5 rounded-xl">
                  <span className="block text-xs font-bold text-[#131b2e]">3.0 g</span>
                  <span className="text-[9px] text-[#6e797a]">Fat</span>
                </div>
                <div className="bg-[#f2f3ff] p-1.5 rounded-xl">
                  <span className="block text-xs font-bold text-[#131b2e]">4.7 g</span>
                  <span className="text-[9px] text-[#6e797a]">Carbs</span>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 3: Storage */}
          <div className="bg-white rounded-2xl p-3 shadow-2xs border border-[#eaedff]">
            <div 
              onClick={() => toggleAccordion('storage')}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00676d] text-[18px]">kitchen</span>
                <h4 className="text-xs font-bold text-[#131b2e]">Shelf Life &amp; Storage</h4>
              </div>
              <span className="material-symbols-outlined text-[#6e797a] text-[18px]">
                {accordionOpen.storage ? 'expand_less' : 'expand_more'}
              </span>
            </div>
            {accordionOpen.storage && (
              <p className="mt-1.5 text-[11px] text-[#3e494a] leading-relaxed">
                Shelf life of 180 days from manufacturing. Store in a clean, cool, and dry place. Once opened, refrigerate between 4°C to 8°C and consume within 48 hours. No boiling required prior to consumption.
              </p>
            )}
          </div>
        </section>

        {/* Frequently Bought Together */}
        <section className="px-4 mb-2.5">
          <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-[#eaedff]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-[#131b2e]">Frequently Bought Together</h3>
              <span className="text-[8px] font-extrabold text-[#fb7800] bg-[#ffdbc8] px-1.5 py-0.5 rounded">
                COMBO SAVINGS
              </span>
            </div>

            <div className="flex items-center justify-between gap-1 py-1">
              <div className="flex flex-col items-center text-center w-16">
                <div className="w-14 h-14 rounded-xl bg-[#f2f3ff] p-1 overflow-hidden">
                  <img className="w-full h-full object-contain" alt="Amul Taaza" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhZHt_Rs-F1CIM030iHKepLKSMJOT-i-EMVE8R5WOAojvZzzx2YLyOddusJMX8FTl7ljM29afu5W1hV3W6Hm3SW6CmV84xO2FJMIqWLy0LNgdof2gRXxbcqJ-em8PXpwEeHziefxg6bznUIttanzQIUKjDq3JD4vap0TV_zUXZBmtQQfEWp51BpL7V6hJghFumrKGivU6lZkkc-bozoq6ppixxzS3W-nnyMParoy8-xX0kFxUY7KKv1w" />
                </div>
                <span className="text-[9px] font-semibold text-[#131b2e] truncate w-full mt-1">Amul Taaza</span>
                <span className="text-[9px] text-[#6e797a]">₹54</span>
              </div>
              <span className="text-xs font-bold text-[#6e797a]">+</span>
              <div className="flex flex-col items-center text-center w-16">
                <div className="w-14 h-14 rounded-xl bg-[#f2f3ff] p-1 overflow-hidden">
                  <img className="w-full h-full object-contain" alt="Corn Flakes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAITG3STwUsNy4-HVqvfvpbO2vrc_fiLvC0iNnxXK9k3MY5lGBxYmOn7CASXFXssgMxjkBd4BG2H7mx7qpdLQo23QJ5_18e5MpvKAP368edJx_x7EGIusixFOXVSU-1e0T98erWYGHnDx6jBvz6f3ULg9ZpLGbsI9lGtWx75Y40tRHYc6jBrXxNtpP2z3Sfor56ClIsuKWdgJWKbOOULwKWx9MPc7EacpXPUvXMN_NuVKrB1kySnBqEcA" />
                </div>
                <span className="text-[9px] font-semibold text-[#131b2e] truncate w-full mt-1">Corn Flakes</span>
                <span className="text-[9px] text-[#6e797a]">₹185</span>
              </div>
              <span className="text-xs font-bold text-[#6e797a]">+</span>
              <div className="flex flex-col items-center text-center w-16">
                <div className="w-14 h-14 rounded-xl bg-[#f2f3ff] p-1 overflow-hidden">
                  <img className="w-full h-full object-contain" alt="Bananas" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeJXrRuTLwuMejWA9zOm8fajuvWuxH_2eIqEhyIK9fDsmBSKgllZ73SeEo1lsMHcAjYj7hfIm8igA26MolSJ_bWnaanAT180mS3pSyTxr6xETZwTroGUmVhSs7jZ9Fcs8Dd_paB6K8jvUN-Kc7LIrPT1xgywlCWZ6w6LJ2X3JzuA5C_UljpPNae7wz_2D1zmveeRqCycY7FHrm9k-YHFxtuTrhFvV2gasnS0gOA6vsmXjNVT00JI-JoQ" />
                </div>
                <span className="text-[9px] font-semibold text-[#131b2e] truncate w-full mt-1">Bananas</span>
                <span className="text-[9px] text-[#6e797a]">₹48</span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 flex items-center justify-between bg-[#f2f3ff] p-2 rounded-xl">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-[#131b2e]">₹252</span>
                  <span className="text-[10px] text-[#6e797a] line-through">₹287</span>
                </div>
                <span className="text-[9px] font-bold text-[#006a48]">Save ₹35 on Bundle</span>
              </div>
              <button 
                onClick={() => {
                  addToCart(selectedProduct);
                  alert('Combo Bundle items added to your cart!');
                }}
                className="bg-[#00676d] text-white px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[15px]">add_shopping_cart</span>
                Add Bundle
              </button>
            </div>
          </div>
        </section>

        {/* Customer Reviews & Trust */}
        <section className="px-4 mb-4">
          <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-[#eaedff]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs font-bold text-[#131b2e]">Ratings &amp; Reviews</h3>
                <p className="text-[10px] text-[#6e797a]">100% verified customer ratings</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-0.5 text-[#fb7800] justify-end">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-sm font-extrabold text-[#131b2e]">4.8</span>
                </div>
                <span className="text-[9px] text-[#6e797a]">24.8k reviews</span>
              </div>
            </div>

            {/* Rating percentage bars */}
            <div className="space-y-1 mb-2.5 text-[10px]">
              <div className="flex items-center gap-1.5 text-[#3e494a]">
                <span className="w-2.5 text-[#131b2e] font-semibold">5</span>
                <div className="flex-1 h-1.5 rounded-full bg-[#f2f3ff] overflow-hidden">
                  <div className="bg-[#006a48] h-full rounded-full w-[84%]"></div>
                </div>
                <span className="w-7 text-right text-[#6e797a]">84%</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#3e494a]">
                <span className="w-2.5 text-[#131b2e] font-semibold">4</span>
                <div className="flex-1 h-1.5 rounded-full bg-[#f2f3ff] overflow-hidden">
                  <div className="bg-[#006a48] h-full rounded-full w-[11%]"></div>
                </div>
                <span className="w-7 text-right text-[#6e797a]">11%</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#3e494a]">
                <span className="w-2.5 text-[#131b2e] font-semibold">3</span>
                <div className="flex-1 h-1.5 rounded-full bg-[#f2f3ff] overflow-hidden">
                  <div className="bg-[#fb7800] h-full rounded-full w-[3%]"></div>
                </div>
                <span className="w-7 text-right text-[#6e797a]">3%</span>
              </div>
            </div>

            {/* User Review Sample */}
            <div className="bg-[#f2f3ff] p-2.5 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#00828a] text-white flex items-center justify-center text-[9px] font-bold">
                    RK
                  </div>
                  <span className="text-xs font-bold text-[#131b2e]">Ramesh K.</span>
                  <span className="material-symbols-outlined text-[#006a48] text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <span className="text-[9px] text-[#6e797a]">2 hrs ago</span>
              </div>
              <p className="text-[11px] text-[#3e494a]">
                Arrived chilled in under 9 minutes! Amul Taaza is our everyday tea and breakfast choice. Completely intact packaging.
              </p>
            </div>
          </div>
        </section>

        {/* Sticky Bottom Ribbon */}
        <aside className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md p-3 border-t border-[#dae2fd]/60 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] max-w-[440px] mx-auto">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6e797a]">
                Total ({quantity || 1} units)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-extrabold text-[#131b2e]">
                  ₹{packInfo.price * (quantity || 1)}
                </span>
                <span className="text-[10px] text-[#6e797a] line-through">
                  ₹{packInfo.mrp * (quantity || 1)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {quantity === 0 ? (
                <button 
                  onClick={() => addToCart(selectedProduct)}
                  className="h-10 px-5 bg-[#00676d] text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                  <span>ADD TO CART</span>
                </button>
              ) : (
                <div className="flex items-center bg-[#00676d] text-white rounded-full px-1.5 py-1 h-9 shadow-xs">
                  <button 
                    onClick={() => removeFromCart(selectedProduct.id)}
                    className="w-7 h-7 flex items-center justify-center text-white font-bold text-sm hover:bg-white/10 rounded-full"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-bold">{quantity}</span>
                  <button 
                    onClick={() => addToCart(selectedProduct)}
                    className="w-7 h-7 flex items-center justify-center text-white font-bold text-sm hover:bg-white/10 rounded-full"
                  >
                    +
                  </button>
                </div>
              )}

              <button 
                onClick={() => {
                  setSelectedProduct(null);
                  setActiveTab('cart');
                }}
                className="h-9 px-3.5 bg-[#fb7800] text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
              >
                <span>View Cart</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};
