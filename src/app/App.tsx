// import React, { useState, useEffect } from 'react';
// // NEW STRUCTURE: Using restructured components from features
// import { MainApp } from './src/features/customer/components/MainApp';
// import { VendorDashboard } from './components/VendorDashboardFixed';
// import { AdminDashboard } from './components/AdminDashboard';
// import { RoleSelectionScreen } from './src/features/auth/components/RoleSelectionScreen';
// import { RoleSpecificOnboarding } from './src/features/auth/components/RoleSpecificOnboarding';
// import { ErrorBoundary } from './src/shared/components/common/ErrorBoundary';
// // FEATURE FLAGS: Centralized feature management system
// import { FeatureFlagProvider, FeatureFlagDebugger } from './src/shared/contexts/FeatureFlagContext';
// // SHARED DATA TYPES: Business data models for vendor-customer integration
// import type { Order, CartItem, User } from './src/types';

// /**
//  * DeliGo - Production Mobile Food Delivery Application
//  * Built using the "DeliGo Glass Design Language" - a warm, mobile-first design system
//  * 
//  * 🔗 SHARED DATA ARCHITECTURE:
//  * This file implements the global data store that enables real-time data flow between:
//  * - Customer App (MainApp) ↔ Vendor Dashboard
//  * - Future Admin Interface integration ready
//  * - API integration points clearly marked with TODO comments
//  * 
//  * COMPLETE ONBOARDING FLOW:
//  * 1. UnifiedSplashScreen (3-second brand introduction)
//  * 2. RoleSelectionScreen (Customer vs Vendor selection)
//  * 3. RoleSpecificOnboarding (Role-appropriate feature walkthrough)
//  * 4. MainApp (customers) or VendorDashboard (vendors)
//  * 
//  * CUSTOMER EXPERIENCE:
//  * - Browse restaurants and menu items
//  * - Add items to cart and place orders
//  * - Real-time order tracking with live maps
//  * - AI features (chat, food scan, voice ordering)
//  * - Saved items and order history
//  * - Profile management and settings
//  * 
//  * VENDOR EXPERIENCE:
//  * - Real-time order management (accept/reject/prepare)
//  * - Menu item availability control
//  * - Business status management (online/offline)
//  * - Sales analytics and performance metrics
//  * - Operating hours and promotion management
//  * 
//  * 🔄 DATA FLOW TESTING:
//  * - Vendor menu updates → Customer sees changes immediately
//  * - Customer orders → Vendor receives orders in real-time
//  * - Order status updates → Bi-directional real-time sync
//  * 
//  * DESIGN FEATURES:
//  * - Warm cream/orange glass morphism design
//  * - Bilingual support (English/Kinyarwanda)
//  * - Mobile-first responsive (393x852)
//  * - Accessible 44px touch targets
//  * - Smooth animations and transitions
//  * 
//  * 📖 INTEGRATION GUIDE: See /SHARED_DATA_INTEGRATION_GUIDE.md for complete documentation
//  */

// type OnboardingStep = 'splash' | 'roleSelection' | 'onboarding' | 'app';
// type UserRole = 'customer' | 'vendor' | 'admin' | null;
// type Language = 'en' | 'rw';

// // ===== SHARED BUSINESS DATA TYPES =====
// // These interfaces match expected API responses for easy integration
// interface Restaurant {
//   id: string;
//   name: { en: string; rw: string };
//   description: { en: string; rw: string };
//   category: string;
//   rating: number;
//   deliveryTime: string;
//   deliveryFee: number;
//   distance: string;
//   image: string;
//   isOpen: boolean;
//   operatingHours: {
//     open: string;
//     close: string;
//     daysOpen: string[];
//   };
//   menu: MenuItem[];
//   vendorId: string;
//   location: {
//     lat: number;
//     lng: number;
//     address: string;
//   };
// }

// interface MenuItem {
//   id: string;
//   name: { en: string; rw: string };
//   description: { en: string; rw: string };
//   price: number;
//   image: string;
//   category: string;
//   available: boolean;
//   preparationTime: number;
//   restaurantId: string;
//   allergens?: string[];
//   nutritionInfo?: {
//     calories: number;
//     protein: number;
//     carbs: number;
//     fat: number;
//   };
// }

