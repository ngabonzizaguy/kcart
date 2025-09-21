// Core application types and interfaces for DeliGo food delivery app

export type Screen = 
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'location-permission'
  | 'home'
  | 'search'
  | 'notifications'
  | 'category'
  | 'popular-restaurants'
  | 'nearby-restaurants'
  | 'vendor-profile'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-tracking'
  | 'orders'
  | 'saved'
  | 'profile'
  | 'chat-history'
  | 'ai-settings'
  | 'ai-chat'
  | 'blockchain'
  | 'menu-category'
  | 'loyalty-rewards'
  | 'referrals';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendorId: string;
  vendorName: string;
  description?: string;
  customizations?: string[];
  customIngredients?: string[];
  originalIngredients?: string[];
  specialNotes?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  isGuest: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'placed' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  vendorName: string;
  deliveryAddress: string;
  createdAt: string;
  estimatedDelivery: string;
  isDroneDelivery?: boolean; // Flag for drone delivery tracking features
}

export interface AppState {
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
  isSidebarOpen: boolean;
  hasCompletedOnboarding: boolean;
  hasLocationPermission: boolean;
}

export interface NavigationData {
  vendor?: any;
  product?: any;
  order?: Order;
  query?: string;
  category?: any;
}