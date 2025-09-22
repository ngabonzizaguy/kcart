import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Share2, 
  Copy, 
  Users, 
  Gift, 
  DollarSign,
  MessageCircle,
  Mail,
  Twitter,
  Facebook,
  Instagram,
  Check,
  Trophy,
  Calendar,
  User,
  Crown,
  Coins,
  TrendingUp,
  Heart,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface ReferralsScreenProps {
  language: 'en' | 'rw';
  onBack: () => void;
}

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  currentMonthEarnings: number;
  rank: number;
  nextRankTarget: number;
}

interface Referral {
  id: string;
  name: string;
  status: 'pending' | 'completed' | 'joined';
  dateReferred: string;
  dateCompleted?: string;
  bonusEarned: number;
  avatar?: string;
}

interface ReferralReward {
  id: string;
  title: { en: string; rw: string };
  description: { en: string; rw: string };
  amount: number;
  condition: { en: string; rw: string };
  type: 'points' | 'cash' | 'discount';
  icon: React.ComponentType<{ className?: string }>;
}

const mockStats: ReferralStats = {
  totalReferrals: 12,
  successfulReferrals: 8,
  pendingReferrals: 4,
  totalEarnings: 24500,
  currentMonthEarnings: 8500,
  rank: 23,
  nextRankTarget: 15
};

const mockReferrals: Referral[] = [
  {
    id: 'ref-1',
    name: 'Jean Claude',
    status: 'completed',
    dateReferred: '2024-12-20',
    dateCompleted: '2024-12-22',
    bonusEarned: 3000,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
  },
  {
    id: 'ref-2', 
    name: 'Marie Rose',
    status: 'completed',
    dateReferred: '2024-12-18',
    dateCompleted: '2024-12-19',
    bonusEarned: 3000,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b25619e4?w=100'
  },
  {
    id: 'ref-3',
    name: 'Patrick K.',
    status: 'joined',
    dateReferred: '2024-12-15',
    bonusEarned: 1500,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
  },
  {
    id: 'ref-4',
    name: 'Alice M.',
    status: 'pending',
    dateReferred: '2024-12-28',
    bonusEarned: 0
  },
  {
    id: 'ref-5',
    name: 'David N.',
    status: 'pending', 
    dateReferred: '2024-12-27',
    bonusEarned: 0
  }
];

const referralRewards: ReferralReward[] = [
  {
    id: 'signup-bonus',
    title: { en: 'Friend Signs Up', rw: 'Inshuti Yinjira' },
    description: { en: 'When your friend creates an account', rw: 'Iyo inshuti yawe ikora konti' },
    amount: 1500,
    condition: { en: 'Account created', rw: 'Konti yaremwe' },
    type: 'cash',
    icon: User
  },
  {
    id: 'first-order',
    title: { en: 'First Order Bonus', rw: 'Igihembo cy\'Ikurikira Rya Mbere' },
    description: { en: 'When your friend makes their first order', rw: 'Iyo inshuti yawe itanze ikurikira ryayo rya mbere' },
    amount: 3000,
    condition: { en: 'First order placed', rw: 'Ikurikira rya mbere ritanzwe' },
    type: 'cash',
    icon: Gift
  },
  {
    id: 'loyalty-bonus',
    title: { en: 'Loyalty Milestone', rw: 'Intego y\'Ingwate' },
    description: { en: 'Bonus when friend reaches 5 orders', rw: 'Igihembo iyo inshuti igeze ku bikurikira 5' },
    amount: 250,
    condition: { en: '5 orders completed', rw: 'Bikurikira 5 byujujwe' },
    type: 'points',
    icon: Trophy
  }
];

