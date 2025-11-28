import { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Camera, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { predictItemDetails } from '../utils/aiMock';
import { format, addDays } from 'date-fns';
import CameraCapture from './CameraCapture';
import * as aiServiceManager from '../services/aiServiceManager';

export default function AddItemModal({ isOpen, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [unit, setUnit] = useState('pcs');
    const [category, setCategory] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [emoji, setEmoji] = useState('📦');
    const [loadingAI, setLoadingAI] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
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
            console.log('开始AI分类,物品名称:', name);
            // 调用真实AI服务
            const result = await aiServiceManager.classifyItem(name, 'zh');
            console.log('AI分类成功:', result);

            setCategory(result.category);
            setEmoji(result.emoji);
            if (!expirationDate && result.shelfLifeDays) {
                setExpirationDate(format(addDays(new Date(), result.shelfLifeDays), 'yyyy-MM-dd'));
            }
        } catch (error) {
            console.error('AI分类功能暂不可用:', error);
            console.error('错误详情:', error.message, error.stack);
            // AI失败后不降级,让用户手动选择
            // 不显示错误提示,保持静默失败
        } finally {
            setLoadingAI(false);
        }
    };

    // 处理相机识别结果
    const handleCameraCapture = (result) => {
        if (result.name) {
            setName(result.name);
        }
        setCategory(result.category);
        setEmoji(result.emoji);
        if (!expirationDate && result.shelfLifeDays) {
            setExpirationDate(format(addDays(new Date(), result.shelfLifeDays), 'yyyy-MM-dd'));
        }
        setShowCamera(false);
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
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 max-w-md mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
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
                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">物品名称</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="例如:牛奶,苹果..."
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
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
                                {loadingAI && (
                                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                        <Sparkles size={12} /> AI 正在分析...
                                    </p>
                                )}
                            </div>

                            {/* 拍照按钮 */}
                            <button
                                type="button"
                                onClick={() => setShowCamera(true)}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                <Camera size={20} />
                                拍照识别
                            </button>

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
                                            min="0.5"
                                            step="0.5"
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
                                        <option value="Meat">肉类</option>
                                        <option value="Dairy">乳制品</option>
                                        <option value="Grain">谷物</option>
                                        <option value="Beverage">饮料</option>
                                        <option value="Snack">零食</option>
                                        <option value="Condiment">调味品</option>
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

                    {/* 相机组件 */}
                    {showCamera && (
                        <CameraCapture
                            onCapture={handleCameraCapture}
                            onCancel={() => setShowCamera(false)}
                        />
                    )}
                </>
            )}
        </AnimatePresence>
    );
}
