import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Plane, 
  Camera, 
  Wind, 
  Thermometer, 
  Gauge, 
  Mountain, 
  MapPin, 
  Clock, 
  Battery,
  Signal,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  ArrowLeft,
  AlertTriangle,
  Check
} from 'lucide-react';

/**
 * DroneDeliveryVisualization - Advanced drone delivery tracking with real-time telemetry
 * 
 * Features:
 * - Animated drone icon with flight path visualization
 * - Real-time altitude, speed, and battery indicators
 * - Weather conditions affecting delivery (wind, temperature)
 * - Mock drone camera feed with controls
 * - Flight progress tracking with waypoints
 * - Emergency protocols and safety indicators
 * - Mobile-optimized scrolling with native feel
 * 
 * Props:
 * - language: 'en' | 'rw' - Current app language
 * - orderId: string - Current order being tracked
 * - onClose: () => void - Callback to close drone tracking
 * - onViewFullMap: () => void - Callback to switch to full map view
 * 
 * TODO: Integrate with real drone API for live telemetry
 * TODO: Connect to actual weather services
 * TODO: Implement real camera feed when available
 */
interface DroneDeliveryVisualizationProps {
  language: 'en' | 'rw';
  orderId: string;
  onClose: () => void;
  onViewFullMap: (isDroneDelivery?: boolean) => void;
}

// Mock drone telemetry data - replace with real API integration
const mockDroneTelemetry = {
  altitude: 85, // meters
  speed: 12, // m/s
  battery: 78, // percentage
  signalStrength: 95, // percentage
  flightTime: 420, // seconds
  estimatedArrival: 180, // seconds
  waypoints: [
    { id: 'restaurant', name: 'Restaurant', completed: true, lat: -1.9441, lng: 30.0619 },
    { id: 'checkpoint1', name: 'Waypoint 1', completed: true, lat: -1.9401, lng: 30.0659 },
    { id: 'checkpoint2', name: 'Waypoint 2', completed: false, lat: -1.9361, lng: 30.0699 },
    { id: 'delivery', name: 'Your Location', completed: false, lat: -1.9321, lng: 30.0739 }
  ]
};

// Mock weather data - replace with real weather API
const mockWeatherData = {
  windSpeed: 8, // km/h
  windDirection: 'NE',
  temperature: 24, // Celsius
  visibility: 'Good',
  precipitation: 0,
  impact: 'Minimal' // impact on delivery
};

