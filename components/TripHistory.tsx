
import React from 'react';
import type { TripHistoryItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import type { TFunction } from '../contexts/LanguageContext';

interface TripHistoryProps {
  history: TripHistoryItem[];
  onSelect: (item: TripHistoryItem) => void;
}

// Helper to format time since the trip was searched
const timeAgo = (timestamp: number, t: TFunction): string => {
    const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return t('yearsAgo', { count: Math.floor(interval) });
    interval = seconds / 2592000;
    if (interval > 1) return t('monthsAgo', { count: Math.floor(interval) });
    interval = seconds / 86400;
    if (interval > 1) return t('daysAgo', { count: Math.floor(interval) });
    interval = seconds / 3600;
    if (interval > 1) return t('hoursAgo', { count: Math.floor(interval) });
    interval = seconds / 60;
    if (interval > 1) return t('minutesAgo', { count: Math.floor(interval) });
    return t('justNow');
}

export const TripHistory: React.FC<TripHistoryProps> = ({ history, onSelect }) => {
  const { t } = useLanguage();
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-300">{t('myTrips')}</h2>
            <p className="mt-1 text-slate-400">
                {t('myTripsSubtitle')}
            </p>
        </div>
        <div className="space-y-3">
            {history.map(item => (
                <button
                    key={item.timestamp}
                    onClick={() => onSelect(item)}
                    className="w-full text-left bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 rounded-lg shadow-lg p-4 transition-all duration-300 transform hover:scale-105"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold text-lg text-white">{item.destination}</p>
                            <p className="text-sm text-slate-400 flex items-center gap-2">
                                <span>{t('tripFrom', { origin: item.origin })}</span>
                                <span className="text-slate-600">&middot;</span>
                                <span className="capitalize">{t('tripHotel', { hotelPreference: item.hotelPreference })}</span>
                                <span className="text-slate-600">&middot;</span>
                                <span className="flex items-center gap-1.5 capitalize">
                                    <i className={`fa-solid ${item.travelMode === 'flight' ? 'fa-plane-up' : 'fa-train'}`}></i>
                                    {item.travelMode}
                                </span>
                            </p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                            <span className="text-sm text-slate-500 hidden sm:block">{timeAgo(item.timestamp, t)}</span>
                            <i className="fa-solid fa-arrow-right text-slate-400"></i>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    </div>
  );
};