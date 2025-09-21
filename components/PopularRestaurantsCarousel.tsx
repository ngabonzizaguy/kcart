import React, { useRef, useState, useEffect } from 'react';
import { Star, Clock, MapPin, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

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
  likes: number;
}

interface PopularRestaurantsCarouselProps {
  language: 'en' | 'rw';
  restaurants: Restaurant[];
  onRestaurantSelect: (restaurant: Restaurant) => void;
  onViewAll: () => void;
}

export function PopularRestaurantsCarousel({ 
  language, 
  restaurants, 
  onRestaurantSelect, 
  onViewAll 
}: PopularRestaurantsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  // Safety check for restaurants data
  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="mb-8 px-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
          <p className="text-muted-foreground text-center">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  // Format price display
  const formatPrice = (price: number) => {
    return price === 0 ? (language === 'en' ? 'Free' : 'Ubuntu') : `${price.toLocaleString()} RWF`;
  };

  // Handle scroll to update focused card
  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const scrollLeft = scrollRef.current.scrollLeft;
    const cardWidth = 280; // Card width + gap
    const newFocusedIndex = Math.round(scrollLeft / cardWidth);
    setFocusedIndex(Math.min(newFocusedIndex, restaurants.length - 1));
  };

  // Content translations
  const content = {
    en: {
      popularRestaurants: 'Popular Restaurants',
      viewAll: 'View all',
      viewMenu: 'View Menu',
      order: 'Order',
      orders: 'orders',
      likes: 'likes',
      delivery: 'Delivery'
    },
    rw: {
      popularRestaurants: 'Ibibanza Bikunda',
      viewAll: 'Reba byose',
      viewMenu: 'Reba Menu',
      order: 'Tumiza',
      orders: 'ibisabwa',
      likes: 'ukunda',
      delivery: 'Gutanga'
    }
  };

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-6">
        <h2 className="text-foreground text-lg font-medium">
          {content[language].popularRestaurants}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
        >
          {content[language].viewAll}
        </Button>
      </div>

      {/* Horizontal Carousel Container - Fixed Clipping */}
      <div className="relative">
        {/* Scrollable Container - Mobile Native Horizontal Scroll with proper spacing */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 px-6 py-2 overflow-x-auto overflow-y-visible scrollbar-hide snap-x snap-mandatory"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'auto',
            touchAction: 'pan-x pan-y' // Allow both horizontal and vertical scrolling
          }}
        >
          {restaurants.map((restaurant, index) => {
            const isFocused = index === focusedIndex;
            
            return (
              <div
                key={restaurant.id}
                className="flex-shrink-0 w-64 snap-center touch-manipulation"
              >
                {/* Restaurant Card - Professional Compact Design */}
                <div 
                  onClick={() => onRestaurantSelect(restaurant)}
                  className="bg-white/85 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/95 hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
                >
                  {/* Restaurant Image - Reduced Height */}
                  <div className="relative h-28 bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden">
                    <ImageWithFallback
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Popular Badge - Compact Styling */}
                    <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 font-medium shadow-sm">
                      #{index + 1}
                    </Badge>
                    
                    {/* Favorite Button - Compact */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle favorite toggle
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-muted-foreground hover:text-red-500 hover:bg-white transition-all duration-200 shadow-sm"
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Restaurant Info - Compact Professional Design */}
                  <div className="p-3 flex flex-col h-full">
                    {/* Name and Rating */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-foreground font-semibold truncate text-sm leading-tight">
                          {restaurant.name}
                        </h3>
                        <p className="text-muted-foreground text-xs truncate mt-0.5">
                          {restaurant.category[language]}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2 flex-shrink-0 bg-yellow-50 px-1.5 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-foreground text-xs font-semibold">
                          {restaurant.rating}
                        </span>
                      </div>
                    </div>

                    {/* Details Row - Compact Layout */}
                    <div className="flex items-center gap-3 text-muted-foreground text-xs mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-500" />
                        <span className="font-medium">{restaurant.deliveryTime}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-500" />
                        <span className="font-medium">{restaurant.distance}</span>
                      </div>
                    </div>

                    {/* Orders and Delivery Info - Compact Design */}
                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/30 mb-3">
                      <div className="text-muted-foreground font-medium">
                        {restaurant.orders.toLocaleString()}+ {content[language].orders}
                      </div>
                      <div className="text-right">
                        <span className={`font-semibold text-xs ${
                          restaurant.deliveryFee === 0 
                            ? 'text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md' 
                            : 'text-foreground'
                        }`}>
                          {formatPrice(restaurant.deliveryFee)}
                        </span>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {content[language].delivery}
                        </div>
                      </div>
                    </div>

                    {/* Compact Action Buttons */}
                    <div className="grid grid-cols-2 gap-1.5 mt-auto">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRestaurantSelect(restaurant);
                        }}
                        variant="outline"
                        size="sm"
                        className="border border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 rounded-lg h-7 text-xs font-medium transition-all duration-200"
                      >
                        {content[language].viewMenu}
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate directly to restaurant with intention to order
                          onRestaurantSelect(restaurant);
                        }}
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg h-7 text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        {content[language].order}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {restaurants.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === focusedIndex ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* CSS for hiding scrollbars - moved to inline styles */}
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
}