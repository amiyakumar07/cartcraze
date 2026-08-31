import { useState, useEffect, useRef } from 'react';
import type { StoreOrder, OrderStatus, InventoryItem, Rider } from './types';
import { MobileFrame } from './components/MobileFrame';
import { BottomNav, type ShopTab } from './components/BottomNav';
import { LoginScreen } from './pages/LoginScreen';
import { HomeScreen } from './pages/HomeScreen';
import { OrderDetailScreen } from './pages/OrderDetailScreen';
import { InventoryView } from './pages/InventoryView';
import { AnalyticsView } from './pages/AnalyticsView';
import { RidersView } from './pages/RidersView';
import { AddProductModal } from './components/AddProductModal';
import { NewOrderModal } from './components/NewOrderModal';
import { addNewProductApi } from './services/api';

import { ShopApprovalForm } from './pages/ShopApprovalForm';
import { ShopPendingApprovalScreen } from './pages/ShopPendingApprovalScreen';
import { LocationPermissionModal } from './components/LocationPermissionModal';
import { reverseGeocodeLocationIQ } from './services/locationiq';

const API = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:4000/api'
  : 'https://cartcraze-95gt.onrender.com/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedTs = localStorage.getItem('cartcraze_vendor_login_timestamp');
    if (savedTs && Date.now() - Number(savedTs) <= 72 * 60 * 60 * 1000) {
      return true;
    }
    return false;
  });
  const [shopData, setShopData] = useState<any>(() => {
    const saved = localStorage.getItem('cartcraze_shop_data');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });
  const [storeLocation, setStoreLocation] = useState<{ lat: number; lon: number; address: string } | null>(null);
  const [showLocModal, setShowLocModal] = useState(true);
  const [activeTab, setActiveTab] = useState<ShopTab>('orders');
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  // Data state
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);

  // UI state
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newOrderModal, setNewOrderModal] = useState<{ open: boolean; order: StoreOrder | null }>({
    open: false,
    order: null,
  });

  // Track last seen order IDs to detect new orders
  const seenOrderIds = useRef<Set<string>>(new Set());

  // ─── FETCH ORDERS ─────────────────────────────────────────────────────────
  const fetchLiveOrders = async () => {
    try {
      const res = await fetch(`${API}/orders`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);

        // Detect brand new orders → show modal
        const newOrders = data.filter(
          (o: StoreOrder) => o.status === 'NEW' && !seenOrderIds.current.has(o.id)
        );
        newOrders.forEach((o: StoreOrder) => seenOrderIds.current.add(o.id));
        if (newOrders.length > 0 && isStoreOpen && !newOrderModal.open) {
          setNewOrderModal({ open: true, order: newOrders[0] });
        }
      }
    } catch { /* silent */ }
  };

  // ─── FETCH INVENTORY ──────────────────────────────────────────────────────
  const fetchInventory = async () => {
    if (!shopData?.id) return;
    try {
      const res = await fetch(`${API}/products?shopId=${shopData.id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setInventory(data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category || 'General',
          price: p.price,
          originalPrice: p.originalPrice || p.price,
          weight: p.weight || '—',
          stockCount: p.stockCount ?? 10,
          inStock: p.inStock ?? true,
          image: p.image || '',
          barcode: p.barcode || `BC-${p.id}`,
          shelfLocation: p.shelfLocation || 'A-01',
        })));
      }
    } catch { /* silent */ }
  };

  // ─── FETCH RIDERS ─────────────────────────────────────────────────────────
  const fetchRiders = async () => {
    try {
      const res = await fetch(`${API}/riders`);
      const data = await res.json();
      if (Array.isArray(data)) setRiders(data);
      else if (data.riders) setRiders(data.riders);
    } catch { /* silent */ }
  };

  // ─── SHOP STATUS POLLER ───────────────────────────────────────────────────
  const checkShopStatus = async () => {
    try {
      const res = await fetch(`${API}/shops`);
      const data = await res.json();
      if (data.shops && data.shops.length > 0 && shopData?.id) {
        const found = data.shops.find(
          (s: any) =>
            s.id === shopData.id ||
            s.email === shopData.email ||
            s.name === shopData.name
        );
        if (found) {
          setShopData(found);
          localStorage.setItem('cartcraze_shop_data', JSON.stringify(found));
        }
      }
    } catch { /* silent */ }
  };

  // ─── 72-HOUR VENDOR SESSION AUTO-LOGOUT ───────────────────────────────────
  const SESSION_DURATION_MS = 72 * 60 * 60 * 1000; // 72 Hours (3 Days)

  const handleVendorLogout = () => {
    localStorage.removeItem('cartcraze_vendor_login_timestamp');
    localStorage.removeItem('cartcraze_shop_data');
    setIsLoggedIn(false);
    setShopData(null);
  };

  useEffect(() => {
    if (isLoggedIn) {
      const savedTs = localStorage.getItem('cartcraze_vendor_login_timestamp');
      if (!savedTs) {
        localStorage.setItem('cartcraze_vendor_login_timestamp', Date.now().toString());
      } else {
        const elapsed = Date.now() - Number(savedTs);
        if (elapsed > SESSION_DURATION_MS) {
          console.log('[Shop App] 72-hour vendor session limit reached. Auto logging out.');
          handleVendorLogout();
        }
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const interval = setInterval(() => {
      const savedTs = localStorage.getItem('cartcraze_vendor_login_timestamp');
      if (savedTs && Date.now() - Number(savedTs) > SESSION_DURATION_MS) {
        console.log('[Shop App] 72-hour vendor session expired. Auto logging out.');
        handleVendorLogout();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // ─── EFFECTS ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isLoggedIn) {
      fetchLiveOrders();
      const interval = setInterval(fetchLiveOrders, 2500);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      checkShopStatus();
      fetchRiders();
      const shopInterval = setInterval(checkShopStatus, 5000);
      const ridersInterval = setInterval(fetchRiders, 10000);
      return () => {
        clearInterval(shopInterval);
        clearInterval(ridersInterval);
      };
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && shopData?.id) {
      fetchInventory();
    }
    if (shopData?.id) {
      const lat = shopData.lat || storeLocation?.lat || 12.9141;
      const lon = shopData.lon || storeLocation?.lon || 77.6411;
      const address = shopData.address || storeLocation?.address || 'Sector 1, HSR Layout, Bengaluru';
      
      fetch(`${API}/shops/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId: shopData.id, lat, lon, address })
      }).catch(() => {});
    }
  }, [isLoggedIn, shopData?.id]);

  // ─── HANDLERS ─────────────────────────────────────────────────────────────
  const handleToggleInStock = (id: string) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inStock: !item.inStock } : item))
    );
    const target = inventory.find((i) => i.id === id);
    if (target) {
      fetch(`${API}/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !target.inStock, stockCount: target.stockCount }),
      }).catch(() => {});
    }
  };

  const handleUpdateStockCount = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextCount = Math.max(0, item.stockCount + delta);
          const nextInStock = nextCount > 0;
          fetch(`${API}/products/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inStock: nextInStock, stockCount: nextCount }),
          }).catch(() => {});
          return { ...item, stockCount: nextCount, inStock: nextInStock };
        }
        return item;
      })
    );
  };

  const handleAddProduct = async (newProd: Omit<InventoryItem, 'id'>) => {
    const created: InventoryItem = { id: `p-${Date.now()}`, ...newProd };
    setInventory((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    try {
      await addNewProductApi({ ...created, shopId: shopData?.id });
    } catch { /* silent */ }
  };

  const handleUpdateOrderStatus = async (id: string, nextStatus: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o)));
    try {
      await fetch(`${API}/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch { /* silent */ }
  };

  const handleToggleItemPick = (orderId: string, itemId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              items: o.items.map((item) =>
                item.id === itemId ? { ...item, picked: !item.picked } : item
              ),
            }
          : o
      )
    );
  };

  const handleAssignRider = async (orderId: string, riderId: string) => {
    const rider = riders.find((r) => r.id === riderId);
    if (!rider) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              assignedRider: {
                id: rider.id,
                name: rider.name,
                phone: rider.phone,
                photo: rider.photo,
              },
            }
          : o
      )
    );
    // Update riders status
    setRiders((prev) =>
      prev.map((r) =>
        r.id === riderId ? { ...r, status: 'DELIVERING', currentOrderId: orderId } : r
      )
    );
    try {
      await fetch(`${API}/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedRider: rider }),
      });
    } catch { /* silent */ }
  };

  const handleAcceptNewOrder = () => {
    if (newOrderModal.order) {
      handleUpdateOrderStatus(newOrderModal.order.id, 'PACKING');
      setSelectedOrder({ ...newOrderModal.order, status: 'PACKING' });
    }
    setNewOrderModal({ open: false, order: null });
  };

  const handleRejectNewOrder = () => {
    if (newOrderModal.order) {
      handleUpdateOrderStatus(newOrderModal.order.id, 'NEW');
    }
    setNewOrderModal({ open: false, order: null });
  };

  // ─── SCREENS ──────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <MobileFrame>
        <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
      </MobileFrame>
    );
  }

  if (!shopData) {
    return (
      <MobileFrame>
        <LocationPermissionModal
          isOpen={showLocModal}
          onClose={(coords) => {
            setShowLocModal(false);
            if (coords) setStoreLocation(coords);
          }}
        />
        <ShopApprovalForm
          initialLocation={storeLocation}
          onSubmitSuccess={(data) => {
            const updated = {
              ...data,
              lat: data.lat || storeLocation?.lat || 12.9141,
              lon: data.lon || storeLocation?.lon || 77.6411,
              address: data.address || storeLocation?.address || 'Sector 1, HSR Layout, Bengaluru'
            };
            setShopData(updated);
            localStorage.setItem('cartcraze_shop_data', JSON.stringify(updated));
            fetch(`${API}/shops/location`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ shopId: updated.id, lat: updated.lat, lon: updated.lon, address: updated.address })
            }).catch(() => {});
          }}
        />
      </MobileFrame>
    );
  }

  if (shopData.status === 'BLOCKED') {
    return (
      <MobileFrame>
        <div className="p-8 text-center bg-slate-950 text-slate-100 min-h-full flex flex-col justify-center items-center space-y-4 font-sans border border-red-900/50">
          <div className="w-16 h-16 rounded-3xl bg-red-950 text-red-400 border border-red-800 flex items-center justify-center text-2xl shadow-xl">
            🚫
          </div>
          <h2 className="text-lg font-black text-white">Shop Account Suspended</h2>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Your darkstore partner account has been suspended by Super Admin. Please contact{' '}
            <strong className="text-amber-400">admin@cartcraze.app</strong> for compliance review.
          </p>
        </div>
      </MobileFrame>
    );
  }

  if (shopData.status === 'PENDING_APPROVAL' || shopData.status === 'REJECTED') {
    return (
      <MobileFrame>
        <ShopPendingApprovalScreen
          shopData={shopData}
          onRefreshStatus={checkShopStatus}
          onApproved={() => {
            checkShopStatus();
          }}
        />
      </MobileFrame>
    );
  }

  const newOrdersCount = orders.filter((o) => o.status === 'NEW').length;

  const renderContent = () => {
    if (selectedOrder) {
      return (
        <OrderDetailScreen
          order={selectedOrder}
          riders={riders}
          onBack={() => setSelectedOrder(null)}
          onMarkReady={(id) => {
            handleUpdateOrderStatus(id, 'READY');
            setSelectedOrder(null);
          }}
          onToggleItemPick={handleToggleItemPick}
          onAssignRider={handleAssignRider}
        />
      );
    }

    switch (activeTab) {
      case 'orders':
        return (
          <HomeScreen
            isStoreOpen={isStoreOpen}
            setIsStoreOpen={setIsStoreOpen}
            orders={orders}
            onSelectOrder={(order) => setSelectedOrder(order)}
            onOpenTriggerModal={() => {
              const newOrder = orders.find((o) => o.status === 'NEW');
              if (newOrder) setNewOrderModal({ open: true, order: newOrder });
            }}
            shopData={shopData}
          />
        );

      case 'inventory':
        return (
          <div className="bg-[#f9f9f9] p-4 pb-36 min-h-screen">
            <InventoryView
              inventory={inventory}
              onToggleInStock={handleToggleInStock}
              onUpdateStockCount={handleUpdateStockCount}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          </div>
        );

      case 'riders':
        return (
          <div className="bg-[#f9f9f9] p-4 pb-36 min-h-screen">
            <RidersView riders={riders} onRefresh={fetchRiders} />
          </div>
        );

      case 'analytics':
        return (
          <div className="bg-[#f9f9f9] p-4 pb-36 min-h-screen">
            <AnalyticsView orders={orders} inventory={inventory} />
          </div>
        );

      case 'settings':
        return (
          <SettingsView
            shopData={shopData}
            isStoreOpen={isStoreOpen}
            onToggleStore={() => setIsStoreOpen((v) => !v)}
            onLogout={() => {
              setIsLoggedIn(false);
              setOrders([]);
              setIsStoreOpen(false);
            }}
            onUpdateLocation={(updated) => setShopData(updated)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <MobileFrame>
      {renderContent()}
      {!selectedOrder && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          newOrderCount={newOrdersCount}
        />
      )}

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <NewOrderModal
        isOpen={newOrderModal.open}
        order={newOrderModal.order}
        onAccept={handleAcceptNewOrder}
        onReject={handleRejectNewOrder}
      />
    </MobileFrame>
  );
}

// ─── SETTINGS VIEW ──────────────────────────────────────────────────────────
function SettingsView({
  shopData,
  isStoreOpen,
  onToggleStore,
  onLogout,
  onUpdateLocation,
}: {
  shopData: any;
  isStoreOpen: boolean;
  onToggleStore: () => void;
  onLogout: () => void;
  onUpdateLocation: (updated: any) => void;
}) {
  const [operatingHoursStart, setOperatingHoursStart] = useState('06:00');
  const [operatingHoursEnd, setOperatingHoursEnd] = useState('23:30');
  const [saved, setSaved] = useState(false);

  const [lat, setLat] = useState<number>(shopData?.lat || 12.9141);
  const [lon, setLon] = useState<number>(shopData?.lon || 77.6411);
  const [address, setAddress] = useState<string>(shopData?.address || 'Sector 1, HSR Layout, Bengaluru');
  const [locLoading, setLocLoading] = useState(false);
  const [locSaved, setLocSaved] = useState(false);

  const handleDetectGPS = () => {
    setLocLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const newLat = pos.coords.latitude;
          const newLon = pos.coords.longitude;
          setLat(newLat);
          setLon(newLon);
          try {
            const geo = await reverseGeocodeLocationIQ(newLat, newLon);
            if (geo?.address) setAddress(geo.address);
          } catch { /* silent */ }
          setLocLoading(false);
        },
        async () => {
          setLat(12.9141);
          setLon(77.6411);
          setLocLoading(false);
        }
      );
    } else {
      setLocLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    setLocLoading(true);
    const updated = {
      ...shopData,
      lat: Number(lat),
      lon: Number(lon),
      address
    };

    try {
      await fetch(`${API}/shops/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId: shopData?.id || 'shop-auto',
          lat: Number(lat),
          lon: Number(lon),
          address
        })
      });
    } catch { /* silent */ }

    localStorage.setItem('cartcraze_shop_data', JSON.stringify(updated));
    onUpdateLocation(updated);
    setLocLoading(false);
    setLocSaved(true);
    setTimeout(() => setLocSaved(false), 2500);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-[#f9f9f9] p-4 pb-36 min-h-screen font-sans space-y-4">
      {/* Store Info Card */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
          <span className="w-7 h-7 bg-[#ffc800] rounded-xl flex items-center justify-center text-base">🏪</span>
          Store Profile
        </h2>
        <div className="space-y-2.5 text-xs">
          {[
            { label: 'Store Name', value: shopData?.name || 'My Darkstore' },
            { label: 'Darkstore ID', value: shopData?.id || 'DS-AUTO' },
            { label: 'Email', value: shopData?.email || '—' },
            { label: 'Phone', value: shopData?.phone || '—' },
            { label: 'Address', value: shopData?.address || address || '—' },
            { label: 'GPS Coordinates', value: `${shopData?.lat || lat}, ${shopData?.lon || lon}` },
            { label: 'License', value: `${shopData?.licenseType || 'Trade License'} · ${shopData?.licenseNumber || '—'}` },
            { label: 'Status', value: shopData?.status || 'APPROVED' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
              <span className="font-bold text-gray-500">{label}</span>
              <span className="font-bold text-gray-900 text-right max-w-[55%] break-all">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Darkstore GPS & Location Controls */}
      <div className="bg-white p-5 rounded-3xl border border-amber-200/60 shadow-xs space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 bg-amber-400 text-black rounded-xl flex items-center justify-center text-base font-bold">📍</span>
            Darkstore GPS Location
          </h2>
          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={locLoading}
            className="text-[11px] bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
          >
            <span>{locLoading ? 'Detecting...' : '📡 Detect Device GPS'}</span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <label className="text-[11px] font-bold text-gray-500 block mb-1">Darkstore Address (LocationIQ)</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs font-mono font-bold text-gray-800 outline-none focus:border-amber-400 leading-snug resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Latitude</label>
              <input
                type="number"
                step="0.000001"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-gray-800 outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Longitude</label>
              <input
                type="number"
                step="0.000001"
                value={lon}
                onChange={(e) => setLon(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-gray-800 outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveLocation}
            disabled={locLoading}
            className={`w-full text-xs font-black py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              locSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-sm'
            }`}
          >
            <span>{locSaved ? '✅ GPS Location Synced to Server!' : '🚀 Save & Broadcast Store GPS to Server'}</span>
          </button>
        </div>
      </div>

      {/* Store Open/Close */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h2 className="text-sm font-black text-gray-900">Store Status</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-black ${isStoreOpen ? 'text-emerald-600' : 'text-red-500'}`}>
              {isStoreOpen ? '🟢 Currently Open' : '🔴 Currently Closed'}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {isStoreOpen ? 'Accepting customer orders' : 'No orders being accepted'}
            </p>
          </div>
          <button
            onClick={onToggleStore}
            className={`w-14 h-8 rounded-full transition-colors duration-300 p-1 flex items-center ${
              isStoreOpen ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isStoreOpen ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h2 className="text-sm font-black text-gray-900">Operating Hours</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600">Opening Time</label>
            <input
              type="time"
              value={operatingHoursStart}
              onChange={(e) => setOperatingHoursStart(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-[#ffc800]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600">Closing Time</label>
            <input
              type="time"
              value={operatingHoursEnd}
              onChange={(e) => setOperatingHoursEnd(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-[#ffc800]"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`w-full text-xs font-black py-3 rounded-xl transition cursor-pointer ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-[#ffc800] hover:bg-yellow-400 text-black'
          }`}
        >
          {saved ? '✅ Saved Successfully!' : 'Save Operating Hours'}
        </button>
      </div>

      {/* Delivery SLA */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-2.5 text-xs">
        <h2 className="text-sm font-black text-gray-900">Delivery Configuration</h2>
        {[
          { label: 'Delivery SLA', value: '9-Minute Express' },
          { label: 'Coverage Radius', value: '5 km from Darkstore' },
          { label: 'Delivery Partner', value: 'CartCraze EV Scooter Fleet' },
          { label: 'Min Order Value', value: '₹49' },
          { label: 'Delivery Fee', value: '₹25 (Free above ₹199)' },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
            <span className="font-bold text-gray-500">{label}</span>
            <span className="font-bold text-gray-900">{value}</span>
          </div>
        ))}
      </div>

      {/* Register New Shop Application */}
      <button
        onClick={() => {
          localStorage.removeItem('cartcraze_shop_data');
          onUpdateLocation(null);
        }}
        className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs p-4 rounded-3xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
      >
        <span>📝 Submit New Store Registration &amp; License Document</span>
      </button>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full bg-white p-4 rounded-3xl border border-red-200 text-red-500 font-black text-xs shadow-xs hover:bg-red-50 transition cursor-pointer"
      >
        🚪 Logout from Store Dashboard
      </button>
    </div>
  );
}
