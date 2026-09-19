import { describe, expect, it } from "bun:test";

import { buildQuoteUrl, QUOTE_BASE_URL } from "../src/lib/quote-links";

describe("buildQuoteUrl", () => {
  it("mantém a rota base do cotador", () => {
    const url = new URL(buildQuoteUrl("/auto", "auto"));
    expect(url.origin).toBe(QUOTE_BASE_URL);
    expect(url.pathname).toBe("/auto");
  });

  it("acrescenta as UTMs da PIETY e o slug da modalidade", () => {
    const url = new URL(buildQuoteUrl("/auto", "caminhao"));
    expect(url.searchParams.get("utm_source")).toBe("piety_site");
    expect(url.searchParams.get("utm_medium")).toBe("referral");
    expect(url.searchParams.get("utm_campaign")).toBe("cotacao_online");
    expect(url.searchParams.get("utm_content")).toBe("caminhao");
    expect(url.searchParams.get("piety_modalidade")).toBe("caminhao");
    expect(url.searchParams.get("piety_origem")).toBe("site_institucional");
  });

  it("distingue auto, moto e caminhão na mesma rota /auto", () => {
    const slugs = ["auto", "moto", "caminhao"].map(
      (slug) => new URL(buildQuoteUrl("/auto", slug)).searchParams.get("piety_modalidade"),
    );
    expect(new Set(slugs).size).toBe(3);
  });

  it("preserva UTMs de campanha como origin_utm_* sem sobrescrever as da PIETY", () => {
    const url = new URL(
      buildQuoteUrl(
        "/travel",
        "viagem",
        "?utm_source=google&utm_medium=cpc&utm_campaign=verao&utm_content=anuncio1&utm_term=seguro+viagem",
      ),
    );
    expect(url.searchParams.get("utm_source")).toBe("piety_site");
    expect(url.searchParams.get("utm_content")).toBe("viagem");
    expect(url.searchParams.get("origin_utm_source")).toBe("google");
    expect(url.searchParams.get("origin_utm_medium")).toBe("cpc");
    expect(url.searchParams.get("origin_utm_campaign")).toBe("verao");
    expect(url.searchParams.get("origin_utm_content")).toBe("anuncio1");
    expect(url.searchParams.get("origin_utm_term")).toBe("seguro viagem");
  });

  it("ignora UTMs ausentes", () => {
    const url = new URL(buildQuoteUrl("/bike", "bike", "?foo=bar"));
    expect(url.searchParams.get("origin_utm_source")).toBeNull();
  });
});
