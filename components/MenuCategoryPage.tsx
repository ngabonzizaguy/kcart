import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { MENU_ITEMS_DATA, MENU_CATEGORY_CONTENT, FILTER_OPTIONS, type FilterType } from './menuConstants';
import { filterMenuItems, getItemQuantityInCart, createCartItem } from './menuHelpers';
import { MenuItemCard } from './MenuItemCard';
import type { CartItem } from './types';

interface MenuCategoryPageProps {
  language: 'en' | 'rw';
  category: any;
  vendor: any;
  cartItems: CartItem[];
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onBack: () => void;
}

export function MenuCategoryPage({
  language,
  category,
  vendor,
  cartItems,
  onAddToCart,
  onBack
}: MenuCategoryPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const content = MENU_CATEGORY_CONTENT[language];
  const filteredItems = filterMenuItems(MENU_ITEMS_DATA, selectedFilter, searchQuery, language);

  const handleAddToCart = (item: any) => {
    onAddToCart(createCartItem(item, vendor, language));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/30 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{language === 'en' ? 'Back' : 'Subira'}</span>
            </button>
          </div>

          {/* Category Info */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{category?.icon || '🍽️'}</span>
              <div>
                <h1 className="text-foreground">{category?.name?.[language] || 'Menu Category'}</h1>
                <p className="text-muted-foreground text-sm">{vendor?.name || 'Restaurant'}</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder={content.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {FILTER_OPTIONS.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-card text-muted-foreground hover:bg-accent'
                }`}
              >
                {content[filter]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bottom-nav-spacing">
        {/* Results Count */}
        <div className="mb-4">
          <p className="text-muted-foreground text-sm">
            {filteredItems.length} {content.items}
          </p>
        </div>

        {/* Menu Items */}
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                language={language}
                quantity={getItemQuantityInCart(item.id, cartItems, MENU_ITEMS_DATA, language)}
                content={content}
                onAddToCart={() => handleAddToCart(item)}
                onRemoveFromCart={() => {/* Handle remove */}}
              />
            ))}
          </div>
        ) : (
          // No Results State
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-foreground mb-2">{content.noResults}</h3>
            <p className="text-muted-foreground text-sm">
              {content.tryDifferent}
            </p>
          </div>
        )}
      </div>

      {/* Hide scrollbar styles */}
      <style>
        {`
          .scrollbar-hide {
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}
      </style>
    </div>
  );
}