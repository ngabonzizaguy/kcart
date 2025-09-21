import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Star, Clock, Phone, MessageSquare, RefreshCw, Package, Truck, Check, X, MapPin, User, CreditCard, Smartphone, Banknote, Info, AlertTriangle, Heart, RotateCcw, ChefHat, Navigation, Plane } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ReviewPrompt } from './ReviewPrompt';
import { ReviewsModal } from './ReviewsModal';

interface OrderTrackingProps {
  language: 'en' | 'rw';
  order?: any;
  onBack: () => void;
  onOrderComplete?: () => void;
  onOpenEnhancedTracking?: (order: any) => void;
  onOpenLiveMap?: (order: any) => void;
  onOpenDroneTracking?: (order: any) => void;
}

type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';

interface OrderData {
  id: string;
  status: OrderStatus;
  estimatedDelivery: string;
  originalETA: string;
  etaUpdateReason?: { en: string; rw: string };
  vendorName: string;
  vendorPhone: string;
  items: Array<{
    name: { en: string; rw: string };
    quantity: number;
    price: number;
  }>;
  total: number;
  orderTime: string;
  address: string;
  paymentMethod: 'momo' | 'card' | 'cash';
  transactionRef: string;
  deliveryMethod?: 'standard' | 'drone'; // Add delivery method
}

const mockOrderData: OrderData = {
  id: 'DG-2025-001',
  status: 'preparing', // Change this to test different states
  estimatedDelivery: '25-35 mins',
  originalETA: '2:55 PM',
  etaUpdateReason: { 
    en: 'Driver delayed due to traffic, new ETA updated', 
    rw: 'Umushoferi atinze kubera ubwato, igihe gishya cyashyizweho' 
  },
  vendorName: 'Golden Spoon Restaurant',
  vendorPhone: '+250 788 123 456',
  items: [
    {
      name: { en: 'Grilled Chicken Special', rw: 'Inkoko y\'Akalanga Idasanzwe' },
      quantity: 2,
      price: 8500
    },
    {
      name: { en: 'Creamy Pasta Delight', rw: 'Pasta y\'Amavuta' },
      quantity: 1,
      price: 6800
    }
  ],
  total: 25800,
  orderTime: '2:30 PM',
  address: 'Kigali, Rwanda',
  paymentMethod: 'momo',
  transactionRef: 'TXN-20250903-789456',
  deliveryMethod: 'drone' // Set to 'drone' for testing drone delivery features
};

