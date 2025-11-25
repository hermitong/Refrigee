import React, { useState } from 'react';
import { InventoryItem, Recipe, Language } from '../types';
import { generateRecipesWithAI, getWhatToEatRecommendation } from '../services/geminiService';
import { ChefHat, Clock, Flame, Sparkles, ChevronDown, ChevronUp, Users, Dices } from 'lucide-react';

interface RecipesProps {
  inventory: InventoryItem[];
  lang: Language;
}

const Recipes: React.FC<RecipesProps> = ({ inventory, lang }) => {
  const [peopleCount, setPeopleCount] = useState(1);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (inventory.length === 0) return;
    setLoading(true);
    setRecipes([]); // clear previous
    try {
      const ingredientNames = inventory.map(i => i.name);
      const result = await generateRecipesWithAI(ingredientNames, peopleCount, lang);
      setRecipes(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomPick = async () => {
    setLoading(true);
    setRecipes([]);
    try {
      const result = await getWhatToEatRecommendation(lang);
      if (result) {
        setRecipes([result]);
        setExpandedRecipeId(result.id); // Auto expand
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedRecipeId(expandedRecipeId === id ? null : id);
  };

  const labels = {
    en: {
      title: "Chef AI",
      subtitle: "What to cook today?",
      people: "People eating",
      generate: "Match Inventory",
      random: "Surprise Me!",
      generating: "Thinking...",
      noItems: "Add items to your fridge for matching, or use 'Surprise Me'!",
      time: "min",
      match: "Match",
      ingredients: "Ingredients",
      instructions: "Instructions"
    },
    zh: {
      title: "AI 大厨",
      subtitle: "今天吃什么？",
      people: "用餐人数",
      generate: "冰箱匹配",
      random: "随便来一个",
      generating: "思考中...",
      noItems: "冰箱是空的？试试“随便来一个”！",
      time: "分钟",
      match: "匹配度",
      ingredients: "所需食材",
      instructions: "烹饪步骤"
    }
  };
  const t = labels[lang];

  return (
    <div className="pb-20">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ChefHat className="text-emerald-500" />
          {t.title}
        </h2>
        <p className="text-gray-500 text-sm">{t.subtitle}</p>
      </header>

      {/* Controls */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-medium text-gray-700 flex items-center gap-2">
            <Users size={18} className="text-gray-400" />
            {t.people}
          </span>
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
            <button 
              className="w-8 h-8 rounded-md bg-white shadow-sm font-bold text-gray-600 disabled:opacity-50"
              onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
            >
              -
            </button>
            <span className="w-4 text-center font-semibold text-gray-800">{peopleCount}</span>
            <button 
              className="w-8 h-8 rounded-md bg-white shadow-sm font-bold text-gray-600"
              onClick={() => setPeopleCount(peopleCount + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={loading || inventory.length === 0}
            className={`flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg
              ${loading || inventory.length === 0 
                ? 'bg-gray-300 shadow-none cursor-not-allowed' 
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'}`}
          >
            {loading ? (
              <Sparkles className="animate-spin" size={20}/>
            ) : (
              <Sparkles size={20}/>
            )}
            {t.generate}
          </button>
          
          <button
            onClick={handleRandomPick}
            disabled={loading}
            className="flex-1 py-3 rounded-xl font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 flex items-center justify-center gap-2 transition-all"
          >
            <Dices size={20} />
            {t.random}
          </button>
        </div>
        
        {inventory.length === 0 && <p className="text-xs text-center text-gray-400 mt-3">{t.noItems}</p>}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all animate-fade-in">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpand(recipe.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800">{recipe.name}</h3>
                <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                  recipe.matchPercentage > 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {recipe.matchPercentage}% {t.match}
                </div>
              </div>
              
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{recipe.description}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1"><Clock size={14}/> {recipe.timeMinutes} {t.time}</span>
                {recipe.calories && <span className="flex items-center gap-1"><Flame size={14}/> {recipe.calories} kcal</span>}
                <div className="flex-1 flex justify-end">
                   {expandedRecipeId === recipe.id ? <ChevronUp size={20} /> : <ChevronDown size={20}/>}
                </div>
              </div>
            </div>

            {expandedRecipeId === recipe.id && (
              <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/50">
                <div className="mt-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wide">{t.ingredients}</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-1">
                    {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                  </ul>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wide">{t.instructions}</h4>
                  <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2 ml-1">
                    {recipe.instructions.map((step, i) => <li key={i} className="pl-1"><span className="text-gray-800">{step}</span></li>)}
                  </ol>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;