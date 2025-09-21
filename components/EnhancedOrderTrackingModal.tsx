import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  Clock, 
  Truck, 
  Package, 
  Check, 
  Phone, 
  MessageSquare,
  Navigation,
  Timer,
  Utensils,
  Home,
  Zap,
  ChefHat,
  User,
  Plus,
  Minus
} from 'lucide-react';
import type { Order } from './types';

interface EnhancedOrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  language: 'en' | 'rw';
  onOpenLiveMap?: (order: Order) => void;
}

interface TrackingData {
  driverLocation: { lat: number; lng: number; name: string };
  restaurantLocation: { lat: number; lng: number; name: string };
  customerLocation: { lat: number; lng: number; name: string };
  estimatedArrival: Date;
  currentStatus: 'preparing' | 'ready' | 'picked-up' | 'out-for-delivery' | 'nearby' | 'delivered';
  driverInfo: {
    name: string;
    phone: string;
    rating: number;
    vehicleType: 'drone' | 'bike' | 'car';
    vehicleNumber: string;
  };
  timeline: Array<{
    status: string;
    time: Date;
    completed: boolean;
    estimated?: boolean;
  }>;
}

const mockTrackingData: TrackingData = {
  driverLocation: { lat: -1.9441, lng: 30.0619, name: "KN 5 Rd, Kigali" },
  restaurantLocation: { lat: -1.9506, lng: 30.0588, name: "Heaven Restaurant, Kacyiru" },
  customerLocation: { lat: -1.9395, lng: 30.0644, name: "Your Location" },
  estimatedArrival: new Date(Date.now() + 12 * 60 * 1000), // 12 minutes from now
  currentStatus: 'out-for-delivery',
  driverInfo: {
    name: 'Jean Claude',
    phone: '+250 788 123 456',
    rating: 4.8,
    vehicleType: 'drone',
    vehicleNumber: 'DG-DRONE-001'
  },
  timeline: [
    { status: 'placed', time: new Date(Date.now() - 25 * 60 * 1000), completed: true },
    { status: 'confirmed', time: new Date(Date.now() - 22 * 60 * 1000), completed: true },
    { status: 'preparing', time: new Date(Date.now() - 20 * 60 * 1000), completed: true },
    { status: 'ready', time: new Date(Date.now() - 8 * 60 * 1000), completed: true },
    { status: 'picked-up', time: new Date(Date.now() - 5 * 60 * 1000), completed: true },
    { status: 'out-for-delivery', time: new Date(Date.now() - 2 * 60 * 1000), completed: true },
    { status: 'nearby', time: new Date(Date.now() + 2 * 60 * 1000), completed: false, estimated: true },
    { status: 'delivered', time: new Date(Date.now() + 12 * 60 * 1000), completed: false, estimated: true }
  ]
};