// interface VendorProfile {
//   id: string;
//   restaurantId: string;
//   businessName: string;
//   ownerName: string;
//   phone: string;
//   email: string;
//   businessLicense: string;
//   status: 'active' | 'inactive' | 'pending';
//   joinedDate: string;
// }

// // ===== MOCK DATA FOR TESTING SHARED FLOWS =====
// // TODO: Replace with real API data - structured to match expected API responses

// const mockRestaurants: Restaurant[] = [
//   {
//     id: 'rest-001',
//     name: { en: 'Golden Spoon Restaurant', rw: 'Resitora ya Golden Spoon' },
//     description: { en: 'Authentic local cuisine with international flavors', rw: 'Ibiryo by\'igihugu hamwe n\'ubunyangamugayo bw\'amahanga' },
//     category: 'Local Cuisine',
//     rating: 4.8,
//     deliveryTime: '25-35 min',
//     deliveryFee: 2500,
//     distance: '1.2 km',
//     image: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?w=400',
//     isOpen: true,
//     operatingHours: {
//       open: '08:00',
//       close: '22:00',
//       daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
//     },
//     menu: [
//       {
//         id: 'menu-001',
//         name: { en: 'Grilled Chicken Special', rw: 'Inkoko y\'Akalanga Idasanzwe' },
//         description: { en: 'Tender grilled chicken with local spices', rw: 'Inkoko yoroshye y\'akalanga hamwe n\'ibirungo by\'igihugu' },
//         price: 8500,
//         image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
//         category: 'Main Course',
//         available: true,
//         preparationTime: 15,
//         restaurantId: 'rest-001'
//       },
//       {
//         id: 'menu-002',
//         name: { en: 'Creamy Pasta Delight', rw: 'Pasta y\'Amavuta' },
//         description: { en: 'Rich creamy pasta with vegetables', rw: 'Pasta y\'amavuta hamwe n\'imboga' },
//         price: 6800,
//         image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
//         category: 'Main Course',
//         available: true,
//         preparationTime: 12,
//         restaurantId: 'rest-001'
//       }
//     ],
//     vendorId: 'vendor-001',
//     location: {
//       lat: -1.9506,
//       lng: 30.0588,
//       address: 'KN 5 Rd, Kigali'
//     }
//   },
//   {
//     id: 'rest-002',
//     name: { en: 'Tokyo Sushi Bar', rw: 'Bar ya Sushi ya Tokyo' },
//     description: { en: 'Fresh sushi and Japanese cuisine', rw: 'Sushi nshya n\'ibiryo by\'Ubuyapani' },
//     category: 'Japanese',
//     rating: 4.6,
//     deliveryTime: '20-30 min',
//     deliveryFee: 3000,
//     distance: '2.1 km',
//     image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
//     isOpen: true,
//     operatingHours: {
//       open: '11:00',
//       close: '23:00',
//       daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
//     },
//     menu: [
//       {
//         id: 'menu-003',
//         name: { en: 'Sushi Combo Deluxe', rw: 'Sushi Combo ya VIP' },
//         description: { en: 'Fresh salmon and tuna sushi selection', rw: 'Sushi nshya ya salmon na tuna' },
//         price: 15000,
//         image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
//         category: 'Sushi',
//         available: true,
//         preparationTime: 20,
//         restaurantId: 'rest-002'
//       }
//     ],
//     vendorId: 'vendor-002',
//     location: {
//       lat: -1.9441,
//       lng: 30.0619,
//       address: 'KG 123 St, Kigali'
//     }
//   }
// ];

// const mockOrders: Order[] = [
//   {
//     id: 'ORD-001',
//     items: [
//       {
//         id: 'item-001',
//         name: 'Grilled Chicken Special',
//         price: 8500,
//         quantity: 1,
//         image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
//         vendorId: 'vendor-001',
//         vendorName: 'Golden Spoon Restaurant'
//       }
//     ],
//     total: 11000,
//     status: 'preparing',
//     vendorName: 'Golden Spoon Restaurant',
//     deliveryAddress: 'KG 15 St, Kigali, Rwanda',
//     createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
//     estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
//     deliveryMethod: 'drone'
//   },
//   {
//     id: 'ORD-002',
//     items: [
//       {
//         id: 'item-002',
//         name: 'Sushi Combo Deluxe',
//         price: 15000,
//         quantity: 1,
//         image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
//         vendorId: 'vendor-002',
//         vendorName: 'Tokyo Sushi Bar'
//       }
//     ],
//     total: 18000,
//     status: 'delivered',
//     vendorName: 'Tokyo Sushi Bar',
//     deliveryAddress: 'KN 8 Ave, Kigali, Rwanda',
//     createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
//     estimatedDelivery: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
//     deliveryMethod: 'bike'
//   }
// ];

