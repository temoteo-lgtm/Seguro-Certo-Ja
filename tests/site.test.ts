import { describe, expect, it } from "bun:test";

import { SITE_URL, absoluteUrl, normalizeSiteUrl, organizationJsonLd } from "../src/lib/site";

const FALLBACK = "https://piety-seguros-cotacao.lovable.app";

describe("normalizeSiteUrl", () => {
  it("usa o fallback quando o valor está ausente ou vazio", () => {
    expect(normalizeSiteUrl(undefined)).toBe(FALLBACK);
    expect(normalizeSiteUrl("   ")).toBe(FALLBACK);
    expect(normalizeSiteUrl(123)).toBe(FALLBACK);
  });

  it("remove a barra final e espaços", () => {
    expect(normalizeSiteUrl(" https://piety.com.br/ ")).toBe("https://piety.com.br");
    expect(normalizeSiteUrl("https://piety.com.br///")).toBe("https://piety.com.br");
  });

  it("rejeita valores inválidos ou protocolos não http(s)", () => {
    expect(normalizeSiteUrl("piety.com.br")).toBe(FALLBACK);
    expect(normalizeSiteUrl("javascript:alert(1)")).toBe(FALLBACK);
  });
});

describe("absoluteUrl", () => {
  it("monta a home com uma única barra", () => {
    expect(absoluteUrl("/")).toBe(`${SITE_URL}/`);
    expect(absoluteUrl("/").endsWith("//")).toBe(false);
  });

  it("monta rotas internas sem barra final", () => {
    expect(absoluteUrl("/privacidade")).toBe(`${SITE_URL}/privacidade`);
    expect(absoluteUrl("privacidade")).toBe(`${SITE_URL}/privacidade`);
    expect(absoluteUrl("/privacidade/")).toBe(`${SITE_URL}/privacidade`);
  });
});

describe("organizationJsonLd", () => {
  it("descreve a corretora apenas com fatos publicados", () => {
    expect(organizationJsonLd["@type"]).toBe("InsuranceAgency");
    expect(organizationJsonLd.name).toBe("PIETY Corretora de Seguros");
    expect(organizationJsonLd.url).toBe(absoluteUrl("/"));
    expect(organizationJsonLd.telephone).toBe("+55 61 98412-0001");
    expect(organizationJsonLd.taxID).toBe("57.596.795/0001-60");
    expect(organizationJsonLd.identifier.some((i) => i.value === "242162581")).toBe(true);
    expect(organizationJsonLd.address.addressLocality).toBe("Brasília");
  });

  it("não contém avaliações nem preços", () => {
    const serialized = JSON.stringify(organizationJsonLd);
    expect(serialized).not.toContain("aggregateRating");
    expect(serialized).not.toContain("priceRange");
    expect(serialized).not.toContain("review");
  });

  it("gera JSON-LD serializável", () => {
    expect(() => JSON.parse(JSON.stringify(organizationJsonLd))).not.toThrow();
  });
});
