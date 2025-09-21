import React, { useState } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, ShoppingCart, Package, CheckCircle, MapPin } from 'lucide-react';
import { CartScreen } from './CartScreen';
import { CheckoutScreen } from './CheckoutScreen';
import { OrderConfirmationScreen } from './OrderConfirmationScreen';
import { OrderTracking } from './OrderTracking';

/**
 * CompleteOrderFlow - Demonstrates the complete cart to order tracking journey
 * 
 * This component showcases the entire DeliGo Glass Design Language implementation
 * across the customer journey from cart management to order tracking.
 * 
 * Features:
 * - Cart Screen with item management and quantity controls
 * - Checkout Screen with form validation and payment selection
 * - Order Confirmation Screen with success animation
 * - Order Tracking Screen with vertical timeline and real-time updates
 * - Seamless navigation between all screens
 * - Consistent glass morphism design throughout
 * - Full bilingual support (English/Kinyarwanda)
 * - Mobile-first responsive design
 * 
 * Props:
 * - language: 'en' | 'rw' - Current app language
 * - onBack: () => void - Navigate back to main app
 * 
 * Flow Steps:
 * 1. Demo Start Screen -> Shows available demo flows
 * 2. Cart Screen -> Item management, quantity controls, proceed to checkout
 * 3. Checkout Screen -> Address form, payment method, place order
 * 4. Order Confirmation -> Success message, order details, action buttons
 * 5. Order Tracking -> Real-time status, timeline, customer actions
 * 
 * TODO: Add flow analytics tracking
 * TODO: Implement flow state persistence
 * TODO: Add accessibility testing mode
 */
interface CompleteOrderFlowProps {
  language: 'en' | 'rw';
  onBack: () => void;
}

type FlowStep = 'demo-start' | 'cart' | 'checkout' | 'confirmation' | 'tracking';

// Mock cart data with bilingual support
const mockCartItems = [
  {
    id: 'item-1',
    name: {
      en: 'Grilled Chicken Special',
      rw: 'Inkoko y\'Akalanga Idasanzwe'
    },
    description: {
      en: 'Tender grilled chicken with rice and vegetables',
      rw: 'Inkoko yoroshye y\'akalanga hamwe n\'umuceri n\'imboga'
    },
    price: 8500,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1682423187670-4817da9a1b23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMG1lYWx8ZW58MXx8fHwxNzU1OTgzNTI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    vendorName: 'Golden Spoon Restaurant'
  },
  {
    id: 'item-2',
    name: {
      en: 'Creamy Pasta Delight',
      rw: 'Pasta y\'Amavuta'
    },
    description: {
      en: 'Rich creamy pasta with mushrooms and herbs',
      rw: 'Pasta y\'amavuta hamwe n\'ibihumye n\'ibihimbaza'
    },
    price: 6800,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8cGFzdGElMjBkaXNofGVufDF8fHx8MTc1NTkyOTk4NXww&ixlib=rb-4.1.0&q=80&w=1080',
    vendorName: 'Golden Spoon Restaurant'
  },
  {
    id: 'item-3',
    name: {
      en: 'Fresh Garden Salad',
      rw: 'Saladi y\'Ubusitani'
    },
    description: {
      en: 'Mixed greens with fresh vegetables and dressing',
      rw: 'Imboga zitandukanye hamwe n\'amavuta'
    },
    price: 4500,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8dmVnZXRhYmxlJTIwc2FsYWR8ZW58MXx8fHwxNzU1OTgzNTI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    vendorName: 'Golden Spoon Restaurant'
  }
];

