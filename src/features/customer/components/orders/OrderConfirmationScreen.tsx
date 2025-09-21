import React from 'react';
import { Button } from '../../../../shared/components/ui/button';
import { CheckCircle, Package, CreditCard, Smartphone, Banknote, Clock } from 'lucide-react';

/**
 * OrderConfirmationScreen - Success screen after order placement
 * 
 * Features:
 * - Success message with animated checkmark illustration
 * - Order ID display for reference
 * - Payment method confirmation
 * - Transaction reference display
 * - Estimated delivery time
 * - Action buttons: View My Orders, Continue Browsing
 * - Celebrate animation on mount
 * 
 * Props:
 * - language: 'en' | 'rw' - Current app language
 * - orderData: Object containing order details
 * - onViewOrders: () => void - Navigate to orders screen
 * - onContinueBrowsing: () => void - Navigate back to home screen
 * 
 * TODO: Add order confirmation email/SMS integration
 * TODO: Implement sharing functionality for order details
 * TODO: Add estimated delivery time updates
 * TODO: Connect to real order tracking system
 */
interface OrderConfirmationScreenProps {
  language: 'en' | 'rw';
  orderData: {
    orderId: string;
    payment: {
      method: 'momo' | 'card' | 'cash';
      transactionRef: string;
      amount: number;
    };
    estimatedDeliveryTime: string;
    customerInfo: {
      fullName: string;
      phoneNumber: string;
      deliveryAddress: string;
    };
  };
  onViewOrders: () => void;
  onContinueBrowsing: () => void;
}

export function OrderConfirmationScreen({ 
  language, 
  orderData, 
  onViewOrders, 
  onContinueBrowsing 
}: OrderConfirmationScreenProps) {
  
  // Get payment method icon and name
  const getPaymentMethodDetails = (method: 'momo' | 'card' | 'cash') => {
    switch (method) {
      case 'momo':
        return {
          icon: Smartphone,
          name: { 
            en: 'Mobile Money (MoMo)', 
            rw: 'Amafaranga ya Mobile (MoMo)' 
          }
        };
      case 'card':
        return {
          icon: CreditCard,
          name: { 
            en: 'Credit/Debit Card', 
            rw: 'Ikarita y\'Inguzanyo/Ubwishyu' 
          }
        };
      case 'cash':
        return {
          icon: Banknote,
          name: { 
            en: 'Cash on Delivery', 
            rw: 'Amafaranga ku Gutanga' 
          }
        };
    }
  };

  const paymentDetails = getPaymentMethodDetails(orderData.payment.method);
  const PaymentIcon = paymentDetails.icon;

  // Format price in RWF
  const formatPrice = (price: number) => `${price.toLocaleString()} RWF`;

  // Bilingual content
  const content = {
    en: {
      title: 'Order Confirmed!',
      subtitle: 'Your order has been placed successfully',
      description: 'We\'ll notify you when your order is being prepared and on its way.',
      orderId: 'Order ID',
      paymentMethod: 'Payment Method',
      transactionRef: 'Transaction Reference',
      estimatedDelivery: 'Estimated Delivery',
      deliverTo: 'Delivering to',
      totalPaid: 'Total Paid',
      viewMyOrders: 'View My Orders',
      continueBrowsing: 'Continue Browsing',
      thankYou: 'Thank you for choosing DeliGo!',
      orderTracking: 'You can track your order in real-time from the Orders section.',
      notifications: 'We\'ll send you notifications about your order status.'
    },
    rw: {
      title: 'Ikurikira Ryemejwe!',
      subtitle: 'Ikurikira ryawe ryashyizweho neza',
      description: 'Tuzagumenyesha iyo ikurikira ryawe ritangiye guteguriwa no mu nzira.',
      orderId: 'Nomero y\'Ikurikira',
      paymentMethod: 'Uburyo bwo Kwishyura',
      transactionRef: 'Nomero y\'Ubwishyu',
      estimatedDelivery: 'Igihe Giteganijwe cyo Gutanga',
      deliverTo: 'Gutangira',
      totalPaid: 'Byose Byishyuwe',
      viewMyOrders: 'Reba Ibikurikira Byanje',
      continueBrowsing: 'Komeza Kureba',
      thankYou: 'Turamuhariye kwitoramo DeliGo!',
      orderTracking: 'Urashobora gukurikirana ikurikira ryawe mu gihe nyacyo unyuze mu bice by\'amategeko.',
      notifications: 'Tuzagukohereza ubutumwa ku miterere y\'ikurikira ryawe.'
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Success Animation Section */}
        <div className="flex items-center justify-center px-6 py-12 min-h-full">
          <div className="text-center max-w-md mx-auto">
            {/* Animated Success Icon */}
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              
              {/* Celebration sparkles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 relative">
                  {/* Sparkle animations */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-orange-400 rounded-full animate-ping"
                      style={{
                        top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                        left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
                        animationDelay: `${i * 200}ms`,
                        animationDuration: '2s'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-gray-800 font-semibold text-2xl mb-3">
              {content[language].title}
            </h1>
            <p className="text-gray-600 mb-4">
              {content[language].subtitle}
            </p>
            <p className="text-gray-500 text-sm mb-8">
              {content[language].description}
            </p>

            {/* Order Details Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 mb-8 text-left">
              {/* Order ID */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Package className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">{content[language].orderId}</p>
                    <p className="text-gray-800 font-semibold font-mono">#{orderData.orderId}</p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <PaymentIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">{content[language].paymentMethod}</p>
                    <p className="text-gray-800 font-medium">{paymentDetails.name[language]}</p>
                  </div>
                </div>
              </div>

              {/* Transaction Reference */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-gray-600 text-sm">{content[language].transactionRef}</p>
                  <p className="text-gray-800 font-mono text-sm">{orderData.payment.transactionRef}</p>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">{content[language].estimatedDelivery}</p>
                    <p className="text-green-600 font-semibold">{orderData.estimatedDeliveryTime}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <p className="text-gray-600 text-sm mb-1">{content[language].deliverTo}</p>
                <p className="text-gray-800 font-medium">{orderData.customerInfo.fullName}</p>
                <p className="text-gray-600 text-sm">{orderData.customerInfo.deliveryAddress}</p>
                <p className="text-gray-600 text-sm">{orderData.customerInfo.phoneNumber}</p>
              </div>

              {/* Total Amount */}
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-semibold">{content[language].totalPaid}</span>
                <span className="text-orange-600 font-bold text-lg">
                  {formatPrice(orderData.payment.amount)}
                </span>
              </div>
            </div>

            {/* Information Messages */}
            <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-left">
              <p className="text-blue-700 text-sm mb-2">{content[language].orderTracking}</p>
              <p className="text-blue-600 text-sm">{content[language].notifications}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-32 pt-8 space-y-4">
          {/* Primary Action - View Orders */}
          <Button 
            onClick={onViewOrders}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium"
          >
            {content[language].viewMyOrders}
          </Button>

          {/* Secondary Action - Continue Browsing */}
          <Button 
            onClick={onContinueBrowsing}
            variant="outline"
            className="w-full h-12 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
          >
            {content[language].continueBrowsing}
          </Button>

          {/* Thank you message */}
          <div className="text-center pt-4">
            <p className="text-gray-600 text-sm font-medium">
              {content[language].thankYou}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}