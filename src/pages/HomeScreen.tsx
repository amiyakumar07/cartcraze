import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

export const HomeScreen: React.FC = () => {
  const { 
    setActiveCategory, 
    setActiveTab, 
    searchQuery, 
    setSubCategoryFilter,
    products,
    cart,
    addToCart,
    removeFromCart,
    setSelectedProduct,
    setShowProductDetail
  } = useApp();

  // Flash Deals Countdown Timer (02h : 18m : 42s)
  const [totalSeconds, setTotalSeconds] = useState(2 * 3600 + 18 * 60 + 42);

  useEffect(() => {
    const timer = setInterval(() => {
      setTotalSeconds((prev) => (prev > 0 ? prev - 1 : 7200));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  // Filter products if search query is typed
  const filteredProducts = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const categories = [
    {
      id: 'fruits',
      name: 'Fruits & Veggies',
      badge: 'FRESH',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClwKiHC_sTGyqxM5QHpqH5oCm2pm915uEHPWBT6UKeDFKkXBBvI4sqQe4k07DLVVxcyePge__0pbuuS2YUQViUR-stCuBEFxPs3xTRhGD3hdHkw3HdxYCJTBBqJQu1TSl8c8hDYYynMowAu3ll9vyR-vCbpEnt-WOicyfWEd1Wk2M7SlywLTZPVoGQS8B_pXKkq6MvrLvmCvmc60nvrI1Yf_bAHoCJvRMvgaDoTBWqicb7fY-rhE6fjw'
    },
    {
      id: 'dairy',
      name: 'Dairy, Bread & Eggs',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtscm78Qow--ipT3DGV4tcBB1vRF7AWvaJwO7ZsWDGDz9sDMYcxJXCNElG-FQcPU4KRlAJcvrhfbJZnCOn9pyj1egXFGZZqsUIl3km0chtVkz1xqn4nJXpEyxqOR6NAiuKjdvmISvGiADEZrgWL3lBxBgMyN_2hSnfgxtJR6I8UcHM0sRljHPlvqHiDK9h-HheuHpn_UM23AAaRi91NAC87r0RgiH9DS0HAHBxDS_mAAa-d2N6kFfupg'
    },
    {
      id: 'snacks',
      name: 'Snacks & Munchies',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDum8ICpqP3hMQOCeRvyGuocy6EsZZUrPA6EqAzqvXaCTX4wR3gzAMxCoy6vhfiVoUuw3eVEFatexRLW-lunDDRgBBwusOachXD_ly9WemphRM2LcO9MF4KZiZq6B7q3AxPTI8o3gSFljyFXtNBIk0j35MI8a9PhEWbXLKXNRk_j8mP-RfV0qIBoJdKAGW5oAVOXoHfmNI_Y_TnCgCi7dscIXwpZZRLEN1_35JMwC0BZz2lF6Fqke6EkQ'
    },
    {
      id: 'beverages',
      name: 'Cold Drinks & Juices',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyT_zXmO0bqA6c5nJiYAGMVOPtzxuYotqA-YTFGGwEXY-jEjRkJoYxlaNKaQ6HSpkCC0fAdvxGHBjHIHmlhGgiGxCk8oRsJdyQuKzS_0WElaCF6FYPqS-fdyJoQiaWyYCb1KyPhaishdciD-l7gOVsEwMQxoLkFY4Gd_tnCYugcs4qe8x61IlThB5PK0r0-aeb__V_s3hHRDwD8KTWkVjKq-obCnbtIo4xiY0NVXqomZX8mvCChymN7w'
    },
    {
      id: 'staples',
      name: 'Atta, Rice & Dal',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmwPuHqCHXNqkw3VMzeZRAi4KONWpEEQlgIFzKQnVgfR00eNwtYu_oKtmJbo7zaRj2IJ6qVKrKseD1T_DMTXcIkLePZBFj3epUys8Y3D9pmtRvwSuPBB765lqvrIZiRa1ERAhUTL5FJYAT_qbTdWiatQh8M2E0G62UcuTcmhXgQ0kZVa2LuAQk3SKb9BnMjah-jaVzqgqyUCLqV5pyKJHWKg3bfMu2RHV44BjGRithaAfQVfeK3rbthw'
    },
    {
      id: 'instant',
      name: 'Instant & Frozen',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMA5gbLD1KLJ1WM7LKegKmGijnQPp_tlqNbssWXAWBn6BpQ-kl5frK1QYhfY6_GpwpKcRu8Txdn9NHbn8b7lIKe6TWkNeATwxp8-LphVuVHN5sDE4Uc0hxiIiLtwksJXpzk9C2AlXyXrtTajGnqbFXe6UUDSLrF9NAAxlz2HGLdhB74977J-BbIHdH1mcmNaPSEAhOdImcK9R9fJWpYN8Mke6T1XrcPsSIGwYl53gXI3rkrzA59Zn0ag'
    },
    {
      id: 'personal_care',
      name: 'Personal Care',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFajHs_R_Yd3T-Je46FRPh8xpiyqo5gowCTGGcVFrNhjwtvPLRXVrnxCIw01pfhQk0l4I8zpESiws-1ZcnGhXKi816yblN6FMg3jvXggqPr21BgGyFXCLyRf0vi6Dx_FRlgz_nGuJx9huru7t-9O1TN1Qj1xV51JkjTJiJrNoFK2CxgQWOC4FmRB1z-N9qTJUCbyj2YCYvmwTp3nkK7BE8paRKgDWA3Vg-6U1M871gy-qh4BSllxTaig'
    },
    {
      id: 'cleaning',
      name: 'Cleaning',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzwi_GJOAkdXCSGBdNv7tawC0ijdZq9fCTUq1Nj9vLsordBZOjm-Chyzw6-4lRWI20oYOrNhqWyfDQfv5q9HcQcILjluzfYT1TwKiqWtGD1VqnI_jcP72pTWnAuyCkYEcPZT9QGjpUm0zqVAe7PMTUTGnhccSErWAe3A6ZV-CzMIrxyqROK9HO_Tucw4Joff3IHWRSQmMS-Nw7wKDTvcEK8oXvnFx2TkUxS9-fa9Xpb4GZYXAEP4M_Gg'
    }
  ];

  const flashDealsList = [
    {
      id: 'f1',
      name: 'Amul Taaza Homogenised Toned Milk',
      unit: '1 L',
      price: 54,
      originalPrice: 58,
      discount: '7% OFF',
      eta: '10 MINS',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACRCaRdh4ESS69tUovO3e8bUGVcJQ2eJKXUcMHiJoAcHw-yYBJDf9LPjtwP21x8NBgOjbAe_eBdm1XL7gv_P8zkkdMUueZNdGS3dcK-ty9__mAZAykKcN7aB4qnr9VBjlzlDi-dZ8PR4VHQ87KzqZ6j-ykH-u_du9BvRVQ1jutQDD9kgQo9_prgTM9pKgF47knLS4fSID0NbgSum0WIYsMi4luqHXZBNANbuKcmRhpKqykHQ1Si4rBpQ'
    },
    {
      id: 'f2',
      name: 'Tata Salt Vacuum Evaporated',
      unit: '1 kg',
      price: 28,
      originalPrice: 30,
      discount: '',
      eta: '12 MINS',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVmLYJi2HpqI87RuCh8RuZm1LuTIqYjkUDIZ3arR82vZt_6oAWXRY8fKqCuej1Daqf0TDxl7bmXPFBRT4eoq-rZPHPjI454FTbv6Lm8P_YTvDmBmgv2qsodIwqNYjUq-ASnx_lvxs5HZ2qdU9PRqrJBwzA9n_3ITTeIbc7HZCX4NdEAbW9mWc9fF_XpzFfgDCR_bywJsNjzIzdw2Gm3X98KJ5cCVLvgskr8KAUGqLvpuOTpq5CnctyxQ'
    },
    {
      id: 'f3',
      name: 'Farm Fresh Alphonso Mangoes',
      unit: 'Pack of 6 pcs',
      price: 449,
      originalPrice: 599,
      discount: '25% OFF',
      tag: 'FRESH TODAY',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiKOqQXW9QkgQzN9ZULQfpAp5Qc5vHzR7elINILgvGGZi-VRoxUUEuZuB-uEZU4LU3WwXb2kMFTYfWdOfP3aIa3_kLuV6sTmGzjcz2jTtCUU3PdScYjoVp5xQcET9D2PX86L7930nSN-j1J2co_T4hMDz5Mu_2liZHq5La7tJ_G_TXTFYBc41LrvAi8DZyB5J_NfXq0eY8cXLfwJsm1M9l9KMLbx9dYxGlvMu3yYHQ4hGHt2zPiyUhog'
    },
    {
      id: 'f4',
      name: 'Britannia Good Day Cashew Cookies',
      unit: '600g combo pack',
      price: 110,
      originalPrice: 140,
      discount: '21% OFF',
      eta: '11 MINS',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm3DMI1al8PTZ-to9sz8yBRkMwrNene4bSk003A94mg7zCIaJjiAtmRXvB9v4n9IhzZ6VUtcegxIMNrATXEtiOpfzFZUkoMlTvFuy3SSFfE1LEet4afXIdbUEiqIF-ShYOBRvuRDb19qj8Gd4Zq4TYgVNBbh6B70CRJv6slffHoLbD-MieFAoFky5UaDVldqxBdbPZmwkayQJqnzd5M6dCqrbIB2wyDYsTYO5yBtvYu1FPmM27Fwu8yw'
    }
  ];

  const buyAgainItems = [
    {
      id: 'ba1',
      name: "Lay's India's Magic Masala",
      unit: '50g',
      price: 20,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwcp0_pD6nFdSvbULh_EeZqh2o46xCaFbN8uvCUwzZZ7lvbPwLuxSBxy93vstR3h2eEoCq7JFRaoqHHxG5AnNySw0Q6dNEnDQjgIyCGBI7PbK9WA5dze3QW7dFF9rkIJ20uYVwBlgUsIc8uxkCXjo0C2u50kAE0fostT1Omzgifmp3DXR02F3zBRu3o9Xl0ob9a96LnUU0tGnDNs8rXlrRKLguG4sjr4NgsVNYxoUkIh8qBKYh0mZHug'
    },
    {
      id: 'ba2',
      name: 'Coca-Cola Zero Sugar Can',
      unit: '300ml',
      price: 40,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4sEB7Rk0_wQNEw142L_HelXRf1fow3lFVQ2aZlOP6vpr3mOdtoovV1QUF6-QbmoI5L2R2ugard1QiMf9DL5Aac2aCRo6yQZ6r3KjHAOnsdJJROrIvH4l3Ex5ayNaLc6FC2Zn9vpQTsCQ-e6PmtFsAhc7hee7YfLB0P6v2yDNE89aWxZfqXRF6DRqSQED3iTciVYB27vau0tAcVfd7oxfKlMJYfi9l_qr81nusGhDf8UcbRid0G6TOIw'
    },
    {
      id: 'ba3',
      name: 'Country Delight Pure Cow Milk',
      unit: '500ml',
      price: 39,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMD55t9ZddRhIU0UqLYIXRqdk051CukW7SDylxc9LrdwD2VtWkoefafhFzlw0AOHEtIIR85HZ8-ORzVP-rBffTJBHeJZ4ntpXiyInPkMRJD-86uD2XN_g5dfQsbQ3IL37BpiWtKDz5q5ySFlRgahc5s203qOA7Z9cgG2o_eIPACjteL5EYPktq804NYr0wVm27Z2J2M9HkNnhk5bWUqjTgn5i1CTVG2JTI3iYRqyJ7MOr5oyYnNlh59A'
    }
  ];

  const trendingItems = [
    {
      id: 't1',
      name: "Kwality Wall's Chocolate Feast",
      unit: '70ml',
      price: 45,
      eta: '8 MINS',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSxb_ATNPvq_L7FtelWnXSAkaL5QbJy8wR68bi2snpTdP8fTpZJQUd_xaP8dLipZQUjC7aLI0evn7kfPN5Mos2aDbCSwTueTC-CcDO6PjuQTmgjqk9nR-ZBqac1XNaHff6R_r0HADV_nNC4uQ4DKhg1HvcEiswM1LtU87eYdWF_VRQNtYkjSwBya_Ee6AVGgVuQE1Drkpco8-wTfM9dLXgmNU4v1K3hORtLzXM4jNKA2o77q1bl8dfDw'
    },
    {
      id: 't2',
      name: 'Baskin Robbins Mississippi Mud',
      unit: '450ml',
      price: 320,
      originalPrice: 375,
      discount: '15% OFF',
      eta: '10 MINS',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbzB4fHa-tIPnnB4WyyoKzGUpRnK4LiXoL6HULXkx76R5uT1rfTRO9By8D37Qwxiu7E1oW3kveeed4aYBfzBSCqpfRYXImD_mpnU5tvwu1gOtpjpKX6c4sqFZiIIyP1f5C8-1zKh20kJrGIxobEUbYwiulaQK14UzElczGIqvmQZRbITSFYbz41JdnIpIMJMjdWGG228uKRipL9p5cqkTQvKsjczm4X2wVJbzm6S5i48SfRqLZ7l3LvA'
    },
    {
      id: 't3',
      name: 'Wingreens Farms Garlic Dip',
      unit: '150g',
      price: 120,
      eta: '9 MINS',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5mPfTCUrOFqSdLCxJ3yi5ld4T3i7qeGntha05NIfjnFtTIpdUInUuz94DTPUkEriPEJqif3cAoqBfHu6ggXGoGOfPZjTqRNYBO4Tr-WxPLjHngFBOXbJyr85cdwOcsNp_pzaFEWHvUwxqqrDlkmjTJsxIDNNTfljQWN7VBHKBY6CdX6YcnUeKJbyS0YFmxlU-LdM-L6_ZWhHVUr9Wuif7XZVaHhn0nxjUMc3HLr3-BvJ18fce3my4-w'
    },
    {
      id: 't4',
      name: 'Epigamia Greek Yogurt Berry',
      unit: '90g',
      price: 50,
      eta: '12 MINS',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0fPbMVXOEw1fbk7r2rKAlEhW9vCtqr8l9dcfD0BXYaO7clzhlOuNfNbZPv_tnb3gBw_stSlezbwSrwjmCKYHBOyvwUDmLCV-eFFQELNKtNGkIVXxwGT2PQOmH9D-uZSoPzcBCIYqeus9_zIcY-PfrnQZYgiWb6avAVHambmpPnCeTUxaOoaj5JNQiSXNwpD8pvu1dyO1RbQvw295tkqLv0Qb694jn3KIGO54sjHsXvpZk4s4JAYE66g'
    }
  ];

  const getItemQty = (id: string) => {
    const item = cart.find((c) => c.product.id === id);
    return item ? item.quantity : 0;
  };

  const handleAddOrIncrement = (prod: { id: string; name: string; price: number; originalPrice?: number; img: string; unit: string }) => {
    const fullProduct = products.find((p) => p.id === prod.id) || {
      id: prod.id,
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      image: prod.img,
      unit: prod.unit,
      category: 'dairy',
      subCategory: 'milk',
      inStock: true,
      stockCount: 50,
      description: prod.name,
      rating: 4.8,
      reviewCount: 120,
      discountPercentage: prod.originalPrice ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100) : 0
    };
    addToCart(fullProduct);
  };

  const handleOpenProduct = (prod: { id: string; name: string; price: number; originalPrice?: number; img: string; unit: string }) => {
    const fullProduct = products.find((p) => p.id === prod.id) || {
      id: prod.id,
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      image: prod.img,
      unit: prod.unit,
      category: 'dairy',
      subCategory: 'milk',
      inStock: true,
      stockCount: 50,
      description: prod.name,
      rating: 4.8,
      reviewCount: 120,
      discountPercentage: prod.originalPrice ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100) : 0
    };
    setSelectedProduct(fullProduct);
    setShowProductDetail(true);
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-2 animate-fadeIn font-sans">
      {/* Search Results Display */}
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
            <div className="text-center py-10 bg-white rounded-2xl p-6 shadow-2xs">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="font-bold text-[#131b2e] text-sm">No products matching "{searchQuery}"</p>
              <p className="text-xs text-[#6e797a] mt-1">Try searching for "Amul", "Milk", "Tata Salt", or "Mango"</p>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* 1. Daily Flash Sale Banner */}
          <div className="px-4 pb-3">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00676d] via-[#00828a] to-[#994700] p-4 text-white shadow-md">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#fb7800]/20 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[#ffb68b] text-[14px]">bolt</span>
                  <span className="text-[10px] font-extrabold tracking-wide uppercase text-white">12-MIN DELIVERY</span>
                </div>
                <div className="flex items-center gap-1 bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-[#ffdbc8]">
                  <span className="material-symbols-outlined text-[12px]">timer</span>
                  <span>{hours}h : {minutes}m : {seconds}s</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1 max-w-[65%]">
                  <h2 className="text-xl font-extrabold leading-tight text-white">
                    Daily Flash Sale
                  </h2>
                  <p className="text-[11px] text-[#e2e7ff] line-clamp-2">
                    Up to 50% OFF on Morning Essentials &amp; Dairy
                  </p>
                  <div className="pt-1.5">
                    <button 
                      onClick={() => {
                        setActiveCategory('dairy');
                        setActiveTab('category_detail');
                      }}
                      className="bg-[#fb7800] text-white text-[12px] font-bold px-3 py-1.5 rounded-full shadow-md active:scale-95 transition-transform flex items-center gap-1"
                    >
                      <span>Shop Deals</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  </div>
                </div>

                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <img 
                    className="w-full h-full object-contain drop-shadow-lg" 
                    alt="3D Groceries Composition" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGWkqSRBmEOoXZGkbI0Oyl5Z-2h7N8KlfcNhk6cQhXMYeBwQX_pKC0yuGCa2VVwtSuvSBmgxGYNOgNUdBz_XJ1rNQ5Q4nyCX-I1QVixlMoeEbhOPaz5CsJ2N-TStsLfBJghnlsDC4RoAMnyHtxzflS6NQf67tYo6wDEF-5_P4GZN2FOMZvMyrLtxB1dzJRAAzvTQFGs5IRMpBnkq_tiZHqE7fjx-BwqRRZRSfqfhcXRDS-XwbFxp_i1Q" 
                  />
                </div>
              </div>
            </div>

            {/* Instant Cashback Ribbon */}
            <div className="mt-2 bg-[#f2f3ff] rounded-xl px-3.5 py-2 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[#fb7800] text-[16px] shrink-0">local_offer</span>
                <span className="text-[11px] font-semibold text-[#131b2e] truncate">₹100 Instant Cashback with Cred UPI &amp; HDFC Cards</span>
              </div>
              <span className="material-symbols-outlined text-[#6e797a] text-[16px] shrink-0">chevron_right</span>
            </div>
          </div>

          {/* 2. Explore Categories (8 grid) */}
          <div className="px-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#131b2e]">Explore Categories</h3>
              <button 
                onClick={() => setActiveTab('categories')}
                className="text-xs font-bold text-[#00676d] hover:underline"
              >
                See All (24)
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => (
                <div 
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSubCategoryFilter('All');
                    setActiveTab('category_detail');
                  }}
                  className="flex flex-col items-center gap-1 text-center cursor-pointer group"
                >
                  <div className="relative w-16 h-16 rounded-2xl bg-[#f2f3ff] flex items-center justify-center p-1.5 group-active:scale-95 transition-transform">
                    {cat.badge && (
                      <span className="absolute -top-1 -right-1 bg-[#006a48] text-white text-[8px] font-extrabold px-1 rounded-full">
                        {cat.badge}
                      </span>
                    )}
                    <img className="w-12 h-12 object-contain" alt={cat.name} src={cat.img} />
                  </div>
                  <span className="text-[10px] leading-tight text-[#131b2e] font-semibold line-clamp-2 max-w-[70px]">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Flash Deals of the Day (Horizontal snap shelf) */}
          <div className="py-1 mb-4">
            <div className="px-4 flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#fb7800] text-[20px]">bolt</span>
                <h3 className="text-sm font-bold text-[#131b2e]">Flash Deals of the Day</h3>
              </div>
              <span 
                onClick={() => {
                  setActiveCategory('dairy');
                  setActiveTab('category_detail');
                }}
                className="text-xs font-semibold text-[#00676d] cursor-pointer"
              >
                View all
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none snap-x snap-mandatory">
              {flashDealsList.map((item) => {
                const qty = getItemQty(item.id);
                return (
                  <div 
                    key={item.id}
                    className="w-40 shrink-0 snap-start bg-white rounded-2xl p-2.5 shadow-sm flex flex-col justify-between border border-[#eaedff]"
                  >
                    <div 
                      onClick={() => handleOpenProduct(item)}
                      className="cursor-pointer"
                    >
                      <div className="relative w-full aspect-square rounded-xl bg-[#f2f3ff] p-2 flex items-center justify-center mb-2">
                        {item.eta && (
                          <span className="absolute top-1.5 left-1.5 bg-[#006a48]/10 text-[#006a48] text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[10px]">bolt</span>{item.eta}
                          </span>
                        )}
                        {item.tag && (
                          <span className="absolute top-1.5 left-1.5 bg-[#994700] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">
                            {item.tag}
                          </span>
                        )}
                        <img className="w-24 h-24 object-contain" alt={item.name} src={item.img} />
                        {item.discount && (
                          <span className="absolute bottom-1.5 left-1.5 bg-[#00676d] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                            {item.discount}
                          </span>
                        )}
                      </div>
                      <h4 className="text-[12px] font-semibold text-[#131b2e] line-clamp-2 leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-[#6e797a] mt-0.5">{item.unit}</p>
                    </div>

                    <div className="mt-2 pt-1 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-extrabold text-[#131b2e]">₹{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-[10px] line-through text-[#6e797a] ml-1">₹{item.originalPrice}</span>
                        )}
                      </div>

                      {qty === 0 ? (
                        <button 
                          onClick={() => handleAddOrIncrement(item)}
                          className="bg-[#f2f3ff] text-[#00676d] text-[11px] font-extrabold px-3 py-1 rounded-full shadow-2xs hover:bg-[#eaedff] transition-all"
                        >
                          ADD
                        </button>
                      ) : (
                        <div className="flex items-center bg-[#00676d] text-white rounded-full px-1 py-0.5 shadow-xs">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="w-5 h-5 flex items-center justify-center text-white font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="px-1.5 text-[11px] font-bold">{qty}</span>
                          <button 
                            onClick={() => handleAddOrIncrement(item)}
                            className="w-5 h-5 flex items-center justify-center text-white font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Buy Again (Delivered in last 7 days) */}
          <div className="px-4 mb-4">
            <div className="bg-[#f2f3ff] rounded-2xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#00676d] text-[18px]">history</span>
                  <div>
                    <h3 className="text-xs font-bold text-[#131b2e]">Buy Again</h3>
                    <p className="text-[10px] text-[#6e797a]">Delivered to you in last 7 days</p>
                  </div>
                </div>
                <button 
                  onClick={() => buyAgainItems.forEach((b) => handleAddOrIncrement(b))}
                  className="text-xs font-bold text-[#00676d] hover:underline"
                >
                  Repeat All
                </button>
              </div>

              <div className="space-y-1.5">
                {buyAgainItems.map((item) => {
                  const qty = getItemQty(item.id);
                  return (
                    <div key={item.id} className="flex items-center justify-between bg-white rounded-xl p-2 shadow-2xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-11 h-11 rounded-lg bg-[#f2f3ff] flex items-center justify-center p-1 shrink-0">
                          <img className="w-9 h-9 object-contain" alt={item.name} src={item.img} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#131b2e] truncate">{item.name}</p>
                          <p className="text-[10px] text-[#6e797a]">{item.unit} • ₹{item.price}</p>
                        </div>
                      </div>

                      {qty === 0 ? (
                        <button 
                          onClick={() => handleAddOrIncrement(item)}
                          className="bg-[#f2f3ff] text-[#00676d] text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs hover:bg-[#eaedff] shrink-0"
                        >
                          + ADD
                        </button>
                      ) : (
                        <div className="flex items-center bg-[#00676d] text-white rounded-full px-1 py-0.5 shadow-xs shrink-0">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="w-5 h-5 flex items-center justify-center text-white font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="px-1 text-[11px] font-bold">{qty}</span>
                          <button 
                            onClick={() => handleAddOrIncrement(item)}
                            className="w-5 h-5 flex items-center justify-center text-white font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5. Trending in Bellandur & HSR */}
          <div className="px-4 pb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#fb7800] text-[18px]">trending_up</span>
                <div>
                  <h3 className="text-sm font-bold text-[#131b2e]">Trending in Bellandur &amp; HSR</h3>
                  <p className="text-[10px] text-[#6e797a]">Popular picks around your neighbourhood</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {trendingItems.map((item) => {
                const qty = getItemQty(item.id);
                return (
                  <div key={item.id} className="bg-white rounded-2xl p-2.5 shadow-sm flex flex-col justify-between border border-[#eaedff]">
                    <div 
                      onClick={() => handleOpenProduct(item)}
                      className="cursor-pointer"
                    >
                      <div className="relative w-full aspect-square rounded-xl bg-[#f2f3ff] p-2 flex items-center justify-center mb-1.5">
                        <span className="absolute top-1 left-1 bg-[#006a48]/10 text-[#006a48] text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                          {item.eta}
                        </span>
                        <img className="w-24 h-24 object-contain" alt={item.name} src={item.img} />
                        {item.discount && (
                          <span className="absolute bottom-1 left-1 bg-[#00676d] text-white text-[8px] font-bold px-1 py-0.2 rounded">
                            {item.discount}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-semibold text-[#131b2e] line-clamp-2 leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-[#6e797a] mt-0.5">{item.unit}</p>
                    </div>

                    <div className="mt-2 pt-1 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-extrabold text-[#131b2e]">₹{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-[10px] line-through text-[#6e797a] ml-1">₹{item.originalPrice}</span>
                        )}
                      </div>

                      {qty === 0 ? (
                        <button 
                          onClick={() => handleAddOrIncrement(item)}
                          className="bg-[#f2f3ff] text-[#00676d] text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs hover:bg-[#eaedff]"
                        >
                          ADD
                        </button>
                      ) : (
                        <div className="flex items-center bg-[#00676d] text-white rounded-full px-1 py-0.5 shadow-xs">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="w-5 h-5 flex items-center justify-center text-white font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="px-1 text-[11px] font-bold">{qty}</span>
                          <button 
                            onClick={() => handleAddOrIncrement(item)}
                            className="w-5 h-5 flex items-center justify-center text-white font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

