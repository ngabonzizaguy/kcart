/**
 * DeliGo Helper Functions & Data Structures
 * 
 * This file contains utility functions, data structures, and patterns
 * that demonstrate the DeliGo Glass Design Language implementation.
 * 
 * Key Patterns:
 * - Bilingual content structures
 * - API integration placeholders
 * - Glass design utilities
 * - Mobile-safe calculations
 * - Order status management
 * - Payment processing structure
 * 
 * TODO: Replace mock data with real API integrations
 * TODO: Add error handling and loading states
 * TODO: Implement real-time data synchronization
 */

// ============================================================================
// BILINGUAL CONTENT PATTERNS
// ============================================================================

/**
 * Standard bilingual content structure
 * Use this pattern for all user-facing text in the app
 */
export interface BilingualContent {
  en: string;
  rw: string;
}

/**
 * Complex content structure for screens with multiple text elements
 * Demonstrates proper organization for maintainable translations
 */
export interface ScreenContent {
  title: BilingualContent;
  subtitle: BilingualContent;
  actions: {
    primary: BilingualContent;
    secondary: BilingualContent;
    cancel: BilingualContent;
  };
  messages: {
    success: BilingualContent;
    error: BilingualContent;
    loading: BilingualContent;
  };
}

/**
 * Example content structure - use as template for new screens
 */
export const exampleContent: ScreenContent = {
  title: {
    en: 'Order Confirmation',
    rw: 'Kwemeza Ikurikira'
  },
  subtitle: {
    en: 'Please review your order details',
    rw: 'Nyamuneka reba amakuru y\'ikurikira ryawe'
  },
  actions: {
    primary: {
      en: 'Confirm Order',
      rw: 'Emeza Ikurikira'
    },
    secondary: {
      en: 'Edit Cart',
      rw: 'Hindura Agitebo'
    },
    cancel: {
      en: 'Cancel',
      rw: 'Kuraguza'
    }
  },
  messages: {
    success: {
      en: 'Order placed successfully!',
      rw: 'Ikurikira ryashyizweho neza!'
    },
    error: {
      en: 'Failed to place order',
      rw: 'Kurikira ntabwo ryashobotse gushyirwaho'
    },
    loading: {
      en: 'Placing your order...',
      rw: 'Turashyira ikurikira ryawe...'
    }
  }
};

// ============================================================================
// GLASS DESIGN UTILITIES
// ============================================================================

/**
 * Glass morphism CSS class generator
 * Returns appropriate Tailwind classes for glass effects
 */
export const getGlassClasses = (strength: 'standard' | 'strong' | 'subtle' = 'standard'): string => {
  const baseClasses = 'backdrop-blur-sm border border-white/20 rounded-3xl';
  
  switch (strength) {
    case 'strong':
      return `bg-white/90 backdrop-blur-md border-white/30 ${baseClasses}`;
    case 'subtle':
      return `bg-white/60 backdrop-blur-sm border-white/10 ${baseClasses}`;
    case 'standard':
    default:
      return `bg-white/80 ${baseClasses}`;
  }
};

/**
 * Orange CTA button classes - use for all primary actions
 */
export const getOrangeCTAClasses = (size: 'small' | 'default' | 'large' = 'default'): string => {
  const baseClasses = 'bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors';
  
  switch (size) {
    case 'small':
      return `${baseClasses} h-10 px-4 text-sm`;
    case 'large':
      return `${baseClasses} h-14 px-8 text-lg`;
    case 'default':
    default:
      return `${baseClasses} h-12 px-6`;
  }
};

/**
 * Status indicator color mapping
 * Returns appropriate colors for different order/payment statuses
 */