// const mockUsers: User[] = [
//   {
//     id: 'user-001',
//     name: 'Test Customer',
//     phone: '+250788123456',
//     email: 'customer@deligo.rw',
//     location: 'Kigali, Kacyiru',
//     isGuest: false
//   },
//   {
//     id: 'vendor-001',
//     name: 'Golden Spoon Owner',
//     phone: '+250788654321',
//     email: 'vendor@goldenspoon.rw',
//     location: 'Kigali, Kacyiru',
//     isGuest: false
//   }
// ];

// // ===== API INTEGRATION LAYER =====
// // TODO: Replace these mock functions with real API calls
// class SharedDataService {
//   // ===== RESTAURANT API INTEGRATION POINT =====
//   static async getRestaurants(): Promise<Restaurant[]> {
//     // TODO: Replace with real restaurant API call
//     // Example: return await api.get('/restaurants');
//     console.log('🔄 [API Integration Point] Loading restaurants...');
    
//     // Simulate async operation with controlled delay
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(mockRestaurants);
//       }, 100); // Very short delay to simulate API call
//     });
//   }

//   static async updateRestaurant(id: string, updates: Partial<Restaurant>): Promise<Restaurant> {
//     // TODO: Replace with real restaurant update API
//     // Example: return await api.put(`/restaurants/${id}`, updates);
//     console.log('🔄 [API Integration Point] Updating restaurant:', id, updates);
//     return mockRestaurants.find(r => r.id === id)!;
//   }

//   // ===== ORDER API INTEGRATION POINT =====
//   static async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
//     // TODO: Replace with real order creation API
//     // Example: return await api.post('/orders', order);
//     console.log('🔄 [API Integration Point] Creating order:', order);
//     const newOrder: Order = {
//       ...order,
//       id: `ORD-${Date.now()}`,
//       createdAt: new Date().toISOString()
//     };
//     return newOrder;
//   }

//   static async updateOrderStatus(orderId: string, status: string, vendorId: string): Promise<Order> {
//     // TODO: Replace with real order update API
//     // Example: return await api.patch(`/orders/${orderId}`, { status });
//     console.log('🔄 [API Integration Point] Updating order status:', orderId, status);
//     return mockOrders.find(o => o.id === orderId)!;
//   }

//   // ===== MENU API INTEGRATION POINT =====
//   static async updateMenuItem(restaurantId: string, menuItem: MenuItem): Promise<MenuItem> {
//     // TODO: Replace with real menu update API
//     // Example: return await api.put(`/restaurants/${restaurantId}/menu/${menuItem.id}`, menuItem);
//     console.log('🔄 [API Integration Point] Updating menu item:', restaurantId, menuItem);
//     return menuItem;
//   }

//   // ===== REAL-TIME INTEGRATION POINT =====
//   static subscribeToOrderUpdates(callback: (order: Order) => void) {
//     // TODO: Replace with WebSocket or Server-Sent Events
//     // Example: websocket.on('orderUpdate', callback);
//     console.log('🔄 [Real-time Integration Point] Subscribing to order updates');
//     return () => console.log('🔄 [Real-time Integration Point] Unsubscribing from order updates');
//   }

//   static subscribeToMenuUpdates(callback: (restaurantId: string, menu: MenuItem[]) => void) {
//     // TODO: Replace with WebSocket for real-time menu updates
//     // Example: websocket.on('menuUpdate', callback);
//     console.log('🔄 [Real-time Integration Point] Subscribing to menu updates');
//     return () => console.log('🔄 [Real-time Integration Point] Unsubscribing from menu updates');
//   }
// }

// export default function App() {
//   // Onboarding flow state management
//   const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('splash');
//   const [userRole, setUserRole] = useState<UserRole>(null);
//   const [language, setLanguage] = useState<Language>('en');

