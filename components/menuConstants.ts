export const MENU_ITEMS_DATA = [
  {
    id: 'main-1',
    name: { en: 'Grilled Chicken Special', rw: 'Inkoko y\'Akalanga Idasanzwe' },
    description: { en: 'Tender grilled chicken with rice and vegetables', rw: 'Inkoko yoroshye y\'akalanga hamwe n\'umuceri n\'imboga' },
    price: 8500,
    image: "https://images.unsplash.com/photo-1682423187670-4817da9a1b23?w=400",
    isPopular: true,
    isSpicy: false,
    isVegetarian: false,
    ingredients: { en: 'Chicken, Rice, Mixed Vegetables, Spices', rw: 'Inkoko, Umuceri, Imboga, Ibihimbaza' },
    preparationTime: '15-20',
    calories: 420
  },
  {
    id: 'main-2',
    name: { en: 'Beef Steak Platter', rw: 'Inyama y\'Inka' },
    description: { en: 'Premium beef steak with mashed potatoes', rw: 'Inyama y\'inka nziza hamwe n\'ibirayi' },
    price: 12500,
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400",
    isPopular: true,
    isSpicy: false,
    isVegetarian: false,
    ingredients: { en: 'Beef, Potatoes, Butter, Herbs', rw: 'Inyama y\'inka, Ibirayi, Amavuta, Ibihimbaza' },
    preparationTime: '25-30',
    calories: 650
  },
  {
    id: 'main-3',
    name: { en: 'Spicy Fish Curry', rw: 'Amafi y\'Ubushinwa' },
    description: { en: 'Fresh fish in aromatic curry sauce with rice', rw: 'Amafi mu mafuta y\'ubushinwa hamwe n\'umuceri' },
    price: 9800,
    image: "https://images.unsplash.com/photo-1636381310569-b4084c665f66?w=400",
    isPopular: false,
    isSpicy: true,
    isVegetarian: false,
    ingredients: { en: 'Fish, Curry Spices, Coconut Milk, Rice', rw: 'Amafi, Ibihimbaza, Amata y\'coconut, Umuceri' },
    preparationTime: '20-25',
    calories: 380
  },
  {
    id: 'main-4',
    name: { en: 'Vegetarian Pasta Bowl', rw: 'Pasta y\'Imboga' },
    description: { en: 'Creamy pasta with seasonal vegetables and herbs', rw: 'Pasta y\'amavuta hamwe n\'imboga z\'igihe' },
    price: 7200,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    isPopular: false,
    isSpicy: false,
    isVegetarian: true,
    ingredients: { en: 'Pasta, Mixed Vegetables, Cream, Herbs', rw: 'Pasta, Imboga, Amavuta, Ibihimbaza' },
    preparationTime: '12-15',
    calories: 320
  },
  {
    id: 'main-5',
    name: { en: 'BBQ Pork Ribs', rw: 'Inyama y\'Ingurube' },
    description: { en: 'Smoky BBQ ribs with coleslaw and fries', rw: 'Inyama y\'ingurube hamwe n\'imboga na fries' },
    price: 11200,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
    isPopular: true,
    isSpicy: true,
    isVegetarian: false,
    ingredients: { en: 'Pork Ribs, BBQ Sauce, Coleslaw, Fries', rw: 'Inyama y\'ingurube, Sauce, Imboga, Fries' },
    preparationTime: '30-35',
    calories: 780
  },
  {
    id: 'main-6',
    name: { en: 'Mediterranean Salad Bowl', rw: 'Saladi ya Mediterranean' },
    description: { en: 'Fresh mixed greens with olives and feta cheese', rw: 'Imboga nshya hamwe n\'olives na cheese' },
    price: 6500,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
    isPopular: false,
    isSpicy: false,
    isVegetarian: true,
    ingredients: { en: 'Mixed Greens, Olives, Feta, Tomatoes', rw: 'Imboga, Olives, Cheese, Inyanya' },
    preparationTime: '8-10',
    calories: 220
  }
];

export const MENU_CATEGORY_CONTENT = {
  en: {
    search: 'Search dishes...',
    filters: 'Filters',
    all: 'All',
    popular: 'Popular',
    spicy: 'Spicy',
    vegetarian: 'Vegetarian',
    add: 'Add',
    mins: 'mins',
    cal: 'cal',
    ingredients: 'Ingredients',
    prepTime: 'Prep Time',
    items: 'items found',
    noResults: 'No dishes found',
    tryDifferent: 'Try adjusting your filters or search terms'
  },
  rw: {
    search: 'Shakisha ibiryo...',
    filters: 'Akayunguruzo',
    all: 'Byose',
    popular: 'Bizwi',
    spicy: 'Birakaze',
    vegetarian: 'Imboga gusa',
    add: 'Ongeraho',
    mins: 'iminota',
    cal: 'cal',
    ingredients: 'Ibikoresho',
    prepTime: 'Igihe',
    items: 'ibiryo byabonetse',
    noResults: 'Nta biryo byabonetse',
    tryDifferent: 'Gerageza guhindura akayunguruzo cyangwa ijambo ushakisha'
  }
};

export type FilterType = 'all' | 'popular' | 'spicy' | 'vegetarian';

export const FILTER_OPTIONS: FilterType[] = ['all', 'popular', 'spicy', 'vegetarian'];