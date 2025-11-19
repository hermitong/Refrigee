import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'refrigee_inventory_v1';

export function useInventory() {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = (item) => {
        const newItem = {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            ...item
        };
        setItems(prev => [newItem, ...prev]);
    };

    const removeItem = (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateItem = (id, updates) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    };

    return {
        items,
        addItem,
        removeItem,
        updateItem
    };
}
