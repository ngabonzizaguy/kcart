import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, Sparkles, Bot, User, Camera, Image, X, Star, Clock, MapPin, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AIChatScreenProps {
  language: 'en' | 'rw';
  onBack: () => void;
  onNavigateToVendor?: (vendorId: string) => void;
  onNavigateToCart?: () => void;
  onAddToCart?: (item: any) => void;
}

interface RestaurantCard {
  id: string;
  name: { en: string; rw: string };
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  cuisine: { en: string; rw: string };
  distance: string;
  discount?: { en: string; rw: string };
  isLiked?: boolean;
  specialOffer?: { en: string; rw: string };
  popularItems?: {
    id: string;
    name: { en: string; rw: string };
    price: number;
    image: string;
    description: { en: string; rw: string };
  }[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  typing?: boolean;
  image?: string;
  imageAlt?: string;
  restaurants?: RestaurantCard[];
}

export function AIChatScreen({ language, onBack, onNavigateToVendor, onNavigateToCart, onAddToCart }: AIChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: language === 'en' 
        ? "Hi! I'm your DeliGo AI assistant. How can I help you with your food delivery needs today? You can also share photos of food you'd like to find!" 
        : "Muraho! Ndi umufasha wawe wa AI wa DeliGo. Mbese nashobora kugufasha gute mu gutumiza ibiryo uyu munsi? Urashobora kandi gusangira amafoto y'ibiryo ushaka kubona!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showQuickOrderModal, setShowQuickOrderModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantCard | null>(null);
  const [selectedQuickOrderItem, setSelectedQuickOrderItem] = useState<any>(null);
  const [addedToCartItem, setAddedToCartItem] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const content = {
    en: {
      title: 'AI Assistant',
      placeholder: 'Ask me anything about food delivery...',
      typingIndicator: 'AI is typing...',
      sendButton: 'Send',
      photoButton: 'Share Photo',
      takePhoto: 'Take Photo',
      selectPhoto: 'Choose from Gallery',
      analyzing: 'Analyzing your photo...',
      foodFound: 'I found this dish! Let me find restaurants that serve it.',
      examples: [
        "What's popular near me?",
        "Find healthy options",
        "Track my order",
        "Recommend restaurants"
      ]
    },
    rw: {
      title: 'Umufasha wa AI',
      placeholder: 'Mbaza icyo ushaka ku gutumiza ibiryo...',
      typingIndicator: 'AI irimo kwandika...',
      sendButton: 'Ohereza',
      photoButton: 'Sangira Ifoto',
      takePhoto: 'Fata Ifoto',
      selectPhoto: 'Hitamo muri Gallery',
      analyzing: 'Ndasuzuma ifoto yawe...',
      foodFound: 'Nabanye iki kiryo! Reka nkubeshaho ibibanza bikigira.',
      examples: [
        "Ni ibihe bikunda hafi yanjye?",
        "Shakisha amahitamo meza",
        "Kurikirana ikurikira ryanjye", 
        "Nshoza ibibanza"
      ]
    }
  };

  // Mock restaurant data for AI recommendations
  const mockRestaurants: RestaurantCard[] = [
    {
      id: 'golden-spoon-restaurant',
      name: { en: 'Golden Spoon Restaurant', rw: 'Resitora ya Golden Spoon' },
      image: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc1NzY2ODk3MHww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      reviewCount: 324,
      deliveryTime: '25-35 min',
      deliveryFee: 2.50,
      cuisine: { en: 'Italian & Pizza', rw: 'Ubuyitariya & Pizza' },
      distance: '1.2 km',
      discount: { en: '20% off', rw: '20% kugabanuka' },
      specialOffer: { en: 'Free delivery on orders over $25', rw: 'Gutumiza ubuntu ku byifuzo birenze $25' },
      popularItems: [
        {
          id: 'margherita-pizza',
          name: { en: 'Margherita Pizza', rw: 'Pizza ya Margherita' },
          price: 8500,
          image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300',
          description: { en: 'Classic tomato, mozzarella, and basil', rw: 'Nyanya, fromage ya mozzarella, na basil' }
        },
        {
          id: 'chicken-pasta',
          name: { en: 'Chicken Alfredo Pasta', rw: 'Pasta ya Inkoko na Alfredo' },
          price: 9500,
          image: 'https://images.unsplash.com/photo-1556909114-3b6e8c3d7ce8?w=300',
          description: { en: 'Creamy pasta with grilled chicken', rw: 'Pasta n\'amavuta hamwe n\'inkoko y\'akalanga' }
        }
      ]
    },
    {
      id: 'spice-garden',
      name: { en: 'Spice Garden', rw: 'Ubusitani bw\'Ibishyimbo' },
      image: 'https://images.unsplash.com/photo-1728910758653-7e990e489cac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmb29kJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NTc2NDE0MDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      reviewCount: 189,
      deliveryTime: '20-30 min',
      deliveryFee: 1.99,
      cuisine: { en: 'Indian Cuisine', rw: 'Ibiryo by\'Ubuhinde' },
      distance: '0.8 km',
      specialOffer: { en: 'Buy 2 get 1 free dessert', rw: 'Gura 2 ubonere 1 ya dessert' },
      popularItems: [
        {
          id: 'chicken-curry',
          name: { en: 'Chicken Curry', rw: 'Curry y\'Inkoko' },
          price: 7500,
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300',
          description: { en: 'Spicy chicken curry with rice', rw: 'Curry y\'inkoko ibuye hamwe n\'umuceri' }
        },
        {
          id: 'biryani',
          name: { en: 'Chicken Biryani', rw: 'Biryani y\'Inkoko' },
          price: 8500,
          image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=300',
          description: { en: 'Fragrant rice with spiced chicken', rw: 'Umuceri unuka neza hamwe n\'inkoko ibuye' }
        }
      ]
    },
    {
      id: 'fresh-healthy',
      name: { en: 'Fresh & Healthy', rw: 'Bishya & Byiza' },
      image: 'https://images.unsplash.com/photo-1651978595428-b79169f223a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU3NzA3MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      reviewCount: 267,
      deliveryTime: '15-25 min',
      deliveryFee: 2.99,
      cuisine: { en: 'Healthy Bowls', rw: 'Ibikombe byiza' },
      distance: '1.5 km',
      discount: { en: '15% off first order', rw: '15% kugabanuka ku kurikira rya mbere' },
      popularItems: [
        {
          id: 'quinoa-bowl',
          name: { en: 'Quinoa Power Bowl', rw: 'Ikombe rya Quinoa' },
          price: 6500,
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300',
          description: { en: 'Quinoa with fresh vegetables and avocado', rw: 'Quinoa hamwe n\'imboga nshya na avocado' }
        },
        {
          id: 'green-smoothie',
          name: { en: 'Green Power Smoothie', rw: 'Smoothie y\'Imboga' },
          price: 4500,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
          description: { en: 'Spinach, banana, and protein blend', rw: 'Spinach, banana, na proteyine' }
        }
      ]
    }
  ];

  // Mock AI responses with restaurant recommendations
  const aiResponses = {
    en: [
      "I'd be happy to help you find great food options! What type of cuisine are you in the mood for?",
      "Based on your location, I can recommend several popular restaurants. Would you like to see pizza, local dishes, or something else?",
      "Great choice! Let me find the best options for you. I'll also check for any current promotions.",
      "I found some excellent restaurants for you! Here are my top recommendations based on your preferences:",
      "Perfect! I can help you track your order status. Your food should arrive within the estimated time.",
      "I'm here to make your food delivery experience as smooth as possible. Is there anything specific you'd like to know?"
    ],
    rw: [
      "Nshimishijwe no kugufasha kubona amahitamo meza y'ibiryo! Ni ubuhe buryo bw'ibiryo ushaka?",
      "Ukurikije aho uherereye, nashobora kugushyira ku bibanza bikunda. Urashaka pizza, ibiryo by'ahantu, cyangwa ikindi?",
      "Ihitamo ryiza! Reka mbakuraho amahitamo meza kuri wewe. Nzareba kandi niba hari ibiganiro bihari.",
      "Nabanye ibibanza byiza kuri wewe! Dore ibyifuzo byanjye bya mbere ukurikije ibyo ukunze:",
      "Byiza! Nashobora kugufasha gukurikirana uko ikurikira ryawe rigenda. Ibiryo byawe bigomba kugera mu gihe giteganijwe.",
      "Ndi hano kugira ngo nkore uburambe bwawe bwo gutumiza ibiryo bube bworoshye. Hari ikintu cyihariye ushaka kumenya?"
    ]
  };

  // Mock food recognition responses
  const foodRecognitionResponses = {
    en: [
      "That looks like a delicious pasta dish! I found 3 restaurants nearby that serve similar Italian cuisine. Would you like to see them?",
      "I can see that's a burger! Here are some great burger places near you that serve similar styles.",
      "That appears to be a traditional dish! Let me find local restaurants that specialize in authentic cuisine like this.",
      "What a beautiful pizza! I found several pizzerias in your area that make similar wood-fired pizzas.",
      "That looks like a healthy salad! Here are some restaurants near you that focus on fresh, healthy options.",
      "I can see that's a dessert! Let me find cafes and restaurants nearby that serve similar sweet treats."
    ],
    rw: [
      "Ibyo bisa n'ibiryo byiza bya pasta! Nabanye ibibanza 3 hafi yawe bikora ibiryo bisa na byo by'Ubuyitariya. Urashaka kubibona?",
      "Ndabona ko ari burger! Dore ahantu hamwe hakora burger hafi yawe.",
      "Bisa n'ikiryo cy'ahantu! Reka nkubeshaho ibibanza by'ahantu bikunda ibiryo nk'ibi.",
      "Pizza nziza! Nabanye ahantu henshi hakora pizza nk'iyi hafi yawe.",
      "Bisa n'isaladi nziza! Dore ibibanza byo hafi yawe bikunda ibiryo byiza kandi bifasha ubuzima.",
      "Ndabona ko ari dessert! Reka nkubeshaho ibibanza hafi yawe bikora ibiryo biryoshye nk'ibi."
    ]
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const messageText = inputMessage.toLowerCase();
      let response = aiResponses[language][Math.floor(Math.random() * aiResponses[language].length)];
      let restaurants: RestaurantCard[] | undefined;

      // Check if user is asking for restaurant recommendations
      const restaurantTriggers = [
        'restaurant', 'food', 'eat', 'hungry', 'order', 'delivery', 'cuisine', 'meal',
        'resitora', 'ibiryo', 'kurya', 'gufata', 'gutumiza', 'cuisine', 'ifunguro'
      ];

      const shouldShowRestaurants = restaurantTriggers.some(trigger => 
        messageText.includes(trigger)
      );

      if (shouldShowRestaurants || Math.random() > 0.6) {
        response = language === 'en' 
          ? "I found some excellent restaurants for you! Here are my top recommendations based on your preferences:"
          : "Nabanye ibibanza byiza kuri wewe! Dore ibyifuzo byanjye bya mbere ukurikije ibyo ukunze:";
        restaurants = mockRestaurants.slice(0, 2 + Math.floor(Math.random() * 2)); // Show 2-3 restaurants
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        restaurants: restaurants,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1500);
  };

  const handleQuickMessage = (message: string) => {
    setInputMessage(message);
  };

  // Handle photo upload - simplified and safe
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imageUrl = e.target?.result as string;
          if (!imageUrl) return;
          
          // Send image message
          const imageMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: language === 'en' ? 'Can you help me identify this food?' : 'Urashobora kumfasha kumenya iki kiryo?',
            image: imageUrl,
            imageAlt: 'Food photo',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, imageMessage]);
          setIsTyping(true);

          // Simulate AI food recognition with restaurant recommendations
          setTimeout(() => {
            try {
              const responses = foodRecognitionResponses[language] || foodRecognitionResponses.en;
              const randomResponse = responses[Math.floor(Math.random() * responses.length)];
              const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                content: randomResponse,
                restaurants: mockRestaurants.slice(0, 2), // Show 2 restaurants for food recognition
                timestamp: new Date()
              };

              setMessages(prev => [...prev, aiMessage]);
              setIsTyping(false);
            } catch (err) {
              console.error('Error processing AI response:', err);
              setIsTyping(false);
            }
          }, 2000);
        } catch (err) {
          console.error('Error processing image:', err);
        }
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error handling photo upload:', err);
    }
  };

  const openCamera = () => {
    try {
      if (fileInputRef.current) {
        fileInputRef.current.setAttribute('capture', 'environment');
        fileInputRef.current.click();
      }
    } catch (err) {
      console.error('Error opening camera:', err);
    }
  };

  const openGallery = () => {
    try {
      if (fileInputRef.current) {
        fileInputRef.current.removeAttribute('capture');
        fileInputRef.current.click();
      }
    } catch (err) {
      console.error('Error opening gallery:', err);
    }
  };

  // Restaurant Card Component for AI responses
  const RestaurantCard = ({ restaurant }: { restaurant: RestaurantCard }) => {
    const [isLiked, setIsLiked] = useState(restaurant.isLiked || false);

    const handleViewMenu = () => {
      if (onNavigateToVendor) {
        onNavigateToVendor(restaurant.id);
      } else {
        alert(language === 'en' ? `Opening menu for ${restaurant.name.en}...` : `Gufungura menu ya ${restaurant.name.rw}...`);
      }
    };

    const handleQuickOrder = () => {
      // Show quick order modal with popular items for direct ordering
      setSelectedRestaurant(restaurant);
      setShowQuickOrderModal(true);
    };

    const toggleLike = () => {
      setIsLiked(!isLiked);
    };

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg mx-1 my-2 max-w-sm">
        {/* Restaurant Image */}
        <div className="relative mb-3">
          <ImageWithFallback
            src={restaurant.image}
            alt={restaurant.name[language]}
            className="w-full h-32 object-cover rounded-xl"
          />
          
          {/* Like Button */}
          <button
            onClick={toggleLike}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          {/* Discount Badge */}
          {restaurant.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-medium">
              {restaurant.discount[language]}
            </div>
          )}
        </div>

        {/* Restaurant Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-gray-800 text-sm leading-tight">
              {restaurant.name[language]}
            </h3>
            <div className="flex items-center gap-1 ml-2">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs text-gray-600">{restaurant.rating}</span>
              <span className="text-xs text-gray-500">({restaurant.reviewCount})</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-600">{restaurant.cuisine[language]}</p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{restaurant.distance}</span>
            </div>
          </div>
          
          {restaurant.specialOffer && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
              <p className="text-xs text-orange-700 font-medium">
                {restaurant.specialOffer[language]}
              </p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleViewMenu}
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              <Eye className="w-3 h-3 mr-1" />
              {language === 'en' ? 'View Menu' : 'Reba Menu'}
            </Button>
            <Button
              onClick={handleQuickOrder}
              size="sm" 
              className="flex-1 h-8 text-xs bg-orange-500 hover:bg-orange-600 text-white"
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              {language === 'en' ? 'Order' : 'Gutumiza'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-border/30 pt-safe">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{language === 'en' ? 'Back' : 'Subira'}</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-orange-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-foreground font-medium">{content[language].title}</h1>
              <p className="text-xs text-muted-foreground">
                {isTyping ? content[language].typingIndicator : 'Online'}
              </p>
            </div>
          </div>
          
          <div className="w-12" /> {/* Spacer for balance */}
        </div>
      </div>

      {/* Messages Area - Enhanced with restaurant cards - Aggressively reduced padding for small mobile phones */}
      <div className="flex-1 scrollbar-hide touch-scroll" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
        <div className="p-4 space-y-4 pb-16">{/* Aggressively reduced from pb-20 to pb-16 for small mobile phones */}
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              {/* Regular Message */}
              <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'ai' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-white/80 backdrop-blur-sm text-foreground rounded-bl-md'
                }`}>
                  {/* Image display */}
                  {message.image && (
                    <div className="mb-2">
                      <ImageWithFallback
                        src={message.image}
                        alt={message.imageAlt || 'Shared image'}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Restaurant Cards - Only for AI messages */}
              {message.type === 'ai' && message.restaurants && message.restaurants.length > 0 && (
                <div className="ml-11 space-y-3">
                  <p className="text-xs text-gray-500 mb-2">
                    {language === 'en' ? 'Tap any restaurant to view menu or order:' : 'Kanda kuri restaurant yose urebe menu cyangwa utumize:'}
                  </p>
                  <div className="space-y-3">
                    {message.restaurants.map((restaurant) => (
                      <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                  </div>
                  
                  {/* Follow-up prompt */}
                  <div className="bg-orange-50/50 backdrop-blur-sm border border-orange-200/50 rounded-xl p-3 mt-3">
                    <p className="text-xs text-orange-700 text-center">
                      {language === 'en' 
                        ? "Need more recommendations? Just ask me about your preferences!" 
                        : "Ukeneye iyindi myanzuro? Baza uko wifuza!"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-orange-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Quick Action Suggestions */}
          {messages.length <= 2 && !isTyping && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center mb-3">
                {language === 'en' ? 'Try asking:' : 'Gerageza kubaza:'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {content[language].examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickMessage(example)}
                    className="p-3 bg-white/60 backdrop-blur-sm border border-border/30 rounded-xl text-xs text-left hover:bg-white/80 transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Liquid-Glassy Input Area - Optimized for small mobile devices */}
      <div className="relative bg-gradient-to-t from-white/95 via-white/90 to-white/80 backdrop-blur-md border-t border-white/40 shadow-lg shadow-orange-500/10 pb-safe pt-3">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-50/30 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 px-4 pt-1 pb-6">
          {/* Input Label - Clear visibility for small devices */}
          <div className="mb-4 text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Ask me anything about food!' : 'Mbwira ibyo ushaka mu biryo!'}
            </p>
            <p className="text-xs text-gray-500">
              {language === 'en' ? 'Type your message below' : 'Andika ubutumwa bwawe hano'}
            </p>
          </div>
          
          {/* Enhanced Photo sharing options with liquid glass styling */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={openCamera}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-white/70 backdrop-blur-sm border border-white/50 rounded-lg hover:bg-white/90 hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Camera className="w-3 h-3 text-orange-600" />
              <span className="font-medium text-gray-700">{content[language].takePhoto}</span>
            </button>
            <button
              onClick={openGallery}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-white/70 backdrop-blur-sm border border-white/50 rounded-lg hover:bg-white/90 hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Image className="w-3 h-3 text-orange-600" />
              <span className="font-medium text-gray-700">{content[language].selectPhoto}</span>
            </button>
          </div>

          <div className="flex gap-3 items-end">
            {/* Enhanced liquid-glass input container - Optimized for small devices */}
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/90 to-white/80 backdrop-blur-md rounded-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-orange-100/20 rounded-xl"></div>
              <div className="relative bg-white/60 backdrop-blur-lg border-2 border-white/60 hover:border-orange-200/70 focus-within:border-orange-300/80 rounded-xl px-4 py-4 shadow-lg shadow-orange-500/5 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={content[language].placeholder}
                    className="flex-1 bg-transparent text-base text-gray-800 placeholder:text-sm placeholder:text-gray-400 focus:outline-none font-medium min-h-[24px]"
                    style={{ fontSize: '16px' }} // Prevents zoom on iOS
                  />
                  {inputMessage && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Enhanced send button with liquid glass effect - Optimized for small devices */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl blur-sm opacity-20"></div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="relative w-14 h-14 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-0 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input for photo uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Quick Order Modal */}
      {showQuickOrderModal && selectedRestaurant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full bg-white/95 backdrop-blur-md rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-lg text-gray-800">
                  {language === 'en' ? 'Quick Order' : 'Gutumiza Vuba'}
                </h2>
                <p className="text-sm text-gray-600">{selectedRestaurant.name[language]}</p>
              </div>
              <button
                onClick={() => setShowQuickOrderModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Popular Items */}
            {selectedRestaurant.popularItems && selectedRestaurant.popularItems.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">
                  {language === 'en' ? 'Popular items from this restaurant:' : 'Ibiryo bikunda muri iri kibanza:'}
                </p>
                {selectedRestaurant.popularItems.map((item) => (
                  <div key={item.id} className="bg-white/70 rounded-xl p-4 border border-gray-200">
                    <div className="flex gap-3">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name[language]}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 text-sm">{item.name[language]}</h3>
                        <p className="text-xs text-gray-600 mt-1">{item.description[language]}</p>
                        <p className="text-orange-600 font-semibold text-sm mt-2">
                          {item.price.toLocaleString()} RWF
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedQuickOrderItem(item);
                          if (onAddToCart) {
                            onAddToCart({
                              id: item.id,
                              name: item.name[language],
                              price: item.price,
                              image: item.image,
                              restaurantId: selectedRestaurant.id,
                              restaurantName: selectedRestaurant.name[language],
                              quantity: 1
                            });
                          }
                          setAddedToCartItem(item);
                          setShowQuickOrderModal(false);
                          
                          // Show success message
                          setTimeout(() => {
                            const successMessage: ChatMessage = {
                              id: Date.now().toString(),
                              type: 'ai',
                              content: language === 'en' 
                                ? `Great! I've added ${item.name[language]} to your cart. You can continue ordering or proceed to checkout.`
                                : `Byiza! Nashyize ${item.name[language]} mu gitambaro. Urashobora gukomeza gutumiza cyangwa ugane kwishyura.`,
                              timestamp: new Date()
                            };
                            setMessages(prev => [...prev, successMessage]);
                          }, 500);
                        }}
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white h-8 px-3 text-xs"
                      >
                        {language === 'en' ? 'Add' : 'Ongera'}
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* View Full Menu Option */}
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      setShowQuickOrderModal(false);
                      if (onNavigateToVendor) {
                        onNavigateToVendor(selectedRestaurant.id);
                      }
                    }}
                    variant="outline"
                    className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                  >
                    {language === 'en' ? 'View Full Menu' : 'Reba Menu Yose'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  {language === 'en' ? 'No popular items available. View the full menu to order.' : 'Nta biryo bikunda bihari. Reba menu yose kugira ngo utumize.'}
                </p>
                <Button
                  onClick={() => {
                    setShowQuickOrderModal(false);
                    if (onNavigateToVendor) {
                      onNavigateToVendor(selectedRestaurant.id);
                    }
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {language === 'en' ? 'View Menu' : 'Reba Menu'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}