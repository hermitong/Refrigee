import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import Recipes from './components/Recipes';
import AddItemModal from './components/AddItemModal';
import SettingsPage from './components/Settings';
import { InventoryItem, Language } from './types';
import { LayoutGrid, Refrigerator, ChefHat, Settings, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [lang, setLang] = useState<Language>('zh');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('refrigee_inventory');
    if (saved) {
      try {
        setInventory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load inventory", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('refrigee_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const handleAddItem = (newItem: Omit<InventoryItem, 'id' | 'addedDate'>) => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString(),
      addedDate: Date.now(),
    };
    setInventory(prev => [...prev, item]);
  };

  const handleDeleteItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: string, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${activeTab === tab ? 'text-emerald-600' : 'text-gray-400'}`}
    >
      <Icon size={24} strokeWidth={activeTab === tab ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-800 font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-8 no-scrollbar pb-28">
        {activeTab === 'dashboard' && (
          <Dashboard 
            inventory={inventory} 
            lang={lang} 
            onNavigate={setActiveTab} 
          />
        )}
        {activeTab === 'inventory' && (
          <InventoryList 
            inventory={inventory} 
            lang={lang} 
            onDelete={handleDeleteItem}
          />
        )}
        {activeTab === 'recipes' && (
          <Recipes 
            inventory={inventory} 
            lang={lang} 
          />
        )}
        {activeTab === 'settings' && (
          <SettingsPage
            lang={lang}
            setLang={setLang}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30">
        {/* Curved background effect or transparent spacer could go here if needed, but standard bar works well for this design */}
        <div className="bg-white border-t border-gray-100 h-[70px] flex justify-between items-center px-2 relative shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          
          <div className="flex-1 flex justify-around">
            <NavButton tab="dashboard" icon={LayoutGrid} label={lang === 'en' ? 'Home' : '首页'} />
            <NavButton tab="inventory" icon={Refrigerator} label={lang === 'en' ? 'Fridge' : '库存'} />
          </div>

          <div className="w-16 relative flex justify-center">
             {/* The FAB sits on top of the nav bar */}
             <button 
              onClick={() => setIsAddModalOpen(true)}
              className="absolute -top-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-emerald-200 active:scale-95 transition-all"
             >
               <Plus size={32} strokeWidth={2.5} />
             </button>
          </div>

          <div className="flex-1 flex justify-around">
            <NavButton tab="recipes" icon={ChefHat} label={lang === 'en' ? 'Cook' : '食谱'} />
            <NavButton tab="settings" icon={Settings} label={lang === 'en' ? 'Settings' : '设置'} />
          </div>

        </div>
      </div>

      {/* Modals */}
      <AddItemModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddItem}
        lang={lang}
      />
    </div>
  );
};

export default App;