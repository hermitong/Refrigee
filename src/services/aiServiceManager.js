/**
 * AI服务管理器
 * 统一调度多个AI服务商,提供降级和用量统计功能
 */

import * as geminiAdapter from './adapters/geminiAdapter.js';
import * as openaiAdapter from './adapters/openaiCompatibleAdapter.js';
import { predictItemDetails, RECIPES } from '../utils/aiMock.js';

const CONFIG_KEY = 'ai_config';
const USAGE_KEY = 'ai_usage';

/**
 * 获取AI配置
 */
function getConfig() {
    const configStr = localStorage.getItem(CONFIG_KEY);
    if (!configStr) {
        return getDefaultConfig();
    }
    return JSON.parse(configStr);
}

/**
 * 保存AI配置
 */
export function saveConfig(config) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

/**
 * 获取默认配置
 */
function getDefaultConfig() {
    return {
        primary_provider: 'gemini',
        providers: {
            gemini: {
                id: 'gemini',
                type: 'gemini',
                displayName: 'Google Gemini',
                apiKey: localStorage.getItem('refrigee_api_key') || '',
                model: 'gemini-1.5-flash',
                enabled: true,
                icon: '🔷'
            }
        },
        fallback_enabled: true
    };
}

/**
 * 获取当前主服务商配置
 */
function getCurrentProviderConfig() {
    const config = getConfig();
    const providerId = config.primary_provider;
    const providerConfig = config.providers[providerId];

    if (!providerConfig || !providerConfig.enabled || !providerConfig.apiKey) {
        return null;
    }

    return providerConfig;
}

/**
 * 获取适配器
 */
function getAdapter(providerType) {
    switch (providerType) {
        case 'gemini':
            return geminiAdapter;
        case 'openai-compatible':
            return openaiAdapter;
        default:
            throw new Error(`Unknown provider type: ${providerType}`);
    }
}

/**
 * 记录API用量
 */
function trackUsage(providerId) {
    const usageStr = localStorage.getItem(USAGE_KEY);
    const usage = usageStr ? JSON.parse(usageStr) : {};

    if (!usage[providerId]) {
        usage[providerId] = {
            calls: 0,
            lastReset: new Date().toISOString().split('T')[0]
        };
    }

    usage[providerId].calls += 1;
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}

/**
 * 获取用量统计
 */
export function getUsageStats() {
    const usageStr = localStorage.getItem(USAGE_KEY);
    return usageStr ? JSON.parse(usageStr) : {};
}

/**
 * 重置用量统计
 */
export function resetUsageStats(providerId = null) {
    if (providerId) {
        const usage = getUsageStats();
        if (usage[providerId]) {
            usage[providerId] = {
                calls: 0,
                lastReset: new Date().toISOString().split('T')[0]
            };
            localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
        }
    } else {
        localStorage.removeItem(USAGE_KEY);
    }
}

/**
 * 检查AI是否可用
 */
export function isAIAvailable() {
    const providerConfig = getCurrentProviderConfig();
    return providerConfig !== null;
}

/**
 * 获取当前服务商信息
 */
export function getCurrentProviderInfo() {
    const config = getConfig();
    const providerConfig = getCurrentProviderConfig();

    if (!providerConfig) {
        return {
            id: 'mock',
            displayName: 'Mock AI',
            icon: '🤖',
            enabled: false
        };
    }

    return {
        id: providerConfig.id,
        displayName: providerConfig.displayName,
        icon: providerConfig.icon,
        enabled: true
    };
}

/**
 * 分类物品
 */
