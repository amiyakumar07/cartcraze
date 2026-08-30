import React, { useState, useEffect, useCallback } from 'react';
import { fetchAssignedOrdersApi, updateOrderStatusApi } from './services/api';
import type { RiderOrder, DutyStatus } from './types';
import { LoginScreen } from './pages/LoginScreen';
import { HomeScreen } from './pages/HomeScreen';
import { ActiveDeliveryScreen } from './pages/ActiveDeliveryScreen';
import { EarningsScreen } from './pages/EarningsScreen';
import { RatingsScreen } from './pages/RatingsScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { MobileFrame } from './components/MobileFrame';
import { BottomNav } from './components/BottomNav';

import { RiderApprovalForm } from './pages/RiderApprovalForm';
import { RiderPendingApprovalScreen } from './pages/RiderPendingApprovalScreen';
import { LocationPermissionModal } from './components/LocationPermissionModal';

const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API = `http://${hostname}:4000/api`;

export type AppTab = 'orders' | 'earnings' | 'ratings' | 'profile' | 'delivery';

export interface RiderProfile {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  rating: number;
  totalDeliveries: number;
  todayDeliveries: number;
  todayEarnings: number;
  isLoggedIn: boolean;
  photo: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('orders');
  const [dutyStatus, setDutyStatus] = useState<DutyStatus>('OFF_DUTY');
  const [activeOrder, setActiveOrder] = useState<RiderOrder | null>(null);
  const [apiError, setApiError] = useState(false);
  const [riderApprovalData, setRiderApprovalData] = useState<any>(() => {
    const saved = localStorage.getItem('cartcraze_rider_data');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });
  const [showRiderLocModal, setShowRiderLocModal] = useState(true);
  const [riderGpsCoords, setRiderGpsCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [riderProfile, setRiderProfile] = useState<RiderProfile>({
    id: '',
    name: '',
    phone: '',
    vehicleNumber: '',
    rating: 5.0,
    totalDeliveries: 0,
    todayDeliveries: 0,
    todayEarnings: 0,
    isLoggedIn: false,
    photo: '',
  });

  // Sync real rider info from riderApprovalData when approved
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
  }, [riderApprovalData?.id, riderApprovalData?.status, riderProfile.isLoggedIn]);

  const checkRiderStatus = async () => {
    try {
      const res = await fetch(`${API}/riders`);
      const data = await res.json();
      if (data.riders && data.riders.length > 0) {
        // Find this specific rider by their saved id/phone/email
        const currentId = riderApprovalData?.id;
        const currentPhone = riderApprovalData?.phone;
        const found = currentId
          ? data.riders.find((r: any) => r.id === currentId || r.phone === currentPhone)
          : null;
        if (found) {
          setRiderApprovalData(found);
          localStorage.setItem('cartcraze_rider_data', JSON.stringify(found));
        }
      }
    } catch {
      // silent catch
    }
  };

  // ─── 72-HOUR RIDER SESSION AUTO-LOGOUT ───────────────────────────────────
  const SESSION_DURATION_MS = 72 * 60 * 60 * 1000; // 72 Hours (3 Days)

  const handleRiderLogout = () => {
    localStorage.removeItem('cartcraze_rider_login_timestamp');
    localStorage.removeItem('cartcraze_rider_data');
    setRiderProfile((prev) => ({ ...prev, isLoggedIn: false }));
    setActiveOrder(null);
    setDutyStatus('OFF_DUTY');
  };

  useEffect(() => {
    if (riderProfile.isLoggedIn) {
      const savedTs = localStorage.getItem('cartcraze_rider_login_timestamp');
      if (!savedTs) {
        localStorage.setItem('cartcraze_rider_login_timestamp', Date.now().toString());
      } else {
        const elapsed = Date.now() - Number(savedTs);
        if (elapsed > SESSION_DURATION_MS) {
          console.log('[Rider App] 72-hour rider session limit reached. Auto logging out.');
          handleRiderLogout();
        }
      }
    }
  }, [riderProfile.isLoggedIn]);

  useEffect(() => {
    if (!riderProfile.isLoggedIn) return;
    const interval = setInterval(() => {
      const savedTs = localStorage.getItem('cartcraze_rider_login_timestamp');
      if (savedTs && Date.now() - Number(savedTs) > SESSION_DURATION_MS) {
        console.log('[Rider App] 72-hour rider session expired. Auto logging out.');
        handleRiderLogout();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [riderProfile.isLoggedIn]);

  useEffect(() => {
    if (riderProfile.isLoggedIn) {
      checkRiderStatus();
      const interval = setInterval(checkRiderStatus, 3000);
      return () => clearInterval(interval);
    }
  }, [riderProfile.isLoggedIn, riderApprovalData?.id]);

  // Real GPS tracking using browser geolocation
  useEffect(() => {
    if (!riderProfile.isLoggedIn || dutyStatus === 'OFF_DUTY') return;
    if (!('geolocation' in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setRiderGpsCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      () => { /* GPS denied — will fall back to null */ },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [riderProfile.isLoggedIn, dutyStatus]);

  // Send real GPS coordinates to server when ON_DUTY
  useEffect(() => {
    if (!riderProfile.isLoggedIn || dutyStatus === 'OFF_DUTY') return;

    const sendGpsUpdate = async () => {
      // Only send if we have real GPS coords
      if (!riderGpsCoords) return;
      try {
        await fetch(`${API}/locationiq/update-rider-location`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            riderId: riderProfile.id || riderApprovalData?.id || 'rider-live',
            riderName: riderProfile.name || riderApprovalData?.name || 'Rider',
            phone: riderProfile.phone || riderApprovalData?.phone || '',
            vehicleNumber: riderProfile.vehicleNumber || riderApprovalData?.vehicleNumber || '',
            lat: riderGpsCoords.lat,
            lon: riderGpsCoords.lon,
            status: activeOrder ? 'EN_ROUTE' : 'ONLINE'
          })
        });
      } catch {
        // silent catch
      }
    };

    sendGpsUpdate();
    const interval = setInterval(sendGpsUpdate, 4000);
    return () => clearInterval(interval);
  }, [riderProfile, riderGpsCoords, dutyStatus, activeOrder, riderApprovalData]);

  // Poll live customer orders placed in User App near rider
  const fetchLiveOrders = useCallback(async () => {
    if (dutyStatus === 'OFF_DUTY') return;
    try {
      const res = await fetch(`${API}/orders`);
      const data = await res.json();
      setApiError(false);

      if (Array.isArray(data) && data.length > 0) {
        const latestOrder = data[0];
        const formattedOrder: RiderOrder = {
          id: latestOrder.id,
          customerName: latestOrder.customerName || 'Customer',
          customerPhone: latestOrder.customerPhone || '+91 98765 43210',
          deliveryAddress: latestOrder.deliveryAddress || 'Sector 1, HSR Layout, Bengaluru',
          customerLat: parseFloat(latestOrder.customerLat) || 12.9141,
          customerLon: parseFloat(latestOrder.customerLon) || 77.6411,
          pincode: latestOrder.pincode || '560102',
          village: latestOrder.village || '',
          street: latestOrder.street || '',
          landmark: latestOrder.landmark || '',
          restaurantName: latestOrder.darkstoreName || 'Fresh Valley Market',
          restaurantAddress: latestOrder.darkstoreAddress || 'Sector 1, HSR Layout, Bengaluru',
          itemsCount: latestOrder.items ? latestOrder.items.length : 1,
          payoutAmount: latestOrder.finalTotal || 75,
          finalTotal: latestOrder.finalTotal || 75,
          paymentMethod: latestOrder.paymentMethod || 'UPI',
          paymentStatus: latestOrder.paymentStatus || 'PAID',
          otp: latestOrder.otp || '4829',
          estimatedTime: '12 mins',
          status: latestOrder.status || 'ASSIGNED',
          items: (latestOrder.items || []).map((i: any) => ({
            id: i.id || `i-${Math.random()}`,
            name: i.name || 'Grocery Item',
            quantity: i.quantity || 1,
            price: i.price || 50
          }))
        };

        if (!activeOrder || activeOrder.id !== formattedOrder.id) {
          setActiveOrder(formattedOrder);
        }
      } else {
        setActiveOrder(null);
      }
    } catch {
      setApiError(true);
    }
  }, [dutyStatus, activeOrder]);

  useEffect(() => {
    if (riderProfile.isLoggedIn) {
      fetchLiveOrders();
      const interval = setInterval(fetchLiveOrders, 3000);
      return () => clearInterval(interval);
    }
  }, [riderProfile.isLoggedIn, fetchLiveOrders]);

  const handleCompleteDelivery = async (orderId: string) => {
    try {
      await updateOrderStatusApi(orderId, 'DELIVERED');
      // Calculate earning: 10% of order total, min ₹30
      const earning = activeOrder ? Math.max(30, Math.round((activeOrder.finalTotal || 0) * 0.10)) : 30;
      setActiveOrder(null);
      setRiderProfile(prev => ({
        ...prev,
        todayDeliveries: prev.todayDeliveries + 1,
        todayEarnings: prev.todayEarnings + earning,
        totalDeliveries: prev.totalDeliveries + 1,
      }));
    } catch {
      // retry silently
    }
  };

  if (!riderProfile.isLoggedIn) {
    return <LoginScreen setRiderProfile={setRiderProfile} />;
  }

  // If rider application not submitted yet -> show Rider Registration Approval Form
  if (!riderApprovalData) {
    return (
      <MobileFrame>
        <LocationPermissionModal isOpen={showRiderLocModal} onClose={() => setShowRiderLocModal(false)} />
        <RiderApprovalForm onSubmitSuccess={(data) => setRiderApprovalData(data)} />
      </MobileFrame>
    );
  }

  // If rider application is pending approval or rejected -> show Pending Review screen
  if (riderApprovalData.status === 'PENDING_APPROVAL' || riderApprovalData.status === 'REJECTED') {
    return (
      <MobileFrame>
        <RiderPendingApprovalScreen riderData={riderApprovalData} onRefreshStatus={checkRiderStatus} />
      </MobileFrame>
    );
  }

  if (riderApprovalData.status === 'BLOCKED') {
    return (
      <MobileFrame>
        <div className="p-8 text-center bg-slate-950 text-slate-100 min-h-full flex flex-col justify-center items-center space-y-4 font-sans border border-red-900/50">
          <div className="w-16 h-16 rounded-3xl bg-red-950 text-red-400 border border-red-800 flex items-center justify-center text-2xl font-black shadow-xl">
            🚫
          </div>
          <h2 className="text-lg font-black text-white">Rider Account Suspended</h2>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Your rider partner account has been suspended by Super Admin. Please contact <strong className="text-amber-400">admin@cartcraze.app</strong> for compliance review.
          </p>
        </div>
      </MobileFrame>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <HomeScreen
            riderProfile={riderProfile}
            dutyStatus={dutyStatus}
            setDutyStatus={setDutyStatus}
            apiError={apiError}
            setActiveTab={setActiveTab}
            activeOrder={activeOrder}
            setActiveOrder={setActiveOrder}
          />
        );
      case 'delivery':
        return (
          <ActiveDeliveryScreen
            activeOrder={activeOrder}
            onComplete={handleCompleteDelivery}
            setActiveTab={setActiveTab}
          />
        );
      case 'earnings':
        return <EarningsScreen riderProfile={riderProfile} />;
      case 'ratings':
        return <RatingsScreen />;
      case 'profile':
        return (
          <ProfileScreen
            riderProfile={riderProfile}
            setRiderProfile={setRiderProfile}
            setActiveTab={setActiveTab}
            onReRegister={() => setRiderApprovalData(null)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <MobileFrame>
      <div className="w-full flex-1">
        {renderScreen()}
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </MobileFrame>
  );
};

export default App;
