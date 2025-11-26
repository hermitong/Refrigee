/**
 * Gemini服务适配器
 * 将现有的Gemini逻辑提取为适配器模式
 */

import { GoogleGenAI } from '@google/genai';

const MODEL_NAME = 'gemini-1.5-flash';

/**
 * 创建Gemini AI实例
 */
function getAI(config) {
    if (!config.apiKey) {
        throw new Error('API Key not configured');
    }
    return new GoogleGenAI({ apiKey: config.apiKey });
}

/**
 * 分类物品
 * @param {Object} config - 服务商配置
 * @param {string} itemName - 物品名称
 * @param {string} lang - 语言
 */
export async function classifyItem(config, itemName, lang = 'zh') {
    const ai = getAI(config);
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
            model: config.model || MODEL_NAME,
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
        console.error('Gemini Classification Error:', error);
        throw error;
    }
}

/**
 * 从图片识别食材
 * @param {Object} config - 服务商配置
 * @param {string} base64Image - Base64编码的图片
 * @param {string} lang - 语言
 */
export async function identifyImage(config, base64Image, lang = 'zh') {
    const ai = getAI(config);
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
            model: config.model || MODEL_NAME,
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
        console.error('Gemini Image ID Error:', error);
        throw error;
    }
}

/**
 * 生成食谱
 * @param {Object} config - 服务商配置
 * @param {string[]} ingredients - 可用食材列表
 * @param {number} peopleCount - 用餐人数
 * @param {string} lang - 语言
 */
export async function generateRecipes(config, ingredients, peopleCount, lang = 'zh') {
    const ai = getAI(config);
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
            model: config.model || MODEL_NAME,
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
        console.error('Gemini Recipe Generation Error:', error);
        throw error;
    }
}

/**
 * 获取"今天吃什么"推荐
 * @param {Object} config - 服务商配置
 * @param {string} lang - 语言
 */
export async function getWhatToEat(config, lang = 'zh') {
    const ai = getAI(config);
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
            model: config.model || MODEL_NAME,
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
        console.error('Gemini Random Recipe Error:', error);
        throw error;
    }
}

/**
 * 测试连接
 * @param {Object} config - 服务商配置
 */
export async function testConnection(config) {
    try {
        const ai = getAI(config);
        const response = await ai.models.generateContent({
            model: config.model || MODEL_NAME,
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
        console.error('Gemini Test Error:', error);
        return {
            success: false,
            message: `验证失败: ${error.message}`
        };
    }
}