export function CompleteOrderFlow({ language, onBack }: CompleteOrderFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('demo-start');
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [orderData, setOrderData] = useState<any>(null);

  // Bilingual content
  const content = {
    en: {
      title: 'Complete Order Flow Demo',
      subtitle: 'Experience the full DeliGo customer journey',
      description: 'This demo showcases the complete order flow from cart management to order tracking, featuring the DeliGo Glass Design Language.',
      startDemo: 'Start Order Flow Demo',
      demoSteps: 'Demo Flow Steps',
      step1: '1. Cart Management',
      step1Desc: 'Add, remove, and modify items with quantity controls',
      step2: '2. Checkout Process',
      step2Desc: 'Complete address form and select payment method',
      step3: '3. Order Confirmation',
      step3Desc: 'Success screen with order details and next actions',
      step4: '4. Order Tracking',
      step4Desc: 'Real-time status updates with vertical timeline',
      features: 'Key Features Demonstrated',
      feature1: 'DeliGo Glass Design Language',
      feature2: 'Bilingual Support (EN/RW)',
      feature3: 'Mobile-First Responsive Design',
      feature4: 'Accessible Touch Targets (44px)',
      feature5: 'Consistent Orange CTAs',
      feature6: 'Glass Morphism Effects',
      backToApp: 'Back to Main App'
    },
    rw: {
      title: 'Inyerekana y\'Inzira Yuzuye y\'Ikurikira',
      subtitle: 'Menya inzira yuzuye y\'abakiriya ba DeliGo',
      description: 'Iyi nyerekana yerekana inzira yuzuye y\'ikurikira kuva ku gucunga agitebo kugeza ku gukurikirana ikurikira, ikoresha Imiterere ya DeliGo Glass.',
      startDemo: 'Tangira Inyerekana y\'Inzira y\'Ikurikira',
      demoSteps: 'Intambwe z\'Inyerekana',
      step1: '1. Gucunga Agitebo',
      step1Desc: 'Ongeraho, ukuremo, kandi uhindure ibintu hamwe n\'ubwiyunge bw\'umubare',
      step2: '2. Inzira yo Kwishyura',
      step2Desc: 'Uzuza ifishi y\'aderesi kandi uhitemo uburyo bwo kwishyura',
      step3: '3. Kwemeza Ikurikira',
      step3Desc: 'Inyuma y\'intsinzi hamwe n\'amakuru y\'ikurikira n\'ibikorwa bikurikira',
      step4: '4. Gukurikirana Ikurikira',
      step4Desc: 'Ivugurura ry\'imiterere mu gihe nyacyo hamwe n\'umurongo w\'igihe',
      features: 'Ibintu by\'Ingenzi Byerekewe',
      feature1: 'Imiterere ya DeliGo Glass',
      feature2: 'Gushyigikira Indimi Ebyiri (EN/RW)',
      feature3: 'Imiterere Ibanza ku Telefoni',
      feature4: 'Intego Zishobora Gukoreshwa (44px)',
      feature5: 'Orange CTAs Zihamye',
      feature6: 'Ingaruka za Glass Morphism',
      backToApp: 'Subira ku Porogaramu Nyamukuru'
    }
  };

  // Handle cart updates
  const handleUpdateCart = (updatedItems: any[]) => {
    setCartItems(updatedItems);
  };

  // Handle order placement
  const handlePlaceOrder = (orderDetails: any) => {
    const orderId = `DG-DEMO-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const completeOrderData = {
      orderId,
      ...orderDetails,
      items: cartItems,
      timestamp: new Date().toISOString()
    };
    
    setOrderData(completeOrderData);
    setCurrentStep('confirmation');
    
    // TODO: In real implementation, send to API
    console.log('🚀 Demo Order Placed:', completeOrderData);
  };

  // Handle navigation
  const handleViewOrders = () => {
    setCurrentStep('tracking');
  };

  const handleContinueBrowsing = () => {
    setCurrentStep('demo-start');
    // Reset cart for next demo
    setCartItems(mockCartItems);
    setOrderData(null);
  };

  // Render different steps
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'cart':
        return (
          <CartScreen
            language={language}
            items={cartItems}
            onUpdateCart={handleUpdateCart}
            onBack={() => setCurrentStep('demo-start')}
            onViewOrders={handleViewOrders}
            onContinueBrowsing={handleContinueBrowsing}
          />
        );

      case 'checkout':
        return (
          <CheckoutScreen
            language={language}
            cartItems={cartItems}
            onBack={() => setCurrentStep('cart')}
            onPlaceOrder={handlePlaceOrder}
          />
        );

      case 'confirmation':
        return (
          <OrderConfirmationScreen
            language={language}
            orderData={orderData}
            onViewOrders={handleViewOrders}
            onContinueBrowsing={handleContinueBrowsing}
          />
        );

      case 'tracking':
        return (
          <OrderTracking
            language={language}
            onBack={() => setCurrentStep('confirmation')}
          />
        );

      default:
        return renderDemoStart();
    }
  };

  // Demo start screen
  const renderDemoStart = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="flex items-center justify-between p-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{content[language].backToApp}</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-gray-800 font-medium">{content[language].title}</h1>
          </div>
          
          <div className="w-16" />
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Introduction */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-gray-800 font-semibold text-xl mb-2">{content[language].subtitle}</h2>
          <p className="text-gray-600 mb-6">{content[language].description}</p>
          
          <Button 
            onClick={() => setCurrentStep('cart')}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 px-8 font-medium"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {content[language].startDemo}
          </Button>
        </div>

        {/* Demo Steps */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
          <h3 className="text-gray-800 font-semibold mb-4">{content[language].demoSteps}</h3>
          
          <div className="space-y-4">
            {[
              { step: content[language].step1, desc: content[language].step1Desc, icon: ShoppingCart },
              { step: content[language].step2, desc: content[language].step2Desc, icon: MapPin },
              { step: content[language].step3, desc: content[language].step3Desc, icon: CheckCircle },
              { step: content[language].step4, desc: content[language].step4Desc, icon: Package }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <IconComponent className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-800 font-medium text-sm">{item.step}</h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Highlighted */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
          <h3 className="text-gray-800 font-semibold mb-4">{content[language].features}</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              content[language].feature1,
              content[language].feature2,
              content[language].feature3,
              content[language].feature4,
              content[language].feature5,
              content[language].feature6
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <p className="text-blue-700 text-sm">
            {language === 'en' 
              ? 'This demo includes realistic forms, payment methods, and order tracking. All data is mocked for demonstration purposes.'
              : 'Iyi nyerekana irimo amafishi yukuri, uburyo bwo kwishyura, no gukurikirana amategeko. Amakuru yose ni ay\'urugero gusa.'
            }
          </p>
        </div>
      </div>
    </div>
  );

  return renderCurrentStep();
}