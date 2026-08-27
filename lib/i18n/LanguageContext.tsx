"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, Lang } from "./translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "agrishare-lang";

function lookup(lang: Lang, path: string): string {
  const parts = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any = translations[lang];
  for (const part of parts) {
    if (node == null) break;
    node = node[part];
  }
  if (typeof node === "string") return node;

  // Fall back to English if a key is missing in the current language,
  // rather than showing a blank or a raw key like "nav.dashboard".
  if (lang !== "en") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fallback: any = translations.en;
    for (const part of parts) {
      if (fallback == null) break;
      fallback = fallback[part];
    }
    if (typeof fallback === "string") return fallback;
  }
  return path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "hi") {
      setLangState(stored);
    }
  }, []);

  function setLang(next: Lang) {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  function t(path: string) {
    return lookup(lang, path);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
