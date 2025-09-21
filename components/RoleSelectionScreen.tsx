import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  ShoppingBag, 
  Store, 
  Users, 
  TrendingUp, 
  Clock, 
  Heart,
  ChefHat,
  BarChart
} from 'lucide-react';

/**
 * RoleSelectionScreen - User Role Selection
 * 
 * Allows users to choose between Customer and Vendor experiences
 * Comes after language selection in the onboarding flow
 * 
 * Features:
 * - Clear role differentiation with icons and descriptions
 * - Benefits highlighting for each role
 * - Seamless transition to role-specific onboarding
 * - DeliGo Glass Design Language
 * 
 * Flow: SplashScreen → LanguageSelection → RoleSelection → RoleOnboarding → Login → Dashboard
 */
interface RoleSelectionScreenProps {
  language: 'en' | 'rw';
  onRoleSelect: (role: 'customer' | 'vendor') => void;
  onBack: () => void;
}

export function RoleSelectionScreen({ language, onRoleSelect, onBack }: RoleSelectionScreenProps) {
  const content = {
    en: {
      title: 'Welcome to DeliGo',
      subtitle: 'Choose how you\'d like to use DeliGo',
      customer: {
        title: 'I\'m a Customer',
        subtitle: 'Order food from local restaurants',
        benefits: [
          'Browse local restaurants',
          'Track orders in real-time', 
          'Save favorite meals',
          'Get personalized recommendations'
        ],
        cta: 'Start Ordering'
      },
      vendor: {
        title: 'I\'m a Restaurant Owner',
        subtitle: 'Manage your restaurant business',
        benefits: [
          'Manage orders and menu',
          'Track sales and analytics',
          'Connect with customers',
          'Grow your business'
        ],
        cta: 'Start Selling'
      },
      back: 'Back'
    },
    rw: {
      title: 'Murakaza neza kuri DeliGo',
      subtitle: 'Hitamo uko ushaka gukoresha DeliGo',
      customer: {
        title: 'Ndi Umuguzi',
        subtitle: 'Gutumiza ibiryo mu maresitora yegeranye',
        benefits: [
          'Shakisha maresitora yegeranye',
          'Gukurikirana amatungo mu gihe nyacyo',
          'Kubika ibiryo wakunze',
          'Kubona amabwiriza bwite'
        ],
        cta: 'Tangira Gutumiza'
      },
      vendor: {
        title: 'Ndi Nyir\'i Resitora',
        subtitle: 'Gucunga ubucuruzi bwawe bwa resitora',
        benefits: [
          'Gucunga amatungo n\'ibikoresho',
          'Gukurikirana ibigurirwa n\'isesengura',
          'Guhuza n\'abakiriya',
          'Gutera ubucuruzi bwawe imbere'
        ],
        cta: 'Tangira Kugurisha'
      },
      back: 'Subira'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col pb-safe">
      {/* Header */}
      <div className="pt-safe px-6 py-6">
        <div className="flex items-center justify-between mb-8 mt-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← {content[language].back}
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <h1 className="text-2xl font-medium text-gray-800 mb-2">
            {content[language].title}
          </h1>
          <p className="text-gray-600">
            {content[language].subtitle}
          </p>
        </div>
      </div>

      {/* Role Cards */}
      <div className="flex-1 px-6 space-y-6">
        {/* Customer Card */}
        <Card 
          className="bg-white/80 backdrop-blur-sm border border-white/20 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => onRoleSelect('customer')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  {content[language].customer.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {content[language].customer.subtitle}
                </p>
                
                {/* Benefits */}
                <div className="space-y-2 mb-4">
                  {content[language].customer.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Heart className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-12 text-base font-medium">
              {content[language].customer.cta}
            </Button>
          </CardContent>
        </Card>

        {/* Vendor Card */}
        <Card 
          className="bg-white/80 backdrop-blur-sm border border-white/20 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => onRoleSelect('vendor')}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Store className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  {content[language].vendor.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {content[language].vendor.subtitle}
                </p>
                
                {/* Benefits */}
                <div className="space-y-2 mb-4">
                  {content[language].vendor.benefits.map((benefit, index) => {
                    const icons = [ChefHat, BarChart, Users, TrendingUp];
                    const IconComponent = icons[index % icons.length];
                    
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                          <IconComponent className="w-3 h-3 text-orange-600" />
                        </div>
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 text-base font-medium">
              {content[language].vendor.cta}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom spacing for safe area */}
      <div className="h-8" />
    </div>
  );
}