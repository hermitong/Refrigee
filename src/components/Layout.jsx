import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { LayoutDashboard, Refrigerator, Plus, ChefHat, Settings } from 'lucide-react';

export default function Layout({ children, activeTab, onTabChange, onAddClick }) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 justify-between max-w-sm mx-auto shadow-2xl relative overflow-hidden">
            {/* Main Content Area */}
            <main className="flex-grow overflow-y-auto scrollbar-hide">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-6 py-2 flex justify-between items-center z-10">
                <NavButton
                    icon={LayoutDashboard}
                    label="首页"
                    isActive={activeTab === 'dashboard'}
                    onClick={() => onTabChange('dashboard')}
                />

                <NavButton
                    icon={Refrigerator}
                    label="库存"
                    isActive={activeTab === 'inventory'}
                    onClick={() => onTabChange('inventory')}
                />

                {/* Floating Action Button (Original Style) */}
                <div className="relative -top-6">
                    <button
                        onClick={onAddClick}
                        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 transition-all transform hover:scale-105 bg-emerald-500 text-white"
                    >
                        <Plus size={28} />
                    </button>
                </div>

                <NavButton
                    icon={ChefHat}
                    label="食谱"
                    isActive={activeTab === 'recipes'}
                    onClick={() => onTabChange('recipes')}
                />

                <NavButton
                    icon={Settings}
                    label="设置"
                    isActive={activeTab === 'settings'}
                    onClick={() => onTabChange('settings')}
                />
            </nav>
        </div>
    );
}

function NavButton({ icon: Icon, label, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive
                    ? 'text-emerald-600'
                    : 'text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300'
                }`}
        >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    );
}
