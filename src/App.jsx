import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Recipes from './components/Recipes';
import Settings from './components/Settings';
import AddItemModal from './components/AddItemModal';
import { useInventory } from './hooks/useInventory';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { items, addItem, removeItem } = useInventory();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard items={items} />;
      case 'inventory':
        return <Inventory items={items} onDelete={removeItem} />;
      case 'recipes':
        return <Recipes items={items} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard items={items} />;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onAddClick={() => setIsAddModalOpen(true)}
    >
      {renderContent()}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addItem}
      />
    </Layout>
  );
}

export default App;
