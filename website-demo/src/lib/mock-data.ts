// Mock data for the e-commerce application

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  lowStock?: boolean;
  deliveryEta: string;
  badges?: string[];
  size?: string;
  description?: string;
  nutrition?: string;
  ingredients?: string;
  discount?: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
}

export const categories: Category[] = [
  { id: 'grocery', name: 'Grocery', image: 'grocery store', count: 234 },
  { id: 'household', name: 'Household', image: 'cleaning supplies', count: 156 },
  { id: 'personal-care', name: 'Personal Care', image: 'personal care products', count: 189 },
  { id: 'beverages', name: 'Beverages', image: 'beverages drinks', count: 98 },
  { id: 'snacks', name: 'Snacks', image: 'snacks chips', count: 145 },
  { id: 'fresh-produce', name: 'Fresh Produce', image: 'fresh fruits vegetables', count: 267 },
  { id: 'dairy', name: 'Dairy & Eggs', image: 'dairy milk eggs', count: 87 },
  { id: 'frozen', name: 'Frozen Foods', image: 'frozen food', count: 123 },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Organic Whole Milk',
    category: 'dairy',
    price: 5.99,
    unit: '1 gallon',
    image: 'milk bottle',
    rating: 4.7,
    reviewCount: 1243,
    inStock: true,
    deliveryEta: 'Today 2-4pm',
    badges: ['Organic', 'Local'],
    description: 'Fresh organic whole milk from local farms. Rich, creamy taste.',
    nutrition: 'Per 1 cup serving: 150 calories, 8g fat, 12g carbs, 8g protein',
    ingredients: 'Organic whole milk, Vitamin D3',
  },
  {
    id: '2',
    name: 'Free Range Eggs',
    category: 'dairy',
    price: 6.49,
    unit: '12 count',
    image: 'eggs carton',
    rating: 4.8,
    reviewCount: 2156,
    inStock: true,
    deliveryEta: 'Today 2-4pm',
    badges: ['Free Range', 'Organic'],
    description: 'Large organic free-range eggs. Superior quality and taste.',
  },
  {
    id: '3',
    name: 'Artisan Sourdough Bread',
    category: 'grocery',
    price: 4.99,
    unit: '1 loaf',
    image: 'sourdough bread',
    rating: 4.9,
    reviewCount: 876,
    inStock: true,
    lowStock: true,
    deliveryEta: 'Today 2-4pm',
    badges: ['Bakery Fresh'],
    description: 'Hand-crafted sourdough with a perfect crust and airy interior.',
  },
  {
    id: '4',
    name: 'Organic Bananas',
    category: 'fresh-produce',
    price: 2.49,
    unit: 'per lb',
    image: 'bananas bunch',
    rating: 4.6,
    reviewCount: 3421,
    inStock: true,
    deliveryEta: 'Today 2-4pm',
    badges: ['Organic'],
    description: 'Fresh organic bananas. Perfect for snacking or smoothies.',
  },
  {
    id: '5',
    name: 'Avocados',
    category: 'fresh-produce',
    price: 7.99,
    unit: '4 count',
    image: 'avocados',
    rating: 4.5,
    reviewCount: 2134,
    inStock: true,
    deliveryEta: 'Tomorrow 8-10am',
    description: 'Ripe and ready to eat. Perfect for toast, salads, or guacamole.',
  },
  {
    id: '6',
    name: 'Greek Yogurt',
    category: 'dairy',
    price: 5.29,
    unit: '32 oz',
    image: 'yogurt container',
    rating: 4.7,
    reviewCount: 1567,
    inStock: true,
    deliveryEta: 'Today 2-4pm',
    badges: ['High Protein'],
    description: 'Thick and creamy Greek yogurt. 20g protein per serving.',
  },
  {
    id: '7',
    name: 'Organic Chicken Breast',
    category: 'grocery',
    price: 12.99,
    unit: '1.5 lbs',
    image: 'chicken breast',
    rating: 4.8,
    reviewCount: 987,
    inStock: true,
    deliveryEta: 'Today 2-4pm',
    badges: ['Organic', 'No Antibiotics'],
    description: 'Premium organic chicken breast. Hormone and antibiotic free.',
  },
  {
    id: '8',
    name: 'All-Purpose Cleaner',
    category: 'household',
    price: 8.99,
    unit: '32 fl oz',
    image: 'cleaning spray bottle',
    rating: 4.6,
    reviewCount: 1234,
    inStock: true,
    deliveryEta: 'Today 4-6pm',
    badges: ['Eco-Friendly'],
    description: 'Multi-surface cleaner with natural ingredients. Lemon scent.',
  },
  {
    id: '9',
    name: 'Paper Towels',
    category: 'household',
    price: 19.99,
    unit: '12 rolls',
    image: 'paper towels',
    rating: 4.7,
    reviewCount: 2345,
    inStock: true,
    deliveryEta: 'Today 4-6pm',
    description: 'Strong and absorbent paper towels. 2-ply thickness.',
  },
  {
    id: '10',
    name: 'Natural Shampoo',
    category: 'personal-care',
    price: 11.99,
    unit: '16 fl oz',
    image: 'shampoo bottle',
    rating: 4.5,
    reviewCount: 876,
    inStock: true,
    deliveryEta: 'Tomorrow 8-10am',
    badges: ['Sulfate Free', 'Vegan'],
    description: 'Gentle sulfate-free shampoo with botanical extracts.',
  },
  {
    id: '11',
    name: 'Sparkling Water',
    category: 'beverages',
    price: 5.99,
    unit: '12 pack',
    image: 'sparkling water cans',
    rating: 4.6,
    reviewCount: 1543,
    inStock: true,
    deliveryEta: 'Today 2-4pm',
    description: 'Refreshing sparkling water. Zero calories, naturally flavored.',
  },
  {
    id: '12',
    name: 'Organic Coffee Beans',
    category: 'beverages',
    price: 14.99,
    unit: '12 oz',
    image: 'coffee beans bag',
    rating: 4.9,
    reviewCount: 2987,
    inStock: true,
    deliveryEta: 'Today 2-4pm',
    badges: ['Organic', 'Fair Trade'],
    description: 'Single-origin organic coffee beans. Medium roast.',
  },
  {
    id: '13',
    name: 'Tortilla Chips',
    category: 'snacks',
    price: 3.99,
    unit: '13 oz',
    image: 'tortilla chips bag',
    rating: 4.7,
    reviewCount: 1876,
    inStock: true,
    deliveryEta: 'Today 2-4pm',
    badges: ['Gluten Free'],
    description: 'Crispy restaurant-style tortilla chips. Perfect for dipping.',
  },
  {
    id: '14',
    name: 'Mixed Nuts',
    category: 'snacks',
    price: 9.99,
    unit: '16 oz',
    image: 'mixed nuts',
    rating: 4.8,
    reviewCount: 1234,
    inStock: true,
    deliveryEta: 'Today 2-4pm',
    badges: ['No Salt Added'],
    description: 'Premium mix of almonds, cashews, and walnuts.',
  },
  {
    id: '15',
    name: 'Frozen Pizza',
    category: 'frozen',
    price: 7.99,
    unit: '1 pizza',
    image: 'frozen pizza',
    rating: 4.5,
    reviewCount: 2134,
    inStock: true,
    deliveryEta: 'Today 4-6pm',
    description: 'Wood-fired style frozen pizza. Ready in 15 minutes.',
  },
  {
    id: '16',
    name: 'Ice Cream',
    category: 'frozen',
    price: 6.99,
    unit: '1 pint',
    image: 'ice cream pint',
    rating: 4.9,
    reviewCount: 3421,
    inStock: true,
    lowStock: true,
    deliveryEta: 'Today 4-6pm',
    badges: ['Small Batch'],
    description: 'Artisan vanilla bean ice cream. Made with real vanilla.',
  },
];

export const promoDeals = [
  {
    id: 'd1',
    title: '20% Off Fresh Produce',
    description: 'Save on all organic fruits and vegetables',
    code: 'FRESH20',
    image: 'fresh produce market',
  },
  {
    id: 'd2',
    title: 'Free Delivery on Orders $35+',
    description: 'Get free same-day delivery',
    code: 'FREEDEL',
    image: 'delivery truck',
  },
];

export const frequentlyBoughtTogether = {
  '1': ['2', '3', '4'], // Milk + Eggs + Bread + Bananas
  '3': ['1', '2', '5'], // Bread + Milk + Eggs + Avocados
  '13': ['5', '14'], // Chips + Avocados + Nuts
};
