import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { ChefHat, Clock, AlertCircle } from 'lucide-react';

const MOCK_RECIPES = [
    {
        id: 1,
        title: { en: 'Tomato Scrambled Eggs', zh: '番茄炒蛋' },
        ingredients: ['Tomato', 'Egg'],
        difficulty: 'Easy',
        time: '10 min'
    },
    {
        id: 2,
        title: { en: 'Cola Chicken Wings', zh: '可乐鸡翅' },
        ingredients: ['Chicken Wing', 'Cola', 'Ginger'],
        difficulty: 'Medium',
        time: '30 min'
    },
    {
        id: 3,
        title: { en: 'Pasta Bolognese', zh: '肉酱意面' },
        ingredients: ['Pasta', 'Ground Meat', 'Tomato', 'Onion'],
        difficulty: 'Medium',
        time: '25 min'
    },
    {
        id: 4,
        title: { en: 'Fruit Salad', zh: '水果沙拉' },
        ingredients: ['Apple', 'Banana', 'Yogurt'],
        difficulty: 'Easy',
        time: '5 min'
    },
    {
        id: 5,
        title: { en: 'Instant Noodles Deluxe', zh: '豪华泡面' },
        ingredients: ['Instant Noodles', 'Egg', 'Sausage', 'Vegetable'],
        difficulty: 'Easy',
        time: '5 min'
    }
];

export default function RecipeView({ items = [] }) { // 接收 items prop
    const { lang, t } = useTranslation();

    // 简单的匹配逻辑：检查有多少成分匹配用户物品名称（部分字符串匹配）
    const recipesWithMatch = MOCK_RECIPES.map(recipe => {
        const userItemNames = items.map(i => i.name.toLowerCase());
        const matches = recipe.ingredients.filter(ing =>
            userItemNames.some(uItem => uItem.includes(ing.toLowerCase()) || ing.toLowerCase().includes(uItem))
        );
        return { ...recipe, matches };
    }).sort((a, b) => b.matches.length - a.matches.length);

    return (
        <div className="pb-24 p-6">
            <h2 className="text-xl font-bold mb-4 text-slate-800">能做什么吃？</h2>

            <div className="space-y-4">
                {recipesWithMatch.map(recipe => {
                    const matchCount = recipe.matches.length;
                    const totalCount = recipe.ingredients.length;
                    const isCookable = matchCount === totalCount;

                    return (
                        <div key={recipe.id} className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-4 border-l-4 ${isCookable ? 'border-l-emerald-500' : 'border-l-orange-300'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-slate-800">{recipe.title[lang] || recipe.title.zh}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${isCookable ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                                    {matchCount}/{totalCount}
                                </span>
                            </div>

                            <div className="flex gap-2 flex-wrap mb-3">
                                {recipe.ingredients.map((ing, idx) => {
                                    const isHave = recipe.matches.includes(ing);
                                    return (
                                        <span key={idx} className={`text-xs px-2 py-1 rounded border ${isHave ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                            {ing}
                                        </span>
                                    );
                                })}
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <div className="text-xs text-slate-500 flex gap-3">
                                    <span className="flex items-center gap-1"><Clock size={14} /> {recipe.time}</span>
                                    <span className="flex items-center gap-1"><ChefHat size={14} /> {recipe.difficulty}</span>
                                </div>
                                <button className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors">
                                    做这道菜
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
