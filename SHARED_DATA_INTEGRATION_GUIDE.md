# 🔗 DeliGo Shared Data Integration Guide

## 📋 **Overview**

This guide documents the shared data architecture implemented in DeliGo to enable real-time data flow between customer and vendor applications. The system is designed for easy API integration and future admin interface expansion.

## 🏗️ **Architecture**

```
App.tsx (Global Data Store)
├── SharedDataService (API Integration Layer)
├── SharedBusinessData {restaurants, orders, users, menuItems}
├── Real-time Update Simulation
├── MainApp (Customer) ← reads/writes to SharedBusinessData
└── VendorDashboard (Vendor) ← reads/writes to SharedBusinessData
```

## 🔄 **Data Flow Patterns**

### **Vendor → Customer Flow**
1. **Vendor updates menu** in VendorDashboard
2. **Calls** `onUpdateMenuItem()` → `handleMenuItemUpdate()` in App.tsx
3. **Updates** `sharedRestaurants` state
4. **Customer app** automatically receives updated menu via `useEffect` synchronization
5. **Result:** Customer sees new menu items immediately

### **Customer → Vendor Flow**
1. **Customer places order** in MainApp
2. **Calls** `onCreateOrder()` → `handleOrderCreation()` in App.tsx
3. **Adds** to `sharedOrders` state
4. **Vendor dashboard** automatically receives new order via `useEffect` synchronization
5. **Result:** Vendor sees new order immediately

### **Real-time Status Updates**
1. **Vendor updates order status** (accept/ready/complete)
2. **Calls** `onUpdateOrderStatus()` → `handleOrderStatusUpdate()` in App.tsx
3. **Updates** order status in `sharedOrders`
4. **Customer app** sees live status updates
5. **Result:** Bi-directional real-time updates

## 🔧 **API Integration Points**

### **Critical Integration Points (🔴 Priority)**

#### **Restaurant Management API**
```typescript
// File: /App.tsx - Lines 85-95
// TODO: Replace with real restaurant API call
static async getRestaurants(): Promise<Restaurant[]> {
  // Current: return mockRestaurants;
  // Replace with: return await api.get('/restaurants');
}

static async updateRestaurant(id: string, updates: Partial<Restaurant>): Promise<Restaurant> {
  // Current: console.log('🔄 [API Integration Point] Updating restaurant:', id, updates);
  // Replace with: return await api.put(`/restaurants/${id}`, updates);
}
```

#### **Order Management API**
```typescript
// File: /App.tsx - Lines 97-112
// TODO: Replace with real order creation API
static async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
  // Current: Mock implementation with local ID generation
  // Replace with: return await api.post('/orders', order);
}

static async updateOrderStatus(orderId: string, status: string, vendorId: string): Promise<Order> {
  // Current: console.log('🔄 [API Integration Point] Updating order status:', orderId, status);
  // Replace with: return await api.patch(`/orders/${orderId}`, { status });
}
```

#### **Menu Management API**
```typescript
// File: /App.tsx - Lines 114-120
// TODO: Replace with real menu update API
static async updateMenuItem(restaurantId: string, menuItem: MenuItem): Promise<MenuItem> {
  // Current: console.log('🔄 [API Integration Point] Updating menu item:', restaurantId, menuItem);
  // Replace with: return await api.put(`/restaurants/${restaurantId}/menu/${menuItem.id}`, menuItem);
}
```

### **Real-time Integration Points (🟡 Important)**

#### **WebSocket Integration**
```typescript
// File: /App.tsx - Lines 122-135
// TODO: Replace with WebSocket or Server-Sent Events
static subscribeToOrderUpdates(callback: (order: Order) => void) {
  // Current: console.log('🔄 [Real-time Integration Point] Subscribing to order updates');
  // Replace with: websocket.on('orderUpdate', callback);
}

static subscribeToMenuUpdates(callback: (restaurantId: string, menu: MenuItem[]) => void) {
  // Current: console.log('🔄 [Real-time Integration Point] Subscribing to menu updates');
  // Replace with: websocket.on('menuUpdate', callback);
}
```

## 📊 **Required API Endpoints**

### **Restaurant Endpoints**
```bash
GET    /api/restaurants              # Get all restaurants
GET    /api/restaurants/:id          # Get specific restaurant
PUT    /api/restaurants/:id          # Update restaurant info
PATCH  /api/restaurants/:id/status   # Toggle online/offline status
```

### **Menu Endpoints**
```bash
GET    /api/restaurants/:id/menu     # Get restaurant menu
POST   /api/restaurants/:id/menu     # Add menu item
PUT    /api/restaurants/:id/menu/:itemId    # Update menu item
DELETE /api/restaurants/:id/menu/:itemId    # Delete menu item
PATCH  /api/restaurants/:id/menu/:itemId/availability  # Toggle availability
```

