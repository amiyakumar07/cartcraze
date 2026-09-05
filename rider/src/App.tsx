import React, { useState, useEffect, useCallback } from 'react';
import { fetchAssignedOrdersApi, updateOrderStatusApi } from './services/api';
import type { RiderOrder, RiderProfile, AppTab, RiderApprovalData } from './types';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useRiderLocation } from './hooks/useRiderLocation';
import { API_BASE, RIDER_STORAGE_KEY, RIDER_SESSION_KEY, SESSION_DURATION_MS } from './config/api';
import { LoginScreen } from './pages/LoginScreen';
import { HomeScreen } from './pages/HomeScreen';
import { ActiveDeliveryScreen } from './pages/ActiveDeliveryScreen';
import { EarningsScreen } from './pages/EarningsScreen';
import { RatingsScreen } from './pages/RatingsScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { MobileFrame } from './components/layout/MobileFrame';
import { BottomNav } from './components/layout/BottomNav';
import { RiderApprovalForm } from './pages/RiderApprovalForm';
import { RiderPendingApprovalScreen } from './pages/RiderPendingApprovalScreen';
import { LocationPermissionModal } from './components/LocationPermissionModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('orders');
  const { dutyStatus, isOnDuty, setDuty } = useOnlineStatus();
  const [activeOrder, setActiveOrder] = useState<RiderOrder | null>(null);
  const [apiError, setApiError] = useState(false);
  const [riderApprovalData, setRiderApprovalData] = useState<RiderApprovalData | null>(() => {
    const saved = localStorage.getItem(RIDER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [showRiderLocModal, setShowRiderLocModal] = useState(true);
  const { coords: riderGpsCoords } = useRiderLocation({ enabled: isOnDuty });

  const [riderProfile, setRiderProfile] = useState<RiderProfile>(() => {
    const savedTs = localStorage.getItem(RIDER_SESSION_KEY);
    const savedData = localStorage.getItem(RIDER_STORAGE_KEY);
    const isLogged = savedTs ? Date.now() - Number(savedTs) <= SESSION_DURATION_MS : false;
    let savedObj: Partial<RiderApprovalData> = {};
    try { if (savedData) savedObj = JSON.parse(savedData); } catch {}

    return {
      id: savedObj.id || '',
      name: savedObj.name || '',
      phone: savedObj.phone || '',
      vehicleNumber: savedObj.vehicleNumber || '',
      rating: 5.0,
      totalDeliveries: 0,
      todayDeliveries: 0,
      todayEarnings: 0,
      isLoggedIn: isLogged,
      photo: '',
    };
  });

  // Sync approved rider data
  useEffect(() => {
    if (riderApprovalData?.status === 'APPROVED' && riderProfile.isLoggedIn) {
      setRiderProfile(prev => ({
        ...prev,
        id: riderApprovalData.id || prev.id,
        name: riderApprovalData.name || prev.name,
        phone: riderApprovalData.phone || prev.phone,
        vehicleNumber: riderApprovalData.vehicleNumber || prev.vehicleNumber,
      }));
    }
  }, [riderApprovalData?.status, riderProfile.isLoggedIn]);

  // Check rider status
  const checkRiderStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/riders`);
      const data = await res.json();
      if (data.riders?.length > 0) {
        const found = data.riders.find((r: any) => 
          r.id === riderApprovalData?.id || r.phone === riderApprovalData?.phone
        );
        if (found) {
          setRiderApprovalData(found);
          localStorage.setItem(RIDER_STORAGE_KEY, JSON.stringify(found));
        }
      }
    } catch { /* silent */ }
  }, [riderApprovalData?.id, riderApprovalData?.phone]);

  // Session management
  const handleRiderLogout = useCallback(() => {
    localStorage.removeItem(RIDER_SESSION_KEY);
    localStorage.removeItem(RIDER_STORAGE_KEY);
    setRiderProfile(prev => ({ ...prev, isLoggedIn: false }));
    setActiveOrder(null);
    setDuty('OFF_DUTY');
  }, [setDuty]);

  useEffect(() => {
    if (!riderProfile.isLoggedIn) return;
    const savedTs = localStorage.getItem(RIDER_SESSION_KEY);
    if (!savedTs) {
      localStorage.setItem(RIDER_SESSION_KEY, Date.now().toString());
    } else if (Date.now() - Number(savedTs) > SESSION_DURATION_MS) {
      handleRiderLogout();
    }
  }, [riderProfile.isLoggedIn, handleRiderLogout]);

  useEffect(() => {
    if (!riderProfile.isLoggedIn) return;
    const interval = setInterval(() => {
      const savedTs = localStorage.getItem(RIDER_SESSION_KEY);
      if (savedTs && Date.now() - Number(savedTs) > SESSION_DURATION_MS) {
        handleRiderLogout();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [riderProfile.isLoggedIn, handleRiderLogout]);

  // Poll rider status
  useEffect(() => {
    if (!riderProfile.isLoggedIn) return;
    checkRiderStatus();
    const interval = setInterval(checkRiderStatus, 3000);
    return () => clearInterval(interval);
  }, [riderProfile.isLoggedIn, checkRiderStatus]);

  // GPS location push
  useEffect(() => {
    if (!riderProfile.isLoggedIn || !isOnDuty || !riderGpsCoords) return;

    const sendUpdate = async () => {
      try {
        await fetch(`${API_BASE}/locationiq/update-rider-location`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            riderId: riderProfile.id || 'rider-live',
            riderName: riderProfile.name || 'Rider',
            phone: riderProfile.phone || '',
            vehicleNumber: riderProfile.vehicleNumber || '',
            lat: riderGpsCoords.lat,
            lon: riderGpsCoords.lon,
            status: activeOrder ? 'EN_ROUTE' : 'ONLINE'
          })
        });
      } catch { /* silent */ }
    };

    sendUpdate();
    const interval = setInterval(sendUpdate, 4000);
    return () => clearInterval(interval);
  }, [riderProfile, riderGpsCoords, isOnDuty, activeOrder]);

  // Fetch live orders
  const fetchLiveOrders = useCallback(async () => {
    if (!isOnDuty) return;
    try {
      const res = await fetch(`${API_BASE}/orders`);
      const data = await res.json();
      setApiError(false);

      if (Array.isArray(data) && data.length > 0) {
        const latest = data[0];
        const formatted: RiderOrder = {
          id: latest.id,
          customerName: latest.customerName || 'Customer',
          customerPhone: latest.customerPhone || '+91 98765 43210',
          deliveryAddress: latest.deliveryAddress || 'Sector 1, HSR Layout, Bengaluru',
          customerLat: parseFloat(latest.customerLat) || 12.9141,
          customerLon: parseFloat(latest.customerLon) || 77.6411,
          pincode: latest.pincode || '560102',
          village: latest.village || '',
          street: latest.street || '',
          landmark: latest.landmark || '',
          restaurantName: latest.darkstoreName || 'Fresh Valley Market',
          restaurantAddress: latest.darkstoreAddress || 'Sector 1, HSR Layout, Bengaluru',
          itemsCount: latest.items?.length || 1,
          payoutAmount: latest.finalTotal || 75,
          finalTotal: latest.finalTotal || 75,
          paymentMethod: latest.paymentMethod || 'UPI',
          paymentStatus: latest.paymentStatus || 'PAID',
          otp: latest.otp || '4829',
          estimatedTime: '12 mins',
          status: latest.status || 'ASSIGNED',
          items: (latest.items || []).map((i: any) => ({
            id: i.id || `i-${Math.random()}`,
            name: i.name || 'Grocery Item',
            quantity: i.quantity || 1,
            price: i.price || 50
          }))
        };

        if (!activeOrder || activeOrder.id !== formatted.id) {
          setActiveOrder(formatted);
        }
      } else {
        setActiveOrder(null);
      }
    } catch {
      setApiError(true);
    }
  }, [isOnDuty, activeOrder]);

  useEffect(() => {
    if (!riderProfile.isLoggedIn) return;
    fetchLiveOrders();
    const interval = setInterval(fetchLiveOrders, 3000);
    return () => clearInterval(interval);
  }, [riderProfile.isLoggedIn, fetchLiveOrders]);

  const handleCompleteDelivery = async (orderId: string) => {
    try {
      await updateOrderStatusApi(orderId, 'DELIVERED');
      const earning = activeOrder ? Math.max(30, Math.round((activeOrder.finalTotal || 0) * 0.10)) : 30;
      setActiveOrder(null);
      setRiderProfile(prev => ({
        ...prev,
        todayDeliveries: prev.todayDeliveries + 1,
        todayEarnings: prev.todayEarnings + earning,
        totalDeliveries: prev.totalDeliveries + 1,
      }));
    } catch { /* retry silently */ }
  };

  if (!riderProfile.isLoggedIn) return <LoginScreen setRiderProfile={setRiderProfile} />;
  if (!riderApprovalData) return (
    <MobileFrame>
      <LocationPermissionModal isOpen={showRiderLocModal} onClose={() => setShowRiderLocModal(false)} />
      <RiderApprovalForm onSubmitSuccess={setRiderApprovalData} />
    </MobileFrame>
  );
  if (riderApprovalData.status === 'PENDING_APPROVAL' || riderApprovalData.status === 'REJECTED') return (
    <MobileFrame>
      <RiderPendingApprovalScreen riderData={riderApprovalData} onRefreshStatus={checkRiderStatus} />
    </MobileFrame>
  );
  if (riderApprovalData.status === 'BLOCKED') return (
    <MobileFrame>
      <div className="p-8 text-center bg-fleet-950 text-fleet-100 min-h-full flex flex-col justify-center items-center space-y-4 border border-rose-900/30">
        <div className="w-16 h-16 rounded-3xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center text-2xl font-black shadow-xl">
          🚫
        </div>
        <h2 className="text-lg font-display font-bold text-white">Account Suspended</h2>
        <p className="text-xs text-fleet-500 max-w-xs leading-relaxed">
          Contact <strong className="text-amber-400">admin@cartcraze.app</strong> for compliance review
        </p>
      </div>
    </MobileFrame>
  );

  const renderScreen = () => {
    switch (activeTab) {
      case 'orders':
        return <HomeScreen riderProfile={riderProfile} dutyStatus={dutyStatus} setDutyStatus={setDuty} apiError={apiError} setActiveTab={setActiveTab} activeOrder={activeOrder} setActiveOrder={setActiveOrder} />;
      case 'delivery':
        return <ActiveDeliveryScreen activeOrder={activeOrder} onComplete={handleCompleteDelivery} setActiveTab={setActiveTab} />;
      case 'earnings':
        return <EarningsScreen riderProfile={riderProfile} />;
      case 'ratings':
        return <RatingsScreen />;
      case 'profile':
        return <ProfileScreen riderProfile={riderProfile} setRiderProfile={setRiderProfile} setActiveTab={setActiveTab} onReRegister={() => setRiderApprovalData(null)} />;
      default:
        return null;
    }
  };

  return (
    <MobileFrame>
      <div className="w-full flex-1">{renderScreen()}</div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </MobileFrame>
  );
};

export default App;
