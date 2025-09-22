import React from 'react';
// MIGRATED: Import from new structure
import { CartScreen } from '../../../features/customer/components/cart/CartScreen';
import { SearchScreen } from '../../../features/customer/components/search/SearchScreen';
import { ProfileScreen } from '../../../features/customer/components/profile/ProfileScreen';
// TEMPORARY: Import remaining from old structure until migrated
import { HomeScreen } from '../../../features/customer/components/home/HomeScreen';
import { OrdersScreen } from '../../../features/customer/components/orders/OrdersScreen';
import { OrderTracking } from '../../../features/customer/components/orders/OrderTracking';
import { CheckoutScreen } from '../../../features/customer/components/checkout/CheckoutScreen';
import { NotificationsScreen } from '@legacy/NotificationsScreen';
import { SavedScreen } from '../../../features/customer/components/saved/SavedScreen';
import { PopularRestaurantsScreen } from '@legacy/PopularRestaurantsScreen';
import { NearbyRestaurantsScreen } from '@legacy/NearbyRestaurantsScreen';
import { VendorProfile } from '@legacy/VendorProfile';
import { ProductDetail } from '@legacy/ProductDetail';
import { CategoryPage } from '@legacy/CategoryPage';
import { MenuCategoryPage } from '@legacy/MenuCategoryPage';
import { ChatHistoryScreen } from '@legacy/ChatHistoryScreen';
import { AIChatScreen } from '@legacy/AIChatScreen';
import { LoyaltyRewardsScreen } from '@legacy/LoyaltyRewardsScreen';
import { ReferralsScreen } from '@legacy/ReferralsScreen';
import { OrderConfirmationScreen } from '@legacy/OrderConfirmationScreen';
import { AISettings } from '@legacy/AISettings';
import { BlockchainCenter } from '@legacy/BlockchainCenter';

import type { Screen, User, CartItem, Order } from '../../../types';

