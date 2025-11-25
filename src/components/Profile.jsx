import { useState } from 'react';
import { User, LogIn, LogOut, Mail, Lock, UserCircle } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

export default function Profile() {
    const { t } = useTranslation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Mock login - in real app, this would call an API
        setUserName(email.split('@')[0]);
        setIsLoggedIn(true);
        setEmail('');
        setPassword('');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserName('');
    };

    if (isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
                <div className="max-w-md mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('profile.title')}</h1>
                    
                    {/* User Info Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-4">
                                <UserCircle size={64} className="text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">{userName}</h2>
                            <p className="text-sm text-gray-500">{t('profile.member')}</p>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('profile.stats')}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-emerald-50 rounded-xl">
                                <p className="text-2xl font-bold text-emerald-600">0</p>
                                <p className="text-xs text-gray-600 mt-1">{t('profile.itemsAdded')}</p>
                            </div>
                            <div className="text-center p-4 bg-teal-50 rounded-xl">
                                <p className="text-2xl font-bold text-teal-600">0</p>
                                <p className="text-xs text-gray-600 mt-1">{t('profile.recipesCooked')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('profile.settings')}</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <span className="text-gray-700">{t('profile.notifications')}</span>
                            </button>
                            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <span className="text-gray-700">{t('profile.language')}</span>
                            </button>
                            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <span className="text-gray-700">{t('profile.privacy')}</span>
                            </button>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full py-4 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut size={20} />
                        {t('profile.logout')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6 flex items-center">
            <div className="max-w-md mx-auto w-full">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('profile.welcome')}</h1>
                    <p className="text-gray-600">{t('profile.loginPrompt')}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('profile.email')}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('profile.emailPlaceholder')}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('profile.password')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('profile.passwordPlaceholder')}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:from-emerald-600 hover:to-teal-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <LogIn size={20} />
                            {t('profile.login')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700">
                            {t('profile.forgotPassword')}
                        </a>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">
                    {t('profile.noAccount')}{' '}
                    <a href="#" className="text-emerald-600 font-semibold hover:text-emerald-700">
                        {t('profile.signUp')}
                    </a>
                </p>
            </div>
        </div>
    );
}
