import React from 'react';
import { SplashScreen } from './SplashScreen';
import { OnboardingCarousel } from './OnboardingCarousel';
import { LoginScreen } from './LoginScreen';
import { LocationPermission } from './LocationPermission';
import { HomeScreen } from './HomeScreen';
import { VendorProfile } from './VendorProfile';
import { ProductDetail } from './ProductDetail';
import { CartScreen } from './CartScreen';
import { CheckoutScreen } from './CheckoutScreen';
import { OrderTracking } from './OrderTracking';
import { OrdersScreen } from './OrdersScreen';
import { SavedScreen } from './SavedScreen';
import { ProfileScreen } from './ProfileScreen';
import { SearchScreen } from './SearchScreen';
import { NotificationsScreen } from './NotificationsScreen';
import { CategoryPage } from './CategoryPage';
import { PopularRestaurantsScreen } from './PopularRestaurantsScreen';
import { NearbyRestaurantsScreen } from './NearbyRestaurantsScreen';
import { AISettings } from './AISettings';
import { AIChatScreen } from './AIChatScreen';
import { MenuCategoryPage } from './MenuCategoryPage';
import { BlockchainCenter } from './BlockchainCenter';
import { LoyaltyRewardsScreen } from './LoyaltyRewardsScreen';
import { ReferralsScreen } from './ReferralsScreen';
import { ChatHistoryScreen } from './ChatHistoryScreen';
import type { Screen, User, CartItem, Order } from './types';

interface ScreenRendererProps {
  currentScreen: Screen;
  language: 'en' | 'rw';
  user: User | null;
  cartItems: CartItem[];
  orders: Order[];
  savedItems: string[];
  currentVendor: any;
  currentProduct: any;
  currentOrder: Order | null;
  searchQuery: string;
  selectedCategory: any;
  hasCompletedOnboarding: boolean;
  // Handler functions
  onLanguageChange: (lang: 'en' | 'rw') => void;
  onNavigate: (screen: Screen, data?: any) => void;
  onLogin: (userData: User) => void;
  onLogout: () => void;
  onLocationGranted: (location: string) => void;
  onLocationSkipped: () => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onUpdateCart: (items: CartItem[]) => void;
  onPlaceOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => void;
  onToggleSaved: (itemId: string) => void;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  onSearch: (query: string) => void;
  onCategoryNavigation: (category: any) => void;
  onAIFeatureOpen?: (feature: string) => void;
  onOpenEnhancedTracking?: (order: Order) => void;
  onOpenDemoTracking?: () => void;
  onOpenLiveMap?: (order: Order) => void;
  onOpenDroneTracking?: (order: Order) => void;
}

