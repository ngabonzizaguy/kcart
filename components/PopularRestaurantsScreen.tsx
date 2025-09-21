import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  MapPin, 
  Heart,
  Filter,
  Search,
  SlidersHorizontal,
  Truck,
  Award,
  TrendingUp,
  Users
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  category: { en: string; rw: string };
  deliveryFee: number;
  orders: number;
  isPromoted?: boolean;
  badges?: string[];
  description?: { en: string; rw: string };
}

interface PopularRestaurantsScreenProps {
  language: 'en' | 'rw';
  onBack: () => void;
  onRestaurantSelect: (restaurant: Restaurant) => void;
}

// Extended popular restaurants data with more entries
const allPopularRestaurants: Restaurant[] = [
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
    isPromoted: true,
    badges: ['#1 Popular', 'Fast Delivery'],
    description: { en: 'Exquisite fine dining with international cuisine', rw: 'Ibiryo byiza cyane n\'amahanga' }
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
    badges: ['#2 Popular', 'Coffee Expert'],
    description: { en: 'Premium coffee and fresh pastries daily', rw: 'Ikawa nziza n\'ibinyamunyu bishya buri munsi' }
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
    badges: ['#3 Popular', 'Authentic'],
    description: { en: 'Authentic African cuisine with traditional flavors', rw: 'Ibiryo by\'Afurika bikukije ubunyangamugayo' }
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
    badges: ['#4 Popular', 'Fresh Fish'],
    description: { en: 'Fresh sushi and Japanese delicacies', rw: 'Sushi nshya n\'ibiryo by\'Ubuyapani' }
  },
  {
    id: 'golden-spoon',
    name: 'Golden Spoon Restaurant',
    image: "https://images.unsplash.com/photo-1667388969250-1c7220bf3f37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU1OTcyNjM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    deliveryTime: '25-35 min',
    distance: '2.1 km',
    category: { en: 'Local • International', rw: 'Igihugu • Amahanga' },
    deliveryFee: 2000,
    orders: 2100,
    isPromoted: true,
    badges: ['#5 Popular', 'Chef\'s Choice'],
    description: { en: 'Premium local and international dishes', rw: 'Ibiryo byiza by\'igihugu n\'amahanga' }
  },
  {
    id: 'spice-garden',
    name: 'Spice Garden',
    image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGtpdGNoZW58ZW58MXx8fHwxNzU1OTcyNjM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    deliveryTime: '30-40 min',
    distance: '1.8 km',
    category: { en: 'Indian • Spicy', rw: 'Ubuhinde • Birakaze' },
    deliveryFee: 1500,
    orders: 1900,
    badges: ['#6 Popular', 'Spice Master'],
    description: { en: 'Authentic Indian spices and flavors', rw: 'Ibiryo by\'Ubuhinde birakaze n\'ubunzirabwoba' }
  },
  {
    id: 'pizza-corner',
    name: 'Pizza Corner',
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU1OTc5MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    deliveryTime: '20-30 min',
    distance: '1.5 km',
    category: { en: 'Italian • Pizza', rw: 'Ubutaliyani • Pizza' },
    deliveryFee: 1000,
    orders: 3200,
    badges: ['#7 Popular', 'Wood Fired'],
    description: { en: 'Wood-fired pizza with fresh ingredients', rw: 'Pizza yakozwe mu ziko n\'ibikoresho bishya' }
  },
  {
    id: 'burger-palace',
    name: 'Burger Palace',
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1NTk3OTA3OHww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.4,
    deliveryTime: '15-25 min',
    distance: '1.0 km',
    category: { en: 'American • Burgers', rw: 'Amerika • Burger' },
    deliveryFee: 800,
    orders: 2800,
    badges: ['#8 Popular', 'Fast Service'],
    description: { en: 'Juicy burgers and crispy fries', rw: 'Burger nziza n\'ibirayi byuma' }
  }
];

