import React from 'react';
import { Language } from '../types';
import { Globe, Moon, ChevronRight, User } from 'lucide-react';

interface SettingsProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

const SettingsPage: React.FC<SettingsProps> = ({ lang, setLang }) => {
  const t = {
    en: {
      title: "Settings",
      language: "Language",
      appearance: "Appearance",
      account: "Account",
      about: "About",
      version: "Version 1.0.0"
    },
    zh: {
      title: "设置",
      language: "语言",
      appearance: "外观",
      account: "账号",
      about: "关于",
      version: "版本 1.0.0"
    }
  }[lang];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{t.title}</h2>

      {/* Account Section Placeholder */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl font-bold">
            <User size={28} />
        </div>
        <div>
            <h3 className="font-bold text-lg text-gray-800">User</h3>
            <p className="text-gray-400 text-sm">Guest Mode</p>
        </div>
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
            <span className="font-medium">{t.language}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-sm font-medium text-gray-600">{lang === 'en' ? 'English' : '中文'}</span>
            <ChevronRight size={18} />
          </div>
        </button>

        {/* Appearance Placeholder */}
        <div className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between opacity-50">
          <div className="flex items-center gap-3 text-gray-700">
             <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                <Moon size={20} />
            </div>
            <span className="font-medium">{t.appearance}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-sm">Light</span>
            <ChevronRight size={18} />
          </div>
        </div>
      </div>

      <div className="text-center mt-10 text-gray-300 text-sm">
        {t.version}
      </div>
    </div>
  );
};

export default SettingsPage;