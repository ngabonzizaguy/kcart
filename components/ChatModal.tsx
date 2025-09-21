import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Phone, Video, MoreVertical, Smile, Camera, Mic, MicOff, Check, CheckCheck, Heart, ThumbsUp, Clock, Image } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

/**
 * ChatModal - Live Chat System for Vendor Communication
 * 
 * Features:
 * - Real-time messaging interface with vendor
 * - Chat bubbles with glass design following DeliGo design language
 * - Typing indicators and read receipts
 * - Emoji reactions and quick response options
 * - Voice message support
 * - Image sharing capability
 * - Mobile-first responsive design
 * - Bilingual support (English/Kinyarwanda)
 * 
 * TODO: Add real WebSocket integration for real-time messaging
 * TODO: Connect to Supabase for message persistence
 * TODO: Add voice recording functionality
 * TODO: Add image upload to cloud storage
 */

interface ChatModalProps {
  language: 'en' | 'rw';
  vendorName: string;
  vendorImage: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  type: 'text' | 'voice' | 'image' | 'quick-response';
  content: string;
  sender: 'customer' | 'vendor';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: string[];
}

// Mock conversation data - replace with real chat data
const mockMessages: Message[] = [
  {
    id: '1',
    type: 'text',
    content: 'Hello! Welcome to Golden Spoon. How can I help you today?',
    sender: 'vendor',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: 'read'
  },
  {
    id: '2',
    type: 'text',
    content: 'Hi! I have a question about the Grilled Chicken Special.',
    sender: 'customer',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    status: 'read'
  },
  {
    id: '3',
    type: 'text',
    content: 'Of course! What would you like to know about our signature dish?',
    sender: 'vendor',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    status: 'read'
  },
  {
    id: '4',
    type: 'text',
    content: 'Can you make it extra spicy? And how long does delivery usually take?',
    sender: 'customer',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    status: 'read'
  }
];

