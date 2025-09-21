import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';

/**
 * MenuManagementDemo - Shows integration between VendorDashboard menu management
 * and customer-facing MenuItemCard/VendorProfile displays
 * 
 * This component demonstrates how menu changes from the vendor dashboard
 * directly update the customer-facing display components.
 */

interface MenuItem {
  id: string;
  name: { en: string; rw: string };
  description: { en: string; rw: string };
  price: number;
  category: string;
  isAvailable: boolean;
  soldToday: number;
}

interface MenuManagementDemoProps {
  language: 'en' | 'rw';
}

// Shared menu item state that would be managed by a global state manager in a real app
const sampleMenuItem: MenuItem = {
  id: 'demo-item-001',
  name: { en: 'Grilled Chicken Special', rw: 'Inkoko y\'Akalanga Idasanzwe' },
  description: { 
    en: 'Tender grilled chicken with rice and vegetables',
    rw: 'Inkoko yoroshye y\'akalanga hamwe n\'umuceri n\'imboga'
  },
  price: 15.50,
  category: 'Main Dishes',
  isAvailable: true,
  soldToday: 12
};

export function MenuManagementDemo({ language }: MenuManagementDemoProps) {
  const [menuItem, setMenuItem] = useState(sampleMenuItem);

  const content = {
    en: {
      title: '🔗 Menu Management Integration Demo',
      subtitle: 'How vendor dashboard changes update customer displays',
      vendorView: 'Vendor Dashboard View',
      customerView: 'Customer MenuItemCard View',
      available: 'Available',
      soldOut: 'Sold Out',
      price: 'Price',
      soldToday: 'Sold Today',
      toggleAvailability: 'Toggle Availability',
      updatePrice: 'Update Price',
      integration: 'Real-time Integration',
      integrationNote1: '✅ Availability toggle instantly updates customer view',
      integrationNote2: '✅ Price changes reflect immediately in MenuItemCard',
      integrationNote3: '✅ Sold out items show unavailable status to customers',
      integrationNote4: '✅ All changes sync across VendorProfile displays'
    },
    rw: {
      title: '🔗 Kwerekana Gucunga Ibikoresho',
      subtitle: 'Uko impinduka z\'ikibaho cy\'umucuruzi zigenda kuri abaguzi',
      vendorView: 'Ikibaho cy\'Umucuruzi',
      customerView: 'Ikiciro cy\'Umuguzi',
      available: 'Birahari',
      soldOut: 'Byaguzwe byose',
      price: 'Igiciro',
      soldToday: 'Byagurishijwe Uyu Munsi',
      toggleAvailability: 'Guhindura Uko Bihari',
      updatePrice: 'Kuvugurura Igiciro',
      integration: 'Guhuza mu Gihe',
      integrationNote1: '✅ Guhindura uko bihari bigenda vuba ku baguzi',
      integrationNote2: '✅ Guhindura ibiciro bigaragara ako kanya',
      integrationNote3: '✅ Ibintu byaguze byerekana ko bidahari ku baguzi',
      integrationNote4: '✅ Impinduka zose zihuza kuri VendorProfile'
    }
  };

  const handleToggleAvailability = () => {
    setMenuItem(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
  };

  const handlePriceUpdate = () => {
    const newPrice = prompt('Enter new price:', menuItem.price.toString());
    if (newPrice && !isNaN(parseFloat(newPrice))) {
      setMenuItem(prev => ({ ...prev, price: parseFloat(newPrice) }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-800 mb-2">{content[language].title}</h1>
          <p className="text-gray-600">{content[language].subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vendor Dashboard View */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                🏪 {content[language].vendorView}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{menuItem.name[language]}</h3>
                    <p className="text-sm text-gray-600 mb-2">{menuItem.category}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-medium text-gray-800">${menuItem.price}</span>
                      <span className="text-xs text-gray-500">
                        {content[language].soldToday}: {menuItem.soldToday}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Switch
                      checked={menuItem.isAvailable}
                      onCheckedChange={handleToggleAvailability}
                      className="data-[state=checked]:bg-orange-500"
                    />
                    <Badge 
                      className={menuItem.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {menuItem.isAvailable ? content[language].available : content[language].soldOut}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-white/20">
                  <button
                    onClick={handleToggleAvailability}
                    className="flex-1 px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
                  >
                    {content[language].toggleAvailability}
                  </button>
                  <button
                    onClick={handlePriceUpdate}
                    className="flex-1 px-3 py-2 text-sm border border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                  >
                    {content[language].updatePrice}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer MenuItemCard View */}
          <Card className={`bg-white/80 backdrop-blur-sm border border-white/20 ${!menuItem.isAvailable ? 'opacity-60' : ''}`}>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                👤 {content[language].customerView}
              </h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="w-full h-32 bg-gradient-to-r from-orange-200 to-amber-200 rounded-xl mb-3 flex items-center justify-center">
                    <span className="text-gray-600">🍗 Food Image</span>
                  </div>
                  
                  {!menuItem.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Badge className="bg-red-500 text-white">
                        {content[language].soldOut}
                      </Badge>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-1">{menuItem.name[language]}</h3>
                  <p className="text-sm text-gray-600 mb-2">{menuItem.description[language]}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-orange-600">${menuItem.price}</span>
                    {menuItem.isAvailable ? (
                      <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm transition-colors">
                        Add to Cart
                      </button>
                    ) : (
                      <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-xl text-sm cursor-not-allowed">
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Benefits */}
        <Card className="bg-white/90 backdrop-blur-md border border-white/30">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              ⚡ {content[language].integration}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-700">{content[language].integrationNote1}</p>
                <p className="text-sm text-gray-700">{content[language].integrationNote2}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">{content[language].integrationNote3}</p>
                <p className="text-sm text-gray-700">{content[language].integrationNote4}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}