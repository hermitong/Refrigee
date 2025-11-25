import { useState, useEffect } from 'react';
import { RECIPES } from '../utils/aiMock';
import { Check, AlertCircle } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

export default function Recipes({ items }) {
    const [peopleCount, setPeopleCount] = useState(1);
    const { t } = useTranslation();

    // Helper to check ingredient availability
    const getRecipeMatch = (recipe) => {
        const availableIngredients = recipe.ingredients.filter(ing =>
            items.some(item => item.name.toLowerCase().includes(ing.toLowerCase()) ||
                             item.category.toLowerCase() === ing.toLowerCase())
        );
        return {
            availableIngredients,
            percentage: Math.round((availableIngredients.length / recipe.ingredients.length) * 100),
            isCookable: availableIngredients.length === recipe.ingredients.length
        };
    };

      // Get matched recipes using mock data
    const displayRecipes = RECIPES.map((recipe, index) => ({
        ...recipe,
        id: `mock-${Date.now()}-${index}`,
        ...getRecipeMatch(recipe)
    })).sort((a, b) => b.percentage - a.percentage).slice(0, 5);

    return (
        <div className="p-6 pb-24">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">食谱推荐 🍳</h1>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">烹饪人数</label>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-200"
                    >
                        -
                    </button>
                    <span className="text-xl font-bold text-gray-800 w-8 text-center">{peopleCount}</span>
                    <button
                        onClick={() => setPeopleCount(peopleCount + 1)}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-200"
                    >
                        +
                    </button>
                </div>

              </div>

            {/* Recipes List */}
            {displayRecipes.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <p>暂无食谱推荐</p>
                    <p className="text-sm mt-2">添加一些食材到冰箱吧!</p>
                </div>
            )}

            <div className="space-y-4">
                {displayRecipes.map(recipe => (
                    <div key={recipe.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                                <span className="text-3xl">{recipe.emoji || '🍽️'}</span>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{recipe.name}</h3>
                                    {recipe.description && (
                                        <p className="text-xs text-gray-500 mt-1">{recipe.description}</p>
                                    )}
                                </div>
                            </div>
                            {recipe.isCookable && (
                                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                                    可烹饪
                                </span>
                            )}
                        </div>

                        <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">食材匹配度</span>
                                <span className={recipe.percentage === 100 ? 'text-emerald-600 font-bold' : 'text-gray-600'}>{recipe.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${recipe.percentage >= 70 ? 'bg-emerald-500' : recipe.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-400'}`}
                                    style={{ width: `${recipe.percentage}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">所需食材:</h4>
                            <div className="flex flex-wrap gap-1">
                                {recipe.ingredients.map((ing, idx) => {
                                    const hasIt = items.some(item =>
                                        item.name.toLowerCase().includes(ing.toLowerCase()) ||
                                        ing.toLowerCase().includes(item.name.toLowerCase())
                                    );
                                    return (
                                        <span
                                            key={idx}
                                            className={`text-[10px] px-2 py-1 rounded-full border ${hasIt ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-100 border-gray-200 text-gray-400'}`}
                                        >
                                            {ing}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Instructions */}
                        {recipe.instructions && recipe.instructions.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">烹饪步骤:</h4>
                                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                                    {recipe.instructions.map((step, idx) => (
                                        <li key={idx}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                            {recipe.timeMinutes && (
                                <span>⏱️ {recipe.timeMinutes} 分钟</span>
                            )}
                            {recipe.calories && (
                                <span>🔥 {recipe.calories} 卡路里</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
