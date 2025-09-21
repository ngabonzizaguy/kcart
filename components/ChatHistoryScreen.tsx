import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Phone, 
  Search, 
  Clock, 
  User,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Filter,
  MoreVertical,
  Archive,
  Star,
  Trash2,
  MessageCircle,
  Video,
  Calendar,
  ChevronRight
} from 'lucide-react';

interface ChatHistoryScreenProps {
  language: 'en' | 'rw';
  onBack: () => void;
  onOpenChat?: (conversationId: string) => void;
}

interface Conversation {
  id: string;
  vendorName: { en: string; rw: string };
  vendorAvatar: string;
  lastMessage: { en: string; rw: string };
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  type: 'text' | 'call' | 'video';
  orderReference?: string;
}

interface CallLog {
  id: string;
  vendorName: { en: string; rw: string };
  vendorAvatar: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration?: number; // in seconds, undefined for missed calls
  timestamp: Date;
  orderReference?: string;
}

// Mock conversation data - replace with real API calls
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    vendorName: { en: 'Golden Spoon Restaurant', rw: 'Ibibanza bya Golden Spoon' },
    vendorAvatar: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=100&h=100&fit=crop&crop=face',
    lastMessage: { en: 'Your order is ready for pickup!', rw: 'Ikurikira ryawe ryiteguye gutwarwa!' },
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    unreadCount: 2,
    isOnline: true,
    type: 'text',
    orderReference: 'DG-2025-001'
  },
  {
    id: 'conv-2',
    vendorName: { en: 'Pizza Palace', rw: 'Pizza Palace' },
    vendorAvatar: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=100&h=100&fit=crop&crop=face',
    lastMessage: { en: 'Thank you for your order! We are preparing it now.', rw: 'Urakoze kubisaba! Turimo bitegura.' },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    unreadCount: 0,
    isOnline: false,
    type: 'text',
    orderReference: 'DG-2025-002'
  },
  {
    id: 'conv-3',
    vendorName: { en: 'Fresh Garden Cafe', rw: 'Cafe ya Fresh Garden' },
    vendorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    lastMessage: { en: 'Voice call ended', rw: 'Guhamagara byarangiye' },
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    unreadCount: 0,
    isOnline: true,
    type: 'call'
  },
  {
    id: 'conv-4',
    vendorName: { en: 'Spice Route Kitchen', rw: 'Spice Route Kitchen' },
    vendorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    lastMessage: { en: 'Can you please confirm your delivery address?', rw: 'Urashobora kwemeza aho uri?' },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    unreadCount: 1,
    isOnline: false,
    type: 'text',
    orderReference: 'DG-2025-003'
  },
  {
    id: 'conv-5',
    vendorName: { en: 'Sunrise Bakery', rw: 'Ibibanza bya Sunrise' },
    vendorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e2b34c?w=100&h=100&fit=crop&crop=face',
    lastMessage: { en: 'Video call ended', rw: 'Ikiganiro cya video cyarangiye' },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    unreadCount: 0,
    isOnline: true,
    type: 'video'
  }
];

// Mock call logs data - replace with real API calls
const mockCallLogs: CallLog[] = [
  {
    id: 'call-1',
    vendorName: { en: 'Golden Spoon Restaurant', rw: 'Ibibanza bya Golden Spoon' },
    vendorAvatar: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=100&h=100&fit=crop&crop=face',
    type: 'incoming',
    duration: 180, // 3 minutes
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    orderReference: 'DG-2025-001'
  },
  {
    id: 'call-2',
    vendorName: { en: 'Fresh Garden Cafe', rw: 'Cafe ya Fresh Garden' },
    vendorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    type: 'outgoing',
    duration: 120, // 2 minutes
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 'call-3',
    vendorName: { en: 'Pizza Palace', rw: 'Pizza Palace' },
    vendorAvatar: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=100&h=100&fit=crop&crop=face',
    type: 'missed',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    orderReference: 'DG-2025-002'
  },
  {
    id: 'call-4',
    vendorName: { en: 'Spice Route Kitchen', rw: 'Spice Route Kitchen' },
    vendorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    type: 'outgoing',
    duration: 45, // 45 seconds
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    orderReference: 'DG-2025-003'
  }
];

