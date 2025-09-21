import React, { useState } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { SidebarMenu } from './SidebarMenu';
import { ScreenRenderer } from './ScreenRenderer';
import { RedesignedAIAssistant } from './RedesignedAIAssistant';
import { AIFeaturesNavigator } from './AIFeaturesNavigator';
import { AddedToCartModal } from './AddedToCartModal';
import { EnhancedOrderTrackingModal } from './EnhancedOrderTrackingModal';
import { LiveTrackingMap } from './LiveTrackingMap';
import { DroneDeliveryVisualization } from './DroneDeliveryVisualization';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SCREENS_WITH_BOTTOM_NAV, 
  SCREEN_VARIANTS, 
  SCREEN_TRANSITION, 
  DEFAULT_APP_STATE 
} from './constants';
import {
  createNavigationHandler,
  createLoginHandler,
  createLogoutHandler,
  createLocationHandlers,
  createCartHandlers,
  createFavoritesHandler,
  createBottomNavigationHandler,
  createSearchHandler,
  createCategoryHandler
} from './appHelpers';
import type { Screen, User, CartItem, Order, AppState } from './types';

/**
 * MainApp Component - Central application state manager
 * 
 * Manages the complete DeliGo food delivery app experience including:
 * - Screen navigation and state management
 * - User authentication and location permissions
 * - Shopping cart and order management
 * - Bilingual language support (English/Kinyarwanda)
 * - Bottom navigation and sidebar menu
 * - Smooth screen transitions with animations
 * 
 * The component uses extracted helper functions and constants
 * to maintain clean, readable code while preserving all functionality.
 */
interface MainAppProps {
  initialLanguage?: 'en' | 'rw';
  onLogout?: () => void;
}

