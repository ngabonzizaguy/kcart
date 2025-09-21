import React, { useState } from 'react';
import { ArrowLeft, Heart, Plus, Minus, Star, Clock, Truck } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { CartItem } from './MainApp';

interface ProductDetailProps {
  language: 'en' | 'rw';
  product: any;
  vendor: any;
  savedItems: string[];
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onToggleSaved: (itemId: string) => void;
  onBack: () => void;
}

export function ProductDetail({ 
  language, 
  product, 
  vendor,
  savedItems,
  onAddToCart, 
  onToggleSaved,
  onBack 
}: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [customizations, setCustomizations] = useState<string[]>([]);

  const content = {
    en: {
      addToCart: 'Add to Cart',
      quantity: 'Quantity',
      customizations: 'Customizations',
      description: 'Description',
      nutrition: 'Nutrition Info',
      reviews: 'Reviews',
      deliveryTime: 'Delivery Time',
      vendor: 'From',
      sizes: 'Size',
      extras: 'Add Extras',
      spicyLevel: 'Spice Level',
      allergies: 'Allergen Info',
      ingredients: 'Ingredients'
    },
    rw: {
      addToCart: 'Shyira mu Kibindi',
      quantity: 'Umubare',
      customizations: 'Guhindura',
      description: 'Ibisobanuro',
      nutrition: 'Intungamubiri',
      reviews: 'Ibitekerezo',
      deliveryTime: 'Igihe cyo Gutanga',
      vendor: 'Bituruka',
      sizes: 'Ubunini',
      extras: 'Ongeraho',
      spicyLevel: 'Urwego rw\'Ububabu',
      allergies: 'Amakuru ku Ndwara',
      ingredients: 'Ibigize'
    }
  };

  const mockProduct = product || {
    id: '1',
    name: 'Grilled Chicken Combo',
    description: 'Perfectly seasoned grilled chicken served with rice, vegetables, and your choice of sauce',
    price: 8500,
    image: '',
    category: 'Main Course',
    rating: 4.8,
    reviews: 124,
    cookTime: '15-20 min',
    calories: 650,
    ingredients: ['Chicken breast', 'Basmati rice', 'Mixed vegetables', 'Garlic sauce'],
    allergens: ['None'],
    sizes: [
      { name: 'Regular', price: 0 },
      { name: 'Large', price: 2000 }
    ],
    extras: [
      { name: 'Extra Sauce', price: 500 },
      { name: 'Extra Rice', price: 1000 },
      { name: 'Avocado', price: 1500 }
    ],
    spiceLevels: ['Mild', 'Medium', 'Hot']
  };

  const isSaved = savedItems.includes(mockProduct.id);
  const totalPrice = mockProduct.price + 
    (selectedSize === 'Large' ? 2000 : 0) + 
    customizations.reduce((sum, extra) => {
      const extraItem = mockProduct.extras.find((e: any) => e.name === extra);
      return sum + (extraItem?.price || 0);
    }, 0);

  const handleAddToCart = () => {
    onAddToCart({
      name: mockProduct.name,
      price: totalPrice,
      quantity,
      image: mockProduct.image,
      vendorId: vendor?.id || '1',
      vendorName: vendor?.name || 'Sample Restaurant',
      description: mockProduct.description,
      customizations: [
        ...(selectedSize ? [`Size: ${selectedSize}`] : []),
        ...customizations.map(c => `Extra: ${c}`)
      ].filter(Boolean)
    });

    // Show success feedback
    alert(language === 'en' 
      ? `Added ${quantity}x ${mockProduct.name} to cart!`
      : `Byashyizwe mu kibindi: ${quantity}x ${mockProduct.name}!`
    );
  };

  const toggleCustomization = (extra: string) => {
    setCustomizations(prev =>
      prev.includes(extra)
        ? prev.filter(c => c !== extra)
        : [...prev, extra]
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 glass border-b border-border/20">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-accent/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        
        <button
          onClick={() => onToggleSaved(mockProduct.id)}
          className="p-2 rounded-full hover:bg-accent/50 transition-colors"
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Product Image */}
        <div className="relative h-64 bg-muted">
          <ImageWithFallback
            src={mockProduct.image}
            alt={mockProduct.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Floating Info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-background/90">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                {mockProduct.rating}
              </Badge>
              <Badge variant="secondary" className="bg-background/90">
                <Clock className="w-3 h-3 mr-1" />
                {mockProduct.cookTime}
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Product Info */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-foreground text-xl font-medium flex-1">{mockProduct.name}</h1>
              <span className="text-primary font-medium text-lg">
                {totalPrice.toLocaleString()} RWF
              </span>
            </div>
            
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              {mockProduct.description}
            </p>

            {/* Vendor Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="w-4 h-4" />
              <span>{content[language].vendor} {vendor?.name || 'Sample Restaurant'}</span>
            </div>
          </div>

          <Separator className="opacity-30" />

          {/* Size Selection */}
          {mockProduct.sizes && mockProduct.sizes.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">{content[language].sizes}</h3>
              <div className="grid grid-cols-2 gap-2">
                {mockProduct.sizes.map((size: any) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedSize === size.name
                        ? 'border-primary bg-primary/10'
                        : 'border-border/30 bg-muted/30'
                    }`}
                  >
                    <div className="text-sm font-medium">{size.name}</div>
                    {size.price > 0 && (
                      <div className="text-xs text-muted-foreground">
                        +{size.price.toLocaleString()} RWF
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extras */}
          {mockProduct.extras && mockProduct.extras.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">{content[language].extras}</h3>
              <div className="space-y-2">
                {mockProduct.extras.map((extra: any) => (
                  <button
                    key={extra.name}
                    onClick={() => toggleCustomization(extra.name)}
                    className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                      customizations.includes(extra.name)
                        ? 'border-primary bg-primary/10'
                        : 'border-border/30 bg-muted/30'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{extra.name}</span>
                      <span className="text-sm text-muted-foreground">
                        +{extra.price.toLocaleString()} RWF
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients */}
          <div>
            <h3 className="font-medium mb-3">{content[language].ingredients}</h3>
            <div className="flex flex-wrap gap-2">
              {mockProduct.ingredients.map((ingredient: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-muted/50">
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>

          {/* Nutrition Info */}
          <div>
            <h3 className="font-medium mb-3">{content[language].nutrition}</h3>
            <div className="glass p-4 rounded-xl">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Calories</span>
                <span className="font-medium">{mockProduct.calories}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 glass-strong border-t border-border/20 p-4 safe-area-pb">
        <div className="flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{content[language].quantity}</span>
            <div className="flex items-center border border-border/30 rounded-xl bg-background/50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-accent/50 transition-colors rounded-l-xl"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 font-medium min-w-[40px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-accent/50 transition-colors rounded-r-xl"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button 
            onClick={handleAddToCart}
            className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
          >
            {content[language].addToCart} • {(totalPrice * quantity).toLocaleString()} RWF
          </Button>
        </div>
      </div>
    </div>
  );
}