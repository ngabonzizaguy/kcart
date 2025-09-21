import type { CartItem } from './types';
import type { FilterType } from './menuConstants';

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()} RWF`;
};

export const filterMenuItems = (
  items: any[], 
  filter: FilterType, 
  searchQuery: string, 
  language: 'en' | 'rw'
) => {
  return items.filter(item => {
    const matchesFilter = filter === 'all' || 
      (filter === 'popular' && item.isPopular) ||
      (filter === 'spicy' && item.isSpicy) ||
      (filter === 'vegetarian' && item.isVegetarian);
    
    const matchesSearch = searchQuery === '' || 
      item.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description[language].toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
};

export const getItemQuantityInCart = (itemId: string, cartItems: CartItem[], menuItems: any[], language: 'en' | 'rw'): number => {
  const cartItem = cartItems.find(item => item.name === menuItems.find(i => i.id === itemId)?.name[language]);
  return cartItem?.quantity || 0;
};

export const createCartItem = (item: any, vendor: any, language: 'en' | 'rw'): Omit<CartItem, 'id'> => {
  return {
    name: item.name[language],
    price: item.price,
    quantity: 1,
    image: item.image,
    vendorId: vendor.id,
    vendorName: vendor.name
  };
};