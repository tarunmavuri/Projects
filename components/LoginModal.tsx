
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginModalProps {
  onSelectProvider: (provider: string) => void;
  onClose: () => void;
  onLogin: (user: { name: string }) => void;
}

const SocialLoginButton: React.FC<{
  provider: string;
  icon: string;
  onClick: () => void;
}> = ({ provider, icon, onClick }) => {
    const { t } = useLanguage();
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-center bg-slate-900/50 hover:bg-slate-700/50 border-2 border-slate-600 focus:border-[--accent-color] rounded-lg text-lg px-4 py-3 transition-colors text-white font-medium focus:outline-none focus:ring-2 focus:ring-[--accent-color]"
        >
            <i className={`fa-brands ${icon} text-xl mr-3 w-6 text-center`}></i>
            <span>{t('continueWith', { provider })}</span>
        </button>
    );
};


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


export const LoginModal: React.FC<LoginModalProps> = ({ onSelectProvider, onClose, onLogin }) => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');

    const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email.trim()) {
            const name = nameFromEmail(email);
            onLogin({ name });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog" onClick={onClose}>
            <div className="bg-slate-800/80 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl max-w-sm w-full p-8 space-y-6 relative transform transition-all duration-300 animate-modal-pop" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors" aria-label="Close">
                    <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
                
                <div className="text-center">
                    <i className="fa-solid fa-right-to-bracket text-4xl text-[--accent-color] mb-4" style={{ color: 'var(--accent-color)' }}></i>
                    <h2 className="text-2xl font-bold text-white">{t('welcomeTitleLogin')}</h2>
                    <p className="text-slate-400 mt-2">
                        {t('signInSubtitle')}
                    </p>
                </div>

                <div className="space-y-3">
                   <SocialLoginButton
                        provider="Google"
                        icon="fa-google"
                        onClick={() => onSelectProvider('Google')}
                    />
                     <SocialLoginButton
                        provider="LinkedIn"
                        icon="fa-linkedin"
                        onClick={() => onSelectProvider('LinkedIn')}
                    />
                     <SocialLoginButton
                        provider="GitHub"
                        icon="fa-github"
                        onClick={() => onSelectProvider('GitHub')}
                    />
                </div>

                <div className="flex items-center">
                    <div className="flex-grow border-t border-slate-600"></div>
                    <span className="flex-shrink mx-4 text-slate-400 text-sm">{t('orSeparator')}</span>
                    <div className="flex-grow border-t border-slate-600"></div>
                </div>
                
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                    <div>
                        <label htmlFor="email-login-input" className="sr-only">{t('emailLabel')}</label>
                        <input
                            id="email-login-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('emailPlaceholder')}
                            className="w-full bg-slate-900/50 border-2 border-slate-600 focus:border-[--accent-color] focus:ring-0 rounded-lg text-lg px-4 py-3 transition-colors text-white"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center bg-slate-900/50 hover:bg-slate-700/50 border-2 border-slate-600 focus:border-[--accent-color] rounded-lg text-lg px-4 py-3 transition-colors text-white font-medium focus:outline-none focus:ring-2 focus:ring-[--accent-color]"
                        disabled={!email.trim()}
                    >
                         <i className="fa-solid fa-envelope text-xl mr-3 w-6 text-center"></i>
                         <span>{t('continueWithEmail')}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};