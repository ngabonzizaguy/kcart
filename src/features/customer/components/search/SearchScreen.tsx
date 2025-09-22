import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Star, Clock, Truck } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Badge } from '@legacy/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../shared/components/ui/tabs';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../../../../lib/figma/ImageWithFallback';

/**
 * SearchScreen - Comprehensive search functionality
 * 
 * Features:
 * - Real-time search with filtering
 * - Tab-based results (All, Restaurants, Food)
 * - Popular and recent search suggestions
 * - Animated loading states and transitions
 * - Bilingual support (English/Kinyarwanda)
 * - DeliGo Glass Design Language
 * - Mobile-optimized touch interactions
 * 
 * Props:
 * - language: 'en' | 'rw' - Current app language
 * - query: string - Initial search query
 * - onVendorSelect: (vendor: any) => void - Handle restaurant selection
 * - onBack: () => void - Navigation back callback
 * 
 * TODO: Connect to real search API endpoints
 * TODO: Implement advanced filters (price, rating, delivery time)
 * TODO: Add search analytics and user behavior tracking
 */

interface SearchScreenProps {
  language: 'en' | 'rw';
  query: string;
  onVendorSelect: (vendor: any) => void;
  onBack: () => void;
}

export function SearchScreen({ 
  language, 
  query, 
  onVendorSelect, 
  onBack 
}: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState(query);
  const [activeTab, setActiveTab] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  const content = {
    en: {
      search: 'Search',
      searchPlaceholder: 'Search for food, restaurants...',
      all: 'All',
      restaurants: 'Restaurants',
      food: 'Food',
      noResults: 'No results found',
      noResultsDesc: 'Try adjusting your search terms',
      popularSearches: 'Popular Searches',
      recentSearches: 'Recent Searches'
    },
    rw: {
      search: 'Gushakisha',
      searchPlaceholder: 'Shakisha ibiryo, resitora...',
      all: 'Byose',
      restaurants: 'Resitora',
      food: 'Ibiryo',
      noResults: 'Nta gize wasanzwe',
      noResultsDesc: 'Gerageza guhindura ijambo ushakisha',
      popularSearches: 'Ibyo Benshi Bashakisha',
      recentSearches: 'Ibyo Washakishije Vuba'
    }
  };

  // Mock search results - replace with real API data
  const mockRestaurants = [
    {
      id: '1',
      name: 'Tasty Bites Restaurant',
      image: '',
      rating: 4.8,
      reviewCount: 124,
      cuisine: 'International',
      deliveryTime: '20-30 min',
      deliveryFee: 2000,
      tags: ['Popular', 'Fast delivery']
    },
    {
      id: '2', 
      name: 'Pizza Palace',
      image: '',
      rating: 4.6,
      reviewCount: 89,
      cuisine: 'Italian',
      deliveryTime: '25-35 min',
      deliveryFee: 2500,
      tags: ['Italian', 'Pizza']
    }
  ];

  const mockFoodItems = [
    {
      id: '1',
      name: 'Grilled Chicken Combo',
      image: '',
      price: 8500,
      restaurant: 'Tasty Bites',
      rating: 4.8,
      description: 'Perfectly seasoned grilled chicken with rice'
    },
    {
      id: '2',
      name: 'Margherita Pizza',
      image: '',
      price: 15000,
      restaurant: 'Pizza Palace',
      rating: 4.7,
      description: 'Classic pizza with fresh mozzarella and basil'
    }
  ];

  const popularSearches = [
    'Pizza', 'Burger', 'Chicken', 'Rice', 'Pasta', 'Salad'
  ];

  const recentSearches = [
    'Italian food', 'Fast delivery', 'Vegetarian'
  ];

  // Filter results based on search query
  const filteredRestaurants = mockRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredFoodItems = mockFoodItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = async (newQuery: string) => {
    setSearchQuery(newQuery);
    if (newQuery.trim()) {
      setIsSearching(true);
      // Simulate API search delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsSearching(false);
    }
  };

  const hasResults = searchQuery.trim() ? (filteredRestaurants.length > 0 || filteredFoodItems.length > 0) : false;
  const showEmptyState = searchQuery.trim() && !hasResults && !isSearching;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col">
      {/* Header with DeliGo Glass Design */}
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
            
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={content[language].searchPlaceholder}
                className="pl-12 pr-4 h-12 bg-white/60 border-orange-200/30 rounded-2xl text-foreground"
                autoFocus
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-2 h-auto rounded-2xl hover:bg-orange-100/50"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Tabs with DeliGo Glass Design */}
          {searchQuery.trim() && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-white/60 border border-orange-200/30 rounded-2xl p-1">
                <TabsTrigger 
                  value="all" 
                  className="text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  {content[language].all}
                </TabsTrigger>
                <TabsTrigger 
                  value="restaurants" 
                  className="text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  {content[language].restaurants}
                </TabsTrigger>
                <TabsTrigger 
                  value="food" 
                  className="text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  {content[language].food}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </div>

      {/* Content with proper mobile scrolling */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar"
        style={{
          height: 'calc(100vh - 180px)',
          minHeight: 0,
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y'
        }}
      >
        <div className="bottom-nav-spacing">
        {!searchQuery.trim() ? (
          /* Search Suggestions with DeliGo Glass Design */
          <div className="px-6 py-6 space-y-6">
            {/* Popular Searches */}
            <div>
              <h3 className="text-foreground font-medium mb-4">{content[language].popularSearches}</h3>
              <div className="flex flex-wrap gap-3">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-orange-200/30 rounded-2xl text-sm font-medium text-foreground hover:bg-white/80 hover:border-orange-300/40 transition-all touch-manipulation"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            <div>
              <h3 className="text-foreground font-medium mb-4">{content[language].recentSearches}</h3>
              <div className="space-y-3">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="w-full p-4 bg-white/60 backdrop-blur-sm border border-orange-200/30 rounded-2xl text-left hover:bg-white/80 hover:border-orange-300/40 transition-all touch-manipulation"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100/60 rounded-xl flex items-center justify-center">
                        <Search className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-foreground font-medium">{term}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : showEmptyState ? (
          /* Empty State with DeliGo Glass Design */
          <div className="flex flex-col items-center justify-center h-full px-6 py-16">
            <div className="w-24 h-24 bg-orange-100/60 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 border border-orange-200/30">
              <Search className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-foreground font-semibold mb-3">{content[language].noResults}</h3>
            <p className="text-muted-foreground text-center max-w-sm leading-relaxed">
              {content[language].noResultsDesc}
            </p>
          </div>
        ) : isSearching ? (
          /* Loading State with DeliGo Glass Design */
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-3 border-orange-500/30 border-t-orange-500 rounded-full"
            />
          </div>
        ) : (
          /* Search Results with DeliGo Glass Design */
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsContent value="all" className="m-0 h-full">
              <div className="px-6 py-6 space-y-6">
                {/* Restaurants */}
                {filteredRestaurants.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-foreground font-medium">{content[language].restaurants}</h3>
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                        {filteredRestaurants.length}
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {filteredRestaurants.map((restaurant) => (
                        <motion.div
                          key={restaurant.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => onVendorSelect(restaurant)}
                          className="bg-white/85 backdrop-blur-sm border border-white/20 rounded-3xl p-5 cursor-pointer hover:bg-white/95 hover:shadow-lg transition-all touch-manipulation"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl overflow-hidden">
                              <ImageWithFallback
                                src={restaurant.image}
                                alt={restaurant.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="text-foreground font-semibold mb-1">{restaurant.name}</h4>
                              <p className="text-muted-foreground text-sm mb-3">{restaurant.cuisine}</p>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{restaurant.rating}</span>
                                  <span className="text-xs">({restaurant.reviewCount})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-orange-500" />
                                  <span className="font-medium">{restaurant.deliveryTime}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Truck className="w-3 h-3 text-orange-500" />
                                  <span className="font-medium">{restaurant.deliveryFee.toLocaleString()} RWF</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Food Items */}
                {filteredFoodItems.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-foreground font-medium">{content[language].food}</h3>
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                        {filteredFoodItems.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {filteredFoodItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white/85 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden cursor-pointer hover:bg-white/95 hover:shadow-lg transition-all touch-manipulation aspect-[3/4]"
                        >
                          <div className="h-full flex flex-col">
                            <div className="flex-1 bg-gradient-to-br from-orange-100 to-orange-200">
                              <ImageWithFallback
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="p-4">
                              <h4 className="text-foreground font-semibold text-sm mb-1 line-clamp-2">{item.name}</h4>
                              <p className="text-muted-foreground text-xs mb-3">
                                from {item.restaurant}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-primary">
                                  {item.price.toLocaleString()} RWF
                                </span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs font-medium text-muted-foreground">{item.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
        </div>
      </div>
    </div>
  );
}