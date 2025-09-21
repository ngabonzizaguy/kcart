import React, { useState } from 'react';
import { Button } from './ui/button';
import { Star, X, Heart, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReviewPromptProps {
  language: 'en' | 'rw';
  isVisible: boolean;
  onClose: () => void;
  onWriteReview: () => void;
  onRatingOnly?: (rating: number) => void;
  vendorName: string;
  orderItems?: string[];
  orderTotal?: string;
  canDismiss?: boolean;
}

export function ReviewPrompt({
  language,
  isVisible,
  onClose,
  onWriteReview,
  onRatingOnly,
  vendorName,
  orderItems = [],
  orderTotal,
  canDismiss = true
}: ReviewPromptProps) {
  const [quickRating, setQuickRating] = useState(0);
  const [showThanks, setShowThanks] = useState(false);

  const content = {
    en: {
      title: 'How was your order?',
      subtitle: 'Your feedback helps us improve',
      fromRestaurant: `from ${vendorName}`,
      writeReview: 'Write Review',
      quickRate: 'Quick Rate',
      submitRating: 'Submit Rating',
      thanks: 'Thank you for your feedback!',
      yourOrder: 'Your order',
      rateExperience: 'Rate your experience',
      tapStars: 'Tap the stars to rate',
      later: 'Maybe Later',
      helpOthers: 'Help other customers by sharing your experience',
      excellent: 'Excellent',
      good: 'Good',
      average: 'Average', 
      belowAverage: 'Below Average',
      poor: 'Poor'
    },
    rw: {
      title: 'Ikurikira ryawe ryagenze gute?',
      subtitle: 'Ibitekerezo byawe bitufasha kunoza',
      fromRestaurant: `kiva ${vendorName}`,
      writeReview: 'Andika Igitekerezo',
      quickRate: 'Tanga Amanota Vuba',
      submitRating: 'Ohereza Amanota',
      thanks: 'Urakoze ku gitekerezo ryawe!',
      yourOrder: 'Ikurikira ryawe',
      rateExperience: 'Tanga amanota uburambe bwawe',
      tapStars: 'Kanda ku nyenyeri kugira ngo utange amanota',
      later: 'Birashoboka Nyuma',
      helpOthers: 'Fasha abandi bakiriya mu gusangira uburambe bwawe',
      excellent: 'Byiza Cyane',
      good: 'Byiza',
      average: 'Bisanzwe',
      belowAverage: 'Bidafite Ubwiza',
      poor: 'Bidafite Agaciro'
    }
  };

  const getRatingText = (rating: number) => {
    if (rating === 5) return content[language].excellent;
    if (rating === 4) return content[language].good;
    if (rating === 3) return content[language].average;
    if (rating === 2) return content[language].belowAverage;
    return content[language].poor;
  };

  const handleQuickRating = (rating: number) => {
    setQuickRating(rating);
    onRatingOnly?.(rating);
    setShowThanks(true);
    
    // Auto-close after showing thanks
    setTimeout(() => {
      setShowThanks(false);
      onClose();
    }, 2000);
  };

  const renderStars = (interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= quickRating;
      stars.push(
        <button
          key={i}
          className={`transition-all duration-200 ${interactive ? 'hover:scale-110 active:scale-95' : ''}`}
          onClick={() => interactive && handleQuickRating(i)}
          disabled={!interactive}
        >
          <Star className={`w-8 h-8 ${isFilled ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
        </button>
      );
    }
    return stars;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end"
        >
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full bg-white/95 backdrop-blur-md rounded-t-3xl overflow-hidden"
          >
            {showThanks ? (
              // Thank You Screen
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <ThumbsUp className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {content[language].thanks}
                </h3>
                <div className="flex justify-center gap-1 mb-2">
                  {renderStars(false)}
                </div>
                <p className="text-gray-600">
                  {getRatingText(quickRating)}
                </p>
              </motion.div>
            ) : (
              // Review Prompt Screen
              <div className="p-6 pb-8">
                {/* Close button */}
                {canDismiss && (
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {content[language].title}
                  </h2>
                  <p className="text-gray-600 mb-1">
                    {content[language].subtitle}
                  </p>
                  <p className="text-orange-600 font-medium">
                    {content[language].fromRestaurant}
                  </p>
                </div>

                {/* Order Summary (if provided) */}
                {orderItems.length > 0 && (
                  <div className="bg-orange-50 rounded-2xl p-4 mb-6">
                    <p className="font-medium text-gray-800 mb-2">{content[language].yourOrder}:</p>
                    <div className="space-y-1">
                      {orderItems.map((item, index) => (
                        <p key={index} className="text-sm text-gray-600">• {item}</p>
                      ))}
                    </div>
                    {orderTotal && (
                      <p className="font-semibold text-orange-600 mt-2">{orderTotal}</p>
                    )}
                  </div>
                )}

                {/* Quick Rating */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 text-center mb-3">
                    {content[language].rateExperience}
                  </h3>
                  <div className="flex justify-center gap-2 mb-3">
                    {renderStars(true)}
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    {content[language].tapStars}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={onWriteReview}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl h-12 font-medium"
                  >
                    {content[language].writeReview}
                  </Button>
                  
                  {canDismiss && (
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 rounded-2xl h-12"
                    >
                      {content[language].later}
                    </Button>
                  )}
                </div>

                {/* Help text */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  {content[language].helpOthers}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}