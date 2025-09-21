import React, { useState } from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { VendorDashboardMenuSectionFixed } from './VendorDashboardMenuSectionFixed';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner@2.0.3';
import { 
  Store, 
  Clock, 
  Bell, 
  TrendingUp, 
  Package, 
  Check, 
  X, 
  Eye, 
  Edit, 
  ToggleLeft, 
  ToggleRight,
  DollarSign,
  Users,
  Star,
  ChevronLeft,
  Settings,
  Menu as MenuIcon,
  Calendar,
  AlertTriangle,
  Power,
  Pause,
  Play,
  Save,
  MessageSquare,
  Plus,
  Trash2,
  Image,
  Target,
  Activity,
  ShoppingCart,
  Timer,
  MapPin,
  Percent
} from 'lucide-react';

/**
 * VendorDashboard - Enhanced MVP Phase 1 Vendor Dashboard
 * FIXED VERSION - Menu tab only updated, all other tabs preserved
 */
interface VendorDashboardProps {
  language: 'en' | 'rw';
  onBack: () => void;
}

// All original mock data preserved exactly as it was
const mockVendorData = {
  id: 'vendor-golden-spoon',
  name: { en: 'Golden Spoon Restaurant', rw: 'Resitora Golden Spoon' },
  isOnline: true,
  businessStatus: 'open',
  tempClosureReason: '',
  tempClosureUntil: '',
  todayStats: {
    orders: 24,
    revenue: 485.50,
    avgRating: 4.8,
    completionRate: 96
  },
  operatingHours: {
    monday: { open: '08:00', close: '22:00', isActive: true },
    tuesday: { open: '08:00', close: '22:00', isActive: true },
    wednesday: { open: '08:00', close: '22:00', isActive: true },
    thursday: { open: '08:00', close: '22:00', isActive: true },
    friday: { open: '08:00', close: '23:00', isActive: true },
    saturday: { open: '08:00', close: '23:00', isActive: true },
    sunday: { open: '10:00', close: '21:00', isActive: true }
  },
  autoAcceptOrders: false,
  preparationTime: 15,
  deliveryRadius: 5
};

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
    image: 'https://images.unsplash.com/photo-1678110707493-8d05425137ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwYnVyZ2VyJTIwZm9vZHxlbnwxfHx8fDE3NTc4NDIzMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
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
    image: 'https://images.unsplash.com/photo-1670148815909-e79a18e16ddd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwcGl6emElMjBmb29kfGVufDF8fHx8MTc1Nzg0MjMyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
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
    image: 'https://images.unsplash.com/photo-1704224991701-146f8edae1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZCUyMGZvb2R8ZW58MXx8fHwxNzU3ODQyMzMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 'item-004',
    name: { en: 'French Fries', rw: 'Ibirayi by\'Abafaransa' },
    description: { 
      en: 'Crispy golden fries served with ketchup',
      rw: 'Ibirayi bikamye birabika neza bifite ketchup'
    },
    price: 5.25,
    category: 'Sides',
    isAvailable: true,
    soldToday: 12,
    image: 'https://images.unsplash.com/photo-1623610934157-0fcb6d50e90f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmcmllcyUyMGZvb2R8ZW58MXx8fHwxNzU3ODk1Nzg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 'item-005',
    name: { en: 'Coca Cola', rw: 'Coca Cola' },
    description: { 
      en: 'Refreshing soft drink',
      rw: 'Ikinyobwa gikora umubiri'
    },
    price: 2.50,
    category: 'Beverages',
    isAvailable: true,
    soldToday: 15,
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NhJTIwY29sYSUyMGRyaW5rfGVufDF8fHx8MTc1Nzg5NTg4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

