import { GoogleGenAI } from '@google/genai';
import { predictItemDetails, RECIPES } from '../utils/aiMock.js';

// 使用稳定的免费模型,避免配额限制
const MODEL_NAME = 'gemini-1.5-flash';

// 从 localStorage 获取 API Key
function getApiKey() {
    return localStorage.getItem('refrigee_api_key');
}

// 检查 AI 是否可用 - 检查自定义 Key 或应用 Key
export function isAIAvailable() {
    const customKey = localStorage.getItem('custom_api_key');
    const appKey = localStorage.getItem('refrigee_api_key');
    const apiKey = customKey || appKey;
    return apiKey && apiKey.trim().length > 0;
}

// 获取 AI 实例 - 优先使用自定义 API Key
function getAI() {
    // 优先使用用户在设置中配置的自定义 Key
    const customKey = localStorage.getItem('custom_api_key');
    // 其次使用应用配置的 Key
    const appKey = localStorage.getItem('refrigee_api_key');

    const apiKey = customKey || appKey;

    if (!apiKey) {
        throw new Error('API Key not configured');
    }
    return new GoogleGenAI({ apiKey });
}

/**
 * 使用 AI 分类物品
 * @param {string} itemName - 物品名称
 * @param {string} lang - 语言 ('en' | 'zh')
 * @returns {Promise<{category: string, emoji: string, shelfLifeDays: number}>}
 */
export async function classifyItemWithAI(itemName, lang = 'zh') {
    // 如果 AI 不可用,使用 Mock
    if (!isAIAvailable()) {
        const mockResult = predictItemDetails(itemName);
        return {
            category: mockResult.category,
            emoji: mockResult.emoji,
            shelfLifeDays: mockResult.shelfLife || 7
        };
    }

    const ai = getAI();
    const langInstruction = lang === 'zh' ? '用中文回答' : 'Respond in English';

    const prompt = `分类食材"${itemName}"。${langInstruction}
  返回 JSON 格式:
  - category: 类别,从以下选择 [Fruit, Vegetable, Meat, Dairy, Grain, Beverage, Snack, Condiment, Other]
  - emoji: 一个代表性的 emoji 表情符号
  - shelfLifeDays: 在冰箱中的预估保质期天数(整数)
  
  上下文:管理家庭冰箱库存。`;

    const schema = {
        type: 'object',
        properties: {
            category: { type: 'string' },
            emoji: { type: 'string' },
            shelfLifeDays: { type: 'integer' },
        },
        required: ['category', 'emoji', 'shelfLifeDays'],
    };

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
                temperature: 0.3,
            },
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        throw new Error('No response text');
    } catch (error) {
        console.error('AI Classification Error:', error);
        // 降级到 Mock
        const mockResult = predictItemDetails(itemName);
        return {
            category: mockResult.category,
            emoji: mockResult.emoji,
            shelfLifeDays: mockResult.shelfLife || 7
        };
    }
}

/**
 * 从图片识别食材
 * @param {string} base64Image - Base64 编码的图片
 * @param {string} lang - 语言 ('en' | 'zh')
 * @returns {Promise<{name: string, category: string, emoji: string, shelfLifeDays: number}>}
 */
export async function identifyItemFromImage(base64Image, lang = 'zh') {
    // 如果 AI 不可用,返回空结果
    if (!isAIAvailable()) {
        return {
            name: '',
            category: 'Other',
            emoji: '📸',
            shelfLifeDays: 7
        };
    }

    const ai = getAI();
    const langInstruction = lang === 'zh' ? '用简体中文回答' : 'Respond in English';

    const prompt = `识别图片中的主要食材。${langInstruction}
  返回 JSON 格式:
  - name: 食材名称(简洁)
  - category: 类别,从以下选择 [Fruit, Vegetable, Meat, Dairy, Grain, Beverage, Snack, Condiment, Other]
  - emoji: 一个代表性的 emoji 表情符号
  - shelfLifeDays: 在冰箱中的预估保质期天数(整数)`;

    const schema = {
        type: 'object',
        properties: {
            name: { type: 'string' },
            category: { type: 'string' },
            emoji: { type: 'string' },
            shelfLifeDays: { type: 'integer' },
        },
        required: ['name', 'category', 'emoji', 'shelfLifeDays'],
    };

    // 清理 base64 前缀
    const cleanBase64 = base64Image.includes(',')
        ? base64Image.split(',')[1]
        : base64Image;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
                    { text: prompt }
                ]
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
                temperature: 0.4,
            },
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        throw new Error('No response text');
    } catch (error) {
        console.error('AI Image ID Error:', error);
        return {
            name: '',
            category: 'Other',
            emoji: '📸',
            shelfLifeDays: 7
        };
    }
}

/**
 * 获取"今天吃什么"推荐
 * @param {string} lang - 语言 ('en' | 'zh')
 * @returns {Promise<Object|null>} 食谱对象或 null
 */
