import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface InfoModalProps {
  type: 'faq' | 'privacy' | 'help';
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
    const { t } = useLanguage();

    const content = {
        faq: {
            title: t('faqTitle'),
            icon: "fa-circle-question",
            body: (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-[--accent-color]" style={{ color: 'var(--accent-color)' }}>{t('faqHowItWorksTitle')}</h4>
                        <p className="text-slate-400">{t('faqHowItWorksBody')}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[--accent-color]" style={{ color: 'var(--accent-color)' }}>{t('faqBudgetTitle')}</h4>
                        <p className="text-slate-400">{t('faqBudgetBody')}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[--accent-color]" style={{ color: 'var(--accent-color)' }}>{t('faqSaveGuidesTitle')}</h4>
                        <p className="text-slate-400">{t('faqSaveGuidesBody')}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[--accent-color]" style={{ color: 'var(--accent-color)' }}>{t('faqGuideLanguageTitle')}</h4>
                        <p className="text-slate-400">{t('faqGuideLanguageBody')}</p>
                    </div>
                </div>
            )
        },
        privacy: {
            title: t('privacyTitle'),
            icon: "fa-shield-halved",
            body: (
                <div className="space-y-4 text-slate-400">
                    <p>{t('privacyBody')}</p>
                    <p>{t('privacySupportContact')} <a href="mailto:support@wayventure.dev" className="text-[--accent-color] hover:underline" style={{ color: 'var(--accent-color)' }}>support@wayventure.dev</a>.</p>
                </div>
            )
        },
        help: {
            title: t('helpTitle'),
            icon: "fa-hands-helping",
            body: (
                 <div className="space-y-4 text-slate-400">
                    <h4 className="font-semibold text-[--accent-color]" style={{ color: 'var(--accent-color)' }}>{t('helpGettingStarted')}</h4>
                    <p>{t('helpStep1')}</p>
                    <p>{t('helpStep2')}</p>
                    <p>{t('helpStep3')}</p>
                    <h4 className="font-semibold text-[--accent-color]" style={{ color: 'var(--accent-color)' }}>{t('helpMyTrips')}</h4>
                    <p>{t('helpMyTripsBody')}</p>
                </div>
            )
        }
    };

    const { title, icon, body } = content[type];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog" onClick={onClose}>
            <div className="bg-slate-800/80 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl max-w-lg w-full p-8 space-y-6 relative transform transition-all duration-300 animate-modal-pop" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors" aria-label="Close">
                    <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
                
                <div className="text-left">
                    <div className="flex items-center gap-3 mb-4">
                        <i className={`fa-solid ${icon} text-3xl text-[--accent-color]`} style={{ color: 'var(--accent-color)' }}></i>
                        <h2 className="text-2xl font-bold text-white">{title}</h2>
                    </div>
                     <div className="border-t border-slate-700 my-4"></div>
                    <div className="max-h-[60vh] overflow-y-auto pr-2 text-white">
                       {body}
                    </div>
                </div>

            </div>
        </div>
    );
};
