/**
 * Construção dos links de saída para o cotador Aggilizador.
 *
 * Regras:
 * - As rotas base do cotador NUNCA são alteradas (ex.: /auto, /life, /several).
 * - Sempre acrescentamos os parâmetros de origem da PIETY.
 * - UTMs recebidas na página da PIETY são repassadas como origin_utm_* e
 *   jamais substituem os parâmetros PIETY.
 */

export const QUOTE_BASE_URL = "https://pietycorretora.aggilizador.com.br";

export const PIETY_UTM = {
  utm_source: "piety_site",
  utm_medium: "referral",
  utm_campaign: "cotacao_online",
} as const;

const INCOMING_UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/**
 * @param path rota base do cotador, ex.: "/auto"
 * @param slug slug exclusivo da modalidade, ex.: "moto"
 * @param incomingSearch query string recebida pela página da PIETY (ex.: location.search)
 */
export function buildQuoteUrl(path: string, slug: string, incomingSearch = ""): string {
  const url = new URL(path, QUOTE_BASE_URL);

  url.searchParams.set("utm_source", PIETY_UTM.utm_source);
  url.searchParams.set("utm_medium", PIETY_UTM.utm_medium);
  url.searchParams.set("utm_campaign", PIETY_UTM.utm_campaign);
  url.searchParams.set("utm_content", slug);
  url.searchParams.set("piety_modalidade", slug);
  url.searchParams.set("piety_origem", "site_institucional");

  const incoming = new URLSearchParams(
    incomingSearch.startsWith("?") ? incomingSearch.slice(1) : incomingSearch,
  );
  for (const key of INCOMING_UTM_KEYS) {
    const value = incoming.get(key);
    if (value) url.searchParams.set(`origin_${key}`, value);
  }

  return url.toString();
}
