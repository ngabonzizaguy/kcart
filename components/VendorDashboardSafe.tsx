import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ChevronLeft } from 'lucide-react';

/**
 * VendorDashboardSafe - Error-free version for testing shared data integration
 * 
 * This is a simplified, safe version of the vendor dashboard that eliminates
 * potential undefined property access errors while testing the data flow.
 */

interface SafeVendorDashboardProps {
  language: 'en' | 'rw';
  onBack: () => void;
  // ===== SHARED DATA INTEGRATION =====
  sharedRestaurants?: any[];
  sharedOrders?: any[];
  sharedUsers?: any[];
  onUpdateRestaurant?: (id: string, updates: any) => Promise<void>;
  onUpdateMenuItem?: (restaurantId: string, menuItem: any) => Promise<void>;
  onUpdateOrderStatus?: (orderId: string, status: string, vendorId: string) => Promise<void>;
}

export function VendorDashboardSafe({ 
  language = 'en',
  onBack,
  sharedRestaurants = [],
  sharedOrders = [],
  sharedUsers = [],
  onUpdateRestaurant,
  onUpdateMenuItem,
  onUpdateOrderStatus
}: SafeVendorDashboardProps) {
  
  const [testData, setTestData] = useState({
    restaurants: sharedRestaurants.length,
    orders: sharedOrders.length,
    users: sharedUsers.length
  });

  useEffect(() => {
    setTestData({
      restaurants: sharedRestaurants.length,
      orders: sharedOrders.length,
      users: sharedUsers.length
    });
    console.log('🔄 Vendor Dashboard Safe - Shared data updated:', {
      restaurants: sharedRestaurants.length,
      orders: sharedOrders.length,
      users: sharedUsers.length
    });
  }, [sharedRestaurants, sharedOrders, sharedUsers]);

  const handleTestAction = async () => {
    try {
      if (onUpdateOrderStatus) {
        await onUpdateOrderStatus('test-order-123', 'preparing', 'vendor-001');
        console.log('✅ Test order status update completed');
      }
    } catch (error) {
      console.error('❌ Test action failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="p-2 hover:bg-white/20 rounded-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-medium text-gray-800">
          {language === 'en' ? 'Vendor Dashboard (Safe)' : 'Dashboard ya Vendor (Safe)'}
        </h1>
        <div></div>
      </div>

      {/* Shared Data Status */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-6 mb-6">
        <CardContent className="p-0">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            {language === 'en' ? 'Shared Data Status' : 'Imiterere ya Data Isangiye'}
          </h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{testData.restaurants}</div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Restaurants' : 'Resitora'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{testData.orders}</div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Orders' : 'Amatungo'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{testData.users}</div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Users' : 'Abakoresha'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-6 mb-6">
        <CardContent className="p-0">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            {language === 'en' ? 'Test Data Flow' : 'Gerageza Data Flow'}
          </h2>
          
          <div className="space-y-4">
            <Button
              onClick={handleTestAction}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12"
            >
              {language === 'en' ? 'Test Order Status Update' : 'Gerageza Guhindura Status ya Order'}
            </Button>
            
            <div className="text-sm text-gray-600">
              {language === 'en' 
                ? 'This will test the shared data flow between vendor and customer'
                : 'Ibi bizagerageza data flow hagati ya vendor na customer'
              }
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
        <CardContent className="p-0">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            {language === 'en' ? 'Shared Orders' : 'Amatungo Asangiye'}
          </h2>
          
          {sharedOrders.length > 0 ? (
            <div className="space-y-3">
              {sharedOrders.slice(0, 3).map((order, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium">Order #{order?.id || 'Unknown'}</div>
                    <div className="text-sm text-gray-600">
                      Status: {order?.status || 'Unknown'}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {order?.total ? `$${order.total}` : '$0.00'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              {language === 'en' ? 'No shared orders yet' : 'Nta matungo asangiye'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}