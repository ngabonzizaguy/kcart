import React, { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Star, StarHalf, ThumbsUp, Camera, X, Check, User, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';

interface Review {
  id: number;
  customerName: string;
  customerImage?: string;
  rating: number;
  date: string;
  comment: {
    en: string;
    rw: string;
  };
  helpful: number;
  images?: string[];
}

interface ReviewsModalProps {
  language: 'en' | 'rw';
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  vendorId: string;
  vendorRating: number;
  totalReviews: number;
  reviews: Review[];
  onSubmitReview?: (reviewData: any) => void;
}

export function ReviewsModal({
  language,
  isOpen,
  onClose,
  vendorName,
  vendorId,
  vendorRating,
  totalReviews,
  reviews = [],
  onSubmitReview
}: ReviewsModalProps) {
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<number>>(new Set());

  const content = {
    en: {
      title: 'Reviews',
      writeReview: 'Write Review',
      excellent: 'Excellent',
      good: 'Good',
      average: 'Average',
      belowAverage: 'Below Average',
      poor: 'Poor',
      writeYourReview: 'Write your Review',
      wouldYouLikeToWrite: 'Would you like to write everything about us?',
      addPhotoOrVideo: 'Add Photo or Video',
      clickHereToUpload: 'Click here to upload',
      onlyResponseIsImportant: '(Only response is important)',
      submit: 'Submit',
      reviewSubmitted: 'Review Submitted!',
      thankYou: 'Thank you for your feedback!',
      helpful: 'Helpful',
      reviewsOf: 'reviews of',
      hoursAgo: 'hours ago',
      daysAgo: 'days ago',
      weeksAgo: 'weeks ago',
      monthsAgo: 'months ago'
    },
    rw: {
      title: 'Ibitekerezo',
      writeReview: 'Andika Igitekerezo',
      excellent: 'Byiza Cyane',
      good: 'Byiza',
      average: 'Bisanzwe',
      belowAverage: 'Bidafite Ubwiza',
      poor: 'Bidafite Agaciro',
      writeYourReview: 'Andika Igitekerezo Ryawe',
      wouldYouLikeToWrite: 'Urashaka kwandika byose kubyerekeye twe?',
      addPhotoOrVideo: 'Ongera Ifoto cyangwa Video',
      clickHereToUpload: 'Kanda hano kugira ngo ushyire',
      onlyResponseIsImportant: '(Igisubizo cyonyine ni ingenzi)',
      submit: 'Ohereza',
      reviewSubmitted: 'Igitekerezo Ryoherejwe!',
      thankYou: 'Urakoze ku gitekerezo ryawe!',
      helpful: 'Byafasha',
      reviewsOf: 'ibitekerezo bya',
      hoursAgo: 'amasaha ashize',
      daysAgo: 'iminsi ishize',
      weeksAgo: 'ibyumweru bishize',
      monthsAgo: 'amezi ashize'
    }
  };

  const getRatingText = (rating: number) => {
    if (rating === 5) return content[language].excellent;
    if (rating === 4) return content[language].good;
    if (rating === 3) return content[language].average;
    if (rating === 2) return content[language].belowAverage;
    return content[language].poor;
  };

  const renderStars = (rating: number, size = 'w-4 h-4', interactive = false, onRatingChange?: (rating: number) => void) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= rating;
      const isHalf = rating > i - 1 && rating < i;
      
      stars.push(
        <button
          key={i}
          className={`${interactive ? 'hover:scale-110 transition-transform' : ''}`}
          onClick={() => interactive && onRatingChange?.(i)}
          disabled={!interactive}
        >
          {isFilled ? (
            <Star className={`${size} text-yellow-500 fill-current`} />
          ) : isHalf ? (
            <StarHalf className={`${size} text-yellow-500 fill-current`} />
          ) : (
            <Star className={`${size} ${interactive ? 'text-gray-300 hover:text-yellow-400' : 'text-gray-300'}`} />
          )}
        </button>
      );
    }
    return stars;
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (reviews && Array.isArray(reviews)) {
      reviews.forEach(review => {
        distribution[review.rating as keyof typeof distribution]++;
      });
    }
    return distribution;
  };

  const handleSubmitReview = () => {
    if (reviewRating === 0 || !reviewText.trim()) return;

    const reviewData = {
      rating: reviewRating,
      comment: reviewText,
      images: selectedImages,
      vendorId: vendorId,
      timestamp: new Date().toISOString()
    };

    onSubmitReview?.(reviewData);
    
    // Show success message
    setShowSuccessMessage(true);
    
    // Reset form
    setReviewRating(0);
    setReviewText('');
    setSelectedImages([]);
    
    // Hide success message after 3 seconds and close modal
    setTimeout(() => {
      setShowSuccessMessage(false);
      setShowWriteReview(false);
      onClose();
    }, 3000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setSelectedImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const toggleHelpful = (reviewId: number) => {
    setHelpfulReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full bg-gradient-to-br from-orange-50 via-cream-50 to-orange-100 border-l-0 p-0"
      >
        <AnimatePresence mode="wait">
          {showSuccessMessage ? (
            // Success Screen
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center h-full p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6"
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {content[language].reviewSubmitted}
              </h2>
              <p className="text-gray-600">
                {content[language].thankYou}
              </p>
            </motion.div>
          ) : showWriteReview ? (
            // Write Review Screen
            <motion.div
              key="write-review"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="h-full flex flex-col"
            >
              {/* Header */}
              <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 p-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowWriteReview(false)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="font-semibold text-gray-800">{content[language].writeYourReview}</h1>
                  <div className="w-8" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto reviews-scrollbar p-6">
                {/* Vendor Info */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{vendorName}</h3>
                      <p className="text-sm text-gray-600">
                        {language === 'en' ? 'Leave a review' : 'Siga igitekerezo'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rating Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {renderStars(reviewRating, 'w-8 h-8', true, setReviewRating)}
                  </div>
                  {reviewRating > 0 && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-gray-600 font-medium"
                    >
                      {getRatingText(reviewRating)}
                    </motion.p>
                  )}
                </div>

                {/* Add Photo or Video */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">{content[language].addPhotoOrVideo}</h4>
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">{content[language].clickHereToUpload}</p>
                    </div>
                  </label>
                  
                  {/* Selected Images */}
                  {selectedImages.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Review Text */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">{content[language].writeYourReview}</h4>
                  <p className="text-sm text-gray-500 mb-3">{content[language].wouldYouLikeToWrite}</p>
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={content[language].onlyResponseIsImportant}
                    className="min-h-32 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-white/20">
                <Button
                  onClick={handleSubmitReview}
                  disabled={reviewRating === 0 || !reviewText.trim()}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 disabled:opacity-50"
                >
                  {content[language].submit}
                </Button>
              </div>
            </motion.div>
          ) : (
            // Reviews List Screen
            <motion.div
              key="reviews-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              {/* Header */}
              <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 p-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="font-semibold text-gray-800">{content[language].title}</h1>
                  <div className="w-8" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto reviews-scrollbar">
                {/* Rating Summary */}
                <div className="p-6 bg-white/80 backdrop-blur-sm border-b border-white/20">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-gray-800 mb-2">{vendorRating}</div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {renderStars(vendorRating, 'w-5 h-5')}
                    </div>
                    <p className="text-sm text-gray-600">
                      {totalReviews} {content[language].reviewsOf} {vendorName}
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(rating => {
                      const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-12">{content[language][rating === 5 ? 'excellent' : rating === 4 ? 'good' : rating === 3 ? 'average' : rating === 2 ? 'belowAverage' : 'poor']}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="p-6 space-y-4">
                  {reviews && reviews.length > 0 ? reviews.map((review) => (
                    <div key={review.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          {review.customerImage ? (
                            <ImageWithFallback
                              src={review.customerImage}
                              alt={review.customerName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-800">{review.customerName}</h4>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {renderStars(review.rating, 'w-3 h-3')}
                                </div>
                                <span className="text-xs text-gray-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 text-sm leading-relaxed mb-3">
                            {review.comment[language]}
                          </p>
                          
                          {/* Review Images */}
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 mb-3">
                              {review.images.map((image, index) => (
                                <ImageWithFallback
                                  key={index}
                                  src={image}
                                  alt={`Review image ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              ))}
                            </div>
                          )}
                          
                          <button
                            onClick={() => toggleHelpful(review.id)}
                            className={`flex items-center gap-2 text-sm transition-colors ${
                              helpfulReviews.has(review.id)
                                ? 'text-orange-600'
                                : 'text-gray-500 hover:text-orange-600'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            {content[language].helpful} ({review.helpful + (helpfulReviews.has(review.id) ? 1 : 0)})
                          </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        {language === 'en' ? 'No reviews yet' : 'Nta bitekerezo bihari'}
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        {language === 'en' ? 'Be the first to leave a review!' : 'Wowe ubanza asigira igitekerezo!'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Write Review Button */}
              <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-white/20">
                <Button
                  onClick={() => setShowWriteReview(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12"
                >
                  {content[language].writeReview}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}