import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FloatingCartBar } from './components/FloatingCartBar';
import { ProductDetailModal } from './components/ProductDetailModal';
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

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, getCartCount, getCartTotal, isOutOfCoverageRange, checkStoreCoverage, userProfile } = useApp();
  const [showLocationModal, setShowLocationModal] = React.useState(true);

  if (activeTab === 'onboarding') {
    return (
      <MobileFrame>
        <OnboardingScreen />
      </MobileFrame>
    );
  }

  if (activeTab === 'login') {
    return (
      <MobileFrame>
        <LoginScreen />
      </MobileFrame>
    );
  }

  const renderActiveScreen = () => {
    // If no store is available within 5km delivery range, block product view across ALL storefront tabs
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
      <Header />
      <main className="flex-1">
        {renderActiveScreen()}
      </main>
      {activeTab !== 'cart' && (
        <FloatingCartBar
          itemCount={getCartCount()}
          subtotal={getCartTotal()}
          onViewCart={() => setActiveTab('cart')}
        />
      )}
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
