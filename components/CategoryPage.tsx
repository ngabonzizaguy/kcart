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
  Users,
  Utensils,
  Coffee,
  Pizza,
  Beef,
  Salad,
  IceCream
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
  specialties: string[];
  description?: { en: string; rw: string };
}

interface Category {
  id: string;
  name: { en: string; rw: string };
  icon: string;
  count: number;
}

interface CategoryPageProps {
  language: 'en' | 'rw';
  category?: Category;
  onBack: () => void;
  onRestaurantSelect: (restaurant: Restaurant) => void;
}

// Category-specific restaurant data
const getCategoryRestaurants = (categoryId: string): Restaurant[] => {
  const baseRestaurants = {
    'local': [
      {
        id: 'mama-africa-local',
        name: 'Mama Africa Kitchen',
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZm9vZCUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU1OTcyNjM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.8,
        deliveryTime: '25-35 min',
        distance: '2.0 km',
        category: { en: 'Traditional Rwandan', rw: 'Ibiryo bya Gakondo' },
        deliveryFee: 1500,
        orders: 2200,
        isPromoted: true,
        specialties: ['Ubugali', 'Igikoma', 'Umutsima', 'Inkoko'],
        description: { en: 'Authentic Rwandan dishes made with love', rw: 'Ibiryo by\'u Rwanda byakozwe n\'urukundo' }
      },
      {
        id: 'traditional-flavors',
        name: 'Traditional Flavors',
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGZvb2R8ZW58MXx8fHwxNzU1OTc5MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.7,
        deliveryTime: '20-30 min',
        distance: '1.5 km',
        category: { en: 'Local Cuisine', rw: 'Ibiryo by\'Igihugu' },
        deliveryFee: 1000,
        orders: 1800,
        specialties: ['Inyama n\'Amaru', 'Ibirayi', 'Umugati', 'Icyayi'],
        description: { en: 'Home-style cooking with fresh ingredients', rw: 'Guteka nk\'urugo n\'ibikoresho bishya' }
      },
      {
        id: 'village-kitchen',
        name: 'Village Kitchen',
        image: "https://images.unsplash.com/photo-1604909052743-94e838986d24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYWdlJTIwZm9vZHxlbnwxfHx8fDE3NTU5NzkwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.6,
        deliveryTime: '30-40 min',
        distance: '3.2 km',
        category: { en: 'Rural Traditional', rw: 'Gakondo k\'Icyaro' },
        deliveryFee: 2000,
        orders: 1500,
        specialties: ['Ubwoba', 'Igikoma', 'Amafi', 'Ubuki'],
        description: { en: 'Traditional village recipes passed down generations', rw: 'Uburyo bwo guteka bwa kera bwatanzwe mu binyangamugayo' }
      }
    ],
    'fast-food': [
      {
        id: 'burger-palace-ff',
        name: 'Burger Palace',
        image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1NTk3OTA3OHww&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.4,
        deliveryTime: '15-25 min',
        distance: '1.0 km',
        category: { en: 'American Fast Food', rw: 'Ibiryo Byihuse bya Amerika' },
        deliveryFee: 800,
        orders: 2800,
        isPromoted: true,
        specialties: ['Cheese Burger', 'Chicken Wings', 'French Fries', 'Milkshakes'],
        description: { en: 'Quick, delicious burgers and sides', rw: 'Burger nziza n\'ibindi byihuse' }
      },
      {
        id: 'kfc-style',
        name: 'Crispy Chicken Express',
        image: "https://images.unsplash.com/photo-1562967914-608f82629710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMGNoaWNrZW58ZW58MXx8fHwxNzU1OTc5MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.3,
        deliveryTime: '20-30 min',
        distance: '1.8 km',
        category: { en: 'Fried Chicken', rw: 'Inkoko Yakanzwe' },
        deliveryFee: 1200,
        orders: 2100,
        specialties: ['Crispy Chicken', 'Hot Wings', 'Coleslaw', 'Biscuits'],
        description: { en: 'Crispy fried chicken with secret spices', rw: 'Inkoko yakanzwe n\'ibirayi byihishe' }
      },
      {
        id: 'quick-bites',
        name: 'Quick Bites',
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXN0JTIwZm9vZCUyMHNhbmR3aWNofGVufDF8fHx8MTc1NTk3OTA3OHww&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.2,
        deliveryTime: '10-20 min',
        distance: '0.5 km',
        category: { en: 'Quick Service', rw: 'Serive Yihuse' },
        deliveryFee: 500,
        orders: 3500,
        specialties: ['Sandwiches', 'Wraps', 'Salads', 'Smoothies'],
        description: { en: 'Fast and healthy quick meals', rw: 'Ibiryo byihuse kandi byiza ku buzima' }
      }
    ],
    'pizza': [
      {
        id: 'pizza-corner-main',
        name: 'Pizza Corner',
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU1OTc5MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.5,
        deliveryTime: '20-30 min',
        distance: '1.5 km',
        category: { en: 'Wood-Fired Pizza', rw: 'Pizza yo mu Ziko' },
        deliveryFee: 1000,
        orders: 3200,
        isPromoted: true,
        specialties: ['Margherita', 'Pepperoni', 'Quattro Stagioni', 'BBQ Chicken'],
        description: { en: 'Authentic wood-fired pizza with fresh toppings', rw: 'Pizza nziza yakozwe mu ziko n\'ibikoresho bishya' }
      },
      {
        id: 'italian-kitchen',
        name: 'Italian Kitchen',
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGl6emF8ZW58MXx8fHwxNzU1OTc5MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.6,
        deliveryTime: '25-35 min',
        distance: '2.2 km',
        category: { en: 'Italian Cuisine', rw: 'Ibiryo by\'Ubutaliyani' },
        deliveryFee: 1500,
        orders: 1900,
        specialties: ['Neapolitan Pizza', 'Pasta', 'Risotto', 'Tiramisu'],
        description: { en: 'Authentic Italian dishes and traditional pizza', rw: 'Ibiryo by\'Ubutaliyani n\'pizza ya gakondo' }
      }
    ],
    'drinks': [
      {
        id: 'kigali-coffee-drinks',
        name: 'Kigali Coffee House',
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU1OTcyNjM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.7,
        deliveryTime: '15-25 min',
        distance: '0.8 km',
        category: { en: 'Coffee & Beverages', rw: 'Ikawa n\'Ibinyobwa' },
        deliveryFee: 1000,
        orders: 1800,
        isPromoted: true,
        specialties: ['Cappuccino', 'Fresh Juice', 'Smoothies', 'Iced Coffee'],
        description: { en: 'Premium coffee and fresh beverages', rw: 'Ikawa nziza n\'ibinyobwa bishya' }
      },
      {
        id: 'juice-bar',
        name: 'Fresh Juice Bar',
        image: "https://images.unsplash.com/photo-1546173159-315724a31696?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqdWljZSUyMGJhcnxlbnwxfHx8fDE3NTU5NzkwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.5,
        deliveryTime: '10-20 min',
        distance: '1.2 km',
        category: { en: 'Fresh Juices', rw: 'Amaki Mashya' },
        deliveryFee: 800,
        orders: 2500,
        specialties: ['Orange Juice', 'Pineapple Juice', 'Mixed Fruit', 'Green Smoothie'],
        description: { en: 'Fresh fruit juices and healthy smoothies', rw: 'Amaki mashya y\'imbuto n\'ibinyobwa byiza ku buzima' }
      }
    ],
    'desserts': [
      {
        id: 'sweet-dreams',
        name: 'Sweet Dreams Bakery',
        image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBkZXNzZXJ0c3xlbnwxfHx8fDE3NTU5NzkwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.8,
        deliveryTime: '20-30 min',
        distance: '1.8 km',
        category: { en: 'Bakery & Desserts', rw: 'Uruganda rw\'Amakeke n\'Ibinyamunyu' },
        deliveryFee: 1200,
        orders: 1600,
        isPromoted: true,
        specialties: ['Birthday Cakes', 'Cupcakes', 'Cookies', 'Ice Cream'],
        description: { en: 'Custom cakes and delicious desserts', rw: 'Amakeke yakorwa kandi n\'ibinyamunyu biryoshye' }
      },
      {
        id: 'ice-cream-parlor',
        name: 'Ice Cream Parlor',
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2UlMjBjcmVhbSUyMHNob3B8ZW58MXx8fHwxNzU1OTc5MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.4,
        deliveryTime: '15-25 min',
        distance: '2.5 km',
        category: { en: 'Ice Cream & Frozen', rw: 'Ice Cream n\'Ibikandagiye' },
        deliveryFee: 1500,
        orders: 2200,
        specialties: ['Vanilla Ice Cream', 'Chocolate Sundae', 'Fruit Sorbet', 'Milkshakes'],
        description: { en: 'Premium ice cream and frozen treats', rw: 'Ice cream nziza n\'ibiryo bikandagiye' }
      }
    ],
    'healthy': [
      {
        id: 'green-garden',
        name: 'Green Garden',
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMHNhbGFkfGVufDF8fHx8MTc1NTk3OTA3OHww&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.6,
        deliveryTime: '20-30 min',
        distance: '1.4 km',
        category: { en: 'Healthy & Organic', rw: 'Ubuzima n\'Kamugega' },
        deliveryFee: 1200,
        orders: 1400,
        isPromoted: true,
        specialties: ['Quinoa Salad', 'Avocado Toast', 'Green Smoothie', 'Grilled Chicken'],
        description: { en: 'Organic and nutritious meals for healthy living', rw: 'Ibiryo kamugega kandi byiza ku buzima' }
      },
      {
        id: 'fitness-fuel',
        name: 'Fitness Fuel',
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZm9vZHxlbnwxfHx8fDE3NTU5NzkwNzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        rating: 4.5,
        deliveryTime: '25-35 min',
        distance: '2.0 km',
        category: { en: 'Fitness & Nutrition', rw: 'Siporo n\'Intungamubiri' },
        deliveryFee: 1000,
        orders: 1100,
        specialties: ['Protein Bowl', 'Post-Workout Shake', 'Energy Bars', 'Keto Meals'],
        description: { en: 'High-protein meals for active lifestyles', rw: 'Ibiryo birimo poroteyine nyinshi ku buzima bwishimye' }
      }
    ]
  };

  return baseRestaurants[categoryId as keyof typeof baseRestaurants] || [];
};

