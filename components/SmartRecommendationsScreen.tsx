import React, { useState, useEffect } from 'react';
import { ArrowLeft, Brain, RefreshCw, Heart, Star, MapPin, Clock, TrendingUp, Filter, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';

interface SmartRecommendationsScreenProps {
  language: 'en' | 'rw';
  onBack: () => void;
}

interface Recommendation {
  id: string;
  title: { en: string; rw: string };
  restaurant: { en: string; rw: string };
  description: { en: string; rw: string };
  price: number;
  rating: number;
  image: string;
  tags: Array<{ en: string; rw: string }>;
  reason: { en: string; rw: string };
  confidence: number;
  category: 'trending' | 'personalized' | 'weather' | 'time' | 'health';
  deliveryTime: number;
  distance: number;
}

interface RecommendationCategory {
  id: string;
  title: { en: string; rw: string };
  description: { en: string; rw: string };
  icon: React.ComponentType<{ className?: string }>;
  recommendations: Recommendation[];
}

export function SmartRecommendationsScreen({ language, onBack }: SmartRecommendationsScreenProps) {
  const [activeCategory, setActiveCategory] = useState('personalized');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const content = {
    en: {
      title: 'Smart Recommendations',
      subtitle: 'AI-powered food suggestions just for you',
      refreshing: 'Getting fresh recommendations...',
      refresh: 'Refresh',
      addToCart: 'Add to Cart',
      viewMenu: 'View Menu',
      liked: 'Liked',
      confidence: 'Match',
      minutes: 'min',
      km: 'km away',
      because: 'Because',
      basedOn: 'Based on your preferences',
      trending: 'Trending Now',
      forYou: 'For You',
      weatherBased: 'Weather-Based',
      timeBased: 'Perfect Timing',
      healthy: 'Healthy Choices'
    },
    rw: {
      title: 'Ibyifuzo Byubwenge',
      subtitle: 'Ibyifuzo bya AI byawe wenyine',
      refreshing: 'Kubona ibyifuzo bishya...',
      refresh: 'Vugurura',
      addToCart: 'Ongeraho mu Gitebo',
      viewMenu: 'Reba Menu',
      liked: 'Byakunzwe',
      confidence: 'Guhuza',
      minutes: 'iminota',
      km: 'km kure',
      because: 'Kubera',
      basedOn: 'Bishingiye ku byakunze',
      trending: 'Bikunda Ubu',
      forYou: 'Kuri Wewe',
      weatherBased: 'Bishingiye ku Ikirere',
      timeBased: 'Igihe Cyiza',
      healthy: 'Amahitamo Meza'
    }
  };

  // Mock recommendations data
  const mockRecommendations: RecommendationCategory[] = [
    {
      id: 'personalized',
      title: content[language].forYou,
      description: content[language].basedOn,
      icon: Brain,
      recommendations: [
        {
          id: 'rec1',
          title: { en: 'Spicy Chicken Wings', rw: 'Amababa y\'Inkoko Arwaye' },
          restaurant: { en: 'Wings Palace', rw: 'Ingoro y\'Amababa' },
          description: { en: 'Crispy wings with your favorite spicy sauce', rw: 'Amababa acye n\'isozi urukundo' },
          price: 4500,
          rating: 4.8,
          image: 'chicken-wings',
          tags: [
            { en: 'Spicy', rw: 'Birwaye' },
            { en: 'Protein', rw: 'Proteine' }
          ],
          reason: { en: 'You often order spicy chicken dishes', rw: 'Akenshi utumiza inkoko irwaye' },
          confidence: 95,
          category: 'personalized',
          deliveryTime: 25,
          distance: 1.2
        },
        {
          id: 'rec2',
          title: { en: 'Vegetarian Pizza', rw: 'Pizza y\'Imboga' },
          restaurant: { en: 'Green Garden', rw: 'Ubusitani Bwicyatsi' },
          description: { en: 'Fresh vegetables on crispy thin crust', rw: 'Imboga nshya ku gipfukamye gito' },
          price: 6200,
          rating: 4.6,
          image: 'veggie-pizza',
          tags: [
            { en: 'Vegetarian', rw: 'Imboga' },
            { en: 'Healthy', rw: 'Biryoshye' }
          ],
          reason: { en: 'Matches your healthy eating pattern', rw: 'Bihuye n\'uburyo bwawe bwo kurya neza' },
          confidence: 87,
          category: 'personalized',
          deliveryTime: 30,
          distance: 2.1
        }
      ]
    },
    {
      id: 'trending',
      title: content[language].trending,
      description: { en: 'What\'s popular right now', rw: 'Ibikunda ubu' },
      icon: TrendingUp,
      recommendations: [
        {
          id: 'trend1',
          title: { en: 'Korean BBQ Bowl', rw: 'Igikombe cya BBQ ya Koreya' },
          restaurant: { en: 'Seoul Kitchen', rw: 'Igikoni cya Seoul' },
          description: { en: 'Trending Korean-style grilled meat bowl', rw: 'Igikombe cy\'inyama icyemo mu buryo bwa Koreya' },
          price: 7800,
          rating: 4.9,
          image: 'korean-bbq',
          tags: [
            { en: 'Trending', rw: 'Gikunda' },
            { en: 'Asian', rw: 'Bya Aziya' }
          ],
          reason: { en: 'Ordered 150+ times this week', rw: 'Byatumiijwe inshuro 150+ kuri iki cyumweru' },
          confidence: 92,
          category: 'trending',
          deliveryTime: 35,
          distance: 3.5
        }
      ]
    },
    {
      id: 'weather',
      title: content[language].weatherBased,
      description: { en: 'Perfect for today\'s weather', rw: 'Byiza ku kirere cy\'uyu munsi' },
      icon: Sparkles,
      recommendations: [
        {
          id: 'weather1',
          title: { en: 'Hot Soup & Bread', rw: 'Isupe Ishyushye n\'Umugati' },
          restaurant: { en: 'Comfort Kitchen', rw: 'Igikoni Gihembaza' },
          description: { en: 'Warm comfort food for rainy weather', rw: 'Ibiryo bishyushye byo guhumuza ku kirere cy\'imvura' },
          price: 3200,
          rating: 4.4,
          image: 'hot-soup',
          tags: [
            { en: 'Warm', rw: 'Bishyushye' },
            { en: 'Comfort', rw: 'Bihembaza' }
          ],
          reason: { en: 'Perfect for today\'s rainy weather', rw: 'Byiza ku kirere cy\'imvura cy\'uyu munsi' },
          confidence: 85,
          category: 'weather',
          deliveryTime: 20,
          distance: 0.8
        }
      ]
    },
    {
      id: 'time',
      title: content[language].timeBased,
      description: { en: 'Great for this time of day', rw: 'Byiza kuri iki gihe cy\'umunsi' },
      icon: Clock,
      recommendations: [
        {
          id: 'time1',
          title: { en: 'Afternoon Tea Set', rw: 'Icyayi cy\'Nyuma ya Saa Sita' },
          restaurant: { en: 'Tea Garden', rw: 'Ubusitani bw\'Icyayi' },
          description: { en: 'Light snacks and premium tea blend', rw: 'Ibiryo byoroheje n\'icyayi cyiza' },
          price: 2800,
          rating: 4.7,
          image: 'tea-set',
          tags: [
            { en: 'Light', rw: 'Byoroheje' },
            { en: 'Afternoon', rw: 'Nyuma ya Saa Sita' }
          ],
          reason: { en: 'Perfect for afternoon break', rw: 'Byiza ku kuruhuka kwa nyuma ya saa sita' },
          confidence: 78,
          category: 'time',
          deliveryTime: 15,
          distance: 1.5
        }
      ]
    },
    {
      id: 'health',
      title: content[language].healthy,
      description: { en: 'Nutritious and delicious', rw: 'Bifite intungamubiri kandi biryoshye' },
      icon: Heart,
      recommendations: [
        {
          id: 'health1',
          title: { en: 'Quinoa Power Bowl', rw: 'Igikombe cy\'Imbaraga cya Quinoa' },
          restaurant: { en: 'Healthy Hub', rw: 'Ikigo cy\'Ubuzima' },
          description: { en: 'Nutrient-packed superfood bowl', rw: 'Igikombe cyuzuye intungamubiri' },
          price: 5500,
          rating: 4.5,
          image: 'quinoa-bowl',
          tags: [
            { en: 'Superfood', rw: 'Ibiryo Bidasanzwe' },
            { en: 'High Protein', rw: 'Proteine Nyinshi' }
          ],
          reason: { en: 'Aligns with your fitness goals', rw: 'Bihuye n\'intego zawe zo kwimena' },
          confidence: 82,
          category: 'health',
          deliveryTime: 28,
          distance: 2.3
        }
      ]
    }
  ];

  const categories = mockRecommendations;
  const activeRecommendations = categories.find(cat => cat.id === activeCategory)?.recommendations || [];

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call to get fresh recommendations
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleLike = (id: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAddToCart = (recommendation: Recommendation) => {
    alert(language === 'en' 
      ? `Added ${recommendation.title[language]} to cart!`
      : `${recommendation.title[language]} byongerewe mu gitebo!`
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 75) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
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
          
          <div className="text-center flex-1 mx-4">
            <div className="flex items-center gap-2 justify-center mb-1">
              <div className="w-6 h-6 bg-gradient-to-r from-primary to-orange-600 rounded-lg flex items-center justify-center">
                <Brain className="w-3 h-3 text-white" />
              </div>
              <h1 className="text-foreground font-medium">{content[language].title}</h1>
            </div>
            <p className="text-xs text-muted-foreground">{content[language].subtitle}</p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="p-4 pb-safe">
        {/* Category Tabs */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 mb-6 border border-white/20">
          <div className="grid grid-cols-3 gap-1">
            {categories.slice(0, 3).map((category) => {
              const IconComponent = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative p-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                  }`}
                >
                  <div className="text-center">
                    <IconComponent className={`w-5 h-5 mx-auto mb-1 ${isActive ? 'text-white' : ''}`} />
                    <p className="text-xs font-medium">
                      {category.title[language]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Additional categories */}
          <div className="grid grid-cols-2 gap-1 mt-1">
            {categories.slice(3).map((category) => {
              const IconComponent = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative p-2 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                    <p className="text-xs font-medium">
                      {category.title[language]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Refreshing State */}
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 mb-6 text-center"
          >
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground">{content[language].refreshing}</p>
          </motion.div>
        )}

        {/* Recommendations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {activeRecommendations.map((recommendation) => (
              <motion.div
                key={recommendation.id}
                layout
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20"
              >
                {/* Recommendation Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-foreground font-medium">
                        {recommendation.title[language]}
                      </h3>
                      <Badge className={`text-xs px-2 py-1 ${getConfidenceColor(recommendation.confidence)}`}>
                        {content[language].confidence} {recommendation.confidence}%
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-2">
                      {recommendation.restaurant[language]}
                    </p>
                    
                    <p className="text-muted-foreground text-sm">
                      {recommendation.description[language]}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleLike(recommendation.id)}
                    className={`p-2 rounded-full transition-colors ${
                      likedItems.has(recommendation.id)
                        ? 'bg-red-100 text-red-500'
                        : 'bg-muted text-muted-foreground hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedItems.has(recommendation.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Tags and Info */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {recommendation.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag[language]}
                    </Badge>
                  ))}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground ml-auto">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{recommendation.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{recommendation.deliveryTime} {content[language].minutes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{recommendation.distance} {content[language].km}</span>
                    </div>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="bg-primary/5 rounded-2xl p-3 mb-4">
                  <p className="text-muted-foreground text-sm">
                    <span className="font-medium">{content[language].because}:</span> {recommendation.reason[language]}
                  </p>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {recommendation.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-sm ml-1">RWF</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-muted-foreground hover:text-foreground"
                    >
                      {content[language].viewMenu}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(recommendation)}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      {content[language].addToCart}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {activeRecommendations.length === 0 && !isRefreshing && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-foreground font-medium mb-2">
              {language === 'en' ? 'No Recommendations Yet' : 'Nta byifuzo'}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {language === 'en' 
                ? 'AI is learning your preferences. Try refreshing or order more to get personalized recommendations.'
                : 'AI irimo kwiga ibyo ukunze. Gerageza vugurura cyangwa tumiza byinshi ubona ibyifuzo byihariye.'
              }
            </p>
            <Button
              onClick={handleRefresh}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {content[language].refresh}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}