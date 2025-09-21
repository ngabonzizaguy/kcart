import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, Minus, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { formatPrice } from './menuHelpers';

interface MenuItemCardProps {
  item: any;
  language: 'en' | 'rw';
  quantity: number;
  content: any;
  onAddToCart: () => void;
  onRemoveFromCart?: () => void;
}

export function MenuItemCard({
  item,
  language,
  quantity,
  content,
  onAddToCart,
  onRemoveFromCart
}: MenuItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-3xl overflow-hidden"
    >
      <div className="flex gap-4 p-4">
        {/* Item Image */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted">
            <ImageWithFallback
              src={item.image}
              alt={item.name[language]}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Badges */}
          <div className="absolute -top-2 -right-2 flex flex-col gap-1">
            {item.isPopular && (
              <Badge className="bg-primary text-white text-xs px-2 py-1">
                <Star className="w-3 h-3 mr-1" />
                {content.popular}
              </Badge>
            )}
            {item.isSpicy && (
              <Badge className="bg-destructive text-white text-xs px-2 py-1">
                🌶️
              </Badge>
            )}
            {item.isVegetarian && (
              <Badge className="bg-success text-white text-xs px-2 py-1">
                🌱
              </Badge>
            )}
          </div>
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <h3 className="text-card-foreground font-medium truncate">
              {item.name[language]}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {item.description[language]}
            </p>
          </div>

          {/* Item Stats */}
          <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
            <span>{item.preparationTime} {content.mins}</span>
            <span>{item.calories} {content.cal}</span>
          </div>

          {/* Price and Add Button */}
          <div className="flex items-center justify-between">
            <span className="text-primary font-medium">
              {formatPrice(item.price)}
            </span>
            
            {quantity > 0 ? (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRemoveFromCart}
                  className="w-8 h-8 p-0 rounded-full border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <span className="w-8 text-center font-medium text-foreground">
                  {quantity}
                </span>
                
                <Button
                  size="sm"
                  onClick={onAddToCart}
                  className="w-8 h-8 p-0 rounded-full bg-success hover:bg-success/90 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={onAddToCart}
                className="bg-success hover:bg-success/90 text-white rounded-2xl px-4"
              >
                <Plus className="w-4 h-4 mr-1" />
                {content.add}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      <div className="px-4 pb-4">
        <details className="group">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
            {content.ingredients}
          </summary>
          <div className="mt-2 p-3 bg-muted/50 rounded-2xl">
            <p className="text-sm text-muted-foreground">
              {item.ingredients[language]}
            </p>
          </div>
        </details>
      </div>
    </motion.div>
  );
}