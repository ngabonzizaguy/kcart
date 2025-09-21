import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft,
  MapPin, 
  Navigation,
  Timer,
  Utensils,
  Home,
  Zap,
  Truck,
  User,
  Plus,
  Minus,
  Phone,
  MessageSquare,
  Maximize2,
  Info,
  Route,
  Clock,
  Locate,
  Share,
  Plane,
  Battery,
  Signal,
  Mountain,
  Gauge,
  Wind,
  Thermometer,
  Eye
} from 'lucide-react';
import type { Order } from './types';

interface LiveTrackingMapProps {
  order: Order;
  language: 'en' | 'rw';
  onBack: () => void;
  isDroneDelivery?: boolean; // Flag to show drone-specific features
}

interface MapTrackingData {
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
  route: {
    distance: string;
    duration: string;
    traffic: 'light' | 'moderate' | 'heavy';
  };
}

const mockMapData: MapTrackingData = {
  driverLocation: { lat: -1.9441, lng: 30.0619, name: "KN 5 Rd, Kigali" },
  restaurantLocation: { lat: -1.9506, lng: 30.0588, name: "Heaven Restaurant, Kacyiru" },
  customerLocation: { lat: -1.9395, lng: 30.0644, name: "Your Location" },
  estimatedArrival: new Date(Date.now() + 12 * 60 * 1000),
  currentStatus: 'out-for-delivery',
  driverInfo: {
    name: 'Jean Claude',
    phone: '+250 788 123 456',
    rating: 4.8,
    vehicleType: 'drone',
    vehicleNumber: 'DG-DRONE-001'
  },
  route: {
    distance: '2.3 km',
    duration: '12 min',
    traffic: 'light'
  }
};

// Professional drone telemetry data for enhanced map view
interface DroneTelemetryData {
  altitude: number; // meters
  speed: number; // m/s
  battery: number; // percentage
  signalStrength: number; // percentage
  temperature: number; // celsius
  windSpeed: number; // km/h
  windDirection: string;
  heading: number; // degrees
  gpsAccuracy: number; // meters
  flightTime: number; // seconds
  maxAltitude: number; // meters
  homeDistance: number; // meters
}

const mockDroneTelemetry: DroneTelemetryData = {
  altitude: 85,
  speed: 12,
  battery: 78,
  signalStrength: 95,
  temperature: 24,
  windSpeed: 8,
  windDirection: 'NE',
  heading: 245,
  gpsAccuracy: 2.5,
  flightTime: 420,
  maxAltitude: 120,
  homeDistance: 180
};

/**
 * LiveTrackingMap - Full-screen immersive map tracking experience
 * 
 * Features:
 * - Beautiful animated map visualization
 * - Real-time driver location updates
 * - Interactive route display with traffic info
 * - Live ETA updates with traffic considerations
 * - Driver contact integration
 * - Mobile-optimized controls and gestures
 * 
 * Props:
 * - order: Order data for tracking
 * - language: 'en' | 'rw' - Current app language
 * - onBack: () => void - Navigate back to previous screen
 * 
 * TODO: Integrate with real map service (Google Maps, Mapbox, etc.)
 * TODO: Add real-time GPS tracking
 * TODO: Connect to traffic data API
 */
