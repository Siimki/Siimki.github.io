import type { Locale } from "./site";

const scopeMap: Record<string, string> = {
  "Ventilatsioonitööd": "Ventilation works",
  "Ventilatsioon": "Ventilation",
  "Ventilatsioon, automaatika": "Ventilation, automation",
  "Ventilatsioonitööd, automaatika": "Ventilation works, automation",
  "Ventilatsioonitööd, projekteerimine": "Ventilation works, design",
  "Projekteerimine": "Design",
  "Projekteerimine, ventilatsioonitööd": "Design, ventilation works",
  "Ventilatsioon, kuivatus": "Ventilation, drying",
  "Ventilatsiooni-, jahutusetööd": "Ventilation and cooling works",
  "Ventilatsiooni-, automaatikatööd": "Ventilation and automation works",
  "Ventilatsiooni-, jahutuse- ja automaatikatööd": "Ventilation, cooling, and automation works",
  "Ventilatsiooni-, jahutuse- ja küttetööd": "Ventilation, cooling, and heating works",
  "Ventilatsioonitööd, jahutusetööd": "Ventilation and cooling works",
  "Ventilatsiooni- ja automaatikatööd": "Ventilation and automation works",
  "Suitsutõrjesüsteemid": "Smoke control systems",
  "Ventilatsioon, suitsutõrjesüsteemid": "Ventilation, smoke control systems",
};

export function projectScopeLabel(scope: string, locale: Locale) {
  if (locale === "et") return scope;
  return scopeMap[scope] ?? scope;
}
