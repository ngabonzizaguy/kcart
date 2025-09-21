import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface ScrollTestProps {
  language: 'en' | 'rw';
  onBack: () => void;
}

/**
 * ScrollTest Component - Demonstrates proper scrolling in production mode
 * 
 * This component serves as a reference for how PopularRestaurantsScreen and CategoryPage
 * should handle scrolling in the production MainApp environment with bottom navigation.
 * 
 * Key patterns:
 * - Uses h-full and flex flex-col for proper container sizing
 * - Uses bottom-nav-spacing class for proper padding
 * - Uses custom-scrollbar for visible scroll indicators
 * - Optimized height calculations for mobile layout
 */
export function ScrollTest({ language, onBack }: ScrollTestProps) {
  const content = {
    en: {
      title: 'Scroll Test',
      description: 'Testing optimal scrolling in production mode',
      item: 'Test Item'
    },
    rw: {
      title: 'Ikizamini cy\'Urusobe',
      description: 'Gukoresha urusobe mwiza mu buryo bwa production',
      item: 'Ikintu cy\'Ikizamini'
    }
  };

  // Generate test items for scrolling
  const testItems = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `${content[language].item} ${i + 1}`
  }));

  return (
    <div className="h-full bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex flex-col">
      {/* Header - Fixed with proper z-index */}
      <div className="bg-white/90 backdrop-blur-md border-b border-orange-200/30 pt-safe sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 h-auto rounded-2xl hover:bg-orange-100/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                {content[language].title}
              </h1>
              <p className="text-muted-foreground text-sm">
                {content[language].description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="px-6 py-3 bg-white/40 backdrop-blur-sm border-b border-orange-200/20">
        <p className="text-muted-foreground text-sm">
          {testItems.length} test items for scrolling
        </p>
      </div>

      {/* Scrollable Content - Optimized for production mode with bottom navigation */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar"
        style={{
          height: 'calc(100vh - 280px)', // Account for header + results counter + bottom nav
          minHeight: 0,
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y'
        }}
      >
        <div className="px-6 py-6 space-y-4 bottom-nav-spacing">
          {testItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/85 backdrop-blur-sm border border-white/20 rounded-3xl p-5 hover:bg-white/95 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {item.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Production mode scrolling test item
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">
                    {item.id}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}