//   // ===== SHARED BUSINESS DATA STORE =====
//   // This is the single source of truth that both customer and vendor apps will use
//   const [sharedRestaurants, setSharedRestaurants] = useState<Restaurant[]>([]);
//   const [sharedOrders, setSharedOrders] = useState<Order[]>([]);
//   const [sharedUsers, setSharedUsers] = useState<User[]>([]);
//   const [sharedMenuItems, setSharedMenuItems] = useState<MenuItem[]>([]);

//   // ===== SHARED DATA HANDLERS =====
//   // These functions update the shared state and simulate API calls
  
//   // Vendor → Customer: Restaurant/Menu Updates
//   const handleRestaurantUpdate = async (restaurantId: string, updates: Partial<Restaurant>) => {
//     try {
//       // TODO: Replace with real API call
//       const updatedRestaurant = await SharedDataService.updateRestaurant(restaurantId, updates);
      
//       setSharedRestaurants(prev => 
//         prev.map(restaurant => 
//           restaurant.id === restaurantId 
//             ? { ...restaurant, ...updates }
//             : restaurant
//         )
//       );
      
//       console.log('✅ Restaurant updated - Customers will see changes immediately:', updates);
//     } catch (error) {
//       console.error('❌ Failed to update restaurant:', error);
//     }
//   };

//   const handleMenuItemUpdate = async (restaurantId: string, menuItem: MenuItem) => {
//     try {
//       // TODO: Replace with real API call
//       await SharedDataService.updateMenuItem(restaurantId, menuItem);
      
//       setSharedRestaurants(prev =>
//         prev.map(restaurant => {
//           if (restaurant.id === restaurantId) {
//             const updatedMenu = restaurant.menu.map(item =>
//               item.id === menuItem.id ? menuItem : item
//             );
//             return { ...restaurant, menu: updatedMenu };
//           }
//           return restaurant;
//         })
//       );
      
//       console.log('✅ Menu item updated - Customers will see changes immediately:', menuItem);
//     } catch (error) {
//       console.error('❌ Failed to update menu item:', error);
//     }
//   };

//   // Customer → Vendor: Order Creation
//   const handleOrderCreation = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
//     try {
//       // TODO: Replace with real API call
//       const newOrder = await SharedDataService.createOrder(orderData);
      
//       setSharedOrders(prev => [newOrder, ...prev]);
      
//       console.log('✅ Order created - Vendor will see it immediately:', newOrder);
//       return newOrder;
//     } catch (error) {
//       console.error('❌ Failed to create order:', error);
//       throw error;
//     }
//   };

//   // Vendor → Customer: Order Status Updates
//   const handleOrderStatusUpdate = async (orderId: string, status: string, vendorId: string) => {
//     try {
//       // TODO: Replace with real API call
//       await SharedDataService.updateOrderStatus(orderId, status, vendorId);
      
//       setSharedOrders(prev =>
//         prev.map(order =>
//           order.id === orderId
//             ? { ...order, status: status as any }
//             : order
//         )
//       );
      
//       console.log('✅ Order status updated - Customer will see changes immediately:', { orderId, status });
//     } catch (error) {
//       console.error('❌ Failed to update order status:', error);
//     }
//   };

//   // ===== SHARED DATA INITIALIZATION =====
//   // Initialize shared data on app start with timeout handling
//   useEffect(() => {
//     let isMounted = true;
//     let timeoutId: NodeJS.Timeout;

//     const initializeSharedData = async () => {
//       try {
//         // Set a timeout to prevent infinite waiting
//         const timeoutPromise = new Promise((_, reject) => {
//           timeoutId = setTimeout(() => {
//             reject(new Error('Data initialization timeout'));
//           }, 10000); // 10 second timeout
//         });

//         // Race between data loading and timeout
//         const dataPromise = Promise.all([
//           SharedDataService.getRestaurants(),
//           Promise.resolve(mockOrders),
//           Promise.resolve(mockUsers)
//         ]);

//         const [restaurants, orders, users] = await Promise.race([
//           dataPromise,
//           timeoutPromise
//         ]) as [Restaurant[], Order[], User[]];

//         // Clear timeout if successful
//         if (timeoutId) clearTimeout(timeoutId);

