import React, { createContext, useContext, useState } from 'react';
import { zhCN } from '../locales/zh-CN';

// English translations (existing text)
const enUS = {
  // Layout
  nav: {
    home: "Home",
    fridge: "Fridge",
    recipes: "Recipes"
  },

  // Dashboard
  dashboard: {
    greeting: "Good Day! ☀️",
    subtitle: "Here's what's happening in your fridge.",
    expiringSoon: "Expiring Soon",
    allGood: "All Good",
    itemsNeedAttention: "Items need attention",
    totalItems: "Total Items",
    inInventory: "In your inventory",
    expiredItems: "Expired Items",
    checkAndRemove: "Please check and remove them.",
    quickActions: "Quick Actions",
    planningMeal: "Planning a meal?",
    getRecipeSuggestions: "Get Recipe Suggestions"
  },

  // Inventory
  inventory: {
    title: "My Fridge 🍎",
    empty: "Your fridge is empty.",
    tapToAdd: "Tap + to add groceries!",
    expired: "Expired",
    expiresIn: "Expires in {{days}} days"
  },

  // Recipes
  recipes: {
    title: "What to Cook? 🍳",
    cookingForHowMany: "Cooking for how many?",
    readyToCook: "Ready to Cook",
    match: "Match"
  },

  // AddItemModal
  addItem: {
    title: "Add Item",
    itemName: "Item Name",
    placeholder: "e.g. Milk, Apple...",
    quantity: "Quantity",
    category: "Category",
    expirationDate: "Expiration Date",
    addToFridge: "Add to Fridge",
    select: "Select..."
  },

  // Categories
  categories: {
    fruit: "Fruit",
    vegetable: "Vegetable",
    dairy: "Dairy",
    meat: "Meat",
    bakery: "Bakery",
    pantry: "Pantry",
    other: "Other"
  },

  // Units
  units: {
    pcs: "pcs",
    kg: "kg",
    g: "g",
    l: "L"
  }
};

const translations = {
  'en-US': enUS,
  'zh-CN': zhCN
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('zh-CN'); // Default to Chinese

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    if (!value) return key;

    // Handle interpolation with {{param}} syntax
    return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, lang: language, t, changeLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}