export async function classifyItem(itemName, lang = 'zh') {
    const providerConfig = getCurrentProviderConfig();

    // 如果没有可用的服务商,使用Mock
    if (!providerConfig) {
        const mockResult = predictItemDetails(itemName);
        return {
            category: mockResult.category,
            emoji: mockResult.emoji,
            shelfLifeDays: mockResult.shelfLife || 7
        };
    }

    try {
        const adapter = getAdapter(providerConfig.type);
        const result = await adapter.classifyItem(providerConfig, itemName, lang);
        trackUsage(providerConfig.id);
        return result;
    } catch (error) {
        console.error('AI Classification failed, falling back to Mock:', error);
        // 降级到Mock
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
 */
export async function identifyImage(base64Image, lang = 'zh') {
    const providerConfig = getCurrentProviderConfig();

    // 如果没有可用的服务商,返回空结果
    if (!providerConfig) {
        return {
            name: '',
            category: 'Other',
            emoji: '📸',
            shelfLifeDays: 7
        };
    }

    try {
        const adapter = getAdapter(providerConfig.type);
        const result = await adapter.identifyImage(providerConfig, base64Image, lang);
        trackUsage(providerConfig.id);
        return result;
    } catch (error) {
        console.error('AI Image ID failed:', error);
        return {
            name: '',
            category: 'Other',
            emoji: '📸',
            shelfLifeDays: 7
        };
    }
}

/**
 * 生成食谱
 */
export async function generateRecipes(ingredients, peopleCount, lang = 'zh') {
    const providerConfig = getCurrentProviderConfig();

    // 如果没有可用的服务商,使用Mock食谱
    if (!providerConfig) {
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

    try {
        const adapter = getAdapter(providerConfig.type);
        const result = await adapter.generateRecipes(providerConfig, ingredients, peopleCount, lang);
        trackUsage(providerConfig.id);
        return result;
    } catch (error) {
        console.error('AI Recipe Generation failed, falling back to Mock:', error);
        // 降级到Mock
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
}

/**
 * 获取"今天吃什么"推荐
 */
export async function getWhatToEat(lang = 'zh') {
    const providerConfig = getCurrentProviderConfig();

    // 如果没有可用的服务商,返回随机Mock食谱
    if (!providerConfig) {
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

    try {
        const adapter = getAdapter(providerConfig.type);
        const result = await adapter.getWhatToEat(providerConfig, lang);
        trackUsage(providerConfig.id);
        return result;
    } catch (error) {
        console.error('AI Random Recipe failed, falling back to Mock:', error);
        // 降级到Mock
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
}

/**
 * 测试指定服务商
 */
export async function testProvider(providerId) {
    const config = getConfig();
    const providerConfig = config.providers[providerId];

    if (!providerConfig) {
        return {
            success: false,
            message: '服务商不存在'
        };
    }

    if (!providerConfig.apiKey) {
        return {
            success: false,
            message: '请先输入 API Key'
        };
    }

    try {
        const adapter = getAdapter(providerConfig.type);
        return await adapter.testConnection(providerConfig);
    } catch (error) {
        return {
            success: false,
            message: `测试失败: ${error.message}`
        };
    }
}

/**
 * 添加服务商
 */
export function addProvider(providerConfig) {
    const config = getConfig();
    config.providers[providerConfig.id] = providerConfig;
    saveConfig(config);
}

/**
 * 删除服务商
 */
export function removeProvider(providerId) {
    const config = getConfig();

    // 不允许删除当前主服务商
    if (config.primary_provider === providerId) {
        throw new Error('不能删除当前主服务商,请先切换到其他服务商');
    }

    delete config.providers[providerId];
    saveConfig(config);

    // 同时删除用量统计
    const usage = getUsageStats();
    delete usage[providerId];
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}

/**
 * 更新服务商配置
 */
export function updateProvider(providerId, updates) {
    const config = getConfig();
    if (!config.providers[providerId]) {
        throw new Error('服务商不存在');
    }

    config.providers[providerId] = {
        ...config.providers[providerId],
        ...updates
    };
    saveConfig(config);
}

/**
 * 设置主服务商
 */
export function setPrimaryProvider(providerId) {
    const config = getConfig();
    if (!config.providers[providerId]) {
        throw new Error('服务商不存在');
    }

    config.primary_provider = providerId;
    saveConfig(config);
}

/**
 * 获取所有服务商配置
 */
export function getAllProviders() {
    const config = getConfig();
    return config.providers;
}
