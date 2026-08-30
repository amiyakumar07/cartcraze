import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, Order, UserProfile, ActiveTab } from '../types';
import confetti from 'canvas-confetti';
import { createOrderApi } from '../services/api';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeCategory: string;
  setActiveCategory: (catId: string) => void;
  subCategoryFilter: string;
  setSubCategoryFilter: (subCat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: { code: string; discount: number } | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  tipAmount: number;
  setTipAmount: (amount: number) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  orderHistory: Order[];
  placeOrder: (paymentMethod: string, address: string, addressDetails?: {
    fullName?: string;
    phone?: string;
    pincode?: string;
    village?: string;
    street?: string;
    landmark?: string;
    lat?: number;
    lon?: number;
  }) => Order;
  isPhoneFrame: boolean;
  setIsPhoneFrame: (frame: boolean) => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  getFinalPayAmount: () => number;
  logoutUser: () => void;
  isOutOfCoverageRange: boolean;
  setIsOutOfCoverageRange: (val: boolean) => void;
  userCoords: { lat: number; lon: number };
  setUserCoords: (coords: { lat: number; lon: number }) => void;
  checkStoreCoverage: (lat?: number, lon?: number) => Promise<boolean>;
  products: Product[];
  activeStore: any | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('onboarding');
  const [activeCategory, setActiveCategory] = useState<string>('fruits');
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [tipAmount, setTipAmount] = useState<number>(0);

  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  // Default to TRUE (Coverage OFF / Coming Soon Screen ACTIVE until an approved store within 5km is verified)
  const [isOutOfCoverageRange, setIsOutOfCoverageRange] = useState<boolean>(true);
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number }>({ lat: 12.9141, lon: 77.6411 });

  // User defaults to NOT logged in (Guest Mode)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    phone: '',
    email: '',
    address: 'HSR Layout Sector 1, Bengaluru',
    walletBalance: 0,
    freshCoins: 0,
    savedAddresses: [],
    isLoggedIn: false
  });

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [activeStore, setActiveStore] = useState<any | null>(null);

  // DYNAMIC 5KM STORE COVERAGE ALGORITHM CHECK
  const checkStoreCoverage = async (lat?: number, lon?: number): Promise<boolean> => {
    const targetLat = lat ?? userCoords.lat;
    const targetLon = lon ?? userCoords.lon;
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const res = await fetch(`http://${hostname}:4000/api/products/nearby?lat=${targetLat}&lon=${targetLon}&radiusKm=5.0`);
      const data = await res.json();
      if (data && data.success && data.inCoverageRange === true && Array.isArray(data.nearbyShops) && data.nearbyShops.length > 0) {
        setIsOutOfCoverageRange(false);
        setActiveStore(data.nearbyShops[0]);
        const shopsMap = new Map((data.nearbyShops || []).map((s: any) => [s.id, s.name]));
        const defaultShopName = data.nearbyShops[0]?.name || 'Fresh Valley Market';

        const mapped = (data.products || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          shopId: p.shopId || data.nearbyShops[0]?.id || 'shop-auto',
          shopName: p.shopName || shopsMap.get(p.shopId) || defaultShopName,
          category: (p.category || 'fruits').toLowerCase(),
          subCategory: p.subCategory || 'All',
          price: Number(p.price),
          originalPrice: Number(p.originalPrice) || Number(p.price),
          weight: p.weight || '1 unit',
          image: p.image || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=300&q=80',
          discountPercentage: p.discountPercentage || Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) || 0,
          rating: p.rating || 4.5,
          reviewsCount: p.reviewsCount || 10,
          inStock: p.inStock ?? (p.stockCount > 0),
          deliveryTimeMinutes: 9,
          description: p.description || p.name,
          shelfLife: p.shelfLife || '5 Days',
          origin: p.origin || 'India',
          storage: p.storage || 'Cool dry place'
        }));
        setProducts(mapped);
        return true;
      } else {
        setIsOutOfCoverageRange(true);
        setProducts([]);
        setActiveStore(null);
        return false;
      }
    } catch (err) {
      console.error('Store coverage check error:', err);
      setIsOutOfCoverageRange(true);
      setProducts([]);
      setActiveStore(null);
      return false;
    }
  };

  useEffect(() => {
    checkStoreCoverage(userCoords.lat, userCoords.lon);
    const interval = setInterval(() => {
      checkStoreCoverage(userCoords.lat, userCoords.lon);
    }, 4000);
    return () => clearInterval(interval);
  }, [userCoords]);

  // Poll backend for real-time status update of current active order (DELIVERED, PICKED_UP, etc.)
  useEffect(() => {
    if (!currentOrder) return;

    const pollOrderStatus = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/orders');
        const data = await res.json();
        if (Array.isArray(data)) {
          const match = data.find((o: any) => o.id === currentOrder.id);
          if (match && match.status && match.status !== currentOrder.status) {
            console.log(`[User AppContext] Syncing Order ${match.id} status: ${match.status}`);
            setCurrentOrder((prev) => prev ? { ...prev, status: match.status } : null);
          }
        }
      } catch {
        // silent polling catch
      }
    };

    pollOrderStatus();
    const interval = setInterval(pollOrderStatus, 2500);
    return () => clearInterval(interval);
  }, [currentOrder?.id, currentOrder?.status]);

  // Intercept Add to Cart if user is NOT logged in
  const addToCart = (product: Product) => {
    if (!userProfile.isLoggedIn) {
      setSelectedProduct(null);
      setActiveTab('login');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    if (!userProfile.isLoggedIn && delta > 0) {
      setActiveTab('login');
      return;
    }
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const logoutUser = () => {
    setUserProfile((prev) => ({ ...prev, isLoggedIn: false }));
    clearCart();
    setActiveTab('login');
  };

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'QUICK50') {
      setAppliedCoupon({ code: 'QUICK50', discount: 50 });
      return true;
    } else if (clean === 'FRESH20') {
      const itemTotal = getCartTotal();
      const discount = Math.round(itemTotal * 0.2);
      setAppliedCoupon({ code: 'FRESH20', discount });
      return true;
    }
    return false;
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  const getCartTotal = () =>
    cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const getFinalPayAmount = () => {
    const itemTotal = getCartTotal();
    const deliveryFee = itemTotal >= 199 ? 0 : 25;
    const handlingFee = 5;
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const total = Math.max(0, itemTotal + deliveryFee + handlingFee + tipAmount - discount);
    return total;
  };

  const placeOrder = (paymentMethod: string, address: string, addressDetails?: {
    fullName?: string;
    phone?: string;
    pincode?: string;
    village?: string;
    street?: string;
    landmark?: string;
    lat?: number;
    lon?: number;
  }): Order => {
    const itemTotal = getCartTotal();
    const deliveryFee = itemTotal >= 199 ? 0 : 25;
    const handlingFee = 5;
    const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
    const finalTotal = getFinalPayAmount();
    const uniqueOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newOrder: Order = {
      id: 'QM-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      otp: uniqueOtp,
      items: [...cart],
      itemTotal,
      deliveryFee,
      handlingFee,
      discountAmount,
      tipAmount,
      finalTotal,
      status: 'PLACED',
      deliveryAddress: address || userProfile.address,
      paymentMethod,
      estimatedDeliveryMinutes: 9,
      timeline: [
        { title: 'Order Placed', description: 'Store accepted your order', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true, current: false },
        { title: 'Packing Items', description: 'Executive is packing your bag', time: 'Starting now', completed: false, current: true },
        { title: 'On the Way', description: 'Rider is coming to your address', time: 'Est. 4 mins', completed: false, current: false },
        { title: 'Delivered', description: 'Order handed to you', time: 'Est. 9 mins', completed: false, current: false }
      ],
    };

    createOrderApi({
      ...newOrder,
      customerName: addressDetails?.fullName || userProfile.name,
      customerPhone: addressDetails?.phone || userProfile.phone,
      customerLat: addressDetails?.lat || userCoords.lat,
      customerLon: addressDetails?.lon || userCoords.lon,
      pincode: addressDetails?.pincode || '560102',
      village: addressDetails?.village || 'HSR Layout',
      street: addressDetails?.street || '',
      landmark: addressDetails?.landmark || ''
    });

    setCurrentOrder(newOrder);
    setOrderHistory((prev) => [newOrder, ...prev]);

    if (addressDetails?.fullName || addressDetails?.phone || address) {
      setUserProfile((prev) => ({
        ...prev,
        name: addressDetails?.fullName || prev.name,
        phone: addressDetails?.phone || prev.phone,
        address: address || prev.address
      }));
    }

    clearCart();

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered', e);
    }

    setActiveTab('order_confirmed');
    return newOrder;
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeCategory,
        setActiveCategory,
        subCategoryFilter,
        setSubCategoryFilter,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        couponCode,
        setCouponCode,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        tipAmount,
        setTipAmount,
        userProfile,
        setUserProfile,
        currentOrder,
        setCurrentOrder,
        orderHistory,
        placeOrder,
        isPhoneFrame,
        setIsPhoneFrame,
        getCartCount,
        getCartTotal,
        getFinalPayAmount,
        logoutUser,
        isOutOfCoverageRange,
        setIsOutOfCoverageRange,
        userCoords,
        setUserCoords,
        checkStoreCoverage,
        products,
        activeStore
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
