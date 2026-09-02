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
    iconImage: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=200&q=80',
    subCategories: ['All', 'Milk & Cream', 'Butter & Cheese', 'Yogurt & Dahi', 'Eggs']
  },
  {
    id: 'bakery',
    name: 'Bakery',
    iconImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80',
    subCategories: ['All', 'Fresh Bread', 'Buns & Rolls', 'Cakes & Pastries', 'Cookies']
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
    iconImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=200&q=80',
    subCategories: ['All', 'Fresh Juices', 'Soft Drinks', 'Tea & Coffee', 'Energy Drinks']
  },
  {
    id: 'pantry',
    name: 'Pantry Staples',
    iconImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80',
    subCategories: ['All', 'Atta & Rice', 'Dal & Pulses', 'Oils & Ghee', 'Spices']
  },
  {
    id: 'meat',
    name: 'Meat & Seafood',
    iconImage: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=200&q=80',
    subCategories: ['All', 'Fresh Chicken', 'Mutton', 'Fish & Seafood']
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
  {
    id: 'p5',
    name: 'Fresh Blueberries',
    category: 'fruits',
    subCategory: 'Berries',
    price: 220,
    originalPrice: 320,
    weight: '125g Pack',
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 31,
    rating: 4.8,
    reviewsCount: 276,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Plump, sweet, and juicy handpicked blueberries bursting with flavour. Great Superfood topping for smoothies and yogurt.',
    shelfLife: '4-6 Days',
    origin: 'Chile',
    storage: 'Keep refrigerated at 2-4°C',
    nutrition: { calories: '84 kcal', carbs: '21g', protein: '1g', fat: '0.5g' }
  },
  {
    id: 'p6',
    name: 'Valencia Blood Oranges',
    category: 'fruits',
    subCategory: 'Citrus',
    price: 129,
    originalPrice: 180,
    weight: '1 kg Pack',
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 28,
    rating: 4.6,
    reviewsCount: 145,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Juicy, naturally sweet Valencia oranges full of vitamin C and immune-boosting antioxidants.',
    shelfLife: '7-10 Days',
    origin: 'Nagpur, Maharashtra',
    storage: 'Store in cool dry location',
    nutrition: { calories: '62 kcal', carbs: '15g', protein: '1.2g', fat: '0.2g' }
  },
  {
    id: 'p11',
    name: 'Organic Cavendish Bananas',
    category: 'fruits',
    subCategory: 'Organic',
    price: 49,
    originalPrice: 70,
    weight: '6 pcs (approx 800g)',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1543218024-57a70143c369?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 30,
    rating: 4.9,
    reviewsCount: 512,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Naturally ripened carbide-free Cavendish bananas. High in potassium and energy for workouts.',
    shelfLife: '3-4 Days',
    origin: 'Coimbatore, Tamil Nadu',
    storage: 'Keep at room temperature',
    nutrition: { calories: '105 kcal', carbs: '27g', protein: '1.3g', fat: '0.3g' }
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
    id: 'p8',
    name: 'Organic Baby Spinach',
    category: 'vegetables',
    subCategory: 'Leafy Greens',
    price: 45,
    originalPrice: 65,
    weight: '250g Pack',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 30,
    rating: 4.8,
    reviewsCount: 310,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Pre-washed, tender organic spinach leaves. Abundant source of iron, vitamin K, and essential minerals.',
    shelfLife: '3 Days',
    origin: 'Greenhouse Farms',
    storage: 'Refrigerate immediately',
    nutrition: { calories: '23 kcal', carbs: '3.6g', protein: '2.9g', fat: '0.4g' }
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
  {
    id: 'p9',
    name: 'Gourmet Greek Yogurt (Wild Berry)',
    category: 'dairy',
    subCategory: 'Yogurt & Dahi',
    price: 85,
    originalPrice: 110,
    weight: '150g Tub',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1571217865189-d9299d0e199d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 22,
    rating: 4.9,
    reviewsCount: 650,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Thick strained high-protein Greek yogurt blended with real berries. No artificial colours or preservatives.',
    shelfLife: '10 Days',
    origin: 'Fresh Artisan Creamery',
    storage: 'Refrigerate at 2-4°C',
    nutrition: { calories: '130 kcal', carbs: '14g', protein: '10g', fat: '3.5g' }
  },
  {
    id: 'p13',
    name: 'Organic Brown Eggs (Omega-3)',
    category: 'dairy',
    subCategory: 'Eggs',
    price: 95,
    originalPrice: 130,
    weight: '6 Eggs Pack',
    image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 26,
    rating: 4.9,
    reviewsCount: 940,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Free-range brown eggs enriched with natural Omega-3 fatty acids and vitamin E. Cleaned and sanitized.',
    shelfLife: '14 Days',
    origin: 'Organic Poultry Farms',
    storage: 'Keep refrigerated',
    nutrition: { calories: '72 kcal / egg', carbs: '0.4g', protein: '6.3g', fat: '5g' }
  },
  {
    id: 'p14',
    name: 'Artisanal Salted Yellow Butter',
    category: 'dairy',
    subCategory: 'Butter & Cheese',
    price: 115,
    originalPrice: 140,
    weight: '200g Block',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 18,
    rating: 4.8,
    reviewsCount: 430,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Rich, creamy butter churned from pure cow cream with a pinch of sea salt.',
    shelfLife: '6 Months',
    origin: 'Dairy Valley',
    storage: 'Refrigerate below 4°C',
    nutrition: { calories: '717 kcal', carbs: '0.1g', protein: '0.9g', fat: '81g' }
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
  {
    id: 'p15',
    name: 'Butter Croissants (Baked Daily)',
    category: 'bakery',
    subCategory: 'Buns & Rolls',
    price: 129,
    originalPrice: 170,
    weight: '2 pcs Pack',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 24,
    rating: 4.9,
    reviewsCount: 380,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Flaky, buttery French-style croissants baked fresh every morning. Crispy on the outside, soft inside.',
    shelfLife: '2 Days',
    origin: 'Artisan Bakehouse',
    storage: 'Keep cool or warm before eating',
    nutrition: { calories: '231 kcal', carbs: '26g', protein: '4.7g', fat: '12g' }
  },

  // SNACKS
  {
    id: 'p16',
    name: 'Roasted California Almonds',
    category: 'snacks',
    subCategory: 'Nuts & Seeds',
    price: 299,
    originalPrice: 420,
    weight: '250g Pouch',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80'
    ],
    discountPercentage: 28,
    rating: 4.8,
    reviewsCount: 710,
    inStock: true,
    deliveryTimeMinutes: 9,
    description: 'Crunchy, lightly salted jumbo California almonds. High in vitamin E, protein, and dietary fiber.',
    shelfLife: '6 Months',
    origin: 'USA / California',
    storage: 'Store in airtight container',
    nutrition: { calories: '579 kcal', carbs: '21g', protein: '21g', fat: '49g' }
  }
];