export function OrderTracking({ 
  language, 
  order, 
  onBack, 
  onOrderComplete, 
  onOpenEnhancedTracking,
  onOpenLiveMap,
  onOpenDroneTracking
}: OrderTrackingProps) {
  const [orderData, setOrderData] = useState(mockOrderData);
  const [isSaved, setIsSaved] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  // Show review prompt when order is delivered
  useEffect(() => {
    if (orderData.status === 'delivered') {
      // Show review prompt after a short delay
      const timer = setTimeout(() => {
        setShowReviewPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [orderData.status]);

  const handleWriteReview = () => {
    setShowReviewPrompt(false);
    setShowReviewsModal(true);
  };

  const handleQuickRating = (rating: number) => {
    console.log(`Quick rating submitted: ${rating} stars for ${orderData.vendorName}`);
    // Here you would send the rating to your backend
  };

  const handleCancelOrder = () => {
    // TODO: Implement actual order cancellation logic
    alert(language === 'en' ? 'Order cancelled successfully' : 'Ikurikira ryaracuzwe neza');
    // Update local state to show cancelled status
    setOrderData(prev => ({ ...prev, status: 'cancelled' }));
  };

  const orderStatuses = [
    {
      key: 'placed' as const,
      name: { en: 'Order Placed', rw: 'Ikurikira Ryashyizweho' },
      description: { en: 'Your order has been received', rw: 'Ikurikira ryawe ryakiriwe' },
      icon: Package,
      time: '2:30 PM'
    },
    {
      key: 'accepted' as const,
      name: { en: 'Order Accepted', rw: 'Ikurikira Ryemewe' },
      description: { en: 'Restaurant confirmed your order', rw: 'Ibibanza byemeje ikurikira ryawe' },
      icon: Check,
      time: '2:35 PM'
    },
    {
      key: 'preparing' as const,
      name: { en: 'Preparing', rw: 'Bitegurwa' },
      description: { en: 'Your food is being prepared', rw: 'Ibiryo byawe birategurwa' },
      icon: ChefHat,
      time: '2:40 PM'
    },
    {
      key: 'out-for-delivery' as const,
      name: { en: 'Out for Delivery', rw: 'Bitangwa' },
      description: { en: 'Driver is on the way', rw: 'Umushoferi ari mu nzira' },
      icon: Truck,
      time: 'Est. 3:05 PM'
    },
    {
      key: 'delivered' as const,
      name: { en: 'Delivered', rw: 'Byatanzwe' },
      description: { en: 'Order has been delivered', rw: 'Ikurikira ryatanzwe' },
      icon: Check,
      time: ''
    }
  ];

  const getCurrentStatusIndex = () => {
    const statusKeys = orderStatuses.map(s => s.key);
    return statusKeys.indexOf(orderData.status);
  };

  const isStatusCompleted = (statusKey: OrderStatus) => {
    const statusIndex = orderStatuses.findIndex(s => s.key === statusKey);
    const currentIndex = getCurrentStatusIndex();
    return statusIndex <= currentIndex;
  };

  const isCurrentStatus = (statusKey: OrderStatus) => {
    return orderData.status === statusKey;
  };



  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  const getPaymentMethodIcon = (method: 'momo' | 'card' | 'cash') => {
    switch (method) {
      case 'momo': return Smartphone;
      case 'card': return CreditCard;
      case 'cash': return Banknote;
    }
  };

  const getPaymentMethodName = (method: 'momo' | 'card' | 'cash') => {
    switch (method) {
      case 'momo': return { en: 'Mobile Money (MoMo)', rw: 'Amafaranga ya Mobile (MoMo)' };
      case 'card': return { en: 'Credit/Debit Card', rw: 'Ikarita y\'Inguzanyo/Ubwishyu' };
      case 'cash': return { en: 'Cash on Delivery', rw: 'Amafaranga ku Gutanga' };
    }
  };

  const content = {
    en: {
      title: 'Order Tracking',
      orderId: 'Order ID',
      estimatedDelivery: 'Estimated Delivery',
      originalETA: 'Original ETA',
      cancelOrder: 'Cancel Order',
      contactVendor: 'Contact Restaurant',
      reportIssue: 'Report Issue',
      orderSummary: 'Order Summary',
      paymentMethod: 'Payment Method',
      transactionRef: 'Transaction Reference',
      total: 'Total',
      deliverTo: 'Deliver to',
      orderCancelled: 'Order Cancelled',
      cancelledDescription: 'Your order has been cancelled',
      reorder: 'Reorder',
      saveToFavorites: 'Save to Favorites',
      savedToFavorites: 'Saved to Favorites',
      chat: 'Chat',
      etaTooltip: 'ETA updated due to delays',
      viewLiveTracking: 'View Live Tracking',
      liveTrackingDesc: 'Real-time map & updates',
      viewFullMap: 'View Full Map',
      fullMapDesc: 'Immersive tracking experience',
      viewDroneTracking: 'Drone Tracking',
      droneTrackingDesc: 'Live drone feed & telemetry',
      droneDelivery: 'Drone Delivery',
      droneStatus: 'Drone Active'
    },
    rw: {
      title: 'Gukurikirana Ikurikira',
      orderId: 'Nomero y\'Ikurikira',
      estimatedDelivery: 'Igihe Giteganijwe cyo Gutanga',
      originalETA: 'Igihe cya Mbere Giteganijwe',
      cancelOrder: 'Kuraguza Ikurikira',
      contactVendor: 'Vugana n\'Ibibanza',
      reportIssue: 'Tanga Ikibazo',
      orderSummary: 'Incamake y\'Ikurikira',
      paymentMethod: 'Uburyo bwo Kwishura',
      transactionRef: 'Nomero y\'Ubwishyu',
      total: 'Byose',
      deliverTo: 'Gutangira',
      orderCancelled: 'Ikurikira Ryaracuzwe',
      cancelledDescription: 'Ikurikira ryawe ryaracuzwe',
      reorder: 'Ongera Ukurikire',
      saveToFavorites: 'Bika mu Byakunze',
      savedToFavorites: 'Byabitswe mu Byakunze',
      chat: 'Ikiganiro',
      etaTooltip: 'Igihe cyavuguruye kubera gutinda',
      viewLiveTracking: 'Reba Gukurikirana Mu Gihe Gikora',
      liveTrackingDesc: 'Ikarita n\'amakuru mu gihe gikora',
      viewFullMap: 'Reba Ikarita Yose',
      fullMapDesc: 'Ubunararibonye bwo gukurikirana',
      viewDroneTracking: 'Gukurikirana Drone',
      droneTrackingDesc: 'Kamera ya drone na amakuru mu gihe',
      droneDelivery: 'Gutwarwa na Drone',
      droneStatus: 'Drone Ikora'
    }
  };

  return (
    <TooltipProvider>
      <div className="h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-orange-100 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10 flex-shrink-0">
          <div className="flex items-center justify-between p-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{language === 'en' ? 'Back' : 'Subira'}</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-gray-800">{content[language].title}</h1>
              <p className="text-gray-600 text-sm">{content[language].orderId}: {orderData.id}</p>
            </div>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className="text-gray-600 hover:text-orange-500 transition-colors"
            >
              <Heart 
                className={`w-5 h-5 ${isSaved ? 'fill-orange-500 text-orange-500' : ''}`} 
              />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="px-6 py-6 pb-32">
            {/* Order Status Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20 mb-6">
              {orderData.status === 'cancelled' ? (
                /* Cancelled Order State */
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <X className="w-6 h-6 text-red-500" />
                  </div>
                  <h2 className="text-gray-800 mb-2 text-lg">{content[language].orderCancelled}</h2>
                  <p className="text-gray-600 mb-4 text-sm">{content[language].cancelledDescription}</p>
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 py-2"
                    onClick={() => alert(language === 'en' ? 'Redirecting to menu...' : 'Guhindukira ku rutonde...')}
                  >
                    {content[language].reorder}
                  </Button>
                </div>
              ) : (
                /* Active Order Timeline - Horizontal Layout */
                <>
                  {/* Enhanced ETA with Dynamic Updates */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-gray-600 text-sm">{content[language].estimatedDelivery}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-800 font-medium">{orderData.estimatedDelivery}</p>
                        {orderData.etaUpdateReason && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-orange-500" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-60 bg-white/95 backdrop-blur-sm border border-orange-200">
                                <p className="text-sm">{orderData.etaUpdateReason[language]}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      {orderData.originalETA && orderData.etaUpdateReason && (
                        <p className="text-gray-500 text-xs mt-1 line-through">
                          {content[language].originalETA}: {orderData.originalETA}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-orange-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">{orderData.orderTime}</span>
                    </div>
                  </div>

                  {/* Delivery Method Indicator */}
                  {orderData.deliveryMethod === 'drone' && (
                    <div className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-2">
                          <Plane className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{content[language].droneDelivery}</p>
                          <p className="text-xs text-gray-600">{content[language].droneStatus}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vertical Timeline */}
                  <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 rounded-full" />
                    
                    {/* Timeline Items */}
                    <div className="space-y-6">
                      {orderStatuses.map((status, index) => {
                        const IconComponent = status.icon;
                        const isCompleted = isStatusCompleted(status.key);
                        const isCurrent = isCurrentStatus(status.key);

                        return (
                          <div key={status.key} className="flex items-start gap-4 relative">
                            {/* Timeline Icon */}
                            <div className={`
                              w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300
                              ${isCompleted 
                                ? 'bg-orange-500 text-white shadow-md' 
                                : 'bg-gray-200 text-gray-400'
                              }
                              ${isCurrent ? 'ring-4 ring-orange-200 animate-pulse' : ''}
                            `}>
                              <IconComponent className="w-5 h-5" />
                            </div>

                            {/* Status Content */}
                            <div className="flex-1 pb-6">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className={`font-medium ${
                                  isCompleted ? 'text-gray-800' : 'text-gray-500'
                                }`}>
                                  {status.name[language]}
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  isCompleted ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {status.time}
                                </span>
                              </div>
                              <p className={`text-sm ${
                                isCompleted ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                {status.description[language]}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Review Prompt Modal - Shows when order is delivered */}
            <ReviewPrompt
              isVisible={showReviewPrompt}
              language={language}
              vendorName={orderData.vendorName}
              onWriteReview={handleWriteReview}
              onQuickRating={handleQuickRating}
              onDismiss={() => setShowReviewPrompt(false)}
            />

            {/* Reviews Modal */}
            <ReviewsModal 
              isOpen={showReviewsModal}
              onClose={() => setShowReviewsModal(false)}
              language={language}
              vendorName={orderData.vendorName}
              vendorId="mock-vendor-id"
              vendorRating={4.8}
              totalReviews={156}
              reviews={[]}
              onSubmitReview={(reviewData) => {
                console.log('Review submitted from order tracking:', reviewData);
                // Here you would send the review to your backend
              }}
            />

            {/* Action Buttons */}
            {orderData.status !== 'cancelled' && (
              <div className="space-y-4 mb-6">
                {/* Cancel Button - Only show when order is placed */}
                {orderData.status === 'placed' && (
                  <Button 
                    variant="outline"
                    className="w-full h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                    onClick={handleCancelOrder}
                  >
                    <X className="w-4 h-4 mr-2" />
                    {content[language].cancelOrder}
                  </Button>
                )}

                {/* Live Tracking Buttons - Show for active orders */}
                {(orderData.status === 'preparing' || orderData.status === 'out-for-delivery') && (
                  <div className="space-y-3">
                    {/* Enhanced Tracking Modal Button */}
                    {onOpenEnhancedTracking && (
                      <Button 
                        className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center gap-2"
                        onClick={() => onOpenEnhancedTracking({
                          id: orderData.id,
                          items: orderData.items.map(item => ({
                            id: Math.random().toString(),
                            name: item.name[language],
                            price: item.price,
                            quantity: item.quantity,
                            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
                            vendorId: 'vendor-1',
                            vendorName: orderData.vendorName
                          })),
                          total: orderData.total,
                          status: orderData.status,
                          vendorName: orderData.vendorName,
                          deliveryAddress: orderData.address,
                          createdAt: new Date().toISOString(),
                          estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000).toISOString()
                        })}
                      >
                        <Navigation className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{content[language].viewLiveTracking}</div>
                          <div className="text-xs opacity-90">{content[language].liveTrackingDesc}</div>
                        </div>
                      </Button>
                    )}

                    {/* Drone Tracking Button - Show only for drone deliveries */}
                    {orderData.deliveryMethod === 'drone' && onOpenDroneTracking && (
                      <Button 
                        className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl flex items-center justify-center gap-2"
                        onClick={() => onOpenDroneTracking({
                          id: orderData.id,
                          items: orderData.items.map(item => ({
                            id: Math.random().toString(),
                            name: item.name[language],
                            price: item.price,
                            quantity: item.quantity,
                            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
                            vendorId: 'vendor-1',
                            vendorName: orderData.vendorName
                          })),
                          total: orderData.total,
                          status: orderData.status,
                          vendorName: orderData.vendorName,
                          deliveryAddress: orderData.address,
                          createdAt: new Date().toISOString(),
                          estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000).toISOString()
                        })}
                      >
                        <Plane className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{content[language].viewDroneTracking}</div>
                          <div className="text-xs opacity-90">{content[language].droneTrackingDesc}</div>
                        </div>
                      </Button>
                    )}


                  </div>
                )}

                {/* Contact & Support Actions */}
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline"
                    className="h-12 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl flex flex-col gap-1 p-2"
                    onClick={() => window.open(`tel:${orderData.vendorPhone}`)}
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-xs">{language === 'en' ? 'Call' : 'Hamagara'}</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="h-12 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl flex flex-col gap-1 p-2"
                    onClick={() => alert(language === 'en' ? 'Opening chat with driver...' : 'Gufungura ikiganiro n\'umushoferi...')}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs">{language === 'en' ? 'Chat' : 'Ganira'}</span>
                  </Button>

                  <Button 
                    variant="outline"
                    className="h-12 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl flex flex-col gap-1 p-2"
                    onClick={() => alert(language === 'en' ? 'Opening issue report form...' : 'Gufungura ifishi yo gutanga ikibazo...')}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs">{content[language].reportIssue}</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 mb-6">
              <h3 className="text-gray-800 mb-4">{content[language].orderSummary}</h3>
              
              <div className="space-y-3 mb-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex-1">
                      <span className="text-gray-800">{item.name[language]}</span>
                      <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                    </div>
                    <span className="text-gray-600">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-medium">{content[language].total}</span>
                  <span className="text-orange-600 font-semibold">{formatPrice(orderData.total)}</span>
                </div>
              </div>

              {/* Payment Method & Transaction Reference */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">{content[language].paymentMethod}</span>
                  <div className="flex items-center gap-2">
                    {React.createElement(getPaymentMethodIcon(orderData.paymentMethod), { 
                      className: "w-4 h-4 text-gray-500" 
                    })}
                    <span className="text-gray-800 text-sm">
                      {getPaymentMethodName(orderData.paymentMethod)[language]}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">{content[language].transactionRef}</span>
                  <span className="text-gray-800 text-sm font-mono">{orderData.transactionRef}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-orange-500" />
                <h3 className="text-gray-800">{content[language].deliverTo}</h3>
              </div>
              <p className="text-gray-600 text-sm ml-8">{orderData.address}</p>
            </div>

            {/* Save to Favorites */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
              <Button 
                variant="outline"
                className={`w-full h-12 border-2 rounded-xl transition-all duration-200 ${
                  isSaved 
                    ? 'border-orange-200 bg-orange-50 text-orange-600' 
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsSaved(!isSaved)}
              >
                <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-orange-500 text-orange-500' : ''}`} />
                {isSaved ? content[language].savedToFavorites : content[language].saveToFavorites}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}