//         // Only update state if component is still mounted
//         if (isMounted) {
//           setSharedRestaurants(restaurants);
//           setSharedOrders(orders);
//           setSharedUsers(users);
          
//           console.log('✅ Shared data initialized:', {
//             restaurants: restaurants.length,
//             orders: orders.length,
//             users: users.length
//           });
//         }
//       } catch (error) {
//         if (timeoutId) clearTimeout(timeoutId);
        
//         if (isMounted) {
//           console.error('❌ Failed to initialize shared data:', error);
          
//           // Fall back to mock data on error
//           setSharedRestaurants(mockRestaurants);
//           setSharedOrders(mockOrders);
//           setSharedUsers(mockUsers);
          
//           console.log('⚠️ Using fallback mock data due to initialization error');
//         }
//       }
//     };

//     initializeSharedData();

//     // Cleanup function
//     return () => {
//       isMounted = false;
//       if (timeoutId) clearTimeout(timeoutId);
//     };
//   }, []);

//   // ===== REAL-TIME UPDATE SIMULATION =====
//   // TODO: Replace with real WebSocket connections
//   useEffect(() => {
//     let isMounted = true;
    
//     console.log('🔄 Setting up real-time update simulation...');
    
//     // Simulate real-time order updates with safety checks
//     const orderUnsubscribe = SharedDataService.subscribeToOrderUpdates((order) => {
//       if (isMounted && order) {
//         setSharedOrders(prev => 
//           prev.map(o => o.id === order.id ? order : o)
//         );
//       }
//     });

//     // Simulate real-time menu updates with safety checks
//     const menuUnsubscribe = SharedDataService.subscribeToMenuUpdates((restaurantId, menu) => {
//       if (isMounted && restaurantId && menu) {
//         setSharedRestaurants(prev =>
//           prev.map(restaurant =>
//             restaurant.id === restaurantId
//               ? { ...restaurant, menu }
//               : restaurant
//           )
//         );
//       }
//     });

//     return () => {
//       isMounted = false;
//       try {
//         orderUnsubscribe();
//         menuUnsubscribe();
//       } catch (error) {
//         console.error('Error during cleanup:', error);
//       }
//     };
//   }, []);

//   // Auto-progress splash screen after 3 seconds
//   useEffect(() => {
//     let timer: NodeJS.Timeout;
    
//     if (onboardingStep === 'splash') {
//       timer = setTimeout(() => {
//         setOnboardingStep('roleSelection');
//       }, 3000);
//     }
    
//     return () => {
//       if (timer) clearTimeout(timer);
//     };
//   }, [onboardingStep]);

//   // Handle splash screen completion (auto-progress after 3 seconds)
//   const handleSplashComplete = () => {
//     setOnboardingStep('roleSelection');
//   };

//   // Handle role selection (Customer, Vendor, or Admin)
//   const handleRoleSelected = (selectedRole: 'customer' | 'vendor' | 'admin') => {
//     setUserRole(selectedRole);
//     // Admins skip onboarding and go directly to dashboard
//     if (selectedRole === 'admin') {
//       setOnboardingStep('app');
//     } else {
//       setOnboardingStep('onboarding');
//     }
//   };

//   // Handle onboarding completion
//   const handleOnboardingComplete = () => {
//     setOnboardingStep('app');
//   };

//   // Handle user logout/back to start
//   const handleUserLogout = () => {
//     // Reset all state to restart the onboarding flow
//     setOnboardingStep('roleSelection');
//     setUserRole(null);
//     // Keep language preference
//   };

//   // Render the appropriate screen based on onboarding step
//   const renderCurrentScreen = () => {
//     switch (onboardingStep) {
//       case 'splash':
//         return (
//           <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center p-6">
//             <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 text-center max-w-sm w-full">
//               <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
//                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
//                   <span className="text-orange-500 font-bold text-lg">DG</span>
//                 </div>
//               </div>
//               <h1 className="text-2xl font-medium text-gray-800 mb-2">DeliGo</h1>
//               <p className="text-gray-600 mb-6">Food delivery made simple</p>
              
//               {/* Auto-advance after 3 seconds */}
//               <div className="w-full bg-gray-200 rounded-full h-1">
//                 <div className="bg-orange-500 h-1 rounded-full animate-pulse w-full"></div>
//               </div>
//             </div>
//           </div>
//         );