/**
 * ChatHistoryScreen - Communication Center with Chat History & Call Logs
 * 
 * Features:
 * - Conversation list with vendor names and last messages
 * - Call logs integration with duration and type indicators
 * - Search functionality for past conversations
 * - Filter by message type (text, call, video)
 * - Real-time status indicators (online/offline)
 * - Unread message badges
 * - Order reference linking
 * - Archive and favorite conversations
 * - Mobile-first design with glass morphism
 * 
 * Props:
 * - language: 'en' | 'rw' - Current app language
 * - onBack: () => void - Navigate back callback
 * - onOpenChat: (conversationId: string) => void - Open specific chat callback
 * 
 * TODO: Integrate with real messaging API
 * TODO: Connect to call logs from device or VoIP service
 * TODO: Add real-time message updates via WebSocket
 * TODO: Implement conversation archiving and favorites
 */
export function ChatHistoryScreen({ language, onBack, onOpenChat }: ChatHistoryScreenProps) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [callLogs, setCallLogs] = useState<CallLog[]>(mockCallLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'calls'>('chats');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'call' | 'video'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const content = {
    en: {
      title: 'Chat History',
      subtitle: 'Communication Center',
      searchPlaceholder: 'Search conversations...',
      chats: 'Chats',
      calls: 'Calls',
      filters: 'Filters',
      all: 'All',
      text: 'Text',
      call: 'Call',
      video: 'Video',
      online: 'Online',
      offline: 'Offline',
      noConversations: 'No conversations found',
      noCalls: 'No call logs found',
      startChatting: 'Start chatting with restaurants to see your conversation history here.',
      makeCall: 'Make calls to restaurants to see your call history here.',
      lastSeen: 'Last seen',
      duration: 'Duration',
      missed: 'Missed',
      incoming: 'Incoming',
      outgoing: 'Outgoing',
      orderRef: 'Order',
      today: 'Today',
      yesterday: 'Yesterday',
      thisWeek: 'This week',
      archive: 'Archive',
      favorite: 'Favorite',
      delete: 'Delete',
      more: 'More options',
      minutes: 'min',
      seconds: 'sec',
      ago: 'ago',
      now: 'now'
    },
    rw: {
      title: 'Amateka y\'Ikiganiro',
      subtitle: 'Ikigo cy\'Itumanaho',
      searchPlaceholder: 'Shakisha ibiganiro...',
      chats: 'Ibiganiro',
      calls: 'Guhamagara',
      filters: 'Muyunguruzi',
      all: 'Byose',
      text: 'Ubutumwa',
      call: 'Guhamagara',
      video: 'Video',
      online: 'Kuri Murongo',
      offline: 'Ntakuri Murongo',
      noConversations: 'Nta biganiro byabonetse',
      noCalls: 'Nta mateka yo guhamagara yabonetse',
      startChatting: 'Tangira ikiganiro n\'ibibanza kugira ngo ubone amateka y\'ibiganiro hano.',
      makeCall: 'Hamagara ibibanza kugira ngo ubone amateka y\'guhamagara hano.',
      lastSeen: 'Yasaga',
      duration: 'Igihe',
      missed: 'Byabuze',
      incoming: 'Byinze',
      outgoing: 'Byasohowe',
      orderRef: 'Ikurikira',
      today: 'Uyu munsi',
      yesterday: 'Ejo',
      thisWeek: 'Iki cyumweru',
      archive: 'Bika',
      favorite: 'Byakunze',
      delete: 'Gusiba',
      more: 'Ibindi byinshi',
      minutes: 'iminota',
      seconds: 'isegonda',
      ago: 'ishize',
      now: 'nonaha'
    }
  };

  // Filter conversations based on search query and filter type
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.vendorName[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage[language].toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || conv.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Filter call logs based on search query
  const filteredCallLogs = callLogs.filter(call => {
    return call.vendorName[language].toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Format timestamp for display
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return content[language].now;
    if (minutes < 60) return `${minutes}${content[language].minutes} ${content[language].ago}`;
    if (hours < 24) return `${hours}h ${content[language].ago}`;
    if (days === 1) return content[language].yesterday;
    if (days < 7) return content[language].thisWeek;
    return timestamp.toLocaleDateString();
  };

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}${content[language].minutes} ${secs}${content[language].seconds}`;
    }
    return `${secs}${content[language].seconds}`;
  };

  // Get call type icon and color
  const getCallTypeIcon = (type: 'incoming' | 'outgoing' | 'missed') => {
    switch (type) {
      case 'incoming':
        return <PhoneIncoming className="w-4 h-4 text-green-500" />;
      case 'outgoing':
        return <PhoneOutgoing className="w-4 h-4 text-blue-500" />;
      case 'missed':
        return <PhoneMissed className="w-4 h-4 text-red-500" />;
    }
  };

  // Handle conversation actions
  const handleConversationAction = (conversationId: string, action: 'archive' | 'favorite' | 'delete') => {
    // TODO: Implement real conversation actions
    console.log(`${action} conversation:`, conversationId);
    
    if (action === 'delete') {
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-orange-200/30 pt-safe sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="p-2 h-auto rounded-2xl hover:bg-orange-100/50 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center flex-1 mx-4">
              <h1 className="text-xl font-bold text-gray-800">{content[language].title}</h1>
              <p className="text-sm text-gray-600">{content[language].subtitle}</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 h-auto rounded-2xl hover:bg-orange-100/50 text-gray-600 hover:text-gray-800"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4 bg-white/60 backdrop-blur-sm border-b border-white/20">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={content[language].searchPlaceholder}
            className="pl-12 h-12 bg-white/80 backdrop-blur-sm border-white/30 rounded-2xl text-gray-800 placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Filters (if shown) */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-6 py-4 bg-white/60 backdrop-blur-sm border-b border-white/20"
          >
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {['all', 'text', 'call', 'video'].map((filter) => (
                <Button
                  key={filter}
                  variant={filterType === filter ? "default" : "outline"}
                  onClick={() => setFilterType(filter as any)}
                  className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap ${
                    filterType === filter
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'border-orange-200 text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  {content[language][filter as keyof typeof content[typeof language]]}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className="px-6 py-4 bg-white/60 backdrop-blur-sm border-b border-white/20">
        <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-1 border border-white/30">
          <Button
            variant="ghost"
            onClick={() => setActiveTab('chats')}
            className={`flex-1 h-10 rounded-xl transition-all duration-200 ${
              activeTab === 'chats'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {content[language].chats}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab('calls')}
            className={`flex-1 h-10 rounded-xl transition-all duration-200 ${
              activeTab === 'calls'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Phone className="w-4 h-4 mr-2" />
            {content[language].calls}
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-6 py-4 space-y-4 bottom-nav-spacing">
          {activeTab === 'chats' ? (
            /* Chat Conversations */
            <>
              {filteredConversations.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-gray-800 font-semibold mb-2">{content[language].noConversations}</h3>
                  <p className="text-gray-600 text-sm">{content[language].startChatting}</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20 hover:bg-white/90 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={conversation.vendorAvatar}
                          alt={conversation.vendorName[language]}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                        />
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                        )}
                        {conversation.type === 'call' && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Phone className="w-3 h-3 text-white" />
                          </div>
                        )}
                        {conversation.type === 'video' && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <Video className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-800 truncate pr-2">
                            {conversation.vendorName[language]}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(conversation.timestamp)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate pr-2">
                            {conversation.lastMessage[language]}
                          </p>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {conversation.orderReference && (
                              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-lg">
                                {conversation.orderReference}
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onOpenChat?.(conversation.id)}
                              className="p-1 h-auto rounded-lg hover:bg-orange-100/50"
                            >
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </>
          ) : (
            /* Call Logs */
            <>
              {filteredCallLogs.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center">
                  <PhoneCall className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-gray-800 font-semibold mb-2">{content[language].noCalls}</h3>
                  <p className="text-gray-600 text-sm">{content[language].makeCall}</p>
                </div>
              ) : (
                filteredCallLogs.map((call) => (
                  <motion.div
                    key={call.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={call.vendorAvatar}
                          alt={call.vendorName[language]}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-gray-200">
                          {getCallTypeIcon(call.type)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-800 truncate pr-2">
                            {call.vendorName[language]}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(call.timestamp)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm capitalize ${
                              call.type === 'missed' ? 'text-red-600' : 
                              call.type === 'incoming' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {content[language][call.type]}
                            </span>
                            {call.duration && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-600">
                                  {formatDuration(call.duration)}
                                </span>
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {call.orderReference && (
                              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-lg">
                                {call.orderReference}
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`tel:${call.vendorName[language]}`)}
                              className="p-2 h-auto rounded-lg hover:bg-orange-100/50"
                            >
                              <Phone className="w-4 h-4 text-gray-400" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}