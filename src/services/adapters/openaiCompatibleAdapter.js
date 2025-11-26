/**
 * OpenAI兼容服务商适配器
 * 支持所有兼容OpenAI API格式的服务商
 */

import OpenAI from 'openai';

/**
 * 创建OpenAI客户端实例
 */
function createClient(config) {
    return new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL || 'https://api.openai.com/v1',
        dangerouslyAllowBrowser: true // 允许在浏览器中使用
    });
}

/**
 * 分类物品
 * @param {Object} config - 服务商配置
 * @param {string} itemName - 物品名称
 * @param {string} lang - 语言
 */
export async function classifyItem(config, itemName, lang = 'zh') {
    const client = createClient(config);
    const langInstruction = lang === 'zh' ? '用中文回答' : 'Respond in English';

    const prompt = `分类食材"${itemName}"。${langInstruction}
返回JSON格式,包含以下字段:
- category: 类别,从以下选择 [Fruit, Vegetable, Meat, Dairy, Grain, Beverage, Snack, Condiment, Other]
- emoji: 一个代表性的emoji表情符号
- shelfLifeDays: 在冰箱中的预估保质期天数(整数)`;

    try {
        const response = await client.chat.completions.create({
            model: config.model,
            messages: [
                {
                    role: 'system',
                    content: '你是一个食材分类助手,返回JSON格式的结果。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3
        });

        const result = JSON.parse(response.choices[0].message.content);
        return {
            category: result.category,
            emoji: result.emoji,
            shelfLifeDays: result.shelfLifeDays
        };
    } catch (error) {
        console.error('OpenAI Compatible Classification Error:', error);
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
    const client = createClient(config);
    const langInstruction = lang === 'zh' ? '用简体中文回答' : 'Respond in English';

    const prompt = `识别图片中的主要食材。${langInstruction}
返回JSON格式,包含以下字段:
- name: 食材名称(简洁)
- category: 类别,从以下选择 [Fruit, Vegetable, Meat, Dairy, Grain, Beverage, Snack, Condiment, Other]
- emoji: 一个代表性的emoji表情符号
- shelfLifeDays: 在冰箱中的预估保质期天数(整数)`;

    // 清理base64前缀
    const cleanBase64 = base64Image.includes(',')
        ? base64Image.split(',')[1]
        : base64Image;

    try {
        const response = await client.chat.completions.create({
            model: config.model,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${cleanBase64}`
                            }
                        },
                        {
                            type: 'text',
                            text: prompt
                        }
                    ]
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.4
        });

        const result = JSON.parse(response.choices[0].message.content);
        return {
            name: result.name,
            category: result.category,
            emoji: result.emoji,
            shelfLifeDays: result.shelfLifeDays
        };
    } catch (error) {
        console.error('OpenAI Compatible Image ID Error:', error);
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
    const client = createClient(config);
    const ingredientList = ingredients.join(', ');
    const langInstruction = lang === 'zh' ? '用简体中文回答' : 'Respond in English';

    const prompt = `基于这些可用食材推荐3个食谱:${ingredientList}。
烹饪给${peopleCount}人。

风格:如果食材允许,优先推荐地道的中式家常菜,否则推荐全球美食。
优先使用提供的食材以减少浪费。${langInstruction}

返回JSON数组,每个对象包含:
- name: 菜谱名称
- description: 简短诱人的描述(1句话)
- ingredients: 所需食材列表
- instructions: 分步骤说明
- timeMinutes: 总耗时(分钟)
- matchPercentage: 估算0-100,与提供的库存匹配程度
- calories: 预估每份热量`;

    try {
        const response = await client.chat.completions.create({
            model: config.model,
            messages: [
                {
                    role: 'system',
                    content: '你是一个专业的烹饪助手,擅长根据现有食材推荐食谱。返回JSON数组格式。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7
        });

        const content = response.choices[0].message.content;
        const result = JSON.parse(content);

        // 处理可能的不同返回格式
        const recipes = Array.isArray(result) ? result : (result.recipes || []);

        return recipes.map((recipe, index) => ({
            ...recipe,
            id: `ai-${Date.now()}-${index}`
        }));
    } catch (error) {
        console.error('OpenAI Compatible Recipe Generation Error:', error);
        throw error;
    }
}

/**
 * 获取"今天吃什么"推荐
 * @param {Object} config - 服务商配置
 * @param {string} lang - 语言
 */
export async function getWhatToEat(config, lang = 'zh') {
    const client = createClient(config);
    const langInstruction = lang === 'zh' ? '用简体中文回答' : 'Respond in English';

    const prompt = `推荐一道随机的、美味的中式家常菜,适合午餐或晚餐。${langInstruction}

返回JSON格式,包含:
- name: 菜谱名称
- description: 简短有趣的描述
- ingredients: 所需食材列表
- instructions: 简要步骤
- timeMinutes: 总耗时(分钟)
- matchPercentage: 设为100(因为这是随机推荐)
- calories: 预估热量`;

    try {
        const response = await client.chat.completions.create({
            model: config.model,
            messages: [
                {
                    role: 'system',
                    content: '你是一个美食推荐助手,擅长推荐中式家常菜。返回JSON格式。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 1.1 // 高温度增加随机性
        });

        const recipe = JSON.parse(response.choices[0].message.content);
        return {
            ...recipe,
            id: `ai-random-${Date.now()}`
        };
    } catch (error) {
        console.error('OpenAI Compatible Random Recipe Error:', error);
        throw error;
    }
}

/**
 * 测试连接
 * @param {Object} config - 服务商配置
 */
export async function testConnection(config) {
    const client = createClient(config);

    try {
        const response = await client.chat.completions.create({
            model: config.model,
            messages: [
                {
                    role: 'user',
                    content: '你好,请回复"连接成功"'
                }
            ],
            temperature: 0.1,
            max_tokens: 50
        });

        if (response.choices[0].message.content) {
            return {
                success: true,
                message: 'API Key验证成功!'
            };
        }
        return {
            success: false,
            message: '无法获取响应'
        };
    } catch (error) {
        console.error('OpenAI Compatible Test Error:', error);
        return {
            success: false,
            message: `验证失败: ${error.message}`
        };
    }
}
