import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Star, Clock, MapPin, Phone, Heart, ShoppingCart, ChevronRight, Plus, Minus, X, Check, MessageSquare, User, ThumbsUp, Sparkles, Brain, Camera, Mic, Share2, Facebook, Twitter, Instagram, MessageCircle, Calendar, Copy, Link } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import type { CartItem } from './types';
import { ChatModal } from './ChatModal';
import { ReviewsModal } from './ReviewsModal';

const defaultVendorData = {
  id: 'golden-spoon',
  name: 'Golden Spoon Restaurant',
  image: "https://images.unsplash.com/photo-1667388969250-1c7220bf3f37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU1OTcyNjM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  rating: 4.8,
  reviewCount: 150,
  deliveryTime: '25-35',
  distance: '2.1',
  phone: '+250 788 123 456',
  description: {
    en: 'Authentic local and international cuisine prepared with fresh ingredients. Known for our signature grilled dishes and friendly service.',
    rw: 'Ibiryo by\'igihugu n\'amahanga byateguwe n\'ibikoresho bishya. Tuzwiho ibiryo by\'akalanga n\'ubukangurambaga.'
  },
  categories: ['Local Dishes', 'Grilled', 'International'],
  isOpen: true,
  likes: 1847,
  workingDays: {
    en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    rw: ['Ku wa mbere', 'Ku wa kabiri', 'Ku wa gatatu', 'Ku wa kane', 'Ku wa gatanu', 'Ku wa gatandatu']
  },
  workingHours: {
    en: '8:00 AM - 10:00 PM',
    rw: '8:00 N\'inyuma - 10:00 N\'ijoro'
  },
  // ... keeping the same menuItems as before
  menuItems: [
    // Main Dishes
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1682423187670-4817da9a1b23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMG1lYWx8ZW58MXx8fHwxNzU1OTgzNTI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Grilled Chicken Special',
        rw: 'Inkoko y\'Akalanga Idasanzwe'
      },
      description: {
        en: 'Tender grilled chicken with rice and vegetables',
        rw: 'Inkoko yoroshye y\'akalanga hamwe n\'umuceri n\'imboga'
      },
      ingredients: {
        en: 'Chicken breast, rice, mixed vegetables, herbs, olive oil',
        rw: 'Igikono cy\'inkoko, umuceri, imboga zivanze, ibihimbaza, amavuta ya elayo'
      },
      price: 8500,
      category: 'Main Dishes',
      isPopular: true,
      cookingTime: '15-20 mins',
      calories: 520
    }
    // Add other menu items as needed...
  ],
  reviews: [
    {
      id: 1,
      customerName: 'Sarah Johnson',
      rating: 5,
      date: '2 days ago',
      comment: {
        en: 'Absolutely fantastic food! The grilled chicken was perfectly seasoned and cooked to perfection. Delivery was quick and the food arrived hot. Will definitely order again!',
        rw: 'Ibiryo byiza cyane! Inkoko y\'akalanga yari ifite uburyohe bwiza kandi iteguwe neza. Ugutanga kwari vuba kandi ibiryo byageze bishyushye. Ndazongera gusaba!'
      },
      helpful: 12
    }
    // Add other reviews as needed...
  ]
};

// Menu categories data
const menuCategories = [
  {
    id: 'main-dishes',
    name: { en: 'Main Dishes', rw: 'Ibiryo Bikuru' },
    icon: '🍖',
    description: { en: 'Hearty main courses and specialties', rw: 'Ibiryo bikuru n\'ibyiza' },
    itemCount: 8,
    image: "https://images.unsplash.com/photo-1682423187670-4817da9a1b23?w=300"
  }
  // Add other categories as needed...
];

interface VendorProfileProps {
  language: 'en' | 'rw';
  vendor?: any;
  cartItems: CartItem[];
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onProductSelect?: (product: any) => void;
  onBack: () => void;
  onViewCart: () => void;
  onAIFeatureOpen?: () => void;
}

