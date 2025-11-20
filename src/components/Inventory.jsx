import { differenceInDays, parseISO, format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

export default function Inventory({ items, onDelete }) {
    const { t } = useTranslation();

    // Sort by expiration date
    const sortedItems = [...items].sort((a, b) =>
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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('inventory.title')}</h1>

            {items.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                    <p className="text-4xl mb-2">🕸️</p>
                    <p>{t('inventory.empty')}</p>
                    <p className="text-sm">{t('inventory.tapToAdd')}</p>
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
