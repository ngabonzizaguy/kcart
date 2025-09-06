// Simple placeholder data so we can design without a backend
// Replace with real API calls later.

window.KCART = window.KCART || {};

KCART.vendors = [
  {
    id: 'v_1',
    name: 'Sunset Sushi',
    distanceKm: 1.2,
    rating: 4.7,
    cover: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=256&auto=format&fit=crop',
    categories: ['Sushi', 'Japanese', 'Seafood']
  },
  {
    id: 'v_2',
    name: 'Pasta & Co.',
    distanceKm: 2.4,
    rating: 4.6,
    cover: 'https://images.unsplash.com/photo-1521389508051-d7ffb5dc8bbf?q=80&w=1200&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=256&auto=format&fit=crop',
    categories: ['Italian', 'Pasta']
  },
  {
    id: 'v_3',
    name: 'Green Bowl',
    distanceKm: 0.8,
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1524594154908-edd0acfa1f36?q=80&w=256&auto=format&fit=crop',
    categories: ['Healthy', 'Salads']
  }
];

KCART.menus = {
  v_1: [
    { id: 'm_11', title: 'Spicy Tuna Roll', price: 8.5, img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop' },
    { id: 'm_12', title: 'Salmon Nigiri', price: 12.0, img: 'https://images.unsplash.com/photo-1593032457865-7593fb0c0f5a?q=80&w=800&auto=format&fit=crop' }
  ],
  v_2: [
    { id: 'm_21', title: 'Pesto Tagliatelle', price: 10.0, img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop' },
    { id: 'm_22', title: 'Lasagna', price: 13.5, img: 'https://images.unsplash.com/photo-1604908554049-1d1939d6f7a1?q=80&w=800&auto=format&fit=crop' }
  ],
  v_3: [
    { id: 'm_31', title: 'Protein Bowl', price: 9.5, img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop' },
    { id: 'm_32', title: 'Avocado Salad', price: 7.0, img: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=800&auto=format&fit=crop' }
  ]
};

KCART.user = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com'
};

