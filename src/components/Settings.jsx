import { useState, useEffect } from 'react';
import { Globe, Moon, ChevronRight, User, Key, Eye, EyeOff, CheckCircle, XCircle, Loader2, ExternalLink, Plus, Trash2, ChevronDown } from 'lucide-react';
import * as aiServiceManager from '../services/aiServiceManager';
import { PROVIDER_PRESETS, getAllPresets } from '../services/providerPresets';

export default function Settings() {
    const [config, setConfig] = useState(null);
    const [usage, setUsage] = useState({});
    const [expandedProviders, setExpandedProviders] = useState({});
    const [testingProvider, setTestingProvider] = useState(null);
    const [testResults, setTestResults] = useState({});
    const [showAddMenu, setShowAddMenu] = useState(false);

    // 加载配置
    useEffect(() => {
        loadConfig();
        loadUsage();
    }, []);

    const loadConfig = () => {
        const providers = aiServiceManager.getAllProviders();
        const configStr = localStorage.getItem('ai_config');
        const fullConfig = configStr ? JSON.parse(configStr) : { primary_provider: 'gemini' };
        setConfig(fullConfig);

        // 默认展开所有已启用的服务商
        const expanded = {};
        Object.keys(providers).forEach(id => {
            if (providers[id].enabled) {
                expanded[id] = true;
            }
        });
        setExpandedProviders(expanded);
    };

    const loadUsage = () => {
        setUsage(aiServiceManager.getUsageStats());
    };

    const handleUpdateProvider = (providerId, updates) => {
        aiServiceManager.updateProvider(providerId, updates);
        loadConfig();
    };

    const handleTestProvider = async (providerId) => {
        setTestingProvider(providerId);
        setTestResults({ ...testResults, [providerId]: null });

        const result = await aiServiceManager.testProvider(providerId);
        setTestResults({ ...testResults, [providerId]: result });
        setTestingProvider(null);

        setTimeout(() => {
            setTestResults({ ...testResults, [providerId]: null });
        }, 5000);
    };

    const handleSetPrimary = (providerId) => {
        aiServiceManager.setPrimaryProvider(providerId);
        loadConfig();
    };

    const handleAddProvider = (presetId) => {
        const preset = PROVIDER_PRESETS[presetId];
        if (!preset) return;

        const newProvider = {
            id: preset.id,
            type: preset.type,
            displayName: preset.displayName,
            apiKey: '',
            baseURL: preset.baseURL || '',
            model: preset.defaultModel,
            enabled: false,
            icon: preset.icon
        };

        aiServiceManager.addProvider(newProvider);
        loadConfig();
        setExpandedProviders({ ...expandedProviders, [preset.id]: true });
        setShowAddMenu(false);
    };

    const handleRemoveProvider = (providerId) => {
        if (confirm(`确定要删除 ${config.providers[providerId].displayName} 吗?`)) {
            try {
                aiServiceManager.removeProvider(providerId);
                loadConfig();
                loadUsage();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleResetUsage = (providerId = null) => {
        if (confirm(providerId ? '确定要重置此服务商的用量统计吗?' : '确定要重置所有用量统计吗?')) {
            aiServiceManager.resetUsageStats(providerId);
            loadUsage();
        }
    };

    const toggleProvider = (providerId) => {
        setExpandedProviders({
            ...expandedProviders,
            [providerId]: !expandedProviders[providerId]
        });
    };

    if (!config) {
        return <div className="p-6">加载中...</div>;
    }

    const providers = config.providers || {};
    const availablePresets = getAllPresets().filter(preset => !providers[preset.id]);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">设置</h2>

            {/* Account Section */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl font-bold">
                    <User size={28} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-800">用户</h3>
                    <p className="text-gray-400 text-sm">访客模式</p>
                </div>
            </div>

            <div className="space-y-3">
                {/* Language - Placeholder */}
                <div className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-3 text-gray-700">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                            <Globe size={20} />
                        </div>
                        <span className="font-medium">语言</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-sm font-medium text-gray-600">中文</span>
                        <ChevronRight size={18} />
                    </div>
                </div>

                {/* Appearance - Placeholder */}
                <div className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-3 text-gray-700">
                        <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                            <Moon size={20} />
                        </div>
                        <span className="font-medium">外观</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-sm">浅色</span>
                        <ChevronRight size={18} />
                    </div>
                </div>

                {/* AI Configuration */}
                <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 text-gray-700 mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                            <Key size={20} />
                        </div>
                        <div className="flex-1">
                            <span className="font-medium block">AI 服务配置</span>
                            <span className="text-xs text-gray-400">
                                主服务商: {providers[config.primary_provider]?.displayName || '未设置'}
                            </span>
                        </div>
                    </div>

                    {/* Provider List */}
                    <div className="space-y-3">
                        {Object.values(providers).map((provider) => (
                            <div
                                key={provider.id}
                                className={`border rounded-xl overflow-hidden transition-all ${provider.id === config.primary_provider
                                        ? 'border-emerald-500 bg-emerald-50/30'
                                        : 'border-gray-200'
                                    }`}
                            >
                                {/* Provider Header */}
                                <div
                                    className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                                    onClick={() => toggleProvider(provider.id)}
                                >
                                    <span className="text-2xl">{provider.icon}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{provider.displayName}</span>
                                            {provider.id === config.primary_provider && (
                                                <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                                                    主服务商
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                            <span>
                                                {provider.enabled ? (
                                                    <span className="text-emerald-600 flex items-center gap-1">
                                                        <CheckCircle size={12} /> 已启用
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">未启用</span>
                                                )}
                                            </span>
                                            <span>📊 {usage[provider.id]?.calls || 0} 次调用</span>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        size={20}
                                        className={`text-gray-400 transition-transform ${expandedProviders[provider.id] ? 'rotate-180' : ''
                                            }`}
                                    />
                                </div>

                                {/* Provider Details */}
                                {expandedProviders[provider.id] && (
                                    <div className="p-4 pt-0 space-y-3 border-t border-gray-100">
                                        {/* API Key Input */}
                                        <div>
                                            <label className="text-xs text-gray-600 mb-1 block">API Key</label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    value={provider.apiKey}
                                                    onChange={(e) =>
                                                        handleUpdateProvider(provider.id, { apiKey: e.target.value })
                                                    }
                                                    placeholder={`输入 ${provider.displayName} API Key`}
                                                    className="w-full p-2 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Model Selection */}
                                        <div>
                                            <label className="text-xs text-gray-600 mb-1 block">模型</label>
                                            <input
                                                type="text"
                                                value={provider.model}
                                                onChange={(e) =>
                                                    handleUpdateProvider(provider.id, { model: e.target.value })
                                                }
                                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                            />
                                        </div>

                                        {/* Base URL (for OpenAI compatible) */}
                                        {provider.type === 'openai-compatible' && (
                                            <div>
                                                <label className="text-xs text-gray-600 mb-1 block">Base URL</label>
                                                <input
                                                    type="text"
                                                    value={provider.baseURL}
                                                    onChange={(e) =>
                                                        handleUpdateProvider(provider.id, { baseURL: e.target.value })
                                                    }
                                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                                />
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() =>
                                                    handleUpdateProvider(provider.id, { enabled: !provider.enabled })
                                                }
                                                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${provider.enabled
                                                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                                                    }`}
                                            >
                                                {provider.enabled ? '禁用' : '启用'}
                                            </button>
                                            <button
                                                onClick={() => handleTestProvider(provider.id)}
                                                disabled={!provider.apiKey || testingProvider === provider.id}
                                                className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                            >
                                                {testingProvider === provider.id ? (
                                                    <>
                                                        <Loader2 size={14} className="animate-spin" />
                                                        测试中...
                                                    </>
                                                ) : (
                                                    '测试连接'
                                                )}
                                            </button>
                                            {provider.id !== config.primary_provider && (
                                                <button
                                                    onClick={() => handleSetPrimary(provider.id)}
                                                    disabled={!provider.enabled}
                                                    className="px-4 bg-emerald-100 text-emerald-700 py-2 rounded-lg font-medium text-sm hover:bg-emerald-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    设为主
                                                </button>
                                            )}
                                            {provider.id !== config.primary_provider && (
                                                <button
                                                    onClick={() => handleRemoveProvider(provider.id)}
                                                    className="px-3 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Test Result */}
                                        {testResults[provider.id] && (
                                            <div
                                                className={`p-3 rounded-lg text-sm flex items-center gap-2 ${testResults[provider.id].success
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-red-50 text-red-700'
                                                    }`}
                                            >
                                                {testResults[provider.id].success ? (
                                                    <CheckCircle size={16} />
                                                ) : (
                                                    <XCircle size={16} />
                                                )}
                                                {testResults[provider.id].message}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add Provider Button */}
                    {availablePresets.length > 0 && (
                        <div className="mt-4 relative">
                            <button
                                onClick={() => setShowAddMenu(!showAddMenu)}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={18} />
                                添加服务商
                            </button>

                            {showAddMenu && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
                                    {availablePresets.map((preset) => (
                                        <button
                                            key={preset.id}
                                            onClick={() => handleAddProvider(preset.id)}
                                            className="w-full p-3 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                                        >
                                            <span className="text-2xl">{preset.icon}</span>
                                            <div>
                                                <div className="font-medium text-gray-800">{preset.displayName}</div>
                                                <div className="text-xs text-gray-500">{preset.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Global Actions */}
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => handleResetUsage()}
                            className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
                        >
                            重置统计
                        </button>
                    </div>

                    {/* Help Text */}
                    <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg mt-4">
                        <p className="font-medium text-gray-700">💡 提示:</p>
                        <p>• 未配置API时将使用Mock AI提供基础功能</p>
                        <p>• 主服务商失败时会自动降级到Mock</p>
                        <p>• 支持OpenAI兼容的服务商(DeepSeek、智谱AI等)</p>
                    </div>
                </div>
            </div>

            <div className="text-center mt-10 text-gray-300 text-sm">版本 1.0.0</div>
        </div>
    );
}
