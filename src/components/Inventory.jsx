import { useState, useMemo } from 'react';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Trash2, Search } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

// 类别配置
const CATEGORY_CONFIG = {
    Fruit: { name: '水果', emoji: '🍎', color: 'bg-red-50' },
    Vegetable: { name: '蔬菜', emoji: '🥬', color: 'bg-green-50' },
    Meat: { name: '肉类', emoji: '🥩', color: 'bg-pink-50' },
    Dairy: { name: '乳制品', emoji: '🥛', color: 'bg-blue-50' },
    Grain: { name: '谷物', emoji: '🌾', color: 'bg-yellow-50' },
    Beverage: { name: '饮料', emoji: '🥤', color: 'bg-purple-50' },
    Snack: { name: '零食', emoji: '🍿', color: 'bg-orange-50' },
    Condiment: { name: '调味品', emoji: '🧂', color: 'bg-amber-50' },
    Other: { name: '其他', emoji: '📦', color: 'bg-gray-50' }
};

export default function Inventory({ items, onDelete }) {
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
        if (days < 0) return { color: 'bg-red-500', text: t('inventory.expired'), border: 'border-red-200', bg: 'bg-red-50' };
        if (days <= 3) return { color: 'bg-red-500', text: t('inventory.expiresIn', { days }), border: 'border-red-200', bg: 'bg-red-50' };
        if (days <= 7) return { color: 'bg-yellow-500', text: t('inventory.expiresIn', { days }), border: 'border-yellow-200', bg: 'bg-yellow-50' };
        return { color: 'bg-green-500', text: t('inventory.expiresIn', { days }), border: 'border-gray-100', bg: 'bg-white' };
    };

    return (
        <div className="p-6 pb-24">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{t('inventory.title')}</h1>
                <span className="text-gray-400 text-sm">{items.length}</span>
            </div>

            {/* 搜索框 */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
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
                        <p className="text-5xl">🧊</p>
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
                                                            {item.quantity} {item.unit} • <span className={status.color === 'bg-red-500' ? 'text-red-600 font-medium' : ''}>{status.text}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => onDelete(item.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={18} />
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
