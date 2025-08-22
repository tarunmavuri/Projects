import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations } from '../lib/translations';

const supportedLanguages = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'ru', 'pt', 'it', 'ar', 'hi', 'id', 'nl', 'pl'] as const;

type Language = typeof supportedLanguages[number];
export type TranslationKey = keyof typeof translations.en;

export type TFunction = (key: TranslationKey, replacements?: { [key: string]: string | number }) => string;

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: TFunction;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        try {
            const storedLang = localStorage.getItem('language');
            if (storedLang && (supportedLanguages as readonly string[]).includes(storedLang)) {
                return storedLang as Language;
            }
            // You can add browser language detection here as a fallback
            return 'en';
        } catch {
            return 'en';
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('language', language);
        } catch (e) {
            console.error("Failed to save language to localStorage", e);
        }
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = useCallback((key: TranslationKey, replacements?: { [key: string]: string | number }): string => {
        const translationSet = translations[language] || translations.en;
        let translation = translationSet[key] || translations.en[key] || key;
        
        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
            });
        }

        return translation;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};