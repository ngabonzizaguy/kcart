import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  ChevronLeft, 
  ChevronRight,
  Users, 
  Store, 
  MapPin, 
  Clock, 
  Heart, 
  Star,
  TrendingUp,
  BarChart,
  DollarSign,
  Bell,
  Shield,
  Smartphone
} from 'lucide-react';

/**
 * RoleSpecificOnboarding - Role-aware onboarding carousel
 * 
 * Shows different onboarding content based on selected role:
 * - Customer: Browse → Order → Track
 * - Vendor: Setup → Manage → Grow
 * 
 * Features:
 * - Role-specific slides and messaging
 * - Smooth horizontal swipe transitions  
 * - Skip functionality for returning users
 * - Consistent with DeliGo Glass Design Language
 */
interface RoleSpecificOnboardingProps {
  language: 'en' | 'rw';
  userRole: 'customer' | 'vendor';
  onComplete: () => void;
  onBack: () => void;
}

export function RoleSpecificOnboarding({ 
  language, 
  userRole, 
  onComplete, 
  onBack 
}: RoleSpecificOnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Customer onboarding content
  const customerContent = {
    en: {
      title: 'Welcome, Food Lover!',
      slides: [
        {
          icon: MapPin,
          iconBg: 'bg-blue-500',
          title: 'Discover Local Restaurants',
          description: 'Browse hundreds of restaurants near you. From local favorites to trending spots, find exactly what you\'re craving.',
          features: ['Real-time availability', 'Customer reviews', 'Cuisine filters']
        },
        {
          icon: Smartphone,
          iconBg: 'bg-green-500',
          title: 'Order with Ease',
          description: 'Simple ordering process with secure payment. Customize your meals and schedule delivery at your convenience.',
          features: ['Easy customization', 'Multiple payment options', 'Schedule orders']
        },
        {
          icon: Clock,
          iconBg: 'bg-orange-500',
          title: 'Track Your Order',
          description: 'Follow your order from kitchen to doorstep with real-time tracking. Get notified at every step of the delivery.',
          features: ['Live tracking', 'ETA updates', 'Delivery notifications']
        }
      ],
      skip: 'Skip',
      next: 'Next',
      getStarted: 'Start Ordering'
    },
    rw: {
      title: 'Murakaza neza, Mukunzi w\'Ibiryo!',
      slides: [
        {
          icon: MapPin,
          iconBg: 'bg-blue-500',
          title: 'Shakisha Maresitora Yegeranye',
          description: 'Shakisha maresitora magana yegeranye nawe. Kuva ku yakunzwe mu gace geza kurugero rwiza rw\'ibintu bishya.',
          features: ['Kuboneka mu gihe nyacyo', 'Igitekerezo cy\'abakiriya', 'Gutoranya ubwoko bw\'ibiryo']
        },
        {
          icon: Smartphone,
          iconBg: 'bg-green-500',  
          title: 'Gutumiza mu Buryo Bworoshye',
          description: 'Uburyo bworoshye bwo gutumiza hamwe n\'ukwishyura kw\'amahirwe. Hindura ibiryo byawe kandi ugenere igihe cyo gutwara.',
          features: ['Guhindura byoroshye', 'Uburyo bw\'ukwishyura butandukanye', 'Gutegura amatungo']
        },
        {
          icon: Clock,
          iconBg: 'bg-orange-500',
          title: 'Kurikirana Itungo Ryawe',
          description: 'Kurikira itungo ryawe kuva mu gikoni kugeza ku muryango hamwe no gukurikirana mu gihe nyacyo.',
          features: ['Gukurikirana mu buzima', 'Kuvugurura igihe', 'Amakuru yo gutwarwa']
        }
      ],
      skip: 'Simbuka',
      next: 'Ikurikira',
      getStarted: 'Tangira Gutumiza'
    }
  };

  // Vendor onboarding content
  const vendorContent = {
    en: {
      title: 'Welcome, Restaurant Owner!',
      slides: [
        {
          icon: Store,
          iconBg: 'bg-orange-500',
          title: 'Setup Your Restaurant',
          description: 'Create your restaurant profile, add your menu items, and set your operating hours to start accepting orders.',
          features: ['Easy menu management', 'Business hours control', 'Photo uploads']
        },
        {
          icon: Bell,
          iconBg: 'bg-purple-500',
          title: 'Manage Orders Efficiently',
          description: 'Receive real-time order notifications, manage your queue, and update order status with our intuitive dashboard.',
          features: ['Real-time notifications', 'Order queue management', 'Status updates']
        },
        {
          icon: TrendingUp,
          iconBg: 'bg-green-500',
          title: 'Grow Your Business',
          description: 'Access detailed analytics, create promotions, and engage with customers to boost your sales and reputation.',
          features: ['Sales analytics', 'Promotion tools', 'Customer reviews']
        }
      ],
      skip: 'Skip',
      next: 'Next', 
      getStarted: 'Start Managing'
    },
    rw: {
      title: 'Murakaza neza, Nyir\'i Resitora!',
      slides: [
        {
          icon: Store,
          iconBg: 'bg-orange-500',
          title: 'Shiraho Resitora Yawe',
          description: 'Kora umwirondoro wa resitora yawe, ongeraho ibikoresho byawe, kandi ushireho amasaha y\'akazi kugira ngo utangire kwakira amatungo.',
          features: ['Gucunga ibikoresho byoroshye', 'Kugenzura amasaha y\'akazi', 'Gushyiraho amafoto']
        },
        {
          icon: Bell,
          iconBg: 'bg-purple-500',
          title: 'Gucunga Amatungo Neza',
          description: 'Kubona amakuru ya matungo mu gihe nyacyo, gucunga umutongo wawe, kandi kuvugurura uko amatungo ameze ukoresheje dashboard yacu yoroshye.',
          features: ['Amakuru mu gihe nyacyo', 'Gucunga umutongo', 'Kuvugurura amakuru']
        },
        {
          icon: TrendingUp,
          iconBg: 'bg-green-500',
          title: 'Gutera Ubucuruzi Bwawe Imbere',
          description: 'Kubona isesengura rirambuye, gukora kwamamaza, no guhuza n\'abakiriya kugira ngo ugire igurirwa ryinshi n\'izina riryoshye.',
          features: ['Isesengura ry\'igurirwa', 'Ibikoresho byo kwamamaza', 'Igitekerezo cy\'abakiriya']
        }
      ],
      skip: 'Simbuka',
      next: 'Ikurikira',
      getStarted: 'Tangira Gucunga'
    }
  };

  const content = userRole === 'customer' ? customerContent : vendorContent;
  const slides = content[language].slides;
  const totalSlides = slides.length;

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentSlideData = slides[currentSlide];
  const IconComponent = currentSlideData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col pb-safe">
      {/* Header */}
      <div className="pt-safe px-6 py-4">
        <div className="flex items-center justify-between mb-2 mt-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-white/50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={handleSkip}
            className="text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
          >
            {content[language].skip}
          </button>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 justify-center">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-orange-500' 
                  : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 flex flex-col items-center justify-center">
        <Card className="bg-white/90 backdrop-blur-md border border-white/30 w-full max-w-sm">
          <CardContent className="p-8 text-center">
            {/* Icon */}
            <div className={`w-20 h-20 ${currentSlideData.iconBg} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
              <IconComponent className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-medium text-gray-800 mb-3">
              {currentSlideData.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {currentSlideData.description}
            </p>

            {/* Features */}
            <div className="space-y-2 mb-8">
              {currentSlideData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Controls */}
      <div className="px-6 pb-8">
        <div className="flex items-center gap-4">
          {currentSlide > 0 && (
            <Button
              onClick={prevSlide}
              variant="outline"
              className="flex-1 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          
          <Button
            onClick={nextSlide}
            className={`${currentSlide === 0 ? 'flex-1' : 'flex-1'} ${
              userRole === 'customer' 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-orange-500 hover:bg-orange-600'
            } text-white rounded-xl h-12 text-base font-medium`}
          >
            {currentSlide === totalSlides - 1 ? (
              <>
                {content[language].getStarted}
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                {content[language].next}
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}