export function ScreenRenderer({
  currentScreen,
  language,
  user,
  cartItems,
  orders,
  savedItems,
  currentVendor,
  currentProduct,  
  currentOrder,
  searchQuery,
  selectedCategory,
  hasCompletedOnboarding,
  onLanguageChange,
  onNavigate,
  onLogin,
  onLogout,
  onLocationGranted,
  onLocationSkipped,
  onAddToCart,
  onUpdateCart,
  onPlaceOrder,
  onToggleSaved,
  onOpenSidebar,
  onCloseSidebar,
  onSearch,
  onCategoryNavigation,
  onAIFeatureOpen,
  onOpenEnhancedTracking,
  onOpenDemoTracking,
  onOpenLiveMap,
  onOpenDroneTracking
}: ScreenRendererProps) {
  
  // Render the current screen based on state
  switch (currentScreen) {
    case 'splash':
      return (
        <SplashScreen
          language={language}
          onLanguageChange={onLanguageChange}
          onContinue={() => hasCompletedOnboarding ? onNavigate('login') : onNavigate('onboarding')}
        />
      );

    case 'onboarding':
      return (
        <OnboardingCarousel
          language={language}
          onComplete={() => onNavigate('login')}
          onSkip={() => onNavigate('login')}
        />
      );

    case 'login':
      return (
        <LoginScreen
          language={language}
          isGuest={false}
          onLogin={onLogin}
          onBack={() => onNavigate('splash')}
        />
      );

    case 'location-permission':
      return (
        <LocationPermission
          language={language}
          onLocationGranted={onLocationGranted}
          onSkip={onLocationSkipped}
        />
      );

    case 'home':
      return (
        <HomeScreen
          language={language}
          user={user}
          cartItems={cartItems}
          onVendorSelect={(vendor) => onNavigate('vendor-profile', { vendor })}
          onSearch={onSearch}
          onOpenSidebar={onOpenSidebar}
          onNavigateToNotifications={() => onNavigate('notifications')}
          onNavigateToCategory={onCategoryNavigation}
          onViewAllRestaurants={() => onNavigate('nearby-restaurants')}
          onViewAllPopular={() => onNavigate('popular-restaurants')}
          onViewCart={() => onNavigate('cart')}
        />
      );

    case 'search':
      return (
        <SearchScreen
          language={language}
          query={searchQuery}
          onVendorSelect={(vendor) => onNavigate('vendor-profile', { vendor })}
          onBack={() => onNavigate('home')}
        />
      );

    case 'notifications':
      return (
        <NotificationsScreen
          language={language}
          onBack={() => onNavigate('home')}
        />
      );

    case 'category':
      return (
        <CategoryPage
          language={language}
          category={selectedCategory || undefined}
          onBack={() => onNavigate('home')}
          onRestaurantSelect={(restaurant) => onNavigate('vendor-profile', { vendor: restaurant })}
        />
      );

    case 'popular-restaurants':
      return (
        <PopularRestaurantsScreen
          language={language}
          onBack={() => onNavigate('home')}
          onRestaurantSelect={(restaurant) => onNavigate('vendor-profile', { vendor: restaurant })}
        />
      );

    case 'nearby-restaurants':
      return (
        <NearbyRestaurantsScreen
          language={language}
          onBack={() => onNavigate('home')}
          onRestaurantSelect={(restaurant) => onNavigate('vendor-profile', { vendor: restaurant })}
        />
      );

    case 'vendor-profile':
      return (
        <VendorProfile
          language={language}
          vendor={currentVendor}
          cartItems={cartItems}
          onAddToCart={onAddToCart}
          onProductSelect={(product) => {
            if (product.type === 'menu-category') {
              // Navigate to menu-category screen with the category and vendor data
              onNavigate('menu-category', { 
                category: product.category,
                vendor: product.vendor 
              });
            } else {
              // Default behavior for product details
              onNavigate('product-detail', { product });
            }
          }}
          onBack={() => onNavigate('home')}
          onViewCart={() => onNavigate('cart')}
          onAIFeatureOpen={onAIFeatureOpen}
        />
      );

    case 'product-detail':
      return (
        <ProductDetail
          language={language}
          product={currentProduct}
          vendor={currentVendor}
          savedItems={savedItems}
          onAddToCart={onAddToCart}
          onToggleSaved={onToggleSaved}
          onBack={() => onNavigate('vendor-profile')}
        />
      );

    case 'cart':
      return (
        <CartScreen
          language={language}
          items={cartItems}
          onUpdateCart={onUpdateCart}
          onCheckout={() => onNavigate('checkout')}
          onBack={() => onNavigate('home')}
        />
      );

    case 'checkout':
      return (
        <CheckoutScreen
          language={language}
          items={cartItems}
          user={user}
          onPlaceOrder={onPlaceOrder}
          onBack={() => onNavigate('cart')}
        />
      );

    case 'order-tracking':
      return (
        <OrderTracking
          language={language}
          order={currentOrder}
          onOrderComplete={() => onNavigate('home')}
          onBack={() => onNavigate('orders')}
          onOpenEnhancedTracking={onOpenEnhancedTracking}
          onOpenLiveMap={onOpenLiveMap}
          onOpenDroneTracking={onOpenDroneTracking}
        />
      );

    case 'orders':
      return (
        <OrdersScreen
          language={language}
          orders={orders}
          onOrderSelect={(order) => onNavigate('order-tracking', { order })}
          onBack={() => onNavigate('home')}
          onOpenDemoTracking={onOpenDemoTracking}
        />
      );

    case 'saved':
      return (
        <SavedScreen
          language={language}
          savedItems={savedItems}
          onItemSelect={(item) => onNavigate('product-detail', { product: item })}
          onToggleSaved={onToggleSaved}
          onBack={() => onNavigate('home')}
        />
      );

    case 'profile':
      return (
        <ProfileScreen
          language={language}
          user={user}
          onUpdateProfile={(updatedUser) => {/* Handle profile update */}}
          onLogout={onLogout}
          onBack={() => onNavigate('home')}
          onOpenChatHistory={() => onNavigate('chat-history')}
        />
      );

    case 'chat-history':
      return (
        <ChatHistoryScreen
          language={language}
          onBack={() => onNavigate('profile')}
          onOpenChat={(conversationId) => {
            // TODO: Navigate to specific chat conversation
            console.log('Opening chat:', conversationId);
            // For now, show an alert - in real app this would open the chat interface
            alert(language === 'en' 
              ? 'Chat feature coming soon! This would open the conversation.' 
              : 'Ikiganiro gizaza hafi! Ibi byafungura ikiganiro.'
            );
          }}
        />
      );

    case 'ai-settings':
      return (
        <AISettings
          language={language}
          onBack={() => {
            onCloseSidebar();
            onNavigate('home');
          }}
        />
      );

    case 'ai-chat':
      return (
        <AIChatScreen
          language={language}
          onBack={() => onNavigate('home')}
          onNavigateToVendor={(vendorId) => {
            // Find vendor and navigate to vendor profile
            onNavigate('vendor-profile', { vendor: { id: vendorId } });
          }}
          onNavigateToCart={() => onNavigate('cart')}
          onAddToCart={onAddToCart}
        />
      );

    case 'menu-category':
      return (
        <MenuCategoryPage
          language={language}
          category={selectedCategory?.category || selectedCategory || { name: { en: 'Menu', rw: 'Urutonde' }, icon: '🍽️' }}
          vendor={selectedCategory?.vendor || currentVendor || { name: language === 'en' ? 'Restaurant' : 'Resitora' }}
          cartItems={cartItems}
          onAddToCart={onAddToCart}
          onBack={() => onNavigate('vendor-profile')}
        />
      );

    case 'blockchain':
      return (
        <BlockchainCenter
          language={language}
          onBack={() => {
            onCloseSidebar();
            onNavigate('home');
          }}
        />
      );

    case 'loyalty-rewards':
      return (
        <LoyaltyRewardsScreen
          language={language}
          onBack={() => {
            onCloseSidebar();
            onNavigate('home');
          }}
        />
      );

    case 'referrals':
      return (
        <ReferralsScreen
          language={language}
          onBack={() => {
            onCloseSidebar();
            onNavigate('home');
          }}
        />
      );

    default:
      return null;
  }
}