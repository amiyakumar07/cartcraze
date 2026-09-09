import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
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

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, isOutOfCoverageRange, checkStoreCoverage, userProfile } = useApp();
  
  // Track startup opening video splash
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('cartcraze_splash_shown');
    } catch {
      return true;
    }
  });

  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);

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

  // 1. Startup Splash Video: Fullscreen without flashing login or home
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // 2. Onboarding Screen
  if (activeTab === 'onboarding') {
    return (
      <MobileFrame>
        <OnboardingScreen />
      </MobileFrame>
    );
  }

  // 3. Login Screen
  if (activeTab === 'login') {
    return (
      <MobileFrame>
        <LoginScreen />
      </MobileFrame>
    );
  }

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
      <Header />
      <main className="flex-1">
        {renderActiveScreen()}
      </main>
      <BottomNav />
      <ProductDetailModal />
      <LocationPermissionModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />
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
