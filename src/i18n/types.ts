export type Locale = "en" | "fa" | "ps";

export const LOCALES: { code: Locale; label: string; flag: string; native: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", flag: "🇬🇧", native: "English", dir: "ltr" },
  { code: "fa", label: "Dari", flag: "🇦🇫", native: "دری", dir: "rtl" },
  { code: "ps", label: "Pashto", flag: "🇦🇫", native: "پښتو", dir: "rtl" },
];

export type TranslationKey = string;

// Nested translation tree
export type TranslationTree = {
  [key: string]: string | TranslationTree;
};

export type Translations = Record<Locale, TranslationTree>;