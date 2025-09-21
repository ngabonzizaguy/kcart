import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Play, Pause, Volume2, CheckCircle, ShoppingCart, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceOrderScreenProps {
  language: 'en' | 'rw';
  onBack: () => void;
}

interface VoiceCommand {
  id: string;
  transcript: string;
  confidence: number;
  intent: 'order' | 'question' | 'search' | 'modification';
  entities: Array<{
    type: 'food' | 'restaurant' | 'quantity' | 'preference';
    value: string;
    confidence: number;
  }>;
  response: { en: string; rw: string };
  actions?: Array<{
    type: 'add_to_cart' | 'search_restaurant' | 'show_menu';
    data: any;
  }>;
}

export function VoiceOrderScreen({ language, onBack }: VoiceOrderScreenProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const content = {
    en: {
      title: 'Voice Order',
      subtitle: 'Order food using your voice',
      startListening: 'Tap to speak',
      stopListening: 'Tap to stop',
      processing: 'Processing...',
      permissionTitle: 'Microphone Permission',
      permissionMessage: 'We need microphone access to process your voice commands',
      allowAccess: 'Allow Access',
      listening: 'Listening...',
      confidence: 'Confidence',
      examples: 'Try saying:',
      exampleCommands: [
        'Order pizza from Golden Spoon',
        'Find healthy restaurants near me',
        'Add two burgers to my cart',
        'What\'s popular at Fresh Kitchen?'
      ],
      addedToCart: 'Added to cart',
      searchingRestaurants: 'Searching restaurants...',
      voiceCommandHistory: 'Voice Commands',
      clear: 'Clear',
      speak: 'Speak'
    },
    rw: {
      title: 'Gutumiza mu majwi',
      subtitle: 'Tumiza ibiryo ukoresheje ijwi ryawe',
      startListening: 'Kanda ugire uvuge',
      stopListening: 'Kanda uhagarike',
      processing: 'Gutunganya...',
      permissionTitle: 'Uruhushya rw\'Ijwi',
      permissionMessage: 'Dukeneye uruhushya rw\'ijwi kugira ngo dusobanure ibyo uvuga',
      allowAccess: 'Emera Kwinjira',
      listening: 'Kumva...',
      confidence: 'Kwizera',
      examples: 'Gerageza kuvuga:',
      exampleCommands: [
        'Tumiza pizza kuri Golden Spoon',
        'Shakisha ibibanza bifite ibiryo biryoshye hafi yanjye',
        'Ongeraho burger ebyiri mu gitebo cyanjye',
        'Ni iki gikunda kuri Fresh Kitchen?'
      ],
      addedToCart: 'Byongerewe mu gitebo',
      searchingRestaurants: 'Gushakisha ibibanza...',
      voiceCommandHistory: 'Amateka y\'Amajwi',
      clear: 'Siba',
      speak: 'Vuga'
    }
  };

  // Mock voice command responses
  const mockVoiceResponses: VoiceCommand[] = [
    {
      id: '1',
      transcript: 'Order pizza from Golden Spoon',
      confidence: 95,
      intent: 'order',
      entities: [
        { type: 'food', value: 'pizza', confidence: 98 },
        { type: 'restaurant', value: 'Golden Spoon', confidence: 92 }
      ],
      response: {
        en: 'I found Golden Spoon pizza menu. Would you like to see their pizza options?',
        rw: 'Nabanye menu ya pizza ya Golden Spoon. Urashaka kureba amahitamo yabo ya pizza?'
      },
      actions: [
        { type: 'show_menu', data: { restaurantId: 'golden-spoon', category: 'pizza' } }
      ]
    },
    {
      id: '2',
      transcript: 'Add two burgers to my cart',
      confidence: 89,
      intent: 'order',
      entities: [
        { type: 'food', value: 'burgers', confidence: 95 },
        { type: 'quantity', value: '2', confidence: 98 }
      ],
      response: {
        en: 'I\'ve added 2 classic burgers to your cart. Your total is now 7,000 RWF.',
        rw: 'Nongeye burger 2 mu gitebo cyawe. Ubu igiciro cyose ni 7,000 RWF.'
      },
      actions: [
        { type: 'add_to_cart', data: { item: 'Classic Burger', quantity: 2, price: 3500 } }
      ]
    },
    {
      id: '3',
      transcript: 'Find healthy restaurants near me',
      confidence: 92,
      intent: 'search',
      entities: [
        { type: 'preference', value: 'healthy', confidence: 88 },
        { type: 'restaurant', value: 'near me', confidence: 95 }
      ],
      response: {
        en: 'I found 5 healthy restaurants near you. Fresh Kitchen has the highest rating for healthy options.',
        rw: 'Nabanye ibibanza 5 bifite ibiryo biryoshye hafi yawe. Fresh Kitchen ifite amanota menshi ku biryo biryoshye.'
      },
      actions: [
        { type: 'search_restaurant', data: { filter: 'healthy', location: 'nearby' } }
      ]
    }
  ];

  // Check microphone permission on mount
  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      // In a real app, check actual microphone permission
      // For demo, simulate permission check
      setTimeout(() => {
        setPermissionGranted(true);
      }, 500);
    } catch (error) {
      setPermissionGranted(false);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      // In a real app, request actual microphone permission
      // For demo, simulate permission request
      setTimeout(() => {
        setPermissionGranted(true);
      }, 1000);
    } catch (error) {
      setPermissionGranted(false);
    }
  };

  const startListening = () => {
    if (!permissionGranted) {
      requestMicrophonePermission();
      return;
    }

    setIsListening(true);
    setCurrentTranscript('');
    
    // Simulate real-time transcription
    const transcripts = [
      language === 'en' ? 'Order...' : 'Tumiza...',
      language === 'en' ? 'Order pizza...' : 'Tumiza pizza...',
      language === 'en' ? 'Order pizza from...' : 'Tumiza pizza kuri...',
      language === 'en' ? 'Order pizza from Golden Spoon' : 'Tumiza pizza kuri Golden Spoon'
    ];

    let index = 0;
    const transcriptInterval = setInterval(() => {
      if (index < transcripts.length) {
        setCurrentTranscript(transcripts[index]);
        setAudioLevel(Math.random() * 100);
        index++;
      } else {
        clearInterval(transcriptInterval);
        processVoiceCommand(transcripts[transcripts.length - 1]);
      }
    }, 800);

    // Auto-stop after 5 seconds
    setTimeout(() => {
      if (isListening) {
        stopListening();
      }
    }, 5000);
  };

  const stopListening = () => {
    setIsListening(false);
    setAudioLevel(0);
    if (currentTranscript) {
      processVoiceCommand(currentTranscript);
    }
  };

  const processVoiceCommand = (transcript: string) => {
    setIsProcessing(true);
    setCurrentTranscript('');

    // Simulate AI processing delay
    setTimeout(() => {
      const randomResponse = mockVoiceResponses[Math.floor(Math.random() * mockVoiceResponses.length)];
      const processedCommand: VoiceCommand = {
        ...randomResponse,
        id: Date.now().toString(),
        transcript: transcript
      };

      setVoiceCommands(prev => [processedCommand, ...prev]);
      setIsProcessing(false);

      // Execute actions if any
      if (processedCommand.actions) {
        processedCommand.actions.forEach(action => {
          executeAction(action);
        });
      }
    }, 1500 + Math.random() * 1000);
  };

  const executeAction = (action: any) => {
    switch (action.type) {
      case 'add_to_cart':
        // In real app, add to actual cart
        console.log('Added to cart:', action.data);
        break;
      case 'search_restaurant':
        // In real app, perform restaurant search
        console.log('Searching restaurants:', action.data);
        break;
      case 'show_menu':
        // In real app, navigate to menu
        console.log('Showing menu:', action.data);
        break;
    }
  };

  const clearHistory = () => {
    setVoiceCommands([]);
  };

  if (permissionGranted === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            {language === 'en' ? 'Checking permissions...' : 'Kugenzura uruhushya...'}
          </p>
        </div>
      </div>
    );
  }

  if (permissionGranted === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
        <div className="bg-white/80 backdrop-blur-sm border-b border-border/30 pt-safe">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{language === 'en' ? 'Back' : 'Subira'}</span>
            </button>
            <h1 className="text-foreground font-medium">{content[language].title}</h1>
            <div className="w-12" />
          </div>
        </div>

        <div className="p-4 flex items-center justify-center min-h-[80vh]">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center max-w-sm">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MicOff className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-foreground font-medium mb-2">
              {content[language].permissionTitle}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {content[language].permissionMessage}
            </p>
            <Button
              onClick={requestMicrophonePermission}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl"
            >
              {content[language].allowAccess}
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
          
          <div className="text-center">
            <h1 className="text-foreground font-medium">{content[language].title}</h1>
            <p className="text-xs text-muted-foreground">{content[language].subtitle}</p>
          </div>
          
          {voiceCommands.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="text-muted-foreground hover:text-foreground"
            >
              {content[language].clear}
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 pb-safe">
        {/* Voice Input Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 mb-6">
          {/* Voice Button */}
          <div className="text-center mb-6">
            <motion.button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`relative w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : isProcessing
                  ? 'bg-orange-300 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90'
              }`}
              whileTap={{ scale: 0.95 }}
              animate={isListening ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
            >
              {/* Audio Level Visualization */}
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-white/30">
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-white transition-all duration-100"
                    style={{ 
                      transform: `scale(${1 + (audioLevel / 200)})`,
                      opacity: audioLevel / 100 
                    }}
                  />
                </div>
              )}
              
              {isProcessing ? (
                <Loader className="w-8 h-8 animate-spin text-white" />
              ) : isListening ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  <Mic className="w-8 h-8 text-white" />
                </motion.div>
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </motion.button>
            
            <p className="text-foreground font-medium mb-2">
              {isListening 
                ? content[language].listening 
                : isProcessing 
                ? content[language].processing 
                : content[language].startListening
              }
            </p>
            
            {/* Live Transcript */}
            {(isListening || isProcessing) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-muted/50 rounded-2xl p-3 min-h-[50px] flex items-center justify-center"
              >
                {currentTranscript ? (
                  <p className="text-foreground">{currentTranscript}</p>
                ) : isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-8 bg-primary/30 rounded-full"
                        style={{
                          height: `${8 + (isListening ? Math.random() * 20 : 0)}px`,
                          animationDelay: `${i * 100}ms`
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
          
          {/* Example Commands */}
          {voiceCommands.length === 0 && !isListening && !isProcessing && (
            <div>
              <p className="text-muted-foreground text-sm mb-3">
                {content[language].examples}
              </p>
              <div className="space-y-2">
                {content[language].exampleCommands.map((example, index) => (
                  <div
                    key={index}
                    className="bg-muted/30 rounded-xl p-3 text-sm text-muted-foreground"
                  >
                    ""{example}""
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Voice Command History */}
        {voiceCommands.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground font-medium">
                {content[language].voiceCommandHistory}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {voiceCommands.length}
              </Badge>
            </div>
            
            <AnimatePresence>
              {voiceCommands.map((command) => (
                <motion.div
                  key={command.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20"
                >
                  {/* User Command */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <Mic className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground">{command.transcript}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${
                          command.confidence >= 90 
                            ? 'bg-green-100 text-green-700' 
                            : command.confidence >= 75 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {content[language].confidence}: {command.confidence}%
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {command.intent}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Response */}
                  <div className="flex items-start gap-3 bg-primary/5 rounded-2xl p-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Volume2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground text-sm">
                        {command.response[language]}
                      </p>
                      
                      {/* Action Indicators */}
                      {command.actions && command.actions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {command.actions.map((action, index) => (
                            <Badge
                              key={index}
                              className="text-xs bg-green-100 text-green-700"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {action.type === 'add_to_cart' && content[language].addedToCart}
                              {action.type === 'search_restaurant' && content[language].searchingRestaurants}
                              {action.type === 'show_menu' && 'Menu opened'}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}