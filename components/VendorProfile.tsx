import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Star, Clock, MapPin, Phone, Heart, ShoppingCart, ChevronRight, Plus, Minus, X, Check, MessageSquare, User, ThumbsUp, Sparkles, Brain, Camera, Mic, Share2, Facebook, Twitter, Instagram, MessageCircle, Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import type { CartItem } from './types';
import { ChatModal } from './ChatModal';
import { ReviewsModal } from './ReviewsModal';

// VendorProfile component props interface
interface VendorProfileProps {
  language: 'en' | 'rw';
  vendor: any;
  cartItems: CartItem[];
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onProductSelect?: (product: any) => void;
  onBack: () => void;
  onViewCart?: () => void;
  onAIFeatureOpen?: (feature: string) => void;
}

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
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1627123339985-c62c6b3c1cc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWslMjBncmlsbGVkfGVufDF8fHx8MTc1NTk4MzUyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Grilled Beef Steak',
        rw: 'Inyama y\'Inka y\'Akalanga'
      },
      description: {
        en: 'Premium beef steak with mashed potatoes and gravy',
        rw: 'Inyama y\'inka nziza hamwe n\'ibirayi n\'amavuta'
      },
      ingredients: {
        en: 'Beef sirloin, potatoes, butter, herbs, black pepper',
        rw: 'Inyama y\'inka, ibirayi, amavuta y\'amata, ibihimbaza, urusenda'
      },
      price: 12500,
      category: 'Main Dishes',
      isPopular: true,
      cookingTime: '25-30 mins',
      calories: 680
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwZGlzaCUyMGdyaWxsZWR8ZW58MXx8fHwxNzU1OTgzNTI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Traditional Rice Platter',
        rw: 'Umuceri w\'Igihugu'
      },
      description: {
        en: 'Traditional rice with beans and mixed vegetables',
        rw: 'Umuceri w\'igihugu hamwe n\'ibirayi n\'imboga'
      },
      ingredients: {
        en: 'Rice, beans, carrots, onions, tomatoes, spices',
        rw: 'Umuceri, ibirayi, karoti, igitunguru, nyanya, ibirungo'
      },
      price: 5500,
      category: 'Main Dishes',
      cookingTime: '20-25 mins',
      calories: 420
    },

    // Burgers
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwYnVyZ2VyJTIwZnJpZXN8ZW58MXx8fHwxNzU1OTgzNTI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Classic Beef Burger',
        rw: 'Burger y\'Inyama y\'Inka'
      },
      description: {
        en: 'Juicy beef patty with fresh vegetables and fries',
        rw: 'Inyama y\'inka n\'imboga nshya hamwe na fries'
      },
      ingredients: {
        en: 'Beef patty, lettuce, tomato, onion, pickles, burger sauce, fries',
        rw: 'Inyama y\'inka, lettuce, nyanya, igitunguru, pickles, sauce, fries'
      },
      price: 7200,
      category: 'Burgers',
      cookingTime: '12-15 mins',
      calories: 590
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnVyZ2VyfGVufDF8fHx8MTc1NTk4MzUyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Crispy Chicken Burger',
        rw: 'Burger y\'Inkoko Ikamye'
      },
      description: {
        en: 'Crispy fried chicken with coleslaw and spicy mayo',
        rw: 'Inkoko ikamye hamwe na coleslaw na mayo ikaze'
      },
      ingredients: {
        en: 'Chicken breast, flour coating, coleslaw, spicy mayo, brioche bun',
        rw: 'Igikono cy\'inkoko, ubufumbire, coleslaw, mayo ikaze, ubugati'
      },
      price: 6800,
      category: 'Burgers',
      isPopular: true,
      cookingTime: '10-12 mins',
      calories: 480
    },
    {
      id: 10,
      image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFyaWFuJTIwYnVyZ2VyfGVufDF8fHx8MTc1NTk4MzUyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Veggie Delight Burger',
        rw: 'Burger y\'Imboga'
      },
      description: {
        en: 'Plant-based patty with avocado and fresh greens',
        rw: 'Patty y\'ibimera hamwe na avocado n\'imboga nshya'
      },
      ingredients: {
        en: 'Plant-based patty, avocado, lettuce, tomato, red onion, vegan mayo',
        rw: 'Patty y\'ibimera, avocado, lettuce, nyanya, igitunguru gitukura, mayo'
      },
      price: 6500,
      category: 'Burgers',
      cookingTime: '8-10 mins',
      calories: 380
    },

    // Pizza
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1616141395675-7c92399f800e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHNsaWNlJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NTU5ODM1Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Margherita Pizza',
        rw: 'Pizza Margherita'
      },
      description: {
        en: 'Classic Italian pizza with fresh basil and mozzarella',
        rw: 'Pizza y\'Ubutaliyani hamwe na basil na mozzarella'
      },
      ingredients: {
        en: 'Pizza dough, tomato sauce, mozzarella cheese, fresh basil, olive oil',
        rw: 'Ubugati bwa pizza, sauce ya nyanya, fromage mozzarella, basil, amavuta'
      },
      price: 8800,
      category: 'Pizza',
      cookingTime: '15-18 mins',
      calories: 320
    },
    {
      id: 11,
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHBlcHBlcm9uaXxlbnwxfHx8fDE3NTU5ODM1MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Pepperoni Supreme',
        rw: 'Pizza Pepperoni Nkuru'
      },
      description: {
        en: 'Loaded with pepperoni, cheese and Italian herbs',
        rw: 'Pepperoni nyinshi, fromage n\'ibihimbaza by\'Ubutaliyani'
      },
      ingredients: {
        en: 'Pizza dough, tomato sauce, mozzarella, pepperoni, oregano, parmesan',
        rw: 'Ubugati bwa pizza, sauce, mozzarella, pepperoni, oregano, parmesan'
      },
      price: 10500,
      category: 'Pizza',
      isPopular: true,
      cookingTime: '15-18 mins',
      calories: 420
    },

    // Pasta
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2h8ZW58MXx8fHwxNzU1OTI5OTg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Creamy Pasta Delight',
        rw: 'Pasta y\'Amavuta'
      },
      description: {
        en: 'Rich creamy pasta with mushrooms and herbs',
        rw: 'Pasta y\'amavuta hamwe n\'ibihumye n\'ibihimbaza'
      },
      ingredients: {
        en: 'Fettuccine, cream, mushrooms, garlic, parsley, parmesan',
        rw: 'Fettuccine, amavuta, ibihumye, tungurusumu, parsley, parmesan'
      },
      price: 6800,
      category: 'Pasta',
      cookingTime: '12-15 mins',
      calories: 450
    },
    {
      id: 12,
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHRvbWF0byUyMHNhdWNlfGVufDF8fHx8MTc1NTk4MzUzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Spaghetti Bolognese',
        rw: 'Spaghetti Bolognese'
      },
      description: {
        en: 'Traditional meat sauce pasta with fresh herbs',
        rw: 'Pasta n\'sauce y\'inyama hamwe n\'ibihimbaza bishya'
      },
      ingredients: {
        en: 'Spaghetti, ground beef, tomatoes, onions, carrots, red wine, basil',
        rw: 'Spaghetti, inyama y\'inka, nyanya, igitunguru, karoti, wine, basil'
      },
      price: 7500,
      category: 'Pasta',
      isPopular: true,
      cookingTime: '18-20 mins',
      calories: 520
    },

    // Salads
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBzYWxhZHxlbnwxfHx8fDE3NTU5ODM1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Fresh Garden Salad',
        rw: 'Saladi y\'Ubusitani'
      },
      description: {
        en: 'Mixed greens with fresh vegetables and dressing',
        rw: 'Imboga zitandukanye hamwe n\'amavuta'
      },
      ingredients: {
        en: 'Mixed lettuce, tomatoes, cucumbers, carrots, bell peppers, vinaigrette',
        rw: 'Lettuce zivanze, nyanya, intoryi, karoti, pilipili, vinaigrette'
      },
      price: 4500,
      category: 'Salads',
      cookingTime: '5 mins',
      calories: 120
    },
    {
      id: 13,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZHxlbnwxfHx8fDE3NTU5ODM1MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Caesar Salad Supreme',
        rw: 'Saladi Caesar Nkuru'
      },
      description: {
        en: 'Crispy romaine with parmesan and croutons',
        rw: 'Romaine ikamye hamwe na parmesan n\'ubugati bukamye'
      },
      ingredients: {
        en: 'Romaine lettuce, parmesan cheese, croutons, caesar dressing, anchovies',
        rw: 'Lettuce romaine, fromage parmesan, ubugati bukamye, sauce caesar'
      },
      price: 5800,
      category: 'Salads',
      cookingTime: '5 mins',
      calories: 180
    },

    // Seafood
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1636381310569-b4084c665f66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwc2VhZm9vZCUyMHBsYXRlfGVufDF8fHx8MTc1NTk4MzUyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Grilled Fish Platter',
        rw: 'Amafi y\'Akalanga'
      },
      description: {
        en: 'Fresh grilled fish with lemon and seasonal vegetables',
        rw: 'Amafi y\'akalanga hamwe na lemon n\'imboga z\'igihe'
      },
      ingredients: {
        en: 'Fresh tilapia, lemon, herbs, olive oil, seasonal vegetables',
        rw: 'Amafi mashya ya tilapia, lemon, ibihimbaza, amavuta, imboga z\'igihe'
      },
      price: 9200,
      category: 'Seafood',
      cookingTime: '15-18 mins',
      calories: 380
    },
    {
      id: 14,
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBmaXNoJTIwZ3JpbGxlZHxlbnwxfHx8fDE3NTU5ODM1MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Grilled Salmon Fillet',
        rw: 'Amafi ya Salmon y\'Akalanga'
      },
      description: {
        en: 'Premium salmon with teriyaki glaze and rice',
        rw: 'Amafi ya salmon nziza hamwe na teriyaki n\'umuceri'
      },
      ingredients: {
        en: 'Salmon fillet, teriyaki sauce, sesame seeds, steamed rice, broccoli',
        rw: 'Amafi ya salmon, sauce teriyaki, imbuto za sesame, umuceri, broccoli'
      },
      price: 14500,
      category: 'Seafood',
      isPopular: true,
      cookingTime: '12-15 mins',
      calories: 480
    },

    // Drinks
    {
      id: 15,
      image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGp1aWNlJTIwZ2xhc3N8ZW58MXx8fHwxNzU1OTgzNTMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Fresh Orange Juice',
        rw: 'Amajwi ya Chungwa Mashya'
      },
      description: {
        en: 'Freshly squeezed orange juice with no additives',
        rw: 'Amajwi ya chungwa akamye nta bikoresho byongeweho'
      },
      ingredients: {
        en: 'Fresh oranges',
        rw: 'Amachungwa mashya'
      },
      price: 2500,
      category: 'Drinks',
      cookingTime: '2 mins',
      calories: 110
    },
    {
      id: 16,
      image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxrc2hha2UlMjBzdHJhd2JlcnJ5fGVufDF8fHx8MTc1NTk4MzUzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Strawberry Milkshake',
        rw: 'Milkshake ya Strawberry'
      },
      description: {
        en: 'Creamy strawberry milkshake with whipped cream',
        rw: 'Milkshake ya strawberry n\'amavuta y\'amata akamye'
      },
      ingredients: {
        en: 'Fresh strawberries, milk, vanilla ice cream, whipped cream',
        rw: 'Strawberry nshya, amata, ice cream ya vanilla, amavuta akamye'
      },
      price: 3800,
      category: 'Drinks',
      isPopular: true,
      cookingTime: '3 mins',
      calories: 280
    },

    // Desserts
    {
      id: 17,
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBjYWtlJTIwc2xpY2V8ZW58MXx8fHwxNzU1OTgzNTMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Chocolate Fudge Cake',
        rw: 'Keke ya Chocolate'
      },
      description: {
        en: 'Rich chocolate cake with fudge frosting',
        rw: 'Keke ya chocolate ikomeye n\'amavuta ya chocolate'
      },
      ingredients: {
        en: 'Chocolate, flour, eggs, butter, sugar, cocoa powder, cream',
        rw: 'Chocolate, ubufumbire, amagi, amavuta y\'amata, isukari, cocoa, amavuta'
      },
      price: 4200,
      category: 'Desserts',
      isPopular: true,
      cookingTime: '5 mins',
      calories: 420
    },
    {
      id: 18,
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2UlMjBjcmVhbSUyMHN1bmRhZXxlbnwxfHx8fDE3NTU5ODM1MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: {
        en: 'Ice Cream Sundae',
        rw: 'Ice Cream Sundae'
      },
      description: {
        en: 'Vanilla ice cream with chocolate sauce and nuts',
        rw: 'Ice cream ya vanilla hamwe na sauce ya chocolate n\'ubunyobwa'
      },
      ingredients: {
        en: 'Vanilla ice cream, chocolate sauce, whipped cream, nuts, cherry',
        rw: 'Ice cream ya vanilla, sauce ya chocolate, amavuta akamye, ubunyobwa'
      },
      price: 3500,
      category: 'Desserts',
      cookingTime: '2 mins',
      calories: 320
    }
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
    },
    {
      id: 2,
      customerName: 'Michael Chen',
      rating: 4,
      date: '5 days ago',  
      comment: {
        en: 'Great variety of dishes and good quality ingredients. The pasta was creamy and delicious. Only minor issue was the delivery took a bit longer than expected.',
        rw: 'Ibiryo bitandukanye byinshi kandi ibikoresho byiza. Pasta yari ifite amavuta kandi iryoshye. Ikibazo gito ni uko ugutanga kwatinze gato kuruta uko twari dutekereje.'
      },
      helpful: 8
    },
    {
      id: 3,
      customerName: 'Amina Uwimana',
      rating: 5,
      date: '1 week ago',
      comment: {
        en: 'This is my go-to restaurant for authentic local dishes! The traditional rice platter reminds me of home. Excellent service and always fresh ingredients.',
        rw: 'Iyi ni restaurant yanjye nkunda cyane mu biryo by\'igihugu! Umuceri w\'igihugu wanyibutsa urugo. Serivisi nziza kandi ibikoresho bihora bishya.'
      },
      helpful: 15
    },
    {
      id: 4,
      customerName: 'David Rodriguez',
      rating: 4,
      date: '1 week ago',
      comment: {
        en: 'The burgers are amazing! Juicy, flavorful, and generously sized. The fries were crispy and well-seasoned. Good value for money.',
        rw: 'Burgers ni nziza cyane! Zifite amazi, uburyohe, kandi ni nini. Fries zari zikamye kandi zifite uburyohe bwiza. Igiciro cyiza ugereranije n\'icyo uhabwa.'
      },
      helpful: 6
    },
    {
      id: 5,
      customerName: 'Grace Mukamana',
      rating: 5,
      date: '2 weeks ago',
      comment: {
        en: 'Outstanding pizza! The crust was perfect - crispy outside and soft inside. Fresh toppings and generous cheese. Highly recommend the Margherita!',
        rw: 'Pizza idasanzwe! Ubugati bwayo bwari bwiza - bukamye hanze kandi buroroshye imbere. Ibyo bishyirwaho bishya kandi fromage nyinshi. Ndasaba cyane Margherita!'
      },
      helpful: 11
    },
    {
      id: 6,
      customerName: 'James Mutoni',
      rating: 3,
      date: '2 weeks ago',
      comment: {
        en: 'Food was okay, but not exceptional. The seafood was fresh but could use more seasoning. Service was friendly though.',
        rw: 'Ibiryo byari bisanzwe, ariko ntabwo byari bidasanzwe. Amafi yari ashya ariko yakeneye uburyohe bwiyongera. Serivisi yari nziza ariko.'
      },
      helpful: 3
    }
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
  },
  {
    id: 'burgers',
    name: { en: 'Burgers', rw: 'Burgers' },
    icon: '🍔',
    description: { en: 'Juicy burgers with fresh ingredients', rw: 'Burgers n\'ibikoresho bishya' },
    itemCount: 5,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=300"
  },
  {
    id: 'pizza',
    name: { en: 'Pizza', rw: 'Pizza' },
    icon: '🍕',
    description: { en: 'Fresh pizza with authentic flavors', rw: 'Pizza n\'uburyo busanzwe' },
    itemCount: 6,
    image: "https://images.unsplash.com/photo-1616141395675-7c92399f800e?w=300"
  },
  {
    id: 'pasta',
    name: { en: 'Pasta', rw: 'Pasta' },
    icon: '🍝',
    description: { en: 'Italian pasta dishes and sauces', rw: 'Pasta y\'Ubutaliyani n\'amavuta' },
    itemCount: 4,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300"
  },
  {
    id: 'salads',
    name: { en: 'Salads', rw: 'Saladi' },
    icon: '🥗',
    description: { en: 'Fresh and healthy salad options', rw: 'Saladi nziza n\'ubuzima' },
    itemCount: 3,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300"
  },
  {
    id: 'seafood',
    name: { en: 'Seafood', rw: 'Amafi' },
    icon: '🐟',
    description: { en: 'Fresh fish and seafood specialties', rw: 'Amafi mashya n\'ibyiza' },
    itemCount: 4,
    image: "https://images.unsplash.com/photo-1636381310569-b4084c665f66?w=300"
  },
  {
    id: 'drinks',
    name: { en: 'Drinks', rw: 'Ibinyobwa' },
    icon: '🥤',
    description: { en: 'Refreshing beverages and juices', rw: 'Ibinyobwa n\'amajwi' },
    itemCount: 12,
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300"
  },
  {
    id: 'desserts',
    name: { en: 'Desserts', rw: 'Ibinyamunyu' },
    icon: '🍰',
    description: { en: 'Sweet treats and desserts', rw: 'Ibinyamunyu n\'ibyiza' },
    itemCount: 6,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300"
  }
];

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
    image: "https://images.unsplash.com/photo-1667388969250-1c7220bf3f37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU1OTcyNjM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
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
    // Ensure critical properties have fallbacks
    categories: vendor?.categories || defaultVendorData.categories,
    description: vendor?.description || defaultVendorData.description,
    menuItems: vendor?.menuItems || defaultVendorData.menuItems,
    reviews: vendor?.reviews || defaultVendorData.reviews
  } : defaultVendorData;

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  const totalCartItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Handle menu category selection
  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
  };

  // Handle item click to open modal
  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setItemQuantity(1);
    setSpecialNotes('');
    // Parse ingredients and set all as selected by default
    const ingredients = item.ingredients[language].split(', ');
    setSelectedIngredients(ingredients);
    setIsModalOpen(true);
  };

  // Handle adding item to cart from modal
  const handleAddToCartFromModal = () => {
    if (selectedItem) {
      onAddToCart({
        name: selectedItem.name[language],
        price: selectedItem.price,
        quantity: itemQuantity,
        image: selectedItem.image,
        vendorId: finalVendorData.id,
        vendorName: finalVendorData.name,
        customIngredients: selectedIngredients,
        specialNotes: specialNotes.trim(),
        originalIngredients: selectedItem.ingredients[language].split(', ')
      });
      
      // Close the product modal - the main AddedToCartModal will be shown by MainApp
      setIsModalOpen(false);
      setSelectedItem(null);
      setItemQuantity(1);
      setSelectedIngredients([]);
      setSpecialNotes('');
    }
  };

  // Handle ingredient toggle
  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };



  const content = {
    en: {
      reviews: 'reviews',
      mins: 'mins',
      km: 'km',
      menu: 'Menu',
      item: 'item',
      items: 'items',
      popular: 'Popular',
      add: 'Add',
      callNow: 'Call Now',
      chatNow: 'Chat Now',
      open: 'Open',
      closed: 'Closed',
      viewCart: 'View Cart',
      checkout: 'Checkout',
      trackOrder: 'Track Order',
      browseCategory: 'Browse Category',
      specialties: 'Specialties',
      ingredients: 'Ingredients',
      cookingTime: 'Cooking Time',
      calories: 'Calories',
      quantity: 'Quantity',
      addToCart: 'Add to Cart',
      totalPrice: 'Total Price',
      viewReviews: 'View Reviews',
      customerReviews: 'Customer Reviews',
      reviewsFrom: 'Reviews from our customers',
      helpful: 'people found this helpful',
      noReviews: 'No reviews yet',
      writeReview: 'Write a Review',
      closeReviews: 'Close Reviews',
      showMore: 'Show More Reviews',
      showLess: 'Show Less Reviews',
      menuCategories: 'Menu Categories',
      aiRecommendationTitle: 'AI Recommended for You',
      aiRecommendationSubtitle: 'Based on your preferences and popular items',
      viewAllItems: 'View All Items',
      showLess: 'Show Less',
      showingItems: 'Showing',
      ofItems: 'of',
      items: 'items'
    },
    rw: {
      reviews: 'amasuzuma',
      mins: 'iminota',
      km: 'km',
      menu: 'Urutonde',
      item: 'ikintu',
      items: 'ibintu',
      popular: 'Bizwi',
      add: 'Ongeraho',
      callNow: 'Hamagara Ubu',
      chatNow: 'Ganira Ubu',
      open: 'Bifunguye',
      closed: 'Bifunze',
      viewCart: 'Reba Igikombe',
      checkout: 'Ishyura',
      trackOrder: 'Gukurikirana Ikurikira',
      browseCategory: 'Shakisha Icyiciro',
      specialties: 'Ibyiza',
      ingredients: 'Ibikoresho',
      cookingTime: 'Igihe cyo Guteka',
      calories: 'Calories',
      quantity: 'Ingano',
      addToCart: 'Shyira mu Gikombe',
      totalPrice: 'Igiciro Cyose',
      viewReviews: 'Reba Amasuzuma',
      customerReviews: 'Amasuzuma y\'Abakiriya',
      reviewsFrom: 'Amasuzuma ava ku bakiriya bacu',
      helpful: 'abantu basanze iki gituye',
      noReviews: 'Nta masuzuma',
      writeReview: 'Andika Isuzuma',
      closeReviews: 'Funga Amasuzuma',
      showMore: 'Erekana Ayandi Masuzuma',
      showLess: 'Erekana Make',
      menuCategories: "Ibyiciro by'Ibiryo",
      aiFeatures: 'Ibiranga bya AI',
      smartRecommendations: 'Ibyifuzo Byubwenge',
      scanFood: 'Sikana Ibiryo',
      voiceOrder: 'Gutumiza mu Majwi',
      askAI: 'Baza AI',
      aiRecommendationTitle: 'AI Ikugusaba',
      aiRecommendationSubtitle: 'Bishingiye ku byakunze n\'ibiryo bikunda'
    }
  };

  // Filter items by selected category
  const filteredItems = finalVendorData.menuItems.filter(
    item => item.category === selectedCategory.name.en
  );

  // Pagination logic for menu items
  const MENU_ITEMS_PER_PAGE = 3;
  const displayedMenuItems = showAllMenuItems ? filteredItems : filteredItems.slice(0, MENU_ITEMS_PER_PAGE);
  const hasMoreItems = filteredItems.length > MENU_ITEMS_PER_PAGE;

  // Enhanced recommendation system for AI section
  const getAIRecommendedItems = () => {
    const items = finalVendorData.menuItems;
    const recommendations = [];
    
    // Priority 1: Popular items
    recommendations.push(...items.filter(item => item.isPopular).slice(0, 2));
    
    // Priority 2: Healthy options (low calorie)
    const healthyItems = items.filter(item => item.calories < 400 && !item.isPopular).slice(0, 1);
    recommendations.push(...healthyItems);
    
    // Priority 3: Value items (affordable)
    const valueItems = items.filter(item => item.price < 6000 && !recommendations.includes(item)).slice(0, 1);
    recommendations.push(...valueItems);
    
    // Priority 4: Premium options
    const premiumItems = items.filter(item => item.price > 10000 && !recommendations.includes(item)).slice(0, 1);
    recommendations.push(...premiumItems);
    
    // Fill remaining slots with other items if needed
    while (recommendations.length < 5) {
      const remaining = items.filter(item => !recommendations.includes(item));
      if (remaining.length === 0) break;
      recommendations.push(remaining[0]);
    }
    
    return recommendations.slice(0, 5);
  };

  // Menu item markers - replacing AI badges with diverse markers
  const getMenuItemBadge = (item: any) => {
    if (item.isPopular) return { text: 'Popular', color: 'bg-orange-500', icon: '🔥' };
    if (item.calories < 300) return { text: 'Light', color: 'bg-green-500', icon: '🥗' };
    if (item.price > 10000) return { text: 'Premium', color: 'bg-purple-500', icon: '⭐' };
    if (item.cookingTime && parseInt(item.cookingTime) < 15) return { text: 'Quick', color: 'bg-blue-500', icon: '⚡' };
    if (item.category === 'Desserts') return { text: 'Sweet', color: 'bg-pink-500', icon: '🍰' };
    if (item.category === 'Seafood') return { text: 'Fresh', color: 'bg-cyan-500', icon: '🐟' };
    return null;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col">
      {/* Header with back button and favorite */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-white/20 pt-safe flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 hover:bg-white/60 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 hover:bg-white/60 rounded-xl"
          >
            <Heart 
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} 
            />
          </Button>
        </div>
      </div>

      {/* Main scrollable content */}
      <div className="flex-1 overflow-y-auto professional-scrollbar touch-scroll min-h-0" style={{ paddingBottom: 'calc(120px + env(safe-area-inset-bottom))' }}>
        {/* Restaurant Image */}
        <div className="relative h-48">
          <ImageWithFallback
            src={finalVendorData.image}
            alt={finalVendorData.name}
            className="w-full h-48 object-cover"
          />
          
          {/* Status badge */}
          <div className="absolute top-4 right-4">
            <Badge 
              className={`px-3 py-1 ${
                finalVendorData.isOpen 
                  ? 'bg-green-500 text-white border-green-400' 
                  : 'bg-red-500 text-white border-red-400'
              }`}
            >
              {finalVendorData.isOpen ? content[language].open : content[language].closed}
            </Badge>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="px-6 py-6 space-y-4">
          {/* Restaurant Logo and Name */}
          <div className="flex items-center gap-4">
            {/* Restaurant Logo */}
            <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-orange-200/50 shadow-lg shadow-orange-500/20 flex items-center justify-center overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1587569298236-28ceab2d321e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwbG9nbyUyMGRlc2lnbiUyMGnpcmN1bGFyfGVufDF8fHx8MTc1NzQ3NzE5MXww&ixlib=rb-4.1.0&q=80&w=200"
                alt={`${finalVendorData.name} Logo`}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            
            {/* Name and basic info */}
            <div className="flex-1 space-y-2">
              <h1 className="text-2xl font-semibold text-gray-800">{finalVendorData.name}</h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{finalVendorData.rating}</span>
                  <span>({finalVendorData.reviewCount} {content[language].reviews})</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{finalVendorData.deliveryTime} {content[language].mins}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{finalVendorData.distance} {content[language].km}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">
            {finalVendorData.description[language]}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {finalVendorData.categories.map((category, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-orange-100 text-orange-700 border-orange-200 px-3 py-1"
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <Button
              variant="outline"
              className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12 flex items-center gap-2"
              onClick={() => window.open(`tel:${finalVendorData.phone}`, '_self')}
            >
              <Phone className="w-4 h-4" />
              {content[language].callNow}
            </Button>
            
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 flex items-center gap-2"
              onClick={() => setShowChatModal(true)}
            >
              <MessageSquare className="w-4 h-4" />
              {content[language].chatNow}
            </Button>
            
            <Button
              variant="outline"
              className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl h-12 flex items-center gap-2"
              onClick={() => setShowReviewsModal(true)}
            >
              <Star className="w-4 h-4" />
              {content[language].reviews}
            </Button>
          </div>
        </div>

        {/* Menu Categories Section */}
        <div className="px-6 pb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 relative overflow-hidden border border-white/20 shadow-sm shadow-black/5">
            {/* Subtle liquid glass enhancement overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-orange-50/30 via-transparent to-white/10 pointer-events-none rounded-3xl"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{content[language].menuCategories}</h3>
              </div>
            
            {/* Horizontally Scrollable Categories - Simple Overflow */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 w-max">
                {menuCategories.map((category) => {
                  const isSelected = selectedCategory.id === category.id;
                  return (
                    <button
                      key={category.id}
                      className={`flex-shrink-0 flex items-center gap-3 rounded-xl px-4 py-3 border transition-all duration-200 whitespace-nowrap shadow-sm shadow-black/5 ${
                        isSelected 
                          ? 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400 shadow-orange-500/20' 
                          : 'bg-white/80 border-gray-200 hover:bg-white hover:border-orange-300 hover:shadow-md hover:shadow-orange-500/10'
                      }`}
                      onClick={() => handleCategorySelect(category)}
                    >
                      <div className={`text-lg ${isSelected ? 'grayscale-0' : 'grayscale'}`}>
                        {category.icon}
                      </div>
                      <span className={`text-sm font-medium ${
                        isSelected ? 'text-white' : 'text-gray-700'
                      }`}>
                        {category.name[language]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations Section - Enhanced with 5 cards and mobile-native horizontal scrolling */}
        {onAIFeatureOpen && (
          <div className="px-6 pb-4">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-6 border border-orange-200/50 shadow-lg shadow-orange-500/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">{content[language].aiRecommendationTitle}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{content[language].aiRecommendationSubtitle}</p>
              
              {/* Horizontally scrollable recommendations with 5 cards */}
              <div 
                className="flex gap-3 pb-2 scrollbar-hide touch-scroll-x"
                style={{
                  overflowX: 'auto',
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {getAIRecommendedItems().map((item, index) => {
                  const aiReason = index === 0 ? 'Most Popular' : 
                                 index === 1 ? 'Trending' :
                                 index === 2 ? 'Healthy Choice' :
                                 index === 3 ? 'Great Value' : 'Chef\'s Special';
                  
                  return (
                    <motion.div
                      key={`ai-rec-${item.id}`}
                      className="flex-shrink-0 w-40 bg-white/85 backdrop-blur-sm rounded-2xl p-3 border border-white/40 cursor-pointer shadow-md shadow-orange-500/10"
                      style={{ scrollSnapAlign: 'start' }}
                      onClick={() => handleItemClick(item)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative mb-2">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name[language]}
                          className="w-full h-20 object-cover rounded-xl"
                        />
                        {/* Dynamic AI badge based on recommendation reason */}
                        <div className="absolute top-1 right-1">
                          <div className={`text-white rounded-full p-1.5 shadow-sm ${
                            index === 0 ? 'bg-orange-500' :
                            index === 1 ? 'bg-red-500' :
                            index === 2 ? 'bg-green-500' :
                            index === 3 ? 'bg-blue-500' : 'bg-purple-500'
                          }`}>
                            <Sparkles className="w-3 h-3" />
                          </div>
                        </div>
                        {/* AI reason indicator */}
                        <div className="absolute bottom-1 left-1">
                          <div className="bg-black/70 text-white text-xs px-2 py-0.5 rounded-md backdrop-blur-sm">
                            {aiReason}
                          </div>
                        </div>
                      </div>
                      <h4 className="text-sm font-medium text-gray-800 mb-1 line-clamp-1">
                        {item.name[language]}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {item.description[language]}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-orange-600">
                          {formatPrice(item.price)}
                        </span>
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg h-6 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleItemClick(item);
                          }}
                        >
                          {content[language].add}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Scroll indicator dots */}
              <div className="flex justify-center gap-1 mt-3">
                {getAIRecommendedItems().map((_, index) => (
                  <div 
                    key={index}
                    className="w-1.5 h-1.5 rounded-full bg-orange-300/50"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Menu Section */}
        <div className="px-6 pb-6 space-y-4">
          {/* Menu Title */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">{content[language].menu}</h2>
            <span className="text-sm text-gray-500">
              {filteredItems.length} {filteredItems.length === 1 ? content[language].item : content[language].items}
            </span>
          </div>
        </div>

        {/* Menu Items with Pagination */}
        <div className="px-6 space-y-4 pb-24">
          {displayedMenuItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20 cursor-pointer shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-200"
              onClick={() => handleItemClick(item)}
            >
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-gray-800">{item.name[language]}</h3>
                    {/* Enhanced menu item badges with diverse markers */}
                    {getMenuItemBadge(item) && (
                      <Badge className={`${getMenuItemBadge(item)!.color} text-white text-xs px-2 py-0.5 border-0 flex items-center gap-1`}>
                        <span>{getMenuItemBadge(item)!.icon}</span>
                        {getMenuItemBadge(item)!.text}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description[language]}
                  </p>
                  
                  {/* Additional item details */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {item.cookingTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.cookingTime}
                      </span>
                    )}
                    {item.calories && (
                      <span className="flex items-center gap-1">
                        🔥 {item.calories} cal
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">
                      {formatPrice(item.price)}
                    </span>
                    
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-8 px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(item);
                      }}
                    >
                      {content[language].add}
                    </Button>
                  </div>
                </div>
                
                <div className="w-20 h-20 flex-shrink-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name[language]}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Show More/Less Button for Menu Items */}
          {hasMoreItems && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center pt-4"
            >
              <Button
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-2 border-orange-200/50 text-orange-600 hover:bg-orange-50 hover:border-orange-300 rounded-xl px-6 py-3 flex items-center gap-2"
                onClick={() => setShowAllMenuItems(!showAllMenuItems)}
              >
                {showAllMenuItems ? (
                  <>
                    {language === 'en' ? 'Show Less' : 'Erekana Make'}
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </>
                ) : (
                  <>
                    {language === 'en' ? `View All ${filteredItems.length} Items` : `Reba Ibiryo Byose ${filteredItems.length}`}
                    <ChevronRight className="w-4 h-4 -rotate-90" />
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* Items count indicator when collapsed */}
          {!showAllMenuItems && hasMoreItems && (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                {language === 'en' 
                  ? `Showing ${MENU_ITEMS_PER_PAGE} of ${filteredItems.length} items`
                  : `Erekana ${MENU_ITEMS_PER_PAGE} kuri ${filteredItems.length} ibintu`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed cart button */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bottom-nav-spacing bg-gradient-to-t from-white via-white/95 to-transparent z-30">
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
            onClick={onViewCart}
          >
            <ShoppingCart className="w-4 h-4" />
            {content[language].viewCart} ({totalCartItems} {totalCartItems === 1 ? content[language].item : content[language].items})
          </Button>
        </div>
      )}

      {/* Product Detail Modal with Liquid Glass Effect */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop with subtle blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-4 top-16 bottom-16 z-50 max-w-lg mx-auto"
            >
              <div className="h-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl shadow-black/10 overflow-hidden">
                {/* Apple-style liquid glass container */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/10 to-white/5 rounded-3xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 via-transparent to-white/10 rounded-3xl" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col">
                  {/* Header with single close button */}
                  <div className="flex-shrink-0 p-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-6" /> {/* Spacer */}
                      <h2 className="text-lg font-semibold text-gray-800">Add to Cart</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsModalOpen(false)}
                        className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/30 p-0"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </Button>
                    </div>

                    {selectedItem && (
                      <div className="space-y-4">
                        {/* Product Image */}
                        <div className="relative">
                          <ImageWithFallback
                            src={selectedItem.image}
                            alt={selectedItem.name[language]}
                            className="w-full h-32 object-cover rounded-2xl"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold text-gray-800">
                              {selectedItem.name[language]}
                            </h3>
                            {selectedItem.isPopular && (
                              <Badge className="bg-orange-100/80 text-orange-700 border-orange-200/50 backdrop-blur-sm">
                                {content[language].popular}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {selectedItem.description[language]}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto professional-scrollbar px-6">
                    {selectedItem && (
                      <div className="space-y-6 pb-6">
                        {/* Interactive Ingredients */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-800 flex items-center gap-2">
                            <span>🥘</span>
                            Customize Ingredients
                          </h4>
                          <p className="text-xs text-gray-500 mb-3">Tap to remove ingredients you don't want</p>
                          
                          <div className="space-y-2">
                            {selectedItem.ingredients[language].split(', ').map((ingredient: string, index: number) => {
                              const isSelected = selectedIngredients.includes(ingredient);
                              return (
                                <motion.button
                                  key={index}
                                  onClick={() => toggleIngredient(ingredient)}
                                  className={`w-full p-3 rounded-xl border text-left transition-all duration-200 ${
                                    isSelected 
                                      ? 'bg-white/30 border-orange-200/50 backdrop-blur-sm text-gray-800' 
                                      : 'bg-white/10 border-gray-300/30 backdrop-blur-sm text-gray-500 line-through'
                                  }`}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{ingredient}</span>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                      isSelected 
                                        ? 'bg-orange-500 border-orange-500' 
                                        : 'bg-transparent border-gray-300'
                                    }`}>
                                      {isSelected && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Meal Details */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                            <Clock className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                            <p className="text-xs text-gray-600">Cooking Time</p>
                            <p className="text-sm font-medium text-gray-800">{selectedItem.cookingTime}</p>
                          </div>
                          
                          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                            <span className="text-lg">🔥</span>
                            <p className="text-xs text-gray-600">Calories</p>
                            <p className="text-sm font-medium text-gray-800">{selectedItem.calories}</p>
                          </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-800">Quantity</h4>
                          <div className="flex items-center justify-center gap-6">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full w-12 h-12 p-0 bg-white/30 hover:bg-white/50 border-white/30 backdrop-blur-sm"
                              onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                              disabled={itemQuantity <= 1}
                            >
                              <Minus className="w-4 h-4 text-gray-700" />
                            </Button>
                            
                            <div className="bg-white/30 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
                              <span className="text-xl font-semibold text-gray-800">
                                {itemQuantity}
                              </span>
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full w-12 h-12 p-0 bg-white/30 hover:bg-white/50 border-white/30 backdrop-blur-sm"
                              onClick={() => setItemQuantity(itemQuantity + 1)}
                            >
                              <Plus className="w-4 h-4 text-gray-700" />
                            </Button>
                          </div>
                        </div>

                        {/* Special Notes */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-800 flex items-center gap-2">
                            <span>📝</span>
                            Special Notes
                          </h4>
                          <p className="text-xs text-gray-500">Add any special instructions for your order</p>
                          <textarea
                            value={specialNotes}
                            onChange={(e) => setSpecialNotes(e.target.value)}
                            placeholder="e.g., Extra spicy, no onions, cook well done..."
                            className="w-full h-20 p-3 bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 text-gray-800 text-sm placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-300"
                            maxLength={200}
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Optional</span>
                            <span className="text-xs text-gray-400">{specialNotes.length}/200</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer with Price & Add to Cart */}
                  <div className="flex-shrink-0 p-6 pt-4 space-y-4">
                    {/* Total Price */}
                    <div className="bg-white/25 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
                      <p className="text-sm text-gray-600 mb-1">Total Price</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {selectedItem && formatPrice(selectedItem.price * itemQuantity)}
                      </p>
                      {selectedIngredients.length < selectedItem?.ingredients[language].split(', ').length && (
                        <p className="text-xs text-orange-600 mt-1">
                          {selectedItem?.ingredients[language].split(', ').length - selectedIngredients.length} ingredient(s) removed
                        </p>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl h-14 text-lg font-semibold shadow-lg shadow-orange-500/25"
                      onClick={handleAddToCartFromModal}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>



      {/* Chat Modal */}
      <ChatModal
        language={language}
        vendorName={finalVendorData.name}
        vendorImage={finalVendorData.image}
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
      />

      {/* Reviews Modal */}
      <ReviewsModal
        language={language}
        isOpen={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        vendorName={finalVendorData.name}
        vendorId={finalVendorData.id}
        vendorRating={finalVendorData.rating}
        totalReviews={finalVendorData.reviewCount}
        reviews={finalVendorData.reviews}
        onSubmitReview={(reviewData) => {
          console.log('Review submitted:', reviewData);
          // Here you would typically send the review to your backend
        }}
      />
    </div>
  );
}