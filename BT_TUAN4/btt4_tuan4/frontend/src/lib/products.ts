import { Product } from '@/types/ecommerce';
import headphones from '@/assets/headphones.jpg';
import smartwatch from '@/assets/smartwatch.jpg';
import sneakers from '@/assets/sneakers.jpg';
import camera from '@/assets/camera.jpg';
import backpack from '@/assets/backpack.jpg';
import keyboard from '@/assets/keyboard.jpg';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    image: headphones,
    category: 'Electronics',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    rating: 4.8,
    reviews: 245,
    inStock: true,
    tags: ['wireless', 'noise-canceling', 'premium'],
    views: 1240,
    isOnSale: true,
    discount: 25
  },
  {
    id: '2',
    name: 'Smart Watch Series X',
    price: 449.99,
    image: smartwatch,
    category: 'Electronics',
    description: 'Advanced smartwatch with health monitoring, GPS, and long battery life.',
    rating: 4.6,
    reviews: 189,
    inStock: true,
    tags: ['smartwatch', 'fitness', 'gps'],
    views: 890,
    isOnSale: false
  },
  {
    id: '3',
    name: 'Designer Sneakers',
    price: 159.99,
    originalPrice: 199.99,
    image: sneakers,
    category: 'Fashion',
    description: 'Comfortable and stylish sneakers perfect for everyday wear.',
    rating: 4.4,
    reviews: 312,
    inStock: true,
    tags: ['sneakers', 'comfortable', 'style'],
    views: 2100,
    isOnSale: true,
    discount: 20
  },
  {
    id: '4',
    name: 'Professional Camera',
    price: 1299.99,
    image: camera,
    category: 'Electronics',
    description: 'Professional DSLR camera with advanced features for photography enthusiasts.',
    rating: 4.9,
    reviews: 87,
    inStock: false,
    tags: ['camera', 'professional', 'photography'],
    views: 567,
    isOnSale: false
  },
  {
    id: '5',
    name: 'Luxury Backpack',
    price: 199.99,
    image: backpack,
    category: 'Fashion',
    description: 'Premium leather backpack with multiple compartments and elegant design.',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    tags: ['backpack', 'leather', 'luxury'],
    views: 734,
    isOnSale: false
  },
  {
    id: '6',
    name: 'Gaming Mechanical Keyboard',
    price: 129.99,
    originalPrice: 149.99,
    image: keyboard,
    category: 'Electronics',
    description: 'RGB mechanical keyboard with customizable keys and gaming features.',
    rating: 4.5,
    reviews: 203,
    inStock: true,
    tags: ['gaming', 'mechanical', 'rgb'],
    views: 987,
    isOnSale: true,
    discount: 13
  }
];

export const categories = [
  'All Categories',
  'Electronics',
  'Fashion',
  'Sports',
  'Home & Garden',
  'Books',
  'Beauty'
];

export const filterProducts = (products: Product[], searchTerm: string, filters: Partial<any>) => {
  let filtered = [...products];

  // Search functionality (fuzzy search simulation)
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      product.category.toLowerCase().includes(searchLower)
    );
  }

  // Category filter
  if (filters.category && filters.category !== 'All Categories') {
    filtered = filtered.filter(product => product.category === filters.category);
  }

  // Price range filter
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filtered = filtered.filter(product => product.price >= min && product.price <= max);
  }

  // Sale filter
  if (filters.onSale) {
    filtered = filtered.filter(product => product.isOnSale);
  }

  // In stock filter
  if (filters.inStock) {
    filtered = filtered.filter(product => product.inStock);
  }

  // Rating filter
  if (filters.minRating) {
    filtered = filtered.filter(product => product.rating >= filters.minRating);
  }

  // Sorting
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'views':
          aValue = a.views;
          bValue = b.views;
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filters.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return filters.sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }

  return filtered;
};