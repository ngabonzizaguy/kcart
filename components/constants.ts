import type { Screen } from './types';

// Screens that should display the bottom navigation bar
export const SCREENS_WITH_BOTTOM_NAV: Screen[] = [
  'home', 
  'orders', 
  'saved', 
  'cart', 
  'profile', 
  'search', 
  'notifications',
  'category',
  'popular-restaurants',
  'nearby-restaurants',
  'vendor-profile', 
  'product-detail',
  'chat-history',
  'ai-chat',
  'menu-category',
  'loyalty-rewards',
  'referrals'
];

// Screen transition animation variants for smooth navigation
export const SCREEN_VARIANTS = {
  initial: { opacity: 0, x: 50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -50 }
};

// Screen transition timing configuration
export const SCREEN_TRANSITION = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.3
};

// Default app state values
export const DEFAULT_APP_STATE = {
  currentScreen: 'splash' as Screen,
  language: 'en' as 'en' | 'rw',
  user: null,
  cartItems: [],
  orders: [],
  savedItems: [],
  currentVendor: null,
  currentProduct: null,
  currentOrder: null,
  searchQuery: '',
  selectedCategory: null,
  isSidebarOpen: false,
  hasCompletedOnboarding: false,
  hasLocationPermission: false
};