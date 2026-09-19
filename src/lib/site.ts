/**
 * Origem pública canônica do site da PIETY.
 *
 * Aceita VITE_SITE_URL (útil para domínio próprio) e usa como fallback a URL
 * publicada atual. A origem é sempre normalizada: sem espaços, sem barra final.
 */

const FALLBACK_SITE_URL = "https://piety-seguros-cotacao.lovable.app";

export function normalizeSiteUrl(value: unknown): string {
  if (typeof value !== "string") return FALLBACK_SITE_URL;
  const trimmed = value.trim();
  if (!trimmed) return FALLBACK_SITE_URL;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return FALLBACK_SITE_URL;
    return `${parsed.origin}${parsed.pathname.replace(/\/+$/, "")}`;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const SITE_URL = normalizeSiteUrl(import.meta.env["VITE_SITE_URL"]);

export const SITE_NAME = "PIETY Seguros";

/** Monta uma URL absoluta a partir de um caminho da aplicação. */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${clean.replace(/\/+$/, "")}`;
}

/** JSON-LD da corretora — apenas fatos já publicados no site. */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  name: "PIETY Corretora de Seguros",
  url: absoluteUrl("/"),
  telephone: "+55 61 98412-0001",
  taxID: "57.596.795/0001-60",
  identifier: [
    { "@type": "PropertyValue", name: "CNPJ", value: "57.596.795/0001-60" },
    { "@type": "PropertyValue", name: "Registro SUSEP", value: "242162581" },
  ],
  areaServed: "BR",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Brasília",
    addressRegion: "DF",
    addressCountry: "BR",
  },
} as const;