export function VendorProfile({ 
  language, 
  vendor,
  cartItems, 
  onAddToCart,
  onProductSelect,
  onBack, 
  onViewCart,
  onAIFeatureOpen
}: VendorProfileProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(menuCategories[0]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(1);

  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');
  const [showAllMenuItems, setShowAllMenuItems] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Use the complete vendor data - merge provided vendor with defaults
  const finalVendorData = vendor ? {
    ...defaultVendorData,
    ...vendor,
    likes: vendor?.likes || defaultVendorData.likes,
    workingDays: vendor?.workingDays || defaultVendorData.workingDays,
    workingHours: vendor?.workingHours || defaultVendorData.workingHours,
    categories: vendor?.categories || defaultVendorData.categories,
    description: vendor?.description || defaultVendorData.description,
    menuItems: vendor?.menuItems || defaultVendorData.menuItems,
    reviews: vendor?.reviews || defaultVendorData.reviews
  } : defaultVendorData;

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Handle sharing functionality
  const handleShare = (platform: string) => {
    const vendorUrl = `https://deligo.app/vendor/${finalVendorData.id}`;
    const shareText = `Check out ${finalVendorData.name} on DeliGo! Amazing food with ${finalVendorData.rating} stars rating.`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(vendorUrl)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(vendorUrl)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + vendorUrl)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(vendorUrl);
        alert(language === 'en' ? 'Link copied to clipboard!' : 'Link yakopejwe!');
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: finalVendorData.name,
            text: shareText,
            url: vendorUrl,
          });
        }
    }
    setShowShareModal(false);
  };

  const content = {
    en: {
      reviews: 'reviews',
      mins: 'mins',
      km: 'km',
      menu: 'Menu',
      likes: 'likes',
      workingDays: 'Working Days',
      workingHours: 'Hours',
      shareVendor: 'Share Restaurant',
      shareOn: 'Share on',
      copyLink: 'Copy Link',
      sunday: 'Closed on Sunday',
      closedToday: 'Closed Today',
      openToday: 'Open Today'
    },
    rw: {
      reviews: 'amasuzuma',
      mins: 'iminota',
      km: 'km',
      menu: 'Urutonde',
      likes: 'ukunda',
      workingDays: 'Iminsi y\'Akazi',
      workingHours: 'Amasaha',
      shareVendor: 'Sangira Restaurant',
      shareOn: 'Sangira kuri',
      copyLink: 'Kopera Link',
      sunday: 'Ifunze ku cyumweru',
      closedToday: 'Ifunze Uyu munsi',
      openToday: 'Ifunze Uyu munsi'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-orange-100 relative">
      {/* Header Section with Enhanced Information */}
      <div className="relative h-64 bg-gradient-to-br from-orange-100 to-orange-200">
        <ImageWithFallback
          src={finalVendorData.image}
          alt={finalVendorData.name}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-3 bg-white/90 backdrop-blur-sm rounded-full text-foreground hover:bg-white transition-all duration-200 shadow-lg z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Share Button */}
        <button
          onClick={() => setShowShareModal(true)}
          className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-sm rounded-full text-foreground hover:bg-white transition-all duration-200 shadow-lg z-10"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {/* Vendor Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-xl">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h1 className="text-foreground text-xl font-bold truncate">{finalVendorData.name}</h1>
                <p className="text-muted-foreground text-sm">{finalVendorData.categories.join(' • ')}</p>
              </div>
              
              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isFavorite 
                    ? 'bg-red-100 text-red-500' 
                    : 'bg-muted text-muted-foreground hover:bg-red-100 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Enhanced Stats Row */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-foreground font-semibold text-sm">{finalVendorData.rating}</span>
                </div>
                <span className="text-muted-foreground text-xs">{finalVendorData.reviewCount} {content[language].reviews}</span>
              </div>
              
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-foreground font-semibold text-sm">{finalVendorData.deliveryTime}</span>
                </div>
                <span className="text-muted-foreground text-xs">{content[language].mins}</span>
              </div>
              
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-foreground font-semibold text-sm">{finalVendorData.distance}</span>
                </div>
                <span className="text-muted-foreground text-xs">{content[language].km}</span>
              </div>

              {/* Likes - Now in Vendor Profile */}
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  <span className="text-foreground font-semibold text-sm">{finalVendorData.likes.toLocaleString()}</span>
                </div>
                <span className="text-muted-foreground text-xs">{content[language].likes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Information Section */}
      <div className="px-6 py-4">
        {/* Working Days and Hours */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-orange-500" />
            <h3 className="text-foreground font-semibold">{content[language].workingDays}</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex flex-wrap gap-1 mb-2">
                {finalVendorData.workingDays[language].map((day: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                    {day}
                  </Badge>
                ))}
              </div>
              <p className="text-muted-foreground text-xs">{content[language].sunday}</p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 mb-1">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-foreground font-semibold text-sm">{finalVendorData.workingHours[language]}</span>
              </div>
              <Badge variant="outline" className={`text-xs ${finalVendorData.isOpen ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}`}>
                {finalVendorData.isOpen ? content[language].openToday : content[language].closedToday}
              </Badge>
            </div>
          </div>
        </div>

        {/* Rest of the menu content would continue here... */}
        <div className="text-center py-8">
          <p className="text-muted-foreground">Menu content will be displayed here...</p>
        </div>
      </div>

      {/* Share Modal */}
      <Sheet open={showShareModal} onOpenChange={setShowShareModal}>
        <SheetContent side="bottom" className="h-[50vh] bg-background/95 backdrop-blur-xl border-t border-border/30 rounded-t-3xl">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-foreground text-xl font-semibold">
              {content[language].shareVendor}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              {content[language].shareOn}
            </SheetDescription>
          </SheetHeader>

          <div className="grid grid-cols-2 gap-4">
            {/* Facebook */}
            <Button
              onClick={() => handleShare('facebook')}
              variant="outline"
              className="h-16 flex flex-col gap-2 border-2 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Facebook className="w-6 h-6" />
              <span className="text-xs">Facebook</span>
            </Button>

            {/* Twitter */}
            <Button
              onClick={() => handleShare('twitter')}
              variant="outline"
              className="h-16 flex flex-col gap-2 border-2 border-sky-200 text-sky-600 hover:bg-sky-50"
            >
              <Twitter className="w-6 h-6" />
              <span className="text-xs">Twitter</span>
            </Button>

            {/* WhatsApp */}
            <Button
              onClick={() => handleShare('whatsapp')}
              variant="outline"
              className="h-16 flex flex-col gap-2 border-2 border-green-200 text-green-600 hover:bg-green-50"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs">WhatsApp</span>
            </Button>

            {/* Copy Link */}
            <Button
              onClick={() => handleShare('copy')}
              variant="outline"
              className="h-16 flex flex-col gap-2 border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <Copy className="w-6 h-6" />
              <span className="text-xs">{content[language].copyLink}</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}