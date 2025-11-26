import { useState, useEffect } from 'react';
import { RECIPES } from '../utils/aiMock';
import { Check, AlertCircle, Sparkles, Loader2, Dice5 } from 'lucide-react';
import { generateRecipesWithAI, getWhatToEatRecommendation, isAIAvailable } from '../services/geminiService';

export default function Recipes({ items }) {
    const [peopleCount, setPeopleCount] = useState(1);
    const [aiRecipes, setAiRecipes] = useState([]);
    const [loadingAI, setLoadingAI] = useState(false);
    const [randomRecipe, setRandomRecipe] = useState(null);
    const [loadingRandom, setLoadingRandom] = useState(false);

    // 自动生成 AI 食谱
    useEffect(() => {
        if (items.length > 0) {
            handleGenerateRecipes();
        }
    }, [items, peopleCount]);

    const handleGenerateRecipes = async () => {
        if (items.length === 0) return;

        setLoadingAI(true);
        try {
            const ingredientNames = items.map(item => item.name);

            if (isAIAvailable()) {
                // 使用真实 AI
                const recipes = await generateRecipesWithAI(ingredientNames, peopleCount, 'zh');
                setAiRecipes(recipes);
            } else {
                // 降级到 Mock
                const mockRecipes = getMockRecipes(ingredientNames);
                setAiRecipes(mockRecipes);
            }
        } catch (error) {
            console.error('Recipe generation error:', error);
            // 降级到 Mock
            const mockRecipes = getMockRecipes(items.map(item => item.name));
            setAiRecipes(mockRecipes);
        } finally {
            setLoadingAI(false);
        }
    };

    const getMockRecipes = (ingredientNames) => {
        return RECIPES.filter(recipe => {
            const matchCount = recipe.ingredients.filter(ing =>
                ingredientNames.some(item =>
                    item.toLowerCase().includes(ing.toLowerCase()) ||
                    ing.toLowerCase().includes(item.toLowerCase())
                )
            ).length;
            return matchCount >= recipe.minIngredients;
        }).slice(0, 3).map((recipe, index) => ({
            id: `mock-${Date.now()}-${index}`,
            name: recipe.name,
            description: recipe.description,
            ingredients: recipe.ingredients,
            instructions: ['准备食材', '按照常规方法烹饪', '享用美食'],
            timeMinutes: 30,
            matchPercentage: Math.round((recipe.ingredients.filter(ing =>
                ingredientNames.some(item =>
                    item.toLowerCase().includes(ing.toLowerCase())
                )
            ).length / recipe.ingredients.length) * 100),
            calories: 500,
            emoji: recipe.emoji
        }));
    };

    const handleWhatToEat = async () => {
        setLoadingRandom(true);
        try {
            const recipe = await getWhatToEatRecommendation('zh');
            setRandomRecipe(recipe);
        } catch (error) {
            console.error('Random recipe error:', error);
        } finally {
            setLoadingRandom(false);
        }
    };

    const displayRecipes = randomRecipe ? [randomRecipe] : aiRecipes;

    return (
        <div className="p-6 pb-24">
            {/* AI大厨标题 */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span>👨‍🍳</span> AI 大厨
                </h1>
                <p className="text-gray-500 text-sm mt-1">今天吃什么?</p>
            </div>

            {/* Controls */}
            <div className="space-y-4 mb-6">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <span>👥</span> 用餐人数
                    </label>
                    <div className="flex items-center justify-center space-x-6">
                        <button
                            onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                            className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
                        >
                            -
                        </button>
                        <span className="text-3xl font-bold text-gray-800 w-12 text-center">{peopleCount}</span>
                        <button
                            onClick={() => setPeopleCount(peopleCount + 1)}
                            className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* 两个按钮并排 */}
                <div className="grid grid-cols-2 gap-3">
                    {/* 冰箱匹配按钮 */}
                    <button
                        onClick={handleGenerateRecipes}
                        disabled={loadingAI || items.length === 0}
                        className="bg-gray-100 text-gray-700 p-4 rounded-2xl font-medium hover:bg-gray-200 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Sparkles size={20} />
                        <span className="text-sm">冰箱匹配</span>
                    </button>

                    {/* 随便来一个按钮 */}
                    <button
                        onClick={handleWhatToEat}
                        disabled={loadingRandom}
                        className="bg-emerald-500 text-white p-4 rounded-2xl font-medium hover:bg-emerald-600 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 shadow-lg"
                    >
                        {loadingRandom ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span className="text-sm">思考中...</span>
                            </>
                        ) : (
                            <>
                                <Dice5 size={20} />
                                <span className="text-sm">随便来一个</span>
                            </>
                        )}
                    </button>
                </div>

                {/* 提示文案 */}
                <p className="text-center text-xs text-gray-400">
                    {items.length === 0 ? '冰箱是空的! 试试"随便来一个"!' : `冰箱匹配基于您的 ${items.length} 件食材`}
                </p>

                {randomRecipe && (
                    <button
                        onClick={() => setRandomRecipe(null)}
                        className="w-full bg-gray-100 text-gray-600 p-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                        返回推荐列表
                    </button>
                )}
            </div>

            {/* AI Status Indicator */}
            {!isAIAvailable() && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-xl text-sm mb-4 flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>使用 Mock 食谱 (前往设置配置 API Key 以启用 AI 生成)</span>
                </div>
            )}

            {/* Loading State */}
            {loadingAI && !randomRecipe && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <Loader2 className="animate-spin text-emerald-500 mx-auto mb-2" size={32} />
                        <p className="text-gray-500">AI 正在生成食谱...</p>
                    </div>
                </div>
            )}

            {/* Recipes List */}
            {!loadingAI && displayRecipes.length === 0 && (
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
                            {recipe.matchPercentage >= 70 && (
                                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                    <Check size={12} />
                                    可烹饪
                                </span>
                            )}
                        </div>

                        {/* Match Percentage */}
                        {recipe.matchPercentage !== undefined && (
                            <div className="mt-3">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-500">食材匹配度</span>
                                    <span className={recipe.matchPercentage === 100 ? 'text-emerald-600 font-bold' : 'text-gray-600'}>
                                        {recipe.matchPercentage}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${recipe.matchPercentage >= 70 ? 'bg-emerald-500' : recipe.matchPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-400'}`}
                                        style={{ width: `${recipe.matchPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

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
