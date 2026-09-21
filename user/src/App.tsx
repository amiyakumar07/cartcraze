import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FloatingCartBar } from './components/FloatingCartBar';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './pages/HomeScreen';
import { CategoryScreen } from './pages/CategoryScreen';
import { BasketScreen } from './pages/BasketScreen';
import { OrderConfirmedScreen } from './pages/OrderConfirmedScreen';
import { TrackOrderScreen } from './pages/TrackOrderScreen';
import { AccountScreen } from './pages/AccountScreen';
import { LoginScreen } from './pages/LoginScreen';
import { OnboardingScreen } from './pages/OnboardingScreen';
import { ComingSoonScreen } from './pages/ComingSoonScreen';
import { LocationPermissionModal } from './components/LocationPermissionModal';
import { SearchScreen } from './pages/SearchScreen';
import { OffersScreen } from './pages/OffersScreen';
import { AddressesScreen } from './pages/AddressesScreen';
import { reverseGeocodeLocationIQ } from './services/locationiq';

const MainAppContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    getCartCount, 
    getCartTotal, 
    userProfile, 
    isOutOfCoverageRange, 
    checkStoreCoverage, 
    setUserCoords, 
    setUserProfile 
  } = useApp();
  
  // Track startup opening video splash
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('cartcraze_splash_shown');
    } catch {
      return true;
    }
  });

  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

  // Present location permission modal gracefully if not yet granted
  useEffect(() => {
    if (showSplash || activeTab === 'onboarding' || activeTab === 'login') return;

    const locationGranted = localStorage.getItem('cartcraze_location_granted');
    if (!locationGranted) {
      // Prompt modal gracefully; user interaction in modal triggers GPS request
      setShowLocationModal(true);
    } else if ('geolocation' in navigator) {
      // Previously granted: silently refresh coordinates
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setUserCoords({ lat, lon });
          localStorage.setItem('cartcraze_user_coords', JSON.stringify({ lat, lon }));
          try {
            const geo = await reverseGeocodeLocationIQ(lat, lon);
            const addr = typeof geo === 'string' ? geo : (geo?.address || geo?.fullAddress || geo?.displayName || 'Current Location');
            if (addr && (!userProfile.address || userProfile.address === 'Select Delivery Location' || userProfile.address === 'Locating delivery address...')) {
              localStorage.setItem('cartcraze_user_selected_address', addr);
              setUserProfile((prev) => ({ ...prev, address: addr }));
            }
          } catch { /* silent */ }
          await checkStoreCoverage(lat, lon);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [showSplash, activeTab]);

  const handleSplashComplete = () => {
    try {
      sessionStorage.setItem('cartcraze_splash_shown', 'true');
    } catch { /* silent */ }
    setShowSplash(false);

    // Startup routing after opening video:
    // If user is already authenticated: navigate to Home; Else: navigate to Login
    if (userProfile && userProfile.isLoggedIn && userProfile.email && !userProfile.phone?.includes('guest')) {
      setActiveTab('home');
    } else {
      setActiveTab('login');
    }
  };

  const renderActiveScreen = () => {
    if (isOutOfCoverageRange && (activeTab === 'home' || activeTab === 'categories' || activeTab === 'category_detail')) {
      return (
        <ComingSoonScreen
          userLocationAddress={userProfile.address || 'Selected Location (Out of 5km Range)'}
          onSearchNewAddress={() => checkStoreCoverage()}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'categories':
      case 'category_detail':
        return <CategoryScreen />;
      case 'search':
        return <SearchScreen />;
      case 'offers':
        return <OffersScreen />;
      case 'addresses':
        return <AddressesScreen />;
      case 'cart':
        return <BasketScreen />;
      case 'order_confirmed':
        return <OrderConfirmedScreen />;
      case 'track_order':
        return <TrackOrderScreen />;
      case 'account':
        return <AccountScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <MobileFrame>
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : activeTab === 'onboarding' ? (
        <OnboardingScreen />
      ) : activeTab === 'login' ? (
        <LoginScreen />
      ) : (
        <>
          <Header />
          <main className="flex-1 pb-4">
            {renderActiveScreen()}
          </main>
          <BottomNav />
          <ProductDetailModal />
          <LocationPermissionModal
            isOpen={showLocationModal}
            onClose={() => setShowLocationModal(false)}
          />
        </>
      )}
    </MobileFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
