import React, { useState, useEffect, useMemo } from 'react';
import {
  Refrigerator,
  Plus,
  ChefHat,
  LayoutDashboard,
  Trash2,
  AlertCircle,
  ScanLine,
  CheckCircle2,
  Snowflake,
  Package,
  Settings,
  Languages,
  DollarSign,
  Search,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data & Helpers ---

const CATEGORIES = {
  vegetable: { label: { en: 'Vegetable', zh: '蔬菜' }, defaultDays: 7 },
  fruit: { label: { en: 'Fruit', zh: '水果' }, defaultDays: 10 },
  meat: { label: { en: 'Meat', zh: '肉类' }, defaultDays: 3 },
  dairy: { label: { en: 'Dairy', zh: '乳制品' }, defaultDays: 14 },
  frozen: { label: { en: 'Frozen', zh: '冷冻食品' }, defaultDays: 90 },
  beverage: { label: { en: 'Beverage', zh: '饮料' }, defaultDays: 180 },
  other: { label: { en: 'Other', zh: '其他' }, defaultDays: 30 },
};

const LOCATIONS = {
  fridge: { en: 'Fridge', zh: '冷藏' },
  freezer: { en: 'Freezer', zh: '冷冻' },
  pantry: { en: 'Pantry', zh: '常温' },
};

const MOCK_RECIPES = [
  {
    id: 1,
    title: { en: 'Tomato Scrambled Eggs', zh: '番茄炒蛋' },
    ingredients: ['Tomato', 'Egg'],
    difficulty: 'Easy',
    time: '10 min'
  },
  {
    id: 2,
    title: { en: 'Cola Chicken Wings', zh: '可乐鸡翅' },
    ingredients: ['Chicken Wing', 'Cola', 'Ginger'],
    difficulty: 'Medium',
    time: '30 min'
  },
  {
    id: 3,
    title: { en: 'Pasta Bolognese', zh: '肉酱意面' },
    ingredients: ['Pasta', 'Ground Meat', 'Tomato', 'Onion'],
    difficulty: 'Medium',
    time: '25 min'
  },
  {
    id: 4,
    title: { en: 'Fruit Salad', zh: '水果沙拉' },
    ingredients: ['Apple', 'Banana', 'Yogurt'],
    difficulty: 'Easy',
    time: '5 min'
  },
  {
    id: 5,
    title: { en: 'Instant Noodles Deluxe', zh: '豪华泡面' },
    ingredients: ['Instant Noodles', 'Egg', 'Sausage', 'Vegetable'],
    difficulty: 'Easy',
    time: '5 min'
  }
];

const MOCK_SCAN_RESULTS = [
  { name: 'Milk', category: 'dairy', price: 2.5 },
  { name: 'Tomato', category: 'vegetable', price: 0.8 },
  { name: 'Chicken Wing', category: 'meat', location: 'freezer', price: 5.0 },
  { name: 'Apple', category: 'fruit', price: 1.2 },
  { name: 'Cola', category: 'beverage', price: 1.0 },
];

// --- Translations ---
const t = {
  en: {
    dashboard: 'Home',
    inventory: 'Items',
    add: 'Add',
    recipes: 'Cook',
    settings: 'Settings',
    hello: 'Hi, Refrigee',
    expiringSoon: 'Expiring Soon',
    totalValue: 'Total Value',
    daysLeft: 'days left',
    expired: 'Expired',
    today: 'Today',
    emptyState: 'Your fridge is empty!',
    search: 'Search items...',
    scan: 'AI Scan (Sim)',
    manual: 'Manual',
    itemName: 'Item Name',
    category: 'Category',
    expiry: 'Expiry Date',
    price: 'Price ($)',
    location: 'Location',
    save: 'Save Item',
    scanning: 'Scanning...',
    scanSuccess: 'Identified!',
    availableRecipes: 'What to Cook?',
    missing: 'Missing',
    have: 'Have',
    cookThis: 'Cook This',
    language: 'Language',
    clearData: 'Clear Data',
    currency: '$',
    unit: 'items'
  },
  zh: {
    dashboard: '首页',
    inventory: '库存',
    add: '添加',
    recipes: '食谱',
    settings: '设置',
    hello: '你好，留子',
    expiringSoon: '即将过期',
    totalValue: '库存总值',
    daysLeft: '天剩余',
    expired: '已过期',
    today: '今天过期',
    emptyState: '冰箱空空如也！',
    search: '搜索物品...',
    scan: 'AI 模拟扫描',
    manual: '手动输入',
    itemName: '物品名称',
    category: '分类',
    expiry: '过期日期',
    price: '价格 (¥)',
    location: '存放位置',
    save: '保存物品',
    scanning: '识别中...',
    scanSuccess: '识别成功!',
    availableRecipes: '能做什么吃？',
    missing: '缺少',
    have: '拥有',
    cookThis: '做这道菜',
    language: '语言',
    clearData: '清空数据',
    currency: '¥',
    unit: '件'
  }
};

// --- Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-4 ${className}`}>
    {children}
  </div>
);

