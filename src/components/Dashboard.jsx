import { differenceInDays, parseISO } from 'date-fns';
import { useTranslation } from '../contexts/LanguageContext';

export default function Dashboard({ items }) {
    const { t } = useTranslation();

    const expiringSoonCount = items.filter(item => {
        const days = differenceInDays(parseISO(item.expirationDate), new Date());
        return days >= 0 && days <= 3;
    }).length;

    const expiredCount = items.filter(item => {
        const days = differenceInDays(parseISO(item.expirationDate), new Date());
        return days < 0;
    }).length;

    return (
        <div className="p-6 space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.greeting')}</h1>
                <p className="text-gray-500">{t('dashboard.subtitle')}</p>
            </header>

            <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border ${expiringSoonCount > 0 ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'}`}>
                    <p className={`${expiringSoonCount > 0 ? 'text-orange-600' : 'text-green-600'} font-medium text-sm`}>
                        {expiringSoonCount > 0 ? t('dashboard.expiringSoon') : t('dashboard.allGood')}
                    </p>
                    <p className={`text-3xl font-bold mt-1 ${expiringSoonCount > 0 ? 'text-orange-800' : 'text-green-800'}`}>
                        {expiringSoonCount}
                    </p>
                    <p className={`text-xs mt-1 ${expiringSoonCount > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                        {t('dashboard.itemsNeedAttention')}
                    </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-blue-600 font-medium text-sm">{t('dashboard.totalItems')}</p>
                    <p className="text-3xl font-bold text-blue-800 mt-1">{items.length}</p>
                    <p className="text-xs text-blue-400 mt-1">{t('dashboard.inInventory')}</p>
                </div>
            </div>

            {expiredCount > 0 && (
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center justify-between">
                    <div>
                        <p className="text-red-800 font-bold">⚠️ {expiredCount} {t('dashboard.expiredItems')}</p>
                        <p className="text-red-500 text-xs">{t('dashboard.checkAndRemove')}</p>
                    </div>
                </div>
            )}

            <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">{t('dashboard.quickActions')}</h2>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                    <p className="text-gray-500 text-sm mb-4">{t('dashboard.planningMeal')}</p>
                    <button className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full font-medium hover:bg-emerald-200 transition-colors">
                        {t('dashboard.getRecipeSuggestions')}
                    </button>
                </div>
            </section>
        </div>
    );
}