export function MainApp({ initialLanguage = 'en', onLogout: onLogoutProp }: MainAppProps = {}) {
  // Initialize with home screen and mock user for immediate testing
  const mockUser: User = {
    id: '1',
    name: 'Test User',
    phone: '+250123456789',
    email: 'test@deligo.com',
    location: 'Kigali, Kacyiru',
    isGuest: false
  };

  // Core application state - Start directly in home with mock data
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [language, setLanguage] = useState<'en' | 'rw'>(initialLanguage);
  const [user, setUser] = useState<User | null>(mockUser);
  const [cartItems, setCartItems] = useState<CartItem[]>(DEFAULT_APP_STATE.cartItems);
  // Mock orders for testing
  const mockOrders: Order[] = [
    {
      id: '1001',
      items: [
        {
          id: '1',
          name: 'Chicken Burger',
          price: 4500,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
          vendorId: 'heaven-restaurant',
          vendorName: 'Heaven Restaurant'
        }
      ],
      total: 9000,
      status: 'delivered',
      vendorName: 'Heaven Restaurant',
      deliveryAddress: 'Kigali, Kacyiru',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '1002',
      items: [
        {
          id: '2',
          name: 'Sushi Combo',
          price: 8500,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300',
          vendorId: 'tokyo-sushi',
          vendorName: 'Tokyo Sushi Bar'
        }
      ],
      total: 10500,
      status: 'preparing',
      vendorName: 'Tokyo Sushi Bar',
      deliveryAddress: 'Kigali, Kacyiru',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    }
  ];

  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [savedItems, setSavedItems] = useState<string[]>(['chicken-burger', 'sushi-combo', 'pizza-margherita']);
  
  // Screen-specific state
  const [currentVendor, setCurrentVendor] = useState<any>(DEFAULT_APP_STATE.currentVendor);
  const [currentProduct, setCurrentProduct] = useState<any>(DEFAULT_APP_STATE.currentProduct);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(DEFAULT_APP_STATE.currentOrder);
  const [searchQuery, setSearchQuery] = useState<string>(DEFAULT_APP_STATE.searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<any>(DEFAULT_APP_STATE.selectedCategory);
  
  // UI state - Set permissions as granted for immediate functionality
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(DEFAULT_APP_STATE.isSidebarOpen);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(true);
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const [showAIFeatures, setShowAIFeatures] = useState<boolean>(false);
  const [currentAIScreen, setCurrentAIScreen] = useState<string>('assistant');
  
  // Added to cart modal state
  const [showAddedToCartModal, setShowAddedToCartModal] = useState<boolean>(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  
  // Enhanced order tracking modal state
  const [showEnhancedTracking, setShowEnhancedTracking] = useState<boolean>(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  
  // Live tracking map state
  const [showLiveTrackingMap, setShowLiveTrackingMap] = useState<boolean>(false);
  const [liveTrackingOrder, setLiveTrackingOrder] = useState<Order | null>(null);
  
  // Drone tracking state
  const [showDroneTracking, setShowDroneTracking] = useState<boolean>(false);
  const [droneTrackingOrder, setDroneTrackingOrder] = useState<Order | null>(null);
  
  // Create handler functions using helper functions
  const navigateToScreen = createNavigationHandler(
    setCurrentScreen,
    setCurrentVendor,
    setCurrentProduct,
    setCurrentOrder,
    setSearchQuery,
    setSelectedCategory
  );

  const handleLogin = createLoginHandler(
    setUser,
    setCurrentScreen,
    hasLocationPermission
  );

  const handleLogout = createLogoutHandler(
    setUser,
    setCartItems,
    setOrders,
    setSavedItems,
    setHasLocationPermission,
    setCurrentScreen,
    onLogoutProp
  );

  const { handleLocationGranted, handleLocationSkipped } = createLocationHandlers(
    setHasLocationPermission,
    setUser,
    setCurrentScreen,
    user
  );

  const { handleAddToCart: baseHandleAddToCart, handleUpdateCart, handlePlaceOrder } = createCartHandlers(
    cartItems,
    setCartItems,
    setOrders,
    setCurrentOrder,
    setCurrentScreen
  );

  // Enhanced add to cart handler with modal
  const handleAddToCart = (item: Omit<CartItem, 'id'>) => {
    // Add item to cart using the base handler
    baseHandleAddToCart(item);
    
    // Show the success modal with the added item (show the quantity just added)
    const newItem: CartItem = { ...item, id: Date.now().toString() };
    setLastAddedItem(newItem);
    setShowAddedToCartModal(true);
  };

  const handleToggleSaved = createFavoritesHandler(savedItems, setSavedItems);
  
  const handleBottomNavigation = createBottomNavigationHandler(setCurrentScreen, cartItems);
  
  const handleSearch = createSearchHandler(setSearchQuery, navigateToScreen);
  
  const handleCategoryNavigation = createCategoryHandler(setSelectedCategory, navigateToScreen);

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    navigateToScreen('login');
  };

  // Handle place order with current orders state
  const handlePlaceOrderWrapper = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    handlePlaceOrder(orderData, orders);
  };

  // Handle profile updates
  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Handle AI assistant
  const handleAIAssistantOpen = () => {
    setShowAIAssistant(true);
  };

  // Handle AI option selection from assistant
  const handleAIOptionSelect = (optionId: string) => {
    setShowAIAssistant(false);
    setCurrentAIScreen(optionId);
    setShowAIFeatures(true);
  };

  // Handle AI features back navigation
  const handleAIFeaturesBack = () => {
    setShowAIFeatures(false);
    setCurrentAIScreen('assistant');
  };

  // Handle added to cart modal close
  const handleAddedToCartModalClose = () => {
    setShowAddedToCartModal(false);
    setLastAddedItem(null);
  };

  // Handle view cart from modal
  const handleViewCartFromModal = () => {
    handleAddedToCartModalClose();
    navigateToScreen('cart');
  };

  // Handle enhanced order tracking
  const handleOpenEnhancedTracking = (order: Order) => {
    setTrackingOrder(order);
    setShowEnhancedTracking(true);
  };

  const handleCloseEnhancedTracking = () => {
    setShowEnhancedTracking(false);
    setTrackingOrder(null);
  };

  // Handle live tracking map
  const handleOpenLiveTrackingMap = (order: Order) => {
    setLiveTrackingOrder(order);
    setShowLiveTrackingMap(true);
  };

  const handleCloseLiveTrackingMap = () => {
    setShowLiveTrackingMap(false);
    setLiveTrackingOrder(null);
  };

  // Handle drone tracking
  const handleOpenDroneTracking = (order: Order) => {
    setDroneTrackingOrder(order);
    setShowDroneTracking(true);
  };

  const handleCloseDroneTracking = () => {
    setShowDroneTracking(false);  
    setDroneTrackingOrder(null);
  };

  // Demo function to open enhanced tracking with current order or a mock order
  const handleOpenDemoTracking = () => {
    const demoOrder = orders.find(order => order.status === 'preparing') || orders[0] || {
      id: 'DEMO-001',
      items: [
        {
          id: '1',
          name: 'Demo Burger Combo',
          price: 8500,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
          vendorId: 'demo-vendor',
          vendorName: 'Demo Restaurant'
        }
      ],
      total: 10500,
      status: 'preparing',
      vendorName: 'Demo Restaurant',
      deliveryAddress: 'KG 123 St, Kigali',
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };
    handleOpenEnhancedTracking(demoOrder);
  };

  return (
    <div className="relative size-full overflow-hidden">
      {/* Main Screen Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial="initial"
          animate="in"
          exit="out"
          variants={SCREEN_VARIANTS}
          transition={SCREEN_TRANSITION}
          className="size-full"
        >
          <ScreenRenderer
            currentScreen={currentScreen}
            language={language}
            user={user}
            cartItems={cartItems}
            orders={orders}
            savedItems={savedItems}
            currentVendor={currentVendor}
            currentProduct={currentProduct}
            currentOrder={currentOrder}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            hasCompletedOnboarding={hasCompletedOnboarding}
            onLanguageChange={setLanguage}
            onNavigate={navigateToScreen}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onLocationGranted={handleLocationGranted}
            onLocationSkipped={handleLocationSkipped}
            onAddToCart={handleAddToCart}
            onUpdateCart={handleUpdateCart}
            onPlaceOrder={handlePlaceOrderWrapper}
            onToggleSaved={handleToggleSaved}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onCloseSidebar={() => setIsSidebarOpen(false)}
            onSearch={handleSearch}
            onCategoryNavigation={handleCategoryNavigation}
            onAIFeatureOpen={handleAIOptionSelect}
            onOpenEnhancedTracking={handleOpenEnhancedTracking}
            onOpenDemoTracking={handleOpenDemoTracking}
            onOpenLiveMap={handleOpenLiveTrackingMap}
            onOpenDroneTracking={handleOpenDroneTracking}
          />
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation - Now handles its own positioning and spacing */}
      {SCREENS_WITH_BOTTOM_NAV.includes(currentScreen) && (
        <BottomNavigation
          language={language}
          currentScreen={currentScreen}
          onNavigate={handleBottomNavigation}
          onAIAssistantOpen={handleAIAssistantOpen}
        />
      )}

      {/* Sidebar Menu */}
      <SidebarMenu
        language={language}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={(screen) => {
          setIsSidebarOpen(false);
          navigateToScreen(screen);
        }}
        onLanguageChange={setLanguage}
        onLogout={handleLogout}
      />

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          onTouchStart={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 touch-manipulation"
        />
      )}

      {/* AI Assistant Modal */}
      <RedesignedAIAssistant
        language={language}
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onOptionSelect={handleAIOptionSelect}
      />

      {/* AI Features Navigator */}
      {showAIFeatures && (
        <div className="fixed inset-0 z-50">
          <AIFeaturesNavigator
            language={language}
            onBack={handleAIFeaturesBack}
            initialScreen={currentAIScreen}
            onNavigateToVendor={(vendorId) => {
              // Navigate to vendor profile and close AI features
              setShowAIFeatures(false);
              
              // Find vendor data - in a real app this would come from an API
              const getVendorData = (id: string) => {
                switch (id) {
                  case 'golden-spoon-restaurant':
                    return {
                      id,
                      name: 'Golden Spoon Restaurant',
                      rating: 4.8,
                      category: 'Italian & Pizza',
                      deliveryTime: '25-35 min',
                      deliveryFee: 2.50,
                      distance: '1.2 km',
                      image: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc1NzY2ODk3MHww&ixlib=rb-4.1.0&q=80&w=1080'
                    };
                  case 'spice-garden':
                    return {
                      id,
                      name: 'Spice Garden',
                      rating: 4.6,
                      category: 'Indian Cuisine',
                      deliveryTime: '20-30 min',
                      deliveryFee: 1.99,
                      distance: '0.8 km',
                      image: 'https://images.unsplash.com/photo-1728910758653-7e990e489cac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmb29kJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NTc2NDE0MDF8MA&ixlib=rb-4.1.0&q=80&w=1080'
                    };
                  case 'fresh-healthy':
                    return {
                      id,
                      name: 'Fresh & Healthy',
                      rating: 4.9,
                      category: 'Healthy Bowls',
                      deliveryTime: '15-25 min',
                      deliveryFee: 2.99,
                      distance: '1.5 km',
                      image: 'https://images.unsplash.com/photo-1651978595428-b79169f223a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU3NzA3MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
                    };
                  default:
                    return {
                      id: vendorId,
                      name: 'Restaurant',
                      rating: 4.5,
                      category: 'Food & Dining',
                      deliveryTime: '30-40 min',
                      deliveryFee: 2.00,
                      distance: '2.0 km'
                    };
                }
              };
              
              const mockVendorData = getVendorData(vendorId);
              navigateToScreen('vendor-profile', { vendor: mockVendorData });
            }}
            onNavigateToCart={() => {
              // Navigate to cart and close AI features
              setShowAIFeatures(false);
              navigateToScreen('cart');
            }}
            onAddToCart={handleAddToCart}
          />
        </div>
      )}

      {/* Added to Cart Success Modal */}
      <AddedToCartModal
        language={language}
        isOpen={showAddedToCartModal}
        onClose={handleAddedToCartModalClose}
        onViewCart={handleViewCartFromModal}
        addedItem={lastAddedItem}
      />

      {/* Enhanced Order Tracking Modal */}
      {trackingOrder && (
        <EnhancedOrderTrackingModal
          language={language}
          isOpen={showEnhancedTracking}
          onClose={handleCloseEnhancedTracking}
          order={trackingOrder}
          onOpenLiveMap={handleOpenLiveTrackingMap}
        />
      )}

      {/* Live Tracking Map */}
      {liveTrackingOrder && showLiveTrackingMap && (
        <LiveTrackingMap
          order={liveTrackingOrder}
          language={language}
          onBack={handleCloseLiveTrackingMap}
          isDroneDelivery={liveTrackingOrder.isDroneDelivery || false}
        />
      )}

      {/* Drone Delivery Visualization */}
      {droneTrackingOrder && showDroneTracking && (
        <DroneDeliveryVisualization
          language={language}
          orderId={droneTrackingOrder.id}
          onClose={handleCloseDroneTracking}
          onViewFullMap={(isDroneDelivery) => {
            handleCloseDroneTracking();
            // Set a flag to indicate this is from drone tracking
            setLiveTrackingOrder({ ...droneTrackingOrder, isDroneDelivery });
            setShowLiveTrackingMap(true);
          }}
        />
      )}
    </div>
  );
}