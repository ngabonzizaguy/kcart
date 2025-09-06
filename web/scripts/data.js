export const vendors = [
  { id: 'v1', name: "Mama's Kitchen", category: 'Food', rating: 4.8, delivery_time: '25-35 min', location: 'Downtown', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop' },
  { id: 'v2', name: 'Fresh Market', category: 'Grocery', rating: 4.6, delivery_time: '40-60 min', location: 'City Center', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&auto=format&fit=crop' }
];

export const orders = [
  { id: 'o1001', vendorId: 'v1', items: [ { name: 'Jollof Rice', qty: 2, price: 6.5 }, { name: 'Plantain', qty: 1, price: 2.0 } ], total: 15.0, status: 'delivered', created_at: '2025-08-18T10:15:00Z' },
  { id: 'o1002', vendorId: 'v2', items: [ { name: 'Bananas (6)', qty: 1, price: 3.0 } ], total: 3.0, status: 'preparing', created_at: '2025-08-19T08:30:00Z' }
];

export const menuItems = [
  { id: 'm1', name: 'Menu Item 1', desc: 'Delicious and fresh', price: 6.5 },
  { id: 'm2', name: 'Menu Item 2', desc: 'Crisp and tasty', price: 7.0 },
  { id: 'm3', name: 'Menu Item 3', desc: 'Chef special', price: 9.0 },
  { id: 'm4', name: 'Menu Item 4', desc: 'Customer favorite', price: 5.5 }
];
