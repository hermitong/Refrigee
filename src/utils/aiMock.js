import { addDays } from 'date-fns';

const KNOWLEDGE_BASE = {
    // Fruits
    'apple': { category: 'Fruit', shelfLife: 14, emoji: '🍎' },
    'banana': { category: 'Fruit', shelfLife: 5, emoji: '🍌' },
    'orange': { category: 'Fruit', shelfLife: 14, emoji: '🍊' },
    'grape': { category: 'Fruit', shelfLife: 7, emoji: '🍇' },
    'strawberry': { category: 'Fruit', shelfLife: 3, emoji: '🍓' },

    // Vegetables
    'carrot': { category: 'Vegetable', shelfLife: 21, emoji: '🥕' },
    'lettuce': { category: 'Vegetable', shelfLife: 5, emoji: '🥬' },
    'tomato': { category: 'Vegetable', shelfLife: 7, emoji: '🍅' },
    'potato': { category: 'Vegetable', shelfLife: 30, emoji: '🥔' },
    'onion': { category: 'Vegetable', shelfLife: 30, emoji: '🧅' },
    'spinach': { category: 'Vegetable', shelfLife: 4, emoji: '🥬' },

    // Dairy
    'milk': { category: 'Dairy', shelfLife: 7, emoji: '🥛' },
    'cheese': { category: 'Dairy', shelfLife: 14, emoji: '🧀' },
    'yogurt': { category: 'Dairy', shelfLife: 10, emoji: '🥣' },
    'butter': { category: 'Dairy', shelfLife: 60, emoji: '🧈' },
    'egg': { category: 'Dairy', shelfLife: 21, emoji: '🥚' },

    // Meat
    'chicken': { category: 'Meat', shelfLife: 2, emoji: '🍗' },
    'beef': { category: 'Meat', shelfLife: 3, emoji: '🥩' },
    'pork': { category: 'Meat', shelfLife: 3, emoji: '🥓' },
    'fish': { category: 'Meat', shelfLife: 2, emoji: '🐟' },

    // Pantry
    'bread': { category: 'Bakery', shelfLife: 5, emoji: '🍞' },
    'rice': { category: 'Pantry', shelfLife: 365, emoji: '🍚' },
    'pasta': { category: 'Pantry', shelfLife: 365, emoji: '🍝' },
};

export function predictItemDetails(name) {
    const lowerName = name.toLowerCase().trim();

    // Direct match
    if (KNOWLEDGE_BASE[lowerName]) {
        return {
            ...KNOWLEDGE_BASE[lowerName],
            defaultExpiration: addDays(new Date(), KNOWLEDGE_BASE[lowerName].shelfLife)
        };
    }

    // Partial match (simple includes)
    const match = Object.keys(KNOWLEDGE_BASE).find(key => lowerName.includes(key));
    if (match) {
        return {
            ...KNOWLEDGE_BASE[match],
            defaultExpiration: addDays(new Date(), KNOWLEDGE_BASE[match].shelfLife)
        };
    }

    // Default fallback
    return {
        category: 'Other',
        emoji: '📦',
        defaultExpiration: addDays(new Date(), 7) // Default 1 week
    };
}

export const RECIPES = [
    {
        id: 1,
        name: "Fruit Salad",
        ingredients: ["Apple", "Banana", "Orange", "Grape", "Strawberry"],
        minIngredients: 2,
        emoji: "🥗",
        description: "A fresh and healthy mix of fruits."
    },
    {
        id: 2,
        name: "Vegetable Stir Fry",
        ingredients: ["Carrot", "Onion", "Spinach", "Potato"],
        minIngredients: 2,
        emoji: "🥘",
        description: "Quick stir fry with available veggies."
    },
    {
        id: 3,
        name: "Omelette",
        ingredients: ["Egg", "Milk", "Cheese", "Tomato", "Onion"],
        minIngredients: 2,
        emoji: "🍳",
        description: "Classic breakfast dish."
    },
    {
        id: 4,
        name: "Creamy Pasta",
        ingredients: ["Pasta", "Milk", "Cheese", "Butter"],
        minIngredients: 3,
        emoji: "🍝",
        description: "Rich and creamy pasta."
    },
    {
        id: 5,
        name: "Chicken Salad",
        ingredients: ["Chicken", "Lettuce", "Tomato", "Onion"],
        minIngredients: 2,
        emoji: "🥗",
        description: "Healthy protein-packed salad."
    },
    {
        id: 6,
        name: "Steak & Potatoes",
        ingredients: ["Beef", "Potato", "Butter"],
        minIngredients: 2,
        emoji: "🥩",
        description: "Hearty meal for meat lovers."
    }
];
