import React, { useState } from 'react';
import { MainApp } from '../features/customer/components/MainApp';
import { VendorDashboard } from '../features/vendor/components/VendorDashboardFixed';

export default function App() {
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');

  // Shared data (mock for now, shaped to /src/types/index.ts)
  const [sharedRestaurants, setSharedRestaurants] = React.useState([]);
  const [sharedOrders, setSharedOrders] = React.useState([]);
  const [sharedUsers, setSharedUsers] = React.useState([]);

  // Handlers (stubbed but real signatures)
  const onCreateOrder = async (order: any) => { 
    const newOrder = { ...order, id: `ORD-${Date.now()}`, status: 'pending' };
    setSharedOrders((prev: any) => [newOrder, ...prev]);
    return newOrder; 
  };
  
  const onUpdateOrderStatus = async (orderId: string, status: string, vendorId: string) => { 
    setSharedOrders((prev: any) => prev.map((o: any) => o.id === orderId ? {...o, status} : o));
  };
  
  const onUpdateRestaurant = async (id: string, updates: any) => { 
    setSharedRestaurants((prev: any) => prev.map((r: any) => r.id === id ? {...r, ...updates} : r));
  };
  
  const onUpdateMenuItem = async (restaurantId: string, menuItem: any) => { 
    setSharedRestaurants((prev: any) => prev.map((r: any) => {
      if (r.id === restaurantId) {
        const menu = [...(r.menu || [])];
        const idx = menu.findIndex((m: any) => m.id === menuItem.id);
        if (idx >= 0) menu[idx] = menuItem;
        else menu.push(menuItem);
        return {...r, menu};
      }
      return r;
    }));
  };

  return (
    <div className="min-h-screen">
      <div className="p-3 flex gap-3">
        <button onClick={() => setRole('customer')} className={`px-4 py-2 rounded ${role === 'customer' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
          Customer
        </button>
        <button onClick={() => setRole('vendor')} className={`px-4 py-2 rounded ${role === 'vendor' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
          Vendor
        </button>
      </div>

      {role === 'customer' ? (
        <MainApp
          sharedRestaurants={sharedRestaurants}
          sharedOrders={sharedOrders}
          onCreateOrder={onCreateOrder}
          initialLanguage="en"
        />
      ) : (
        <VendorDashboard
          language="en"
          sharedRestaurants={sharedRestaurants}
          sharedOrders={sharedOrders}
          onUpdateRestaurant={onUpdateRestaurant}
          onUpdateMenuItem={onUpdateMenuItem}
          onUpdateOrderStatus={onUpdateOrderStatus}
          onBack={() => setRole('customer')}
        />
      )}
    </div>
  );
}