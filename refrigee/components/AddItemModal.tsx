import React, { useState, useEffect, useRef } from 'react';
import { InventoryItem, Language, Category, UNIT_OPTIONS, CATEGORY_LABELS } from '../types';
import { classifyItemWithAI, identifyItemFromImage } from '../services/geminiService';
import { X, Sparkles, Calendar, Loader2, Camera } from 'lucide-react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<InventoryItem, 'id' | 'addedDate'>) => void;
  lang: Language;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAdd, lang }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState<Category>(Category.OTHER);
  const [emoji, setEmoji] = useState('🍎');
  const [loadingAI, setLoadingAI] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setName('');
      setQuantity(1);
      setUnit('pcs');
      setExpiryDate('');
      setCategory(Category.OTHER);
      setEmoji('🍎');
      setLoadingAI(false);
    }
  }, [isOpen]);

  const handleNameBlur = async () => {
    if (!name || name.length < 2) return;
    // Don't trigger if already loading (e.g. from camera)
    if (loadingAI) return;
    
    setLoadingAI(true);
    try {
      const result = await classifyItemWithAI(name, lang);
      setCategory(result.category as Category);
      setEmoji(result.emoji);
      
      // Calculate default expiry date
      const date = new Date();
      date.setDate(date.getDate() + result.shelfLifeDays);
      setExpiryDate(date.toISOString().split('T')[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingAI(true);
    // Visual feedback immediately
    setEmoji('📸');
    
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
           const result = await identifyItemFromImage(base64String, lang);
           
           if (result.name) {
             setName(result.name);
             setCategory(result.category as Category);
             setEmoji(result.emoji);
             
             // Calculate default expiry date
             const date = new Date();
             date.setDate(date.getDate() + result.shelfLifeDays);
             setExpiryDate(date.toISOString().split('T')[0]);
           }
        } catch (err) {
           console.error("AI Vision Error", err);
        } finally {
          setLoadingAI(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("File reading error", error);
      setLoadingAI(false);
    }
    
    // Clear input so same file can be selected again if needed
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expiryTimestamp = expiryDate ? new Date(expiryDate).getTime() : Date.now() + 7 * 24 * 60 * 60 * 1000;
    
    onAdd({
      name,
      quantity,
      unit,
      category,
      emoji,
      expiryDate: expiryTimestamp,
    });
    onClose();
  };

  if (!isOpen) return null;

  const labels = {
    en: {
      title: "Add Item",
      name: "Item Name",
      quantity: "Quantity",
      expiry: "Expiry Date",
      category: "Category",
      add: "Add to Fridge",
      aiHint: "AI is analyzing...",
      camera: "Snap Photo"
    },
    zh: {
      title: "添加物品",
      name: "物品名称",
      quantity: "数量",
      expiry: "过期日期",
      category: "分类",
      add: "放入冰箱",
      aiHint: "AI 正在分析...",
      camera: "拍照识别"
    }
  };
  const t = labels[lang];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up sm:animate-fade-in shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">{t.title}</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} className="text-gray-600"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input with Camera & AI Indicator */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t.name}</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleNameBlur}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none pr-10"
                  placeholder={lang === 'en' ? "e.g. Milk, Apples..." : "例如：牛奶，苹果..."}
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl pointer-events-none">
                  {loadingAI ? <Loader2 className="animate-spin text-emerald-500" size={20} /> : emoji}
                </div>
              </div>
              
              <button 
                type="button"
                onClick={handleCameraClick}
                className="bg-emerald-50 text-emerald-600 p-3 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center active:scale-95"
                title={t.camera}
                disabled={loadingAI}
              >
                <Camera size={24} />
              </button>
              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                capture="environment"
                className="hidden"
                onChange={handleImageCapture}
              />
            </div>
            {loadingAI && <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><Sparkles size={12}/> {t.aiHint}</p>}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t.quantity}</label>
              <div className="flex">
                <input 
                  type="number" 
                  min="0.1" 
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value))}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-l-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <select 
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="bg-gray-100 border-y border-r border-gray-200 text-gray-600 rounded-r-xl px-2 text-sm focus:outline-none"
                >
                  {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t.expiry}</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
                {!expiryDate && <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />}
              </div>
            </div>
          </div>

          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">{t.category}</label>
             <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
             >
                {Object.values(Category).map(c => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[lang][c]}
                  </option>
                ))}
             </select>
          </div>

          <button 
            type="submit" 
            disabled={loadingAI}
            className={`w-full text-white font-bold py-4 rounded-xl shadow-lg mt-4 transition-all
              ${loadingAI 
                ? 'bg-gray-300 shadow-none cursor-not-allowed' 
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 active:scale-[0.98]'
              }`}
          >
            {t.add}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;