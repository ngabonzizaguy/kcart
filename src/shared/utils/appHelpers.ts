import type { Screen, CartItem, Order, User, NavigationData, AppState } from '../../types';

// Navigation helper functions
export const createNavigationHandler = (
  setCurrentScreen: (screen: Screen) => void,
  setCurrentVendor: (vendor: any) => void,
  setCurrentProduct: (product: any) => void,
  setCurrentOrder: (order: Order | null) => void,
  setSearchQuery: (query: string) => void,
  setSelectedCategory: (category: any) => void
) => {
  return (screen: Screen, data?: NavigationData) => {
    try {
      // Handle data passing between screens
      if (data?.vendor) setCurrentVendor(data.vendor);
      if (data?.product) setCurrentProduct(data.product);
      if (data?.order) {
        // Validate order data before setting
        if (typeof data.order === 'object' && data.order !== null) {
          setCurrentOrder(data.order);
        } else {
          console.warn('Invalid order data provided:', data.order);
          setCurrentOrder(null);
        }
      }
      if (data?.query) setSearchQuery(data.query);
      if (data?.category) {
        // Check if this is for menu-category screen (has vendor) or regular category screen
        if (data.vendor) {
          // For menu-category screen, store both category and vendor data
          setSelectedCategory({
            category: data.category,
            vendor: data.vendor
          });
        } else {
          // For regular category screen, store category directly
          setSelectedCategory(data.category);
        }
      }
      
      setCurrentScreen(screen);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fall back to safe navigation without data
      setCurrentScreen(screen);
    }
  };
};

// User authentication helpers
export const createLoginHandler = (
  setUser: (user: User) => void,
  setCurrentScreen: (screen: Screen) => void,
  hasLocationPermission: boolean
) => {
  return (userData: User) => {
    setUser(userData);
    
    // Check if user needs location permission
    if (!userData.location && !hasLocationPermission) {
      setCurrentScreen('location-permission');
    } else {
      setCurrentScreen('home');
    }
  };
};

export const createLogoutHandler = (
  setUser: (user: User | null) => void,
  setCartItems: (items: CartItem[]) => void,
  setOrders: (orders: Order[]) => void,
  setSavedItems: (items: string[]) => void,
  setHasLocationPermission: (hasPermission: boolean) => void,
  setCurrentScreen: (screen: Screen) => void,
  onLogout?: () => void
) => {
  return () => {
    setUser(null);
    setCartItems([]);
    setOrders([]);
    setSavedItems([]);
    setHasLocationPermission(false);
    
    if (onLogout) {
      onLogout();
    } else {
      setCurrentScreen('splash');
    }
  };
};

// Location permission helpers
export const createLocationHandlers = (
  setHasLocationPermission: (hasPermission: boolean) => void,
  setUser: (user: User | null) => void,
  setCurrentScreen: (screen: Screen) => void,
  user: User | null
) => {
  const handleLocationGranted = (location: string) => {
    setHasLocationPermission(true);
    if (user) {
      setUser({ ...user, location });
    }
    setCurrentScreen('home');
  };

  const handleLocationSkipped = () => {
    setHasLocationPermission(true);
    setCurrentScreen('home');
  };

  return { handleLocationGranted, handleLocationSkipped };
};

// Cart management helpers
export const createCartHandlers = (
  cartItems: CartItem[],
  setCartItems: (items: CartItem[]) => void,
  setOrders: (orders: Order[]) => void,
  setCurrentOrder: (order: Order | null) => void,
  setCurrentScreen: (screen: Screen) => void
) => {
  const handleAddToCart = (item: Omit<CartItem, 'id'>) => {
    const existingItem = cartItems.find(
      ci => ci.name === item.name && ci.vendorId === item.vendorId
    );

    if (existingItem) {
      setCartItems(cartItems.map(ci =>
        ci.id === existingItem.id
          ? { ...ci, quantity: ci.quantity + item.quantity }
          : ci
      ));
    } else {
      setCartItems([...cartItems, { ...item, id: Date.now().toString() }]);
    }
  };

  const handleUpdateCart = (updatedItems: CartItem[]) => {
    setCartItems(updatedItems);
  };

  const handlePlaceOrder = (orderData: Omit<Order, 'id' | 'createdAt'>, orders: Order[]) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setOrders([...orders, newOrder]);
    setCurrentOrder(newOrder);
    setCartItems([]);
    setCurrentScreen('order-tracking');
  };

  return { handleAddToCart, handleUpdateCart, handlePlaceOrder };
};

// Favorites management helper
export const createFavoritesHandler = (
  savedItems: string[],
  setSavedItems: (items: string[]) => void
) => {
  return (itemId: string) => {
    setSavedItems(
      savedItems.includes(itemId)
        ? savedItems.filter(id => id !== itemId)
        : [...savedItems, itemId]
    );
  };
};

// Bottom navigation helper
export const createBottomNavigationHandler = (
  setCurrentScreen: (screen: Screen) => void,
  cartItems: CartItem[]
) => {
  return (screen: Screen) => {
    if (screen === 'cart' && cartItems.length === 0) {
      // Show empty cart state
      setCurrentScreen('cart');
    } else {
      setCurrentScreen(screen);
    }
  };
};

// Search functionality helper
export const createSearchHandler = (
  setSearchQuery: (query: string) => void,
  navigateToScreen: (screen: Screen, data?: NavigationData) => void
) => {
  return (query: string) => {
    setSearchQuery(query);
    navigateToScreen('search', { query });
  };
};

// Category navigation helper
export const createCategoryHandler = (
  setSelectedCategory: (category: any) => void,
  navigateToScreen: (screen: Screen, data?: NavigationData) => void
) => {
  return (category: any) => {
    setSelectedCategory(category);
    navigateToScreen('category', { category });
  };
};