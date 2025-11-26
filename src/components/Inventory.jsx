import { useState } from 'react';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Trash2, Search } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

export default function Inventory({ items, onDelete }) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    // Filter and sort by expiration date
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedItems = [...filteredItems].sort((a, b) =>
        new Date(a.expirationDate) - new Date(b.expirationDate)
    );

    const getExpirationStatus = (dateStr) => {
        const days = differenceInDays(parseISO(dateStr), new Date());
        if (days < 0) return { color: 'bg-red-500', text: t('inventory.expired'), border: 'border-red-200', bg: 'bg-red-50' };
        if (days <= 3) return { color: 'bg-red-500', text: t('inventory.expiresIn', { days }), border: 'border-red-200', bg: 'bg-red-50' };
        if (days <= 7) return { color: 'bg-yellow-500', text: t('inventory.expiresIn', { days }), border: 'border-yellow-200', bg: 'bg-yellow-50' };
        return { color: 'bg-green-500', text: t('inventory.expiresIn', { days }), border: 'border-gray-100', bg: 'bg-white' };
    };

    return (
        <div className="p-6">
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
                <div className="space-y-3">
                    {sortedItems.map((item) => {
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
            )}
        </div>
    );
}
