import React, { useState } from 'react';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Textarea } from '../../../../shared/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../../../../shared/components/ui/radio-group';
import { Separator } from '../../../../shared/components/ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  User, 
  Phone,
  MessageSquare,
  Copy,
  CheckCircle
} from 'lucide-react';
import type { CartItem } from '../../../../types';

/**
 * CheckoutScreen - Complete checkout form for DeliGo orders
 * 
 * Features:
 * - Delivery address form with validation
 * - Phone number input with Rwanda format validation
 * - Order notes/special instructions
 * - Payment method selection (MoMo, Card, Cash)
 * - Transaction reference generation
 * - Estimated delivery time display
 * - Order summary with totals
 * - Place Order CTA with loading state
 * 
 * Props:
 * - language: 'en' | 'rw' - Current app language
 * - cartItems: CartItem[] - Items in the user's cart
 * - onBack: () => void - Navigate back to cart
 * - onPlaceOrder: (orderData) => void - Process the order
 * 
 * TODO: Integrate with real address validation API
 * TODO: Connect to payment gateway for transaction processing
 * TODO: Add GPS location picker for delivery address
 * TODO: Implement real-time delivery time estimation
 */

interface CheckoutScreenProps {
  language: 'en' | 'rw';
  cartItems: CartItem[];
  onBack: () => void;
  onPlaceOrder: (orderData: any) => void;
}

