import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InventoryView from './components/InventoryView';
import AddItemView from './components/AddItemView';
import RecipeView from './components/RecipeView';
import SettingsComponent from './components/Settings';

export default function RefrigeeApp() {
  // --- State ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [items, setItems] = useState([]);
  const [user, setUser] = useState({ name: '留子', isGuest: true, avatar: '👤' });

  // --- Effects ---
  useEffect(() => {
    const saved = localStorage.getItem('refrigee_items');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse items", e);
      }
    }

    const savedUser = localStorage.getItem('refrigee_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to load user", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('refrigee_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('refrigee_user', JSON.stringify(user));
  }, [user]);

  // --- Handlers ---
  const handleAddItem = (newItem) => {
    setItems(prev => [...prev, newItem]);
    setActiveTab('inventory');
  };

  const handleDeleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
  };

  // --- Render ---
  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onAddClick={() => setActiveTab('add')}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {activeTab === 'dashboard' && (
            <Dashboard
              items={items}
              user={user}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              items={items}
              onDelete={handleDeleteItem}
            />
          )}

          {activeTab === 'add' && (
            <AddItemView
              onAdd={handleAddItem}
            />
          )}

          {activeTab === 'recipes' && (
            <RecipeView items={items} />
          )}

          {activeTab === 'settings' && (
            <SettingsComponent />
          )}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