export function CategoryPage({ language, category, onBack, onRestaurantSelect }: CategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'deliveryTime' | 'orders'>('rating');
  const [filterBy, setFilterBy] = useState<'all' | 'free-delivery' | 'promoted'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Default category if not provided
  const defaultCategory: Category = {
    id: 'local',
    name: { en: 'Food Categories', rw: 'Ibishingwe by\'Ibiryo' },
    icon: '🍽️',
    count: 0
  };

  const safeCategory = category || defaultCategory;

  // Get restaurants for this category
  const categoryRestaurants = getCategoryRestaurants(safeCategory.id);

  // Content translations
  const content = {
    en: {
      searchPlaceholder: `Search ${safeCategory.name.en.toLowerCase()}...`,
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
      specialties: 'Specialties',
      sortOptions: {
        rating: 'Highest Rated',
        distance: 'Nearest',
        deliveryTime: 'Fastest Delivery',
        orders: 'Most Popular'
      }
    },
    rw: {
      searchPlaceholder: `Shakisha ${safeCategory.name.rw.toLowerCase()}...`,
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
      specialties: 'Ibisobanure',
      sortOptions: {
        rating: 'Bifite Amanota Menshi',
        distance: 'Biri Hafi',
        deliveryTime: 'Bitanga Vuba',
        orders: 'Byakunzwe Cyane'
      }
    }
  };

  // Get category icon component
  const getCategoryIconComponent = (categoryId: string) => {
    switch (categoryId) {
      case 'local': return Utensils;
      case 'fast-food': return Beef;
      case 'pizza': return Pizza;
      case 'drinks': return Coffee;
      case 'desserts': return IceCream;
      case 'healthy': return Salad;
      default: return Utensils;
    }
  };

  // Format price display
  const formatPrice = (price: number) => {
    return price === 0 ? content[language].free : `${price.toLocaleString()} RWF`;
  };

  // Filter and sort restaurants
  const getFilteredAndSortedRestaurants = () => {
    let filtered = categoryRestaurants;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.category[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        )
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
  const CategoryIconComponent = getCategoryIconComponent(safeCategory.id);

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
            
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <CategoryIconComponent className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {safeCategory.name[language]}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {safeCategory.count} restaurants available
                </p>
              </div>
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
                <CategoryIconComponent className="w-10 h-10 text-orange-500" />
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
                      
                      {/* Promoted Badge */}
                      {restaurant.isPromoted && (
                        <Badge className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5">
                          {content[language].promoted}
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

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {restaurant.specialties.slice(0, 3).map((specialty, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700"
                          >
                            {specialty}
                          </Badge>
                        ))}
                        {restaurant.specialties.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600"
                          >
                            +{restaurant.specialties.length - 3} more
                          </Badge>
                        )}
                      </div>

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