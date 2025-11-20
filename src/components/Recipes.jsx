import { useState } from 'react';
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

        const matchCount = availableIngredients.length;
        const percentage = Math.round((matchCount / recipe.ingredients.length) * 100);
        const isCookable = matchCount >= recipe.minIngredients;

        return { matchCount, percentage, isCookable, availableIngredients };
    };

    const sortedRecipes = RECIPES.map(recipe => ({
        ...recipe,
        ...getRecipeMatch(recipe)
    })).sort((a, b) => b.percentage - a.percentage);

    return (
        <div className="p-6 pb-24">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('recipes.title')}</h1>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('recipes.cookingForHowMany')}</label>
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

            <div className="space-y-4">
                {sortedRecipes.map(recipe => (
                    <div key={recipe.id} className={`p-4 rounded-2xl border ${recipe.isCookable ? 'bg-white border-emerald-100 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{recipe.emoji}</span>
                                <div>
                                    <h3 className="font-bold text-gray-800">{recipe.name}</h3>
                                    <p className="text-xs text-gray-500">{recipe.description}</p>
                                </div>
                            </div>
                            {recipe.isCookable && (
                                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                                    {t('recipes.readyToCook')}
                                </span>
                            )}
                        </div>

                        <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">{t('recipes.match')}</span>
                                <span className={recipe.percentage === 100 ? 'text-emerald-600 font-bold' : 'text-gray-600'}>{recipe.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${recipe.percentage >= 70 ? 'bg-emerald-500' : recipe.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-400'}`}
                                    style={{ width: `${recipe.percentage}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1">
                            {recipe.ingredients.map((ing, idx) => {
                                const hasIt = recipe.availableIngredients.includes(ing);
                                return (
                                    <span key={idx} className={`text-[10px] px-2 py-1 rounded-full border ${hasIt ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                                        {ing}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