export function EnhancedOrderTrackingModal({ 
  isOpen, 
  onClose, 
  order, 
  language,
  onOpenLiveMap 
}: EnhancedOrderTrackingModalProps) {
  const [trackingData, setTrackingData] = useState<TrackingData>(mockTrackingData);
  const [currentTime, setCurrentTime] = useState(new Date());

  const content = {
    en: {
      title: 'Live Order Tracking',
      estimatedArrival: 'Estimated Arrival',
      driverInfo: 'Driver Information',
      orderProgress: 'Order Progress',
      contactDriver: 'Contact Driver',
      chatDriver: 'Chat with Driver',
      viewFullMap: 'View Full Map',
      minutes: 'min',
      rating: 'Rating',
      vehicleNumber: 'Vehicle ID',
      timeline: {
        placed: 'Order Placed',
        confirmed: 'Order Confirmed',
        preparing: 'Preparing Your Food',
        ready: 'Ready for Pickup',
        'picked-up': 'Order Picked Up',
        'out-for-delivery': 'Out for Delivery',
        nearby: 'Driver Nearby',
        delivered: 'Order Delivered'
      },
      vehicleTypes: {
        drone: 'Delivery Drone',
        bike: 'Motorcycle',
        car: 'Car'
      },
      liveUpdates: 'Live Updates',
      trackingId: 'Tracking ID',
      arriving: 'Arriving in',
      onTheWay: 'Your order is on the way!',
      viewFullMap: 'View Full Map',
      fullMapDesc: 'Immersive tracking experience'
    },
    rw: {
      title: 'Gukurikirana Ibisabwa Mu Gihe Gikora',
      estimatedArrival: 'Igihe Gitegerejwe',
      driverInfo: 'Amakuru y\'Umushoferi',
      orderProgress: 'Uko Ibisabwa Bigenda',
      contactDriver: 'Hamagara Umushoferi',
      chatDriver: 'Ganira n\'Umushoferi',
      viewFullMap: 'Reba Ikarita Yose',
      minutes: 'iminota',
      rating: 'Amanota',
      vehicleNumber: 'Nomero y\'Ikinyabiziga',
      timeline: {
        placed: 'Byasabwe',
        confirmed: 'Byemejwe',
        preparing: 'Birateguwe',
        ready: 'Biteguye',
        'picked-up': 'Byafashwe',
        'out-for-delivery': 'Birasohokeje',
        nearby: 'Umushoferi Ari Hafi',
        delivered: 'Byatanzwe'
      },
      vehicleTypes: {
        drone: 'Drone yo Gutanga',
        bike: 'Pikipiki',
        car: 'Imodoka'
      },
      liveUpdates: 'Amakuru Mu Gihe Gikora',
      trackingId: 'Nomero yo Gukurikirana',
      arriving: 'Bizagera mu',
      onTheWay: 'Ibisabwa byawe biri mu nzira!',
      viewFullMap: 'Reba Ikarita Yose',
      fullMapDesc: 'Ubunararibonye bwo gukurikirana'
    }
  };

  // Simulate live updates
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate driver movement (for demo purposes)
      setTrackingData(prev => ({
        ...prev,
        driverLocation: {
          ...prev.driverLocation,
          lat: prev.driverLocation.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.driverLocation.lng + (Math.random() - 0.5) * 0.001
        },
        estimatedArrival: new Date(Date.now() + Math.max(5, 12 - Math.floor(Math.random() * 2)) * 60 * 1000)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const getTimeUntilArrival = () => {
    const diff = trackingData.estimatedArrival.getTime() - currentTime.getTime();
    const minutes = Math.max(0, Math.floor(diff / 60000));
    return minutes;
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    const iconClass = `w-4 h-4 ${completed ? 'text-white' : 'text-gray-400'}`;
    
    switch (status) {
      case 'placed': return <Package className={iconClass} />;
      case 'confirmed': return <Check className={iconClass} />;
      case 'preparing': return <ChefHat className={iconClass} />;
      case 'ready': return <Utensils className={iconClass} />;
      case 'picked-up': return <User className={iconClass} />;
      case 'out-for-delivery': return <Truck className={iconClass} />;
      case 'nearby': return <MapPin className={iconClass} />;
      case 'delivered': return <Home className={iconClass} />;
      default: return <Clock className={iconClass} />;
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'drone': return <Zap className="w-5 h-5 text-orange-500" />;
      case 'bike': return <Truck className="w-5 h-5 text-orange-500" />;
      case 'car': return <Truck className="w-5 h-5 text-orange-500" />;
      default: return <Truck className="w-5 h-5 text-orange-500" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  if (!isOpen) return null;

  const minutesUntilArrival = getTimeUntilArrival();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white/95 backdrop-blur-md rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{content[language].title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 p-2 h-auto rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* ETA Display */}
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5" />
                    <div>
                      <div className="text-2xl font-bold">
                        {minutesUntilArrival} {content[language].minutes}
                      </div>
                      <div className="text-sm opacity-90">
                        {content[language].arriving}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm opacity-90">{content[language].onTheWay}</div>
                  <div className="text-lg font-semibold">Order #{order.id}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto custom-scrollbar">
            
            {/* Enhanced Interactive Map */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden relative h-80 border border-white/10">
              {/* Map Header */}
              <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="w-5 h-5 text-green-400" />
                    <span className="font-medium text-sm">Live Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-white text-xs font-medium">LIVE</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-auto p-2 rounded-full">
                      <Navigation className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Map Grid Background */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                  backgroundImage: `
                    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }} />
              </div>

              {/* Animated Route Path */}
              <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 400 320">
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Main Route Path */}
                <motion.path
                  d="M 80 100 Q 200 50 320 160 Q 350 200 320 250"
                  stroke="url(#routeGradient)"
                  strokeWidth="4"
                  fill="none"
                  filter="url(#glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                
                {/* Animated Route Progress */}
                <motion.circle
                  r="6"
                  fill="#f97316"
                  filter="url(#glow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <animateMotion
                    dur="8s"
                    repeatCount="indefinite"
                    begin="1s"
                  >
                    <mpath href="#routePath" />
                  </animateMotion>
                </motion.circle>
                
                <path
                  id="routePath"
                  d="M 80 100 Q 200 50 320 160 Q 350 200 320 250"
                  fill="none"
                />
              </svg>

              {/* Map Locations */}
              <div className="absolute inset-0 z-15">
                {/* Restaurant Location */}
                <motion.div 
                  className="absolute"
                  style={{ left: '60px', top: '80px' }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                      <Utensils className="w-6 h-6 text-white" />
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-green-400 rounded-full opacity-30"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                      {order.vendorName}
                    </div>
                  </div>
                </motion.div>

                {/* Driver Location with Dynamic Movement */}
                <motion.div 
                  className="absolute z-20"
                  style={{ left: '240px', top: '140px' }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    x: [0, 5, -3, 8, 0],
                    y: [0, -2, 4, -1, 0]
                  }}
                  transition={{ 
                    scale: { delay: 1, type: "spring" },
                    opacity: { delay: 1 },
                    x: { duration: 6, repeat: Infinity },
                    y: { duration: 6, repeat: Infinity, delay: 1 }
                  }}
                >
                  <div className="relative">
                    <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white relative overflow-hidden">
                      {getVehicleIcon(trackingData.driverInfo.vehicleType)}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-20"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-orange-400 rounded-full opacity-20"
                      animate={{ scale: [1, 1.8, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        {trackingData.driverInfo.name}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Customer Location */}
                <motion.div 
                  className="absolute"
                  style={{ left: '300px', top: '230px' }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5, type: "spring" }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-blue-400 rounded-full opacity-30"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                      Your Location
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Map Controls */}
              <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
                <Button variant="ghost" size="sm" className="w-10 h-10 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full p-0">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="w-10 h-10 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full p-0">
                  <Minus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="w-10 h-10 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full p-0">
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>

              {/* ETA Overlay */}
              <div className="absolute bottom-4 left-4 z-20">
                <div className="bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-orange-500" />
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {minutesUntilArrival} {content[language].minutes}
                      </div>
                      <div className="text-xs text-gray-600">ETA</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Distance Info */}
              <div className="absolute top-16 left-4 z-20">
                <div className="bg-white/90 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20 shadow-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="text-sm font-semibold text-gray-800">2.3 km</div>
                      <div className="text-xs text-gray-600">Distance</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Map Button */}
              {onOpenLiveMap && (
                <div className="absolute top-16 right-4 z-20">
                  <Button
                    onClick={() => onOpenLiveMap(order)}
                    className="bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 hover:text-gray-900 border border-white/20 shadow-lg rounded-xl h-auto px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4" />
                      <div className="text-left">
                        <div className="text-xs font-medium">{content[language].viewFullMap}</div>
                        <div className="text-xs opacity-75">{content[language].fullMapDesc}</div>
                      </div>
                    </div>
                  </Button>
                </div>
              )}
            </div>

            {/* Driver Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <h3 className="font-semibold text-gray-800 mb-3">{content[language].driverInfo}</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                  {trackingData.driverInfo.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{trackingData.driverInfo.name}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    {getVehicleIcon(trackingData.driverInfo.vehicleType)}
                    <span>{content[language].vehicleTypes[trackingData.driverInfo.vehicleType]}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    ⭐ {trackingData.driverInfo.rating} • {trackingData.driverInfo.vehicleNumber}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 px-3 rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 px-3 rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Animated Timeline */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <h3 className="font-semibold text-gray-800 mb-4">{content[language].orderProgress}</h3>
              <div className="space-y-4">
                {trackingData.timeline.map((step, index) => (
                  <motion.div
                    key={step.status}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="relative">
                      <motion.div
                        animate={step.completed ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          step.completed 
                            ? 'bg-orange-500 border-orange-500' 
                            : step.estimated
                            ? 'bg-gray-100 border-gray-300'
                            : 'bg-orange-100 border-orange-300'
                        }`}
                      >
                        {getStatusIcon(step.status, step.completed)}
                      </motion.div>
                      {index < trackingData.timeline.length - 1 && (
                        <div className={`absolute top-10 left-5 w-0.5 h-6 ${
                          step.completed ? 'bg-orange-300' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        step.completed ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {content[language].timeline[step.status as keyof typeof content[typeof language]['timeline']]}
                      </div>
                      <div className="text-sm text-gray-500">
                        {step.estimated ? 'Est. ' : ''}{formatTime(step.time)}
                      </div>
                    </div>
                    {step.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{item.price.toLocaleString()} RWF</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{order.total.toLocaleString()} RWF</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}