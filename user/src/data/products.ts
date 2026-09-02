import type { Product, Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'fruits',
    name: 'Fruits',
    iconImage: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=200&q=80',
    subCategories: ['All', 'Citrus', 'Berries', 'Organic', 'Exotic', 'Apples & Pears']
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    iconImage: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=200&q=80',
    subCategories: ['All', 'Leafy Greens', 'Root Vegetables', 'Exotic Veggies', 'Organic']
  },
  {
    id: 'dairy',
    name: 'Dairy & Eggs',
    iconImage: '/cat_dairy.jpg',
    subCategories: ['All', 'Milk & Cream', 'Butter & Cheese', 'Yogurt & Dahi', 'Eggs']
  },
  {
    id: 'bakery',
    name: 'Bakery',
    iconImage: '/cat_bakery.jpg',
    subCategories: ['All', 'Fresh Bread', 'Buns & Rolls', 'Cakes & Pastries', 'Cookies']
  },
  {
    id: 'clothes',
    name: 'Clothing & Apparel',
    iconImage: '/cat_clothes.jpg',
    subCategories: ['All', "Men's Wear", "Women's Wear", 'Kidswear', 'Accessories']
  },
  {
    id: 'meat',
    name: 'Meat, Fish & Eggs',
    iconImage: '/cat_meat.jpg',
    subCategories: ['All', 'Fresh Chicken', 'Mutton & Lamb', 'Fish & Seafood', 'Fresh Eggs']
  },
  {
    id: 'snacks',
    name: 'Snacks',
    iconImage: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=200&q=80',
    subCategories: ['All', 'Chips & Nachos', 'Nuts & Seeds', 'Chocolates', 'Biscuits']
  },
  {
    id: 'beverages',
    name: 'Beverages',
    iconImage: '/cat_beverages.jpg',
    subCategories: ['All', 'Fresh Juices', 'Soft Drinks', 'Tea & Coffee', 'Energy Drinks']
  },
  {
    id: 'pantry',
    name: 'Pantry Staples',
    iconImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80',
    subCategories: ['All', 'Atta & Rice', 'Dal & Pulses', 'Oils & Ghee', 'Spices']
  }
];

