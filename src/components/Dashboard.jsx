import React from 'react';
import { AlertCircle, CheckCircle, Package, Refrigerator, Sparkles } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import * as aiServiceManager from '../services/aiServiceManager';

export default function Dashboard({ items, user, onNavigate }) {
    const { t, lang } = useTranslation();

    const now = Date.now();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;

    const totalItems = items.length;
    const expiredItems = items.filter(i => i.expirationDate < now).length;
    const expiringSoonItems = items.filter(i =>
        i.expirationDate >= now && i.expirationDate <= now + threeDaysInMs
    ).length;

    // Get actual expiring items for display
    const expiringList = items
        .filter(i => i.expirationDate >= now && i.expirationDate <= now + threeDaysInMs)
        .sort((a, b) => a.expirationDate - b.expirationDate)
        .slice(0, 3);

    // Determine display name
    const displayName = user?.isGuest
        ? (lang === 'en' ? 'Student' : '留子')
        : (user?.name || (lang === 'en' ? 'Student' : '留子'));

    const labels = {
        en: {
            greeting: `Hello, ${displayName}`,
            subtitle: "Don't waste, just taste.",
            total: "Total Items",
            expiring: "Expiring Soon",
            expired: "Expired",
            expiringTitle: "Expiring Soon",
            goodState: "Everything looks fresh!",
            check: "Check",
        },
        zh: {
            greeting: `你好,${displayName}`,
            subtitle: "Don't waste, just taste.",
            total: "总物品",
            expiring: "即将过期",
            expired: "已过期",
            expiringTitle: "即将过期",
            goodState: "Everything looks fresh!",
            check: "去查看",
        }
    };

    const tLocal = labels[lang];

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">{tLocal.greeting}</h1>
                    <p className="text-gray-500 font-medium mt-1">{tLocal.subtitle}</p>
                </div>
                <div className="bg-emerald-50 p-2 rounded-full text-emerald-600">
                    <Refrigerator size={24} />
                </div>
            </header>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50 h-32 flex flex-col justify-between">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                        <Package size={20} />
                    </div>
                    <div>
                        <span className="text-2xl font-bold text-gray-800 block">{totalItems}</span>
                        <span className="text-xs text-gray-400 font-medium">{tLocal.total}</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50 h-32 flex flex-col justify-between">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${expiringSoonItems > 0 ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'}`}>
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <span className={`text-2xl font-bold block ${expiringSoonItems > 0 ? 'text-amber-500' : 'text-gray-800'}`}>
                            {expiringSoonItems}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">{tLocal.expiring}</span>
                    </div>
                </div>
            </div>

            {/* Expiring Soon Section */}
            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertCircle size={20} className="text-red-500" />
                    {tLocal.expiringTitle}
                </h2>

                {expiringSoonItems === 0 && expiredItems === 0 ? (
                    /* Empty State / Good State Card */
                    <div className="bg-white rounded-3xl p-8 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center shadow-sm">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle size={32} strokeWidth={3} />
                        </div>
                        <p className="text-gray-400 font-medium text-lg">{tLocal.goodState}</p>
                    </div>
                ) : (
                    /* List of expiring items */
                    <div className="space-y-3">
                        {expiredItems > 0 && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center justify-between">
                                <span className="text-red-600 font-bold flex items-center gap-2">
                                    <AlertCircle size={18} /> {expiredItems} {tLocal.expired}
                                </span>
                                <button
                                    onClick={() => onNavigate && onNavigate('inventory')}
                                    className="text-xs bg-white text-red-600 px-3 py-1.5 rounded-full font-bold shadow-sm"
                                >
                                    {tLocal.check}
                                </button>
                            </div>
                        )}

                        {expiringList.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex items-center gap-4">
                                <div className="text-2xl bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center">
                                    {item.emoji || '📦'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                                            Expiring soon
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {item.quantity} {item.unit}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {expiringSoonItems > 3 && (
                            <button
                                onClick={() => onNavigate && onNavigate('inventory')}
                                className="w-full text-center text-sm text-gray-400 py-2 hover:text-emerald-500"
                            >
                                View all expiring items
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
