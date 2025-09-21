import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Flashlight, FlashlightOff, RotateCcw, CheckCircle, Info, Utensils, Activity, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';

interface FoodScanScreenProps {
  language: 'en' | 'rw';
  onBack: () => void;
}

interface ScanResult {
  foodName: { en: string; rw: string };
  confidence: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  tags: Array<{ en: string; rw: string }>;
  similarDishes: Array<{
    id: string;
    name: { en: string; rw: string };
    restaurant: { en: string; rw: string };
    price: number;
    rating: number;
  }>;
  allergens: Array<{ en: string; rw: string }>;
}

export function FoodScanScreen({ language, onBack }: FoodScanScreenProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const content = {
    en: {
      title: 'Food Scanner',
      subtitle: 'Scan food to get nutritional info',
      instructions: 'Point your camera at the food item and tap the capture button',
      capture: 'Capture',
      retake: 'Retake',
      analyzing: 'Analyzing...',
      flash: 'Flash',
      nutritionInfo: 'Nutritional Information',
      calories: 'Calories',
      protein: 'Protein',
      carbs: 'Carbs',
      fat: 'Fat',
      fiber: 'Fiber',
      perServing: 'per serving',
      confidence: 'AI Confidence',
      similarDishes: 'Similar Dishes',
      allergens: 'Potential Allergens',
      order: 'Order',
      cameraError: 'Camera access denied. Please enable camera permissions.',
      scanAnother: 'Scan Another',
      accuracy: 'Accuracy'
    },
    rw: {
      title: 'Sikana Ibiryo',
      subtitle: 'Sikana ibiryo ubona amakuru y\'intungamubiri',
      instructions: 'Erekana kamera ku biryo hanyuma ukande buto ryo gufata',
      capture: 'Gufata',
      retake: 'Ongera ufate',
      analyzing: 'Gusesengura...',
      flash: 'Urumuri',
      nutritionInfo: 'Amakuru y\'Intungamubiri',
      calories: 'Kalori',
      protein: 'Proteine',
      carbs: 'Karubohidrate',
      fat: 'Amavuta',
      fiber: 'Fibre',
      perServing: 'ku gice',
      confidence: 'Kwizera kwa AI',
      similarDishes: 'Ibiryo Bisa',
      allergens: 'Ibintu Bishobora Gutera Allergie',
      order: 'Tumiza',
      cameraError: 'Ntibyemerewe kwinjira kamera. Nyamuneka emera kamera.',
      scanAnother: 'Sikana Ikindi',
      accuracy: 'Ukwizerane'
    }
  };

  // Mock scan results
  const mockScanResults: ScanResult[] = [
    {
      foodName: { en: 'Grilled Chicken Breast', rw: 'Inkoko Icyemo ku Mulilo' },
      confidence: 92,
      nutrition: {
        calories: 185,
        protein: 31,
        carbs: 0,
        fat: 4,
        fiber: 0
      },
      tags: [
        { en: 'High Protein', rw: 'Proteine Nyinshi' },
        { en: 'Low Carb', rw: 'Karubohidrate Nke' },
        { en: 'Lean Meat', rw: 'Inyama Nke' }
      ],
      similarDishes: [
        {
          id: '1',
          name: { en: 'Grilled Chicken Special', rw: 'Inkoko Icyemo Idasanzwe' },
          restaurant: { en: 'Golden Spoon', rw: 'Ikiganza cy\'Umuhanga' },
          price: 3500,
          rating: 4.8
        },
        {
          id: '2',
          name: { en: 'Chicken & Vegetables', rw: 'Inkoko n\'Imboga' },
          restaurant: { en: 'Fresh Kitchen', rw: 'Igikoni Gishya' },
          price: 4200,
          rating: 4.6
        }
      ],
      allergens: [
        { en: 'May contain traces of soy', rw: 'Bishobora kuba birimo soja' }
      ]
    }
  ];

  const handleCapture = async () => {
    setIsScanning(true);
    
    // Create a mock captured image (in real app, would use camera)
    const mockImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcHR1cmVkIEZvb2Q8L3RleHQ+PC9zdmc+';
    setCapturedImage(mockImage);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const randomResult = mockScanResults[Math.floor(Math.random() * mockScanResults.length)];
      setScanResult(randomResult);
      setIsScanning(false);
    }, 2000 + Math.random() * 1500);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setScanResult(null);
    setIsScanning(false);
  };

  const handleOrderDish = (dishId: string) => {
    alert(language === 'en' 
      ? 'Redirecting to restaurant menu...' 
      : 'Kwimura ku menu ya resitora...'
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600 bg-green-100';
    if (confidence >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-border/30 pt-safe">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{language === 'en' ? 'Back' : 'Subira'}</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-foreground font-medium">{content[language].title}</h1>
            <p className="text-xs text-muted-foreground">{content[language].subtitle}</p>
          </div>
          
          <button
            onClick={() => setFlashEnabled(!flashEnabled)}
            className={`p-2 rounded-full transition-colors ${
              flashEnabled 
                ? 'bg-yellow-100 text-yellow-600' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {flashEnabled ? <Flashlight className="w-5 h-5" /> : <FlashlightOff className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="p-4 pb-safe">
        {!capturedImage && !scanResult ? (
          /* Camera View */
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
              <p className="text-center text-muted-foreground text-sm mb-4">
                {content[language].instructions}
              </p>
              
              {/* Mock Camera Preview */}
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-[4/3] mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-gray-600" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
                </div>
                
                {/* Camera Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white/60 rounded-2xl">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleCapture}
                disabled={isScanning}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl"
              >
                <Camera className="w-5 h-5 mr-2" />
                {content[language].capture}
              </Button>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="space-y-6">
            {/* Captured Image */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-foreground font-medium">
                  {isScanning ? content[language].analyzing : content[language].nutritionInfo}
                </h2>
                
                {!isScanning && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetake}
                    className="border-border text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    {content[language].retake}
                  </Button>
                )}
              </div>
              
              {/* Image Preview */}
              <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-[4/3] mb-4">
                {capturedImage && (
                  <img
                    src={capturedImage}
                    alt="Captured food"
                    className="w-full h-full object-cover"
                  />
                )}
                
                {isScanning && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-sm">{content[language].analyzing}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* AI Analysis Results */}
              <AnimatePresence>
                {scanResult && !isScanning && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Food Identification */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-foreground font-medium">
                          {scanResult.foodName[language]}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs px-2 py-1 ${getConfidenceColor(scanResult.confidence)}`}>
                            {content[language].accuracy}: {scanResult.confidence}%
                          </Badge>
                          {scanResult.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag[language]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    
                    {/* Nutritional Information */}
                    <div className="bg-muted/50 rounded-2xl p-4">
                      <h4 className="text-foreground font-medium mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        {content[language].nutritionInfo}
                        <span className="text-xs text-muted-foreground">
                          ({content[language].perServing})
                        </span>
                      </h4>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">
                            {scanResult.nutrition.calories}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {content[language].calories}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-foreground">
                            {scanResult.nutrition.protein}g
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {content[language].protein}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-foreground">
                            {scanResult.nutrition.carbs}g
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {content[language].carbs}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-border">
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">
                            {scanResult.nutrition.fat}g
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {content[language].fat}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">
                            {scanResult.nutrition.fiber}g
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {content[language].fiber}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Allergens Warning */}
                    {scanResult.allergens.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                        <h4 className="text-red-700 font-medium mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          {content[language].allergens}
                        </h4>
                        <div className="space-y-1">
                          {scanResult.allergens.map((allergen, index) => (
                            <p key={index} className="text-red-600 text-sm">
                              • {allergen[language]}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Similar Dishes */}
                    <div>
                      <h4 className="text-foreground font-medium mb-3 flex items-center gap-2">
                        <Utensils className="w-4 h-4" />
                        {content[language].similarDishes}
                      </h4>
                      
                      <div className="space-y-3">
                        {scanResult.similarDishes.map((dish) => (
                          <div
                            key={dish.id}
                            className="bg-white/60 border border-border rounded-2xl p-4 hover:bg-white/80 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h5 className="text-foreground font-medium">
                                  {dish.name[language]}
                                </h5>
                                <p className="text-muted-foreground text-sm">
                                  {dish.restaurant[language]}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-primary font-semibold">
                                    {dish.price.toLocaleString()} RWF
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-yellow-500">★</span>
                                    <span className="text-sm text-muted-foreground">
                                      {dish.rating}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <Button
                                size="sm"
                                onClick={() => handleOrderDish(dish.id)}
                                className="bg-primary hover:bg-primary/90 text-white"
                              >
                                {content[language].order}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleRetake}
                        className="h-12 border-border text-foreground hover:bg-muted"
                      >
                        {content[language].scanAnother}
                      </Button>
                      <Button
                        onClick={onBack}
                        className="h-12 bg-primary hover:bg-primary/90 text-white"
                      >
                        {language === 'en' ? 'Done' : 'Byakozwe'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}