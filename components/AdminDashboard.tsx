import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Shield, Users, Building2, TrendingUp, DollarSign, Eye, Settings, 
  UserCheck, UserX, AlertTriangle, CheckCircle, Clock, Search, 
  MoreVertical, Ban, Unlock, Mail, Phone, MapPin, Calendar,
  Star, Package, CreditCard, BarChart3, PieChart as PieChartIcon,
  Activity, Database, Globe, Zap, FileText, Download, Filter,
  ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, X, Check
} from 'lucide-react';

/**
 * AdminDashboard - Complete Platform Management System
 * 
 * Core Admin Features:
 * - User Management (Customers & Vendors)
 * - Restaurant Approval & Oversight
 * - Sales Analytics & Financial Reports
 * - Platform Health Monitoring
 * - System Configuration & Settings
 * - Real-time Data Integration
 * 
 * Design: DeliGo Glass Design Language
 * - Warm glassmorphism with cream/orange palette
 * - Mobile-first with desktop optimizations
 * - Professional admin interface styling
 * - Bilingual support (English/Kinyarwanda)
 * 
 * Integration: Uses shared data architecture from App.tsx
 */

// Admin-specific data types extending the shared data structure
interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
  pendingVendors: number;
  dailyGrowth: number;
  conversionRate: number;
}

interface UserManagementData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'vendor';
  status: 'active' | 'inactive' | 'banned' | 'pending';
  joinedDate: string;
  lastActivity: string;
  totalOrders?: number;
  totalRevenue?: number;
  rating?: number;
  location: string;
  verificationStatus?: 'verified' | 'pending' | 'rejected';
}

interface PlatformAnalytics {
  timeframe: string;
  users: number;
  orders: number;
  revenue: number;
  growth: number;
}

interface VendorPerformance {
  id: string;
  name: string;
  totalOrders: number;
  revenue: number;
  rating: number;
  commission: number;
  status: 'active' | 'inactive' | 'suspended';
  joinedDate: string;
}

interface AdminDashboardProps {
  language: 'en' | 'rw';
  onBack: () => void;
  // Integration with shared data architecture
  sharedRestaurants?: any[];
  sharedOrders?: any[];
  sharedUsers?: any[];
  onUpdateRestaurant?: (id: string, updates: any) => Promise<void>;
  onUpdateUser?: (id: string, updates: any) => Promise<void>;
  onSystemUpdate?: (updates: any) => Promise<void>;
}

// Mock admin data - TODO: Replace with real API calls
const mockAdminStats: AdminStats = {
  totalUsers: 12847,
  totalVendors: 342,
  totalRevenue: 2847500,
  totalOrders: 8924,
  activeUsers: 3456,
  pendingVendors: 23,
  dailyGrowth: 12.5,
  conversionRate: 68.2
};

const mockUsers: UserManagementData[] = [
  {
    id: 'user-001',
    name: 'Jean Baptiste Uwimana',
    email: 'jean.uwimana@email.rw',
    phone: '+250 788 123 456',
    role: 'customer',
    status: 'active',
    joinedDate: '2024-01-15',
    lastActivity: '2 hours ago',
    totalOrders: 47,
    location: 'Kigali, Gasabo',
    rating: 4.8
  },
  {
    id: 'vendor-001',
    name: 'Golden Spoon Restaurant',
    email: 'contact@goldenspoon.rw',
    phone: '+250 788 654 321',
    role: 'vendor',
    status: 'active',
    joinedDate: '2024-02-01',
    lastActivity: '1 hour ago',
    totalRevenue: 485000,
    location: 'Kigali, Kacyiru',
    rating: 4.6,
    verificationStatus: 'verified'
  },
  {
    id: 'vendor-002',
    name: 'Tokyo Sushi Bar',
    email: 'info@tokyosushi.rw',
    phone: '+250 788 789 012',
    role: 'vendor',
    status: 'pending',
    joinedDate: '2024-03-10',
    lastActivity: '30 minutes ago',
    totalRevenue: 0,
    location: 'Kigali, Nyarugenge',
    verificationStatus: 'pending'
  }
];

const mockPlatformAnalytics: PlatformAnalytics[] = [
  { timeframe: 'Jan 2024', users: 8500, orders: 5200, revenue: 1850000, growth: 8.2 },
  { timeframe: 'Feb 2024', users: 9800, orders: 6100, revenue: 2150000, growth: 15.3 },
  { timeframe: 'Mar 2024', users: 11200, orders: 7300, revenue: 2580000, growth: 14.3 },
  { timeframe: 'Apr 2024', users: 12847, orders: 8924, revenue: 2847500, growth: 12.5 }
];

