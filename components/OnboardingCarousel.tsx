import React, { useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Search, ShoppingCart, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OnboardingCarouselProps {
  language: 'en' | 'rw';
  onGetStarted: () => void;
}

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1582557678431-d3b30ea0be05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjBicm93c2UlMjBtZW51fGVufDF8fHx8MTc1NTk4MzAxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: Search,
    title: {
      en: "Browse & Discover",
      rw: "Shakisha no Gukora"
    },
    description: {
      en: "Explore a wide variety of restaurants and cuisines available in your area",
      rw: "Shakisha ibibanza n'ibiryo by'ubwoko bwinshi byose biri mu gace kawe"
    }
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1654683413645-d8d15189384c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwb3JkZXJpbmclMjBzbWFydHBob25lfGVufDF8fHx8MTc1NTk4MzAxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: ShoppingCart,
    title: {
      en: "Order with Ease",
      rw: "Tegeka mu Buryo Bworoshye"
    },
    description: {
      en: "Place your order quickly and securely with just a few taps",
      rw: "Tegeka ibyo ushaka byihuse kandi byizewe mu buryo bworoshye"
    }
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1586449480537-3a22cf98b04c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRyYWNraW5nJTIwbWFwfGVufDF8fHx8MTc1NTk4MzAxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    icon: MapPin,
    title: {
      en: "Track Your Order",
      rw: "Krikiza Ibyo Watefanije"
    },
    description: {
      en: "Monitor your delivery in real-time from preparation to your doorstep",
      rw: "Kura ibyuwateganije kuva bitegurwa kugeza biragera ku rugi rwawe"
    }
  }
];

export function OnboardingCarousel({ language, onGetStarted }: OnboardingCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];
  const IconComponent = currentSlideData.icon;

  return (
    <div className="flex-1 flex flex-col">
      {/* Image Section */}
      <div className="relative h-80 mx-6 mb-8 rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm">
        <ImageWithFallback
          src={currentSlideData.image}
          alt={currentSlideData.title[language]}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 bg-orange-500 p-3 rounded-full">
          <IconComponent className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 flex-1 flex flex-col">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {currentSlideData.title[language]}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {currentSlideData.description[language]}
          </p>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-orange-500 w-8' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevSlide}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="w-4 h-4" />
            {language === 'en' ? 'Previous' : 'Ibindi'}
          </Button>

          {currentSlide === slides.length - 1 ? (
            <Button
              onClick={onGetStarted}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full"
            >
              {language === 'en' ? 'Get Started' : 'Tangira'}
            </Button>
          ) : (
            <Button
              onClick={nextSlide}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full"
            >
              {language === 'en' ? 'Next' : 'Komeza'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}