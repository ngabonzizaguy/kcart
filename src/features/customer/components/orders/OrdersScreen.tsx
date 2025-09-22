import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle, Package, XCircle, Plane, Zap } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '@legacy/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../shared/components/ui/tabs';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../../../../lib/figma/ImageWithFallback';
import type { Order } from '../MainApp';
// FEATURE FLAGS: Import feature flag hooks for conditional rendering
import { useFeatureFlag } from '../../../../shared/hooks/useFeatureFlag';

interface OrdersScreenProps {
  language: 'en' | 'rw';
  orders: Order[];
  onOrderSelect: (order: Order) => void;
  onBack: () => void;
}

export function OrdersScreen({ 
  language, 
  orders, 
  onOrderSelect, 
  onBack 
}: OrdersScreenProps) {
  const [activeTab, setActiveTab] = useState('all');
  
  // FEATURE FLAGS: Check if drone delivery features are enabled
  const isDroneDeliveryEnabled = useFeatureFlag('delivery.droneDelivery');

  const content = {
    en: {
      orders: 'My Orders',
      all: 'All',
      active: 'Active', 
      completed: 'Completed',
      cancelled: 'Cancelled',
      noOrders: 'No orders yet',
      noOrdersDesc: 'Start browsing restaurants to place your first order!',
      orderTotal: 'Total',
      orderItems: 'items',
      trackOrder: 'Track',
      viewDetails: 'View Details',
      orderStatuses: {
        placed: 'Order Placed',
        confirmed: 'Confirmed',
        preparing: 'Preparing', 
        ready: 'Ready for Pickup',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      }
    },
    rw: {
      orders: 'Ibisabwa Byanje',
      all: 'Byose',
      active: 'Birakora',
      completed: 'Byarangiye', 
      cancelled: 'Byahagararijwe',
      noOrders: 'Nta bisabwa',
      noOrdersDesc: 'Tangira gushakisha resitora kugira ngo usabe ibintu!',
      orderTotal: 'Igiteranyo',
      orderItems: 'ibintu',
      trackOrder: 'Kuraguza',
      viewDetails: 'Reba Amakuru',
      orderStatuses: {
        placed: 'Byasabwe',
        confirmed: 'Byemejwe',
        preparing: 'Birateguwa',
        ready: 'Biteguye',
        delivered: 'Byatanzwe', 
        cancelled: 'Byahagararijwe'
      }
    }
  };

  // Mock orders if none provided - Include drone delivery orders
  const mockOrders: Order[] = orders.length > 0 ? orders : [
    {
      id: '1',
      items: [
        {
          id: '1',
          name: 'Grilled Chicken Combo',
          price: 8500,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
          vendorId: '1',
          vendorName: 'Tasty Bites'
        }
      ],
      total: 10500,
      status: 'preparing',
      vendorName: 'Tasty Bites',
      deliveryAddress: 'KG 123 St, Kigali',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      deliveryMethod: 'drone' // Add drone delivery method
    },
    {
      id: '2',
      items: [
        {
          id: '2',
          name: 'Beef Burger Deluxe',
          price: 12000,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
          vendorId: '2',
          vendorName: 'Burger Palace'
        }
      ],
      total: 26000,
      status: 'out-for-delivery',
      vendorName: 'Burger Palace',
      deliveryAddress: 'KN 2 Ave, Kigali',
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() + 8 * 60 * 1000).toISOString(),
      deliveryMethod: 'drone' // Add drone delivery method
    },
    {
      id: '3',
      items: [
        {
          id: '3',
          name: 'Vegetarian Pizza',
          price: 9500,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
          vendorId: '3',
          vendorName: 'Pizza Corner'
        }
      ],
      total: 11500,
      status: 'delivered',
      vendorName: 'Pizza Corner',
      deliveryAddress: 'KG 15 St, Kigali',
      createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      deliveryMethod: 'bike' // Regular delivery
    }
  ];

  const getOrderIcon = (status: string) => {
    switch (status) {
      case 'placed':
      case 'confirmed':
        return Clock;
      case 'preparing':
        return Package;
      case 'ready':
      case 'delivered':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
      case 'confirmed':
        return 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700';
      case 'preparing':
        return 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700';
      case 'ready':
      case 'delivered':
        return 'bg-gradient-to-r from-green-100 to-green-50 text-green-700';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-100 to-red-50 text-red-700';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700';
    }
  };

  const filterOrders = (tab: string) => {
    switch (tab) {
      case 'active':
        return mockOrders.filter(order => 
          ['placed', 'confirmed', 'preparing', 'ready'].includes(order.status)
        );
      case 'completed':
        return mockOrders.filter(order => order.status === 'delivered');
      case 'cancelled':
        return mockOrders.filter(order => order.status === 'cancelled');
      default:
        return mockOrders;
    }
  };

  const filteredOrders = filterOrders(activeTab);

  const formatDate = (date: string) => {
    const orderDate = new Date(date);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / (24 * 60))}d ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col">
      {/* Header with DeliGo Glass Design */}
      <div className="bg-white/90 backdrop-blur-md border-b border-orange-200/30 pt-safe sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 h-auto rounded-2xl hover:bg-orange-100/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">{content[language].orders}</h1>
            <div className="w-9" />
          </div>
        </div>
      </div>

      {/* Content with proper mobile scrolling */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar"
        style={{
          height: 'calc(100vh - 140px)',
          minHeight: 0,
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y'
        }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          {/* Enhanced Tabs with DeliGo Glass Design */}
          <div className="px-6 py-4">
            <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm border border-orange-200/30 rounded-2xl p-1">
              <TabsTrigger 
                value="all" 
                className="text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all font-medium"
              >
                {content[language].all}
              </TabsTrigger>
              <TabsTrigger 
                value="active" 
                className="text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all font-medium"
              >
                {content[language].active}
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all font-medium"
              >
                {content[language].completed}
              </TabsTrigger>
              <TabsTrigger 
                value="cancelled" 
                className="text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all font-medium"
              >
                {content[language].cancelled}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <TabsContent value={activeTab} className="m-0 px-6">
            {filteredOrders.length === 0 ? (
              /* Enhanced Empty State with DeliGo Glass Design */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-orange-100/60 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 border border-orange-200/30">
                  <Package className="w-12 h-12 text-orange-500" />
                </div>
                <h3 className="text-foreground font-semibold mb-3">{content[language].noOrders}</h3>
                <p className="text-muted-foreground text-center max-w-sm leading-relaxed">
                  {content[language].noOrdersDesc}
                </p>
              </div>
            ) : (
              /* Enhanced Orders List with DeliGo Glass Design */
              <div className="space-y-4 pb-4 bottom-nav-spacing">
                {filteredOrders.map((order) => {
                  const StatusIcon = getOrderIcon(order.status);
                  
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        try {
                          // Validate order data before passing
                          if (order && order.id && order.vendorName && Array.isArray(order.items)) {
                            onOrderSelect(order);
                          } else {
                            console.warn('Invalid order data:', order);
                          }
                        } catch (error) {
                          console.error('Error selecting order:', error);
                        }
                      }}
                      className="bg-white/85 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden hover:bg-white/95 hover:shadow-lg transition-all cursor-pointer touch-manipulation"
                    >
                      <div className="p-5">
                        {/* Enhanced Order Header with Drone Delivery Indicator */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center border border-orange-200/30 relative">
                              <StatusIcon className="w-7 h-7 text-orange-600" />
                              {/* Drone Delivery Indicator - Feature Flag Controlled */}
                              {isDroneDeliveryEnabled && order.deliveryMethod === 'drone' && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                  <Plane className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-foreground font-semibold">{order.vendorName}</p>
                                {/* Drone Badge - Feature Flag Controlled */}
                                {isDroneDeliveryEnabled && order.deliveryMethod === 'drone' && (
                                  <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-2 py-0.5 rounded-full text-xs border-0">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Drone
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground font-medium">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>
                          
                          <Badge 
                            className={`${getStatusColor(order.status)} px-3 py-1 rounded-2xl border-0 font-medium`}
                          >
                            {content[language].orderStatuses[order.status as keyof typeof content[typeof language]['orderStatuses']]}
                          </Badge>
                        </div>

                        {/* Enhanced Order Items Preview */}
                        <div className="flex items-center gap-4 mb-4">
                          {/* Item Images */}
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div 
                                key={item.id} 
                                className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 border-3 border-white shadow-sm"
                                style={{ zIndex: 3 - index }}
                              >
                                <ImageWithFallback
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-12 h-12 rounded-2xl bg-orange-100/80 border-3 border-white flex items-center justify-center">
                                <span className="text-xs text-orange-600 font-bold">+{order.items.length - 3}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground font-semibold truncate">
                              {order.items[0].name}
                              {order.items.length > 1 && ` +${order.items.length - 1} ${content[language].orderItems}`}
                            </p>
                            <p className="text-sm text-muted-foreground font-medium">
                              {content[language].orderTotal}: <span className="text-primary font-bold">{order.total.toLocaleString()} RWF</span>
                            </p>
                          </div>
                        </div>

                        {/* Order Progress Indicator */}
                        <div className="flex items-center justify-between pt-4 border-t border-orange-200/30">
                          <div className="flex items-center gap-2 text-sm">
                            <div className={`w-3 h-3 rounded-full ${
                              ['preparing', 'ready'].includes(order.status) ? 'bg-orange-500 animate-pulse' : 
                              order.status === 'delivered' ? 'bg-green-500' :
                              order.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                            }`} />
                            <span className="text-muted-foreground font-medium">
                              {content[language].orderStatuses[order.status as keyof typeof content[typeof language]['orderStatuses']]}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground font-medium">
                            ID: #{order.id.padStart(4, '0')}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}