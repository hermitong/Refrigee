/**
 * 预设的AI服务商配置
 * 支持OpenAI兼容API的服务商
 */

export const PROVIDER_PRESETS = {
    gemini: {
        id: 'gemini',
        type: 'gemini',
        displayName: 'Google Gemini',
        description: 'Google的多模态AI模型',
        defaultModel: 'gemini-1.5-flash',
        models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'],
        features: ['chat', 'vision', 'json-mode'],
        requiresBaseURL: false,
        docs: 'https://ai.google.dev/gemini-api/docs',
        icon: '🔷'
    },
    openai: {
        id: 'openai',
        type: 'openai-compatible',
        displayName: 'OpenAI',
        description: 'OpenAI GPT系列模型',
        baseURL: 'https://api.openai.com/v1',
        defaultModel: 'gpt-4o-mini',
        models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        features: ['chat', 'vision', 'json-mode'],
        requiresBaseURL: false,
        docs: 'https://platform.openai.com/docs',
        icon: '🤖'
    },
    deepseek: {
        id: 'deepseek',
        type: 'openai-compatible',
        displayName: 'DeepSeek',
        description: '高性价比的中文优化模型',
        baseURL: 'https://api.deepseek.com',
        defaultModel: 'deepseek-chat',
        models: ['deepseek-chat', 'deepseek-coder'],
        features: ['chat', 'vision', 'json-mode'],
        requiresBaseURL: true,
        docs: 'https://api-docs.deepseek.com',
        icon: '🧠'
    },
    zhipu: {
        id: 'zhipu',
        type: 'openai-compatible',
        displayName: '智谱AI',
        description: '清华系AI模型,中文能力强',
        baseURL: 'https://open.bigmodel.cn/api/paas/v4',
        defaultModel: 'glm-4-flash',
        models: ['glm-4-flash', 'glm-4', 'glm-4v'],
        features: ['chat', 'vision', 'json-mode'],
        requiresBaseURL: true,
        docs: 'https://open.bigmodel.cn/dev/api',
        icon: '🎓'
    },
    doubao: {
        id: 'doubao',
        type: 'openai-compatible',
        displayName: '豆包(字节跳动)',
        description: '字节跳动的AI模型',
        baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
        defaultModel: 'doubao-pro-32k',
        models: ['doubao-pro-32k', 'doubao-lite-32k'],
        features: ['chat', 'json-mode'],
        requiresBaseURL: true,
        docs: 'https://www.volcengine.com/docs/82379',
        icon: '🫘'
    }
};

/**
 * 获取所有预设服务商列表
 */
export function getAllPresets() {
    return Object.values(PROVIDER_PRESETS);
}

/**
 * 根据ID获取预设配置
 */
export function getPresetById(id) {
    return PROVIDER_PRESETS[id];
}

/**
 * 获取OpenAI兼容的服务商列表
 */
export function getOpenAICompatiblePresets() {
    return Object.values(PROVIDER_PRESETS).filter(
        preset => preset.type === 'openai-compatible'
    );
}

/**
 * 创建默认的服务商配置
 */
export function createDefaultProviderConfig(presetId) {
    const preset = getPresetById(presetId);
    if (!preset) return null;

    return {
        id: preset.id,
        type: preset.type,
        displayName: preset.displayName,
        apiKey: '',
        baseURL: preset.baseURL || '',
        model: preset.defaultModel,
        enabled: false,
        icon: preset.icon
    };
}
