
import React, { useState } from 'react';
import type { HotelPreference, TravelMode } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface OriginModalProps {
  destination: string;
  onConfirm: (origin: string, hotelPreference: HotelPreference, travelMode: TravelMode) => void;
  onCancel: () => void;
}

const PreferenceButton: React.FC<{ 
    preference: HotelPreference | TravelMode, 
    selected: HotelPreference | TravelMode | null, 
    onClick: (pref: any) => void,
    icon: string,
    label: string
}> = ({ preference, selected, onClick, icon, label }) => {
    const isSelected = preference === selected;
    return (
        <button
            type="button"
            onClick={() => onClick(preference)}
            className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                isSelected 
                ? 'bg-[--accent-color]/20 border-[--accent-color]' 
                : 'bg-slate-900/50 border-slate-600 hover:border-slate-500'
            }`}
            style={{ 
                borderColor: isSelected ? 'var(--accent-color)' : '',
                backgroundColor: isSelected ? 'var(--accent-color-alpha, #2dd4bf20)' : ''
            }}
        >
            <i className={`fa-solid ${icon} text-2xl ${isSelected ? 'text-[--accent-color]' : 'text-slate-400'}`} style={{ color: isSelected ? 'var(--accent-color)' : '' }}></i>
            <span className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>{label}</span>
        </button>
    );
};


export const OriginModal: React.FC<OriginModalProps> = ({ destination, onConfirm, onCancel }) => {
    const [origin, setOrigin] = useState('');
    const [preference, setPreference] = useState<HotelPreference | null>(null);
    const [travelMode, setTravelMode] = useState<TravelMode | null>(null);
    const { t } = useLanguage();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(origin.trim() && preference && travelMode) {
            onConfirm(origin.trim(), preference, travelMode);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
            <div className="bg-slate-800/80 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl max-w-md w-full p-8 space-y-6 relative transform transition-all duration-300 animate-modal-pop">
                <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors" aria-label="Close">
                    <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
                
                <div className="text-center">
                    <i className="fa-solid fa-plane-departure text-4xl text-[--accent-color] mb-4" style={{ color: 'var(--accent-color)' }}></i>
                    <h2 className="text-2xl font-bold text-white">{t('originTitle')}</h2>
                    <p className="text-slate-400 mt-2">
                        {t('originSubtitle', { destination: '' })} <span className="font-semibold text-[--accent-color]" style={{ color: 'var(--accent-color)' }}>{destination}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="origin-input" className="block text-sm font-medium text-slate-300 mb-2 text-center">{t('originFromLabel')}</label>
                        <input
                            id="origin-input"
                            type="text"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            placeholder={t('originFromPlaceholder')}
                            className="w-full bg-slate-900/50 border-2 border-slate-600 focus:border-[--accent-color] focus:ring-0 rounded-lg text-lg px-4 py-3 transition-colors text-white"
                            autoFocus
                        />
                    </div>
                    
                    <div>
                         <label className="block text-sm font-medium text-slate-300 mb-2 text-center">{t('originTravelModeLabel')}</label>
                         <div className="flex gap-3">
                            <PreferenceButton preference="flight" selected={travelMode} onClick={setTravelMode} icon="fa-plane-up" label={t('travelFlight')} />
                            <PreferenceButton preference="train" selected={travelMode} onClick={setTravelMode} icon="fa-train" label={t('travelTrain')} />
                         </div>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-slate-300 mb-2 text-center">{t('originHotelLabel')}</label>
                         <div className="flex gap-3">
                            <PreferenceButton preference="low" selected={preference} onClick={setPreference} icon="fa-sack-dollar" label={t('hotelLow')} />
                            <PreferenceButton preference="average" selected={preference} onClick={setPreference} icon="fa-money-bills" label={t('hotelAverage')} />
                            <PreferenceButton preference="premium" selected={preference} onClick={setPreference} icon="fa-gem" label={t('hotelPremium')} />
                         </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[--accent-color] hover:brightness-110 disabled:bg-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-lg px-6 py-3 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                        disabled={!origin.trim() || !preference || !travelMode}
                        style={{ backgroundColor: 'var(--accent-color)' }}
                    >
                        <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
                        <span>{t('createGuide')}</span>
                    </button>
                </form>

                <div className="text-center">
                    <button onClick={onCancel} className="text-sm text-slate-500 hover:underline">
                        {t('cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};