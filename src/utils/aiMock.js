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
        name: "水果沙拉",
        ingredients: ["苹果", "香蕉", "橙子", "葡萄", "草莓"],
        minIngredients: 2,
        emoji: "🥗",
        description: "新鲜健康的水果混合。"
    },
    {
        id: 2,
        name: "蔬菜炒菜",
        ingredients: ["胡萝卜", "洋葱", "菠菜", "土豆"],
        minIngredients: 2,
        emoji: "🥘",
        description: "用现有蔬菜快速炒制。"
    },
    {
        id: 3,
        name: "煎蛋卷",
        ingredients: ["鸡蛋", "牛奶", "奶酪", "西红柿", "洋葱"],
        minIngredients: 2,
        emoji: "🍳",
        description: "经典早餐菜肴。"
    },
    {
        id: 4,
        name: "奶油意面",
        ingredients: ["意大利面", "牛奶", "奶酪", "黄油"],
        minIngredients: 3,
        emoji: "🍝",
        description: "浓郁顺滑的意面。"
    },
    {
        id: 5,
        name: "鸡肉沙拉",
        ingredients: ["鸡肉", "生菜", "西红柿", "洋葱"],
        minIngredients: 2,
        emoji: "🥗",
        description: "健康高蛋白沙拉。"
    },
    {
        id: 6,
        name: "牛排配土豆",
        ingredients: ["牛肉", "土豆", "黄油"],
        minIngredients: 2,
        emoji: "🥩",
        description: "肉食爱好者的丰盛餐食。"
    }
];
