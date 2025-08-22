
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface WelcomeMessageProps {
  onInspirationSelect: (destination: string) => void;
}

const inspirations = [
  "Kyoto, Japan",
  "Santorini, Greece",
  "Banff, Canada",
  "Machu Picchu, Peru"
];

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onInspirationSelect }) => {
  const { t } = useLanguage();
  return (
    <div className="text-center max-w-3xl mx-auto py-10 px-4 animate-fade-in">
      <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-[--accent-color] rounded-full opacity-20 blur-2xl"
        ></div>
        <i 
          className="fa-solid fa-compass text-6xl text-[--accent-color] animate-magic-icon"
        ></i>
      </div>
      
      <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
        {t('welcomeTitle')}
      </h2>
      <p className="mt-4 text-lg text-slate-300 max-w-xl mx-auto">
        {t('welcomeSubtitle')}
      </p>

      <div className="mt-12">
        <h3 className="text-slate-400 text-sm uppercase tracking-widest">{t('feelingAdventurous')}</h3>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            {inspirations.map(dest => (
                <button 
                    key={dest}
                    onClick={() => onInspirationSelect(dest)}
                    className="bg-black/20 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 text-slate-300 hover:text-white hover:border-[--accent-color] transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[--accent-color]/30"
                >
                    {dest}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};