/**
 * ScreenRenderer - Central screen routing component
 * 
 * MIGRATION STATUS: ✅ PRIORITY 3 IN PROGRESS
 * Core customer experience screens now using new professional structure.
 * 
 * COMPLETED MIGRATIONS:
 * - ✅ /src/features/customer/components/cart/CartScreen.tsx
 * - ✅ /src/features/customer/components/search/SearchScreen.tsx  
 * - ✅ /src/features/customer/components/profile/ProfileScreen.tsx
 * - ✅ /src/features/customer/components/home/HomeScreen.tsx
 * - ✅ /src/features/customer/components/orders/OrdersScreen.tsx
 * - ✅ /src/features/customer/components/orders/OrderTracking.tsx
 * - ✅ /src/features/customer/components/checkout/CheckoutScreen.tsx
 * - ✅ /src/features/customer/components/saved/SavedScreen.tsx
 * 
 * REMAINING TODO: Update imports as remaining components are moved to:
 * - /src/features/customer/components/restaurants/
 * - /src/features/customer/components/menu/
 * - /src/features/customer/components/notifications/
 * - /src/features/ai/components/
 */

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
  onLanguageChange: (language: 'en' | 'rw') => void;
  onNavigate: (screen: Screen, data?: any) => void;
  onLogin: (userData: any) => void;
  onLogout: () => void;
  onLocationGranted: () => void;
  onLocationSkipped: () => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onUpdateCart: (id: string, quantity: number) => void;
  onUpdateCartItems?: (items: CartItem[]) => void;
  onPlaceOrder: (orderData: any) => void;
  onToggleSaved: (itemId: string) => void;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  onSearch: (query: string) => void;
  onCategoryNavigation: (category: any) => void;
  onAIFeatureOpen: (feature: string) => void;
  onOpenEnhancedTracking: (order: Order) => void;
  onOpenDemoTracking: () => void;
  onOpenLiveMap: (order: Order) => void;
  onOpenDroneTracking: (order: Order) => void;
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

  // Screen routing logic
  switch (currentScreen) {
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
          onNavigateToCategory={(category) => onCategoryNavigation(category)}
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
          onNavigate={onNavigate}
          onBack={() => onNavigate('home')}
        />
      );

    case 'cart':
      return (
        <CartScreen
          language={language}
          items={cartItems}
          onUpdateCart={(updatedItems) => {
            // For now, we'll need to handle the cart update through the existing interface
            // This could be enhanced to work with a new cart handler
            updatedItems.forEach(item => {
              const existingItem = cartItems.find(ci => ci.id === item.id);
              if (existingItem && existingItem.quantity !== item.quantity) {
                onUpdateCart(item.id, item.quantity);
              }
            });
          }}
          onBack={() => onNavigate('home')}
          onViewOrders={() => onNavigate('orders')}
          onContinueBrowsing={() => onNavigate('home')}
        />
      );

    case 'checkout':
      return (
        <CheckoutScreen
          language={language}
          cartItems={cartItems}
          user={user}
          onNavigate={onNavigate}
          onBack={() => onNavigate('cart')}
          onPlaceOrder={onPlaceOrder}
        />
      );

    case 'order-tracking':
      // Validate order data before passing to component
      const validatedOrder = currentOrder ? {
        ...currentOrder,
        id: currentOrder.id || 'unknown',
        vendorName: currentOrder.vendorName || 'Restaurant',
        items: Array.isArray(currentOrder.items) ? currentOrder.items : [],
        total: Number(currentOrder.total) || 0,
        status: currentOrder.status || 'preparing'
      } : null;

      return (
        <OrderTracking
          language={language}
          order={validatedOrder}
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
        />
      );

    case 'saved':
      return (
        <SavedScreen
          language={language}
          savedItems={savedItems}
          onNavigate={onNavigate}
          onBack={() => onNavigate('home')}
          onToggleSaved={onToggleSaved}
          onAddToCart={onAddToCart}
        />
      );

    case 'profile':
      return (
        <ProfileScreen
          language={language}
          user={user}
          onUpdateProfile={(updatedUser) => {
            // Update user data - this could be enhanced to call onLogin with updated data
            console.log('Profile updated:', updatedUser);
          }}
          onLogout={onLogout}
          onBack={() => onNavigate('home')}
          onOpenChatHistory={() => onNavigate('chat-history')}
        />
      );

    case 'popular-restaurants':
      return (
        <PopularRestaurantsScreen
          language={language}
          onNavigate={onNavigate}
          onBack={() => onNavigate('home')}
        />
      );

    case 'nearby-restaurants':
      return (
        <NearbyRestaurantsScreen
          language={language}
          onNavigate={onNavigate}
          onBack={() => onNavigate('home')}
        />
      );

    case 'vendor-profile':
      return (
        <VendorProfile
          language={language}
          vendor={currentVendor}
          cartItems={cartItems}
          onAddToCart={onAddToCart}
          onProductSelect={(product) => onNavigate('product-detail', { product })}
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
          onNavigate={onNavigate}
          onBack={() => onNavigate('vendor-profile')}
          onAddToCart={onAddToCart}
          onToggleSaved={onToggleSaved}
          savedItems={savedItems}
        />
      );

    case 'category':
      return (
        <CategoryPage
          language={language}
          category={selectedCategory}
          onBack={() => onNavigate('home')}
          onRestaurantSelect={(restaurant) => onNavigate('vendor-profile', { vendor: restaurant })}
        />
      );

    case 'menu-category':
      return (
        <MenuCategoryPage
          language={language}
          category={selectedCategory}
          vendor={currentVendor}
          onNavigate={onNavigate}
          onBack={() => onNavigate('vendor-profile')}
          onAddToCart={onAddToCart}
          onToggleSaved={onToggleSaved}
          savedItems={savedItems}
        />
      );

    case 'chat-history':
      return (
        <ChatHistoryScreen
          language={language}
          onNavigate={onNavigate}
          onBack={() => onNavigate('profile')}
        />
      );

    case 'ai-chat':
      return (
        <AIChatScreen
          language={language}
          onNavigate={onNavigate}
          onBack={() => onNavigate('chat-history')}
          onNavigateToVendor={(vendorId) => {
            // Mock vendor data for AI recommendations
            const mockVendor = {
              id: vendorId,
              name: 'AI Recommended Restaurant',
              rating: 4.8,
              category: 'Recommended',
              deliveryTime: '20-30 min',
              deliveryFee: 2.50,
              distance: '1.5 km'
            };
            onNavigate('vendor-profile', { vendor: mockVendor });
          }}
          onAddToCart={onAddToCart}
        />
      );

    case 'loyalty-rewards':
      return (
        <LoyaltyRewardsScreen
          language={language}
          onNavigate={onNavigate}
          onBack={() => onNavigate('profile')}
        />
      );

    case 'referrals':
      return (
        <ReferralsScreen
          language={language}
          onNavigate={onNavigate}
          onBack={() => onNavigate('profile')}
        />
      );

    case 'ai-settings':
      return (
        <AISettings
          language={language}
          onBack={() => onNavigate('home')}
        />
      );

    case 'blockchain':
      return (
        <BlockchainCenter
          language={language}
          onBack={() => onNavigate('home')}
        />
      );

    default:
      // Fallback to home screen
      return (
        <HomeScreen
          language={language}
          user={user}
          cartItems={cartItems}
          onVendorSelect={(vendor) => onNavigate('vendor-profile', { vendor })}
          onSearch={onSearch}
          onOpenSidebar={onOpenSidebar}
          onNavigateToNotifications={() => onNavigate('notifications')}
          onNavigateToCategory={(category) => onCategoryNavigation(category)}
          onViewAllRestaurants={() => onNavigate('nearby-restaurants')}
          onViewAllPopular={() => onNavigate('popular-restaurants')}
          onViewCart={() => onNavigate('cart')}
        />
      );
  }
}