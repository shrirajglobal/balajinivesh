import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import bn from "@/locales/bn.json";

export type Language = "en" | "hi" | "bn";

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "EN",
  hi: "हिं",
  bn: "বাং",
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, any>> = { en, hi, bn };

const getNestedValue = (obj: any, path: string): string => {
  const value = path.split(".").reduce((current, key) => current?.[key], obj);
  if (typeof value === "string") return value;

  // Fall back to English if the key is missing in the current language
  const enValue = path.split(".").reduce((current, key) => current?.[key], translations.en);
  if (typeof enValue === "string") {
    if (import.meta.env.DEV) {
      console.warn(`[i18n] Missing translation for "${path}" — falling back to English.`);
    }
    return enValue;
  }

  if (import.meta.env.DEV) {
    console.warn(`[i18n] Missing translation for "${path}" in ALL languages, including English.`);
  }
  return path;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    const stored = localStorage.getItem("balaji-nivesh-lang");
    if (stored === "hi" || stored === "bn" || stored === "en") return stored as Language;
    return "en";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("balaji-nivesh-lang", lang);
  }, []);

  const t = useCallback((key: string): string => {
    return getNestedValue(translations[language], key);
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