const mockOrders = [
  {
    id: 'ord-001',
    customer: { name: 'John Doe', phone: '+250 788 123 456' },
    items: [
      { 
        name: 'Beef Burger', 
        quantity: 2, 
        price: 12.50,
        image: 'https://images.unsplash.com/photo-1678110707493-8d05425137ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwYnVyZ2VyJTIwZm9vZHxlbnwxfHx8fDE3NTc4NDIzMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      },
      { 
        name: 'French Fries', 
        quantity: 2, 
        price: 5.25,
        image: 'https://images.unsplash.com/photo-1623610934157-0fcb6d50e90f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmcmllcyUyMGZvb2R8ZW58MXx8fHwxNzU3ODk1Nzg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      },
      { 
        name: 'Coca Cola', 
        quantity: 2, 
        price: 2.50,
        image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NhJTIwY29sYSUyMGRyaW5rfGVufDF8fHx8MTc1Nzg5NTg4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      }
    ],
    total: 40.50,
    status: 'pending',
    orderTime: '2:45 PM',
    estimatedPrep: 15
  },
  {
    id: 'ord-002', 
    customer: { name: 'Sarah Wilson', phone: '+250 788 654 321' },
    items: [
      { 
        name: 'Chicken Pizza', 
        quantity: 1, 
        price: 18.75,
        image: 'https://images.unsplash.com/photo-1670148815909-e79a18e16ddd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwcGl6emElMjBmb29kfGVufDF8fHx8MTc1Nzg0MjMyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      }
    ],
    total: 18.75,
    status: 'preparing',
    orderTime: '2:38 PM',
    estimatedPrep: 8
  },
  {
    id: 'ord-003',
    customer: { name: 'Mike Brown', phone: '+250 788 987 654' },
    items: [
      { 
        name: 'Caesar Salad', 
        quantity: 1, 
        price: 10.25,
        image: 'https://images.unsplash.com/photo-1704224991701-146f8edae1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZCUyMGZvb2R8ZW58MXx8fHwxNzU3ODQyMzMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      }
    ],
    total: 10.25,
    status: 'ready',
    orderTime: '2:30 PM',
    estimatedPrep: 0
  }
];

const mockAnalyticsData = {
  dailySales: [
    { day: 'Mon', sales: 485, orders: 24 },
    { day: 'Tue', sales: 520, orders: 28 },
    { day: 'Wed', sales: 380, orders: 19 },
    { day: 'Thu', sales: 620, orders: 31 },
    { day: 'Fri', sales: 750, orders: 38 },
    { day: 'Sat', sales: 890, orders: 45 },
    { day: 'Sun', sales: 680, orders: 34 }
  ],
  hourlyOrders: [
    { hour: '8AM', orders: 2 },
    { hour: '9AM', orders: 4 },
    { hour: '10AM', orders: 3 },
    { hour: '11AM', orders: 6 },
    { hour: '12PM', orders: 12 },
    { hour: '1PM', orders: 15 },
    { hour: '2PM', orders: 18 },
    { hour: '3PM', orders: 8 },
    { hour: '4PM', orders: 6 },
    { hour: '5PM', orders: 14 },
    { hour: '6PM', orders: 16 },
    { hour: '7PM', orders: 22 },
    { hour: '8PM', orders: 18 },
    { hour: '9PM', orders: 12 },
    { hour: '10PM', orders: 6 }
  ],
  categoryPerformance: [
    { name: 'Main Course', value: 45, color: '#f97316' },
    { name: 'Beverages', value: 25, color: '#22c55e' },
    { name: 'Sides', value: 20, color: '#3b82f6' },
    { name: 'Salads', value: 10, color: '#a855f7' }
  ],
  topItems: [
    { name: 'Beef Burger', sold: 15, revenue: 187.50 },
    { name: 'Chicken Pizza', sold: 12, revenue: 225.00 },
    { name: 'French Fries', sold: 18, revenue: 94.50 },
    { name: 'Caesar Salad', sold: 8, revenue: 82.00 },
    { name: 'Coca Cola', sold: 22, revenue: 55.00 }
  ],
  metrics: {
    avgOrderValue: 20.25,
    customerRetention: 78,
    fulfillmentTime: 14.5,
    customerSatisfaction: 4.8,
    totalRevenue: 4325.75,
    totalOrders: 219,
    peakHour: '7PM',
    bestDay: 'Saturday'
  }
};

const mockCategories = ['Main Course', 'Sides', 'Beverages', 'Salads', 'Desserts', 'Appetizers'];

export function VendorDashboardCompleteFixed({ language, onBack }: VendorDashboardProps) {
  const [vendorData, setVendorData] = useState(mockVendorData);
  const [orders, setOrders] = useState(mockOrders);
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [categories, setCategories] = useState(mockCategories);
  const [activeTab, setActiveTab] = useState('orders');
  const [showBusinessControl, setShowBusinessControl] = useState(false);
  const [editingHours, setEditingHours] = useState(false);
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  
  // Menu Management State
  const [editingMenuItem, setEditingMenuItem] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'name' | 'price' | 'description' | 'details' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showMenuItemModal, setShowMenuItemModal] = useState(false);
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [deletingMenuItem, setDeletingMenuItem] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const content = {
    en: {
      title: 'Vendor Dashboard',
      subtitle: 'Manage your restaurant operations',
      tabs: { orders: 'Orders', menu: 'Menu', analytics: 'Analytics', settings: 'Settings' },
      stats: { todayOrders: 'Today\'s Orders', revenue: 'Revenue', rating: 'Avg Rating', completion: 'Completion' },
      businessStatus: {
        online: 'Online', offline: 'Offline', hours: 'Operating Hours', open: 'Open', closed: 'Closed',
        maintenance: 'Maintenance Mode', holiday: 'Holiday Mode', tempClosed: 'Temporarily Closed',
        acceptingOrders: 'Accepting Orders', notAcceptingOrders: 'Not Accepting Orders',
        businessControl: 'Business Control', goOnline: 'Go Online', goOffline: 'Go Offline',
        enableMaintenance: 'Enable Maintenance', enableHoliday: 'Enable Holiday Mode',
        setTempClosure: 'Set Temporary Closure', editHours: 'Edit Operating Hours',
        reason: 'Reason', until: 'Until', maintenanceReason: 'Maintenance in progress',
        holidayReason: 'Holiday closure', save: 'Save Changes', cancel: 'Cancel',
        days: { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday',
                friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' },
        openTime: 'Open Time', closeTime: 'Close Time', dayActive: 'Day Active',
        prepTime: 'Preparation Time', deliveryRadius: 'Delivery Radius', autoAccept: 'Auto Accept Orders',
        hoursModalTitle: 'Edit Operating Hours', hoursModalDescription: 'Update your restaurant\'s operating schedule'
      },
      orders: { newOrder: 'New Order', accept: 'Accept', reject: 'Reject', preparing: 'Preparing',
                ready: 'Ready', completed: 'Completed', customer: 'Customer', items: 'Items',
                total: 'Total', time: 'Time', estimatedPrep: 'Est. Prep', quantity: 'Qty' },
      menu: {
        available: 'Available', soldOut: 'Sold Out', soldToday: 'Sold Today', price: 'Price',
        edit: 'Edit', toggle: 'Toggle Availability', editDescription: 'Edit Description',
        editItem: 'Edit Item', addNewItem: 'Add New Item', saveChanges: 'Save Changes', cancel: 'Cancel',
        itemName: 'Item Name', itemDescription: 'Description', itemPrice: 'Price (USD)',
        itemCategory: 'Category', newCategory: 'New Category', createCategory: 'Create Category',
        selectCategory: 'Select Category', newPrice: 'New Price', updatePrice: 'Update Price',
        priceUpdated: 'Price updated successfully', descriptionUpdated: 'Description updated successfully',
        itemAdded: 'New item added successfully', duplicateItem: 'Duplicate Item',
        quickPriceEdit: 'Quick Price Edit', bulkActions: 'Bulk Actions', selectAll: 'Select All',
        markAvailable: 'Available', markSoldOut: 'Sold Out', deleteSelected: 'Delete',
        deleteItem: 'Delete Item', deleteConfirm: 'Are you sure you want to delete this item?',
        deleteSuccess: 'Item deleted successfully', uploadImage: 'Upload Image', changeImage: 'Change Image'
      },
      analytics: {
        dailySales: 'Daily Sales', orderTrends: 'Order Trends', popularItems: 'Popular Items',
        performance: 'Performance Metrics', revenue: 'Revenue', weeklyRevenue: 'Weekly Revenue',
        hourlyOrders: 'Orders by Hour', categoryBreakdown: 'Category Performance',
        topSellingItems: 'Top Selling Items', keyMetrics: 'Key Metrics', avgOrderValue: 'Avg Order Value',
        customerRetention: 'Customer Retention', fulfillmentTime: 'Avg Fulfillment',
        satisfaction: 'Satisfaction', totalRevenue: 'Total Revenue', totalOrders: 'Total Orders',
        peakHour: 'Peak Hour', bestDay: 'Best Day', minutes: 'min'
      },
      actions: { viewAll: 'View All', refresh: 'Refresh', save: 'Save Changes', cancel: 'Cancel' }
    },
    rw: {
      title: 'Ikibaho cy\'Umuguzi',
      subtitle: 'Gucunga ibikorwa by\'uresitora',
      tabs: { orders: 'Amatungo', menu: 'Ibikoresho', analytics: 'Isesengura', settings: 'Igenamiterere' },
      stats: { todayOrders: 'Amatungo y\'Uyu Munsi', revenue: 'Amafaranga', rating: 'Amanota', completion: 'Kurangiza' },
      businessStatus: {
        online: 'Kuri Interineti', offline: 'Ntabwo turi kuri Interineti', hours: 'Amasaha y\'Akazi',
        open: 'Yarafunguye', closed: 'Yarafunze', maintenance: 'Ubusanzwe bw\'Ubusabane',
        holiday: 'Ubusanzwe bw\'Ikiruhuko', tempClosed: 'Yafunze by\'agateganyo',
        acceptingOrders: 'Dukwemera Amatungo', notAcceptingOrders: 'Ntabwo dukwemera Amatungo',
        businessControl: 'Igenzura ry\'Ubucuruzi', goOnline: 'Kwinjira kuri Interineti',
        goOffline: 'Gusohoka kuri Interineti', enableMaintenance: 'Gushyira Ubusabane',
        enableHoliday: 'Gushyira Ikiruhuko', setTempClosure: 'Gushyira Ifunga ry\'Agateganyo',
        editHours: 'Guhindura Amasaha y\'Akazi', reason: 'Impamvu', until: 'Kugeza',
        maintenanceReason: 'Ubusabane bugenda', holidayReason: 'Ifunga ry\'ikiruhuko',
        save: 'Kubika Impinduka', cancel: 'Guhagarika',
        days: { monday: 'Ku wa mbere', tuesday: 'Ku wa kabiri', wednesday: 'Ku wa gatatu',
                thursday: 'Ku wa kane', friday: 'Ku wa gatanu', saturday: 'Ku wa gatandatu', sunday: 'Ku cyumweru' },
        openTime: 'Igihe cyo Gufungura', closeTime: 'Igihe cyo Gufunga', dayActive: 'Umunsi Ukora',
        prepTime: 'Igihe cyo Gutegura', deliveryRadius: 'Icyerekezo cy\'Gutanga',
        autoAccept: 'Kwemera Amatungo ku Buryo Bwikora', hoursModalTitle: 'Guhindura Amasaha y\'Akazi',
        hoursModalDescription: 'Kuvugurura gahunda y\'amasaha y\'uresitora'
      },
      orders: { newOrder: 'Igitungo Gishya', accept: 'Kwemera', reject: 'Kwanga', preparing: 'Gutegura',
                ready: 'Byiteguye', completed: 'Byarangiye', customer: 'Umuguzi', items: 'Ibintu',
                total: 'Byose', time: 'Igihe', estimatedPrep: 'Igihe cyo gutegura', quantity: 'Umubare' },
      menu: {
        available: 'Birahari', soldOut: 'Byaguzwe byose', soldToday: 'Byagurishijwe Uyu Munsi',
        price: 'Igiciro', edit: 'Guhindura', toggle: 'Guhindura uko bihari',
        editDescription: 'Guhindura Ibisobanuro', editItem: 'Guhindura Ikintu',
        addNewItem: 'Kongeramo Ikintu Gishya', saveChanges: 'Kubika Impinduka', cancel: 'Guhagarika',
        itemName: 'Izina ry\'Ikintu', itemDescription: 'Ibisobanuro', itemPrice: 'Igiciro (USD)',
        itemCategory: 'Icyiciro', newCategory: 'Icyiciro Gishya', createCategory: 'Gukora Icyiciro',
        selectCategory: 'Guhitamo Icyiciro', newPrice: 'Igiciro Gishya', updatePrice: 'Kuvugurura Igiciro',
        priceUpdated: 'Igiciro cyavuguruwe neza', descriptionUpdated: 'Ibisobanuro byavuguruwe neza',
        itemAdded: 'Ikintu gishya cyongeweho neza', duplicateItem: 'Gusubiramo Ikintu',
        quickPriceEdit: 'Guhindura Igiciro Vuba', bulkActions: 'Ibikorwa Byinshi',
        selectAll: 'Guhitamo Byose', markAvailable: 'Bihari', markSoldOut: 'Byaguze',
        deleteSelected: 'Gusiba', deleteItem: 'Gusiba Ikintu', deleteConfirm: 'Uremeza gusiba iki kintu?',
        deleteSuccess: 'Ikintu cyasibiwe neza', uploadImage: 'Gushyiramo Ishusho', changeImage: 'Guhindura Ishusho'
      },
      analytics: {
        dailySales: 'Igurisha ry\'Umunsi', orderTrends: 'Icyerekezo cy\'Amatungo',
        popularItems: 'Ibintu Byakunzwe', performance: 'Imikorere', revenue: 'Amafaranga',
        weeklyRevenue: 'Amafaranga y\'Icyumweru', hourlyOrders: 'Amatungo ku Isaha',
        categoryBreakdown: 'Imikorere y\'Uduce', topSellingItems: 'Ibintu Byagurishwa Cyane',
        keyMetrics: 'Ibipimo Bikomeye', avgOrderValue: 'Agaciro k\'Igitungo',
        customerRetention: 'Kubana n\'Abakiriya', fulfillmentTime: 'Igihe cyo Kurangiza',
        satisfaction: 'Kunyurwa', totalRevenue: 'Amafaranga Yose', totalOrders: 'Amatungo Yose',
        peakHour: 'Isaha Nkuru', bestDay: 'Umunsi Mwiza', minutes: 'min'
      },
      actions: { viewAll: 'Reba Byose', refresh: 'Kuvugurura', save: 'Kubika Impinduka', cancel: 'Guhagarika' }
    }
  };

  // All handlers preserved exactly from original
  const handleOrderAction = (orderId: string, action: 'accept' | 'reject' | 'preparing' | 'ready' | 'completed') => {
    console.log(`Order ${orderId} action: ${action}`);
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: action === 'reject' ? 'rejected' : action } : order
      )
    );
  };

  const handleBusinessToggle = () => {
    console.log('Toggling business status');
    setVendorData(prev => ({ 
      ...prev, 
      isOnline: !prev.isOnline,
      businessStatus: !prev.isOnline ? 'open' : 'closed'
    }));
  };

  const handleBusinessStatusChange = (status: 'open' | 'closed' | 'maintenance' | 'holiday', reason?: string, until?: string) => {
    console.log(`Setting business status to: ${status}`, { reason, until });
    setVendorData(prev => ({
      ...prev,
      isOnline: status === 'open',
      businessStatus: status,
      tempClosureReason: reason || '',
      tempClosureUntil: until || ''
    }));
    setShowBusinessControl(false);
  };

  const handleOperatingHoursChange = (day: string, field: 'open' | 'close' | 'isActive', value: string | boolean) => {
    console.log(`Updating ${day} ${field}:`, value);
    setVendorData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day as keyof typeof prev.operatingHours],
          [field]: value
        }
      }
    }));
  };

  const saveOperatingHours = () => {
    console.log('Saving operating hours:', vendorData.operatingHours);
    setShowHoursModal(false);
  };

  // Menu handlers - fixed to work properly
  const handleMenuItemEdit = (itemId: string, field: 'name' | 'price' | 'description' | 'details') => {
    const item = menuItems.find(item => item.id === itemId);
    if (!item) return;

    setEditingMenuItem(itemId);
    setEditingField(field);
    
    if (field === 'price') {
      setEditValue(item.price.toString());
    } else if (field === 'name') {
      setEditValue(item.name[language]);
    } else if (field === 'description') {
      setEditValue(item.description?.[language] || '');
    } else if (field === 'details') {
      setShowMenuItemModal(true);
      return;
    }
  };

  const handleMenuItemSave = () => {
    if (!editingMenuItem || !editingField) return;

    console.log(`Updating ${editingField} for item ${editingMenuItem}:`, editValue);

    setMenuItems(prevItems =>
      prevItems.map(item => {
        if (item.id === editingMenuItem) {
          if (editingField === 'price') {
            return { ...item, price: parseFloat(editValue) || item.price };
          } else if (editingField === 'name') {
            return { 
              ...item, 
              name: { 
                ...item.name, 
                [language]: editValue || item.name[language] 
              } 
            };
          } else if (editingField === 'description') {
            return { 
              ...item, 
              description: { 
                ...item.description, 
                [language]: editValue 
              }
            };
          }
        }
        return item;
      })
    );

    setEditingMenuItem(null);
    setEditingField(null);
    setEditValue('');
    toast.success(language === 'en' ? 'Item updated successfully!' : 'Ikintu cyahinduwe neza!');
  };

  const handleMenuItemCancel = () => {
    setEditingMenuItem(null);
    setEditingField(null);
    setEditValue('');
  };

  const handleMenuItemDelete = (itemId: string) => {
    console.log('Deleting menu item:', itemId);
    setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast.success(language === 'en' ? 'Item deleted successfully!' : 'Ikintu cyasibwe neza!');
  };

  const handleMenuToggle = (itemId: string) => {
    console.log('Toggling menu item availability:', itemId);
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const handleSelectMenuItem = (itemId: string) => {
    setSelectedMenuItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSelectAllMenuItems = () => {
    setSelectedMenuItems(prev =>
      prev.length === menuItems.length ? [] : menuItems.map(item => item.id)
    );
  };

  const handleBulkToggleAvailability = (available: boolean) => {
    console.log('Bulk toggle availability:', available, selectedMenuItems);
    setMenuItems(prevItems =>
      prevItems.map(item =>
        selectedMenuItems.includes(item.id) ? { ...item, isAvailable: available } : item
      )
    );
    setSelectedMenuItems([]);
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete items:', selectedMenuItems);
    setMenuItems(prevItems => prevItems.filter(item => !selectedMenuItems.includes(item.id)));
    setSelectedMenuItems([]);
  };

  const handleAddNewMenuItem = () => {
    setShowMenuItemModal(true);
  };

  const handleUpdateMenuItem = (itemId: string, updates: Partial<typeof mockMenuItems[0]>) => {
    console.log('Updating menu item:', itemId, updates);
    setMenuItems(prevItems =>
      prevItems.map(item => item.id === itemId ? { ...item, ...updates } : item)
    );
  };

  const handleAddMenuItem = (newItem: Omit<typeof mockMenuItems[0], 'id'>) => {
    console.log('Adding new menu item:', newItem);
    const newMenuItem = { id: `item-${Date.now()}`, ...newItem };
    setMenuItems(prevItems => [...prevItems, newMenuItem]);
  };

  const handleAddCategory = (category: string) => {
    console.log('Adding new category:', category);
    setCategories(prev => [...prev, category]);
  };

  const handleMenuItemDuplicate = (itemId: string) => {
    const item = menuItems.find(item => item.id === itemId);
    if (!item) return;

    const duplicatedItem = {
      ...item,
      id: `item-${Date.now()}`,
      name: { en: `${item.name.en} (Copy)`, rw: `${item.name.rw} (Copy)` },
      soldToday: 0
    };

    console.log('Duplicating menu item:', duplicatedItem);
    setMenuItems(prevItems => [...prevItems, duplicatedItem]);
    toast.success(language === 'en' ? 'Item duplicated successfully!' : 'Ikintu cyongerwemo neza!');
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 vendor-dashboard-container touch-scroll">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-orange-50 to-red-50 backdrop-blur-sm p-4 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="bg-white/80 backdrop-blur-sm border-white/20 text-gray-700 hover:bg-white rounded-2xl h-12 w-12 p-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{content[language].title}</h1>
              <p className="text-sm text-gray-600">{content[language].subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={vendorData.isOnline ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}>
              {vendorData.isOnline ? content[language].businessStatus.online : content[language].businessStatus.offline}
            </Badge>
            <Button
              onClick={() => setShowBusinessControl(!showBusinessControl)}
              variant="outline"
              size="sm"
              className="bg-white/80 backdrop-blur-sm border-white/20 text-gray-700 hover:bg-white rounded-2xl h-10 px-3"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Store className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">{content[language].stats.todayOrders}</p>
                  <p className="text-lg font-bold text-gray-800">{vendorData.todayStats.orders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-xl">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">{content[language].stats.revenue}</p>
                  <p className="text-lg font-bold text-gray-800">${vendorData.todayStats.revenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-100 rounded-xl">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">{content[language].stats.rating}</p>
                  <p className="text-lg font-bold text-gray-800">{vendorData.todayStats.avgRating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">{content[language].stats.completion}</p>
                  <p className="text-lg font-bold text-gray-800">{vendorData.todayStats.completionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Control Panel */}
        {showBusinessControl && (
          <Card className="bg-white/90 backdrop-blur-md border border-white/30 rounded-3xl mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{content[language].businessStatus.businessControl}</h3>
                <Button
                  onClick={() => setShowBusinessControl(false)}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-xl"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Button
                  onClick={() => handleBusinessStatusChange('open')}
                  className={`h-10 rounded-xl ${vendorData.businessStatus === 'open' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-white border border-green-200 text-green-600 hover:bg-green-50'}`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {content[language].businessStatus.goOnline}
                </Button>
                <Button
                  onClick={() => handleBusinessStatusChange('closed')}
                  className={`h-10 rounded-xl ${vendorData.businessStatus === 'closed' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white border border-red-200 text-red-600 hover:bg-red-50'}`}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  {content[language].businessStatus.goOffline}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={() => setShowHoursModal(true)}
                  variant="outline"
                  className="h-10 rounded-xl border-2 border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {content[language].businessStatus.editHours}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm rounded-2xl p-1 border border-white/20">
            <TabsTrigger value="orders" className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              {content[language].tabs.orders}
            </TabsTrigger>
            <TabsTrigger value="menu" className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              {content[language].tabs.menu}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              {content[language].tabs.analytics}
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              {content[language].tabs.settings}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Contents */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* ORDERS TAB - PRESERVED EXACTLY FROM ORIGINAL */}
          <TabsContent value="orders" className="space-y-4">
            <div className="space-y-4 max-h-96 vendor-dashboard-container touch-scroll">
              {orders.map((order) => (
                <Card key={order.id} className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${
                          order.status === 'pending' ? 'bg-orange-100' :
                          order.status === 'preparing' ? 'bg-blue-100' :
                          order.status === 'ready' ? 'bg-green-100' :
                          'bg-gray-100'
                        }`}>
                          {order.status === 'pending' ? <Clock className="w-4 h-4 text-orange-600" /> :
                           order.status === 'preparing' ? <Package className="w-4 h-4 text-blue-600" /> :
                           order.status === 'ready' ? <Check className="w-4 h-4 text-green-600" /> :
                           <Check className="w-4 h-4 text-gray-600" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{order.customer.name}</h3>
                          <p className="text-sm text-gray-600">{order.orderTime} • ${order.total}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={
                          order.status === 'pending' ? "bg-orange-100 text-orange-800" :
                          order.status === 'preparing' ? "bg-blue-100 text-blue-800" :
                          order.status === 'ready' ? "bg-green-100 text-green-800" :
                          "bg-gray-100 text-gray-800"
                        }>
                          {content[language].orders[order.status as keyof typeof content[language].orders]}
                        </Badge>
                        <Button
                          onClick={() => toggleOrderExpansion(order.id)}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-xl border-white/20 bg-white/50"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {expandedOrders.includes(order.id) && (
                      <div className="space-y-3 pt-3 border-t border-white/20">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">{content[language].orders.items}:</h4>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-3 p-2 bg-white/50 rounded-xl">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  <ImageWithFallback
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">{item.name}</p>
                                  <p className="text-sm text-gray-600">{content[language].orders.quantity}: {item.quantity} • ${item.price.toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-white/20">
                          <div>
                            <p className="text-sm text-gray-600">{content[language].orders.customer}: {order.customer.phone}</p>
                            {order.estimatedPrep > 0 && (
                              <p className="text-sm text-gray-600">{content[language].orders.estimatedPrep}: {order.estimatedPrep} {content[language].analytics.minutes}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <>
                                <Button
                                  onClick={() => handleOrderAction(order.id, 'reject')}
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-3 text-xs border border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                                >
                                  {content[language].orders.reject}
                                </Button>
                                <Button
                                  onClick={() => handleOrderAction(order.id, 'accept')}
                                  size="sm"
                                  className="h-8 px-3 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
                                >
                                  {content[language].orders.accept}
                                </Button>
                              </>
                            )}
                            {order.status === 'preparing' && (
                              <Button
                                onClick={() => handleOrderAction(order.id, 'ready')}
                                size="sm"
                                className="h-8 px-3 text-xs bg-green-500 hover:bg-green-600 text-white rounded-xl"
                              >
                                {content[language].orders.ready}
                              </Button>
                            )}
                            {order.status === 'ready' && (
                              <Button
                                onClick={() => handleOrderAction(order.id, 'completed')}
                                size="sm"
                                className="h-8 px-3 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded-xl"
                              >
                                {content[language].orders.completed}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* MENU TAB - FIXED VERSION ONLY */}
          <TabsContent value="menu" className="space-y-4">
            <VendorDashboardMenuSectionFixed
              language={language}
              menuItems={menuItems}
              categories={categories}
              selectedMenuItems={selectedMenuItems}
              editingMenuItem={editingMenuItem}
              editingField={editingField}
              editValue={editValue}
              showMenuItemModal={showMenuItemModal}
              showBulkActions={showBulkActions}
              onSelectMenuItem={handleSelectMenuItem}
              onSelectAllMenuItems={handleSelectAllMenuItems}
              onBulkToggleAvailability={handleBulkToggleAvailability}
              onBulkDelete={handleBulkDelete}
              onMenuToggle={handleMenuToggle}
              onMenuItemEdit={handleMenuItemEdit}
              onMenuItemSave={handleMenuItemSave}
              onMenuItemCancel={handleMenuItemCancel}
              onMenuItemDelete={handleMenuItemDelete}
              onMenuItemDuplicate={handleMenuItemDuplicate}
              onAddNewMenuItem={handleAddNewMenuItem}
              onUpdateMenuItem={handleUpdateMenuItem}
              onAddMenuItem={handleAddMenuItem}
              onAddCategory={handleAddCategory}
              setEditValue={setEditValue}
              setShowMenuItemModal={setShowMenuItemModal}
              setShowBulkActions={setShowBulkActions}
            />
          </TabsContent>

          {/* ANALYTICS TAB - PRESERVED EXACTLY FROM ORIGINAL */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-xl">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{content[language].analytics.totalRevenue}</p>
                      <p className="text-xl font-bold text-gray-800">${mockAnalyticsData.metrics.totalRevenue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{content[language].analytics.totalOrders}</p>
                      <p className="text-xl font-bold text-gray-800">{mockAnalyticsData.metrics.totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Sales Chart */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">{content[language].analytics.weeklyRevenue}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={mockAnalyticsData.dailySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px'
                      }} 
                    />
                    <Bar dataKey="sales" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Hourly Orders Chart */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">{content[language].analytics.hourlyOrders}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={mockAnalyticsData.hourlyOrders}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="hour" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px'
                      }} 
                    />
                    <Line type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">{content[language].analytics.categoryBreakdown}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={mockAnalyticsData.categoryPerformance}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {mockAnalyticsData.categoryPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">{content[language].analytics.keyMetrics}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">${mockAnalyticsData.metrics.avgOrderValue}</p>
                    <p className="text-sm text-gray-600">{content[language].analytics.avgOrderValue}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{mockAnalyticsData.metrics.customerRetention}%</p>
                    <p className="text-sm text-gray-600">{content[language].analytics.customerRetention}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{mockAnalyticsData.metrics.fulfillmentTime} {content[language].analytics.minutes}</p>
                    <p className="text-sm text-gray-600">{content[language].analytics.fulfillmentTime}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{mockAnalyticsData.metrics.customerSatisfaction}/5</p>
                    <p className="text-sm text-gray-600">{content[language].analytics.satisfaction}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB - PRESERVED EXACTLY FROM ORIGINAL */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">{content[language].businessStatus.businessControl}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">{content[language].businessStatus.autoAccept}</p>
                    <p className="text-sm text-gray-600">Automatically accept incoming orders</p>
                  </div>
                  <Switch
                    checked={vendorData.autoAcceptOrders}
                    onCheckedChange={(checked) => setVendorData(prev => ({ ...prev, autoAcceptOrders: checked }))}
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">{content[language].businessStatus.prepTime}</p>
                    <p className="text-sm text-gray-600">Average preparation time in minutes</p>
                  </div>
                  <Input
                    type="number"
                    value={vendorData.preparationTime}
                    onChange={(e) => setVendorData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 15 }))}
                    className="w-20 h-8 text-center rounded-xl"
                    min="1"
                    max="120"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">{content[language].businessStatus.deliveryRadius}</p>
                    <p className="text-sm text-gray-600">Delivery radius in kilometers</p>
                  </div>
                  <Input
                    type="number"
                    value={vendorData.deliveryRadius}
                    onChange={(e) => setVendorData(prev => ({ ...prev, deliveryRadius: parseInt(e.target.value) || 5 }))}
                    className="w-20 h-8 text-center rounded-xl"
                    min="1"
                    max="50"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Operating Hours Modal - PRESERVED EXACTLY FROM ORIGINAL */}
      <Dialog open={showHoursModal} onOpenChange={setShowHoursModal}>
        <DialogContent className="bg-white/95 backdrop-blur-md border border-white/30 rounded-3xl max-w-md mx-auto w-full max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-800">
              {content[language].businessStatus.hoursModalTitle}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              {content[language].businessStatus.hoursModalDescription}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 vendor-dashboard-container touch-scroll">
            {Object.entries(vendorData.operatingHours).map(([day, hours]) => (
              <div key={day} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-gray-800 capitalize">
                    {content[language].businessStatus.days[day as keyof typeof content[language].businessStatus.days]}
                  </label>
                  <Switch
                    checked={hours.isActive}
                    onCheckedChange={(checked) => handleOperatingHoursChange(day, 'isActive', checked)}
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>
                
                {hours.isActive && (
                  <div className="grid grid-cols-2 gap-3 pl-4">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">{content[language].businessStatus.openTime}</label>
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                        className="h-8 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">{content[language].businessStatus.closeTime}</label>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                        className="h-8 rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setShowHoursModal(false)}
              variant="outline"
              className="flex-1 rounded-xl h-10 border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              {content[language].businessStatus.cancel}
            </Button>
            <Button
              onClick={saveOperatingHours}
              className="flex-1 rounded-xl h-10 bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {content[language].businessStatus.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}