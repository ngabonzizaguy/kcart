import React, { useState } from 'react';
import { Button } from '../../../../shared/components/ui/button';
import { ArrowLeft, Plus, Minus, Trash2, MapPin, Clock } from 'lucide-react';
import { ImageWithFallback } from '../../../../lib/figma/ImageWithFallback';
import { CheckoutScreen } from '../checkout/CheckoutScreen';
import { OrderConfirmationScreen } from '../orders/OrderConfirmationScreen';
import { OrderTracking } from '../orders/OrderTracking';
import type { CartItem } from '../../../../types';

/**
 * CartScreen - Complete cart management with checkout flow
 * 
 * Features:
 * - Full cart item management (add, remove, update quantities)
 * - Custom ingredient tracking and special notes display
 * - Integrated checkout, confirmation, and tracking flow
 * - Bilingual support (English/Kinyarwanda)
 * - DeliGo Glass Design Language
 * - Mobile-optimized with proper scrolling
 */

interface CartScreenProps {
  language: 'en' | 'rw';
  items: CartItem[];
  onUpdateCart: (items: CartItem[]) => void;
  onCheckout?: () => void;
  onBack: () => void;
  onViewOrders?: () => void;
  onContinueBrowsing?: () => void;
}

export function CartScreen({ 
  language, 
  items, 
  onUpdateCart, 
  onCheckout, 
  onBack, 
  onViewOrders, 
  onContinueBrowsing 
}: CartScreenProps) {
  const [currentScreen, setCurrentScreen] = useState<'cart' | 'checkout' | 'confirmation' | 'tracking'>('cart');
  const [orderData, setOrderData] = useState<any>(null);
  
  // Use provided items only - no mock data fallback
  const cartItems = items;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    const updatedItems = newQuantity === 0 
      ? cartItems.filter(item => item.id !== itemId)
      : cartItems.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
    onUpdateCart(updatedItems);
  };

  const removeItem = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    onUpdateCart(updatedItems);
  };

  const handleProceedToCheckout = () => {
    setCurrentScreen('checkout');
  };

  const handlePlaceOrder = (orderDetails: any) => {
    // Generate order ID and prepare order data
    const orderId = `DG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const completeOrderData = {
      orderId,
      ...orderDetails,
      items: cartItems,
      timestamp: new Date().toISOString()
    };
    
    setOrderData(completeOrderData);
    setCurrentScreen('confirmation');
    
    // TODO: Send order to API
    console.log('🚀 Order placed:', completeOrderData);
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} RWF`;
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2000; // Fixed delivery fee
  const total = subtotal + deliveryFee;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleViewOrders = () => {
    if (onViewOrders) {
      onViewOrders();
    } else {
      setCurrentScreen('tracking');
    }
  };

  const handleContinueBrowsing = () => {
    if (onContinueBrowsing) {
      onContinueBrowsing();
    } else {
      onBack();
    }
  };

  const content = {
    en: {
      title: 'Your Cart',
      empty: 'Your cart is empty',
      emptySubtitle: 'Add items from restaurants to get started',
      items: totalItems === 1 ? 'item' : 'items',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery Fee',
      total: 'Total',
      proceedToCheckout: 'Proceed to Checkout', 
      checkout: 'Checkout',
      paymentMethod: 'Payment Method',
      selectPayment: 'Select your preferred payment method',
      confirmOrder: 'Confirm Order',
      estimatedDelivery: 'Estimated delivery: 25-35 mins',
      deliverTo: 'Deliver to',
      location: 'Kigali, Rwanda',
      back: 'Back'
    },
    rw: {
      title: 'Igikombe Cyawe',
      empty: 'Igikombe cyawe nticy ubushe',
      emptySubtitle: 'Ongeraho ibintu ku bibanza kugira ngo utangire',
      items: totalItems === 1 ? 'ikintu' : 'ibintu',
      subtotal: 'Igiteranyo',
      deliveryFee: 'Amafaranga yo Gutanga',
      total: 'Byose',
      proceedToCheckout: 'Komeza Kwishyura',
      checkout: 'Kwishyura',
      paymentMethod: 'Uburyo bwo Kwishyura',
      selectPayment: 'Hitamo uburyo bushimishije bwo kwishyura',
      confirmOrder: 'Emeza Ikurikira',
      estimatedDelivery: 'Igihe cyo gutanga: iminota 25-35',
      deliverTo: 'Gutangira',
      location: 'Kigali, u Rwanda',
      back: 'Subira'
    }
  };

  // Render different screens based on current state
  if (currentScreen === 'checkout') {
    return (
      <CheckoutScreen
        language={language}
        cartItems={cartItems}
        onBack={() => setCurrentScreen('cart')}
        onPlaceOrder={handlePlaceOrder}
      />
    );
  }

  if (currentScreen === 'confirmation' && orderData) {
    return (
      <OrderConfirmationScreen
        language={language}
        orderData={orderData}
        onViewOrders={handleViewOrders}
        onContinueBrowsing={handleContinueBrowsing}
      />
    );
  }

  if (currentScreen === 'tracking') {
    return (
      <OrderTracking
        language={language}
        onBack={() => setCurrentScreen('confirmation')}
      />
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10 flex-shrink-0">
        <div className="flex items-center justify-between p-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{content[language].back}</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-gray-800 font-medium">{content[language].title}</h1>
            {cartItems.length > 0 && (
              <p className="text-gray-600 text-sm">
                {totalItems} {content[language].items}
              </p>
            )}
          </div>
          
          <div className="w-16" /> {/* Spacer for balance */}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-6 py-6 pb-32 space-y-6">
        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center">
            <div className="text-4xl mb-4">🛒</div>
            <h2 className="text-gray-800 font-medium mb-2">{content[language].empty}</h2>
            <p className="text-gray-600 mb-6">{content[language].emptySubtitle}</p>
            <Button 
              onClick={onBack}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8 h-12"
            >
              {language === 'en' ? 'Browse Restaurants' : 'Reba Ibibanza'}
            </Button>
          </div>
        ) : (
          <>
            {/* Delivery Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 p-2 rounded-full">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 text-sm">{content[language].deliverTo}</p>
                  <p className="text-gray-800 font-medium">{content[language].location}</p>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">{content[language].estimatedDelivery}</span>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20"
                >
                  <div className="flex gap-3">
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-gray-800 font-medium text-sm truncate">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                            {item.description || ''}
                          </p>
                          
                          {/* Custom Ingredients */}
                          {item.customIngredients && item.originalIngredients && (
                            <div className="mt-2 space-y-1">
                              {item.customIngredients.length < item.originalIngredients.length && (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-red-500">🚫</span>
                                  <span className="text-xs text-red-500">
                                    {item.originalIngredients.filter(ing => !item.customIngredients!.includes(ing)).join(', ')} removed
                                  </span>
                                </div>
                              )}
                              {item.customIngredients.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-green-600">✓</span>
                                  <span className="text-xs text-green-600">
                                    With: {item.customIngredients.join(', ')}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Special Notes */}
                          {item.specialNotes && (
                            <div className="mt-2 bg-orange-50 rounded-lg p-2 border border-orange-200">
                              <div className="flex items-start gap-1">
                                <span className="text-xs">📝</span>
                                <span className="text-xs text-orange-700 font-medium">Note:</span>
                              </div>
                              <p className="text-xs text-orange-600 mt-1">{item.specialNotes}</p>
                            </div>
                          )}
                          
                          <p className="text-gray-500 text-xs mt-1">{item.vendorName}</p>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-gray-500 hover:text-red-500 transition-colors ml-2"
                          aria-label={language === 'en' ? 'Remove item' : 'Kuraho ikintu'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-orange-600 font-semibold text-sm">
                          {formatPrice(item.price)}
                        </span>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
                            aria-label={language === 'en' ? 'Decrease quantity' : 'Gwenga umubare'}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          
                          <span className="w-6 text-center font-medium text-gray-800 text-sm">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-colors flex items-center justify-center"
                            aria-label={language === 'en' ? 'Increase quantity' : 'Yongera umubare'}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <h3 className="text-gray-800 font-medium mb-4">
                {language === 'en' ? 'Order Summary' : 'Incamake y\'Ikurikira'}
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{content[language].subtotal}</span>
                  <span className="text-gray-800 font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{content[language].deliveryFee}</span>
                  <span className="text-gray-800 font-medium">{formatPrice(deliveryFee)}</span>
                </div>
                
                <div className="h-px bg-gray-200 my-3" />
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-semibold">{content[language].total}</span>
                  <span className="text-orange-600 font-bold text-lg">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <Button 
              onClick={handleProceedToCheckout}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium"
            >
              {content[language].proceedToCheckout} • {formatPrice(total)}
            </Button>
          </>
        )}
        </div>
      </div>
    </div>
  );
}