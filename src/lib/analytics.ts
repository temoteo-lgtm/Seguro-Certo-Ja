/**
 * Camada central de analytics da PIETY.
 *
 * Princípios:
 * - Consentimento padrão NEGADO. Nada é carregado nem enviado antes do aceite.
 * - Só carrega scripts externos se houver IDs públicos válidos configurados
 *   (VITE_GA_MEASUREMENT_ID no formato G-XXXX e VITE_META_PIXEL_ID numérico).
 * - Nunca envie PII (nome, telefone, CPF, CNPJ, e-mail) nos eventos.
 * - Falhas de rede/ad blockers são tratadas silenciosamente.
 *
 * NOTA SOBRE CONVERSÃO FINAL:
 * Os eventos aqui medem INTENÇÃO (clique para cotar, contato por WhatsApp).
 * Eventos de cotação concluída (GA4 `quote_complete` / `generate_lead` e
 * Meta `Lead`) só podem ser implementados quando o Aggilizador fornecer
 * retorno confiável: página de sucesso, postMessage ou webhook. Enquanto isso
 * não existir, não dispare Lead/conversão — seria uma métrica falsa.
 */

const CONSENT_STORAGE_KEY = "piety_consent_v1";

export type ConsentState = {
  analytics: boolean;
  marketing: boolean;
};

export type StoredConsent = ConsentState & {
  version: 1;
  updatedAt: string;
};

export const DEFAULT_CONSENT: ConsentState = { analytics: false, marketing: false };

const GA_ID_RAW = import.meta.env["VITE_GA_MEASUREMENT_ID"] as string | undefined;
const PIXEL_ID_RAW = import.meta.env["VITE_META_PIXEL_ID"] as string | undefined;

export const GA_MEASUREMENT_ID =
  typeof GA_ID_RAW === "string" && /^G-[A-Z0-9]{4,}$/i.test(GA_ID_RAW.trim())
    ? GA_ID_RAW.trim()
    : null;

export const META_PIXEL_ID =
  typeof PIXEL_ID_RAW === "string" && /^\d{6,20}$/.test(PIXEL_ID_RAW.trim())
    ? PIXEL_ID_RAW.trim()
    : null;

/** Há algum tracker externo configurado? Se não, nem mostramos o banner. */
export const hasConfiguredTrackers = Boolean(GA_MEASUREMENT_ID || META_PIXEL_ID);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: unknown;
  }
}

const listeners = new Set<(consent: ConsentState | null) => void>();
let current: ConsentState | null = null;
let hydrated = false;

function safe(run: () => void) {
  try {
    run();
  } catch {
    /* ad blockers e afins: falha silenciosa */
  }
}

export function readStoredConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed?.version !== 1) return null;
    return { analytics: Boolean(parsed.analytics), marketing: Boolean(parsed.marketing) };
  } catch {
    return null;
  }
}

/** Estado atual do consentimento (null = ainda não decidido). */
export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  if (!hydrated) {
    current = readStoredConsent();
    hydrated = true;
    if (current) applyConsent(current);
  }
  return current;
}

export function setConsent(next: ConsentState) {
  if (typeof window === "undefined") return;
  current = next;
  hydrated = true;
  safe(() => {
    const payload: StoredConsent = { ...next, version: 1, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  });
  applyConsent(next);
  listeners.forEach((listener) => listener(next));
}

export function subscribeConsent(listener: (consent: ConsentState | null) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/* ------------------------------------------------------------------ */
/* Carregamento dos scripts                                            */
/* ------------------------------------------------------------------ */

let gaLoaded = false;
let pixelLoaded = false;

function loadGa() {
  if (gaLoaded || !GA_MEASUREMENT_ID || typeof document === "undefined") return;
  gaLoaded = true;
  safe(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.onerror = () => {
      /* bloqueado: seguimos sem analytics */
    };
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
  });
}

function loadPixel() {
  if (pixelLoaded || !META_PIXEL_ID || typeof document === "undefined") return;
  pixelLoaded = true;
  safe(() => {
    /* eslint-disable */
    const n: any = (window.fbq = function (...args: unknown[]) {
      // shim padrão do Meta Pixel
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    } as any);
    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    /* eslint-enable */
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.onerror = () => {
      /* bloqueado: seguimos sem marketing */
    };
    document.head.appendChild(script);
    window.fbq?.("init", META_PIXEL_ID);
    window.fbq?.("track", "PageView");
  });
}

function applyConsent(consent: ConsentState) {
  if (consent.analytics) loadGa();
  if (consent.marketing) loadPixel();
}

/* ------------------------------------------------------------------ */
/* Eventos (sem PII)                                                   */
/* ------------------------------------------------------------------ */

function gaEvent(name: string, params: Record<string, string | number> = {}) {
  const consent = getConsent();
  if (!consent?.analytics || !GA_MEASUREMENT_ID) return;
  safe(() => window.gtag?.("event", name, params));
}

function metaCustom(name: string, params: Record<string, string | number> = {}) {
  const consent = getConsent();
  if (!consent?.marketing || !META_PIXEL_ID) return;
  safe(() => window.fbq?.("trackCustom", name, params));
}

export function trackPageView(path: string) {
  gaEvent("page_view", { page_path: path });
}

export type QuoteClickPayload = {
  insurance_type: string;
  insurance_group: string;
  destination_path: string;
  card_position: number;
};

export function trackQuoteClick(payload: QuoteClickPayload) {
  gaEvent("quote_click", payload);
  metaCustom("InitiateQuote", payload);
}

export type WhatsAppPlacement =
  | "header"
  | "hero"
  | "mobile_menu"
  | "benefits"
  | "final_cta"
  | "floating";

export function trackWhatsAppClick(placement: WhatsAppPlacement) {
  gaEvent("whatsapp_click", { placement });
  metaCustom("WhatsAppContact", { placement });
}

export function trackViewInsuranceOptions() {
  gaEvent("view_insurance_options");
}