export const PRODUCTS: Product[] = [
  // FRUITS
  {
    id: 'p1',
    name: 'Organic Shimla Apples',
    category: 'fruits',
    subCategory: 'Apples & Pears',
    price: 149,
    originalPrice: 210,
    weight: '4 pcs (approx 500g)',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 30,
    rating: 4.8,
    reviewsCount: 342,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Sweet, crisp, and fresh apples hand-picked directly from high-altitude orchards of Shimla. Rich in dietary fiber and antioxidants.',
    shelfLife: '5-7 Days',
    origin: 'Shimla, Himachal Pradesh',
    storage: 'Store in cool dry place or refrigerator',
    nutrition: { calories: '95 kcal', carbs: '25g', protein: '0.5g', fat: '0.3g' }
  },
  {
    id: 'p4',
    name: 'Hass Avocados (Imported)',
    category: 'fruits',
    subCategory: 'Exotic',
    price: 189,
    originalPrice: 260,
    weight: '2 pcs (approx 350g)',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1601039641847-7857b994d704?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 27,
    rating: 4.9,
    reviewsCount: 189,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Butter-smooth, rich Hass avocados loaded with healthy fats, potassium, and vitamins. Ideal for breakfast toast and salad bowls.',
    shelfLife: '3-5 Days',
    origin: 'New Zealand / Peru',
    storage: 'Ripen at room temp, refrigerate once soft',
    nutrition: { calories: '160 kcal', carbs: '8.5g', protein: '2g', fat: '15g' }
  },

  // VEGETABLES
  {
    id: 'p7',
    name: 'Hydroponic English Cucumber',
    category: 'vegetables',
    subCategory: 'Exotic Veggies',
    price: 39,
    originalPrice: 60,
    weight: '2 pcs (approx 400g)',
    image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 35,
    rating: 4.7,
    reviewsCount: 420,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Crisp, seedless hydroponic cucumbers grown pesticide-free in climate-controlled farms.',
    shelfLife: '4 Days',
    origin: 'Hydroponic Farm, Bengaluru',
    storage: 'Refrigerate in crisper drawer',
    nutrition: { calories: '16 kcal', carbs: '3.8g', protein: '0.7g', fat: '0.1g' }
  },
  {
    id: 'p12',
    name: 'Hybrid Vine Tomatoes',
    category: 'vegetables',
    subCategory: 'Root Vegetables',
    price: 32,
    originalPrice: 50,
    weight: '500g Pack',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1546470427-227c7369a658?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 36,
    rating: 4.7,
    reviewsCount: 680,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Firm, tangy red tomatoes packed with lycopene. Essential for soups, curries, and daily salads.',
    shelfLife: '5-7 Days',
    origin: 'Kolar Farms, Karnataka',
    storage: 'Store in cool ventilated place',
    nutrition: { calories: '22 kcal', carbs: '4.8g', protein: '1.1g', fat: '0.2g' }
  },

  // DAIRY & EGGS
  {
    id: 'p2',
    name: 'Farm Fresh A2 Cow Milk',
    category: 'dairy',
    subCategory: 'Milk & Cream',
    price: 66,
    originalPrice: 100,
    weight: '1 Litre Pouch',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 34,
    rating: 4.9,
    reviewsCount: 1205,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Pure, pasteurized A2 cow milk sourced from grass-fed indigenous Gir cows. Rich in calcium and digestible protein.',
    shelfLife: '2 Days from delivery',
    origin: 'Organic Dairy Estate',
    storage: 'Keep refrigerated below 4°C',
    nutrition: { calories: '150 kcal', carbs: '12g', protein: '8g', fat: '8g' }
  },

  // BAKERY
  {
    id: 'p3',
    name: 'Artisanal Whole Wheat Bread',
    category: 'bakery',
    subCategory: 'Fresh Bread',
    price: 48,
    originalPrice: 70,
    weight: '400g Pack',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 31,
    rating: 4.7,
    reviewsCount: 512,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Freshly baked whole wheat sourdough loaf made with zero maida and no added chemical preservatives.',
    shelfLife: '3-4 Days',
    origin: 'Fresh Valley Bakery',
    storage: 'Store in airtight box',
    nutrition: { calories: '120 kcal', carbs: '22g', protein: '4g', fat: '1.5g' }
  },

  // CLOTHING & APPAREL
  {
    id: 'c1',
    name: '100% Premium Cotton Casual Shirt',
    category: 'clothes',
    subCategory: "Men's Wear",
    price: 699,
    originalPrice: 1299,
    weight: 'Size L',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 46,
    rating: 4.8,
    reviewsCount: 290,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Soft, breathable 100% combed cotton shirt. Perfect for daily casual wear, office Fridays, and weekend outings.',
    shelfLife: 'Long Lasting Fabric',
    origin: 'Tirupur, Tamil Nadu',
    storage: 'Machine wash cold',
    nutrition: { calories: 'N/A', carbs: 'N/A', protein: 'N/A', fat: 'N/A' }
  },
  {
    id: 'c2',
    name: 'Cozy Soft Knit Crewneck Sweater',
    category: 'clothes',
    subCategory: "Women's Wear",
    price: 899,
    originalPrice: 1599,
    weight: 'Size M',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 44,
    rating: 4.9,
    reviewsCount: 380,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Ultra-warm, plush knitted crewneck sweater designed for elegant winter layering.',
    shelfLife: 'Durable Knit',
    origin: 'Ludhiana, Punjab',
    storage: 'Hand wash recommended',
    nutrition: { calories: 'N/A', carbs: 'N/A', protein: 'N/A', fat: 'N/A' }
  },
  {
    id: 'c3',
    name: 'Classic Slim Fit Denim Jeans',
    category: 'clothes',
    subCategory: "Men's Wear",
    price: 999,
    originalPrice: 1899,
    weight: 'Size 32',
    image: 'https://images.unsplash.com/photo-1542272604-780c36856842?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1542272604-780c36856842?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 47,
    rating: 4.7,
    reviewsCount: 510,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Stretchable premium indigo denim jeans with reinforced stitching and classic 5-pocket styling.',
    shelfLife: 'Heavy Duty Denim',
    origin: 'Ahmedabad, Gujarat',
    storage: 'Wash inside out',
    nutrition: { calories: 'N/A', carbs: 'N/A', protein: 'N/A', fat: 'N/A' }
  },

  // MEAT, FISH & EGGS
  {
    id: 'm1',
    name: 'Fresh Tender Chicken Curry Cut',
    category: 'meat',
    subCategory: 'Fresh Chicken',
    price: 189,
    originalPrice: 260,
    weight: '500g Pack (Skinless)',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 27,
    rating: 4.9,
    reviewsCount: 890,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Farm-fresh antibiotics-free tender chicken curry cut pieces. Cleaned, bone-in, and ready to cook.',
    shelfLife: 'Use within 24 hours',
    origin: 'Hygienic Poultry Farm',
    storage: 'Keep refrigerated below 4°C',
    nutrition: { calories: '165 kcal', carbs: '0g', protein: '20g', fat: '9g' }
  },
  {
    id: 'm2',
    name: 'Fresh Atlantic Salmon Fillets',
    category: 'meat',
    subCategory: 'Fish & Seafood',
    price: 499,
    originalPrice: 650,
    weight: '250g Skin-on',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 23,
    rating: 4.9,
    reviewsCount: 410,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Fresh Norwegian Atlantic salmon fillets packed with heart-healthy Omega-3 fatty acids and protein.',
    shelfLife: '2 Days from pack date',
    origin: 'Imported Norwegian Salmon',
    storage: 'Keep chilled below 2°C',
    nutrition: { calories: '208 kcal', carbs: '0g', protein: '22g', fat: '13g' }
  },
  {
    id: 'm3',
    name: 'Farm Fresh Organic Brown Eggs',
    category: 'meat',
    subCategory: 'Fresh Eggs',
    price: 89,
    originalPrice: 120,
    weight: '6 Eggs Carton',
    image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 26,
    rating: 4.8,
    reviewsCount: 950,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Free-range brown eggs laid by healthy, grain-fed hens. Cleaned, sanitized, and packed for fresh delivery.',
    shelfLife: '14 Days',
    origin: 'Organic Poultry Estate',
    storage: 'Store in refrigerator',
    nutrition: { calories: '72 kcal / egg', carbs: '0.4g', protein: '6.3g', fat: '5g' }
  }
];
