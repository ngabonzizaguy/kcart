import React, { useState } from 'react';
import { MapPin, Navigation, Search, X, Clock, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Separator } from './ui/separator';

interface LocationSelectorProps {
  language: 'en' | 'rw';
  currentLocation: string;
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
}

// Mock saved addresses and recent locations
const savedAddresses = [
  { id: '1', name: { en: 'Home', rw: 'Mu rugo' }, address: 'Kacyiru, KN 15 Ave', type: 'home' },
  { id: '2', name: { en: 'Work', rw: 'Ku kazi' }, address: 'Kimihurura, KG 7 Ave', type: 'work' },
  { id: '3', name: { en: 'University', rw: 'Kaminuza' }, address: 'Gikondo, KK 19 Ave', type: 'school' }
];

const recentLocations = [
  'Kigali, Kacyiru',
  'Kigali, Kimihurura', 
  'Kigali, Gikondo',
  'Kigali, Remera'
];

const popularAreas = [
  { name: 'Kacyiru', restaurants: 45, rating: 4.8 },
  { name: 'Kimihurura', restaurants: 38, rating: 4.7 },
  { name: 'Remera', restaurants: 52, rating: 4.6 },
  { name: 'Gikondo', restaurants: 29, rating: 4.5 },
  { name: 'Nyarutarama', restaurants: 33, rating: 4.8 }
];

export function LocationSelector({ 
  language, 
  currentLocation, 
  isOpen, 
  onClose, 
  onLocationSelect 
}: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  // Content translations
  const content = {
    en: {
      title: 'Choose Location',
      description: 'Select your delivery location to find nearby restaurants',
      currentLocation: 'Current Location',
      detectLocation: 'Detect my location',
      searchPlaceholder: 'Search area, street, or landmark...',
      savedAddresses: 'Saved Addresses',
      recentLocations: 'Recent Locations',
      popularAreas: 'Popular Areas',
      restaurants: 'restaurants',
      detecting: 'Detecting location...',
      addAddress: 'Add new address',
      home: 'Home',
      work: 'Work',
      university: 'University'
    },
    rw: {
      title: 'Hitamo Ahantu',
      description: 'Hitamo ahantu hatanzwa ibiryo kugira ushakishe ibibanza biri hafi',
      currentLocation: 'Ahantu Hariho',
      detectLocation: 'Shakisha ahantu hanjye',
      searchPlaceholder: 'Shakisha karere, umuhanda, cyangwa ikimenyetso...',
      savedAddresses: 'Aderesi Zabitswe',
      recentLocations: 'Ahantu Hashya',
      popularAreas: 'Uturere Tukunda',
      restaurants: 'ibibanza',
      detecting: 'Twegereza ahantu...',
      addAddress: 'Ongeraho aderesi nshya',
      home: 'Mu rugo',
      work: 'Ku kazi',
      university: 'Kaminuza'
    }
  };

  // Handle location detection
  const handleDetectLocation = async () => {
    setIsDetecting(true);
    
    try {
      // Simulate location detection
      await new Promise(resolve => setTimeout(resolve, 2000));
      const detectedLocation = 'Kigali, Kacyiru'; // Mock detected location
      onLocationSelect(detectedLocation);
      onClose();
    } catch (error) {
      console.error('Location detection failed:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: string) => {
    onLocationSelect(location);
    onClose();
  };

  // Get address type icon
  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return '🏠';
      case 'work': return '💼';
      case 'school': return '🎓';
      default: return '📍';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] bg-background/95 backdrop-blur-sm border-t border-border rounded-t-3xl"
      >
        {/* Header */}
        <SheetHeader className="pb-4">
          <SheetTitle className="text-foreground text-lg">
            {content[language].title}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground text-sm">
            {content[language].description}
          </SheetDescription>
        </SheetHeader>

        {/* Content */}
        <div className="space-y-6 pb-6">
          {/* Current Location */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-muted-foreground text-sm">{content[language].currentLocation}</p>
                <p className="text-foreground font-medium">{currentLocation}</p>
              </div>
            </div>
          </div>

          {/* Detect Location Button */}
          <Button
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
          >
            {isDetecting ? (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {content[language].detecting}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Navigation className="w-4 h-4" />
                {content[language].detectLocation}
              </div>
            )}
          </Button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder={content[language].searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-input-background border-border rounded-2xl"
            />
          </div>

          {/* Saved Addresses */}
          {savedAddresses.length > 0 && (
            <div>
              <h3 className="text-foreground font-medium mb-3">
                {content[language].savedAddresses}
              </h3>
              <div className="space-y-2">
                {savedAddresses.map((address) => (
                  <button
                    key={address.id}
                    onClick={() => handleLocationSelect(address.address)}
                    className="w-full p-4 bg-card/80 border border-border rounded-2xl text-left hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getAddressIcon(address.type)}</span>
                      <div className="flex-1">
                        <p className="text-foreground font-medium">{address.name[language]}</p>
                        <p className="text-muted-foreground text-sm">{address.address}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <Separator className="opacity-30" />

          {/* Recent Locations */}
          <div>
            <h3 className="text-foreground font-medium mb-3">
              {content[language].recentLocations}
            </h3>
            <div className="space-y-2">
              {recentLocations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full p-3 bg-card/50 border border-border rounded-xl text-left hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{location}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Separator className="opacity-30" />

          {/* Popular Areas */}
          <div>
            <h3 className="text-foreground font-medium mb-3">
              {content[language].popularAreas}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {popularAreas.map((area, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(`Kigali, ${area.name}`)}
                  className="p-4 bg-card/80 border border-border rounded-2xl text-left hover:bg-accent transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-foreground font-medium">{area.name}</p>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <span>{area.restaurants} {content[language].restaurants}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{area.rating}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}