export function ChatModal({ language, vendorName, vendorImage, isOpen, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVendorTyping, setIsVendorTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const content = {
    en: {
      chatWith: 'Chat with',
      typeMessage: 'Type a message...',
      send: 'Send',
      calling: 'Calling...',
      videoCall: 'Video Call',
      moreOptions: 'More Options',
      online: 'Online',
      offline: 'Offline',
      typing: 'is typing...',
      delivered: 'Delivered',
      read: 'Read',
      quickResponses: {
        thanks: 'Thank you!',
        yes: 'Yes, that works',
        no: 'No, thank you',
        help: 'I need help',
        ordering: 'Ready to order',
        delivery: 'When will it arrive?'
      },
      reactions: ['❤️', '👍', '😊', '😍', '🔥', '👏'],
      voiceRecording: 'Recording...',
      sendVoice: 'Send Voice Message',
      cancelRecording: 'Cancel Recording'
    },
    rw: {
      chatWith: 'Ganira na',
      typeMessage: 'Andika ubutumwa...',
      send: 'Ohereza',
      calling: 'Arasimbuza...',
      videoCall: 'Gusimbuza mu majwi',
      moreOptions: 'Ubundi Buryo',
      online: 'Ahari',
      offline: 'Ntahari',
      typing: 'ariko andika...',
      delivered: 'Byageze',
      read: 'Byasomwe',
      quickResponses: {
        thanks: 'Urakoze!',
        yes: 'Yego, niko',
        no: 'Oya, urakoze',
        help: 'Nkeneye ubufasha',
        ordering: 'Niteguye gutumiza',
        delivery: 'Bizagera ryari?'
      },
      reactions: ['❤️', '👍', '😊', '😍', '🔥', '👏'],
      voiceRecording: 'Gusfata amajwi...',
      sendVoice: 'Ohereza Amajwi',
      cancelRecording: 'Guhagarika'
    }
  };

  // Mock quick response options
  const quickResponseOptions = [
    content[language].quickResponses.thanks,
    content[language].quickResponses.yes,
    content[language].quickResponses.no,
    content[language].quickResponses.help,
    content[language].quickResponses.ordering,
    content[language].quickResponses.delivery
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Simulate vendor typing indicator
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsVendorTyping(true);
        setTimeout(() => {
          setIsVendorTyping(false);
          // Simulate vendor response
          if (newMessage.toLowerCase().includes('spicy') || newMessage.toLowerCase().includes('delivery')) {
            const response: Message = {
              id: Date.now().toString(),
              type: 'text',
              content: 'Absolutely! We can make it extra spicy for you. Our delivery usually takes 25-35 minutes to your area. Would you like to place an order?',
              sender: 'vendor',
              timestamp: new Date(),
              status: 'delivered'
            };
            setMessages(prev => [...prev, response]);
          }
        }, 2000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isTyping, newMessage]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        type: 'text',
        content: newMessage.trim(),
        sender: 'customer',
        timestamp: new Date(),
        status: 'sending'
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setIsTyping(true);
      
      // Simulate message delivery
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, status: 'delivered' as const }
              : msg
          )
        );
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleQuickResponse = (response: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'quick-response',
      content: response,
      sender: 'customer',
      timestamp: new Date(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, message]);
    setShowQuickResponses(false);
    
    // Simulate delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'delivered' as const }
            : msg
        )
      );
    }, 500);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              reactions: msg.reactions?.includes(emoji) 
                ? msg.reactions.filter(r => r !== emoji)
                : [...(msg.reactions || []), emoji] 
            }
          : msg
      )
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-orange-400" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-x-4 top-4 bottom-4 z-50 max-w-lg mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl shadow-black/10 overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-white/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ImageWithFallback
                      src={vendorImage}
                      alt={vendorName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{content[language].chatWith} {vendorName}</h3>
                    <p className="text-xs text-green-600">{content[language].online}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/30 p-0"
                    onClick={() => window.open(`tel:+250788123456`, '_self')}
                  >
                    <Phone className="w-4 h-4 text-gray-600" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/30 p-0"
                  >
                    <Video className="w-4 h-4 text-gray-600" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/30 p-0"
                    onClick={onClose}
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area - Adjusted height for better input visibility */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 custom-scrollbar" style={{ height: 'calc(100% - 180px)' }}>{/* Increased from 160px to 180px to give even more space for input */}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${message.sender === 'customer' ? 'order-2' : 'order-1'}`}>
                    {/* Message Bubble */}
                    <div
                      className={`relative p-3 rounded-2xl ${
                        message.sender === 'customer'
                          ? 'bg-orange-400/90 text-white rounded-br-md'
                          : 'bg-white/80 backdrop-blur-sm border border-white/20 text-gray-800 rounded-bl-md'
                      } shadow-sm`}
                    >
                      <p className="text-sm">{message.content}</p>
                      
                      {/* Message reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {message.reactions.map((reaction, index) => (
                            <span key={index} className="text-sm bg-white/20 rounded-full px-2 py-1">
                              {reaction}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Message Info */}
                    <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                      message.sender === 'customer' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.sender === 'customer' && getStatusIcon(message.status)}
                    </div>
                    
                    {/* Quick reactions */}
                    <div className={`flex gap-1 mt-1 ${
                      message.sender === 'customer' ? 'justify-end' : 'justify-start'
                    }`}>
                      {content[language].reactions.slice(0, 3).map((emoji) => (
                        <button
                          key={emoji}
                          className="text-xs opacity-60 hover:opacity-100 transition-opacity"
                          onClick={() => handleReaction(message.id, emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isVendorTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl rounded-bl-md px-4 py-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs">{vendorName} {content[language].typing}</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Responses */}
            {showQuickResponses && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="px-4 pb-2"
              >
                <div className="flex flex-wrap gap-2">
                  {quickResponseOptions.map((response, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="bg-white/60 backdrop-blur-sm border-orange-100/70 text-orange-500 hover:bg-orange-50/80 rounded-full text-xs h-8"
                      onClick={() => handleQuickResponse(response)}
                    >
                      {response}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input Area */}
            <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-t border-white/20 p-4">
              <div className="flex items-center gap-2">
                {/* Quick actions */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/30 p-0"
                    onClick={() => setShowQuickResponses(!showQuickResponses)}
                  >
                    <Smile className="w-4 h-4 text-gray-600" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/30 p-0"
                  >
                    <Image className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>

                {/* Message Input */}
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={content[language].typeMessage}
                    className="bg-white/60 backdrop-blur-sm border-white/30 rounded-full px-4 py-2 pr-12 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400/40 focus:border-orange-200/60"
                  />
                </div>

                {/* Send/Voice Button */}
                {newMessage.trim() ? (
                  <Button
                    onClick={handleSendMessage}
                    className="w-10 h-10 rounded-full bg-orange-400/90 hover:bg-orange-500/90 text-white p-0 shadow-lg shadow-orange-400/20"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-10 h-10 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/30 p-0"
                    onMouseDown={() => setIsRecording(true)}
                    onMouseUp={() => setIsRecording(false)}
                    onMouseLeave={() => setIsRecording(false)}
                  >
                    {isRecording ? (
                      <MicOff className="w-4 h-4 text-red-500" />
                    ) : (
                      <Mic className="w-4 h-4 text-gray-600" />
                    )}
                  </Button>
                )}
              </div>
              
              {/* Recording indicator */}
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-2 text-center"
                >
                  <div className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    {content[language].voiceRecording}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}