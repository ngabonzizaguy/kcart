import React, { useState } from 'react';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../../components/ui/badge';
import { Input } from '../../../../shared/components/ui/input';
import { PopularRestaurantsCarousel } from '../../../../../components/PopularRestaurantsCarousel';
import { LocationSelector } from '../../../../../components/LocationSelector';


import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  Clock, 
  Truck, 
  Heart,
  Bell,
  Menu,
  ChevronDown,
  ShoppingCart
} from 'lucide-react';
import { ImageWithFallback } from '../../../../lib/figma/ImageWithFallback';
import type { User as UserType } from '../MainApp';

interface HomeScreenProps {
  language: 'en' | 'rw';
  user: UserType | null;
  cartItems: any[];
  onVendorSelect: (vendor: any) => void;
  onSearch: (query: string) => void;
  onOpenSidebar: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToCategory: (category: any) => void;
  onViewAllRestaurants: () => void;
  onViewAllPopular: () => void;
  onViewCart: () => void;
}

// Food categories data
const foodCategories = [
  {
    id: 'local',
    name: { en: 'Local Dishes', rw: 'Ibiryo by\'Igihugu' },
    icon: '🍲',
    count: 24
  },
  {
    id: 'fast-food',
    name: { en: 'Fast Food', rw: 'Ibiryo Byihuse' },
    icon: '🍔',
    count: 18
  },
  {
    id: 'pizza',
    name: { en: 'Pizza', rw: 'Pizza' },
    icon: '🍕',
    count: 12
  },
  {
    id: 'drinks',
    name: { en: 'Drinks', rw: 'Ibinyobwa' },
    icon: '🥤',
    count: 35
  },
  {
    id: 'desserts',
    name: { en: 'Desserts', rw: 'Ibinyamunyu' },
    icon: '🍰',
    count: 16
  },
  {
    id: 'healthy',
    name: { en: 'Healthy', rw: 'Ubuzima' },
    icon: '🥗',
    count: 21
  }
];

// Popular restaurants data for carousel
const popularRestaurants = [
  {
    id: 'heaven-restaurant',
    name: 'Heaven Restaurant',
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NTU5NzI2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    deliveryTime: '20-30 min',
    distance: '1.2 km',
    category: { en: 'Fine Dining • International', rw: 'Ibiryo Byiza • Amahanga' },
    deliveryFee: 0,
    orders: 2500,
    likes: 1847
  },
  {
    id: 'kigali-coffee',
    name: 'Kigali Coffee House',
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU1OTcyNjM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    deliveryTime: '15-25 min',
    distance: '0.8 km',
    category: { en: 'Coffee • Pastries', rw: 'Ikawa • Ibinyamunyu' },
    deliveryFee: 1000,
    orders: 1800,
    likes: 1203
  },
  {
    id: 'mama-africa',
    name: 'Mama Africa',
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZm9vZCUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU1OTcyNjM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    deliveryTime: '25-35 min',
    distance: '2.0 km',
    category: { en: 'African • Traditional', rw: 'Afurika • Gakondo' },
    deliveryFee: 1500,
    orders: 2200,
    likes: 1695
  },
  {
    id: 'tokyo-sushi',
    name: 'Tokyo Sushi Bar',
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU1OTcyNjM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    deliveryTime: '30-40 min',
    distance: '3.5 km',
    category: { en: 'Japanese • Sushi', rw: 'Ubuyapani • Sushi' },
    deliveryFee: 2000,
    orders: 1600,
    likes: 982
  }
];

// Nearby vendors data
const nearbyVendors = [
  {
    id: 'golden-spoon',
    name: 'Golden Spoon Restaurant',
    image: "https://images.unsplash.com/photo-1667388969250-1c7220bf3f37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU1OTcyNjM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    deliveryTime: '25-35 min',
    distance: '2.1 km',
    category: { en: 'Local • International', rw: 'Igihugu • Amahanga' },
    isPromoted: true,
    deliveryFee: 2000
  },
  {
    id: 'spice-garden',
    name: 'Spice Garden',
    image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGtpdGNoZW58ZW58MXx8fHwxNzU1OTcyNjM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    deliveryTime: '30-40 min',
    distance: '1.8 km',
    category: { en: 'Indian • Spicy', rw: 'Ubuhinde • Birakaze' },
    isPromoted: false,
    deliveryFee: 1500
  }
];