export function LiveTrackingMap({ order, language, onBack, isDroneDelivery = false }: LiveTrackingMapProps) {
  const [mapData, setMapData] = useState<MapTrackingData>(mockMapData);
  const [droneTelemetry, setDroneTelemetry] = useState<DroneTelemetryData>(mockDroneTelemetry);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showDroneStats, setShowDroneStats] = useState(isDroneDelivery);

  const content = {
    en: {
      title: isDroneDelivery ? 'Drone Flight Map' : 'Live Tracking',
      backToOrder: 'Back to Order',
      eta: 'ETA',
      distance: 'Distance',
      traffic: 'Traffic',
      route: 'Route',
      driver: isDroneDelivery ? 'Drone Pilot' : 'Driver',
      restaurant: 'Restaurant',
      destination: 'Your Location',
      minutes: 'min',
      contactDriver: isDroneDelivery ? 'Contact Pilot' : 'Contact Driver',
      shareLocation: 'Share Location',
      toggleFullscreen: 'Toggle Fullscreen',
      centerMap: 'Center Map',
      traffic_light: 'Light traffic',
      traffic_moderate: 'Moderate traffic',
      traffic_heavy: 'Heavy traffic',
      arriving: 'Arriving in',
      // Drone-specific content
      droneStats: 'Flight Stats',
      altitude: 'Altitude',
      speed: 'Speed',
      battery: 'Battery',
      signal: 'Signal',
      temperature: 'Temperature',
      wind: 'Wind',
      heading: 'Heading',
      gpsAccuracy: 'GPS Accuracy',
      flightTime: 'Flight Time',
      homeDistance: 'Distance to Base',
      toggleStats: 'Toggle Stats',
      units: {
        meters: 'm',
        meterPerSecond: 'm/s',
        celsius: '°C',
        kmPerHour: 'km/h',
        degrees: '°',
        seconds: 's'
      }
    },
    rw: {
      title: isDroneDelivery ? 'Ikarita ya Drone' : 'Gukurikirana Mu Gihe Gikora',
      backToOrder: 'Subira ku Kurikira',
      eta: 'Igihe',
      distance: 'Intera',
      traffic: 'Ubwato',
      route: 'Inzira',
      driver: isDroneDelivery ? 'Uwayobora Drone' : 'Umushoferi',
      restaurant: 'Ibibanza',
      destination: 'Aho Uba',
      minutes: 'iminota',
      contactDriver: isDroneDelivery ? 'Hamagara Uwayobora' : 'Hamagara Umushoferi',
      shareLocation: 'Sangira Aho Uba',
      toggleFullscreen: 'Hindura Ingingo',
      centerMap: 'Shyira Ikarita Hagati',
      traffic_light: 'Ubwato buke',
      traffic_moderate: 'Ubwato bwo hagati',
      traffic_heavy: 'Ubwato bunini',
      arriving: 'Bizagera mu',
      // Drone-specific content
      droneStats: 'Amakuru ya Drone',
      altitude: 'Uburebure',
      speed: 'Umuvuduko',
      battery: 'Batiri',
      signal: 'Ikimenyetso',
      temperature: 'Ubushyuhe',
      wind: 'Umuyaga',
      heading: 'Icyerekezo',
      gpsAccuracy: 'Ukuri kwa GPS',
      flightTime: 'Igihe cyo Guhaguruka',
      homeDistance: 'Intera ku Gisoko',
      toggleStats: 'Hindura Amakuru',
      units: {
        meters: 'm',
        meterPerSecond: 'm/s',
        celsius: '°C',
        kmPerHour: 'km/h',
        degrees: '°',
        seconds: 's'
      }
    }
  };

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate driver/drone movement
      setMapData(prev => ({
        ...prev,
        driverLocation: {
          ...prev.driverLocation,
          lat: prev.driverLocation.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.driverLocation.lng + (Math.random() - 0.5) * 0.001
        },
        estimatedArrival: new Date(Date.now() + Math.max(5, 12 - Math.floor(Math.random() * 2)) * 60 * 1000)
      }));

      // Simulate drone telemetry updates if it's a drone delivery
      if (isDroneDelivery) {
        setDroneTelemetry(prev => ({
          ...prev,
          altitude: Math.max(60, Math.min(120, prev.altitude + (Math.random() - 0.5) * 4)),
          speed: Math.max(8, Math.min(15, prev.speed + (Math.random() - 0.5) * 2)),
          battery: Math.max(50, prev.battery - 0.1),
          signalStrength: Math.max(85, Math.min(100, prev.signalStrength + (Math.random() - 0.5) * 5)),
          temperature: Math.max(20, Math.min(30, prev.temperature + (Math.random() - 0.5) * 2)),
          windSpeed: Math.max(5, Math.min(15, prev.windSpeed + (Math.random() - 0.5) * 2)),
          heading: (prev.heading + (Math.random() - 0.5) * 10) % 360,
          flightTime: prev.flightTime + 3,
          homeDistance: Math.max(100, prev.homeDistance - 2)
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isDroneDelivery]);

  const getTimeUntilArrival = () => {
    const diff = mapData.estimatedArrival.getTime() - currentTime.getTime();
    const minutes = Math.max(0, Math.floor(diff / 60000));
    return minutes;
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'drone': return <Zap className="w-6 h-6 text-white" />;
      case 'bike': return <Truck className="w-6 h-6 text-white" />;
      case 'car': return <Truck className="w-6 h-6 text-white" />;
      default: return <Truck className="w-6 h-6 text-white" />;
    }
  };

  const getTrafficColor = (traffic: string) => {
    switch (traffic) {
      case 'light': return 'text-green-500';
      case 'moderate': return 'text-yellow-500';
      case 'heavy': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const formatFlightTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBatteryColor = (percentage: number) => {
    if (percentage > 60) return 'bg-green-400';
    if (percentage > 30) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const getSignalBars = (strength: number) => {
    return Math.ceil(strength / 20); // Convert percentage to 1-5 bars
  };

  const minutesUntilArrival = getTimeUntilArrival();

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-[60]' : 'fixed inset-0 z-[60]'} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col`}>
      {/* Header */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-6 pt-8"
          >
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white hover:bg-white/20 rounded-xl p-2 h-auto"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {content[language].backToOrder}
              </Button>
              
              <div className="text-center">
                <h1 className="text-white text-lg font-bold">{content[language].title}</h1>
                <p className="text-white/80 text-sm">Order #{order.id}</p>
              </div>
              
              <Button
                variant="ghost"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-white hover:bg-white/20 rounded-xl p-2 h-auto"
              >
                <Maximize2 className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Map Area */}
      <div 
        className="flex-1 relative overflow-hidden"
        onClick={() => setShowControls(!showControls)}
      >
        {/* Map Grid Background with Animation */}
        <div className="absolute inset-0">
          <motion.div 
            className="w-full h-full opacity-20"
            animate={{ backgroundPosition: ['0px 0px', '80px 80px'] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px'
            }} 
          />
        </div>

        {/* Animated Route Visualization */}
        <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main Route Path */}
          <motion.path
            d="M 20 25 Q 50 15 80 40 Q 85 60 80 75"
            stroke="url(#routeGradient)"
            strokeWidth="0.8"
            fill="none"
            filter="url(#glow)"
            strokeDasharray="2,1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          
          {/* Traffic Flow Animation */}
          <motion.path
            d="M 20 25 Q 50 15 80 40 Q 85 60 80 75"
            stroke="#ffffff"
            strokeWidth="0.3"
            fill="none"
            strokeDasharray="1,2"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -10 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        {/* Dynamic Map Locations */}
        <div className="absolute inset-0 z-15">
          {/* Restaurant Location */}
          <motion.div 
            className="absolute"
            style={{ left: '15%', top: '20%' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <div className="relative">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white relative overflow-hidden">
                <Utensils className="w-8 h-8 text-white" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-300 to-green-400 opacity-30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <motion.div
                className="absolute inset-0 bg-green-400 rounded-full opacity-20"
                animate={{ scale: [1, 2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap shadow-xl">
                <div className="text-center">
                  <div className="font-bold">{content[language].restaurant}</div>
                  <div className="text-xs opacity-90">{order.vendorName}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Driver Location with Enhanced Animation */}
          <motion.div 
            className="absolute z-20"
            style={{ left: '60%', top: '45%' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: [0, 10, -5, 15, 0],
              y: [0, -5, 8, -3, 0]
            }}
            transition={{ 
              scale: { delay: 1, type: "spring" },
              opacity: { delay: 1 },
              x: { duration: 8, repeat: Infinity },
              y: { duration: 8, repeat: Infinity, delay: 2 }
            }}
          >
            <div className="relative">
              <div className="w-18 h-18 bg-orange-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white relative overflow-hidden">
                {getVehicleIcon(mapData.driverInfo.vehicleType)}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 opacity-30"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <motion.div
                className="absolute inset-0 bg-orange-400 rounded-full opacity-20"
                animate={{ scale: [1, 2.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shadow-xl">
                <div className="text-center">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="font-bold">{mapData.driverInfo.name}</span>
                  </div>
                  <div className="text-xs opacity-90">{content[language].driver}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Customer Location */}
          <motion.div 
            className="absolute"
            style={{ left: '75%', top: '70%' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, type: "spring" }}
          >
            <div className="relative">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white relative overflow-hidden">
                <Home className="w-8 h-8 text-white" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 opacity-30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <motion.div
                className="absolute inset-0 bg-blue-400 rounded-full opacity-20"
                animate={{ scale: [1, 1.8, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap shadow-xl">
                <div className="text-center">
                  <div className="font-bold">{content[language].destination}</div>
                  <div className="text-xs opacity-90">You</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Info Cards */}
        <AnimatePresence>
          {showControls && (
            <>
              {/* ETA Card */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                className="absolute top-24 left-6 z-20"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <Timer className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">
                        {minutesUntilArrival} {content[language].minutes}
                      </div>
                      <div className="text-sm text-gray-600">{content[language].arriving}</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Route Info Card */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                className="absolute top-24 right-6 z-20"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Route className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600">{content[language].distance}</span>
                      <span className="text-sm font-bold text-gray-800">{mapData.route.distance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">{content[language].route}</span>
                      <span className="text-sm font-bold text-gray-800">{mapData.route.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className={`w-4 h-4 ${getTrafficColor(mapData.route.traffic)}`} />
                      <span className="text-sm text-gray-600">{content[language].traffic}</span>
                      <span className={`text-sm font-bold ${getTrafficColor(mapData.route.traffic)}`}>
                        {content[language][`traffic_${mapData.route.traffic}` as keyof typeof content[typeof language]]}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pb-8"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Contact Driver */}
              <div className="flex gap-2">
                <Button
                  className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-xl h-12 px-4"
                  onClick={() => window.open(`tel:${mapData.driverInfo.phone}`)}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {content[language].contactDriver}
                </Button>
                <Button
                  variant="ghost"
                  className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-xl h-12 px-4"
                  onClick={() => alert('Opening chat...')}
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </div>

              {/* Map Controls */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-xl h-12 px-4"
                  onClick={() => alert('Centering map...')}
                >
                  <Locate className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-xl h-12 px-4"
                  onClick={() => alert('Sharing location...')}
                >
                  <Share className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Drone Telemetry Panel */}
      {isDroneDelivery && (
        <AnimatePresence>
          {showDroneStats && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="absolute top-32 right-6 z-30 w-80 max-w-[calc(100vw-3rem)]"
            >
              <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plane className="w-5 h-5 text-white" />
                      <span className="text-white font-bold">{content[language].droneStats}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDroneStats(false)}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Telemetry Grid */}
                <div className="p-4 space-y-4">
                  {/* Primary Stats Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Mountain className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-xs">{content[language].altitude}</span>
                      </div>
                      <div className="text-white text-xl font-bold">
                        {Math.round(droneTelemetry.altitude)}{content[language].units.meters}
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Gauge className="w-4 h-4 text-orange-400" />
                        <span className="text-white text-xs">{content[language].speed}</span>
                      </div>
                      <div className="text-white text-xl font-bold">
                        {Math.round(droneTelemetry.speed)}{content[language].units.meterPerSecond}
                      </div>
                    </div>
                  </div>

                  {/* Power & Signal Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Battery className="w-4 h-4 text-green-400" />
                        <span className="text-white text-xs">{content[language].battery}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-white text-lg font-bold">
                          {Math.round(droneTelemetry.battery)}%
                        </div>
                        <div className="flex-1 bg-white/20 rounded-full h-2">
                          <motion.div
                            className={`${getBatteryColor(droneTelemetry.battery)} h-2 rounded-full`}
                            style={{ width: `${droneTelemetry.battery}%` }}
                            animate={{ width: `${droneTelemetry.battery}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Signal className="w-4 h-4 text-green-400" />
                        <span className="text-white text-xs">{content[language].signal}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-white text-lg font-bold">
                          {Math.round(droneTelemetry.signalStrength)}%
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((bar) => (
                            <div
                              key={bar}
                              className={`w-1 h-3 rounded-full ${
                                bar <= getSignalBars(droneTelemetry.signalStrength) 
                                  ? 'bg-green-400' 
                                  : 'bg-white/20'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Environmental Conditions */}
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Wind className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-xs font-medium">Environmental</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="text-center">
                        <div className="text-white/60">Temp</div>
                        <div className="text-white font-bold">
                          {Math.round(droneTelemetry.temperature)}{content[language].units.celsius}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-white/60">Wind</div>
                        <div className="text-white font-bold">
                          {Math.round(droneTelemetry.windSpeed)}{content[language].units.kmPerHour}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-white/60">Dir</div>
                        <div className="text-white font-bold">{droneTelemetry.windDirection}</div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Data */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-white/10 rounded-xl p-3">
                      <div className="text-white/60 mb-1">Heading</div>
                      <div className="text-white font-bold">
                        {Math.round(droneTelemetry.heading)}{content[language].units.degrees}
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                      <div className="text-white/60 mb-1">GPS Acc</div>
                      <div className="text-white font-bold">
                        {droneTelemetry.gpsAccuracy}{content[language].units.meters}
                      </div>
                    </div>
                  </div>

                  {/* Flight Time */}
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white/60 text-xs">Flight Time</div>
                        <div className="text-white font-bold">
                          {Math.floor(droneTelemetry.flightTime / 60)}:
                          {(droneTelemetry.flightTime % 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs">Home Dist</div>
                        <div className="text-white font-bold">
                          {Math.round(droneTelemetry.homeDistance)}{content[language].units.meters}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Drone Stats Toggle Button */}
      {isDroneDelivery && (
        <AnimatePresence>
          {showControls && !showDroneStats && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-32 right-6 z-30"
            >
              <Button
                onClick={() => setShowDroneStats(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl h-12 px-4 shadow-xl"
              >
                <Plane className="w-5 h-5 mr-2" />
                {content[language].toggleStats}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Zoom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-32 right-6 z-30 flex flex-col gap-2"
          >
            <Button
              variant="ghost"
              className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full p-0"
              onClick={() => alert('Zooming in...')}
            >
              <Plus className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full p-0"
              onClick={() => alert('Zooming out...')}
            >
              <Minus className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full p-0"
              onClick={() => alert('Finding my location...')}
            >
              <Navigation className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}