export const getStatusColors = (status: string) => {
  const statusMap: Record<string, { bg: string; text: string; icon: string }> = {
    // Order statuses
    'placed': { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500' },
    'accepted': { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-500' },
    'preparing': { bg: 'bg-orange-100', text: 'text-orange-700', icon: 'text-orange-500' },
    'out-for-delivery': { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-500' },
    'delivered': { bg: 'bg-green-100', text: 'text-green-700', icon: 'text-green-500' },
    'cancelled': { bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-500' },
    
    // Payment statuses
    'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: 'text-yellow-500' },
    'completed': { bg: 'bg-green-100', text: 'text-green-700', icon: 'text-green-500' },
    'failed': { bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-500' }
  };
  
  return statusMap[status] || statusMap['placed'];
};

// ============================================================================
// DATA STRUCTURES & TYPES
// ============================================================================

/**
 * Restaurant/Vendor data structure
 * TODO: Replace with real API response structure
 */
export interface Restaurant {
  id: string;
  name: BilingualContent;
  description: BilingualContent;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  categories: string[];
  location: {
    address: BilingualContent;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  contact: {
    phone: string;
    email?: string;
  };
  operatingHours: {
    open: string;
    close: string;
    timezone: string;
  };
  isOpen: boolean;
  featured: boolean;
}

/**
 * Menu item data structure
 * TODO: Connect to restaurant management system
 */
export interface MenuItem {
  id: string;
  name: BilingualContent;
  description: BilingualContent;
  price: number;
  image: string;
  category: string;
  ingredients: BilingualContent[];
  allergens: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  customizations: {
    id: string;
    name: BilingualContent;
    options: {
      id: string;
      name: BilingualContent;
      price: number;
    }[];
  }[];
  availability: {
    isAvailable: boolean;
    estimatedPrepTime: number;
  };
  popular: boolean;
  spicyLevel?: 1 | 2 | 3 | 4 | 5;
}

/**
 * Order data structure
 * TODO: Integrate with order management API
 */
export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  status: 'placed' | 'accepted' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  items: {
    menuItemId: string;
    quantity: number;
    customizations: {
      customizationId: string;
      optionId: string;
    }[];
    specialInstructions?: string;
  }[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    tax: number;
    tip: number;
    total: number;
  };
  payment: {
    method: 'momo' | 'card' | 'cash';
    status: 'pending' | 'completed' | 'failed';
    transactionId: string;
    paidAt?: string;
  };
  delivery: {
    address: BilingualContent;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    instructions?: string;
    estimatedDeliveryTime: string;
    actualDeliveryTime?: string;
  };
  timeline: {
    placedAt: string;
    acceptedAt?: string;
    preparingAt?: string;
    outForDeliveryAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
  };
  driver?: {
    id: string;
    name: string;
    phone: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}

/**
 * User profile data structure
 * TODO: Connect to user authentication system
 */
export interface UserProfile {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  profileImage?: string;
  preferredLanguage: 'en' | 'rw';
  addresses: {
    id: string;
    type: 'home' | 'work' | 'other';
    name: BilingualContent;
    address: BilingualContent;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    instructions?: string;
    isDefault: boolean;
  }[];
  paymentMethods: {
    id: string;
    type: 'momo' | 'card';
    name: string;
    details: {
      // For mobile money
      phoneNumber?: string;
      provider?: 'MTN' | 'Airtel';
      // For cards
      lastFourDigits?: string;
      expiryMonth?: number;
      expiryYear?: number;
      cardType?: 'visa' | 'mastercard';
    };
    isDefault: boolean;
  }[];
  preferences: {
    notifications: {
      orderUpdates: boolean;
      promotions: boolean;
      newRestaurants: boolean;
    };
    dietary: {
      vegetarian: boolean;
      vegan: boolean;
      glutenFree: boolean;
      dairyFree: boolean;
      nutFree: boolean;
    };
  };
  orderHistory: string[]; // Order IDs
  favorites: {
    restaurants: string[]; // Restaurant IDs
    menuItems: string[]; // Menu Item IDs
  };
}

// ============================================================================
// API INTEGRATION HELPERS
// ============================================================================

/**
 * API Response wrapper type
 * Use this pattern for all API responses
 */
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: BilingualContent;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      hasNext: boolean;
    };
  };
}

/**
 * Mock API call wrapper - replace with real API client
 * TODO: Implement real HTTP client with authentication
 */
export const mockAPICall = async <T>(
  endpoint: string, 
  data?: any, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
): Promise<APIResponse<T>> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`🔄 Mock API Call: ${method} ${endpoint}`, data);
  
  // TODO: Replace with real API implementation
  // Example: return await apiClient.request({ method, url: endpoint, data });
  
  return {
    success: true,
    data: data as T,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `mock-${Date.now()}`
    }
  };
};

/**
 * Order tracking subscription helper
 * TODO: Implement real-time WebSocket connection
 */
export const subscribeToOrderUpdates = (
  orderId: string,
  onUpdate: (order: Order) => void
): (() => void) => {
  console.log(`📡 Subscribing to order updates: ${orderId}`);
  
  // Mock real-time updates
  const interval = setInterval(() => {
    // TODO: Replace with real WebSocket implementation
    // Example: websocket.on(`order:${orderId}`, onUpdate);
    
    console.log(`🔔 Mock order update for ${orderId}`);
  }, 30000); // Mock update every 30 seconds
  
  // Return unsubscribe function
  return () => {
    clearInterval(interval);
    console.log(`❌ Unsubscribed from order updates: ${orderId}`);
  };
};

/**
 * Payment processing helper
 * TODO: Integrate with real payment gateway
 */
