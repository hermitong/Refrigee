import { useState, useEffect } from 'react';
import { Globe, Moon, ChevronRight, User, Key, Eye, EyeOff, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { testApiKey, isAIAvailable } from '../services/geminiService';

export default function Settings() {
    const [apiKey, setApiKey] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState(null);

    useEffect(() => {
        // 加载已保存的 API Key
        const savedKey = localStorage.getItem('refrigee_api_key') || '';
        setApiKey(savedKey);
    }, []);

    const handleSaveApiKey = () => {
        localStorage.setItem('refrigee_api_key', apiKey.trim());
        setTestResult({ success: true, message: 'API Key 已保存!' });
        setTimeout(() => setTestResult(null), 3000);
    };

    const handleTestApiKey = async () => {
        if (!apiKey.trim()) {
            setTestResult({ success: false, message: '请先输入 API Key' });
            return;
        }

        setTesting(true);
        setTestResult(null);

        // 临时保存以便测试
        const originalKey = localStorage.getItem('refrigee_api_key');
        localStorage.setItem('refrigee_api_key', apiKey.trim());

        const result = await testApiKey();
        setTestResult(result);

        // 如果测试失败,恢复原来的 key
        if (!result.success && originalKey !== null) {
            localStorage.setItem('refrigee_api_key', originalKey);
        }

        setTesting(false);
    };

    const handleClearApiKey = () => {
        setApiKey('');
        localStorage.removeItem('refrigee_api_key');
        setTestResult({ success: true, message: 'API Key 已清除' });
        setTimeout(() => setTestResult(null), 3000);
    };

    const aiStatus = isAIAvailable();

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">设置</h2>

            {/* Account Section Placeholder */}
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
                {/* Language - Placeholder for now */}
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

                {/* API Configuration */}
                <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 text-gray-700 mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                            <Key size={20} />
                        </div>
                        <div className="flex-1">
                            <span className="font-medium block">API 配置</span>
                            <span className="text-xs text-gray-400">
                                {aiStatus ? (
                                    <span className="text-emerald-600 flex items-center gap-1">
                                        <CheckCircle size={12} /> 已配置
                                    </span>
                                ) : (
                                    <span className="text-amber-600">未配置 - 使用 Mock AI</span>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {/* API Key Input */}
                        <div className="relative">
                            <input
                                type={showApiKey ? 'text' : 'password'}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="输入 Gemini API Key"
                                className="w-full p-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveApiKey}
                                disabled={!apiKey.trim()}
                                className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl font-medium hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                            >
                                保存
                            </button>
                            <button
                                onClick={handleTestApiKey}
                                disabled={!apiKey.trim() || testing}
                                className="flex-1 bg-blue-500 text-white py-2.5 rounded-xl font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
                            >
                                {testing ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        测试中...
                                    </>
                                ) : (
                                    '测试连接'
                                )}
                            </button>
                            <button
                                onClick={handleClearApiKey}
                                disabled={!apiKey.trim()}
                                className="px-4 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors text-sm"
                            >
                                清除
                            </button>
                        </div>

                        {/* Test Result */}
                        {testResult && (
                            <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${testResult.success
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-red-50 text-red-700'
                                }`}>
                                {testResult.success ? (
                                    <CheckCircle size={16} />
                                ) : (
                                    <XCircle size={16} />
                                )}
                                {testResult.message}
                            </div>
                        )}

                        {/* Help Text */}
                        <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-gray-700">如何获取 API Key:</p>
                            <a
                                href="https://aistudio.google.com/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 underline"
                            >
                                访问 Google AI Studio
                                <ExternalLink size={12} />
                            </a>
                            <p className="text-gray-500 mt-2">
                                💡 未配置时将使用 Mock AI 提供基础功能
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-10 text-gray-300 text-sm">
                版本 1.0.0
            </div>
        </div>
    );
}