export async function getWhatToEatRecommendation(lang = 'zh') {
    // 如果 AI 不可用,返回随机 Mock 食谱
    if (!isAIAvailable()) {
        const randomRecipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];
        return {
            id: `mock-${Date.now()}`,
            name: randomRecipe.name,
            description: randomRecipe.description,
            ingredients: randomRecipe.ingredients,
            instructions: ['准备食材', '按照常规方法烹饪', '享用美食'],
            timeMinutes: 30,
            matchPercentage: 100,
            calories: 500,
            emoji: randomRecipe.emoji
        };
    }

    const ai = getAI();
    const langInstruction = lang === 'zh' ? '用简体中文回答' : 'Respond in English';

    const prompt = `推荐一道随机的、美味的中式家常菜,类似"今天吃什么"或"HowToCook"项目中的菜谱。
  适合午餐或晚餐。${langInstruction}
  
  返回 JSON 格式:
  - name: 菜谱名称
  - description: 简短有趣的描述(例如:"经典的辣味选择!")
  - ingredients: 所需食材列表
  - instructions: 简要步骤
  - timeMinutes: 总耗时(分钟)
  - matchPercentage: 设为 100(因为这是随机推荐)
  - calories: 预估热量`;

    const schema = {
        type: 'object',
        properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            ingredients: { type: 'array', items: { type: 'string' } },
            instructions: { type: 'array', items: { type: 'string' } },
            timeMinutes: { type: 'integer' },
            matchPercentage: { type: 'integer' },
            calories: { type: 'integer' },
        },
        required: ['name', 'ingredients', 'instructions', 'timeMinutes'],
    };

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
                temperature: 1.1, // 高温度以增加随机性
            },
        });

        if (response.text) {
            const recipe = JSON.parse(response.text);
            return { ...recipe, id: `ai-random-${Date.now()}` };
        }
        return null;
    } catch (error) {
        console.error('Random Recipe Error:', error);
        return null;
    }
}

/**
 * 基于库存生成食谱
 * @param {string[]} ingredients - 可用食材列表
 * @param {number} peopleCount - 用餐人数
 * @param {string} lang - 语言 ('en' | 'zh')
 * @returns {Promise<Array>} 食谱列表
 */
export async function generateRecipesWithAI(ingredients, peopleCount, lang = 'zh') {
    // 如果 AI 不可用,使用 Mock 食谱
    if (!isAIAvailable()) {
        const availableRecipes = RECIPES.filter(recipe => {
            const matchCount = recipe.ingredients.filter(ing =>
                ingredients.some(item =>
                    item.toLowerCase().includes(ing.toLowerCase()) ||
                    ing.toLowerCase().includes(item.toLowerCase())
                )
            ).length;
            return matchCount >= recipe.minIngredients;
        });

        return availableRecipes.slice(0, 3).map((recipe, index) => ({
            id: `mock-${Date.now()}-${index}`,
            name: recipe.name,
            description: recipe.description,
            ingredients: recipe.ingredients,
            instructions: ['准备食材', '按照常规方法烹饪', '享用美食'],
            timeMinutes: 30,
            matchPercentage: 80,
            calories: 500,
            emoji: recipe.emoji
        }));
    }

    const ai = getAI();
    const ingredientList = ingredients.join(', ');
    const langInstruction = lang === 'zh' ? '用简体中文回答' : 'Respond in English';

    const prompt = `基于这些可用食材推荐 3 个食谱:${ingredientList}。
  烹饪给 ${peopleCount} 人。
  
  风格:如果食材允许,优先推荐地道的中式家常菜(类似"今天吃什么"项目风格),否则推荐全球美食。
  优先使用提供的食材以减少浪费。${langInstruction}
  
  返回 JSON 数组,每个对象包含:
  - name: 菜谱名称
  - description: 简短诱人的描述(1句话)
  - ingredients: 所需食材列表
  - instructions: 分步骤说明
  - timeMinutes: 总耗时(分钟)
  - matchPercentage: 估算 0-100,与提供的库存匹配程度
  - calories: 预估每份热量`;

    const schema = {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                ingredients: { type: 'array', items: { type: 'string' } },
                instructions: { type: 'array', items: { type: 'string' } },
                timeMinutes: { type: 'integer' },
                matchPercentage: { type: 'integer' },
                calories: { type: 'integer' },
            },
            required: ['name', 'ingredients', 'instructions', 'timeMinutes', 'matchPercentage'],
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
                temperature: 0.7,
            },
        });

        if (response.text) {
            const recipes = JSON.parse(response.text);
            return recipes.map((recipe, index) => ({
                ...recipe,
                id: `ai-${Date.now()}-${index}`
            }));
        }
        return [];
    } catch (error) {
        console.error('Recipe Generation Error:', error);
        return [];
    }
}

/**
 * 测试 API Key 是否有效
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function testApiKey() {
    if (!isAIAvailable()) {
        return {
            success: false,
            message: 'API Key 未配置'
        };
    }

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: '你好',
            config: {
                temperature: 0.1,
            },
        });

        if (response.text) {
            return {
                success: true,
                message: 'API Key 验证成功!'
            };
        }
        return {
            success: false,
            message: '无法获取响应'
        };
    } catch (error) {
        console.error('API Key Test Error:', error);
        return {
            success: false,
            message: `验证失败: ${error.message}`
        };
    }
}