export function PopularRestaurantsScreen({ language, onBack, onRestaurantSelect }: PopularRestaurantsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'deliveryTime' | 'orders'>('rating');
  const [filterBy, setFilterBy] = useState<'all' | 'free-delivery' | 'promoted'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Content translations
  const content = {
    en: {
      title: 'Popular Restaurants',
      subtitle: 'Most loved restaurants in your area',
      searchPlaceholder: 'Search restaurants...',
      sortBy: 'Sort by',
      filterBy: 'Filter',
      all: 'All',
      freeDelivery: 'Free Delivery',
      promoted: 'Promoted',
      rating: 'Rating',
      distance: 'Distance',
      deliveryTime: 'Delivery Time',
      orders: 'Orders',
      delivery: 'Delivery',
      free: 'Free',
      viewMenu: 'View Menu',
      results: 'restaurants found',
      noResults: 'No restaurants found',
      noResultsDesc: 'Try adjusting your search or filters',
      sortOptions: {
        rating: 'Highest Rated',
        distance: 'Nearest',
        deliveryTime: 'Fastest Delivery',
        orders: 'Most Popular'
      }
    },
    rw: {
      title: 'Ibibanza Bikunda',
      subtitle: 'Ibibanza byakunze cyane mu gace kanyu',
      searchPlaceholder: 'Shakisha ibibanza...',
      sortBy: 'Shiraho hakurikijwe',
      filterBy: 'Shyungura',
      all: 'Byose',
      freeDelivery: 'Gutanga Ubuntu',
      promoted: 'Bitangajwe',
      rating: 'Amanota',
      distance: 'Intera',
      deliveryTime: 'Igihe cyo Gutanga',
      orders: 'Umubare w\'Abakiriya',
      delivery: 'Gutanga',
      free: 'Ubuntu',
      viewMenu: 'Reba Menu',
      results: 'ibibanza byabonetse',
      noResults: 'Nta bibanza byabonetse',
      noResultsDesc: 'Gerageza guhindura ushakisha cyangwa akayunguruzo',
      sortOptions: {
        rating: 'Bifite Amanota Menshi',
        distance: 'Biri Hafi',
        deliveryTime: 'Bitanga Vuba',
        orders: 'Byakunzwe Cyane'
      }
    }
  };

  // Format price display
  const formatPrice = (price: number) => {
    return price === 0 ? content[language].free : `${price.toLocaleString()} RWF`;
  };

  // Filter and sort restaurants
  const getFilteredAndSortedRestaurants = () => {
    let filtered = allPopularRestaurants;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.category[language].toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filterBy === 'free-delivery') {
      filtered = filtered.filter(restaurant => restaurant.deliveryFee === 0);
    } else if (filterBy === 'promoted') {
      filtered = filtered.filter(restaurant => restaurant.isPromoted);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'deliveryTime':
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
        case 'orders':
          return b.orders - a.orders;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredRestaurants = getFilteredAndSortedRestaurants();

  // Get icon for sort option
  const getSortIcon = (option: string) => {
    switch (option) {
      case 'rating': return Star;
      case 'distance': return MapPin;
      case 'deliveryTime': return Clock;
      case 'orders': return TrendingUp;
      default: return Star;
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col">
      {/* Header - Fixed with proper z-index */}
      <div className="bg-white/90 backdrop-blur-md border-b border-orange-200/30 pt-safe sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 h-auto rounded-2xl hover:bg-orange-100/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                {content[language].title}
              </h1>
              <p className="text-muted-foreground text-sm">
                {content[language].subtitle}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder={content[language].searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 bg-white/60 border-orange-200/30 rounded-2xl"
            />
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-10 px-4 bg-white/60 border-orange-200/30 hover:bg-orange-50 rounded-xl"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {content[language].sortOptions[sortBy]}
              </Button>
            </div>

            {/* Filter Pills - Mobile Scrollable */}
            <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollable-x touch-scroll-x">
              {['all', 'free-delivery', 'promoted'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterBy(filter as any)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all touch-manipulation ${
                    filterBy === filter
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-white/60 text-muted-foreground hover:bg-orange-100/60 border border-orange-200/30'
                  }`}
                >
                  {content[language][filter as keyof typeof content[typeof language]] || filter}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options Dropdown - Fixed z-index */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 top-full z-[60] mx-6 mt-2 bg-white/95 backdrop-blur-md border border-orange-200/30 rounded-2xl shadow-lg overflow-hidden"
              >
                {Object.entries(content[language].sortOptions).map(([key, label]) => {
                  const IconComponent = getSortIcon(key);
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSortBy(key as any);
                        setShowFilters(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50/60 touch-manipulation ${
                        sortBy === key ? 'bg-orange-100/60 text-orange-600' : 'text-foreground'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium">{label}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results Counter */}
      <div className="px-6 py-3 bg-white/40 backdrop-blur-sm border-b border-orange-200/20">
        <p className="text-muted-foreground text-sm">
          {filteredRestaurants.length} {content[language].results}
        </p>
      </div>

      {/* Restaurant List - Optimized for production mode with bottom navigation */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar"
        style={{
          height: 'calc(100vh - 280px)', // Account for header + results counter + bottom nav
          minHeight: 0,
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y'
        }}
      >
        <div className="px-6 py-6 space-y-4 bottom-nav-spacing">
          {filteredRestaurants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {content[language].noResults}
              </h3>
              <p className="text-muted-foreground">
                {content[language].noResultsDesc}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/85 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden hover:bg-white/95 hover:shadow-lg transition-all duration-300 cursor-pointer touch-manipulation"
                  onClick={() => onRestaurantSelect(restaurant)}
                >
                  <div className="flex gap-4 p-5">
                    {/* Restaurant Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden">
                      <ImageWithFallback
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Popular Rank Badge */}
                      {restaurant.badges && restaurant.badges[0] && (
                        <Badge className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-1.5 py-0.5">
                          {restaurant.badges[0]}
                        </Badge>
                      )}
                      
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle favorite toggle
                        }}
                        className="absolute top-1 right-1 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Restaurant Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate mb-1">
                            {restaurant.name}
                          </h3>
                          <p className="text-muted-foreground text-sm truncate">
                            {restaurant.category[language]}
                          </p>
                          {restaurant.description && (
                            <p className="text-muted-foreground text-xs truncate mt-1">
                              {restaurant.description[language]}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-foreground text-sm font-medium">
                            {restaurant.rating}
                          </span>
                        </div>
                      </div>

                      {/* Badges */}
                      {restaurant.badges && restaurant.badges.length > 1 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {restaurant.badges.slice(1).map((badge, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700"
                            >
                              {badge}
                            </Badge>
                          ))}
                          {restaurant.isPromoted && (
                            <Badge className="text-xs px-2 py-0.5 bg-green-100 text-green-700">
                              {content[language].promoted}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Details Row */}
                      <div className="flex items-center justify-between text-muted-foreground text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{restaurant.deliveryTime}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{restaurant.distance}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{restaurant.orders.toLocaleString()}+</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className={restaurant.deliveryFee === 0 ? 'text-green-600 font-medium' : 'text-foreground'}>
                            {formatPrice(restaurant.deliveryFee)} {content[language].delivery.toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}