//       case 'roleSelection':
//         return (
//           <RoleSelectionScreen 
//             onRoleSelect={handleRoleSelected}
//             language={language}
//             onBack={() => setOnboardingStep('splash')}
//           />
//         );

//       case 'onboarding':
//         if (!userRole) {
//           // Fallback to role selection if role not set
//           setOnboardingStep('roleSelection');
//           return null;
//         }
//         return (
//           <RoleSpecificOnboarding 
//             userRole={userRole}
//             language={language}
//             onComplete={handleOnboardingComplete}
//             onBack={() => setOnboardingStep('roleSelection')}
//           />
//         );

//       case 'app':
//         if (!userRole) {
//           // Fallback to role selection if role not set
//           setOnboardingStep('roleSelection');
//           return null;
//         }

//         // Ensure shared data is available before rendering
//         if (sharedRestaurants.length === 0) {
//           return (
//             <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center p-6">
//               <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 text-center max-w-sm w-full">
//                 <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
//                   <div className="w-6 h-6 bg-white rounded-full"></div>
//                 </div>
//                 <h2 className="text-lg font-medium text-gray-800 mb-2">Loading DeliGo...</h2>
//                 <p className="text-gray-600">Preparing your experience</p>
//               </div>
//             </div>
//           );
//         }

//         // Route to appropriate app based on user role
//         if (userRole === 'customer') {
//           return (
//             <MainApp 
//               initialLanguage={language}
//               onLogout={handleUserLogout}
//               // ===== SHARED DATA INTEGRATION =====
//               // Pass shared business data and handlers to customer app
//               sharedRestaurants={sharedRestaurants}
//               sharedOrders={sharedOrders}
//               sharedUsers={sharedUsers}
//               onCreateOrder={handleOrderCreation}
//               onUpdateOrderStatus={handleOrderStatusUpdate}
//             />
//           );
//         } else if (userRole === 'vendor') {
//           return (
//             <VendorDashboard 
//               language={language}
//               onBack={handleUserLogout}
//               // ===== SHARED DATA INTEGRATION =====
//               // Pass shared business data and handlers to vendor app
//               sharedRestaurants={sharedRestaurants}
//               sharedOrders={sharedOrders}
//               sharedUsers={sharedUsers}
//               onUpdateRestaurant={handleRestaurantUpdate}
//               onUpdateMenuItem={handleMenuItemUpdate}
//               onUpdateOrderStatus={handleOrderStatusUpdate}
//             />
//           );
//         } else if (userRole === 'admin') {
//           return (
//             <AdminDashboard 
//               language={language}
//               onBack={handleUserLogout}
//               // ===== SHARED DATA INTEGRATION =====
//               // Pass shared business data and handlers to admin app
//               sharedRestaurants={sharedRestaurants}
//               sharedOrders={sharedOrders}
//               sharedUsers={sharedUsers}
//               onUpdateRestaurant={handleRestaurantUpdate}
//               onUpdateUser={async (userId: string, updates: any) => {
//                 try {
//                   // TODO: Replace with real user update API
//                   console.log('Admin updating user:', userId, updates);
//                   // Update shared users state
//                   setSharedUsers(prev => 
//                     prev.map(user => 
//                       user.id === userId ? { ...user, ...updates } : user
//                     )
//                   );
//                 } catch (error) {
//                   console.error('Failed to update user:', error);
//                 }
//               }}
//               onSystemUpdate={async (updates: any) => {
//                 try {
//                   // TODO: Replace with real system update API
//                   console.log('Admin system update:', updates);
//                 } catch (error) {
//                   console.error('Failed to update system:', error);
//                 }
//               }}
//             />
//           );
//         }
//         break;

//       default:
//         // Fallback to splash screen
//         setOnboardingStep('splash');
//         return null;
//     }
//   };

//   return (
//     <FeatureFlagProvider>
//       <div className="size-full bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
//         <ErrorBoundary>
//           {renderCurrentScreen()}
//         </ErrorBoundary>
        
//         {/* Feature Flag Debugger - Only visible in development */}
//         <FeatureFlagDebugger />
//       </div>
//     </FeatureFlagProvider>
//   );
// }