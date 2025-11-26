import { useState, useEffect } from 'react';
import { Globe, Moon, ChevronRight, Key, Check, ChevronDown, ChevronUp, LogOut, ArrowRight, Save, User } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

export default function Settings({ user, onUpdateUser }) {
    const { t, lang, setLang } = useTranslation();

    const [showApiConfig, setShowApiConfig] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [savedSuccess, setSavedSuccess] = useState(false);

    // Login State
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [tempName, setTempName] = useState('');

    useEffect(() => {
        const savedKey = localStorage.getItem('custom_api_key');
        if (savedKey) setApiKey(savedKey);
    }, []);

    const handleSaveKey = () => {
        if (apiKey.trim()) {
            localStorage.setItem('custom_api_key', apiKey.trim());
        } else {
            localStorage.removeItem('custom_api_key');
        }
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
    };

    const handleLogin = () => {
        if (tempName.trim()) {
            onUpdateUser({
                name: tempName.trim(),
                isGuest: false,
                avatar: '🧑‍🍳'
            });
            setIsLoginOpen(false);
            setTempName('');
        }
    };

    const handleLogout = () => {
        onUpdateUser({ name: '', isGuest: true, avatar: '👤' });
    };

    const labels = {
        en: {
            title: "Settings",
            language: "Language",
            appearance: "Appearance",
            account: "Account",
            about: "About",
            version: "Version 1.1.0",
            apiConfig: "API Configuration",
            apiDesc: "Enter your Gemini API Key",
            save: "Save",
            saved: "Saved!",
            placeholder: "Paste API Key here...",
            guest: "Guest Mode",
            signIn: "Sign In",
            namePlaceholder: "Enter your name",
            welcome: "Welcome back,",
            logout: "Log Out",
            loginTitle: "Create Profile",
            loginDesc: "Save your preferences locally."
        },
        zh: {
            title: "设置",
            language: "语言",
            appearance: "外观",
            account: "账号",
            about: "关于",
            version: "版本 1.1.0",
            apiConfig: "API 配置",
            apiDesc: "输入您的 Gemini API Key",
            save: "保存",
            saved: "已保存!",
            placeholder: "在此粘贴 API Key...",
            guest: "访客模式",
            signIn: "登录 / 注册",
            namePlaceholder: "输入您的名字",
            welcome: "欢迎回来,",
            logout: "退出登录",
            loginTitle: "创建资料",
            loginDesc: "在本地保存您的偏好设置。"
        }
    };

    const tLocal = labels[lang];

    return (
        <div className="space-y-6 pb-20">
            <h2 className="text-2xl font-bold text-gray-800">{tLocal.title}</h2>

            {/* Account Section */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden transition-all duration-300">
                {!isLoginOpen ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-2xl shadow-inner border-2 border-white">
                                {user?.avatar || '👤'}
                            </div>
                            <div>
                                {user?.isGuest !== false ? (
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-lg text-gray-800">{tLocal.guest}</h3>
                                        <button
                                            onClick={() => setIsLoginOpen(true)}
                                            className="text-emerald-500 text-sm font-bold mt-0.5 flex items-center hover:text-emerald-600"
                                        >
                                            {tLocal.signIn} <ChevronRight size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{tLocal.welcome}</p>
                                        <h3 className="font-bold text-xl text-gray-800">{user?.name}</h3>
                                    </div>
                                )}
                            </div>
                        </div>

                        {user?.isGuest === false && (
                            <button
                                onClick={handleLogout}
                                className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                                title={tLocal.logout}
                            >
                                <LogOut size={20} />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <div className="mb-4">
                            <h3 className="font-bold text-lg text-gray-800">{tLocal.loginTitle}</h3>
                            <p className="text-xs text-gray-400">{tLocal.loginDesc}</p>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                placeholder={tLocal.namePlaceholder}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                autoFocus
                            />
                            <button
                                onClick={handleLogin}
                                disabled={!tempName.trim()}
                                className="bg-emerald-500 text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-200 hover:bg-emerald-600 transition-all"
                            >
                                <ArrowRight size={20} />
                            </button>
                        </div>
                        <button
                            onClick={() => setIsLoginOpen(false)}
                            className="text-xs text-gray-400 mt-3 hover:text-gray-600 underline decoration-dotted"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {/* Language Toggle */}
                <button
                    onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                    className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.99] transition-all"
                >
                    <div className="flex items-center gap-3 text-gray-700">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                            <Globe size={20} />
                        </div>
                        <span className="font-medium">{tLocal.language}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-sm font-medium text-gray-600">{lang === 'en' ? 'English' : '中文'}</span>
                        <ChevronRight size={18} />
                    </div>
                </button>

                {/* API Configuration */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => setShowApiConfig(!showApiConfig)}
                        className="w-full p-4 flex items-center justify-between active:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
                                <Key size={20} />
                            </div>
                            <span className="font-medium">{tLocal.apiConfig}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            {showApiConfig ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                    </button>

                    {showApiConfig && (
                        <div className="p-4 pt-0 animate-fade-in">
                            <p className="text-xs text-gray-500 mb-2">{tLocal.apiDesc}</p>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder={tLocal.placeholder}
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <button
                                    onClick={handleSaveKey}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold text-white transition-all flex items-center gap-1
                                        ${savedSuccess ? 'bg-green-500' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                                >
                                    {savedSuccess ? <Check size={16} /> : <Save size={16} />}
                                    {savedSuccess ? tLocal.saved : tLocal.save}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Appearance Placeholder */}
                <div className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-3 text-gray-700">
                        <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                            <Moon size={20} />
                        </div>
                        <span className="font-medium">{tLocal.appearance}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-sm">Light</span>
                        <ChevronRight size={18} />
                    </div>
                </div>
            </div>

            <div className="text-center mt-10 text-gray-300 text-sm">
                {tLocal.version}
            </div>
        </div>
    );
}
