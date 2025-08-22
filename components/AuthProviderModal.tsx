
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthProviderModalProps {
  provider: string;
  onLogin: (user: { name: string }) => void;
  onClose: () => void;
}

// Helper to capitalize strings
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Helper to create a name from an email
const nameFromEmail = (email: string): string => {
    const emailPrefix = email.split('@')[0];
    if (!emailPrefix) return "Traveler";
    
    return emailPrefix
        .replace(/[._-]/g, ' ') // replace separators with space
        .split(' ')
        .map(capitalize)
        .join(' ');
};

export const AuthProviderModal: React.FC<AuthProviderModalProps> = ({ provider, onLogin, onClose }) => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email.trim()) {
            const name = nameFromEmail(email);
            onLogin({ name });
        }
    };

    const providerInfo = {
        Google: { icon: 'fa-google', color: 'text-red-500' },
        LinkedIn: { icon: 'fa-linkedin', color: 'text-blue-500' },
        GitHub: { icon: 'fa-github', color: 'text-slate-300' },
    }[provider] || { icon: 'fa-user-circle', color: 'text-slate-400' };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog" onClick={onClose}>
            <div className="bg-slate-800/80 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl max-w-sm w-full p-8 space-y-6 relative transform transition-all duration-300 animate-modal-pop" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors" aria-label="Close">
                    <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
                
                <div className="text-center">
                    <i className={`fa-brands ${providerInfo.icon} ${providerInfo.color} text-4xl mb-4`}></i>
                    <h2 className="text-2xl font-bold text-white">{t('signInWithProvider', { provider })}</h2>
                    <p className="text-slate-400 mt-2">
                        {t('enterEmailSubtitle')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email-input" className="sr-only">{t('emailLabel')}</label>
                        <input
                            id="email-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('emailPlaceholderAuth')}
                            className="w-full bg-slate-900/50 border-2 border-slate-600 focus:border-[--accent-color] focus:ring-0 rounded-lg text-lg px-4 py-3 transition-colors text-white"
                            autoFocus
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[--accent-color] hover:brightness-110 disabled:bg-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-lg px-6 py-3 transition-all duration-300 transform hover:scale-105"
                        disabled={!email.trim()}
                        style={{ backgroundColor: 'var(--accent-color)' }}
                    >
                        {t('continueButton')}
                    </button>
                </form>
            </div>
        </div>
    );
};