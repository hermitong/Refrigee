import React, { useMemo } from 'react';
import { Package, AlertCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

export default function Dashboard({ items, user, onNavigate }) {
    const { lang } = useTranslation();

    const now = Date.now();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;

    // 用户名显示
    const displayName = user?.isGuest
        ? '留子'
        : (user?.name || '留子');

    // 分类统计
    const categoryStats = useMemo(() => {
        const stats = {
            dairy: { label: '乳制品', labelEn: 'Dairy', count: 0 },
            produce: { label: '生鲜', labelEn: 'Produce', count: 0 },
            pantry: { label: '储藏室', labelEn: 'Pantry', count: 0 }
        };

        items.forEach(item => {
            const category = item.category?.toLowerCase();
            if (category === 'dairy' || category === 'milk' || category === 'cheese') {
                stats.dairy.count++;
            } else if (category === 'produce' || category === 'fruit' || category === 'vegetable') {
                stats.produce.count++;
            } else {
                stats.pantry.count++;
            }
        });

        return stats;
    }, [items]);

    // 即将过期的物品
    const expiringItems = useMemo(() => {
        return items
            .filter(i => {
                const expDate = new Date(i.expirationDate).getTime();
                return expDate >= now && expDate <= now + threeDaysInMs;
            })
            .sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate))
            .slice(0, 3);
    }, [items, now, threeDaysInMs]);

    // 计算剩余天数
    const getDaysLeft = (expirationDate) => {
        const expDate = new Date(expirationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // 格式化日期
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <main className="flex-grow p-6 overflow-y-auto pb-32">
            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                        你好, {displayName}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Don't waste, just taste.
                    </p>
                </div>
                <button
                    onClick={() => onNavigate && onNavigate('inventory')}
                    className="bg-emerald-500/10 dark:bg-emerald-500/20 p-2 rounded-full hover:bg-emerald-500/20 transition-colors"
                >
                    <Package className="text-emerald-500" size={28} />
                </button>
            </header>

            {/* Category Stats Grid */}
            <section className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {categoryStats.dairy.label}
                    </h2>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                        {categoryStats.dairy.count} <span className="text-base font-medium">件</span>
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {categoryStats.produce.label}
                    </h2>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                        {categoryStats.produce.count} <span className="text-base font-medium">件</span>
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 col-span-2">
                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {categoryStats.pantry.label}
                    </h2>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                        {categoryStats.pantry.count} <span className="text-base font-medium">件</span>
                    </p>
                </div>
            </section>

            {/* Expiring Soon Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="text-red-500" size={24} />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                        即将过期
                    </h2>
                </div>

                <div className="space-y-3">
                    {expiringItems.length > 0 ? (
                        <>
                            {expiringItems.map(item => {
                                const daysLeft = getDaysLeft(item.expirationDate);
                                const isUrgent = daysLeft <= 2;

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-end justify-between"
                                    >
                                        <div className="flex flex-col">
                                            <p className="font-medium text-gray-900 dark:text-gray-50">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Expires on {formatDate(item.expirationDate)}
                                            </p>
                                        </div>
                                        <p className={`text-sm font-medium ${isUrgent ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {daysLeft}天后
                                        </p>
                                    </div>
                                );
                            })}

                            <button
                                onClick={() => onNavigate && onNavigate('inventory')}
                                className="mt-4 w-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 font-medium py-3 rounded-lg text-center flex items-center justify-center gap-2 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/30 transition-colors"
                            >
                                <span>查看全部过期物品</span>
                                <ArrowRight size={20} />
                            </button>
                        </>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                所有物品都很新鲜！
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
