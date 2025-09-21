import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { Check, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { VisuallyHidden } from './ui/visually-hidden';
import type { CartItem } from './types';

interface AddedToCartModalProps {
  language: 'en' | 'rw';
  isOpen: boolean;
  onClose: () => void;
  onViewCart: () => void;
  addedItem: CartItem | null;
  cartItemCount: number;
}

/**
 * AddedToCartModal - Success modal shown after adding item to cart
 * 
 * Features:
 * - Success checkmark animation
 * - Item details with image, name, and price
 * - View Cart button (orange CTA)
 * - 3-second auto-close with progress indicator
 * - Glass morphism styling
 * - Bilingual support
 * 
 * Accessibility:
 * - Proper ARIA labels and descriptions
 * - Screen reader announcements for success state
 * - Keyboard navigation support
 * 
 * Auto-close behavior:
 * - Modal stays open for 3 seconds
 * - Visual progress indicator shows countdown
 * - User can manually close or navigate to cart before auto-close
 */
export function AddedToCartModal({ language, isOpen, onClose, onViewCart, addedItem }: AddedToCartModalProps) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);

  const content = {
    en: {
      title: 'Added to Cart!',
      description: 'Item added successfully',
      viewCart: 'View Cart',
      autoCloseIn: 'Auto-close in',
      seconds: 'seconds',
      successMessage: 'Successfully added to your cart'
    },
    rw: {
      title: 'Byongewe mu Gikurura!',
      description: 'Ikintu cyongewe neza',
      viewCart: 'Reba Ikurura',
      autoCloseIn: 'Bifunga nyuma ya',
      seconds: 'amasegonda',
      successMessage: 'Byongewe neza mu gikurura cyawe'
    }
  };

  // Auto-close functionality with progress indicator
  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setTimeLeft(3);
      return;
    }

    const duration = 3000; // 3 seconds
    const interval = 50; // Update every 50ms for smooth animation
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + increment;
        const newTimeLeft = Math.ceil((100 - newProgress) / 100 * 3);
        setTimeLeft(Math.max(0, newTimeLeft));
        
        if (newProgress >= 100) {
          clearInterval(timer);
          onClose();
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [isOpen, onClose]);

  // Handle view cart action
  const handleViewCart = () => {
    onViewCart();
    onClose();
  };

  if (!addedItem) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="w-[320px] max-w-[90vw] bg-white/90 backdrop-blur-md border border-white/30 rounded-3xl p-0 gap-0 overflow-hidden shadow-2xl">
            {/* Accessibility elements - hidden but available to screen readers */}
            <VisuallyHidden>
              <DialogTitle>{content[language].title}</DialogTitle>
              <DialogDescription>
                {content[language].successMessage}. {addedItem.name}, {addedItem.price} RWF
              </DialogDescription>
            </VisuallyHidden>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="p-6 text-center"
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.1,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-8 h-8 text-white" />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-semibold text-gray-800 mb-2"
              >
                {content[language].title}
              </motion.h2>

              {/* Success Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-sm text-gray-600 mb-6"
              >
                {content[language].description}
              </motion.p>

              {/* Item Details */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20"
              >
                <div className="flex items-center gap-3">
                  {/* Item Image */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <ImageWithFallback
                      src={addedItem.image || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300'}
                      alt={addedItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Item Info */}
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-gray-800 text-sm leading-tight">
                      {addedItem.name}
                    </h3>
                    <p className="text-orange-600 font-semibold text-sm">
                      {addedItem.quantity}x • {addedItem.price.toLocaleString()} RWF
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* View Cart Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Button
                  onClick={handleViewCart}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {content[language].viewCart} ({addedItem.quantity})
                </Button>
              </motion.div>

              {/* Progress Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4"
              >
                {/* Progress Bar */}
                <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto mb-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
                
                {/* Time Remaining */}
                <p className="text-xs text-gray-500">
                  {content[language].autoCloseIn} {timeLeft} {content[language].seconds}
                </p>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}