export function ReferralsScreen({ language, onBack }: ReferralsScreenProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  
  const referralCode = 'DELIGO2025JC';
  const referralLink = `https://deligo.app/ref/${referralCode}`;

  const content = {
    en: {
      title: 'Referrals',
      subtitle: 'Invite friends and earn rewards together',
      overview: 'Overview',
      invite: 'Invite',
      myReferrals: 'My Referrals',
      yourReferralCode: 'Your Referral Code',
      shareWithFriends: 'Share with Friends',
      copyCode: 'Copy Code',
      copyLink: 'Copy Link',
      copied: 'Copied!',
      shareVia: 'Share via',
      customMessage: 'Add a personal message (optional)',
      messagePlaceholder: 'Hey! Try DeliGo - the best food delivery app in Kigali. Use my code to get started!',
      sendInvite: 'Send Invite',
      totalReferrals: 'Total Referrals',
      successfulReferrals: 'Successful',
      pendingReferrals: 'Pending',
      totalEarnings: 'Total Earnings',
      thisMonth: 'This Month',
      leaderboardRank: 'Leaderboard Rank',
      nextRankIn: 'Next rank in',
      moreReferrals: 'more referrals',
      howItWorks: 'How It Works',
      step1: 'Share your code',
      step1Desc: 'Send your referral code to friends',
      step2: 'Friend joins',
      step2Desc: 'They sign up using your code',
      step3: 'Both earn',
      step3Desc: 'You both get rewards for orders',
      rewardBreakdown: 'Reward Breakdown',
      status: 'Status',
      dateReferred: 'Referred',
      dateCompleted: 'Completed',
      bonusEarned: 'Bonus Earned',
      pending: 'Pending',
      completed: 'Completed',
      joined: 'Joined',
      noReferrals: 'No referrals yet',
      noReferralsDesc: 'Start inviting friends to earn rewards!',
      inviteNow: 'Invite Friends Now',
      shareSuccess: 'Invitation shared successfully!',
      terms: 'Terms & Conditions apply. Rewards credited after successful order completion.'
    },
    rw: {
      title: 'Kwegurira',
      subtitle: 'Tugurira inshuti mwongere ibihembo',
      overview: 'Incamake',
      invite: 'Tugurira',
      myReferrals: 'Abo Neguye',
      yourReferralCode: 'Kode Yawe yo Kwegurira',
      shareWithFriends: 'Sangira n\'Inshuti',
      copyCode: 'Gukoporora Kode',
      copyLink: 'Gukoporora Link',
      copied: 'Byakoporoye!',
      shareVia: 'Sangira ukoresha',
      customMessage: 'Ongeraho ubutumwa bwawe (ntibyagomba)',
      messagePlaceholder: 'Mwiriwe! Mugerageze DeliGo - porogaramu nziza yo gutanga ibiryo muri Kigali. Mukoreshe kode yanjye!',
      sendInvite: 'Kohereza Ubutumwa',
      totalReferrals: 'Abo Bose Beguye',
      successfulReferrals: 'Byatsinze',
      pendingReferrals: 'Bitegereje',
      totalEarnings: 'Amafaranga Yose',
      thisMonth: 'Ukw\'Ukwezi',
      leaderboardRank: 'Umwanya mu Rutonde',
      nextRankIn: 'Umwanya ukurikira mu',
      moreReferrals: 'kwegurira ikindi',
      howItWorks: 'Uburyo Bikora',
      step1: 'Sangira kode yawe',
      step1Desc: 'Kohereza kode yawe ku nshuti',
      step2: 'Inshuti yinjira',
      step2Desc: 'Bazifashisha kode yawe mu kwinjira',
      step3: 'Mwombi munabona',
      step3Desc: 'Mwombi munabona ibihembo ku bikurikira',
      rewardBreakdown: 'Ibihembo Bitandukanye',
      status: 'Uko Bimeze',
      dateReferred: 'Italiki Yeguwe',
      dateCompleted: 'Italiki Yarangiye',
      bonusEarned: 'Igihembo Cyabonetse',
      pending: 'Bitegereje',
      completed: 'Byarangiye',
      joined: 'Yinjiye',
      noReferrals: 'Nta muntu weguje',
      noReferralsDesc: 'Tangira kwegurira inshuti wbone ibihembo!',
      inviteNow: 'Tugurira Inshuti Ubu',
      shareSuccess: 'Ubutumwa bwoherejwe neza!',
      terms: 'Amabwiriza n\'amategeko abikurikiye. Ibihembo bitangwa nyuma y\'ikurikira ryujujwe.'
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      toast.success(content[language].copied);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleShare = async (platform: string) => {
    const message = customMessage || 
      (language === 'en' 
        ? 'Hey! Try DeliGo - the best food delivery app in Kigali. Use my code to get started!'
        : 'Mwiriwe! Mugerageze DeliGo - porogaramu nziza yo gutanga ibiryo muri Kigali. Mukoreshe kode yanjye!'
      );
    
    const shareText = `${message}\n\nReferral Code: ${referralCode}\nDownload: ${referralLink}`;
    
    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: 'DeliGo Referral',
          text: shareText,
          url: referralLink
        });
        toast.success(content[language].shareSuccess);
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback to copy
      await copyToClipboard(shareText, 'message');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'rw-RW', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} RWF`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'joined': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
          
          {/* Stats Overview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-gray-800 font-semibold text-lg mb-1">{content[language].subtitle}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
                <p className="text-2xl font-bold text-blue-600">{mockStats.totalReferrals}</p>
                <p className="text-blue-700 text-sm font-medium">{content[language].totalReferrals}</p>
                <div className="flex justify-center gap-4 mt-2 text-xs">
                  <span className="text-green-600">{mockStats.successfulReferrals} {content[language].successfulReferrals}</span>
                  <span className="text-orange-600">{mockStats.pendingReferrals} {content[language].pendingReferrals}</span>
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl">
                <p className="text-lg font-bold text-green-600">{formatCurrency(mockStats.totalEarnings)}</p>
                <p className="text-green-700 text-sm font-medium">{content[language].totalEarnings}</p>
                <p className="text-green-600 text-xs mt-1">
                  {formatCurrency(mockStats.currentMonthEarnings)} {content[language].thisMonth}
                </p>
              </div>
            </div>

            {/* Leaderboard Position */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-800">#{mockStats.rank}</span>
              </div>
              <p className="text-purple-700 text-sm">{content[language].leaderboardRank}</p>
              <p className="text-purple-600 text-xs mt-1">
                {content[language].nextRankIn} {mockStats.nextRankTarget - mockStats.totalReferrals} {content[language].moreReferrals}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-1">
              <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                {content[language].overview}
              </TabsTrigger>
              <TabsTrigger value="invite" className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                {content[language].invite}
              </TabsTrigger>
              <TabsTrigger value="referrals" className="rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                {content[language].myReferrals}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* How It Works */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <h3 className="text-gray-800 font-semibold mb-4">{content[language].howItWorks}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Share2 className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">{content[language].step1}</h4>
                      <p className="text-gray-600 text-sm">{content[language].step1Desc}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">{content[language].step2}</h4>
                      <p className="text-gray-600 text-sm">{content[language].step2Desc}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Gift className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">{content[language].step3}</h4>
                      <p className="text-gray-600 text-sm">{content[language].step3Desc}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reward Breakdown */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <h3 className="text-gray-800 font-semibold mb-4">{content[language].rewardBreakdown}</h3>
                <div className="space-y-4">
                  {referralRewards.map((reward) => (
                    <div key={reward.id} className="flex items-center gap-4 p-4 bg-gray-50/80 rounded-2xl">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                        <reward.icon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">{reward.title[language]}</h4>
                        <p className="text-gray-600 text-xs">{reward.description[language]}</p>
                        <p className="text-orange-600 text-xs mt-1">{reward.condition[language]}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {reward.type === 'cash' ? (
                            <DollarSign className="w-4 h-4 text-green-600" />
                          ) : (
                            <Coins className="w-4 h-4 text-orange-600" />
                          )}
                          <span className="font-bold text-gray-800 text-sm">
                            {reward.type === 'cash' ? formatCurrency(reward.amount) : `${reward.amount}pt`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="invite" className="space-y-6 mt-6">
              {/* Referral Code */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <h3 className="text-gray-800 font-semibold mb-4">{content[language].yourReferralCode}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-200">
                    <div className="flex-1">
                      <p className="text-orange-800 font-mono text-lg font-bold tracking-wider">{referralCode}</p>
                      <p className="text-orange-600 text-sm">{content[language].shareWithFriends}</p>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(referralCode, 'code')}
                      className="h-10 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
                    >
                      {copiedText === 'code' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span className="ml-2">{content[language].copyCode}</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                    <div className="flex-1">
                      <p className="text-blue-800 font-medium text-sm truncate">{referralLink}</p>
                      <p className="text-blue-600 text-xs">Referral Link</p>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(referralLink, 'link')}
                      variant="outline"
                      className="h-10 px-4 border-blue-300 text-blue-700 hover:bg-blue-100 rounded-xl"
                    >
                      {copiedText === 'link' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span className="ml-2">{content[language].copyLink}</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Custom Message */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <h3 className="text-gray-800 font-semibold mb-4">{content[language].customMessage}</h3>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder={content[language].messagePlaceholder}
                  className="w-full h-24 p-4 bg-gray-50 border border-gray-200 rounded-2xl resize-none text-sm"
                />
              </div>

              {/* Share Options */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                <h3 className="text-gray-800 font-semibold mb-4">{content[language].shareVia}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleShare('native')}
                    className="h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    {content[language].sendInvite}
                  </Button>
                  <Button
                    onClick={() => handleShare('sms')}
                    variant="outline"
                    className="h-12 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    SMS
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {[
                    { icon: Mail, name: 'Email', color: 'bg-red-500' },
                    { icon: Twitter, name: 'Twitter', color: 'bg-blue-400' },
                    { icon: Facebook, name: 'Facebook', color: 'bg-blue-600' },
                    { icon: Instagram, name: 'Instagram', color: 'bg-pink-500' }
                  ].map((social) => (
                    <button
                      key={social.name}
                      onClick={() => handleShare(social.name.toLowerCase())}
                      className={`h-12 ${social.color} text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity`}
                    >
                      <social.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-4">
                <p className="text-orange-700 text-xs text-center">{content[language].terms}</p>
              </div>
            </TabsContent>

            <TabsContent value="referrals" className="space-y-4 mt-6">
              {mockReferrals.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-800 mb-2">{content[language].noReferrals}</h3>
                  <p className="text-gray-600 text-sm mb-6">{content[language].noReferralsDesc}</p>
                  <Button
                    onClick={() => setActiveTab('invite')}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 px-8"
                  >
                    {content[language].inviteNow}
                  </Button>
                </div>
              ) : (
                mockReferrals.map((referral) => (
                  <div key={referral.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {referral.avatar ? (
                          <img 
                            src={referral.avatar} 
                            alt={referral.name}
                            className="w-full h-full rounded-xl object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-800">{referral.name}</h4>
                          <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(referral.status)}`}>
                            {content[language][referral.status as keyof typeof content.en]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{content[language].dateReferred}: {formatDate(referral.dateReferred)}</span>
                          </div>
                          {referral.dateCompleted && (
                            <div className="flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>{content[language].dateCompleted}: {formatDate(referral.dateCompleted)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          {referral.bonusEarned > 0 ? formatCurrency(referral.bonusEarned) : '-'}
                        </p>
                        <p className="text-xs text-gray-500">{content[language].bonusEarned}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}