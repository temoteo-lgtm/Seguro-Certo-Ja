import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

import {
  DEFAULT_CONSENT,
  getConsent,
  hasConfiguredTrackers,
  setConsent,
  type ConsentState,
} from "@/lib/analytics";

export const OPEN_CONSENT_EVENT = "piety:open-consent";

export function openConsentPanel() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [draft, setDraft] = useState<ConsentState>(DEFAULT_CONSENT);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasConfiguredTrackers) return;
    const stored = getConsent();
    if (!stored) setOpen(true);
    else setDraft(stored);
  }, []);

  useEffect(() => {
    const reopen = () => {
      const stored = getConsent();
      if (stored) setDraft(stored);
      setCustomizing(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  const decide = useCallback((next: ConsentState) => {
    setConsent(next);
    setDraft(next);
    setOpen(false);
    setCustomizing(false);
  }, []);

  if (!open) return null;

  if (!hasConfiguredTrackers) {
    return (
      <div
        className="consent-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="consent-title"
        ref={panelRef}
      >
        <div className="consent-inner">
          <div className="consent-copy">
            <h2 id="consent-title">Cookies e privacidade</h2>
            <p>
              Este site usa apenas os cookies e recursos técnicos necessários para funcionar com
              segurança. Nenhuma ferramenta opcional de análise ou marketing está ativa neste
              momento, portanto não há preferências a ajustar.{" "}
              <Link to="/privacidade">Política de Privacidade</Link>.
            </p>
          </div>
          <div className="consent-actions">
            <button
              type="button"
              className="consent-button consent-button-primary"
              onClick={() => {
                setOpen(false);
                setCustomizing(false);
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="consent-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      ref={panelRef}
    >
      <div className="consent-inner">
        <div className="consent-copy">
          <h2 id="consent-title">Sua privacidade</h2>
          <p>
            Usamos cookies essenciais para o funcionamento do site. Com o seu consentimento,
            também usamos cookies de análise e de marketing para entender o uso das páginas.{" "}
            <Link to="/privacidade">Política de Privacidade</Link>.
          </p>

          {customizing ? (
            <fieldset className="consent-options">
              <legend className="sr-only">Categorias de cookies</legend>
              <label className="consent-option is-locked">
                <input type="checkbox" checked disabled />
                <span>
                  <strong>Essenciais</strong>
                  <small>Necessários para o site funcionar. Sempre ativos.</small>
                </span>
              </label>
              <label className="consent-option">
                <input
                  type="checkbox"
                  checked={draft.analytics}
                  onChange={(event) =>
                    setDraft((state) => ({ ...state, analytics: event.target.checked }))
                  }
                />
                <span>
                  <strong>Análise</strong>
                  <small>Medição de uso das páginas, sem dados pessoais identificáveis.</small>
                </span>
              </label>
              <label className="consent-option">
                <input
                  type="checkbox"
                  checked={draft.marketing}
                  onChange={(event) =>
                    setDraft((state) => ({ ...state, marketing: event.target.checked }))
                  }
                />
                <span>
                  <strong>Marketing</strong>
                  <small>Mensuração de campanhas.</small>
                </span>
              </label>
            </fieldset>
          ) : null}
        </div>

        <div className="consent-actions">
          <button
            type="button"
            className="consent-button consent-button-primary"
            onClick={() => decide({ analytics: true, marketing: true })}
          >
            Aceitar todos
          </button>
          <button
            type="button"
            className="consent-button consent-button-ghost"
            onClick={() => decide(DEFAULT_CONSENT)}
          >
            Recusar não essenciais
          </button>
          {customizing ? (
            <button
              type="button"
              className="consent-button consent-button-ghost"
              onClick={() => decide(draft)}
            >
              Salvar preferências
            </button>
          ) : (
            <button
              type="button"
              className="consent-button consent-button-ghost"
              onClick={() => setCustomizing(true)}
            >
              Personalizar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
