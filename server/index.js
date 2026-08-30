import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { reverseGeocodeServer, searchLocationServer } from './services/locationiq.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'CartCraze Real-Time Express API Backend Server',
    version: '1.0.0',
    endpoints: ['/api/products', '/api/orders', '/api/darkstores', '/api/locationiq/all-riders']
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==========================================
// SUPABASE CLIENT INITIALIZATION
// ==========================================
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://YOUR_SUPABASE_PROJECT.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'YOUR_SUPABASE_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================
// CENTRAL SHARED LIVE STATE IN MEMORY
// ==========================================

let darkstores = [
  {
    id: 'shop-auto',
    name: 'Fresh Valley Market',
    city: 'Bengaluru',
    lat: 12.9141,
    lon: 77.6411,
    status: 'ONLINE',
    dailyOrders: 3,
    revenue: 740,
    managerName: 'Demo Manager',
    managerPhone: '+91 98000 11111',
    uptimePercent: 100.0
  }
];

let products = [
  // FRUITS (10)
  { id: 'p1', shopId: 'shop-auto', name: 'Organic Shimla Apples', category: 'Fruits', price: 149, originalPrice: 210, weight: '4 pcs (approx 500g)', stockCount: 42, inStock: true, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80', barcode: '89012345001', shelfLocation: 'Aisle 1 - Bay B' },
  { id: 'p2', shopId: 'shop-auto', name: 'Fresh Cavendish Bananas', category: 'Fruits', price: 49, originalPrice: 70, weight: '6 pcs (approx 800g)', stockCount: 65, inStock: true, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=300&q=80', barcode: '89012345002', shelfLocation: 'Aisle 1 - Bay A' },
  { id: 'p3', shopId: 'shop-auto', name: 'Fresh Blueberries', category: 'Fruits', price: 220, originalPrice: 320, weight: '125g Pack', stockCount: 8, inStock: true, image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=300&q=80', barcode: '89012345003', shelfLocation: 'Chiller Unit #1' },
  { id: 'p4', shopId: 'shop-auto', name: 'Hass Avocados (Imported)', category: 'Fruits', price: 189, originalPrice: 260, weight: '2 pcs (approx 350g)', stockCount: 15, inStock: true, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300&q=80', barcode: '89012345004', shelfLocation: 'Aisle 1 - Bay C' },
  { id: 'p5', shopId: 'shop-auto', name: 'Premium Alphonso Mangoes', category: 'Fruits', price: 299, originalPrice: 399, weight: '2 pcs (approx 500g)', stockCount: 22, inStock: true, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=300&q=80', barcode: '89012345005', shelfLocation: 'Aisle 1 - Bay D' },
  { id: 'p6', shopId: 'shop-auto', name: 'Fresh Strawberries', category: 'Fruits', price: 120, originalPrice: 180, weight: '200g Pack', stockCount: 18, inStock: true, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=300&q=80', barcode: '89012345006', shelfLocation: 'Chiller Unit #1' },
  { id: 'p7', shopId: 'shop-auto', name: 'Seedless Black Grapes', category: 'Fruits', price: 110, originalPrice: 150, weight: '500g Pack', stockCount: 25, inStock: true, image: 'https://images.unsplash.com/photo-1537084642907-629340c7e09d?auto=format&fit=crop&w=300&q=80', barcode: '89012345007', shelfLocation: 'Aisle 1 - Bay A' },
  { id: 'p8', shopId: 'shop-auto', name: 'Ruby Pomegranate', category: 'Fruits', price: 160, originalPrice: 220, weight: '2 pcs (approx 400g)', stockCount: 30, inStock: true, image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=300&q=80', barcode: '89012345008', shelfLocation: 'Aisle 1 - Bay E' },
  { id: 'p9', shopId: 'shop-auto', name: 'Valencian Nagpur Oranges', category: 'Fruits', price: 89, originalPrice: 120, weight: '6 pcs (approx 1kg)', stockCount: 40, inStock: true, image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=300&q=80', barcode: '89012345009', shelfLocation: 'Aisle 1 - Bay B' },
  { id: 'p10', shopId: 'shop-auto', name: 'Green Kiwi (Imported)', category: 'Fruits', price: 99, originalPrice: 140, weight: '3 pcs Pack', stockCount: 0, inStock: false, image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=300&q=80', barcode: '89012345010', shelfLocation: 'Aisle 1 - Bay C' },

  // VEGETABLES (10)
  { id: 'p11', shopId: 'shop-auto', name: 'Organic Potato (Jyoti)', category: 'Vegetables', price: 38, originalPrice: 50, weight: '1kg Bag', stockCount: 150, inStock: true, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80', barcode: '89012345011', shelfLocation: 'Aisle 2 - Bay A' },
  { id: 'p12', shopId: 'shop-auto', name: 'Red Onion (Nasik)', category: 'Vegetables', price: 42, originalPrice: 60, weight: '1kg Bag', stockCount: 180, inStock: true, image: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=300&q=80', barcode: '89012345012', shelfLocation: 'Aisle 2 - Bay A' },
  { id: 'p13', shopId: 'shop-auto', name: 'Hybrid Tomato', category: 'Vegetables', price: 28, originalPrice: 40, weight: '500g Bag', stockCount: 95, inStock: true, image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=300&q=80', barcode: '89012345013', shelfLocation: 'Aisle 2 - Bay B' },
  { id: 'p14', shopId: 'shop-auto', name: 'Fresh Broccoli', category: 'Vegetables', price: 89, originalPrice: 130, weight: '1 pc (250g - 350g)', stockCount: 0, inStock: false, image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=300&q=80', barcode: '89012345014', shelfLocation: 'Aisle 2 - Bay C' },
  { id: 'p15', shopId: 'shop-auto', name: 'Fresh Spinach (Palak)', category: 'Vegetables', price: 19, originalPrice: 30, weight: '250g Bunch', stockCount: 50, inStock: true, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80', barcode: '89012345015', shelfLocation: 'Aisle 2 - Bay B' },
  { id: 'p16', shopId: 'shop-auto', name: 'Fresh Coriander (Dhania)', category: 'Vegetables', price: 12, originalPrice: 20, weight: '100g Bunch', stockCount: 75, inStock: true, image: 'https://images.unsplash.com/photo-1514944224142-d1870b4553da?auto=format&fit=crop&w=300&q=80', barcode: '89012345016', shelfLocation: 'Aisle 2 - Bay B' },
  { id: 'p17', shopId: 'shop-auto', name: 'Fresh Lemon (Nimbu)', category: 'Vegetables', price: 20, originalPrice: 30, weight: '4 pcs', stockCount: 110, inStock: true, image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=300&q=80', barcode: '89012345017', shelfLocation: 'Aisle 2 - Bay C' },
  { id: 'p18', shopId: 'shop-auto', name: 'Green Capsicum', category: 'Vegetables', price: 35, originalPrice: 50, weight: '250g Pack', stockCount: 45, inStock: true, image: 'https://images.unsplash.com/photo-1563565312-3b2d137356ca?auto=format&fit=crop&w=300&q=80', barcode: '89012345018', shelfLocation: 'Aisle 2 - Bay C' },
  { id: 'p19', shopId: 'shop-auto', name: 'Orange Carrot (Ooty)', category: 'Vegetables', price: 49, originalPrice: 70, weight: '500g Pack', stockCount: 60, inStock: true, image: 'https://images.unsplash.com/photo-1598170845058-32b996a6bd41?auto=format&fit=crop&w=300&q=80', barcode: '89012345019', shelfLocation: 'Aisle 2 - Bay A' },
  { id: 'p20', shopId: 'shop-auto', name: 'English Cucumber', category: 'Vegetables', price: 30, originalPrice: 45, weight: '500g Pack', stockCount: 55, inStock: true, image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=300&q=80', barcode: '89012345020', shelfLocation: 'Aisle 2 - Bay B' },

  // DAIRY & EGGS (8)
  { id: 'p21', shopId: 'shop-auto', name: 'Farm Fresh A2 Cow Milk', category: 'Dairy & Eggs', price: 66, originalPrice: 100, weight: '1 Litre Pouch', stockCount: 88, inStock: true, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80', barcode: '89012345021', shelfLocation: 'Chiller Unit #2' },
  { id: 'p22', shopId: 'shop-auto', name: 'Table Eggs (White)', category: 'Dairy & Eggs', price: 55, originalPrice: 75, weight: '6 pcs Pack', stockCount: 120, inStock: true, image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=300&q=80', barcode: '89012345022', shelfLocation: 'Chiller Unit #3' },
  { id: 'p23', shopId: 'shop-auto', name: 'Amul Salted Butter', category: 'Dairy & Eggs', price: 105, originalPrice: 110, weight: '100g Carton', stockCount: 40, inStock: true, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=300&q=80', barcode: '89012345023', shelfLocation: 'Chiller Unit #2' },
  { id: 'p24', shopId: 'shop-auto', name: 'Processed Cheese Slices', category: 'Dairy & Eggs', price: 135, originalPrice: 150, weight: '100g Pack (5 Slices)', stockCount: 30, inStock: true, image: 'https://images.unsplash.com/photo-1528256446066-2bfb3777d566?auto=format&fit=crop&w=300&q=80', barcode: '89012345024', shelfLocation: 'Chiller Unit #2' },
  { id: 'p25', shopId: 'shop-auto', name: 'Nestle Actiplus Dahi', category: 'Dairy & Eggs', price: 35, originalPrice: 45, weight: '400g Cup', stockCount: 65, inStock: true, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80', barcode: '89012345025', shelfLocation: 'Chiller Unit #3' },
  { id: 'p26', shopId: 'shop-auto', name: 'Organic Cow Ghee', category: 'Dairy & Eggs', price: 650, originalPrice: 750, weight: '500ml Tin', stockCount: 20, inStock: true, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=300&q=80', barcode: '89012345026', shelfLocation: 'Aisle 3 - Bay A' },
  { id: 'p27', shopId: 'shop-auto', name: 'Fresh Paneer Block', category: 'Dairy & Eggs', price: 89, originalPrice: 110, weight: '200g Pack', stockCount: 50, inStock: true, image: 'https://images.unsplash.com/photo-1528256446066-2bfb3777d566?auto=format&fit=crop&w=300&q=80', barcode: '89012345027', shelfLocation: 'Chiller Unit #2' },
  { id: 'p28', shopId: 'shop-auto', name: 'Fresh Amul Thick Cream', category: 'Dairy & Eggs', price: 60, originalPrice: 70, weight: '250ml Pack', stockCount: 35, inStock: true, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80', barcode: '89012345028', shelfLocation: 'Chiller Unit #3' },

  // BAKERY (6)
  { id: 'p29', shopId: 'shop-auto', name: 'Artisanal Whole Wheat Bread', category: 'Bakery', price: 48, originalPrice: 70, weight: '400g Pack', stockCount: 19, inStock: true, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80', barcode: '89012345029', shelfLocation: 'Bakery Rack A' },
  { id: 'p30', shopId: 'shop-auto', name: 'Whole Wheat Burger Buns', category: 'Bakery', price: 30, originalPrice: 40, weight: '2 pcs Pack', stockCount: 0, inStock: false, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80', barcode: '89012345030', shelfLocation: 'Bakery Rack A' },
  { id: 'p31', shopId: 'shop-auto', name: 'Premium Chocolate Fudge Cake', category: 'Bakery', price: 349, originalPrice: 499, weight: '500g Box', stockCount: 10, inStock: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80', barcode: '89012345031', shelfLocation: 'Chiller Unit #4' },
  { id: 'p32', shopId: 'shop-auto', name: 'Choco Chip Butter Cookies', category: 'Bakery', price: 79, originalPrice: 110, weight: '150g Box', stockCount: 24, inStock: true, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&q=80', barcode: '89012345032', shelfLocation: 'Bakery Rack B' },
  { id: 'p33', shopId: 'shop-auto', name: 'Crispy Whole Wheat Rusk', category: 'Bakery', price: 45, originalPrice: 60, weight: '300g Pack', stockCount: 30, inStock: true, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80', barcode: '89012345033', shelfLocation: 'Bakery Rack B' },
  { id: 'p34', shopId: 'shop-auto', name: 'Butter Garlic Bread', category: 'Bakery', price: 59, originalPrice: 80, weight: '150g Pack', stockCount: 15, inStock: true, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&q=80', barcode: '89012345034', shelfLocation: 'Bakery Rack A' },

  // SNACKS (6)
  { id: 'p35', shopId: 'shop-auto', name: 'Classic Salted Potato Chips', category: 'Snacks', price: 20, originalPrice: 20, weight: '50g Pack', stockCount: 150, inStock: true, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=300&q=80', barcode: '89012345035', shelfLocation: 'Aisle 3 - Bay C' },
  { id: 'p36', shopId: 'shop-auto', name: 'Cheese Nacho Crisps', category: 'Snacks', price: 45, originalPrice: 60, weight: '150g Pack', stockCount: 80, inStock: true, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=300&q=80', barcode: '89012345036', shelfLocation: 'Aisle 3 - Bay C' },
  { id: 'p37', shopId: 'shop-auto', name: 'Roasted & Salted Cashews', category: 'Snacks', price: 189, originalPrice: 250, weight: '100g Pack', stockCount: 40, inStock: true, image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?auto=format&fit=crop&w=300&q=80', barcode: '89012345037', shelfLocation: 'Aisle 3 - Bay B' },
  { id: 'p38', shopId: 'shop-auto', name: 'Dark Hazelnut Chocolate', category: 'Snacks', price: 99, originalPrice: 150, weight: '80g Bar', stockCount: 60, inStock: true, image: 'https://images.unsplash.com/photo-1549007994-cb92ca817bc7?auto=format&fit=crop&w=300&q=80', barcode: '89012345038', shelfLocation: 'Chiller Unit #4' },
  { id: 'p39', shopId: 'shop-auto', name: 'Crispy Oats Biscuits', category: 'Snacks', price: 50, originalPrice: 70, weight: '200g Pack', stockCount: 0, inStock: false, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=300&q=80', barcode: '89012345039', shelfLocation: 'Aisle 3 - Bay D' },
  { id: 'p40', shopId: 'shop-auto', name: 'Roasted California Almonds', category: 'Snacks', price: 169, originalPrice: 220, weight: '100g Pack', stockCount: 35, inStock: true, image: 'https://images.unsplash.com/photo-1508061461508-cb18c242f556?auto=format&fit=crop&w=300&q=80', barcode: '89012345040', shelfLocation: 'Aisle 3 - Bay B' },

  // BEVERAGES (6)
  { id: 'p41', shopId: 'shop-auto', name: '100% Pure Orange Juice', category: 'Beverages', price: 99, originalPrice: 120, weight: '1 Litre Carton', stockCount: 45, inStock: true, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=300&q=80', barcode: '89012345041', shelfLocation: 'Chiller Unit #5' },
  { id: 'p42', shopId: 'shop-auto', name: 'Fresh Tender Coconut Water', category: 'Beverages', price: 45, originalPrice: 55, weight: '200ml Tetra', stockCount: 110, inStock: true, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80', barcode: '89012345042', shelfLocation: 'Chiller Unit #5' },
  { id: 'p43', shopId: 'shop-auto', name: 'Diet Cola Zero Sugar', category: 'Beverages', price: 40, originalPrice: 40, weight: '300ml Can', stockCount: 90, inStock: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80', barcode: '89012345043', shelfLocation: 'Chiller Unit #5' },
  { id: 'p44', shopId: 'shop-auto', name: 'Organic Green Tea (Lemon)', category: 'Beverages', price: 145, originalPrice: 180, weight: '25 Tea Bags Box', stockCount: 30, inStock: true, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=300&q=80', barcode: '89012345044', shelfLocation: 'Aisle 3 - Bay A' },
  { id: 'p45', shopId: 'shop-auto', name: 'Ready-to-Drink Cold Brew Espresso', category: 'Beverages', price: 79, originalPrice: 110, weight: '250ml Can', stockCount: 28, inStock: true, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80', barcode: '89012345045', shelfLocation: 'Chiller Unit #5' },
  { id: 'p46', shopId: 'shop-auto', name: 'Monster Energy Ultra', category: 'Beverages', price: 120, originalPrice: 120, weight: '350ml Can', stockCount: 0, inStock: false, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80', barcode: '89012345046', shelfLocation: 'Chiller Unit #5' },

  // PANTRY STAPLES (4)
  { id: 'p47', shopId: 'shop-auto', name: 'Super Premium Basmati Rice', category: 'Pantry Staples', price: 149, originalPrice: 199, weight: '1kg Bag', stockCount: 80, inStock: true, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', barcode: '89012345047', shelfLocation: 'Aisle 4 - Bay A' },
  { id: 'p48', shopId: 'shop-auto', name: 'Premium Chakki Atta', category: 'Pantry Staples', price: 230, originalPrice: 280, weight: '5kg Bag', stockCount: 65, inStock: true, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', barcode: '89012345048', shelfLocation: 'Aisle 4 - Bay B' },
  { id: 'p49', shopId: 'shop-auto', name: 'Polished Toor Dal', category: 'Pantry Staples', price: 135, originalPrice: 175, weight: '1kg Bag', stockCount: 45, inStock: true, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', barcode: '89012345049', shelfLocation: 'Aisle 4 - Bay A' },
  { id: 'p50', shopId: 'shop-auto', name: 'Cold Pressed Sunflower Oil', category: 'Pantry Staples', price: 185, originalPrice: 240, weight: '1 Litre Bottle', stockCount: 55, inStock: true, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80', barcode: '89012345050', shelfLocation: 'Aisle 4 - Bay B' }
];

let orders = [];

let securityLogs = [];

let platformSettings = {
  commissionRatePercent: 5.5,
  deliveryFeeThreshold: 199,
  platformFee: 5,
  fraudProtectionStrictness: 'STRICT_MAX',
  maintenanceMode: false
};

// ==========================================
// REST API ROUTES
// ==========================================

// 0. Supabase Status Route
app.get('/api/supabase/status', (req, res) => {
  res.json({
    status: 'ONLINE',
    provider: 'Supabase Real-Time Cloud Database',
    url: SUPABASE_URL,
    connected: true
  });
});

// 1. Darkstore APIs
app.get('/api/darkstores', (req, res) => {
  res.json(darkstores);
});

app.patch('/api/darkstores/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  darkstores = darkstores.map((d) => (d.id === id ? { ...d, status } : d));
  res.json({ success: true, darkstores });
});

// 2. Inventory / Product APIs
app.get('/api/products', (req, res) => {
  const { shopId } = req.query;
  if (shopId) {
    return res.json(products.filter(p => p.shopId === shopId));
  }
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const { id, shopId, name, description, price, originalPrice, category, weight, stockCount, inStock, image, images, barcode, shelfLocation } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Product name and price are required' });
  }
  const newProduct = {
    id: id || `p-${Date.now()}`,
    shopId: shopId || 'shop-ds14',
    name,
    description: description || name,
    category: category || 'General',
    price: parseFloat(price),
    originalPrice: parseFloat(originalPrice) || parseFloat(price) * 1.3,
    weight: weight || '1 unit',
    stockCount: parseInt(stockCount) || 50,
    inStock: inStock !== undefined ? inStock : true,
    image: image || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80',
    images: Array.isArray(images) && images.length > 0 ? images : [
      image || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80'
    ],
    barcode: barcode || `8901234${Math.floor(1000 + Math.random() * 9000)}`,
    shelfLocation: shelfLocation || 'Aisle 2'
  };
  products.unshift(newProduct);
  res.json({ success: true, product: newProduct });
});

app.patch('/api/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.map((p) => (p.id === id ? { ...p, ...req.body } : p));
  res.json({ success: true, products });
});

// 3. Order APIs
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

  // Dynamically resolve nearest approved store for this order
  const customerLat = parseFloat(req.body.customerLat) || 12.9141;
  const customerLon = parseFloat(req.body.customerLon) || 77.6411;
  const approvedShops = registeredShops.filter(s => s.status === 'APPROVED');
  let nearestShop = approvedShops[0] || { name: 'CartCraze Darkstore', address: 'Bengaluru', lat: 12.9141, lon: 77.6411 };
  let minDist = Infinity;
  for (const shop of approvedShops) {
    const d = getHaversineDistanceKm(customerLat, customerLon, shop.lat, shop.lon);
    if (d < minDist) { minDist = d; nearestShop = shop; }
  }

  const newOrder = {
    id: 'QM-' + Math.floor(100000 + Math.random() * 900000),
    orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'NEW',
    otp: generatedOtp,
    darkstoreName: nearestShop.name,
    darkstoreAddress: nearestShop.address,
    darkstoreLat: nearestShop.lat,
    darkstoreLon: nearestShop.lon,
    paymentMethod: req.body.paymentMethod || 'UPI',
    paymentStatus: req.body.paymentMethod === 'COD' ? 'UNPAID' : 'PAID',
    ...req.body
  };
  orders.unshift(newOrder);

  securityLogs.unshift({
    id: 'SEC-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    eventType: 'LIVE_ORDER_PLACED',
    ipAddress: req.ip || '127.0.0.1',
    location: 'User App',
    severity: 'INFO',
    details: `Order ${newOrder.id} placed by ${newOrder.customerName || 'Customer'} — Total ₹${newOrder.finalTotal} — Fulfilled by ${nearestShop.name}`
  });

  res.json({ success: true, order: newOrder });
});

const updateOrderStatusHandler = (req, res) => {
  let id = req.params.id;
  if (id.endsWith('/status')) {
    id = id.replace('/status', '');
  }
  const newStatus = req.body.status || 'DELIVERED';
  let updatedOrder = null;

  orders = orders.map((o) => {
    if (o.id === id || o.id === req.params.id) {
      updatedOrder = { ...o, ...req.body, status: newStatus };
      return updatedOrder;
    }
    return o;
  });

  console.log(`[Order API] Order ${id} status updated to: ${newStatus}`);

  securityLogs.unshift({
    id: 'SEC-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    eventType: 'ORDER_STATUS_CHANGED',
    ipAddress: req.ip || '127.0.0.1',
    location: 'Order Status API',
    severity: 'INFO',
    details: `Order ${id} status set to ${newStatus}`
  });

  return res.json({ success: true, status: newStatus, order: updatedOrder, orders });
};

app.patch('/api/orders/:id', updateOrderStatusHandler);
app.patch('/api/orders/:id/status', updateOrderStatusHandler);

// 4. Security & Admin API
app.get('/api/security-logs', (req, res) => {
  res.json(securityLogs);
});

app.post('/api/security-logs', (req, res) => {
  const newLog = {
    id: 'SEC-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ...req.body
  };
  securityLogs.unshift(newLog);
  res.json({ success: true, log: newLog });
});

app.get('/api/admin/metrics', (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.finalTotal || 0), 0);
  const totalOrdersCount = orders.length;

  res.json({
    totalRevenue,
    totalOrdersCount,
    activeDarkstores: darkstores.filter((d) => d.status === 'ONLINE').length,
    totalDarkstores: darkstores.length,
    systemUptime: '99.98%',
    platformSettings,
    supabaseStatus: 'CONNECTED'
  });
});

app.post('/api/admin/settings', (req, res) => {
  platformSettings = { ...platformSettings, ...req.body };

  securityLogs.unshift({
    id: 'SEC-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    eventType: 'PLATFORM_SETTINGS_MUTATED',
    ipAddress: req.ip || '127.0.0.1',
    location: 'Super Admin Console (Port 4040)',
    severity: 'WARNING',
    details: `Commission set to ${platformSettings.commissionRatePercent}%, Min Free Delivery threshold ₹${platformSettings.deliveryFeeThreshold}`
  });

  res.json({ success: true, platformSettings });
});

// ─── RAZORPAY PAYMENT GATEWAY ENDPOINTS ───────────────────────────────────────
app.post('/api/razorpay/create-order', (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}` } = req.body;
    
    // Convert INR to Paise (Razorpay unit: 1 INR = 100 paise)
    const amountInPaise = Math.round((parseFloat(amount) || 100) * 100);
    const razorpayOrderId = `order_rzp_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;

    const orderPayload = {
      id: razorpayOrderId,
      entity: 'order',
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency,
      receipt,
      status: 'created',
      attempts: 0,
      created_at: Math.floor(Date.now() / 1000)
    };

    console.log(`[Razorpay Server] Created Order ID: ${razorpayOrderId} for ₹${amount}`);

    return res.status(200).json({
      success: true,
      order: orderPayload,
      key: process.env.RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID'
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/razorpay/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log(`[Razorpay Server] Payment Verified: Order=${razorpay_order_id}, Payment=${razorpay_payment_id}`);

    return res.status(200).json({
      success: true,
      message: 'Razorpay payment signature verified successfully',
      paymentId: razorpay_payment_id || `pay_rzp_${Date.now()}`,
      orderId: razorpay_order_id
    });
  } catch (error) {
    console.error('Razorpay Payment Verification Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Live rider locations — populated only by real rider GPS pushes
let liveRiderLocations = {};

// LocationIQ Reverse Geocoding API
app.get('/api/locationiq/reverse', async (req, res) => {
  const lat = parseFloat(req.query.lat) || 12.9141;
  const lon = parseFloat(req.query.lon) || 77.6411;
  const result = await reverseGeocodeServer(lat, lon);
  res.json(result);
});

// LocationIQ Address Search API
app.get('/api/locationiq/search', async (req, res) => {
  const query = req.query.q || 'HSR Layout Bengaluru';
  const result = await searchLocationServer(query);
  res.json(result);
});

// Live LocationIQ Rider GPS Update API
app.post('/api/locationiq/update-rider-location', (req, res) => {
  const { 
    riderId = 'rider-001', 
    riderName = 'Alex Mercer', 
    phone, 
    vehicleNumber, 
    lat, 
    lon, 
    heading = 0, 
    speed = 30, 
    battery = 90, 
    status = 'EN_ROUTE', 
    orderId = 'QM-849201',
    customerLat = 12.9250,
    customerLon = 77.6500,
    darkstoreLat = 12.9100,
    darkstoreLon = 77.6400
  } = req.body;

  if (lat === undefined || lon === undefined) {
    return res.status(400).json({ error: 'lat and lon are required' });
  }

  const currentLat = parseFloat(lat);
  const currentLon = parseFloat(lon);
  const destLat = parseFloat(customerLat);
  const destLon = parseFloat(customerLon);

  const distanceRemainingKm = getHaversineDistanceKm(currentLat, currentLon, destLat, destLon);
  const etaMinutes = Math.max(1, Math.round((distanceRemainingKm / (parseFloat(speed) || 30)) * 60));

  const updatedLocation = {
    riderId,
    riderName,
    phone: phone || liveRiderLocations[riderId]?.phone || '+91 98765 11111',
    vehicleNumber: vehicleNumber || liveRiderLocations[riderId]?.vehicleNumber || 'KA-05-EV-4829',
    lat: currentLat,
    lon: currentLon,
    heading: parseFloat(heading) || 0,
    speed: parseFloat(speed) || 0,
    battery: parseInt(battery) || 85,
    lastUpdated: new Date().toISOString(),
    status,
    orderId,
    darkstoreLat: parseFloat(darkstoreLat),
    darkstoreLon: parseFloat(darkstoreLon),
    customerLat: destLat,
    customerLon: destLon,
    distanceRemainingKm: parseFloat(distanceRemainingKm.toFixed(2)),
    etaMinutes
  };

  liveRiderLocations[riderId] = updatedLocation;

  res.json({ success: true, location: updatedLocation });
});

// Get Live LocationIQ Rider Locations API
app.get('/api/locationiq/live-riders', (req, res) => {
  res.json({ success: true, riders: Object.values(liveRiderLocations) });
});

// Get Location by Order ID
app.get('/api/locationiq/order-location/:orderId', (req, res) => {
  const { orderId } = req.params;
  const match = Object.values(liveRiderLocations).find(r => r.orderId === orderId) || liveRiderLocations['rider-001'];
  res.json({ success: true, location: match });
});

// Simulate Step Movement API for Automated Demos
app.post('/api/locationiq/simulate-movement', (req, res) => {
  const { riderId = 'rider-001', stepPercent = 5 } = req.body;
  const rider = liveRiderLocations[riderId] || liveRiderLocations['rider-001'];
  if (!rider) return res.status(404).json({ error: 'Rider not found' });

  // Move towards customerLat/customerLon
  const dLat = (rider.customerLat - rider.darkstoreLat) * (stepPercent / 100);
  const dLon = (rider.customerLon - rider.darkstoreLon) * (stepPercent / 100);

  rider.lat = parseFloat((rider.lat + dLat).toFixed(4));
  rider.lon = parseFloat((rider.lon + dLon).toFixed(4));
  rider.speed = Math.floor(25 + Math.random() * 15);
  rider.lastUpdated = new Date().toISOString();

  // If reached destination, reset to start or toggle status
  const dist = getHaversineDistanceKm(rider.lat, rider.lon, rider.customerLat, rider.customerLon);
  if (dist < 0.1) {
    rider.lat = rider.darkstoreLat;
    rider.lon = rider.darkstoreLon;
    rider.status = 'PICKUP';
  } else {
    rider.status = 'EN_ROUTE';
  }

  rider.distanceRemainingKm = parseFloat(dist.toFixed(2));
  rider.etaMinutes = Math.max(1, Math.round((dist / rider.speed) * 60));

  res.json({ success: true, location: rider });
});

// Haversine Distance Formula
function getHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// In-Memory Partner & Product Storage
let registeredShops = [
  {
    id: 'shop-auto',
    name: 'Fresh Valley Market',
    email: 'hsr@cartcrazepartner.app',
    phone: '+91 98000 11111',
    address: 'Sector 1, HSR Layout, Bengaluru',
    lat: 12.9141,
    lon: 77.6411,
    licenseType: 'Trade License',
    licenseNumber: 'TL-BLR-HSR-001',
    status: 'APPROVED',
    createdAt: new Date().toISOString()
  }
];

let registeredRiders = [];

// ==========================================
// USER ACCOUNT & LOCATION TELEMETRY APIS
// ==========================================
let registeredUsers = [
  {
    id: 'usr-001',
    name: 'Amiya Sahoo',
    email: 'amiyasahoo392@gmail.com',
    phone: '+91 98765 43210',
    address: 'Sector 1, HSR Layout, Bengaluru',
    lat: 12.9141,
    lon: 77.6411,
    ordersPlaced: 5,
    totalSpent: 1240,
    status: 'ACTIVE',
    riskScore: 2,
    source: 'LOGIN',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'usr-002',
    name: 'Rahul Sharma',
    email: 'rahul.s@gmail.com',
    phone: '+91 98123 45678',
    address: '27th Main Rd, HSR Layout, Bengaluru',
    lat: 12.9200,
    lon: 77.6450,
    ordersPlaced: 2,
    totalSpent: 480,
    status: 'ACTIVE',
    riskScore: 5,
    source: 'CHECKOUT',
    lastUpdated: new Date().toISOString()
  }
];

// GET /api/users - Get all registered customer users
app.get('/api/users', (req, res) => {
  res.json({ success: true, users: registeredUsers });
});

// POST /api/users/update-location - Store login GPS & checkout location
app.post('/api/users/update-location', (req, res) => {
  const { userId, name, email, phone, address, lat, lon, source = 'LOGIN' } = req.body;
  if (lat === undefined || lon === undefined) {
    return res.status(400).json({ error: 'lat and lon are required' });
  }

  const currentLat = parseFloat(lat);
  const currentLon = parseFloat(lon);

  let user = registeredUsers.find(
    (u) => (userId && u.id === userId) || (phone && u.phone === phone) || (email && u.email === email)
  );

  if (!user) {
    user = {
      id: userId || `usr-${Date.now()}`,
      name: name || 'Customer User',
      email: email || 'user@cartcraze.com',
      phone: phone || '+91 98000 00000',
      address: address || 'Sector 1, HSR Layout, Bengaluru',
      lat: currentLat,
      lon: currentLon,
      ordersPlaced: source === 'CHECKOUT' ? 1 : 0,
      totalSpent: 0,
      status: 'ACTIVE',
      riskScore: 2,
      source,
      lastUpdated: new Date().toISOString()
    };
    registeredUsers.push(user);
  } else {
    user.lat = currentLat;
    user.lon = currentLon;
    if (address) user.address = address;
    if (name) user.name = name;
    user.source = source;
    user.lastUpdated = new Date().toISOString();
    if (source === 'CHECKOUT') {
      user.ordersPlaced += 1;
    }
  }

  console.log(`[User Location Sync] ${user.name} (${source}): ${currentLat}, ${currentLon}`);
  res.json({ success: true, user });
});

// POST /api/users/register - Register new customer account
app.post('/api/users/register', (req, res) => {
  const { name, email, phone } = req.body;
  let user = registeredUsers.find((u) => (email && u.email === email) || (phone && u.phone === phone));
  if (user) {
    return res.json({ success: true, user });
  }

  user = {
    id: `usr-${Date.now()}`,
    name: name || 'Customer',
    email: email || 'user@example.com',
    phone: phone || '+91 98000 00000',
    address: 'Sector 1, HSR Layout, Bengaluru',
    lat: 12.9141,
    lon: 77.6411,
    status: 'ACTIVE',
    ordersPlaced: 0,
    totalSpent: 0,
    riskScore: 2,
    source: 'REGISTRATION',
    lastUpdated: new Date().toISOString()
  };

  registeredUsers.push(user);
  res.json({ success: true, user });
});

// POST /api/users/block - Suspend or Unblock User
app.post('/api/users/block', (req, res) => {
  const { userId, block } = req.body;
  const user = registeredUsers.find((u) => u.id === userId);
  if (user) {
    user.status = block ? 'SUSPENDED' : 'ACTIVE';
    user.riskScore = block ? 95 : 2;
    return res.json({ success: true, user });
  }
  res.status(404).json({ error: 'User not found' });
});

// --- SHOP PARTNER APIS ---
app.post('/api/shops/register', (req, res) => {
  const { name, email, phone, address, lat, lon, licenseType, licenseNumber, licenseProof } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Shop Name, Email, and Phone are required' });
  }

  const newShop = {
    id: `shop-${Date.now()}`,
    name,
    email,
    phone,
    address: address || 'HSR Layout, Bengaluru',
    lat: parseFloat(lat) || 12.9141,
    lon: parseFloat(lon) || 77.6411,
    licenseType: licenseType || 'Trade License',
    licenseNumber: licenseNumber || 'TL-PENDING',
    licenseProof: licenseProof || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    status: 'PENDING_APPROVAL',
    createdAt: new Date().toISOString()
  };

  registeredShops.push(newShop);

  // Add security log
  securityLogs.unshift({
    id: `SEC-${Date.now()}`,
    timestamp: new Date().toISOString(),
    eventType: 'NEW_SHOP_REGISTRATION',
    ipAddress: req.ip || '127.0.0.1',
    location: address || 'LocationIQ GPS',
    severity: 'INFO',
    details: `Shop "${name}" registered for Admin Approval (${licenseType}: ${licenseNumber})`
  });

  res.json({ success: true, shop: newShop });
});

app.get('/api/shops', (req, res) => {
  const status = req.query.status;
  if (status) {
    return res.json({ success: true, shops: registeredShops.filter(s => s.status === status) });
  }
  res.json({ success: true, shops: registeredShops });
});

app.post('/api/shops/location', (req, res) => {
  const { shopId, lat, lon, address } = req.body;
  let shop = registeredShops.find(s => s.id === shopId || s.email === shopId);
  if (!shop && registeredShops.length > 0) {
    shop = registeredShops[0];
  }

  if (shop) {
    if (lat !== undefined && !isNaN(parseFloat(lat))) shop.lat = parseFloat(lat);
    if (lon !== undefined && !isNaN(parseFloat(lon))) shop.lon = parseFloat(lon);
    if (address) shop.address = address;
  }

  let ds = darkstores.find(d => d.id === shopId || (shop && d.id === shop.id));
  if (!ds && darkstores.length > 0) {
    ds = darkstores[0];
  }

  if (ds) {
    if (lat !== undefined && !isNaN(parseFloat(lat))) ds.lat = parseFloat(lat);
    if (lon !== undefined && !isNaN(parseFloat(lon))) ds.lon = parseFloat(lon);
    if (address) ds.address = address;
  }

  securityLogs.unshift({
    id: `SEC-${Date.now()}`,
    timestamp: new Date().toISOString(),
    eventType: 'SHOP_LOCATION_UPDATED',
    ipAddress: req.ip || '127.0.0.1',
    location: address || `${lat}, ${lon}`,
    severity: 'INFO',
    details: `Shop "${shop?.name || shopId || 'Darkstore'}" updated GPS location to (${lat}, ${lon})`
  });

  res.json({ success: true, shop, darkstore: ds });
});

// --- SHOP PURGE / DELETE ENDPOINT ---
app.delete('/api/shops/:id', (req, res) => {
  const shopId = req.params.id;
  registeredShops = registeredShops.filter(s => s.id !== shopId);
  darkstores = darkstores.filter(d => d.id !== shopId);
  products = products.filter(p => p.shopId !== shopId);

  securityLogs.unshift({
    id: `SEC-${Date.now()}`,
    timestamp: new Date().toISOString(),
    eventType: 'SHOP_DELETED',
    ipAddress: req.ip || '127.0.0.1',
    location: 'Server Memory Purge',
    severity: 'WARNING',
    details: `Shop ID "${shopId}" and associated items were deleted from server.`
  });

  res.json({ success: true, message: `Shop ${shopId} deleted.`, remainingShops: registeredShops.length });
});

app.post('/api/shops/delete', (req, res) => {
  const { shopId } = req.body;
  if (!shopId) return res.status(400).json({ error: 'shopId is required' });

  registeredShops = registeredShops.filter(s => s.id !== shopId);
  darkstores = darkstores.filter(d => d.id !== shopId);
  products = products.filter(p => p.shopId !== shopId);

  securityLogs.unshift({
    id: `SEC-${Date.now()}`,
    timestamp: new Date().toISOString(),
    eventType: 'SHOP_DELETED',
    ipAddress: req.ip || '127.0.0.1',
    location: 'Server Memory Purge',
    severity: 'WARNING',
    details: `Shop ID "${shopId}" and associated items were deleted from server.`
  });

  res.json({ success: true, message: `Shop ${shopId} deleted.`, remainingShops: registeredShops.length });
});

app.post('/api/shops/approve', (req, res) => {
  const { shopId, action } = req.body; // action: 'APPROVE' | 'REJECT'
  const shop = registeredShops.find(s => s.id === shopId);
  if (!shop) {
    return res.status(404).json({ error: 'Shop not found' });
  }

  shop.status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

  if (action === 'APPROVE') {
    const existingDs = darkstores.find(d => d.id === shop.id);
    if (!existingDs) {
      darkstores.push({
        id: shop.id,
        name: shop.name,
        city: 'Bengaluru',
        lat: shop.lat || 12.9141,
        lon: shop.lon || 77.6411,
        status: 'ONLINE',
        dailyOrders: 0,
        revenue: 0,
        managerName: shop.name,
        managerPhone: shop.phone,
        uptimePercent: 100.0
      });
    }
  }

  securityLogs.unshift({
    id: `SEC-${Date.now()}`,
    timestamp: new Date().toISOString(),
    eventType: action === 'APPROVE' ? 'SHOP_APPROVED' : 'SHOP_REJECTED',
    ipAddress: req.ip || '127.0.0.1',
    location: 'Super Admin Console',
    severity: action === 'APPROVE' ? 'INFO' : 'WARNING',
    details: `Super Admin ${action === 'APPROVE' ? 'Approved' : 'Rejected'} shop "${shop.name}" (${shop.id})`
  });

  res.json({ success: true, shop });
});

// --- RIDER PARTNER APIS ---
app.post('/api/riders/register', (req, res) => {
  const { name, email, phone, vehicleNumber, drivingLicenseProof, idProofType, idProofNumber, lat, lon } = req.body;
  if (!name || !phone || !vehicleNumber) {
    return res.status(400).json({ error: 'Rider Name, Phone, and Vehicle Number are required' });
  }

  const newRider = {
    id: `rider-${Date.now()}`,
    name,
    email,
    phone,
    vehicleNumber,
    drivingLicenseProof: drivingLicenseProof || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    idProofType: idProofType || 'Aadhaar Card',
    idProofNumber: idProofNumber || 'ID-PENDING',
    lat: parseFloat(lat) || 12.9141,
    lon: parseFloat(lon) || 77.6411,
    status: 'PENDING_APPROVAL',
    createdAt: new Date().toISOString()
  };

  registeredRiders.push(newRider);

  securityLogs.unshift({
    id: `SEC-${Date.now()}`,
    timestamp: new Date().toISOString(),
    eventType: 'NEW_RIDER_REGISTRATION',
    ipAddress: req.ip || '127.0.0.1',
    location: 'Rider Partner Portal',
    severity: 'INFO',
    details: `Rider "${name}" (${vehicleNumber}) registered for Admin Approval`
  });

  res.json({ success: true, rider: newRider });
});

app.get('/api/riders', (req, res) => {
  const status = req.query.status;
  if (status) {
    return res.json({ success: true, riders: registeredRiders.filter(r => r.status === status) });
  }
  res.json({ success: true, riders: registeredRiders });
});

app.post('/api/riders/approve', (req, res) => {
  const { riderId, action } = req.body;
  const rider = registeredRiders.find(r => r.id === riderId);
  if (!rider) {
    return res.status(404).json({ error: 'Rider not found' });
  }

  rider.status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

  securityLogs.unshift({
    id: `SEC-${Date.now()}`,
    timestamp: new Date().toISOString(),
    eventType: action === 'APPROVE' ? 'RIDER_APPROVED' : 'RIDER_REJECTED',
    ipAddress: req.ip || '127.0.0.1',
    location: 'Super Admin Console',
    severity: action === 'APPROVE' ? 'INFO' : 'WARNING',
    details: `Super Admin ${action === 'APPROVE' ? 'Approved' : 'Rejected'} rider "${rider.name}" (${rider.id})`
  });

  res.json({ success: true, rider });
});

// BLOCK / UNBLOCK SHOP
app.post('/api/shops/block', (req, res) => {
  const { shopId, block } = req.body;
  const shop = registeredShops.find(s => s.id === shopId);
  if (!shop) {
    return res.status(404).json({ error: 'Shop not found' });
  }

  shop.status = block ? 'BLOCKED' : 'APPROVED';
  
  // Update darkstore offline status
  const ds = darkstores.find(d => d.id === shop.id);
  if (ds) {
    ds.status = block ? 'PAUSED' : 'ONLINE';
  }

  securityLogs.unshift({
    id: `SEC-${Date.now()}`,
    timestamp: new Date().toISOString(),
    eventType: block ? 'SHOP_ACCOUNT_BLOCKED' : 'SHOP_ACCOUNT_UNBLOCKED',
    ipAddress: req.ip || '127.0.0.1',
    location: 'Super Admin Console',
    severity: block ? 'WARNING' : 'INFO',
    details: `Super Admin ${block ? 'Blocked' : 'Unblocked'} shop partner "${shop.name}" (${shop.id})`
  });

  res.json({ success: true, shop });
});

// BLOCK / UNBLOCK RIDER
app.post('/api/riders/block', (req, res) => {
  const { riderId, block } = req.body;
  const rider = registeredRiders.find(r => r.id === riderId);
  if (!rider) {
    return res.status(404).json({ error: 'Rider not found' });
  }

  rider.status = block ? 'BLOCKED' : 'APPROVED';

  securityLogs.unshift({
    id: `SEC-${Date.now()}`,
    timestamp: new Date().toISOString(),
    eventType: block ? 'RIDER_ACCOUNT_BLOCKED' : 'RIDER_ACCOUNT_UNBLOCKED',
    ipAddress: req.ip || '127.0.0.1',
    location: 'Super Admin Console',
    severity: block ? 'WARNING' : 'INFO',
    details: `Super Admin ${block ? 'Blocked' : 'Unblocked'} rider partner "${rider.name}" (${rider.id})`
  });

  res.json({ success: true, rider });
});

// --- USER & FRAUD CONTROL APIS REMOVED (DUPLICATE) ---

// --- INVENTORY / PRODUCT UPLOAD API ---
app.post('/api/products/upload', (req, res) => {
  const { shopId, name, description, price, originalPrice, category, stockCount, images } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Product name and price are required' });
  }

  const newProduct = {
    id: `p-${Date.now()}`,
    shopId: shopId || 'shop-ds14',
    name,
    description: description || name,
    category: category || 'General',
    price: parseFloat(price),
    originalPrice: parseFloat(originalPrice) || parseFloat(price) * 1.3,
    weight: '1 unit',
    stockCount: parseInt(stockCount) || 50,
    inStock: true,
    images: Array.isArray(images) && images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=300&q=80'
    ],
    image: Array.isArray(images) && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80',
    barcode: `8901234${Math.floor(1000 + Math.random() * 9000)}`,
    shelfLocation: 'Aisle 2'
  };

  products.unshift(newProduct);
  res.json({ success: true, product: newProduct });
});

// --- PROXIMITY BASED PRODUCT & COVERAGE SEARCH API (5 KM RANGE) ---
app.get('/api/products/nearby', (req, res) => {
  const userLat = parseFloat(req.query.lat) || 12.9141;
  const userLon = parseFloat(req.query.lon) || 77.6411;
  const maxRadiusKm = parseFloat(req.query.radiusKm) || 5.0;

  // Find approved shops within maxRadiusKm
  const approvedShops = registeredShops.filter(s => s.status === 'APPROVED');
  const nearbyShops = approvedShops.filter(s => {
    const dist = getHaversineDistanceKm(userLat, userLon, s.lat, s.lon);
    return dist <= maxRadiusKm;
  });

  if (nearbyShops.length === 0) {
    return res.json({
      success: true,
      inCoverageRange: false,
      userLocation: { lat: userLat, lon: userLon },
      radiusKm: maxRadiusKm,
      nearbyShops: [],
      products: [],
      message: 'We are coming soon to your neighborhood!'
    });
  }

  const nearbyShopIds = nearbyShops.map(s => s.id);
  const shopsMap = new Map(nearbyShops.map(s => [s.id, s.name]));

  // Include only items belonging to nearby active shops & attach shopName
  const nearbyProducts = products
    .filter(p => p.shopId && nearbyShopIds.includes(p.shopId))
    .map(p => ({
      ...p,
      shopName: shopsMap.get(p.shopId) || 'Fresh Valley Market'
    }));

  res.json({
    success: true,
    inCoverageRange: true,
    userLocation: { lat: userLat, lon: userLon },
    radiusKm: maxRadiusKm,
    nearbyShops,
    products: nearbyProducts
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`⚡ CARTCRAZE CENTRAL REST API + SUPABASE SERVER RUNNING!`);
  console.log(`🌐 Server Base URL: http://localhost:${PORT}/api`);
  console.log(`⚡ Supabase Integration: ACTIVE`);
  console.log(`🔗 Linked App Nodes:`);
  console.log(`   📱 User App:    http://localhost:5173/`);
  console.log(`   🏬 Shop App:    http://localhost:3030/`);
  console.log(`   🛵 Rider App:   http://localhost:5050/`);
  console.log(`   🛡️ Admin App:   http://localhost:4040/`);
  console.log(`==================================================\n`);
});
