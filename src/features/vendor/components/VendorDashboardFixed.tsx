import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Package2, 
  Clock, 
  Check, 
  X, 
  Phone,
  ChefHat,
  Star,
  TrendingUp,
  DollarSign,
  Power,
  AlertCircle,
  MessageSquare,
  Menu as MenuIcon,
  Plus,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Search,
  Eye,
  EyeOff,
  Save,
  Upload,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  CreditCard,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Users,
  Eye,
  MapPin,
  FileText,
  Building2
} from 'lucide-react';
import { VendorProfileManager } from '../../../components/VendorProfileManager';

/**
 * VendorDashboard - MVP Revenue-Focused Design with WORKING Sticky Header & Pagination
 * 
 * Core Features for Revenue Generation:
 * - Real-time order management with instant status updates
 * - Quick accept/reject flow with one-tap actions
 * - Live preparation tracking with countdown timers
 * - Customer communication integration
 * - Today's revenue and performance metrics
 * - Business status control for availability management
 * - Enhanced menu management with inline category creation
 * 
 * Design: DeliGo Glass Design Language
 * - Warm glassmorphism with cream/orange palette
 * - Mobile-first with 44px touch targets
 * - Professional spacing with safe area support
 * - Clean, focused interface for quick decisions
 * 
 * FIXED: Sticky Header & Pagination
 * - Header with stats and filters stays at top during scroll ✅
 * - Pagination controls remain visible at bottom ✅
 * - Smooth scrolling experience for order management ✅
 */
// ===== SHARED DATA TYPES =====
// These interfaces should match App.tsx shared data types
interface Restaurant {
  id: string;
  name: { en: string; rw: string };
  menu: any[];
  isOpen: boolean;
  [key: string]: any;
}

interface SharedOrder {
  id: string;
  items: any[];
  total: number;
  status: string;
  vendorName: string;
  [key: string]: any;
}

interface VendorDashboardProps {
  language: 'en' | 'rw';
  onBack: () => void;
  // ===== SHARED DATA INTEGRATION =====
  // Props for connecting to shared business data
  sharedRestaurants?: Restaurant[];
  sharedOrders?: SharedOrder[];
  sharedUsers?: any[];
  onUpdateRestaurant?: (id: string, updates: Partial<Restaurant>) => Promise<void>;
  onUpdateMenuItem?: (restaurantId: string, menuItem: any) => Promise<void>;
  onUpdateOrderStatus?: (orderId: string, status: string, vendorId: string) => Promise<void>;
}

// TODO: PRODUCTION API INTEGRATION - Replace with real vendor data
// API Endpoint: GET /api/vendor/profile
// Should return: { isOnline: boolean, todayStats: { orders, revenue, avgOrderValue, completionRate } }
// Integration Priority: 🔴 Critical - Required for basic vendor dashboard functionality
const mockVendorData = {
  isOnline: true,
  todayStats: {
    orders: 18,
    revenue: 325.75,
    avgOrderValue: 18.10,
    completionRate: 94
  }
};

// TODO: PRODUCTION API INTEGRATION - Replace with real menu data
// API Endpoint: GET /api/vendor/menu
// Should return array of: { id, name: {en, rw}, description: {en, rw}, price, category, isAvailable, soldToday, image }
// Integration Priority: 🔴 Critical - Core functionality for menu management
const mockMenuItems = [
  {
    id: 'item-001',
    name: { en: 'Beef Burger', rw: 'Burger y\'inyama y\'inka' },
    description: { 
      en: 'Juicy beef patty with fresh lettuce, tomato, and our special sauce',
      rw: 'Inyama y\'inka n\'imboga nshya hamwe na sauce idasanzwe'
    },
    price: 12.50,
    category: 'Main Course',
    isAvailable: true,
    soldToday: 8,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
  },
  {
    id: 'item-002',
    name: { en: 'Chicken Pizza', rw: 'Pizza y\'inkoko' },
    description: { 
      en: 'Wood-fired pizza with grilled chicken, mozzarella, and fresh herbs',
      rw: 'Pizza y\'inkoko y\'akalanga hamwe na mozzarella n\'ibihimbaza bishya'
    },
    price: 18.75,
    category: 'Main Course',
    isAvailable: true,
    soldToday: 5,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
  },
  {
    id: 'item-003',
    name: { en: 'Caesar Salad', rw: 'Saladi ya Caesar' },
    description: { 
      en: 'Crisp romaine lettuce with parmesan cheese and croutons',
      rw: 'Lettuce ikamye hamwe na parmesan n\'ubugati bukamye'
    },
    price: 10.25,
    category: 'Salads',
    isAvailable: false,
    soldToday: 3,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
  }
];

// TODO: PRODUCTION API INTEGRATION - Replace with real categories
// API Endpoint: GET /api/vendor/categories
// Should return array of strings: ['Main Course', 'Appetizers', ...]
// Integration Priority: 🟡 Important - Used for menu organization
const mockCategories = ['Main Course', 'Appetizers', 'Salads', 'Beverages', 'Desserts'];

