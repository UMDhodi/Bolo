import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { getT, type LanguageCode, type TranslationDict } from "@/lib/i18n";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: TranslationDict;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  t: getT("en"),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const value = useMemo(
    () => ({ language, setLanguage, t: getT(language) }),
    [language],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Reactive translation hook — re-renders when language changes. */
export function useT(): TranslationDict {
  return useContext(LanguageContext).t;
}
