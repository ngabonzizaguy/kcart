import React, { useState } from 'react';
import { MapPin, Navigation, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface LocationPermissionProps {
  language: 'en' | 'rw';
  onLocationGranted: (location: string) => void;
  onSkip: () => void;
}

export function LocationPermission({ language, onLocationGranted, onSkip }: LocationPermissionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Content translations
  const content = {
    en: {
      title: 'Enable Location',
      subtitle: 'Find the best restaurants near you',
      description: 'We need your location to show nearby restaurants and accurate delivery times.',
      benefits: [
        'Discover restaurants in your area',
        'Get accurate delivery estimates',
        'See distance-based pricing',
        'Find the fastest delivery options'
      ],
      enableLocation: 'Enable Location',
      manualEntry: 'Enter location manually',
      skip: 'Skip for now',
      detecting: 'Detecting your location...',
      error: 'Unable to detect location',
      tryAgain: 'Try again'
    },
    rw: {
      title: 'Emera Ahantu',
      subtitle: 'Shakisha ibibanza bishya hafi yawe',
      description: 'Dukeneye ahantu hawe kugira ngo tugaragaze ibibanza biri hafi yawe n\'igihe cy\'gutanga neza.',
      benefits: [
        'Shakisha ibibanza mu karere kawe',
        'Bona ibigereranyo by\'gutanga neza',
        'Reba ibiciro bijyanye n\'intera',
        'Shakisha amahitamo yo gutanga vuba'
      ],
      enableLocation: 'Emera Ahantu',
      manualEntry: 'Injiza ahantu wenyine',
      skip: 'Simbura ubu',
      detecting: 'Twegereza ahantu hawe...',
      error: 'Ntitwashoboye kubona ahantu',
      tryAgain: 'Gerageza nanone'
    }
  };

  // Handle location permission request
  const handleLocationRequest = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Request geolocation permission
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      // Mock reverse geocoding - in real app, you'd use a geocoding service
      const mockLocation = 'Kigali, Kacyiru';
      onLocationGranted(mockLocation);
    } catch (err) {
      setError(content[language].error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual location entry
  const handleManualEntry = () => {
    // In real app, this would open a location search/input modal
    onLocationGranted('Kigali, Rwanda');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-orange-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Location Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {content[language].title}
          </h1>
          <p className="text-muted-foreground">
            {content[language].subtitle}
          </p>
        </div>

        {/* Description */}
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-6 mb-6">
          <p className="text-card-foreground mb-4">
            {content[language].description}
          </p>

          {/* Benefits List */}
          <div className="space-y-3">
            {content[language].benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <span className="text-muted-foreground text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <span className="text-destructive text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Enable Location Button */}
          <Button
            onClick={handleLocationRequest}
            disabled={isLoading}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-base font-medium"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {content[language].detecting}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Navigation className="w-5 h-5" />
                {error ? content[language].tryAgain : content[language].enableLocation}
              </div>
            )}
          </Button>

          {/* Manual Entry Button */}
          <Button
            onClick={handleManualEntry}
            variant="outline"
            className="w-full h-12 border-border hover:bg-accent rounded-2xl text-foreground"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4" />
              {content[language].manualEntry}
              <ChevronRight className="w-4 h-4 ml-auto" />
            </div>
          </Button>

          {/* Skip Button */}
          <Button
            onClick={onSkip}
            variant="ghost"
            className="w-full h-12 text-muted-foreground hover:text-foreground rounded-2xl"
          >
            {content[language].skip}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}