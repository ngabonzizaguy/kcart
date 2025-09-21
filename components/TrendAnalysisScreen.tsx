import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Users, Clock, MapPin, Star, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { motion, AnimatePresence } from 'motion/react';

interface TrendAnalysisScreenProps {
  language: 'en' | 'rw';
  onBack: () => void;
}

interface TrendData {
  id: string;
  name: { en: string; rw: string };
  restaurant: { en: string; rw: string };
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  orders: number;
  rating: number;
  price: number;
  category: string;
  tags: Array<{ en: string; rw: string }>;
  timeframe: '24h' | '7d' | '30d';
  reason: { en: string; rw: string };
}

interface TrendCategory {
  id: string;
  title: { en: string; rw: string };
  description: { en: string; rw: string };
  icon: React.ComponentType<{ className?: string }>;
  data: TrendData[];
}

export function TrendAnalysisScreen({ language, onBack }: TrendAnalysisScreenProps) {
  const [activeTimeframe, setActiveTimeframe] = useState<'24h' | '7d' | '30d'>('7d');
  const [activeCategory, setActiveCategory] = useState('trending');

  const content = {
    en: {
      title: 'Food Trends',
      subtitle: 'What\'s hot in your area',
      trending: 'Trending',
      popular: 'Popular',
      rising: 'Rising',
      categories: 'Categories',
      last24h: 'Last 24h',
      last7d: 'Last 7 days',
      last30d: 'Last 30 days',
      orders: 'orders',
      trendUp: 'Trending up',
      trendDown: 'Trending down',
      stable: 'Stable',
      viewMenu: 'View Menu',
      orderNow: 'Order Now',
      hotTrends: 'Hot Trends',
      popularDishes: 'Popular Dishes',
      risingStars: 'Rising Stars',
      insights: 'Trend Insights',
      basedOn: 'Based on',
      from: 'from',
      restaurants: 'restaurants',
      percent: '% change'
    },
    rw: {
      title: 'Icyerekezo cy\'Ibiryo',
      subtitle: 'Ibikunda mu gace kawe',
      trending: 'Bikunda',
      popular: 'Bikunzwe',
      rising: 'Bizamuka',
      categories: 'Ibyiciro',
      last24h: 'Amasaha 24 ashize',
      last7d: 'Iminsi 7 ishize',
      last30d: 'Amezi 30 ashize',
      orders: 'amakurirane',
      trendUp: 'Bikunda bizamuka',
      trendDown: 'Bikunda biragabanuka',
      stable: 'Bihagaze',
      viewMenu: 'Reba Menu',
      orderNow: 'Tumiza Ubu',
      hotTrends: 'Icyerekezo Gishyushye',
      popularDishes: 'Ibiryo Bikunzwe',
      risingStars: 'Inyenyeri Zizamuka',
      insights: 'Ubushishozi bw\'Icyerekezo',
      basedOn: 'Bishingiye ku',
      from: 'kuva',
      restaurants: 'ibibanza',
      percent: '% impinduka'
    }
  };

  // Mock trend data
  const mockTrendData: TrendCategory[] = [
    {
      id: 'trending',
      title: content[language].hotTrends,
      description: { en: 'Items with the highest growth', rw: 'Ibintu bikunda cyane ubu' },
      icon: TrendingUp,
      data: [
        {
          id: 't1',
          name: { en: 'Korean BBQ Tacos', rw: 'Tacos za BBQ ya Koreya' },
          restaurant: { en: 'Fusion Street', rw: 'Umuhanda wa Fusion' },
          trend: 'up',
          percentage: 145,
          orders: 89,
          rating: 4.8,
          price: 5200,
          category: 'fusion',
          tags: [
            { en: 'Trending', rw: 'Bikunda' },
            { en: 'Fusion', rw: 'Bihurije' }
          ],
          timeframe: '7d',
          reason: { en: 'Featured in social media', rw: 'Byagaragaye kuri social media' }
        },
        {
          id: 't2',
          name: { en: 'Avocado Toast Deluxe', rw: 'Umugati wa Avocado Mwiza' },
          restaurant: { en: 'Green Cafe', rw: 'Cafe y\'Icyatsi' },
          trend: 'up',
          percentage: 89,
          orders: 67,
          rating: 4.6,
          price: 3800,
          category: 'healthy',
          tags: [
            { en: 'Healthy', rw: 'Biryoshye' },
            { en: 'Trending', rw: 'Bikunda' }
          ],
          timeframe: '7d',
          reason: { en: 'Health trend influence', rw: 'Bikurikira ubuzima bwiza' }
        },
        {
          id: 't3',
          name: { en: 'Bubble Tea Supreme', rw: 'Icyayi cy\'Utubuto Cyiza' },
          restaurant: { en: 'Bubble Paradise', rw: 'Paradi y\'Utubuto' },
          trend: 'up',
          percentage: 76,
          orders: 134,
          rating: 4.7,
          price: 2500,
          category: 'beverages',
          tags: [
            { en: 'Sweet', rw: 'Biryoshye' },
            { en: 'Cold', rw: 'Bikonje' }
          ],
          timeframe: '7d',
          reason: { en: 'Summer weather boost', rw: 'Ikirere cy\'impeshyi cyongeje' }
        }
      ]
    },
    {
      id: 'popular',
      title: content[language].popularDishes,
      description: { en: 'Most ordered items overall', rw: 'Ibintu bikunze gutumizwa' },
      icon: Star,
      data: [
        {
          id: 'p1',
          name: { en: 'Classic Burger', rw: 'Burger Isanzwe' },
          restaurant: { en: 'Burger House', rw: 'Inzu ya Burger' },
          trend: 'stable',
          percentage: 5,
          orders: 256,
          rating: 4.5,
          price: 4200,
          category: 'fast-food',
          tags: [
            { en: 'Classic', rw: 'Isanzwe' },
            { en: 'Popular', rw: 'Ikunzwe' }
          ],
          timeframe: '7d',
          reason: { en: 'Consistent favorite', rw: 'Buri gihe bikunzwe' }
        },
        {
          id: 'p2',
          name: { en: 'Margherita Pizza', rw: 'Pizza ya Margherita' },
          restaurant: { en: 'Italian Corner', rw: 'Kona y\'Ubutaliyani' },
          trend: 'stable',
          percentage: 2,
          orders: 198,
          rating: 4.4,
          price: 6500,
          category: 'italian',
          tags: [
            { en: 'Traditional', rw: 'Gakondo' },
            { en: 'Vegetarian', rw: 'Imboga' }
          ],
          timeframe: '7d',
          reason: { en: 'Timeless classic', rw: 'Isanzwe idahagarara' }
        }
      ]
    },
    {
      id: 'rising',
      title: content[language].risingStars,
      description: { en: 'New items gaining momentum', rw: 'Ibintu bishya bizamuka' },
      icon: BarChart3,
      data: [
        {
          id: 'r1',
          name: { en: 'Plant-Based Bowls', rw: 'Ibikombe by\'Ibimera' },
          restaurant: { en: 'Earth Kitchen', rw: 'Igikoni cy\'Isi' },
          trend: 'up',
          percentage: 234,
          orders: 43,
          rating: 4.9,
          price: 5800,
          category: 'vegan',
          tags: [
            { en: 'Vegan', rw: 'Ibimera Byonyine' },
            { en: 'New', rw: 'Gishya' }
          ],
          timeframe: '7d',
          reason: { en: 'Growing vegan interest', rw: 'Kwiyongera kw\'ubunyangamugayo bw\'ibimera' }
        },
        {
          id: 'r2',
          name: { en: 'Ethiopian Injera', rw: 'Injera y\'Etiyopiya' },
          restaurant: { en: 'Addis Kitchen', rw: 'Igikoni cya Addis' },
          trend: 'up',
          percentage: 156,
          orders: 28,
          rating: 4.6,
          price: 4800,
          category: 'african',
          tags: [
            { en: 'Traditional', rw: 'Gakondo' },
            { en: 'Authentic', rw: 'Nyakuri' }
          ],
          timeframe: '7d',
          reason: { en: 'Cultural food exploration', rw: 'Gushakisha ibiryo by\'imico' }
        }
      ]
    }
  ];

  const categories = mockTrendData;
  const activeData = categories.find(cat => cat.id === activeCategory)?.data || [];

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable', percentage: number) => {
    if (trend === 'up') return 'text-green-600 bg-green-100';
    if (trend === 'down') return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const timeframes = [
    { id: '24h', label: content[language].last24h },
    { id: '7d', label: content[language].last7d },
    { id: '30d', label: content[language].last30d }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col fixed inset-0">
      {/* Fixed Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-border/30 pt-safe flex-shrink-0 z-10">
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
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              <h1 className="text-foreground font-medium">{content[language].title}</h1>
            </div>
            <p className="text-xs text-muted-foreground">{content[language].subtitle}</p>
          </div>
          
          <div className="w-12" />
        </div>
      </div>

      {/* Scrollable Content Area with smooth mobile-native scrolling */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full custom-scrollbar overflow-y-auto touch-scroll p-4 will-change-scroll" style={{ paddingBottom: `calc(env(safe-area-inset-bottom) + 24px)` }}>
        {/* Timeframe Selector */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 mb-6 border border-white/20">
          <div className="grid grid-cols-3 gap-1">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.id}
                onClick={() => setActiveTimeframe(timeframe.id as any)}
                className={`p-3 rounded-xl transition-all text-sm font-medium ${
                  activeTimeframe === timeframe.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 mb-6 border border-white/20">
          <div className="grid grid-cols-3 gap-1">
            {categories.map((category) => {
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
        </div>

        {/* Insights Summary */}
        <div className="bg-gradient-to-r from-primary/10 to-orange-600/10 border border-primary/20 rounded-3xl p-6 mb-6">
          <h2 className="text-foreground font-medium mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            {content[language].insights}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary mb-1">
                {activeData.reduce((sum, item) => sum + item.orders, 0)}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === 'en' ? 'Total Orders' : 'Igiteranyo cy\'Amakurirane'}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 mb-1">
                +{Math.round(activeData.reduce((sum, item) => sum + item.percentage, 0) / activeData.length)}%
              </p>
              <p className="text-xs text-muted-foreground">
                {language === 'en' ? 'Avg Growth' : 'Ikwirakwiza Rusange'}
              </p>
            </div>
          </div>
        </div>

        {/* Trend Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${activeTimeframe}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {activeData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20"
              >
                {/* Header with Rank */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">
                      #{index + 1}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-foreground font-medium">
                        {item.name[language]}
                      </h3>
                      {getTrendIcon(item.trend)}
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-2">
                      {item.restaurant[language]}
                    </p>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag[language]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={`text-xs px-2 py-1 mb-2 ${getTrendColor(item.trend, item.percentage)}`}>
                      {item.trend === 'up' ? '+' : item.trend === 'down' ? '-' : ''}
                      {item.percentage}%
                    </Badge>
                    <p className="text-muted-foreground text-xs">
                      {item.orders} {content[language].orders}
                    </p>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{item.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{item.orders}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{item.timeframe}</span>
                  </div>
                </div>

                {/* Trend Reason */}
                <div className="bg-muted/30 rounded-2xl p-3 mb-4">
                  <p className="text-muted-foreground text-sm">
                    <span className="font-medium">{content[language].basedOn}:</span> {item.reason[language]}
                  </p>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-primary">
                      {item.price.toLocaleString()}
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
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      {content[language].orderNow}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

          {/* Empty State */}
          {activeData.length === 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-foreground font-medium mb-2">
                {language === 'en' ? 'No Trend Data' : 'Nta makuru y\'icyerekezo'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {language === 'en' 
                  ? 'Trend analysis is not available for this timeframe.'
                  : 'Isesengura ry\'icyerekezo ntiriboneka kuri iki gihe.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}