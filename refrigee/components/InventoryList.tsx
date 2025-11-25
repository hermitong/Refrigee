import React, { useState } from 'react';
import { InventoryItem, Language } from '../types';
import { Trash2, Clock, Search } from 'lucide-react';

interface InventoryListProps {
  inventory: InventoryItem[];
  lang: Language;
  onDelete: (id: string) => void;
  // onAddClick is no longer needed here as it's global in App.tsx
}

const InventoryList: React.FC<InventoryListProps> = ({ inventory, lang, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sort by expiry date (soonest first)
  const sortedInventory = [...inventory]
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.expiryDate - b.expiryDate);

  const getDaysUntilExpiry = (timestamp: number) => {
    const diff = timestamp - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (days: number) => {
    if (days < 0) return 'bg-red-100 border-red-200 text-red-700';
    if (days <= 3) return 'bg-amber-100 border-amber-200 text-amber-700';
    return 'bg-emerald-50 border-emerald-100 text-emerald-700';
  };

  const labels = {
    en: {
      title: "My Fridge",
      search: "Search food...",
      empty: "Your fridge is empty! Time to go shopping?",
      addItem: "Add Item",
      daysLeft: "days left",
      expired: "Expired",
      today: "Expires today"
    },
    zh: {
      title: "我的冰箱",
      search: "搜索食物...",
      empty: "冰箱空空如也！该去购物了吗？",
      addItem: "添加物品",
      daysLeft: "天剩余",
      expired: "已过期",
      today: "今天过期"
    }
  };
  const t = labels[lang];

  return (
    <div className="h-full flex flex-col relative">
      <div className="sticky top-0 bg-[#f3f4f6] z-10 pt-2 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{t.title}</h2>
          <span className="text-sm font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{sortedInventory.length}</span>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={t.search} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all"
          />
        </div>
      </div>

      {sortedInventory.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 mt-10">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-4xl">
            🧊
          </div>
          <p>{t.empty}</p>
        </div>
      ) : (
        <div className="space-y-3 pb-4">
          {sortedInventory.map((item) => {
            const days = getDaysUntilExpiry(item.expiryDate);
            const statusClass = getStatusColor(days);
            
            return (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-transform active:scale-[0.99]">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-50">
                  {item.emoji}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="text-gray-300 hover:text-red-500 p-1 -mr-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-500 font-medium">
                      {item.quantity} {item.unit}
                    </span>
                    
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border flex items-center gap-1 ${statusClass}`}>
                      <Clock size={10} />
                      {days < 0 ? t.expired : days === 0 ? t.today : `${days} ${t.daysLeft}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InventoryList;