
import React, { useState } from 'react';
import type { Budget } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface BudgetCalculatorProps {
  budget: Budget;
}

interface CalculatedBudgets {
    stayCost: string;
    travelCost: string;
    totalCost: string;
}

const BudgetItem: React.FC<{ label: string; value: string; isTotal?: boolean }> = ({ label, value, isTotal = false }) => (
    <div className={isTotal ? "pt-3 mt-3 border-t border-[--accent-color]/30" : ""}>
        <div className="flex justify-between items-center gap-4">
            <p className="text-sm text-slate-400 uppercase tracking-wider">{label}</p>
            <p className={`font-bold text-right ${isTotal ? 'text-xl text-[--accent-color]' : 'text-lg text-white'}`} style={isTotal ? { color: 'var(--accent-color)' } : {}}>
                {value}
            </p>
        </div>
    </div>
);

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({ budget }) => {
    const { t } = useLanguage();
    const [numPeople, setNumPeople] = useState('1');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [calculatedBudgets, setCalculatedBudgets] = useState<CalculatedBudgets | null>(null);
    const [tripDetails, setTripDetails] = useState<{people: number, duration: number} | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setCalculatedBudgets(null);
        setTripDetails(null);

        const people = parseInt(numPeople, 10);
        if (isNaN(people) || people <= 0) {
            setError(t('errorNumPeople'));
            return;
        }

        if (!startDate || !endDate) {
            setError(t('errorDateRequired'));
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
            setError(t('errorDateOrder'));
            return;
        }

        const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        if (duration <= 0) {
             setError(t('errorTripLength'));
             return;
        }

        const { 
            costPerPersonLocal, localCurrencyCode, 
            costPerPersonOrigin, originCurrencyCode,
            travelCostPerPersonLocal, travelCostPerPersonOrigin 
        } = budget;
        
        const stayTotalLocal = costPerPersonLocal * people * duration;
        const stayTotalOrigin = costPerPersonOrigin * people * duration;
        
        const travelTotalLocal = travelCostPerPersonLocal * people;
        const travelTotalOrigin = travelCostPerPersonOrigin * people;

        const grandTotalLocal = stayTotalLocal + travelTotalLocal;
        const grandTotalOrigin = stayTotalOrigin + travelTotalOrigin;
        
        const originLocale = originCurrencyCode === 'INR' ? 'en-IN' : undefined;
        const localFormatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: localCurrencyCode, minimumFractionDigits: 0, maximumFractionDigits: 2 });
        const originFormatter = new Intl.NumberFormat(originLocale, { style: 'currency', currency: originCurrencyCode, minimumFractionDigits: 0, maximumFractionDigits: 2 });
        
        setCalculatedBudgets({
            stayCost: `${localFormatter.format(stayTotalLocal)} / ${originFormatter.format(stayTotalOrigin)}`,
            travelCost: `${localFormatter.format(travelTotalLocal)} / ${originFormatter.format(travelTotalOrigin)}`,
            totalCost: `${localFormatter.format(grandTotalLocal)} / ${originFormatter.format(grandTotalOrigin)}`
        });
        setTripDetails({ people, duration });
    };

    return (
        <section>
             <div className="flex items-center gap-3 mb-6">
                <i className="fa-solid fa-calculator text-[--accent-color] text-2xl" style={{ color: 'var(--accent-color)' }}></i>
                <h3 className="text-2xl font-bold text-white">{t('budgetPlannerTitle')}</h3>
            </div>
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                        <label htmlFor="num-people" className="block text-sm font-medium text-slate-300 mb-1">{t('numPeopleLabel')}</label>
                        <input 
                            type="number" 
                            id="num-people"
                            value={numPeople}
                            onChange={(e) => setNumPeople(e.target.value)}
                            min="1"
                            className="w-full bg-slate-900/50 border-2 border-slate-600 focus:border-[--accent-color] focus:ring-0 rounded-lg px-3 py-2 transition-colors text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-slate-300 mb-1">{t('startDateLabel')}</label>
                        <input 
                            type="date" 
                            id="start-date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-900/50 border-2 border-slate-600 focus:border-[--accent-color] focus:ring-0 rounded-lg px-3 py-2 transition-colors text-white"
                            style={{colorScheme: 'dark'}}
                        />
                    </div>
                    <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-slate-300 mb-1">{t('returnDateLabel')}</label>
                        <input 
                            type="date" 
                            id="end-date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-900/50 border-2 border-slate-600 focus:border-[--accent-color] focus:ring-0 rounded-lg px-3 py-2 transition-colors text-white"
                            style={{colorScheme: 'dark'}}
                        />
                    </div>
                    <button 
                        onClick={handleCalculate}
                        className="w-full bg-[--accent-color] hover:brightness-110 text-white font-bold rounded-lg px-4 py-2 transition-all duration-300 h-11"
                        style={{ backgroundColor: 'var(--accent-color)' }}
                    >
                        <i className="fa-solid fa-calculator mr-2"></i>
                        {t('calculateButton')}
                    </button>
                </div>

                {error && <p className="text-rose-400 text-sm mt-4 text-center">{error}</p>}
                
                {calculatedBudgets && tripDetails && (
                    <div className="mt-6 bg-black/20 border border-[--accent-color]/50 rounded-lg p-6" style={{ borderColor: 'var(--accent-color)' }}>
                        <div className="space-y-3">
                            <BudgetItem label={t('stayCostLabel')} value={calculatedBudgets.stayCost} />
                            <BudgetItem label={t('travelCostLabel')} value={calculatedBudgets.travelCost} />
                            <BudgetItem label={t('totalBudgetLabel')} value={calculatedBudgets.totalCost} isTotal={true} />
                        </div>
                        <p className="text-xs text-slate-400 mt-4 text-center">
                            {t('tripDetailsSummary', { people: tripDetails.people, duration: tripDetails.duration })}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};