const Badge = ({ color, text }) => {
  const colors = {
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-700',
    green: 'bg-emerald-100 text-emerald-600',
    gray: 'bg-slate-100 text-slate-600',
    blue: 'bg-blue-100 text-blue-600',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[color] || colors.gray}`}>
      {text}
    </span>
  );
};

export default function RefrigeeApp() {
  // --- State ---
  const [lang, setLang] = useState('zh');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [items, setItems] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [user, setUser] = useState({ name: '', isGuest: true, avatar: '👤' });

  // Form State
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'other',
    expiryDate: '',
    price: '',
    location: 'fridge'
  });

  // --- Effects ---
  useEffect(() => {
    const saved = localStorage.getItem('refrigee_items');
    if (saved) setItems(JSON.parse(saved));

    const savedUser = localStorage.getItem('refrigee_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to load user", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('refrigee_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('refrigee_user', JSON.stringify(user));
  }, [user]);

  const handleUpdateUser = (newUser) => {
    setUser(newUser);
  };

  // --- Helpers ---
  const getDaysDiff = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = (days) => {
    if (days < 0) return { color: 'red', label: t[lang].expired };
    if (days === 0) return { color: 'red', label: t[lang].today };
    if (days <= 3) return { color: 'red', label: `${days} ${t[lang].daysLeft}` };
    if (days <= 7) return { color: 'yellow', label: `${days} ${t[lang].daysLeft}` };
    return { color: 'green', label: `${days} ${t[lang].daysLeft}` };
  };

  const calculateTotalValue = () => {
    return items.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0).toFixed(1);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.expiryDate) return;
    const item = { ...newItem, id: Date.now() };
    setItems([...items, item]);
    setNewItem({ name: '', category: 'other', expiryDate: '', price: '', location: 'fridge' });
    setActiveTab('inventory');
  };

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const randomItem = MOCK_SCAN_RESULTS[Math.floor(Math.random() * MOCK_SCAN_RESULTS.length)];
      const today = new Date();
      const daysToAdd = CATEGORIES[randomItem.category].defaultDays;
      const expiry = new Date(today.setDate(today.getDate() + daysToAdd)).toISOString().split('T')[0];

      setNewItem({
        name: randomItem.name,
        category: randomItem.category,
        expiryDate: expiry,
        price: randomItem.price,
        location: randomItem.location || 'fridge'
      });
      setIsScanning(false);
    }, 1500);
  };

  const handleDelete = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  // --- Views ---

  const DashboardView = () => {
    const expiringItems = items
      .map(item => ({ ...item, days: getDaysDiff(item.expiryDate) }))
      .filter(item => item.days <= 3)
      .sort((a, b) => a.days - b.days);

    return (
      <div className="space-y-6 pb-24">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t[lang].hello}</h1>
            <p className="text-slate-500 text-sm">Don't waste, just taste.</p>
          </div>
          <div className="bg-slate-100 p-2 rounded-full">
            <Refrigerator className="text-emerald-500" size={24} />
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-emerald-500 text-white border-none">
            <div className="flex items-center gap-2 mb-1 opacity-90">
              <Package size={16} />
              <span className="text-sm">{t[lang].inventory}</span>
            </div>
            <div className="text-3xl font-bold">{items.length}</div>
            <div className="text-xs opacity-80">{t[lang].unit}</div>
          </Card>
          <Card className="bg-slate-800 text-white border-none">
            <div className="flex items-center gap-2 mb-1 opacity-90">
              <DollarSign size={16} />
              <span className="text-sm">{t[lang].totalValue}</span>
            </div>
            <div className="text-3xl font-bold">{t[lang].currency}{calculateTotalValue()}</div>
            <div className="text-xs opacity-80">Estimated</div>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500" />
              {t[lang].expiringSoon}
            </h2>
          </div>

          {expiringItems.length === 0 ? (
            <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-400" />
              <p>Everything looks fresh!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expiringItems.map(item => (
                <Card key={item.id} className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-10 rounded-full ${item.days < 0 ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                    <div>
                      <h3 className="font-bold text-slate-800">{item.name}</h3>
                      <p className="text-xs text-slate-500">{CATEGORIES[item.category]?.label[lang]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-500 font-bold text-sm">{item.days < 0 ? t[lang].expired : `${item.days}d`}</div>
                    <div className="text-xs text-slate-400">{item.location === 'freezer' ? t[lang].settings : ''}</div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const InventoryView = () => {
    const [filter, setFilter] = useState('');
    const sortedItems = [...items]
      .filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

    return (
      <div className="space-y-4 pb-24">
        <h2 className="text-xl font-bold">{t[lang].inventory}</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t[lang].search}
            className="w-full bg-slate-100 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {sortedItems.length === 0 && (
            <div className="text-center text-slate-400 mt-10">{t[lang].emptyState}</div>
          )}
          {sortedItems.map(item => {
            const days = getDaysDiff(item.expiryDate);
            const status = getExpiryStatus(days);
            return (
              <Card key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                    {item.location === 'freezer' ? <Snowflake size={18} /> : <Package size={18} />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{item.name}</div>
                    <div className="text-xs text-slate-500 flex gap-2">
                      <span>{CATEGORIES[item.category]?.label[lang]}</span>
                      <span>•</span>
                      <span>{item.expiryDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge color={status.color} text={status.label} />
                  <button onClick={() => handleDelete(item.id)} className="text-slate-300 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    );
  };

  const AddItemView = () => (
    <div className="pb-24">
      <h2 className="text-xl font-bold mb-6">{t[lang].add}</h2>

      <button
        onClick={simulateScan}
        disabled={isScanning}
        className="w-full mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 font-bold active:scale-95 transition-all"
      >
        {isScanning ? <ScanLine className="animate-spin" /> : <ScanLine />}
        {isScanning ? t[lang].scanning : t[lang].scan}
      </button>

      <form onSubmit={handleAddItem} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">{t[lang].itemName}</label>
          <input
            required
            value={newItem.name}
            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
            className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500"
            placeholder="e.g. Milk"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t[lang].category}</label>
            <select
              value={newItem.category}
              onChange={e => setNewItem({ ...newItem, category: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 outline-none bg-white"
            >
              {Object.entries(CATEGORIES).map(([key, val]) => (
                <option key={key} value={key}>{val.label[lang]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t[lang].location}</label>
            <select
              value={newItem.location}
              onChange={e => setNewItem({ ...newItem, location: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 outline-none bg-white"
            >
              {Object.entries(LOCATIONS).map(([key, val]) => (
                <option key={key} value={key}>{val[lang]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t[lang].expiry}</label>
            <input
              type="date"
              required
              value={newItem.expiryDate}
              onChange={e => setNewItem({ ...newItem, expiryDate: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t[lang].price}</label>
            <input
              type="number"
              step="0.01"
              value={newItem.price}
              onChange={e => setNewItem({ ...newItem, price: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500"
              placeholder="0.00"
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold mt-6 shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-colors">
          {t[lang].save}
        </button>
      </form>
    </div>
  );

  const RecipeView = () => {
    // Simple Logic: Check how many ingredients match user items names (partial string match)
    const recipesWithMatch = MOCK_RECIPES.map(recipe => {
      const userItemNames = items.map(i => i.name.toLowerCase());
      const matches = recipe.ingredients.filter(ing =>
        userItemNames.some(uItem => uItem.includes(ing.toLowerCase()) || ing.toLowerCase().includes(uItem))
      );
      return { ...recipe, matches };
    }).sort((a, b) => b.matches.length - a.matches.length);

    return (
      <div className="pb-24">
        <h2 className="text-xl font-bold mb-4">{t[lang].availableRecipes}</h2>

        <div className="space-y-4">
          {recipesWithMatch.map(recipe => {
            const matchCount = recipe.matches.length;
            const totalCount = recipe.ingredients.length;
            const isCookable = matchCount === totalCount;

            return (
              <Card key={recipe.id} className={`border-l-4 ${isCookable ? 'border-l-emerald-500' : 'border-l-orange-300'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-800">{recipe.title[lang]}</h3>
                  <Badge color={isCookable ? 'green' : 'gray'} text={`${matchCount}/${totalCount}`} />
                </div>

                <div className="flex gap-2 flex-wrap mb-3">
                  {recipe.ingredients.map((ing, idx) => {
                    const isHave = recipe.matches.includes(ing);
                    return (
                      <span key={idx} className={`text-xs px-2 py-1 rounded border ${isHave ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                        {ing}
                      </span>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-xs text-slate-500 flex gap-3">
                    <span>{recipe.time}</span>
                    <span>{recipe.difficulty}</span>
                  </div>
                  <button className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg hover:bg-emerald-100">
                    {t[lang].cookThis}
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    );
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 max-w-md mx-auto relative shadow-2xl overflow-hidden">

      {/* Dynamic Content Area */}
      <div className="p-6 h-full overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'inventory' && <InventoryView />}
            {activeTab === 'add' && <AddItemView />}
            {activeTab === 'recipes' && <RecipeView />}
            {activeTab === 'settings' && (
              <div className="pb-24">
                <h2 className="text-xl font-bold mb-6">{t[lang].settings}</h2>
                <Card className="mb-4 flex justify-between items-center cursor-pointer" >
                  <div className="flex items-center gap-3">
                    <Languages className="text-purple-500" />
                    <span>{t[lang].language}</span>
                  </div>
                  <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} className="text-emerald-600 font-bold">
                    {lang === 'en' ? 'English' : '中文'}
                  </button>
                </Card>
                <button
                  onClick={() => { if (window.confirm('Clear all data?')) setItems([]) }}
                  className="w-full py-3 text-red-500 font-medium"
                >
                  {t[lang].clearData}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-100 px-6 py-2 flex justify-between items-center z-10">
        <NavButton icon={LayoutDashboard} label={t[lang].dashboard} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavButton icon={Refrigerator} label={t[lang].inventory} isActive={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />

        {/* Floating Action Button */}
        <div className="relative -top-6">
          <button
            onClick={() => setActiveTab('add')}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 transition-all transform hover:scale-105 ${activeTab === 'add' ? 'bg-slate-800 text-white' : 'bg-emerald-500 text-white'}`}
          >
            <Plus size={28} />
          </button>
        </div>

        <NavButton icon={ChefHat} label={t[lang].recipes} isActive={activeTab === 'recipes'} onClick={() => setActiveTab('recipes')} />
        <NavButton icon={Settings} label={t[lang].settings} isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>
    </div>
  );
}

const NavButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);