// TODO: PRODUCTION API INTEGRATION - Replace with real order data
// API Endpoint: GET /api/vendor/orders (with real-time WebSocket updates)
// WebSocket: ws://api.deligo.com/vendor/orders (for live order updates)
// Should return array of: { id, customer: {name, phone, address}, items: [], total, status, orderTime, estimatedPrep, customizations }
// Integration Priority: 🔴 Critical - Core order management functionality
// Real-time Integration: Replace mock timers with WebSocket order status updates
const mockOrders = [
  {
    id: 'ord-001',
    customer: { 
      name: 'John Doe', 
      phone: '+250 788 123 456',
      address: '123 KG 15 Ave, Kimisagara, Kigali'
    },
    items: [
      { name: 'Beef Burger', quantity: 2, price: 12.50 },
      { name: 'French Fries', quantity: 1, price: 5.25 }
    ],
    total: 30.25,
    status: 'pending',
    orderTime: '2:45 PM',
    estimatedPrep: 15,
    customizations: {
      addedIngredients: ['Extra cheese', 'Bacon'],
      removedIngredients: ['Onions', 'Pickles'],
      specialNotes: 'Please make the burger well-done and pack fries separately. No salt on fries.'
    }
  },
  {
    id: 'ord-002', 
    customer: { 
      name: 'Sarah Wilson', 
      phone: '+250 788 654 321',
      address: '456 KN 8 Rd, Gasabo, Kigali'
    },
    items: [
      { name: 'Chicken Pizza', quantity: 1, price: 18.75 }
    ],
    total: 18.75,
    status: 'preparing',
    orderTime: '2:38 PM',
    estimatedPrep: 8,
    customizations: {
      addedIngredients: ['Extra mozzarella', 'Mushrooms'],
      removedIngredients: ['Bell peppers'],
      specialNotes: 'Light on sauce please, allergic to too much tomato.'
    }
  },
  {
    id: 'ord-003',
    customer: { 
      name: 'Mike Brown', 
      phone: '+250 788 987 654',
      address: '789 KG 21 St, Nyarugenge, Kigali'
    },
    items: [
      { name: 'Caesar Salad', quantity: 1, price: 10.25 }
    ],
    total: 10.25,
    status: 'ready',
    orderTime: '2:30 PM',
    estimatedPrep: 0,
    customizations: {
      addedIngredients: ['Grilled chicken', 'Extra croutons'],
      removedIngredients: ['Anchovies'],
      specialNotes: 'Dressing on the side please. I prefer to add it myself.'
    }
  },
  {
    id: 'ord-004',
    customer: { 
      name: 'Emma Davis', 
      phone: '+250 788 111 222',
      address: '321 KG 5 Ave, Kicukiro, Kigali'
    },
    items: [
      { name: 'Beef Burger', quantity: 1, price: 12.50 },
      { name: 'Chicken Pizza', quantity: 1, price: 18.75 }
    ],
    total: 31.25,
    status: 'completed',
    orderTime: '2:15 PM',
    estimatedPrep: 0,
    customizations: {
      addedIngredients: ['Avocado', 'Extra cheese on pizza'],
      removedIngredients: ['Tomatoes from burger'],
      specialNotes: 'Please ensure both items are hot when delivered. Thank you!'
    }
  },
  {
    id: 'ord-005',
    customer: { 
      name: 'Alex Johnson', 
      phone: '+250 788 333 444',
      address: '654 KN 12 St, Remera, Kigali'
    },
    items: [
      { name: 'Caesar Salad', quantity: 2, price: 10.25 }
    ],
    total: 20.50,
    status: 'pending',
    orderTime: '2:50 PM',
    estimatedPrep: 12,
    customizations: {
      addedIngredients: ['Extra parmesan'],
      removedIngredients: ['Croutons'],
      specialNotes: 'One salad with chicken, one without. Both dressings on the side.'
    }
  },
  {
    id: 'ord-006',
    customer: { 
      name: 'Lisa Garcia', 
      phone: '+250 788 555 666',
      address: '987 KG 18 Rd, Muhanga, Kigali'
    },
    items: [
      { name: 'Chicken Pizza', quantity: 1, price: 18.75 },
      { name: 'Caesar Salad', quantity: 1, price: 10.25 }
    ],
    total: 29.00,
    status: 'preparing',
    orderTime: '2:42 PM',
    estimatedPrep: 18,
    customizations: {
      addedIngredients: ['Olives on pizza'],
      removedIngredients: ['None'],
      specialNotes: 'Can you cut the pizza into small slices? It\'s for sharing with kids.'
    }
  },
  {
    id: 'ord-007',
    customer: { 
      name: 'David Kim', 
      phone: '+250 788 777 888',
      address: '159 KN 3 Ave, Nyamirambo, Kigali'
    },
    items: [
      { name: 'Beef Burger', quantity: 3, price: 12.50 }
    ],
    total: 37.50,
    status: 'ready',
    orderTime: '2:25 PM',
    estimatedPrep: 0,
    customizations: {
      addedIngredients: ['Bacon on all burgers'],
      removedIngredients: ['Lettuce', 'Tomatoes'],
      specialNotes: 'All three burgers medium-rare please. Family order for lunch.'
    }
  },
  {
    id: 'ord-008',
    customer: { 
      name: 'Maria Rodriguez', 
      phone: '+250 788 999 000',
      address: '753 KG 9 St, Kacyiru, Kigali'
    },
    items: [
      { name: 'Chicken Pizza', quantity: 2, price: 18.75 }
    ],
    total: 37.50,
    status: 'completed',
    orderTime: '2:10 PM',
    estimatedPrep: 0,
    customizations: {
      addedIngredients: ['Extra pepperoni', 'Jalapeños'],
      removedIngredients: ['Mushrooms'],
      specialNotes: 'One pizza mild, one pizza spicy. Please mark the boxes clearly.'
    }
  },
  {
    id: 'ord-009',
    customer: { 
      name: 'James Wilson', 
      phone: '+250 788 111 333',
      address: '842 KN 16 Rd, Gisozi, Kigali'
    },
    items: [
      { name: 'Caesar Salad', quantity: 1, price: 10.25 },
      { name: 'French Fries', quantity: 2, price: 5.25 }
    ],
    total: 20.75,
    status: 'pending',
    orderTime: '2:52 PM',
    estimatedPrep: 10,
    customizations: {
      addedIngredients: ['Extra seasoning on fries'],
      removedIngredients: ['None'],
      specialNotes: 'Make sure fries are extra crispy. Salad with light dressing please.'
    }
  }
];

// TODO: PRODUCTION API INTEGRATION - Replace with real analytics data  
// API Endpoint: GET /api/vendor/analytics?period=daily|weekly|monthly
// Should return: { dailyOrders: [], ordersByStatus: [], hourlyTrends: [] }
// Integration Priority: 🟡 Important - Business intelligence and reporting
const mockOrdersAnalytics = {
  dailyOrders: [
    { day: 'Mon', orders: 12, revenue: 245.50 },
    { day: 'Tue', orders: 19, revenue: 382.75 },
    { day: 'Wed', orders: 15, revenue: 298.20 },
    { day: 'Thu', orders: 22, revenue: 445.80 },
    { day: 'Fri', orders: 28, revenue: 567.90 },
    { day: 'Sat', orders: 35, revenue: 678.25 },
    { day: 'Sun', orders: 18, revenue: 325.75 }
  ],
  ordersByStatus: [
    { name: 'Completed', value: 145, color: '#22c55e' },
    { name: 'Pending', value: 12, color: '#eab308' },
    { name: 'Preparing', value: 8, color: '#f97316' },
    { name: 'Ready', value: 5, color: '#3b82f6' }
  ],
  hourlyTrends: [
    { hour: '06:00', orders: 2 },
    { hour: '07:00', orders: 5 },
    { hour: '08:00', orders: 8 },
    { hour: '09:00', orders: 12 },
    { hour: '10:00', orders: 15 },
    { hour: '11:00', orders: 18 },
    { hour: '12:00', orders: 25 },
    { hour: '13:00', orders: 22 },
    { hour: '14:00', orders: 20 },
    { hour: '15:00', orders: 16 },
    { hour: '16:00', orders: 14 },
    { hour: '17:00', orders: 18 },
    { hour: '18:00', orders: 28 },
    { hour: '19:00', orders: 32 },
    { hour: '20:00', orders: 25 },
    { hour: '21:00', orders: 15 },
    { hour: '22:00', orders: 8 }
  ]
};

// TODO: PRODUCTION API INTEGRATION - Replace with real revenue analytics
// API Endpoint: GET /api/vendor/revenue-analytics?period=weekly|monthly
// Should return: { revenueByCategory: [], weeklyComparison: [] }
// Integration Priority: 🟡 Important - Financial tracking and analysis
const mockRevenueAnalytics = {
  revenueByCategory: [
    { category: 'Main Course', revenue: 1245.50, percentage: 45, color: '#f97316' },
    { category: 'Beverages', revenue: 678.25, percentage: 25, color: '#22c55e' },
    { category: 'Appetizers', revenue: 456.75, percentage: 17, color: '#3b82f6' },
    { category: 'Desserts', revenue: 234.80, percentage: 8, color: '#a855f7' },
    { category: 'Salads', revenue: 145.70, percentage: 5, color: '#ef4444' }
  ],
  weeklyComparison: [
    { week: 'Week 1', revenue: 1850.50 },
    { week: 'Week 2', revenue: 2156.75 },
    { week: 'Week 3', revenue: 2445.20 },
    { week: 'Week 4', revenue: 2761.00 }
  ]
};

