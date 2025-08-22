import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageModalProps {
  onClose: () => void;
}

const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文 (简体)' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'ru', name: 'Русский' },
    { code: 'pt', name: 'Português' },
    { code: 'it', name: 'Italiano' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'pl', name: 'Polski' },
] as const;


export const LanguageModal: React.FC<LanguageModalProps> = ({ onClose }) => {
    const { language: currentLanguage, setLanguage, t } = useLanguage();

    const handleLanguageSelect = (langCode: typeof languages[number]['code']) => {
        setLanguage(langCode);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog" onClick={onClose}>
            <div className="bg-slate-800/80 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl max-w-md w-full p-8 space-y-6 relative transform transition-all duration-300 animate-modal-pop flex flex-col" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors" aria-label="Close">
                    <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
                
                <div className="text-center">
                    <i className="fa-solid fa-language text-4xl text-[--accent-color] mb-4" style={{ color: 'var(--accent-color)' }}></i>
                    <h2 className="text-2xl font-bold text-white">{t('selectLanguage')}</h2>
                    <p className="text-slate-400 mt-2">
                        {t('selectLanguageSubtitle')}
                    </p>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageSelect(lang.code)}
                            className={`w-full text-left border-2 rounded-lg text-lg px-4 py-3 transition-colors text-white ${
                                currentLanguage === lang.code
                                ? 'bg-[--accent-color]/20 border-[--accent-color]'
                                : 'bg-slate-900/50 hover:bg-slate-700/50 border-slate-600 focus:border-[--accent-color]'
                            }`}
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};