/**
 * Gemini Service - 向后兼容包装器
 * 
 * @deprecated 建议使用 aiServiceManager 替代
 * 本文件保留用于向后兼容,内部委托给 aiServiceManager
 */

import * as aiServiceManager from './aiServiceManager.js';

/**
 * 检查 AI 是否可用
 * @deprecated 使用 aiServiceManager.isAIAvailable()
 */
export function isAIAvailable() {
    return aiServiceManager.isAIAvailable();
}

/**
 * 使用 AI 分类物品
 * @deprecated 使用 aiServiceManager.classifyItem()
 */
export async function classifyItemWithAI(itemName, lang = 'zh') {
    return aiServiceManager.classifyItem(itemName, lang);
}

/**
 * 从图片识别食材
 * @deprecated 使用 aiServiceManager.identifyImage()
 */
export async function identifyItemFromImage(base64Image, lang = 'zh') {
    return aiServiceManager.identifyImage(base64Image, lang);
}

/**
 * 获取"今天吃什么"推荐
 * @deprecated 使用 aiServiceManager.getWhatToEat()
 */
export async function getWhatToEatRecommendation(lang = 'zh') {
    return aiServiceManager.getWhatToEat(lang);
}

/**
 * 基于库存生成食谱
 * @deprecated 使用 aiServiceManager.generateRecipes()
 */
export async function generateRecipesWithAI(ingredients, peopleCount, lang = 'zh') {
    return aiServiceManager.generateRecipes(ingredients, peopleCount, lang);
}

/**
 * 测试 API Key 是否有效
 * @deprecated 使用 aiServiceManager.testProvider()
 */
export async function testApiKey() {
    // 测试当前主服务商
    if (!aiServiceManager.isAIAvailable()) {
        return {
            success: false,
            message: 'API Key 未配置'
        };
    }

    // 获取当前服务商信息并测试
    const providerInfo = aiServiceManager.getCurrentProviderInfo();
    return aiServiceManager.testProvider(providerInfo.id);
}
