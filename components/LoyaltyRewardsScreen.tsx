import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Crown, 
  Star, 
  Gift, 
  Coins, 
  Trophy, 
  Clock, 
  Zap,
  Coffee,
  Pizza,
  Utensils,
  TrendingUp,
  Calendar,
  Award,
  Sparkles
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LoyaltyRewardsScreenProps {
  language: 'en' | 'rw';
  onBack: () => void;
}

interface LoyaltyTier {
  id: string;
  name: { en: string; rw: string };
  description: { en: string; rw: string };
  pointsRequired: number;
  benefits: string[];
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Reward {
  id: string;
  title: { en: string; rw: string };
  description: { en: string; rw: string };
  pointsCost: number;
  category: 'food' | 'delivery' | 'experience';
  image: string;
  isLimited?: boolean;
  expiresAt?: string;
  discount?: number;
}

interface Transaction {
  id: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: { en: string; rw: string };
  date: string;
  orderId?: string;
}

const loyaltyTiers: LoyaltyTier[] = [
  {
    id: 'bronze',
    name: { en: 'Bronze Explorer', rw: 'Umushyitsi wa Bronze' },
    description: { en: 'Start your DeliGo journey', rw: 'Tangira urugendo muri DeliGo' },
    pointsRequired: 0,
    benefits: ['1 point per 100 RWF spent', '5% bonus on weekends'],
    color: 'from-amber-500 to-amber-600',
    icon: Award
  },
  {
    id: 'silver',
    name: { en: 'Silver Foodie', rw: 'Umukunzi w\'ibiryo wa Silver' },
    description: { en: 'Enjoy enhanced rewards', rw: 'Wongere ibihembo' },
    pointsRequired: 1000,
    benefits: ['1.5 points per 100 RWF', '10% weekend bonus', 'Free delivery monthly'],
    color: 'from-slate-400 to-slate-500',
    icon: Star
  },
  {
    id: 'gold',
    name: { en: 'Gold Connoisseur', rw: 'Umushyitsi wa Gold' },
    description: { en: 'Premium dining experiences', rw: 'Ubunyangamugayo bwo kurya' },
    pointsRequired: 5000,
    benefits: ['2 points per 100 RWF', '15% weekend bonus', 'Priority support', 'Exclusive offers'],
    color: 'from-yellow-400 to-yellow-500',
    icon: Trophy
  },
  {
    id: 'platinum',
    name: { en: 'Platinum Elite', rw: 'Elite ya Platinum' },
    description: { en: 'Ultimate DeliGo experience', rw: 'Ubunyangamugayo bwa nyuma muri DeliGo' },
    pointsRequired: 15000,
    benefits: ['3 points per 100 RWF', '25% weekend bonus', 'VIP support', 'Chef experiences', 'Early access'],
    color: 'from-purple-500 to-purple-600',
    icon: Crown
  }
];

const mockRewards: Reward[] = [
  {
    id: 'free-coffee',
    title: { en: 'Free Coffee', rw: 'Ikawa y\'Ubuntu' },
    description: { en: 'Any coffee drink from partner cafes', rw: 'Ikawa iyo ariyo yose mu majo dufatanije' },
    pointsCost: 150,
    category: 'food',
    image: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=300",
    discount: 100
  },
  {
    id: 'pizza-discount',
    title: { en: '30% Off Pizza', rw: 'Kugabanuka 30% kuri Pizza' },
    description: { en: '30% discount on any pizza order', rw: 'Kugabanuka 30% kuri pizza iyo ariyo yose' },
    pointsCost: 400,
    category: 'food',
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300",
    discount: 30,
    isLimited: true
  },
  {
    id: 'free-delivery',
    title: { en: 'Free Delivery Week', rw: 'Icyumweru cy\'Ubufasha bw\'Ubuntu' },
    description: { en: 'Free delivery for 7 days', rw: 'Ubufasha bw\'ubuntu ku minsi 7' },
    pointsCost: 300,
    category: 'delivery',
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300"
  },
  {
    id: 'chef-experience',
    title: { en: 'Chef\'s Table Experience', rw: 'Ubunyangamugayo bw\'ameza ya Chef' },
    description: { en: 'Exclusive dining experience with renowned chefs', rw: 'Ubunyangamugayo bwihariye bwo kurya na ba chef bazwi' },
    pointsCost: 2500,
    category: 'experience',
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300",
    isLimited: true,
    expiresAt: '2025-01-31'
  },
  {
    id: 'family-meal',
    title: { en: 'Family Meal Deal', rw: 'Amasezerano y\'ibiryo by\'umuryango' },
    description: { en: '50% off family meals for 4+ people', rw: 'Kugabanuka 50% ku biryo by\'umuryango w\'abantu 4+' },
    pointsCost: 800,
    category: 'food',
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=300",
    discount: 50
  },
  {
    id: 'weekend-boost',
    title: { en: 'Weekend Points Boost', rw: 'Kongera Amanota mu Cyumweru' },
    description: { en: 'Double points on weekend orders', rw: 'Amanota y\'inshuro ebyiri ku cyumweru' },
    pointsCost: 250,
    category: 'experience',
    image: "https://images.unsplash.com/photo-1516685018646-549198525c1b?w=300"
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    type: 'earned',
    points: 45,
    description: { en: 'Order from Heaven Restaurant', rw: 'Gusaba muri Heaven Restaurant' },
    date: '2024-12-28',
    orderId: 'DG-1001'
  },
  {
    id: 'txn-2',
    type: 'redeemed',
    points: -150,
    description: { en: 'Free Coffee reward claimed', rw: 'Ikawa y\'ubuntu yahawe' },
    date: '2024-12-27'
  },
  {
    id: 'txn-3',
    type: 'earned',
    points: 32,
    description: { en: 'Order from Tokyo Sushi Bar', rw: 'Gusaba muri Tokyo Sushi Bar' },
    date: '2024-12-26',
    orderId: 'DG-1002'
  },
  {
    id: 'txn-4',
    type: 'earned',
    points: 28,
    description: { en: 'Weekend bonus points', rw: 'Amanota y\'ikirenga y\'icyumweru' },
    date: '2024-12-25'
  }
];

export function LoyaltyRewardsScreen({ language, onBack }: LoyaltyRewardsScreenProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Mock user data
  const currentPoints = 1247;
  const currentTier = loyaltyTiers[1]; // Silver tier
  const nextTier = loyaltyTiers[2]; // Gold tier
  const pointsToNextTier = nextTier.pointsRequired - currentPoints;
  const tierProgress = ((currentPoints - currentTier.pointsRequired) / (nextTier.pointsRequired - currentTier.pointsRequired)) * 100;

  const content = {
    en: {
      title: 'Loyalty & Rewards',
      subtitle: 'Earn points, unlock rewards, enjoy exclusive benefits',
      currentTier: 'Current Tier',
      pointsBalance: 'Points Balance',
      nextTier: 'Next Tier',
      pointsAway: 'points away',
      progressToNext: 'Progress to next tier',
      overview: 'Overview',
      rewards: 'Rewards',
      history: 'History',
      redeemReward: 'Redeem Reward',
      pointsRequired: 'points required',
      limitedTime: 'Limited Time',
      expiresOn: 'Expires on',
      earnedPoints: 'Earned Points',
      redeemedPoints: 'Redeemed Points',
      orderRef: 'Order',
      filterAll: 'All',
      filterFood: 'Food',
      filterDelivery: 'Delivery',
      filterExperience: 'Experience',
      tierBenefits: 'Your Benefits',
      howItWorks: 'How It Works',
      step1Title: 'Order & Earn',
      step1Desc: 'Earn points with every order',
      step2Title: 'Unlock Tiers',
      step2Desc: 'Reach new levels for better rewards',
      step3Title: 'Redeem Rewards',
      step3Desc: 'Use points for amazing deals',
      monthlyStats: 'This Month',
      ordersPlaced: 'Orders Placed',
      pointsEarned: 'Points Earned',
      rewardsRedeemed: 'Rewards Redeemed'
    },
    rw: {
      title: 'Ingwate n\'Ibihembo',
      subtitle: 'Injiza amanota, fungura ibihembo, wongere amahirwe',
      currentTier: 'Urwego Rw\'Ubu',
      pointsBalance: 'Amanota Mfite',
      nextTier: 'Urwego Rukurikira',
      pointsAway: 'amanota asigaye',
      progressToNext: 'Aho ugeze mu rwego rukurikira',
      overview: 'Incamake',
      rewards: 'Ibihembo',
      history: 'Amateka',
      redeemReward: 'Fata Igihembo',
      pointsRequired: 'amanota akenewe',
      limitedTime: 'Igihe Gito',
      expiresOn: 'Birangira ku ya',
      earnedPoints: 'Amanota Yinjijwe',
      redeemedPoints: 'Amanota Yahawe',
      orderRef: 'Ikurikira',
      filterAll: 'Byose',
      filterFood: 'Ibiryo',
      filterDelivery: 'Gutanga',
      filterExperience: 'Ubunyangamugayo',
      tierBenefits: 'Inyungu Zawe',
      howItWorks: 'Uburyo Bikora',
      step1Title: 'Saba Winjize',
      step1Desc: 'Injiza amanota buri kintu usaba',
      step2Title: 'Fungura Inzego',
      step2Desc: 'Gera ku nzego nshya ugere ku bihembo byiza',
      step3Title: 'Fata Ibihembo',
      step3Desc: 'Koresha amanota ugere ku macunga meza',
      monthlyStats: 'Ukw\'Ukwezi',
      ordersPlaced: 'Ibyasabwe',
      pointsEarned: 'Amanota Yinjijwe',
      rewardsRedeemed: 'Ibihembo Byahawe'
    }
  };

  const filteredRewards = selectedCategory === 'all' 
    ? mockRewards 
    : mockRewards.filter(reward => reward.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'rw-RW');
  };