export function VendorDashboard({ 
  language = 'en', // Add default value to ensure language is always defined
  onBack,
  // ===== SHARED DATA PROPS =====
  sharedRestaurants = [],
  sharedOrders = [],
  sharedUsers = [],
  onUpdateRestaurant,
  onUpdateMenuItem,
  onUpdateOrderStatus
}: VendorDashboardProps) {
  // ===== ERROR BOUNDARY FOR SAFE EXECUTION =====
  // Ensure language is valid
  const safeLanguage = (language === 'en' || language === 'rw') ? language : 'en';
  const [vendorData, setVendorData] = useState(mockVendorData);
  // ===== SHARED DATA INTEGRATION =====
  // Use shared orders from App.tsx, fallback to mock data for standalone testing
  // Ensure compatibility by converting shared order format to vendor dashboard format
  const convertSharedOrderToVendorFormat = (sharedOrder: SharedOrder) => {
    // Safely handle undefined or null shared order
    if (!sharedOrder || !sharedOrder.id) {
      console.warn('Invalid shared order:', sharedOrder);
      return null;
    }

    try {
      // Convert shared order format to the format expected by VendorDashboard
      return {
        id: sharedOrder.id,
        customer: {
          name: (sharedOrder.customerName || sharedOrder.customer?.name || 'Customer'),
          phone: (sharedOrder.customerPhone || sharedOrder.customer?.phone || '+250 788 000 000'),
          address: (sharedOrder.deliveryAddress || sharedOrder.customer?.address || 'Kigali, Rwanda')
        },
        items: Array.isArray(sharedOrder.items) ? sharedOrder.items.map(item => ({
          name: (item && item.name) ? item.name : 'Item',
          quantity: (item && item.quantity) ? item.quantity : 1,
          price: (item && item.price) ? item.price : 0
        })) : [],
        total: sharedOrder.total || 0,
        status: sharedOrder.status || 'pending',
        orderTime: new Date(sharedOrder.createdAt || Date.now()).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        estimatedPrep: 15, // Default prep time
        customizations: {
          addedIngredients: [],
          removedIngredients: [],
          specialNotes: 'No special notes'
        }
      };
    } catch (error) {
      console.error('Error converting shared order:', error, sharedOrder);
      return null;
    }
  };

  const initializeOrders = () => {
    try {
      if (Array.isArray(sharedOrders) && sharedOrders.length > 0) {
        // Convert shared orders to vendor dashboard format, filtering out null results
        const convertedOrders = sharedOrders
          .map(convertSharedOrderToVendorFormat)
          .filter(order => order !== null);
        return convertedOrders.length > 0 ? convertedOrders : mockOrders;
      }
      return mockOrders;
    } catch (error) {
      console.error('Error initializing orders:', error);
      return mockOrders;
    }
  };

  const [orders, setOrders] = useState(initializeOrders());
  const [orderTimers, setOrderTimers] = useState<{[key: string]: number}>({});
  const [activeTab, setActiveTab] = useState('orders');
  
  // Menu management state
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [categories, setCategories] = useState(mockCategories);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Orders pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [activeOrderFilter, setActiveOrderFilter] = useState('all');
  const itemsPerPage = 4;

  // Settings modal state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [paymentPhone, setPaymentPhone] = useState('');

  // Analytics modals state
  const [showOrdersAnalytics, setShowOrdersAnalytics] = useState(false);
  const [showRevenueAnalytics, setShowRevenueAnalytics] = useState(false);

  // Order customization modal state
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [selectedOrderCustomizations, setSelectedOrderCustomizations] = useState<any>(null);

  // ===== SHARED DATA SYNCHRONIZATION =====
  // Sync shared orders from App.tsx with local state for real-time updates
  React.useEffect(() => {
    try {
      if (Array.isArray(sharedOrders) && sharedOrders.length > 0) {
        console.log('🔄 Syncing shared orders to vendor dashboard:', sharedOrders.length);
        // Convert shared orders to vendor format before setting, filtering out null results
        const convertedOrders = sharedOrders
          .map(convertSharedOrderToVendorFormat)
          .filter(order => order !== null);
        
        if (convertedOrders.length > 0) {
          setOrders(convertedOrders);
        }
      }
    } catch (error) {
      console.error('Error syncing shared orders:', error);
    }
  }, [sharedOrders]);

  // ===== SAFE CONTENT HANDLER =====
  // Add error boundary for content access
  const getSafeContent = (lang: string) => {
    try {
      return content[lang as 'en' | 'rw'];
    } catch (error) {
      console.error('Error accessing content for language:', lang, error);
      return content.en; // Fallback to English
    }
  };

  // Essential content for MVP
  const content = {
    en: {
      title: 'Order Management',
      subtitle: 'Accept and prepare orders',
      stats: { 
        orders: 'Orders Today',
        revenue: 'Revenue', 
        avgOrder: 'Avg Order',
        completion: 'Success Rate'
      },
      status: {
        online: 'Online',
        offline: 'Offline',
        goOnline: 'Go Online',
        goOffline: 'Go Offline'
      },
      orders: {
        pending: 'New Order',
        preparing: 'Preparing',
        ready: 'Ready',
        completed: 'Completed',
        accept: 'Accept Order',
        reject: 'Reject',
        markReady: 'Mark Ready',
        markCompleted: 'Complete',
        callCustomer: 'Call Customer',
        timeLeft: 'min left',
        orderAccepted: 'Order accepted!',
        orderReady: 'Order marked ready!',
        orderCompleted: 'Order completed!',
        all: 'All Orders',
        filter: 'Filter',
        showingOrders: 'Showing',
        of: 'of',
        orders: 'orders',
        page: 'Page',
        previous: 'Previous',
        next: 'Next',
        noOrdersInFilter: 'No orders found',
        noOrdersInFilterDesc: 'Try selecting a different filter to see orders'
      },
      menu: {
        title: 'Menu Management',
        subtitle: 'Manage your food items',
        addItem: 'Add New Item',
        editItem: 'Edit Item',
        deleteItem: 'Delete Item',
        searchPlaceholder: 'Search menu items...',
        allCategories: 'All Categories',
        available: 'Available',
        soldOut: 'Sold Out',
        price: 'Price',
        soldToday: 'Sold Today',
        toggleAvailability: 'Toggle Availability',
        itemName: 'Item Name',
        itemDescription: 'Description',
        itemPrice: 'Price (RWF)',
        itemCategory: 'Category',
        itemImage: 'Item Image',
        save: 'Save Item',
        cancel: 'Cancel',
        delete: 'Delete',
        confirm: 'Are you sure?',
        itemAdded: 'Item added successfully!',
        itemUpdated: 'Item updated successfully!',
        itemDeleted: 'Item deleted successfully!',
        newCategory: 'New Category',
        addCategory: 'Add Category',
        categoryName: 'Category Name',
        createCategory: 'Create Category',
        categoryAdded: 'Category added successfully!'
      },
      settings: {
        title: 'Settings',
        subtitle: 'Manage your account and payment settings',
        logout: 'Logout',
        logoutConfirm: 'Are you sure you want to logout?',
        paymentMethod: 'Payment Method',
        phoneNumber: 'Phone Number',
        phoneNumberPlaceholder: 'Enter your MTN/Airtel number',
        savePayment: 'Save Payment Method',
        paymentSaved: 'Payment method saved successfully!',
        close: 'Close'
      },
      analytics: {
        ordersTitle: 'Orders Analytics',
        ordersSubtitle: 'Detailed breakdown of your order performance',
        revenueTitle: 'Revenue Analytics', 
        revenueSubtitle: 'Track your earnings and financial trends',
        thisWeek: 'This Week',
        lastWeek: 'Last Week',
        dailyOrders: 'Daily Orders',
        ordersByStatus: 'Orders by Status',
        hourlyTrends: 'Hourly Order Trends',
        revenueByDay: 'Revenue by Day',
        revenueByCategory: 'Revenue by Category',
        totalRevenue: 'Total Revenue',
        avgOrderValue: 'Avg Order Value',
        peakHours: 'Peak Hours',
        topCategory: 'Top Category'
      },
      customizations: {
        title: 'Order Customizations',
        subtitle: 'Customer preferences and special requests',
        address: 'Delivery Address',
        addedIngredients: 'Added Ingredients',
        removedIngredients: 'Removed Ingredients',
        specialNotes: 'Special Notes',
        noAdditions: 'No additional ingredients',
        noRemovals: 'No ingredients removed',
        noNotes: 'No special notes provided',
        viewDetails: 'View Details'
      },
      profile: {
        title: 'Business Profile',
        subtitle: 'Manage your restaurant profile'
      }
    },
    rw: {
      title: 'Gucunga Amatungo',
      subtitle: 'Kwemera no gutegura amatungo',
      stats: { 
        orders: 'Amatungo Uyu Munsi',
        revenue: 'Amafaranga', 
        avgOrder: 'Agaciro Rusange',
        completion: 'Intsinzi'
      },
      status: {
        online: 'Kuri Interineti',
        offline: 'Ntabwo kuri Interineti',
        goOnline: 'Injira kuri Interineti',
        goOffline: 'Sohoka kuri Interineti'
      },
      orders: {
        pending: 'Igitungo Gishya',
        preparing: 'Gutegura',
        ready: 'Biteguye',
        completed: 'Byarangiye',
        accept: 'Emera Igitungo',
        reject: 'Anga',
        markReady: 'Shyira Nk\'ibiteguye',
        markCompleted: 'Rangiza',
        callCustomer: 'Hamagara Umuguzi',
        timeLeft: 'min bisigaye',
        orderAccepted: 'Igitungo cyemewe!',
        orderReady: 'Igitungo giteguye!',
        orderCompleted: 'Igitungo cyarangiye!',
        all: 'Amatungo Yose',
        filter: 'Gutoramo',
        showingOrders: 'Byerekana',
        of: 'muri',
        orders: 'amatungo',
        page: 'Urupapuro',
        previous: 'Ibihari',
        next: 'Ibikurikira',
        noOrdersInFilter: 'Nta matungo aboneka',
        noOrdersInFilterDesc: 'Gerageza guhitamo indi filter kugira ngo ubone amatungo'
      },
      menu: {
        title: 'Gucunga Menu',
        subtitle: 'Gucunga ibiryo byawe',
        addItem: 'Ongeramo Ikintu Gishya',
        editItem: 'Hindura Ikintu',
        deleteItem: 'Gukuraho Ikintu',
        searchPlaceholder: 'Shakisha ibiryo...',
        allCategories: 'Ubwoko Bwose',
        available: 'Birahari',
        soldOut: 'Byarangiye',
        price: 'Igiciro',
        soldToday: 'Byagurishijwe Uyu Munsi',
        toggleAvailability: 'Hindura Uko Bihari',
        itemName: 'Izina ry\'Ikintu',
        itemDescription: 'Ibisobanuro',
        itemPrice: 'Igiciro (RWF)',
        itemCategory: 'Ubwoko',
        itemImage: 'Ifoto y\'Ikintu',
        save: 'Bika Ikintu',
        cancel: 'Bireke',
        delete: 'Gukuraho',
        confirm: 'Uremeza?',
        itemAdded: 'Ikintu cyongewe neza!',
        itemUpdated: 'Ikintu cyahinduwe neza!',
        itemDeleted: 'Ikintu cyakuriwe neza!',
        newCategory: 'Ubwoko Bushya',
        addCategory: 'Ongeramo Ubwoko',
        categoryName: 'Izina ry\'Ubwoko',
        createCategory: 'Kurema Ubwoko',
        categoryAdded: 'Ubwoko bwongewe neza!'
      },
      settings: {
        title: 'Igenamiterere',
        subtitle: 'Gucunga konti yawe n\'uburyo bw\'ukwishyura',
        logout: 'Gusohoka',
        logoutConfirm: 'Uremeza ko ushaka gusohoka?',
        paymentMethod: 'Uburyo bw\'Ukwishyura',
        phoneNumber: 'Numero ya Terefone',
        phoneNumberPlaceholder: 'Injiza numero ya MTN/Airtel',
        savePayment: 'Bika Uburyo bw\'Ukwishyura',
        paymentSaved: 'Uburyo bw\'ukwishyura bwabitswe neza!',
        close: 'Gufunga'
      },
      analytics: {
        ordersTitle: 'Isesengura ry\'Amatungo',
        ordersSubtitle: 'Ibivuye mu matungo yawe mu buryo bwirambuye',
        revenueTitle: 'Isesengura ry\'Amafaranga',
        revenueSubtitle: 'Gukurikirana amafaranga yawe n\'ibigenda',
        thisWeek: 'Iki Cyumweru',
        lastWeek: 'Icyumweru Gishize',
        dailyOrders: 'Amatungo ku Munsi',
        ordersByStatus: 'Amatungo hakurikijwe Uko Bigenda',
        hourlyTrends: 'Ibigenda bya buri Saha',
        revenueByDay: 'Amafaranga ku Munsi',
        revenueByCategory: 'Amafaranga hakurikijwe Ubwoko',
        totalRevenue: 'Amafaranga Yose',
        avgOrderValue: 'Agaciro k\'Igitungo',
        peakHours: 'Amasaha y\'Ubwinshi',
        topCategory: 'Ubwoko Bukomeye'
      },
      customizations: {
        title: 'Ibisabwa n\'Umuguzi',
        subtitle: 'Ibyo umuguzi yashakaga guhindura n\'ibindi bisabwa',
        address: 'Aderesi y\'Igitwaro',
        addedIngredients: 'Ibintu Byongeweho',
        removedIngredients: 'Ibintu Byakuriweho',
        specialNotes: 'Inyandiko Zidasanzwe',
        noAdditions: 'Nta bintu byongeweho',
        noRemovals: 'Nta bintu byakuriweho',
        noNotes: 'Nta nyandiko zidasanzwe',
        viewDetails: 'Reba Amakuru'
      }
    }
  };

  // ===== SHARED DATA HANDLERS =====
  // Enhanced order action handler that integrates with shared data store
  // TODO: PRODUCTION API INTEGRATION - Replace order actions with real API calls
  // API Endpoints: 
  // - PATCH /api/orders/{id}/status { status: 'accepted'|'rejected'|'preparing'|'ready'|'completed' }
  // - POST /api/orders/{id}/accept
  // - POST /api/orders/{id}/reject  
  // - POST /api/orders/{id}/ready
  // - POST /api/orders/{id}/complete
  // Integration Priority: 🔴 Critical - Core order workflow functionality
  // Real-time: Should trigger WebSocket updates to customer app
  const handleOrderAction = async (orderId: string, action: 'accept' | 'reject' | 'ready' | 'completed') => {
    try {
      // Ensure we have content and language defined - use safe content getter
      const currentContent = getSafeContent(safeLanguage);
      if (!currentContent) {
        console.error('Content not available for language:', safeLanguage);
        return;
      }

      let newStatus = action;
      const order = orders.find(o => o && o.id === orderId);
      
      if (!order) {
        console.error('Order not found:', orderId);
        toast.error('Order not found');
        return;
      }

      if (action === 'accept') {
        newStatus = 'preparing';
        setOrderTimers(prev => ({ ...prev, [orderId]: order.estimatedPrep || 15 }));
        toast.success(currentContent?.orders?.orderAccepted || 'Order accepted!');
      } else if (action === 'ready') {
        setOrderTimers(prev => {
          const updated = { ...prev };
          delete updated[orderId];
          return updated;
        });
        toast.success(currentContent?.orders?.orderReady || 'Order marked ready!');
      } else if (action === 'completed') {
        // Update daily stats with safe navigation
        setVendorData(prev => ({
          ...prev,
          todayStats: {
            ...prev.todayStats,
            revenue: (prev.todayStats?.revenue || 0) + (order.total || 0),
            orders: (prev.todayStats?.orders || 0) + 1
          }
        }));
        toast.success(currentContent?.orders?.orderCompleted || 'Order completed!');
      }

      // Update via shared data store if available - this will sync to customer app
      if (onUpdateOrderStatus) {
        const vendorId = 'vendor-001'; // TODO: Get from authenticated vendor context
        await onUpdateOrderStatus(orderId, newStatus, vendorId);
        console.log('✅ Order status updated via shared data store - Customer will see changes:', { orderId, newStatus });
      } else {
        // Fallback to local state for standalone testing
        setOrders(prevOrders =>
          prevOrders.map(orderItem => {
            if (orderItem && orderItem.id === orderId) {
              return { ...orderItem, status: newStatus };
            }
            return orderItem;
          })
        );
        console.log('🔄 Order status updated locally:', { orderId, newStatus });
      }
    } catch (error) {
      console.error('❌ Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Timer countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderTimers(prev => {
        const updated = { ...prev };
        let hasChanges = false;
        
        Object.keys(updated).forEach(orderId => {
          if (updated[orderId] > 0) {
            updated[orderId] -= 1;
            hasChanges = true;
          } else if (updated[orderId] === 0) {
            delete updated[orderId];
            handleOrderAction(orderId, 'ready');
            hasChanges = true;
          }
        });
        
        return hasChanges ? updated : prev;
      });
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // TODO: PRODUCTION API INTEGRATION - Replace business status toggle with real API
  // API Endpoint: PATCH /api/vendor/status { isOnline: boolean }
  // Integration Priority: 🔴 Critical - Controls order availability to customers
  // Real-time: Should update restaurant availability in customer app immediately
  const toggleBusinessStatus = () => {
    setVendorData(prev => {
      const newStatus = !prev.isOnline;
      // Show toast notification based on new status
      if (newStatus) {
        toast.success('🟢 You are now ONLINE - Ready to receive orders!');
      } else {
        toast.info('🔴 You are now OFFLINE - No new orders will be received');
      }
      
      return {
        ...prev,
        isOnline: newStatus
      };
    });
  };

  // ===== ENHANCED MENU HANDLERS WITH SHARED DATA INTEGRATION =====
  // TODO: PRODUCTION API INTEGRATION - Replace menu CRUD operations with real API calls
  // API Endpoints:
  // - POST /api/vendor/menu { name, description, price, category, image }
  // - PUT /api/vendor/menu/{id} { ...updates }
  // - DELETE /api/vendor/menu/{id}
  // - PATCH /api/vendor/menu/{id}/availability { isAvailable: boolean }
  // Integration Priority: 🔴 Critical - Core menu management functionality
  // Real-time: Menu changes should sync to customer app immediately
  const handleAddItem = async (itemData: any) => {
    try {
      const newItem = {
        id: `item-${Date.now()}`,
        ...itemData,
        soldToday: 0,
        isAvailable: true,
        restaurantId: 'rest-001' // TODO: Get from authenticated vendor context
      };

      // Update via shared data store if available - this will sync to customer app
      if (onUpdateMenuItem) {
        await onUpdateMenuItem('rest-001', newItem);
        console.log('✅ Menu item added via shared data store - Customers will see it immediately:', newItem);
      } else {
        // Fallback to local state for standalone testing
        setMenuItems(prev => [...prev, newItem]);
        console.log('🔄 Menu item added locally:', newItem);
      }
      
      toast.success(content[language].menu.itemAdded);
      setShowAddItemModal(false);
    } catch (error) {
      console.error('❌ Failed to add menu item:', error);
      toast.error('Failed to add menu item');
    }
  };

  // Category management functions
  const handleAddCategory = (categoryName: string) => {
    if (categoryName.trim() && !categories.includes(categoryName.trim())) {
      setCategories(prev => [...prev, categoryName.trim()]);
      toast.success(content[language].menu.categoryAdded);
      return true;
    }
    return false;
  };

  const handleEditItem = (itemId: string, itemData: any) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...itemData } : item
    ));
    toast.success(content[language].menu.itemUpdated);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
    toast.success(content[language].menu.itemDeleted);
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  // TODO: PRODUCTION API INTEGRATION - Replace payment settings with real API
  // API Endpoint: POST /api/vendor/payment-settings { phoneNumber, provider: 'mtn'|'airtel' }
  // Integration Priority: 🟡 Important - Required for vendor payouts
  // Security: Validate phone number format and provider compatibility
  const handleSavePayment = () => {
    if (paymentPhone.trim()) {
      toast.success(content[language].settings.paymentSaved);
      // TODO: Save payment method to backend
      console.log('Payment method saved:', paymentPhone);
    }
  };

  const handleLogout = () => {
    if (confirm(content[language].settings.logoutConfirm)) {
      toast.info('Logging out...');
      onBack(); // This returns to the appropriate logout screen
    }
  };

  // Handle viewing order customizations
  const handleViewCustomizations = (order: any) => {
    setSelectedOrderCustomizations(order);
    setShowCustomizationModal(true);
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name[language].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Orders filtering and pagination logic
  const filteredOrders = orders.filter(order => {
    if (activeOrderFilter === 'all') return true;
    return order.status === activeOrderFilter;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Reset pagination when filter changes
  const handleFilterChange = (filter: string) => {
    setActiveOrderFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string, timer?: number) => {
    const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-medium text-sm";
    
    switch (status) {
      case 'pending':
        return (
          <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`}>
            <AlertCircle className="w-4 h-4" />
            {content[language].orders.pending}
          </Badge>
        );
      case 'preparing':
        return (
          <Badge className={`${baseClasses} bg-orange-100 text-orange-800 border border-orange-200`}>
            <ChefHat className="w-4 h-4" />
            {content[language].orders.preparing}
            {timer && ` • ${timer} ${content[language].orders.timeLeft}`}
          </Badge>
        );
      case 'ready':
        return (
          <Badge className={`${baseClasses} bg-green-100 text-green-800 border border-green-200`}>
            <Check className="w-4 h-4" />
            {content[language].orders.ready}
          </Badge>
        );
      case 'completed':
        return (
          <Badge className={`${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`}>
            <Package2 className="w-4 h-4" />
            {content[language].orders.completed}
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderOrderCard = (order: any) => {
    const timer = orderTimers[order.id];
    
    return (
      <Card key={order.id} className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl mb-4 shadow-sm">
        <CardContent className="p-6">
          {/* Order Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusBadge(order.status, timer)}
              {/* Flickering Eye Icon for Customizations */}
              <button
                onClick={() => handleViewCustomizations(order)}
                className="p-2 rounded-full bg-blue-50/50 border border-blue-100/50 hover:bg-blue-100/70 transition-all duration-200 group"
                title={content[language].customizations.viewDetails}
              >
                <Eye className="w-4 h-4 text-blue-500 animate-pulse group-hover:animate-none group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              #{order.id.slice(-3)} • {order.orderTime}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-orange-50/50 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-orange-100/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{order.customer.name}</h3>
                <p className="text-sm text-gray-600">{order.customer.phone}</p>
              </div>
              {(order.status === 'preparing' || order.status === 'ready') && (
                <Button
                  onClick={() => window.open(`tel:${order.customer.phone}`, '_self')}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-12 px-4 font-medium"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {content[language].orders.callCustomer}
                </Button>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-2 mb-4">
            {order.items.map((item: any, index: number) => {
              // Map food item names to appropriate thumbnail images
              const getItemImage = (itemName: string) => {
                const name = itemName.toLowerCase();
                if (name.includes('beef') && name.includes('burger')) {
                  return 'https://images.unsplash.com/photo-1678110707289-ab14382a1625?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwYnVyZ2VyJTIwZm9vZHxlbnwxfHx8fDE3NTgyNzIxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
                } else if (name.includes('chicken') && name.includes('pizza')) {
                  return 'https://images.unsplash.com/photo-1671106681075-5a7233268cbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwcGl6emElMjBmb29kfGVufDF8fHx8MTc1ODI3MjE4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
                } else if (name.includes('caesar') && name.includes('salad')) {
                  return 'https://images.unsplash.com/photo-1704224991701-146f8edae1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZCUyMGZvb2R8ZW58MXx8fHwxNzU4MjE1MTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
                } else if (name.includes('french') && name.includes('fries')) {
                  return 'https://images.unsplash.com/photo-1682613886162-49f5e074c092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBmcmllcyUyMGZvb2R8ZW58MXx8fHwxNzU4MTkyNDg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
                }
                // Default food image for unknown items
                return 'https://images.unsplash.com/photo-1678110707289-ab14382a1625?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwYnVyZ2VyJTIwZm9vZHxlbnwxfHx8fDE3NTgyNzIxODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
              };

              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl">
                  {/* Food thumbnail image */}
                  <div className="flex-shrink-0">
                    <ImageWithFallback 
                      src={getItemImage(item.name)}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                  </div>
                  
                  {/* Item details */}
                  <div className="flex-1 flex items-center justify-between">
                    <div className="font-medium text-gray-800">
                      {item.quantity}x {item.name}
                    </div>
                    <div className="font-semibold text-gray-800">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Total */}
          <div className="flex items-center justify-between p-4 bg-orange-100/80 backdrop-blur-sm rounded-2xl mb-4 border border-orange-200/50">
            <span className="font-bold text-gray-800 text-lg">Total</span>
            <span className="font-bold text-orange-600 text-xl">{formatCurrency(order.total)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {order.status === 'pending' && (
              <>
                <Button
                  onClick={() => handleOrderAction(order.id, 'accept')}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 font-medium text-base"
                >
                  <Check className="w-5 h-5 mr-2" />
                  {content[language].orders.accept}
                </Button>
                <Button
                  onClick={() => handleOrderAction(order.id, 'reject')}
                  variant="outline"
                  className="flex-1 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl h-12 font-medium text-base"
                >
                  <X className="w-5 h-5 mr-2" />
                  {content[language].orders.reject}
                </Button>
              </>
            )}

            {order.status === 'preparing' && (
              <Button
                onClick={() => handleOrderAction(order.id, 'ready')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 font-medium text-base"
              >
                <Check className="w-5 h-5 mr-2" />
                {content[language].orders.markReady}
              </Button>
            )}

            {order.status === 'ready' && (
              <Button
                onClick={() => handleOrderAction(order.id, 'completed')}
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl h-12 font-medium text-base"
              >
                <Package2 className="w-5 h-5 mr-2" />
                {content[language].orders.markCompleted}
              </Button>
            )}

            {order.status === 'completed' && (
              <div className="w-full text-center py-3">
                <span className="text-green-600 font-medium">
                  ✅ {content[language].orders.orderCompleted}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 relative">
      {/* STICKY HEADER - Properly positioned with z-index */}
      <div className="sticky top-0 left-0 right-0 z-30 bg-gradient-to-br from-orange-50/95 via-amber-50/95 to-orange-100/95 backdrop-blur-md border-b border-white/20">
        <div className="px-6 py-4">
          {/* Title & Status */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {activeTab === 'orders' ? content[language].title : content[language].menu.title}
              </h1>
              <p className="text-sm text-gray-600">
                {activeTab === 'orders' ? content[language].subtitle : content[language].menu.subtitle}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={toggleBusinessStatus}
                className={`flex items-center gap-2 rounded-2xl h-10 px-4 font-medium text-sm transition-all duration-200 ${
                  vendorData.isOnline 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                <Power className="w-3 h-3" />
                <div className={`w-2 h-2 rounded-full ${vendorData.isOnline ? 'bg-green-200' : 'bg-red-200'}`} />
                {vendorData.isOnline ? content[language].status.online : content[language].status.offline}
              </Button>
              <Button
                onClick={() => setShowSettingsModal(true)}
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm border-white/30 text-gray-700 hover:bg-white/90 rounded-xl h-10 px-3 font-medium text-sm"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Today's Stats - Clickable for Analytics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
              onClick={() => setShowOrdersAnalytics(true)}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30 hover:bg-white/80 hover:border-orange-200 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-center mb-1">
                <Package2 className="w-5 h-5 text-orange-600 mr-2 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-2xl font-bold text-gray-800">{vendorData.todayStats.orders}</div>
              </div>
              <div className="text-xs text-gray-600 font-medium group-hover:text-orange-600 transition-colors duration-200">
                {content[language].stats.orders}
              </div>
              <div className="text-xs text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
                Click for details
              </div>
            </button>
            
            <button 
              onClick={() => setShowRevenueAnalytics(true)}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30 hover:bg-white/80 hover:border-green-200 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-center mb-1">
                <DollarSign className="w-5 h-5 text-green-600 mr-2 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-2xl font-bold text-gray-800">{formatCurrency(vendorData.todayStats.revenue)}</div>
              </div>
              <div className="text-xs text-gray-600 font-medium group-hover:text-green-600 transition-colors duration-200">
                {content[language].stats.revenue}
              </div>
              <div className="text-xs text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
                Click for details
              </div>
            </button>
          </div>

          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/60 backdrop-blur-sm rounded-2xl p-1 h-14">
              <TabsTrigger
                value="orders"
                className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-600 font-medium h-10 text-sm"
              >
                <Package2 className="w-4 h-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="menu"
                className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-600 font-medium h-10 text-sm"
              >
                <MenuIcon className="w-4 h-4 mr-2" />
                Menu
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* MAIN CONTENT AREA - Proper spacing for sticky elements */}
      <div className="pb-20"> {/* Space for sticky pagination */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-0">
            <div className="px-6 py-4">
              {/* Order Filters */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 mb-4 border border-white/20">
                <div className="flex flex-col gap-3">
                  {/* Filter Label */}
                  <div className="flex items-center gap-2 px-2">
                    <Package2 className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {content[language].orders.filter}
                    </span>
                  </div>
                  
                  {/* Horizontal Scrolling Filter Buttons */}
                  <div className="overflow-x-auto scrollbar-hide touch-scroll-x">
                    <div className="flex gap-3 pb-2 min-w-max px-2">
                      {[
                        { key: 'all', label: content[language].orders.all, count: orders.length },
                        { key: 'pending', label: content[language].orders.pending, count: orders.filter(o => o.status === 'pending').length },
                        { key: 'preparing', label: content[language].orders.preparing, count: orders.filter(o => o.status === 'preparing').length },
                        { key: 'ready', label: content[language].orders.ready, count: orders.filter(o => o.status === 'ready').length },
                        { key: 'completed', label: content[language].orders.completed, count: orders.filter(o => o.status === 'completed').length }
                      ].map((filter) => (
                        <Button
                          key={filter.key}
                          onClick={() => handleFilterChange(filter.key)}
                          className={`rounded-xl h-12 px-4 font-medium text-base transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                            activeOrderFilter === filter.key
                              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md border-2 border-orange-500'
                              : 'bg-white/70 hover:bg-white/90 text-gray-700 border-2 border-gray-200 hover:border-orange-200'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {filter.label}
                            <Badge className={`rounded-full text-xs px-2 py-0.5 ${
                              activeOrderFilter === filter.key
                                ? 'bg-white/20 text-white'
                                : 'bg-orange-100 text-orange-600'
                            }`}>
                              {filter.count}
                            </Badge>
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Orders Count Display */}
                  {filteredOrders.length > 0 && (
                    <div className="text-sm text-gray-600 px-2">
                      {content[language].orders.showingOrders} {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOrders.length)} {content[language].orders.of} {filteredOrders.length} {content[language].orders.orders}
                    </div>
                  )}
                </div>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium">
                    {orders.length === 0 ? 'No orders yet today' : content[language].orders.noOrdersInFilter}
                  </p>
                  <p className="text-sm text-gray-500">
                    {orders.length === 0 ? 'New orders will appear here automatically' : content[language].orders.noOrdersInFilterDesc}
                  </p>
                </div>
              ) : (
                paginatedOrders.map(order => renderOrderCard(order))
              )}
            </div>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="mt-0">
            <div className="px-6 py-4">
              {/* Menu Controls */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mb-4 border border-white/20">
                <div className="flex flex-col gap-4">
                  {/* Search and Add Button */}
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder={content[language].menu.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/70 border-gray-200 rounded-xl h-12 text-base"
                      />
                    </div>
                    <Button
                      onClick={() => setShowAddItemModal(true)}
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 px-4 font-medium text-base"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {content[language].menu.addItem}
                    </Button>
                  </div>

                  {/* Category Filter */}
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-white/70 border-gray-200 rounded-xl h-12 text-base">
                      <SelectValue placeholder={content[language].menu.allCategories} />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-md border border-white/30 rounded-xl">
                      <SelectItem value="all" className="text-base">{content[language].menu.allCategories}</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="text-base">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Menu Items Grid */}
              <div className="space-y-4">
                {filteredMenuItems.map(item => (
                  <Card key={item.id} className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Item Image */}
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <ImageWithFallback 
                            src={item.image} 
                            alt={item.name[language]}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-gray-800 text-lg">{item.name[language]}</h3>
                              <p className="text-sm text-gray-600">{item.category}</p>
                            </div>
                            <Badge className={item.isAvailable ? 
                              'bg-green-100 text-green-800 border border-green-200 text-sm' :
                              'bg-red-100 text-red-800 border border-red-200 text-sm'
                            }>
                              {item.isAvailable ? content[language].menu.available : content[language].menu.soldOut}
                            </Badge>
                          </div>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description[language]}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="font-bold text-gray-800 text-lg">{formatCurrency(item.price)}</div>
                              <div className="text-sm text-gray-500">{item.soldToday} sold today</div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => toggleItemAvailability(item.id)}
                                variant="outline"
                                size="sm"
                                className="rounded-xl h-10 px-3 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
                              >
                                {item.isAvailable ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                              <Button
                                onClick={() => setEditingItem(item)}
                                variant="outline"
                                size="sm"
                                className="rounded-xl h-10 px-3 border-2 border-orange-200 text-orange-600 hover:bg-orange-50 text-sm"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteItem(item.id)}
                                variant="outline"
                                size="sm"
                                className="rounded-xl h-10 px-3 border-2 border-red-200 text-red-600 hover:bg-red-50 text-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredMenuItems.length === 0 && (
                  <div className="text-center py-12">
                    <MenuIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">No menu items found</p>
                    <p className="text-sm text-gray-500">Add your first menu item to get started</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* STICKY PAGINATION - Only for Orders tab with pagination */}
      {activeTab === 'orders' && totalPages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-orange-50/95 via-amber-50/95 to-orange-100/95 backdrop-blur-md border-t border-white/20 p-4">
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
            {/* Previous Button */}
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`rounded-xl h-12 px-4 font-medium text-base transition-all duration-200 ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-100'
                  : 'bg-white/70 hover:bg-white/90 text-gray-700 border-2 border-gray-200 hover:border-orange-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{content[language].orders.previous}</span>
              <span className="sm:hidden">‹</span>
            </Button>
            
            {/* Page Number Buttons */}
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-12 h-12 rounded-xl font-medium text-base transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md border-2 border-orange-500'
                      : 'bg-white/70 hover:bg-white/90 text-gray-700 border-2 border-gray-200 hover:border-orange-200'
                  }`}
                >
                  {page}
                </Button>
              );
            })}
            
            {/* Next Button */}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`rounded-xl h-12 px-4 font-medium text-base transition-all duration-200 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-100'
                  : 'bg-white/70 hover:bg-white/90 text-gray-700 border-2 border-gray-200 hover:border-orange-200'
              }`}
            >
              <span className="hidden sm:inline">{content[language].orders.next}</span>
              <span className="sm:hidden">›</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          {/* Page Info */}
          <div className="text-center mt-3">
            <span className="text-sm text-gray-600">
              {content[language].orders.page} {currentPage} {content[language].orders.of} {totalPages}
            </span>
          </div>
        </div>
      )}
      {/* Order Customizations Modal */}
      <Dialog open={showCustomizationModal} onOpenChange={setShowCustomizationModal}>
        <DialogContent className="bg-white/95 backdrop-blur-md border border-white/30 rounded-3xl p-0 max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-bold text-gray-800 text-center flex items-center justify-center gap-2">
              <FileText className="w-6 h-6 text-blue-500" />
              {content[language].customizations.title}
            </DialogTitle>
            <p className="text-sm text-gray-600 text-center">
              {content[language].customizations.subtitle}
            </p>
          </DialogHeader>
          
          {selectedOrderCustomizations && (
            <div className="px-6 pb-6 space-y-6">
              {/* Customer Address */}
              <div className="bg-green-50/50 rounded-2xl p-4 border border-green-100/50">
                <h3 className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-500" />
                  {content[language].customizations.address}
                </h3>
                <p className="text-gray-700 bg-white/70 rounded-xl p-3 border border-green-100/30">
                  {selectedOrderCustomizations.customer.address}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Added Ingredients */}
                <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100/50">
                  <h3 className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-orange-500" />
                    {content[language].customizations.addedIngredients}
                  </h3>
                  <div className="space-y-2">
                    {selectedOrderCustomizations.customizations.addedIngredients.length > 0 ? (
                      selectedOrderCustomizations.customizations.addedIngredients.map((ingredient: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 bg-white/70 rounded-lg p-2 border border-orange-100/30">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{ingredient}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">{content[language].customizations.noAdditions}</p>
                    )}
                  </div>
                </div>

                {/* Removed Ingredients */}
                <div className="bg-red-50/50 rounded-2xl p-4 border border-red-100/50">
                  <h3 className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
                    <X className="w-5 h-5 text-red-500" />
                    {content[language].customizations.removedIngredients}
                  </h3>
                  <div className="space-y-2">
                    {selectedOrderCustomizations.customizations.removedIngredients.length > 0 ? (
                      selectedOrderCustomizations.customizations.removedIngredients.map((ingredient: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 bg-white/70 rounded-lg p-2 border border-red-100/30">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{ingredient}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">{content[language].customizations.noRemovals}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Special Notes */}
              <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50">
                <h3 className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  {content[language].customizations.specialNotes}
                </h3>
                <div className="bg-white/70 rounded-xl p-4 border border-blue-100/30">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedOrderCustomizations.customizations.specialNotes || (
                      <span className="text-gray-500 italic">{content[language].customizations.noNotes}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <Button
                onClick={() => setShowCustomizationModal(false)}
                variant="outline"
                className="w-full border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12 text-base font-medium"
              >
                {content[language].settings.close}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Orders Analytics Modal */}
      <Dialog open={showOrdersAnalytics} onOpenChange={setShowOrdersAnalytics}>
        <DialogContent className="bg-white/95 backdrop-blur-md border border-white/30 rounded-3xl p-0 max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-bold text-gray-800 text-center flex items-center justify-center gap-2">
              <BarChart3 className="w-6 h-6 text-orange-500" />
              {content[language].analytics.ordersTitle}
            </DialogTitle>
            <p className="text-sm text-gray-600 text-center">
              {content[language].analytics.ordersSubtitle}
            </p>
          </DialogHeader>
          
          <div className="px-6 pb-6 space-y-6">
            {/* Daily Orders Chart */}
            <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100/50">
              <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                {content[language].analytics.dailyOrders}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockOrdersAnalytics.dailyOrders}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f97316" strokeOpacity={0.2} />
                    <XAxis dataKey="day" stroke="#78716c" fontSize={12} />
                    <YAxis stroke="#78716c" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid rgba(249, 115, 22, 0.2)',
                        borderRadius: '12px'
                      }}
                    />
                    <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Orders by Status Pie Chart */}
              <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50">
                <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-blue-500" />
                  {content[language].analytics.ordersByStatus}
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockOrdersAnalytics.ordersByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={70}
                        dataKey="value"
                      >
                        {mockOrdersAnalytics.ordersByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Hourly Trends */}
              <div className="bg-green-50/50 rounded-2xl p-4 border border-green-100/50">
                <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-500" />
                  {content[language].analytics.hourlyTrends}
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockOrdersAnalytics.hourlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#22c55e" strokeOpacity={0.2} />
                      <XAxis dataKey="hour" stroke="#78716c" fontSize={10} />
                      <YAxis stroke="#78716c" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid rgba(34, 197, 94, 0.2)',
                          borderRadius: '12px'
                        }}
                      />
                      <Line type="monotone" dataKey="orders" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <Button
              onClick={() => setShowOrdersAnalytics(false)}
              variant="outline"
              className="w-full border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12 text-base font-medium"
            >
              {content[language].settings.close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Revenue Analytics Modal */}
      <Dialog open={showRevenueAnalytics} onOpenChange={setShowRevenueAnalytics}>
        <DialogContent className="bg-white/95 backdrop-blur-md border border-white/30 rounded-3xl p-0 max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-bold text-gray-800 text-center flex items-center justify-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
              {content[language].analytics.revenueTitle}
            </DialogTitle>
            <p className="text-sm text-gray-600 text-center">
              {content[language].analytics.revenueSubtitle}
            </p>
          </DialogHeader>
          
          <div className="px-6 pb-6 space-y-6">
            {/* Revenue by Day Chart */}
            <div className="bg-green-50/50 rounded-2xl p-4 border border-green-100/50">
              <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                {content[language].analytics.revenueByDay}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockOrdersAnalytics.dailyOrders}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#22c55e" strokeOpacity={0.2} />
                    <XAxis dataKey="day" stroke="#78716c" fontSize={12} />
                    <YAxis stroke="#78716c" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        borderRadius: '12px'
                      }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={4} dot={{ fill: '#22c55e', r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Revenue by Category */}
              <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100/50">
                <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-orange-500" />
                  {content[language].analytics.revenueByCategory}
                </h3>
                <div className="space-y-3">
                  {mockRevenueAnalytics.revenueByCategory.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium text-gray-700">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">{formatCurrency(category.revenue)}</div>
                        <div className="text-xs text-gray-500">{category.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Comparison */}
              <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50">
                <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Weekly Comparison
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockRevenueAnalytics.weeklyComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" strokeOpacity={0.2} />
                      <XAxis dataKey="week" stroke="#78716c" fontSize={12} />
                      <YAxis stroke="#78716c" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          borderRadius: '12px'
                        }}
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <Button
              onClick={() => setShowRevenueAnalytics(false)}
              variant="outline"
              className="w-full border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12 text-base font-medium"
            >
              {content[language].settings.close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="bg-white/95 backdrop-blur-md border border-white/30 rounded-3xl p-0 max-w-sm mx-auto">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl font-bold text-gray-800 text-center">
              {content[language].settings.title}
            </DialogTitle>
            <p className="text-sm text-gray-600 text-center">
              {content[language].settings.subtitle}
            </p>
          </DialogHeader>
          
          <div className="px-6 pb-6 space-y-6">
            {/* Payment Method Section */}
            <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">
                    {content[language].settings.paymentMethod}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {content[language].settings.phoneNumber}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <Input
                  type="tel"
                  placeholder={content[language].settings.phoneNumberPlaceholder}
                  value={paymentPhone}
                  onChange={(e) => setPaymentPhone(e.target.value)}
                  className="bg-white/80 border-orange-200 rounded-xl h-12 text-base font-medium focus:border-orange-500 focus:ring-orange-500/20"
                />
                
                <Button
                  onClick={handleSavePayment}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 text-base font-medium"
                  disabled={!paymentPhone.trim()}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {content[language].settings.savePayment}
                </Button>
              </div>
            </div>

            {/* Logout Section */}
            <div className="bg-red-50/50 rounded-2xl p-4 border border-red-100/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">
                    Account
                  </h3>
                  <p className="text-sm text-gray-600">
                    Sign out of your vendor account
                  </p>
                </div>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl h-12 text-base font-medium"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {content[language].settings.logout}
              </Button>
            </div>

            {/* Close Button */}
            <Button
              onClick={() => setShowSettingsModal(false)}
              variant="outline"
              className="w-full border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12 text-base font-medium"
            >
              {content[language].settings.close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}