export function DroneDeliveryVisualization({ 
  language, 
  orderId, 
  onClose, 
  onViewFullMap 
}: DroneDeliveryVisualizationProps) {
  // State management
  const [dronePosition, setDronePosition] = useState(45); // Progress percentage
  const [cameraFeedVisible, setCameraFeedVisible] = useState(false);
  const [cameraFullscreen, setCameraFullscreen] = useState(false);
  const [telemetryData, setTelemetryData] = useState(mockDroneTelemetry);
  const [weatherData, setWeatherData] = useState(mockWeatherData);
  
  // Content localization
  const content = {
    en: {
      title: 'Drone Delivery Tracking',
      subtitle: 'Your order is being delivered by drone',
      altitude: 'Altitude',
      speed: 'Speed',
      battery: 'Battery',
      signal: 'Signal',
      flightTime: 'Flight Time',
      eta: 'ETA',
      weather: 'Weather Conditions',
      wind: 'Wind',
      temperature: 'Temperature',
      visibility: 'Visibility',
      impact: 'Delivery Impact',
      cameraFeed: 'Drone Camera',
      showCamera: 'Show Camera Feed',
      hideCamera: 'Hide Camera Feed',
      fullscreen: 'Fullscreen',
      exitFullscreen: 'Exit Fullscreen',
      viewFullMap: 'View Full Map',
      close: 'Close Tracking',
      droneStatus: 'Drone Status',
      flightPath: 'Flight Path',
      safetyProtocols: 'All Safety Protocols Active',
      currentWaypoint: 'En route to Waypoint 2',
      units: {
        meters: 'm',
        meterPerSecond: 'm/s',
        kmPerHour: 'km/h',
        celsius: '°C',
        minutes: 'min',
        seconds: 's'
      }
    },
    rw: {
      title: 'Gukurikirana Gutwarwa na Drone',
      subtitle: 'Icyo watumije kiri gushyuzwe na drone',
      altitude: 'Uburebure',
      speed: 'Umuvuduko',
      battery: 'Batiri',
      signal: 'Ikimenyetso',
      flightTime: 'Igihe cyo Guhaguruka',
      eta: 'Igihe Giteganijwe',
      weather: 'Ibihe',
      wind: 'Umuyaga',
      temperature: 'Ubushyuhe',
      visibility: 'Kugaragara',
      impact: 'Ingaruka ku Gutwarwa',
      cameraFeed: 'Kamera ya Drone',
      showCamera: 'Erekana Kamera',
      hideCamera: 'Hisha Kamera',
      fullscreen: 'Mugaragaza Wose',
      exitFullscreen: 'Sohoka Mugaragaza Wose',
      viewFullMap: 'Reba Ikarita Yose',
      close: 'Funga Gukurikirana',
      droneStatus: 'Imiterere ya Drone',
      flightPath: 'Inzira yo Guhaguruka',
      safetyProtocols: 'Amahame yo Kurinda Yose Akora',
      currentWaypoint: 'Kuri nzira ijya kuri Waypoint 2',
      units: {
        meters: 'm',
        meterPerSecond: 'm/s',
        kmPerHour: 'km/h',
        celsius: '°C',
        minutes: 'min',
        seconds: 's'
      }
    }
  };

  // Simulate drone movement and telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDronePosition(prev => {
        const newPosition = prev + 0.5;
        return newPosition > 100 ? 100 : newPosition;
      });
      
      // TODO: Replace with real telemetry API calls
      setTelemetryData(prev => ({
        ...prev,
        altitude: prev.altitude + Math.random() * 4 - 2, // Simulate altitude changes
        speed: prev.speed + Math.random() * 2 - 1, // Simulate speed changes
        battery: Math.max(prev.battery - 0.1, 0), // Simulate battery drain
        estimatedArrival: Math.max(prev.estimatedArrival - 2, 0) // Countdown ETA
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWeatherImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'minimal': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'significant': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col">
      {/* Header - Fixed */}
      <div className="bg-white/90 backdrop-blur-md border-b border-white/30 px-6 py-4 pt-safe flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl h-10 w-10 p-0 border-2 border-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-medium text-gray-900">{content[language].title}</h1>
              <p className="text-sm text-gray-600">{content[language].subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
              <Check className="w-3 h-3 mr-1" />
              {content[language].safetyProtocols}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content Area - Mobile-Optimized Scrollable */}
      <div className="flex-1 overflow-y-auto scrollable-y custom-scrollbar touch-scroll">
        <div className="p-6 space-y-6 pb-24 mb-safe">
          {/* Drone Flight Visualization */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">{content[language].flightPath}</h2>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                {content[language].currentWaypoint}
              </Badge>
            </div>
            
            {/* Flight Path Progress */}
            <div className="relative mb-6">
              <Progress value={dronePosition} className="h-3 bg-gray-200" />
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-2000 ease-linear"
                style={{ left: `${dronePosition}%` }}
              >
                <div className="bg-orange-500 text-white rounded-full p-2 shadow-lg animate-pulse">
                  <Plane className="w-4 h-4 transform rotate-45" />
                </div>
              </div>
            </div>

            {/* Waypoints */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {telemetryData.waypoints.map((waypoint, index) => (
                <div key={waypoint.id} className="text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                    waypoint.completed ? 'bg-green-500' : 
                    index === 2 ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'
                  }`} />
                  <p className="text-xs text-gray-600">{waypoint.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Dashboard */}
          <div className="grid grid-cols-2 gap-4">
            {/* Altitude & Speed */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <Mountain className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium text-gray-900">{content[language].altitude}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {Math.round(telemetryData.altitude)}{content[language].units.meters}
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-600">
                  {Math.round(telemetryData.speed)}{content[language].units.meterPerSecond}
                </span>
              </div>
            </div>

            {/* Battery & Signal */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <Battery className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900">{content[language].battery}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {Math.round(telemetryData.battery)}%
              </div>
              <div className="flex items-center gap-2">
                <Signal className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">
                  {telemetryData.signalStrength}%
                </span>
              </div>
            </div>
          </div>

          {/* Weather Conditions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{content[language].weather}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-700">{content[language].wind}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {weatherData.windSpeed}{content[language].units.kmPerHour} {weatherData.windDirection}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-700">{content[language].temperature}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {weatherData.temperature}{content[language].units.celsius}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{content[language].visibility}</span>
                  <span className="text-sm font-medium text-gray-900">{weatherData.visibility}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{content[language].impact}</span>
                  <Badge variant="outline" className={getWeatherImpactColor(weatherData.impact)}>
                    {weatherData.impact}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Drone Camera Feed */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">{content[language].cameraFeed}</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCameraFeedVisible(!cameraFeedVisible)}
                  className="rounded-xl h-10"
                >
                  {cameraFeedVisible ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      {content[language].hideCamera}
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      {content[language].showCamera}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {cameraFeedVisible && (
              <div className="relative">
                {/* Mock Camera Feed */}
                <div className="aspect-video bg-gradient-to-br from-sky-200 via-blue-100 to-green-100 rounded-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10" />
                  
                  {/* Camera UI Overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                      LIVE
                    </span>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCameraFullscreen(!cameraFullscreen)}
                      className="bg-black/50 border-white/30 text-white hover:bg-black/70 rounded-lg h-8 w-8 p-0"
                    >
                      {cameraFullscreen ? (
                        <Minimize2 className="w-4 h-4" />
                      ) : (
                        <Maximize2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {/* Mock aerial view content */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 text-white text-xs px-3 py-2 rounded">
                      <div className="flex items-center justify-between">
                        <span>Alt: {Math.round(telemetryData.altitude)}m</span>
                        <span>Speed: {Math.round(telemetryData.speed)}m/s</span>
                        <span>ETA: {formatTime(telemetryData.estimatedArrival)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Crosshair overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white/70 border-dashed rounded-full" />
                  </div>
                </div>

                {/* Camera Controls */}
                <div className="flex items-center justify-center mt-4 gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <MapPin className="w-4 h-4 mr-2" />
                    Mark Location
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Flight Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{content[language].droneStatus}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-700">{content[language].flightTime}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatTime(telemetryData.flightTime)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">{content[language].eta}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatTime(telemetryData.estimatedArrival)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions - Fixed with Intelligent Spacing */}
      <div className="bg-white/90 backdrop-blur-md border-t border-white/30 flex-shrink-0">
        <div className="p-6 pt-8 pb-8 mb-safe">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => onViewFullMap(true)}
              className="flex-1 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12"
            >
              <MapPin className="w-5 h-5 mr-2" />
              {content[language].viewFullMap}
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12"
            >
              {content[language].close}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}