export function CheckoutScreen({ language, cartItems, onBack, onPlaceOrder }: CheckoutScreenProps) {
  // Form state management
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    deliveryAddress: '',
    landmark: '',
    orderNotes: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Generate transaction reference on payment method change
  React.useEffect(() => {
    if (paymentMethod) {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 6).toUpperCase();
      setTransactionRef(`${paymentMethod.toUpperCase()}-${timestamp}-${randomId}`);
    }
  }, [paymentMethod]);

  // Bilingual content
  const content = {
    en: {
      title: 'Checkout',
      deliveryDetails: 'Delivery Details',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      phoneNumber: 'Phone Number',
      phonePlaceholder: '+250 XXX XXX XXX',
      deliveryAddress: 'Delivery Address',
      addressPlaceholder: 'Enter your delivery address',
      landmark: 'Landmark (Optional)',
      landmarkPlaceholder: 'Near school, church, etc.',
      orderNotes: 'Order Notes (Optional)',
      notesPlaceholder: 'Special instructions for the driver...',
      paymentMethod: 'Payment Method',
      selectPayment: 'Choose how you\'d like to pay',
      transactionRef: 'Transaction Reference',
      estimatedDelivery: 'Estimated Delivery Time',
      deliveryTime: '25-35 minutes',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery Fee',
      total: 'Total',
      placeOrder: 'Place Order',
      placeOrderWithTotal: 'Place Order',
      processing: 'Processing...',
      // Validation messages
      nameRequired: 'Full name is required',
      phoneRequired: 'Phone number is required',
      phoneInvalid: 'Please enter a valid Rwanda phone number',
      addressRequired: 'Delivery address is required',
      // Payment methods
      momo: 'Mobile Money (MoMo)',
      momoDesc: 'MTN MoMo, Airtel Money',
      card: 'Credit/Debit Card',
      cardDesc: 'Visa, Mastercard, etc.',
      cash: 'Cash on Delivery',
      cashDesc: 'Pay when you receive your order'
    },
    rw: {
      title: 'Kwishyura',
      deliveryDetails: 'Amakuru yo Gutanga',
      fullName: 'Amazina Yombi',
      fullNamePlaceholder: 'Shyiramo amazina yawe yose',
      phoneNumber: 'Nomero ya Telefone',
      phonePlaceholder: '+250 XXX XXX XXX',
      deliveryAddress: 'Aho Uzatangirizwa',
      addressPlaceholder: 'Shyiramo aho uzatangirizwa',
      landmark: 'Ikimenyetso (Ntibyangombwa)',
      landmarkPlaceholder: 'Hafi y\'ishuri, itorero, n\'ibindi...',
      orderNotes: 'Inyandiko z\'Ikurikira (Ntibyangombwa)',
      notesPlaceholder: 'Amabwiriza y\'umwihariko ku mushoferi...',
      paymentMethod: 'Uburyo bwo Kwishyura',
      selectPayment: 'Hitamo uburyo bushaka bwo kwishyura',
      transactionRef: 'Nomero y\'Ubwishyu',
      estimatedDelivery: 'Igihe Giteganijwe cyo Gutanga',
      deliveryTime: 'Iminota 25-35',
      orderSummary: 'Incamake y\'Ikurikira',
      subtotal: 'Igiteranyo',
      deliveryFee: 'Amafaranga yo Gutanga',
      total: 'Byose',
      placeOrder: 'Shyiraho Ikurikira',
      placeOrderWithTotal: 'Shyiraho Ikurikira',
      processing: 'Birateguriwa...',
      // Validation messages
      nameRequired: 'Amazina ni ngombwa',
      phoneRequired: 'Nomero ya telefone ni ngombwa',
      phoneInvalid: 'Nyamuneka shyiramo nomero ya telefone nziza yo mu Rwanda',
      addressRequired: 'Aho uzatangirizwa ni ngombwa',
      // Payment methods
      momo: 'Amafaranga ya Mobile (MoMo)',
      momoDesc: 'MTN MoMo, Airtel Money',
      card: 'Ikarita y\'Inguzanyo/Ubwishyu',
      cardDesc: 'Visa, Mastercard, n\'ibindi',
      cash: 'Amafaranga ku Gutanga',
      cashDesc: 'Wishyura iyo wahawe ikurikira ryawe'
    }
  };

  // Payment methods configuration
  const paymentMethods = [
    {
      id: 'momo',
      name: content[language].momo,
      description: content[language].momoDesc,
      icon: Smartphone
    },
    {
      id: 'card', 
      name: content[language].card,
      description: content[language].cardDesc,
      icon: CreditCard
    },
    {
      id: 'cash',
      name: content[language].cash,
      description: content[language].cashDesc,
      icon: Banknote
    }
  ];

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = content[language].nameRequired;
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = content[language].phoneRequired;
    } else if (!validateRwandanPhone(formData.phoneNumber)) {
      errors.phoneNumber = content[language].phoneInvalid;
    }

    if (!formData.deliveryAddress.trim()) {
      errors.deliveryAddress = content[language].addressRequired;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Rwanda phone number validation
  const validateRwandanPhone = (phone: string): boolean => {
    const rwandaPhoneRegex = /^(\+?25)?[0-9]{9}$/;
    const cleanPhone = phone.replace(/\s+/g, '');
    return rwandaPhoneRegex.test(cleanPhone);
  };

  // Calculate order totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2000; // Fixed delivery fee - TODO: Calculate based on distance
  const total = subtotal + deliveryFee;

  // Format price in RWF
  const formatPrice = (price: number) => `${price.toLocaleString()} RWF`;

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Copy transaction reference to clipboard
  const copyTransactionRef = async () => {
    try {
      await navigator.clipboard.writeText(transactionRef);
      // TODO: Show toast notification
      console.log('Transaction reference copied to clipboard');
    } catch (err) {
      console.error('Failed to copy transaction reference:', err);
    }
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: cartItems,
        customerInfo: formData,
        payment: {
          method: paymentMethod,
          transactionRef,
          amount: total
        },
        pricing: {
          subtotal,
          deliveryFee,
          total
        },
        estimatedDeliveryTime: '25-35 minutes'
      };

      // TODO: Replace with real API call
      // Example: await orderAPI.createOrder(orderData);
      console.log('🚀 Placing order:', orderData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      onPlaceOrder(orderData);
    } catch (error) {
      console.error('Failed to place order:', error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

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
            <span>{language === 'en' ? 'Back' : 'Subira'}</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-gray-800 font-medium">{content[language].title}</h1>
          </div>
          
          <div className="w-16" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-6 py-6 pb-24 space-y-6">
        {/* Delivery Details Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
          <h2 className="text-gray-800 font-medium mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            {content[language].deliveryDetails}
          </h2>
          
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-gray-700 text-sm font-medium">
                {content[language].fullName}
              </Label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder={content[language].fullNamePlaceholder}
                  className={`pl-10 h-12 bg-white/60 border-gray-200 rounded-xl ${
                    formErrors.fullName ? 'border-red-300' : ''
                  }`}
                />
              </div>
              {formErrors.fullName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phoneNumber" className="text-gray-700 text-sm font-medium">
                {content[language].phoneNumber}
              </Label>
              <div className="mt-1 relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder={content[language].phonePlaceholder}
                  className={`pl-10 h-12 bg-white/60 border-gray-200 rounded-xl ${
                    formErrors.phoneNumber ? 'border-red-300' : ''
                  }`}
                />
              </div>
              {formErrors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
              )}
            </div>

            {/* Delivery Address */}
            <div>
              <Label htmlFor="deliveryAddress" className="text-gray-700 text-sm font-medium">
                {content[language].deliveryAddress}
              </Label>
              <div className="mt-1">
                <Textarea
                  id="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  placeholder={content[language].addressPlaceholder}
                  className={`min-h-[80px] bg-white/60 border-gray-200 rounded-xl resize-none ${
                    formErrors.deliveryAddress ? 'border-red-300' : ''
                  }`}
                  rows={3}
                />
              </div>
              {formErrors.deliveryAddress && (
                <p className="text-red-500 text-xs mt-1">{formErrors.deliveryAddress}</p>
              )}
            </div>

            {/* Landmark (Optional) */}
            <div>
              <Label htmlFor="landmark" className="text-gray-700 text-sm font-medium">
                {content[language].landmark}
              </Label>
              <div className="mt-1">
                <Input
                  id="landmark"
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => handleInputChange('landmark', e.target.value)}
                  placeholder={content[language].landmarkPlaceholder}
                  className="h-12 bg-white/60 border-gray-200 rounded-xl"
                />
              </div>
            </div>

            {/* Order Notes (Optional) */}
            <div>
              <Label htmlFor="orderNotes" className="text-gray-700 text-sm font-medium">
                {content[language].orderNotes}
              </Label>
              <div className="mt-1 relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Textarea
                  id="orderNotes"
                  value={formData.orderNotes}
                  onChange={(e) => handleInputChange('orderNotes', e.target.value)}
                  placeholder={content[language].notesPlaceholder}
                  className="pl-10 min-h-[80px] bg-white/60 border-gray-200 rounded-xl resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
          <h2 className="text-gray-800 font-medium mb-2">{content[language].paymentMethod}</h2>
          <p className="text-gray-600 text-sm mb-4">{content[language].selectPayment}</p>
          
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div 
                  key={method.id} 
                  className={`flex items-center p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === method.id 
                      ? 'border-orange-300 bg-orange-50' 
                      : 'border-gray-200 bg-white/40 hover:bg-white/60'
                  }`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <RadioGroupItem value={method.id} id={method.id} className="mr-3" />
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      paymentMethod === method.id ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        paymentMethod === method.id ? 'text-orange-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <Label htmlFor={method.id} className="text-gray-800 font-medium cursor-pointer">
                        {method.name}
                      </Label>
                      <p className="text-gray-600 text-sm">{method.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </RadioGroup>

          {/* Transaction Reference */}
          {transactionRef && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700 text-sm font-medium">
                    {content[language].transactionRef}
                  </Label>
                  <p className="text-gray-800 font-mono text-sm">{transactionRef}</p>
                </div>
                <button
                  onClick={copyTransactionRef}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label={language === 'en' ? 'Copy reference' : 'Kopanya nomero'}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Estimated Delivery Time */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-full">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-800 font-medium">{content[language].estimatedDelivery}</h3>
              <p className="text-orange-600 font-medium">{content[language].deliveryTime}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
          <h2 className="text-gray-800 font-medium mb-4">{content[language].orderSummary}</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{content[language].subtotal}</span>
              <span className="text-gray-800 font-medium">{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{content[language].deliveryFee}</span>
              <span className="text-gray-800 font-medium">{formatPrice(deliveryFee)}</span>
            </div>
            
            <Separator className="my-3" />
            
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-semibold">{content[language].total}</span>
              <span className="text-orange-600 font-bold text-lg">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <Button 
          onClick={handlePlaceOrder}
          disabled={isLoading}
          className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              {content[language].processing}
            </div>
          ) : (
            `${content[language].placeOrderWithTotal} • ${formatPrice(total)}`
          )}
        </Button>
        </div>
      </div>
    </div>
  );
}