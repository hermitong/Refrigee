import { Home, List, ChefHat, Plus } from 'lucide-react';

export default function Layout({ children, activeTab, onTabChange, onAddClick }) {
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            {/* Mobile Container */}
            <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto pb-24">
                    {children}
                </main>

                {/* Bottom Navigation */}
                <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
                    <div className="flex justify-around items-center h-20 px-2">
                        <NavButton
                            icon={<Home size={24} />}
                            label="Home"
                            isActive={activeTab === 'dashboard'}
                            onClick={() => onTabChange('dashboard')}
                        />

                        <NavButton
                            icon={<List size={24} />}
                            label="Fridge"
                            isActive={activeTab === 'inventory'}
                            onClick={() => onTabChange('inventory')}
                        />

                        <div className="relative -top-6">
                            <button
                                onClick={onAddClick}
                                className="flex items-center justify-center w-16 h-16 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:scale-105 transition-all duration-200 active:scale-95"
                            >
                                <Plus size={32} strokeWidth={2.5} />
                            </button>
                        </div>

                        <NavButton
                            icon={<ChefHat size={24} />}
                            label="Recipes"
                            isActive={activeTab === 'recipes'}
                            onClick={() => onTabChange('recipes')}
                        />

                        {/* Placeholder for symmetry if needed, or just 3 tabs + FAB */}
                        <div className="w-12"></div>
                    </div>
                </nav>
            </div>
        </div>
    );
}

function NavButton({ icon, label, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-16 space-y-1 transition-colors duration-200 ${isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
                }`}
        >
            {icon}
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
        </button>
    );
}