export function HomeScreen({ 
  language, 
  user, 
  cartItems,
  onVendorSelect, 
  onSearch, 
  onOpenSidebar, 
  onNavigateToNotifications,
  onNavigateToCategory,
  onViewAllRestaurants,
  onViewAllPopular,
  onViewCart
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Kigali, Kacyiru');
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');

  const [unreadNotifications] = useState(3); // Mock unread count
  
  // Calculate total cart items - safely handle potentially undefined cartItems
  const totalCartItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Format price display
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  // Handle location change
  const handleLocationChange = (newLocation: string) => {
    setCurrentLocation(newLocation);
  };



  // Content translations
  const content = {
    en: {
      greeting: user ? `Good afternoon, ${user.name}!` : 'Welcome Guest!',
      searchPlaceholder: 'Search for food, restaurants...',
      categories: 'Categories',
      nearbyRestaurants: 'Nearby Restaurants',
      promoted: 'Promoted',
      delivery: 'Delivery',
      pickup: 'Pickup',
      deliveryFee: 'Delivery',
      free: 'Free',
      viewAll: 'View all',
      places: 'places',
      deliveryToggleHelp: 'Choose how you want to receive your food',
      deliveryDescription: 'Food delivered to your location',
      pickupDescription: 'Collect food from restaurant'
    },
    rw: {
      greeting: user ? `Mwiriwe neza, ${user.name}!` : 'Murakaza neza Umushyitsi!',
      searchPlaceholder: 'Shakisha ibiryo, ibibanza...',
      categories: 'Ibishingwe',
      nearbyRestaurants: 'Ibibanza biri hafi',
      promoted: 'Bitangajwe',
      delivery: 'Gutanga',
      pickup: 'Gutorera',
      deliveryFee: 'Gutanga',
      free: 'Ubuntu',
      viewAll: 'Reba byose',
      places: 'ahantu',
      deliveryToggleHelp: 'Hitamo uburyo ushaka kubona ibiryo',
      deliveryDescription: 'Ibiryo bitangirwa aho uri',
      pickupDescription: 'Torera ibiryo mu kibanza'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-orange-100 relative overflow-hidden">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="px-6 py-4">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm">{content[language].greeting}</p>
              
              {/* Location Display with Change Action */}
              <button
                onClick={() => setShowLocationSelector(true)}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <MapPin className="w-4 h-4 text-orange-500" />
                <span className="text-foreground font-medium">{currentLocation}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notifications Bell with Badge */}
              <button 
                className="relative p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                onClick={onNavigateToNotifications}
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </button>
              
              {/* Cart Icon - Always visible, glows when items added */}
              <button 
                className={`relative p-2 rounded-full transition-all duration-300 ${
                  totalCartItems > 0 
                    ? 'bg-orange-100 text-orange-600 hover:bg-orange-200 shadow-lg shadow-orange-500/25 animate-pulse' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                onClick={onViewCart}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 min-w-5 h-5 text-xs p-0 flex items-center justify-center bg-primary text-white animate-bounce"
                  >
                    {totalCartItems}
                  </Badge>
                )}
              </button>
              
              {/* Hamburger Menu */}
              <button 
                className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-accent transition-colors"
                onClick={onOpenSidebar}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder={content[language].searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-12 pr-12 h-12 bg-input-background border-border rounded-2xl text-foreground"
            />
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={handleSearch}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Mode Toggle - Improved with descriptions */}
          <div className="flex items-center justify-between">
            <div className="flex bg-card rounded-xl p-1 border border-border">
              <button
                onClick={() => setDeliveryMode('delivery')}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  deliveryMode === 'delivery'
                    ? 'bg-orange-500 text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={content[language].deliveryDescription}
              >
                <Truck className="w-4 h-4 inline mr-2" />
                {content[language].delivery}
              </button>
              
              <button
                onClick={() => setDeliveryMode('pickup')}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  deliveryMode === 'pickup'
                    ? 'bg-orange-500 text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={content[language].pickupDescription}
              >
                {content[language].pickup}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content with proper spacing for bottom navigation */}
      <div className="bottom-nav-spacing scrollable-y touch-scroll" style={{ height: 'calc(100vh - 180px)' }}>
        {/* Food Categories */}
        <div className="px-6 py-6">
          <h2 className="text-foreground mb-4">{content[language].categories}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {foodCategories.map((category) => (
              <button
                key={category.id}
                className="bg-card border border-border rounded-3xl p-5 text-left hover:bg-accent transition-all min-h-[80px] touch-manipulation"
                onClick={() => onNavigateToCategory(category)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-card-foreground truncate">{category.name[language]}</h3>
                    <p className="text-muted-foreground text-sm">{category.count} {content[language].places}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Restaurants Carousel */}
        <PopularRestaurantsCarousel
          language={language}
          restaurants={popularRestaurants}
          onRestaurantSelect={onVendorSelect}
          onViewAll={onViewAllPopular}
        />

        {/* Nearby Restaurants */}
        <div className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground">{content[language].nearbyRestaurants}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAllRestaurants}
              className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
            >
              {content[language].viewAll}
            </Button>
          </div>
          
          <div className="space-y-4">
            {nearbyVendors.map((vendor) => (
              <div 
                key={vendor.id}
                className="bg-card border border-border rounded-3xl overflow-hidden hover:bg-accent transition-all cursor-pointer touch-manipulation"
                onClick={() => onVendorSelect(vendor)}
              >
                <div className="flex gap-4 p-5">
                  {/* Vendor Image */}
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-muted">
                    <ImageWithFallback
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                    {vendor.isPromoted && (
                      <Badge className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-1.5 py-0.5">
                        {content[language].promoted}
                      </Badge>
                    )}
                    <button 
                      className="absolute top-1 right-1 p-1 bg-card/80 backdrop-blur-sm rounded-full text-muted-foreground hover:text-red-500 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle favorite toggle
                      }}
                    >
                      <Heart className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Vendor Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-card-foreground truncate">{vendor.name}</h3>
                        <p className="text-muted-foreground text-sm truncate">{vendor.category[language]}</p>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-foreground text-sm">{vendor.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground text-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{vendor.deliveryTime}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{vendor.distance}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={vendor.deliveryFee === 0 ? 'text-green-600' : 'text-muted-foreground'}>
                          {vendor.deliveryFee === 0 
                            ? content[language].free 
                            : formatPrice(vendor.deliveryFee)
                          } {content[language].deliveryFee}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location Selector */}
      <LocationSelector
        language={language}
        currentLocation={currentLocation}
        isOpen={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
        onLocationSelect={handleLocationChange}
      />

      {/* Hide scrollbar styles */}
      <style>
        {`
          .scrollbar-hide {
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE/Edge */
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
}