export const processPayment = async (paymentData: {
  amount: number;
  method: 'momo' | 'card';
  details: any;
}): Promise<APIResponse<{ transactionId: string }>> => {
  console.log('💳 Processing payment:', paymentData);
  
  // TODO: Integrate with payment provider (e.g., MTN MoMo, Stripe)
  // Example: return await paymentGateway.process(paymentData);
  
  return {
    success: true,
    data: {
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `payment-${Date.now()}`
    }
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format price in Rwandan Francs
 */
export const formatPrice = (amount: number): string => {
  return `${amount.toLocaleString()} RWF`;
};

/**
 * Calculate delivery time estimate
 */
export const calculateDeliveryTime = (
  restaurantPrepTime: number,
  deliveryDistance: number
): string => {
  const prepTime = restaurantPrepTime;
  const deliveryTime = Math.ceil(deliveryDistance * 2); // Estimate 2 minutes per km
  const totalTime = prepTime + deliveryTime;
  
  return `${totalTime}-${totalTime + 10} mins`;
};

/**
 * Get appropriate greeting based on time of day
 */
export const getTimeBasedGreeting = (language: 'en' | 'rw'): string => {
  const hour = new Date().getHours();
  
  if (language === 'en') {
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  } else {
    if (hour < 12) return 'Mwaramutse';
    if (hour < 17) return 'Mwiriwe';
    return 'Muramuke';
  }
};

/**
 * Validate phone number (Rwanda format)
 */
export const validateRwandanPhone = (phone: string): boolean => {
  const rwandaPhoneRegex = /^(\+?25)?[0-9]{9}$/;
  return rwandaPhoneRegex.test(phone);
};

/**
 * Safe area calculations for mobile devices
 */
export const getSafeAreaPadding = (side: 'top' | 'bottom' | 'left' | 'right'): string => {
  switch (side) {
    case 'top': return 'pt-safe';
    case 'bottom': return 'pb-safe';
    case 'left': return 'pl-safe';
    case 'right': return 'pr-safe';
    default: return '';
  }
};

/**
 * Generate unique ID for client-side entities
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

/**
 * Generate mock restaurant data for development
 * TODO: Remove when real API is integrated
 */
export const generateMockRestaurant = (id: string): Restaurant => {
  return {
    id,
    name: {
      en: `Restaurant ${id}`,
      rw: `Resitora ${id}`
    },
    description: {
      en: 'Delicious local and international cuisine',
      rw: 'Ibiryo byiza byo mu gihugu no mu mahanga'
    },
    image: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop`,
    rating: 4.2 + Math.random() * 0.8,
    deliveryTime: `${20 + Math.floor(Math.random() * 30)}-${40 + Math.floor(Math.random() * 20)} mins`,
    deliveryFee: 1000 + Math.floor(Math.random() * 2000),
    minimumOrder: 5000 + Math.floor(Math.random() * 5000),
    categories: ['African', 'International'],
    location: {
      address: {
        en: `Kigali, Rwanda - Area ${id}`,
        rw: `Kigali, u Rwanda - Agace ${id}`
      },
      coordinates: {
        latitude: -1.9441 + (Math.random() - 0.5) * 0.1,
        longitude: 30.0619 + (Math.random() - 0.5) * 0.1
      }
    },
    contact: {
      phone: `+250 788 ${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
    },
    operatingHours: {
      open: '08:00',
      close: '22:00',
      timezone: 'Africa/Kigali'
    },
    isOpen: Math.random() > 0.2,
    featured: Math.random() > 0.7
  };
};

/**
 * DeliGo Glass Design Language implementation checklist:
 * 
 * ✅ Bilingual content structures (BilingualContent interface)
 * ✅ Glass morphism utilities (getGlassClasses function)
 * ✅ Orange CTA patterns (getOrangeCTAClasses function)
 * ✅ Status color mapping (getStatusColors function)
 * ✅ Mobile-safe utilities (getSafeAreaPadding function)
 * ✅ Comprehensive data structures (Restaurant, MenuItem, Order, UserProfile)
 * ✅ API integration patterns (APIResponse, mockAPICall)
 * ✅ Real-time subscription patterns (subscribeToOrderUpdates)
 * ✅ Payment processing structure (processPayment)
 * ✅ Utility functions for common operations
 * ✅ Mock data generators for development
 * 
 * Remember: All components should follow the DeliGo Glass Design Language
 * - Use warm cream/orange color schemes
 * - Apply glass morphism to all cards and overlays
 * - Support bilingual content
 * - Maintain mobile-first approach with safe areas
 * - Use consistent 44px touch targets
 * - Comment all TODO items for real API integration
 */