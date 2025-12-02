import React, { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const CATEGORIES = {
    Fruit: '水果',
    Vegetable: '蔬菜',
    Meat: '肉类',
    Dairy: '乳制品',
    Bakery: '烘焙',
    Pantry: '储藏',
    Other: '其他'
};

const LOCATIONS = {
    Fridge: '冷藏',
    Freezer: '冷冻',
    Pantry: '常温'
};

export default function AddItemView({ onAdd }) {
    const { t } = useTranslation();
    const [isScanning, setIsScanning] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        category: 'Other',
        expirationDate: '',
        quantity: 1,
        unit: '个',
        location: 'Fridge',
        emoji: '📦'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...newItem,
            id: Date.now().toString(),
            addedDate: new Date().toISOString()
        });
        // 重置表单
        setNewItem({
            name: '',
            category: 'Other',
            expirationDate: '',
            quantity: 1,
            unit: '个',
            location: 'Fridge',
            emoji: '📦'
        });
    };

    const simulateScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            const mockItems = [
                { name: '牛奶', category: 'Dairy', emoji: '🥛', days: 7 },
                { name: '苹果', category: 'Fruit', emoji: '🍎', days: 14 },
                { name: '鸡胸肉', category: 'Meat', emoji: '🥩', days: 3 }
            ];
            const randomItem = mockItems[Math.floor(Math.random() * mockItems.length)];

            const today = new Date();
            const expiryDate = new Date(today.setDate(today.getDate() + randomItem.days));

            setNewItem({
                ...newItem,
                name: randomItem.name,
                category: randomItem.category,
                emoji: randomItem.emoji,
                expirationDate: expiryDate.toISOString().split('T')[0]
            });
            setIsScanning(false);
        }, 1500);
    };

    return (
        <div className="p-6 pb-32">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">添加物品</h1>

            <button
                onClick={simulateScan}
                disabled={isScanning}
                className="w-full mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 font-bold active:scale-95 transition-all"
            >
                <span className={`material-icons-outlined ${isScanning ? 'animate-spin' : ''}`}>qr_code_scanner</span>
                {isScanning ? '正在识别...' : 'AI 智能扫描'}
            </button>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">物品名称</label>
                    <input
                        required
                        value={newItem.name}
                        onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                        placeholder="例如: 牛奶"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">分类</label>
                        <select
                            value={newItem.category}
                            onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl p-3 outline-none bg-white focus:border-emerald-500"
                        >
                            {Object.entries(CATEGORIES).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">存放位置</label>
                        <select
                            value={newItem.location}
                            onChange={e => setNewItem({ ...newItem, location: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl p-3 outline-none bg-white focus:border-emerald-500"
                        >
                            {Object.entries(LOCATIONS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">过期日期</label>
                    <input
                        type="date"
                        required
                        value={newItem.expirationDate}
                        onChange={e => setNewItem({ ...newItem, expirationDate: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">数量</label>
                        <input
                            type="number"
                            min="1"
                            value={newItem.quantity}
                            onChange={e => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">单位</label>
                        <input
                            type="text"
                            value={newItem.unit}
                            onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                            placeholder="个, 瓶, kg"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold mt-8 shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                >
                    <span className="material-icons-outlined">check</span>
                    保存物品
                </button>
            </form>
        </div>
    );
}