### **Order Endpoints**
```bash
GET    /api/orders                   # Get all orders (filtered by user/vendor)
POST   /api/orders                   # Create new order
GET    /api/orders/:id               # Get specific order
PATCH  /api/orders/:id/status        # Update order status
```

### **User Endpoints**
```bash
GET    /api/users/profile            # Get user profile
PUT    /api/users/profile            # Update user profile
GET    /api/vendors/profile          # Get vendor profile
PUT    /api/vendors/profile          # Update vendor profile
```

## 🌐 **Real-time Events**

### **WebSocket Events Required**
```typescript
// Customer Events
websocket.on('orderStatusUpdate', (order: Order) => {
  // Update customer's order status in real-time
});

websocket.on('menuUpdate', (restaurantId: string, menu: MenuItem[]) => {
  // Update available menu items for customer
});

websocket.on('restaurantStatusUpdate', (restaurantId: string, isOnline: boolean) => {
  // Update restaurant availability status
});

// Vendor Events
websocket.on('newOrder', (order: Order) => {
  // Notify vendor of new incoming order
});

websocket.on('orderCancellation', (orderId: string) => {
  // Notify vendor if customer cancels order
});
```

## 🧪 **Testing the Data Flow**

### **Test Scenario 1: Vendor Menu Update → Customer View**
1. **Open app as Vendor**
2. **Go to Menu Management tab**
3. **Add new menu item** (e.g., "New Pasta Dish")
4. **Switch to Customer role** (App.tsx role selection)
5. **Browse restaurants**
6. **Expected Result:** New menu item appears immediately in customer app

### **Test Scenario 2: Customer Order → Vendor Dashboard**
1. **Open app as Customer**
2. **Browse restaurants and add items to cart**
3. **Place an order**
4. **Switch to Vendor role**
5. **Check Orders tab**
6. **Expected Result:** New order appears immediately in vendor dashboard

### **Test Scenario 3: Vendor Order Status → Customer Updates**
1. **With both scenarios above completed**
2. **As Vendor: Accept and update order status**
3. **Switch back to Customer**
4. **Check Orders tab → Order Details**
5. **Expected Result:** Order status updates reflect immediately

## 🔮 **Future Admin Interface**

### **Admin Integration Points**
The shared data architecture is ready for admin interface integration:

```typescript
// Admin will connect to the same SharedDataStore
interface AdminAppProps {
  // Same shared data props as customer/vendor
  sharedRestaurants: Restaurant[];
  sharedOrders: Order[];
  sharedUsers: User[];
  // Admin-specific handlers
  onManageRestaurant: (id: string, action: 'approve' | 'suspend') => void;
  onViewAnalytics: () => void;
  onManageUsers: (userId: string, action: string) => void;
}
```

### **Admin Capabilities**
- **View all restaurants** and their status
- **Manage user accounts** (customers and vendors)
- **Monitor order flow** across the platform
- **Generate platform-wide analytics**
- **Handle disputes** and customer service
- **Approve/suspend vendors**

## 🚀 **Implementation Checklist**

### **Phase 1: Basic API Integration**
- [ ] Replace `SharedDataService` mock functions with real API calls
- [ ] Implement authentication and user context
- [ ] Add error handling and loading states
- [ ] Test CRUD operations for restaurants, orders, menu items

### **Phase 2: Real-time Features**
- [ ] Implement WebSocket connections
- [ ] Add real-time order status updates
- [ ] Implement live menu synchronization
- [ ] Add restaurant online/offline status updates

### **Phase 3: Production Enhancements**
- [ ] Add comprehensive error handling
- [ ] Implement offline capability with sync
- [ ] Add data validation and sanitization
- [ ] Implement rate limiting and security measures

### **Phase 4: Admin Interface**
- [ ] Create admin interface connecting to shared data
- [ ] Implement admin-specific features
- [ ] Add platform analytics and reporting
- [ ] Implement user and vendor management

## 📝 **Development Notes**

### **Current Implementation Status**
✅ **Shared data store architecture** - Complete
✅ **Customer ↔ Vendor data flow** - Complete  
✅ **Mock data with realistic structure** - Complete
✅ **Clear API integration points** - Complete
✅ **Real-time update simulation** - Complete
✅ **Feature flag integration** - Complete

🔄 **Next Steps:**
1. **Replace mock API calls** with real backend integration
2. **Implement WebSocket connections** for real-time updates
3. **Add authentication context** for user/vendor identification
4. **Create admin interface** using same shared data patterns

### **Key Benefits of This Architecture**
- **Zero UI changes needed** for API integration
- **Clear separation** between UI and data logic
- **Easy testing** of data flows before backend is ready
- **Scalable** for additional features and admin interface
- **Future-proof** design with clear integration points

---

**This architecture enables immediate testing of vendor ↔ customer data flows while providing a clear path for API integration and admin interface development.**