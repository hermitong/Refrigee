import React, { useState, useMemo } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { useTranslation } from '../contexts/LanguageContext';

// 类别配置
const CATEGORY_CONFIG = {
    Fruit: { name: '水果', emoji: '🍎', color: 'bg-red-50' },
    Vegetable: { name: '蔬菜', emoji: '🥬', color: 'bg-green-50' },
    Meat: { name: '肉类', emoji: '🥩', color: 'bg-pink-50' },
    Dairy: { name: '乳制品', emoji: '🥛', color: 'bg-blue-50' },
    Bakery: { name: '烘焙', emoji: '🍞', color: 'bg-yellow-50' },
    Pantry: { name: '储藏', emoji: '🥫', color: 'bg-orange-50' },
    Other: { name: '其他', emoji: '📦', color: 'bg-gray-50' }
};

export default function InventoryView({ items, onDelete }) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    // 过滤物品
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 按类别分组
    const groupedItems = useMemo(() => {
        const groups = {};

        filteredItems.forEach(item => {
            const category = item.category || 'Other';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(item);
        });

        // 每个分组内按过期日期排序
        Object.keys(groups).forEach(category => {
            groups[category].sort((a, b) =>
                new Date(a.expirationDate) - new Date(b.expirationDate)
            );
        });

        return groups;
    }, [filteredItems]);

    const getExpirationStatus = (dateStr) => {
        const days = differenceInDays(parseISO(dateStr), new Date());
        if (days < 0) return { color: 'text-red-600', text: '已过期', border: 'border-red-200', bg: 'bg-red-50' };
        if (days <= 3) return { color: 'text-red-600', text: `${days}天后过期`, border: 'border-red-200', bg: 'bg-red-50' };
        if (days <= 7) return { color: 'text-yellow-600', text: `${days}天后过期`, border: 'border-yellow-200', bg: 'bg-yellow-50' };
        return { color: 'text-green-600', text: `${days}天后过期`, border: 'border-gray-100', bg: 'bg-white' };
    };

    return (
        <div className="p-6 pb-32">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">库存</h1>
                <span className="text-gray-400 text-sm">{items.length} 件物品</span>
            </div>

            {/* 搜索框 */}
            <div className="relative mb-6">
                <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: '20px' }}>search</span>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索食物..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
            </div>

            {filteredItems.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-5xl">🧊</span>
                    </div>
                    <p className="text-gray-400 font-medium">
                        {searchQuery ? '未找到匹配的食物' : '冰箱空空如也! 该去购物了吗?'}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedItems).map(([category, categoryItems]) => {
                        const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other;

                        return (
                            <div key={category}>
                                {/* 类别标题 */}
                                <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-xl ${config.color}`}>
                                    <span className="text-2xl">{config.emoji}</span>
                                    <h3 className="font-bold text-gray-800">{config.name}</h3>
                                    <span className="text-sm text-gray-500">({categoryItems.length})</span>
                                </div>

                                {/* 该类别的物品 */}
                                <div className="space-y-3">
                                    {categoryItems.map((item) => {
                                        const status = getExpirationStatus(item.expirationDate);
                                        return (
                                            <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border shadow-sm transition-all ${status.border} ${status.bg}`}>
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm border border-gray-100">
                                                        {item.emoji}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{item.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {item.quantity} {item.unit} • <span className={status.color}>{status.text}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => onDelete(item.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <span className="material-icons-outlined" style={{ fontSize: '20px' }}>delete</span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
