
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchFormProps {
  onSearch: (destination: string) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [destination, setDestination] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(destination);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md border border-white/20 rounded-full shadow-lg p-2">
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full bg-transparent text-lg text-white placeholder-slate-400 px-4 py-2 focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-[--accent-color] hover:brightness-110 disabled:bg-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-full px-6 py-3 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          disabled={isLoading || !destination}
          style={{ backgroundColor: 'var(--accent-color)' }}
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin text-xl"></i>
          ) : (
            <>
              <i className="fa-solid fa-paper-plane mr-2"></i>
              <span>{t('generate')}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
