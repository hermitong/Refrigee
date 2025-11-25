import { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Camera, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { predictItemDetails } from '../utils/aiMock';
import { classifyItemWithAI, identifyItemFromImage, isAIAvailable } from '../services/geminiService';
import { format, addDays } from 'date-fns';

export default function AddItemModal({ isOpen, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [unit, setUnit] = useState('pcs');
    const [category, setCategory] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [emoji, setEmoji] = useState('📦');
    const [loadingAI, setLoadingAI] = useState(false);
    const fileInputRef = useRef(null);

    // AI 自动分类
    useEffect(() => {
        if (name.length > 2 && !loadingAI) {
            handleAutoClassify();
        }
    }, [name]);

    const handleAutoClassify = async () => {
        setLoadingAI(true);
        try {
            if (isAIAvailable()) {
                // 使用真实 AI
                const result = await classifyItemWithAI(name, 'zh');
                setCategory(result.category);
                setEmoji(result.emoji);
                if (!expirationDate) {
                    const expiry = addDays(new Date(), result.shelfLifeDays);
                    setExpirationDate(format(expiry, 'yyyy-MM-dd'));
                }
            } else {
                // 降级到 Mock AI
                const prediction = predictItemDetails(name);
                setCategory(prediction.category);
                setEmoji(prediction.emoji);
                if (!expirationDate) {
                    setExpirationDate(format(prediction.defaultExpiration, 'yyyy-MM-dd'));
                }
            }
        } catch (error) {
            console.error('Auto-classify error:', error);
        } finally {
            setLoadingAI(false);
        }
    };

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageCapture = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoadingAI(true);
        setEmoji('📸');

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result;
                try {
                    if (isAIAvailable()) {
                        const result = await identifyItemFromImage(base64String, 'zh');
                        if (result.name) {
                            setName(result.name);
                            setCategory(result.category);
                            setEmoji(result.emoji);
                            const expiry = addDays(new Date(), result.shelfLifeDays);
                            setExpirationDate(format(expiry, 'yyyy-MM-dd'));
                        }
                    } else {
                        // AI 不可用时提示用户
                        alert('拍照识别需要配置 API Key,请前往设置页面配置');
                        setEmoji('📦');
                    }
                } catch (err) {
                    console.error('AI Vision Error', err);
                    setEmoji('📦');
                } finally {
                    setLoadingAI(false);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('File reading error', error);
            setLoadingAI(false);
            setEmoji('📦');
        }

        e.target.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            name,
            quantity: Number(quantity),
            unit,
            category,
            expirationDate,
            emoji
        });
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setName('');
        setQuantity('1');
        setUnit('pcs');
        setCategory('');
        setExpirationDate('');
        setEmoji('📦');
        setLoadingAI(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 max-w-md mx-auto shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                添加物品 <span className="text-2xl">{emoji}</span>
                            </h2>
                            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Input with Camera */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">物品名称</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="例如:牛奶,苹果..."
                                            className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                            autoFocus
                                            required
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {loadingAI ? (
                                                <Loader2 className="animate-spin text-emerald-500" size={20} />
                                            ) : name.length > 2 ? (
                                                <Sparkles className="text-emerald-500 animate-pulse" size={20} />
                                            ) : null}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCameraClick}
                                        className="bg-emerald-50 text-emerald-600 p-3 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center active:scale-95"
                                        title="拍照识别"
                                        disabled={loadingAI}
                                    >
                                        <Camera size={24} />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        capture="environment"
                                        className="hidden"
                                        onChange={handleImageCapture}
                                    />
                                </div>
                                {loadingAI && (
                                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                        <Sparkles size={12} /> AI 正在分析...
                                    </p>
                                )}
                                {!isAIAvailable() && name.length > 2 && (
                                    <p className="text-xs text-amber-600 mt-1">
                                        💡 使用 Mock AI (前往设置配置 API Key 以启用真实 AI)
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">数量</label>
                                    <div className="flex">
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-l-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                            required
                                            min="0.1"
                                            step="0.1"
                                        />
                                        <select
                                            value={unit}
                                            onChange={(e) => setUnit(e.target.value)}
                                            className="bg-gray-100 border-y border-r border-gray-200 rounded-r-xl px-2 text-sm text-gray-600 outline-none"
                                        >
                                            <option value="pcs">个</option>
                                            <option value="kg">kg</option>
                                            <option value="g">g</option>
                                            <option value="L">L</option>
                                            <option value="ml">ml</option>
                                            <option value="pack">包</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        <option value="">选择...</option>
                                        <option value="Fruit">水果</option>
                                        <option value="Vegetable">蔬菜</option>
                                        <option value="Dairy">乳制品</option>
                                        <option value="Meat">肉类</option>
                                        <option value="Bakery">烘焙</option>
                                        <option value="Pantry">储藏</option>
                                        <option value="Other">其他</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">过期日期</label>
                                <input
                                    type="date"
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loadingAI}
                                className={`w-full py-4 font-bold rounded-xl shadow-lg mt-4 transition-all ${loadingAI
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-emerald-500 text-white shadow-emerald-200 hover:bg-emerald-600 active:scale-95'
                                    }`}
                            >
                                放入冰箱
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
