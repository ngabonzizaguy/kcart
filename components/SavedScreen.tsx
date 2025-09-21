import React, { useState } from 'react';
import { ArrowLeft, Heart, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SavedScreenProps {
  language: 'en' | 'rw';
  savedItems: string[];
  onItemSelect: (item: any) => void;
  onToggleSaved: (itemId: string) => void;
  onBack: () => void;
}

export function SavedScreen({ 
  language, 
  savedItems, 
  onItemSelect, 
  onToggleSaved,
  onBack 
}: SavedScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const content = {
    en: {
      saved: 'Saved Items',
      searchPlaceholder: 'Search saved items...',
      noItems: 'No saved items yet',
      noItemsDesc: 'Items you save will appear here for quick access',
      restaurants: 'Restaurants',
      items: 'Items',
      from: 'from'
    },
    rw: {
      saved: 'Ibyo Wabitse',
      searchPlaceholder: 'Shakisha ibyo wabitse...',
      noItems: 'Nta bintu wabitse',
      noItemsDesc: 'Ibintu uzabika bizagaragara hano kugira ngo ubyone vuba',
      restaurants: 'Resitora', 
      items: 'Ibintu',
      from: 'bituruka'
    }
  };

  // Mock saved items
  const mockSavedItems = [
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

  // Filter items based on savedItems array and search
  const filteredItems = mockSavedItems.filter(item => 
    savedItems.includes(item.id) && 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasAnySavedItems = savedItems.length > 0;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="glass border-b border-border/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-accent/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-medium">{content[language].saved}</h1>
          <div className="w-9" />
        </div>

        {/* Search */}
        {hasAnySavedItems && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={content[language].searchPlaceholder}
              className="pl-10 bg-input-background border-border/30 rounded-xl"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {!hasAnySavedItems ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">{content[language].noItems}</h3>
            <p className="text-muted-foreground text-center text-sm">
              {content[language].noItemsDesc}
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {/* Saved Items */}
            {filteredItems.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medium">{content[language].items}</h2>
                  <Badge variant="secondary">{filteredItems.length}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => onItemSelect(item)}
                      className="glass rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all aspect-[3/4]"
                    >
                      <div className="h-full flex flex-col">
                        <div className="relative flex-1 bg-muted">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleSaved(item.id);
                            }}
                            className="absolute top-2 right-2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                          >
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                          </button>
                        </div>
                        
                        <div className="p-3">
                          <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">
                            {content[language].from} {item.restaurant}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-primary">
                              {item.price.toLocaleString()} RWF
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ★ {item.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}