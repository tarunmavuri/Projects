
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsModalProps {
  user: { name: string } | null;
  onClose: () => void;
  onNavigate: (modal: 'login' | 'language' | 'privacy' | 'faq' | 'help') => void;
  onLogout: () => void;
}

const SettingsItem: React.FC<{ icon: string; text: string; onClick?: () => void; isDestructive?: boolean }> = ({ icon, text, onClick, isDestructive = false }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center text-left p-4 rounded-lg transition-colors hover:bg-slate-700/50 ${isDestructive ? 'text-rose-500 hover:text-rose-400' : 'text-slate-200'}`}
    >
        <i className={`fa-solid ${icon} w-8 text-center text-xl`}></i>
        <span className="ml-4 text-lg font-medium">{text}</span>
    </button>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({ user, onClose, onNavigate, onLogout }) => {
    const { t } = useLanguage();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog" onClick={onClose}>
            <div className="bg-slate-800/80 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 relative transform transition-all duration-300 animate-modal-pop" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                     <h2 className="text-2xl font-bold text-white">{t('settings')}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors" aria-label="Close settings">
                        <i className="fa-solid fa-xmark text-2xl"></i>
                    </button>
                </div>
                
                <div className="border-t border-slate-700"></div>

                <nav className="flex flex-col gap-1">
                    {!user && <SettingsItem icon="fa-right-to-bracket" text={t('login')} onClick={() => onNavigate('login')} />}
                    <SettingsItem icon="fa-language" text={t('changeLanguage')} onClick={() => onNavigate('language')} />
                    <SettingsItem icon="fa-shield-halved" text={t('privacySupport')} onClick={() => onNavigate('privacy')} />
                    <SettingsItem icon="fa-circle-question" text={t('faq')} onClick={() => onNavigate('faq')} />
                    <SettingsItem icon="fa-hands-helping" text={t('help')} onClick={() => onNavigate('help')} />
                    {user && <SettingsItem icon="fa-right-from-bracket" text={t('signOut')} onClick={onLogout} isDestructive />}
                </nav>
            </div>
        </div>
    );
};