  const handleRedeemReward = (reward: Reward) => {
    // TODO: Implement reward redemption logic
    alert(`${content[language].redeemReward}: ${reward.title[language]}`);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-orange-100 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 flex-shrink-0">
        <div className="flex items-center justify-between p-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{content[language].title}</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-6 py-6 pb-32 space-y-6">
          
          {/* Tier Status Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 bg-gradient-to-r ${currentTier.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <currentTier.icon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-gray-800 font-semibold text-lg mb-1">{currentTier.name[language]}</h2>
              <p className="text-gray-600 text-sm mb-4">{currentTier.description[language]}</p>
              
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Coins className="w-4 h-4 text-orange-500" />
                    <span className="text-2xl font-bold text-gray-800">{currentPoints.toLocaleString()}</span>
                  </div>
                  <p className="text-gray-600 text-xs">{content[language].pointsBalance}</p>
                </div>
              </div>

              {/* Progress to Next Tier */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">{content[language].progressToNext}</span>
                  <span className="text-gray-800 font-medium text-sm">
                    {pointsToNextTier.toLocaleString()} {content[language].pointsAway}
                  </span>
                </div>
                <Progress value={tierProgress} className="h-2" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{currentTier.name[language]}</span>
                  <span className="text-gray-800 font-medium">{nextTier.name[language]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
            <h3 className="text-gray-800 font-semibold mb-4">{content[language].monthlyStats}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Utensils className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-lg font-bold text-gray-800">12</p>
                <p className="text-xs text-gray-600">{content[language].ordersPlaced}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-lg font-bold text-gray-800">387</p>
                <p className="text-xs text-gray-600">{content[language].pointsEarned}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Gift className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-lg font-bold text-gray-800">3</p>
                <p className="text-xs text-gray-600">{content[language].rewardsRedeemed}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-1">
              <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                {content[language].overview}
              </TabsTrigger>
              <TabsTrigger value="rewards" className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                {content[language].rewards}
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                {content[language].history}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* How It Works */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <h3 className="text-gray-800 font-semibold mb-4">{content[language].howItWorks}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Utensils className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">{content[language].step1Title}</h4>
                      <p className="text-gray-600 text-sm">{content[language].step1Desc}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">{content[language].step2Title}</h4>
                      <p className="text-gray-600 text-sm">{content[language].step2Desc}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Gift className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">{content[language].step3Title}</h4>
                      <p className="text-gray-600 text-sm">{content[language].step3Desc}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier Benefits */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <h3 className="text-gray-800 font-semibold mb-4">{content[language].tierBenefits}</h3>
                <div className="space-y-2">
                  {currentTier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-600 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6 mt-6">
              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {[
                  { id: 'all', name: content[language].filterAll, icon: Sparkles },
                  { id: 'food', name: content[language].filterFood, icon: Pizza },
                  { id: 'delivery', name: content[language].filterDelivery, icon: Zap },
                  { id: 'experience', name: content[language].filterExperience, icon: Star }
                ].map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-white/80 text-gray-600 hover:bg-orange-100'
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Rewards Grid */}
              <div className="space-y-4">
                {filteredRewards.map((reward) => (
                  <div key={reward.id} className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <ImageWithFallback
                          src={reward.image}
                          alt={reward.title[language]}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-800 text-sm">{reward.title[language]}</h4>
                              {reward.isLimited && (
                                <Badge className="bg-red-100 text-red-600 text-xs px-2 py-0.5">
                                  {content[language].limitedTime}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-xs leading-relaxed">{reward.description[language]}</p>
                            {reward.expiresAt && (
                              <p className="text-red-500 text-xs mt-1">
                                {content[language].expiresOn} {formatDate(reward.expiresAt)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Coins className="w-4 h-4 text-orange-500" />
                            <span className="font-semibold text-gray-800 text-sm">{reward.pointsCost}</span>
                            <span className="text-gray-500 text-xs">{content[language].pointsRequired}</span>
                          </div>
                          <Button
                            onClick={() => handleRedeemReward(reward)}
                            disabled={currentPoints < reward.pointsCost}
                            className="h-8 px-4 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50"
                          >
                            {content[language].redeemReward}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-6">
              {mockTransactions.map((transaction) => (
                <div key={transaction.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        transaction.type === 'earned' ? 'bg-green-100' : 'bg-orange-100'
                      }`}>
                        {transaction.type === 'earned' ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <Gift className="w-5 h-5 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{transaction.description[language]}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(transaction.date)}</span>
                          {transaction.orderId && (
                            <>
                              <span>•</span>
                              <span>{content[language].orderRef} {transaction.orderId}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-semibold ${
                        transaction.type === 'earned' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {transaction.type === 'earned' ? '+' : ''}{transaction.points}
                      </span>
                      <p className="text-xs text-gray-500">
                        {transaction.type === 'earned' ? content[language].earnedPoints : content[language].redeemedPoints}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}