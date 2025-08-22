import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
    onSettingsClick: () => void;
    user: { name: string } | null;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick, user }) => {
    const { t } = useLanguage();
    const firstName = user?.name.split(' ')[0] || user?.name;

    return (
        <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                 <i className="fa-solid fa-route text-3xl sm:text-4xl bg-gradient-to-br from-teal-400 to-emerald-500 bg-clip-text text-transparent"></i>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-br from-teal-300 to-emerald-500 bg-clip-text text-transparent">
                    WayVenture
                </h1>
            </div>
            
            <div className="flex items-center gap-2">
                {user && <span className="text-slate-300 hidden sm:block">{t('welcome', { firstName })}</span>}
                <button 
                    onClick={onSettingsClick}
                    className="text-slate-300 hover:text-white transition-colors p-3 rounded-full hover:bg-white/10"
                    aria-label="Open settings"
                >
                    <i className="fa-solid fa-gear text-2xl"></i>
                </button>
            </div>
        </header>
    );
};