const mockVendorPerformance: VendorPerformance[] = [
  {
    id: 'vendor-001',
    name: 'Golden Spoon Restaurant',
    totalOrders: 1247,
    revenue: 485000,
    rating: 4.8,
    commission: 48500,
    status: 'active',
    joinedDate: '2024-01-15'
  },
  {
    id: 'vendor-002',
    name: 'Tokyo Sushi Bar',
    totalOrders: 892,
    revenue: 367000,
    rating: 4.6,
    commission: 36700,
    status: 'active',
    joinedDate: '2024-02-01'
  },
  {
    id: 'vendor-003',
    name: 'Mama\'s Kitchen',
    totalOrders: 1654,
    revenue: 523000,
    rating: 4.9,
    commission: 52300,
    status: 'active',
    joinedDate: '2024-01-08'
  }
];

export function AdminDashboard({
  language,
  onBack,
  sharedRestaurants = [],
  sharedOrders = [],
  sharedUsers = [],
  onUpdateRestaurant,
  onUpdateUser,
  onSystemUpdate
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminStats, setAdminStats] = useState(mockAdminStats);
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<UserManagementData | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userFilter, setUserFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // Content localization
  const content = {
    en: {
      title: 'Admin Dashboard',
      subtitle: 'Platform Management & Analytics',
      tabs: {
        overview: 'Overview',
        users: 'User Management',
        vendors: 'Vendor Oversight',
        analytics: 'Sales Analytics',
        system: 'System Health',
        settings: 'Settings'
      },
      overview: {
        welcomeTitle: 'Platform Overview',
        welcomeSubtitle: 'Real-time insights into DeliGo performance',
        totalUsers: 'Total Users',
        totalVendors: 'Total Vendors',
        totalRevenue: 'Total Revenue',
        totalOrders: 'Total Orders',
        activeUsers: 'Active Users',
        pendingVendors: 'Pending Vendors',
        dailyGrowth: 'Daily Growth',
        conversionRate: 'Conversion Rate',
        recentActivity: 'Recent Platform Activity',
        quickActions: 'Quick Actions',
        reviewPendingVendors: 'Review Pending Vendors',
        viewSystemHealth: 'View System Health',
        downloadReports: 'Download Reports',
        manageSettings: 'Manage Settings'
      },
      userManagement: {
        title: 'User Management',
        subtitle: 'Manage customers and vendors',
        searchPlaceholder: 'Search users by name or email...',
        filterAll: 'All Users',
        filterCustomers: 'Customers',
        filterVendors: 'Vendors',
        filterActive: 'Active',
        filterInactive: 'Inactive',
        filterBanned: 'Banned',
        filterPending: 'Pending',
        name: 'Name',
        email: 'Email',
        role: 'Role',
        status: 'Status',
        joined: 'Joined',
        lastActivity: 'Last Activity',
        actions: 'Actions',
        viewDetails: 'View Details',
        editUser: 'Edit User',
        banUser: 'Ban User',
        unbanUser: 'Unban User',
        deleteUser: 'Delete User',
        approveVendor: 'Approve Vendor',
        rejectVendor: 'Reject Vendor'
      },
      vendorOversight: {
        title: 'Vendor Oversight',
        subtitle: 'Manage restaurant partners and performance',
        pendingApprovals: 'Pending Approvals',
        topPerformers: 'Top Performing Vendors',
        revenueShare: 'Revenue Share Analysis',
        commissionEarned: 'Commission Earned',
        averageRating: 'Average Rating',
        totalRestaurants: 'Total Restaurants'
      },
      analytics: {
        title: 'Sales Analytics',
        subtitle: 'Comprehensive platform performance metrics',
        timeframe: 'Time Frame',
        last7days: 'Last 7 Days',
        last30days: 'Last 30 Days',
        last3months: 'Last 3 Months',
        last12months: 'Last 12 Months',
        revenueGrowth: 'Revenue Growth',
        orderTrends: 'Order Trends',
        userGrowth: 'User Growth',
        vendorPerformance: 'Vendor Performance',
        platformMetrics: 'Platform Metrics',
        downloadReport: 'Download Report'
      },
      systemHealth: {
        title: 'System Health',
        subtitle: 'Monitor platform performance and uptime',
        serverStatus: 'Server Status',
        apiHealth: 'API Health',
        databaseStatus: 'Database Status',
        activeConnections: 'Active Connections',
        responseTime: 'Avg Response Time',
        errorRate: 'Error Rate',
        uptime: 'Uptime',
        healthy: 'Healthy',
        warning: 'Warning',
        critical: 'Critical'
      },
      settings: {
        title: 'Platform Settings',
        subtitle: 'Configure system-wide settings',
        generalSettings: 'General Settings',
        paymentSettings: 'Payment Settings',
        notificationSettings: 'Notification Settings',
        securitySettings: 'Security Settings',
        featureFlags: 'Feature Flags',
        apiConfiguration: 'API Configuration',
        saveSettings: 'Save Settings',
        resetSettings: 'Reset to Defaults'
      },
      actions: {
        approve: 'Approve',
        reject: 'Reject',
        ban: 'Ban',
        unban: 'Unban',
        edit: 'Edit',
        delete: 'Delete',
        view: 'View',
        save: 'Save',
        cancel: 'Cancel',
        confirm: 'Confirm',
        export: 'Export',
        filter: 'Filter',
        refresh: 'Refresh'
      }
    },
    rw: {
      title: 'Dashboard y\'Umuyobozi',
      subtitle: 'Gucunga Urubuga n\'Isesengura',
      tabs: {
        overview: 'Muri Rusange',
        users: 'Gucunga Abakoresha',
        vendors: 'Gukurikirana Abacuruzi',
        analytics: 'Isesengura ry\'Ubucuruzi',
        system: 'Ubuzima bw\'Urubuga',
        settings: 'Igenamiterere'
      },
      overview: {
        welcomeTitle: 'Muri Rusange',
        welcomeSubtitle: 'Amakuru ya none y\'imikorere ya DeliGo',
        totalUsers: 'Abakoresha Bose',
        totalVendors: 'Abacuruzi Bose',
        totalRevenue: 'Amafaranga Yose',
        totalOrders: 'Amatungo Yose',
        activeUsers: 'Abakoresha Bakora',
        pendingVendors: 'Abacuruzi Bategereje',
        dailyGrowth: 'Iterambere Ryaburi Munsi',
        conversionRate: 'Igipimo cy\'Guhinduka',
        recentActivity: 'Ibikorwa Bishya',
        quickActions: 'Ibikorwa Byihuse',
        reviewPendingVendors: 'Suzuma Abacuruzi Bategereje',
        viewSystemHealth: 'Reba Ubuzima bw\'Urubuga',
        downloadReports: 'Manura Raporo',
        manageSettings: 'Gucunga Igenamiterere'
      },
      userManagement: {
        title: 'Gucunga Abakoresha',
        subtitle: 'Gucunga abakiriya n\'abacuruzi',
        searchPlaceholder: 'Shakisha abakoresha ukurikije amazina cyangwa email...',
        filterAll: 'Abakoresha Bose',
        filterCustomers: 'Abakiriya',
        filterVendors: 'Abacuruzi',
        filterActive: 'Bakora',
        filterInactive: 'Ntibakora',
        filterBanned: 'Bahagaritswe',
        filterPending: 'Bategereje',
        name: 'Izina',
        email: 'Email',
        role: 'Uruhare',
        status: 'Imiterere',
        joined: 'Yinjiye',
        lastActivity: 'Igikorwa Gishize',
        actions: 'Ibikorwa',
        viewDetails: 'Reba Amakuru',
        editUser: 'Hindura Umukoresha',
        banUser: 'Hagarika Umukoresha',
        unbanUser: 'Kumuha Ihagarika',
        deleteUser: 'Gusiba Umukoresha',
        approveVendor: 'Kwemeza Umucuruzi',
        rejectVendor: 'Kwanga Umucuruzi'
      },
      vendorOversight: {
        title: 'Gukurikirana Abacuruzi',
        subtitle: 'Gucunga abafatanyabikorwa ba resitora n\'imikorere yabo',
        pendingApprovals: 'Kwemezwa Gutegereje',
        topPerformers: 'Abacuruzi Bakomeye',
        revenueShare: 'Isesengura ry\'Ubucuruzi',
        commissionEarned: 'Komisiyo Yakiriwe',
        averageRating: 'Amanota Rusange',
        totalRestaurants: 'Resitora Zose'
      },
      analytics: {
        title: 'Isesengura ry\'Ubucuruzi',
        subtitle: 'Ibipimo byuzuye by\'imikorere y\'urubuga',
        timeframe: 'Igihe',
        last7days: 'Iminsi 7 Ishize',
        last30days: 'Iminsi 30 Ishize',
        last3months: 'Amezi 3 Ashize',
        last12months: 'Amezi 12 Ashize',
        revenueGrowth: 'Iterambere ry\'Amafaranga',
        orderTrends: 'Ibigenda ku Matungo',
        userGrowth: 'Iterambere ry\'Abakoresha',
        vendorPerformance: 'Imikorere y\'Abacuruzi',
        platformMetrics: 'Ibipimo by\'Urubuga',
        downloadReport: 'Manura Raporo'
      },
      systemHealth: {
        title: 'Ubuzima bw\'Urubuga',
        subtitle: 'Gukurikirana imikorere n\'igihe urubuga rwakoze',
        serverStatus: 'Imiterere ya Server',
        apiHealth: 'Ubuzima bwa API',
        databaseStatus: 'Imiterere y\'Ikigo cy\'Amakuru',
        activeConnections: 'Amahuriro Akora',
        responseTime: 'Igihe cyo Gusubiza',
        errorRate: 'Igipimo cy\'Amakosa',
        uptime: 'Igihe Cyo Gukora',
        healthy: 'Buzima',
        warning: 'Iburira',
        critical: 'Bikomeye'
      },
      settings: {
        title: 'Igenamiterere y\'Urubuga',
        subtitle: 'Gushiraho igenamiterere rusange',
        generalSettings: 'Igenamiterere Rusange',
        paymentSettings: 'Igenamiterere y\'Ubwishyuzi',
        notificationSettings: 'Igenamiterere y\'Ubutumire',
        securitySettings: 'Igenamiterere y\'Umutekano',
        featureFlags: 'Ibimenyetso by\'Ibintu',
        apiConfiguration: 'Gushiraho API',
        saveSettings: 'Bika Igenamiterere',
        resetSettings: 'Garura Ibyasanzwe'
      },
      actions: {
        approve: 'Kwemeza',
        reject: 'Kwanga',
        ban: 'Hagarika',
        unban: 'Kumuha Ihagarika',
        edit: 'Hindura',
        delete: 'Gusiba',
        view: 'Reba',
        save: 'Bika',
        cancel: 'Bireke',
        confirm: 'Kwemeza',
        export: 'Kohereza',
        filter: 'Gutoramo',
        refresh: 'Kongera'
      }
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage for display
  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Handle user actions
  const handleUserAction = async (userId: string, action: string) => {
    try {
      // TODO: Replace with real API call
      console.log(`Admin action: ${action} for user ${userId}`);
      
      if (onUpdateUser) {
        await onUpdateUser(userId, { action });
      }
      
      // Update local state
      setUsers(prev => 
        prev.map(user => {
          if (user.id === userId) {
            switch (action) {
              case 'ban':
                return { ...user, status: 'banned' as const };
              case 'unban':
                return { ...user, status: 'active' as const };
              case 'approve':
                return { ...user, status: 'active' as const, verificationStatus: 'verified' as const };
              case 'reject':
                return { ...user, status: 'inactive' as const, verificationStatus: 'rejected' as const };
              default:
                return user;
            }
          }
          return user;
        })
      );
      
      toast.success(`User ${action} successful`);
    } catch (error) {
      console.error('Failed to perform user action:', error);
      toast.error(`Failed to ${action} user`);
    }
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (userFilter === 'all') return matchesSearch;
    if (userFilter === 'customers') return matchesSearch && user.role === 'customer';
    if (userFilter === 'vendors') return matchesSearch && user.role === 'vendor';
    return matchesSearch && user.status === userFilter;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 pb-safe">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-white/20 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12 w-12 p-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-medium text-gray-800">{content[language].title}</h1>
              <p className="text-sm text-gray-600">{content[language].subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <Shield className="w-3 h-3 mr-1" />
              Admin Access
            </Badge>
          </div>
        </div>
      </div>

      {/* Admin Dashboard Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-2 border border-white/20">
            <TabsList className="grid w-full grid-cols-6 bg-transparent gap-1">
              <TabsTrigger 
                value="overview" 
                className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm"
              >
                {content[language].tabs.overview}
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm"
              >
                {content[language].tabs.users}
              </TabsTrigger>
              <TabsTrigger 
                value="vendors" 
                className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm"
              >
                {content[language].tabs.vendors}
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm"
              >
                {content[language].tabs.analytics}
              </TabsTrigger>
              <TabsTrigger 
                value="system" 
                className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm"
              >
                {content[language].tabs.system}
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white text-sm"
              >
                {content[language].tabs.settings}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Section */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-800 mb-2">
                      {content[language].overview.welcomeTitle}
                    </h2>
                    <p className="text-gray-600">{content[language].overview.welcomeSubtitle}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-2xl">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-xs text-blue-600 font-medium">
                        {formatPercent(adminStats.dailyGrowth)}
                      </span>
                    </div>
                    <div className="text-2xl font-medium text-blue-900 mb-1">
                      {adminStats.totalUsers.toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-700">{content[language].overview.totalUsers}</div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <Building2 className="w-5 h-5 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">
                        +{adminStats.pendingVendors}
                      </span>
                    </div>
                    <div className="text-2xl font-medium text-green-900 mb-1">
                      {adminStats.totalVendors.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-700">{content[language].overview.totalVendors}</div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="w-5 h-5 text-orange-600" />
                      <ArrowUpRight className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="text-2xl font-medium text-orange-900 mb-1">
                      {formatCurrency(adminStats.totalRevenue)}
                    </div>
                    <div className="text-sm text-orange-700">{content[language].overview.totalRevenue}</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      <span className="text-xs text-purple-600 font-medium">
                        {formatPercent(adminStats.conversionRate)}
                      </span>
                    </div>
                    <div className="text-2xl font-medium text-purple-900 mb-1">
                      {adminStats.totalOrders.toLocaleString()}
                    </div>
                    <div className="text-sm text-purple-700">{content[language].overview.totalOrders}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Growth Chart */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Platform Growth Trends</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockPlatformAnalytics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="timeframe" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '12px',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stackId="1"
                        stroke="#f97316" 
                        fill="url(#colorRevenue)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="orders" 
                        stackId="2"
                        stroke="#22c55e" 
                        fill="url(#colorOrders)" 
                      />
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  {content[language].overview.quickActions}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => setActiveTab('vendors')}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-16 flex flex-col items-center justify-center space-y-1"
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="text-xs">{content[language].overview.reviewPendingVendors}</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab('system')}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-xl h-16 flex flex-col items-center justify-center space-y-1"
                  >
                    <Activity className="w-5 h-5" />
                    <span className="text-xs">{content[language].overview.viewSystemHealth}</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab('analytics')}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-16 flex flex-col items-center justify-center space-y-1"
                  >
                    <Download className="w-5 h-5" />
                    <span className="text-xs">{content[language].overview.downloadReports}</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab('settings')}
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl h-16 flex flex-col items-center justify-center space-y-1"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="text-xs">{content[language].overview.manageSettings}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-800 mb-2">
                      {content[language].userManagement.title}
                    </h2>
                    <p className="text-gray-600">{content[language].userManagement.subtitle}</p>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder={content[language].userManagement.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 rounded-xl border-gray-200 h-12"
                      />
                    </div>
                  </div>
                  
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger className="w-48 rounded-xl border-gray-200 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{content[language].userManagement.filterAll}</SelectItem>
                      <SelectItem value="customers">{content[language].userManagement.filterCustomers}</SelectItem>
                      <SelectItem value="vendors">{content[language].userManagement.filterVendors}</SelectItem>
                      <SelectItem value="active">{content[language].userManagement.filterActive}</SelectItem>
                      <SelectItem value="inactive">{content[language].userManagement.filterInactive}</SelectItem>
                      <SelectItem value="banned">{content[language].userManagement.filterBanned}</SelectItem>
                      <SelectItem value="pending">{content[language].userManagement.filterPending}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <div className="min-w-full bg-white/50 rounded-2xl border border-white/20">
                    {/* Table Header */}
                    <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-200 bg-gray-50/50 rounded-t-2xl">
                      <div className="font-medium text-gray-700">{content[language].userManagement.name}</div>
                      <div className="font-medium text-gray-700">{content[language].userManagement.email}</div>
                      <div className="font-medium text-gray-700">{content[language].userManagement.role}</div>
                      <div className="font-medium text-gray-700">{content[language].userManagement.status}</div>
                      <div className="font-medium text-gray-700">{content[language].userManagement.joined}</div>
                      <div className="font-medium text-gray-700">{content[language].userManagement.lastActivity}</div>
                      <div className="font-medium text-gray-700">{content[language].userManagement.actions}</div>
                    </div>
                    
                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                      {paginatedUsers.map((user) => (
                        <div key={user.id} className="grid grid-cols-7 gap-4 p-4 items-center">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              {user.role === 'vendor' && user.rating && (
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span>{user.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600">{user.email}</div>
                          
                          <div>
                            <Badge className={
                              user.role === 'vendor' 
                                ? 'bg-purple-100 text-purple-700 border-purple-200'
                                : 'bg-blue-100 text-blue-700 border-blue-200'
                            }>
                              {user.role === 'vendor' ? 'Vendor' : 'Customer'}
                            </Badge>
                          </div>
                          
                          <div>
                            <Badge className={
                              user.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                              user.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                              user.status === 'banned' ? 'bg-red-100 text-red-700 border-red-200' :
                              'bg-gray-100 text-gray-700 border-gray-200'
                            }>
                              <div className={`w-2 h-2 rounded-full mr-1 ${
                                user.status === 'active' ? 'bg-green-500' :
                                user.status === 'pending' ? 'bg-yellow-500' :
                                user.status === 'banned' ? 'bg-red-500' : 'bg-gray-500'
                              }`} />
                              {user.status}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            {new Date(user.joinedDate).toLocaleDateString()}
                          </div>
                          
                          <div className="text-sm text-gray-600">{user.lastActivity}</div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              className="border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg h-8 px-3"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            
                            {user.status === 'pending' && user.role === 'vendor' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleUserAction(user.id, 'approve')}
                                  className="bg-green-500 hover:bg-green-600 text-white rounded-lg h-8 px-3"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleUserAction(user.id, 'reject')}
                                  className="bg-red-500 hover:bg-red-600 text-white rounded-lg h-8 px-3"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            
                            {user.status === 'active' && (
                              <Button
                                size="sm"
                                onClick={() => handleUserAction(user.id, 'ban')}
                                className="bg-red-500 hover:bg-red-600 text-white rounded-lg h-8 px-3"
                              >
                                <Ban className="w-3 h-3" />
                              </Button>
                            )}
                            
                            {user.status === 'banned' && (
                              <Button
                                size="sm"
                                onClick={() => handleUserAction(user.id, 'unban')}
                                className="bg-green-500 hover:bg-green-600 text-white rounded-lg h-8 px-3"
                              >
                                <Unlock className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-10 px-4"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            onClick={() => setCurrentPage(page)}
                            className={page === currentPage 
                              ? "bg-orange-500 hover:bg-orange-600 text-white rounded-lg h-10 w-10 p-0"
                              : "border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg h-10 w-10 p-0"
                            }
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-10 px-4"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vendor Oversight Tab */}
          <TabsContent value="vendors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Pending Vendor Approvals */}
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      {content[language].vendorOversight.pendingApprovals}
                    </h3>
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      {adminStats.pendingVendors}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {users.filter(u => u.role === 'vendor' && u.status === 'pending').map(vendor => (
                      <div key={vendor.id} className="flex items-center justify-between p-3 bg-yellow-50/50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{vendor.name}</div>
                            <div className="text-xs text-gray-500">{vendor.location}</div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            onClick={() => handleUserAction(vendor.id, 'approve')}
                            className="bg-green-500 hover:bg-green-600 text-white rounded-lg h-8 w-8 p-0"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUserAction(vendor.id, 'reject')}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-lg h-8 w-8 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Vendors */}
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    {content[language].vendorOversight.topPerformers}
                  </h3>
                  
                  <div className="space-y-3">
                    {mockVendorPerformance.slice(0, 3).map((vendor, index) => (
                      <div key={vendor.id} className="flex items-center justify-between p-3 bg-green-50/50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{vendor.name}</div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>{formatCurrency(vendor.revenue)}</span>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span>{vendor.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Commission Summary */}
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    {content[language].vendorOversight.commissionEarned}
                  </h3>
                  
                  <div className="text-center">
                    <div className="text-3xl font-medium text-orange-600 mb-2">
                      {formatCurrency(mockVendorPerformance.reduce((sum, v) => sum + v.commission, 0))}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">This Month</div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Average Rating</span>
                        <span className="font-medium text-gray-900">
                          {(mockVendorPerformance.reduce((sum, v) => sum + v.rating, 0) / mockVendorPerformance.length).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Restaurants</span>
                        <span className="font-medium text-gray-900">{mockVendorPerformance.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Commission Rate</span>
                        <span className="font-medium text-gray-900">10%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vendor Performance Chart */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Vendor Performance Overview</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockVendorPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#666" angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '12px',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="totalOrders" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-800 mb-2">
                      {content[language].analytics.title}
                    </h2>
                    <p className="text-gray-600">{content[language].analytics.subtitle}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                      <SelectTrigger className="w-40 rounded-xl border-gray-200 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">{content[language].analytics.last7days}</SelectItem>
                        <SelectItem value="30d">{content[language].analytics.last30days}</SelectItem>
                        <SelectItem value="3m">{content[language].analytics.last3months}</SelectItem>
                        <SelectItem value="12m">{content[language].analytics.last12months}</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-10 px-4">
                      <Download className="w-4 h-4 mr-2" />
                      {content[language].analytics.downloadReport}
                    </Button>
                  </div>
                </div>

                {/* Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Growth */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-2xl">
                    <h4 className="font-medium text-gray-800 mb-4">{content[language].analytics.revenueGrowth}</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockPlatformAnalytics}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="timeframe" stroke="#666" />
                          <YAxis stroke="#666" />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#f97316" 
                            strokeWidth={3}
                            dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Order Distribution */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl">
                    <h4 className="font-medium text-gray-800 mb-4">Order Distribution by Status</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Completed', value: 145, color: '#22c55e' },
                              { name: 'In Progress', value: 28, color: '#f97316' },
                              { name: 'Pending', value: 12, color: '#eab308' },
                              { name: 'Cancelled', value: 5, color: '#ef4444' }
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: 'Completed', value: 145, color: '#22c55e' },
                              { name: 'In Progress', value: 28, color: '#f97316' },
                              { name: 'Pending', value: 12, color: '#eab308' },
                              { name: 'Cancelled', value: 5, color: '#ef4444' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analytics Table */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Platform Performance Metrics</h3>
                <div className="overflow-x-auto">
                  <div className="min-w-full bg-white/50 rounded-2xl border border-white/20">
                    <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200 bg-gray-50/50 rounded-t-2xl">
                      <div className="font-medium text-gray-700">Timeframe</div>
                      <div className="font-medium text-gray-700">Users</div>
                      <div className="font-medium text-gray-700">Orders</div>
                      <div className="font-medium text-gray-700">Revenue</div>
                      <div className="font-medium text-gray-700">Growth</div>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      {mockPlatformAnalytics.map((period) => (
                        <div key={period.timeframe} className="grid grid-cols-5 gap-4 p-4 items-center">
                          <div className="font-medium text-gray-900">{period.timeframe}</div>
                          <div className="text-gray-600">{period.users.toLocaleString()}</div>
                          <div className="text-gray-600">{period.orders.toLocaleString()}</div>
                          <div className="text-gray-600">{formatCurrency(period.revenue)}</div>
                          <div className={`flex items-center space-x-1 ${
                            period.growth > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {period.growth > 0 ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                            <span>{formatPercent(period.growth)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Server Status */}
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-100 rounded-xl">
                      <Database className="w-5 h-5 text-green-600" />
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {content[language].systemHealth.healthy}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">{content[language].systemHealth.serverStatus}</h3>
                  <p className="text-sm text-gray-600">99.9% Uptime</p>
                </CardContent>
              </Card>

              {/* API Health */}
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {content[language].systemHealth.healthy}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">{content[language].systemHealth.apiHealth}</h3>
                  <p className="text-sm text-gray-600">All endpoints operational</p>
                </CardContent>
              </Card>

              {/* Database Status */}
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <Database className="w-5 h-5 text-purple-600" />
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      <Clock className="w-3 h-3 mr-1" />
                      {content[language].systemHealth.warning}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">{content[language].systemHealth.databaseStatus}</h3>
                  <p className="text-sm text-gray-600">High query load</p>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-orange-100 rounded-xl">
                      <Zap className="w-5 h-5 text-orange-600" />
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Optimal
                    </Badge>
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1">Performance</h3>
                  <p className="text-sm text-gray-600">85ms avg response</p>
                </CardContent>
              </Card>
            </div>

            {/* System Metrics Chart */}
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">System Performance Over Time</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { time: '00:00', cpu: 45, memory: 62, requests: 1240 },
                      { time: '04:00', cpu: 38, memory: 58, requests: 980 },
                      { time: '08:00', cpu: 72, memory: 71, requests: 2150 },
                      { time: '12:00', cpu: 85, memory: 78, requests: 2890 },
                      { time: '16:00', cpu: 78, memory: 75, requests: 2650 },
                      { time: '20:00', cpu: 65, memory: 68, requests: 1920 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="time" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip />
                      <Line type="monotone" dataKey="cpu" stroke="#f97316" strokeWidth={2} name="CPU %" />
                      <Line type="monotone" dataKey="memory" stroke="#22c55e" strokeWidth={2} name="Memory %" />
                      <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} name="Requests/min" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-800 mb-2">
                      {content[language].settings.title}
                    </h2>
                    <p className="text-gray-600">{content[language].settings.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* General Settings */}
                  <div className="border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-medium text-gray-800 mb-4">{content[language].settings.generalSettings}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                        <Input 
                          value="DeliGo" 
                          className="rounded-xl border-gray-200 h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                        <Input 
                          value="support@deligo.rw" 
                          className="rounded-xl border-gray-200 h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                        <Input 
                          value="10" 
                          type="number"
                          className="rounded-xl border-gray-200 h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
                        <Select defaultValue="en">
                          <SelectTrigger className="rounded-xl border-gray-200 h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="rw">Kinyarwanda</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Feature Flags */}
                  <div className="border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-medium text-gray-800 mb-4">{content[language].settings.featureFlags}</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'AI Food Recognition', key: 'ai_food_scan', enabled: true },
                        { name: 'Drone Delivery', key: 'drone_delivery', enabled: true },
                        { name: 'Voice Ordering', key: 'voice_ordering', enabled: false },
                        { name: 'Live Chat Support', key: 'live_chat', enabled: true },
                        { name: 'Loyalty Program', key: 'loyalty_program', enabled: false }
                      ].map((feature) => (
                        <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl">
                          <div>
                            <div className="font-medium text-gray-800">{feature.name}</div>
                            <div className="text-sm text-gray-600">
                              {feature.enabled ? 'Currently enabled' : 'Currently disabled'}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={feature.enabled 
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                            }>
                              {feature.enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg h-8 px-3"
                            >
                              Toggle
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save Settings */}
                  <div className="flex justify-end space-x-4">
                    <Button 
                      variant="outline"
                      className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12 px-6"
                    >
                      {content[language].settings.resetSettings}
                    </Button>
                    <Button 
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 px-6"
                    >
                      {content[language].settings.saveSettings}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
          <DialogContent className="max-w-2xl bg-white/90 backdrop-blur-md border border-white/30 rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-medium text-gray-800">
                User Details - {selectedUser.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* User Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <div className="text-gray-900 font-medium">{selectedUser.name}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <div className="text-gray-900">{selectedUser.email}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <div className="text-gray-900">{selectedUser.phone}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Role</label>
                    <Badge className={
                      selectedUser.role === 'vendor' 
                        ? 'bg-purple-100 text-purple-700 border-purple-200'
                        : 'bg-blue-100 text-blue-700 border-blue-200'
                    }>
                      {selectedUser.role}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <Badge className={
                      selectedUser.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                      selectedUser.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                      selectedUser.status === 'banned' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }>
                      {selectedUser.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Location</label>
                    <div className="text-gray-900">{selectedUser.location}</div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics for Vendors */}
              {selectedUser.role === 'vendor' && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-800 mb-4">Performance Metrics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-medium text-gray-900">
                        {selectedUser.totalRevenue ? formatCurrency(selectedUser.totalRevenue) : 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-medium text-gray-900">
                        {selectedUser.rating || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-medium text-gray-900">
                        {selectedUser.verificationStatus === 'verified' ? 'Yes' : 'No'}
                      </div>
                      <div className="text-sm text-gray-600">Verified</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order History for Customers */}
              {selectedUser.role === 'customer' && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-800 mb-4">Order History</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-medium text-gray-900">
                        {selectedUser.totalOrders || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-medium text-gray-900">
                        {selectedUser.rating || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Customer Rating</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline"
                  onClick={() => setShowUserModal(false)}
                  className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12 px-6"
                >
                  Close
                </Button>
                {selectedUser.status === 'pending' && selectedUser.role === 'vendor' && (
                  <>
                    <Button
                      onClick={() => {
                        handleUserAction(selectedUser.id, 'approve');
                        setShowUserModal(false);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-xl h-12 px-6"
                    >
                      Approve Vendor
                    </Button>
                    <Button
                      onClick={() => {
                        handleUserAction(selectedUser.id, 'reject');
                        setShowUserModal(false);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-12 px-6"
                    >
                      Reject Vendor
                    </Button>
                  </>
                )}
                {selectedUser.status === 'active' && (
                  <Button
                    onClick={() => {
                      handleUserAction(selectedUser.id, 'ban');
                      setShowUserModal(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-12 px-6"
                  >
                    Ban User
                  </Button>
                )}
                {selectedUser.status === 'banned' && (
                  <Button
                    onClick={() => {
                      handleUserAction(selectedUser.id, 'unban');
                      setShowUserModal(false);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-xl h-12 px-6"
                  >
                    Unban User
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}