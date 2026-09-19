# PIETY Seguros | Cotação Online

Portal institucional e de cotação da **PIETY Corretora de Seguros** (CNPJ 57.596.795/0001-60,
registro SUSEP 242162581, Brasília/DF).

- URL publicada: https://piety-seguros-cotacao.lovable.app
- Atendimento: WhatsApp +55 61 98412-0001

## O que o projeto é

Um site **sem backend e sem banco de dados próprio**: o site apresenta as 13 modalidades de
seguro e encaminha o visitante ao cotador da PIETY (Aggilizador,
`https://pietycorretora.aggilizador.com.br`), acrescentando UTMs e o slug da modalidade ao
link para permitir a atribuição de origem. Os dados de cotação **não são persistidos aqui** —
os formulários são processados pelo Aggilizador. A hospedagem pode processar dados técnicos
de acesso e de sessão, conforme descrito na [Política de Privacidade](/privacidade).

## Desenvolvimento

```sh
npm i
npm run dev
```

## Build, testes e verificações

```sh
bun run build            # build de produção
bunx tsgo --noEmit       # verificação de tipos
bun test                 # testes (links do cotador e configuração de URL/SEO)
```

## Variáveis de ambiente

Veja `.env.example`.

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `VITE_SITE_URL` | não | URL pública canônica usada em canonical, og:url e JSON-LD. Sem ela, usa a URL publicada padrão. |
| `VITE_GA_MEASUREMENT_ID` | não | ID do GA4 (`G-XXXXXXX`). Vazio: o GA4 não é carregado. |
| `VITE_META_PIXEL_ID` | não | ID numérico do Meta Pixel. Vazio: o Pixel não é carregado. |

Nenhum script de análise ou marketing é carregado sem **consentimento explícito** e sem um ID
válido configurado.

## Estrutura relevante

- `src/routes/index.tsx` — home (hero, 13 modalidades, passos, FAQ, rodapé)
- `src/routes/privacidade.tsx` — Política de Privacidade
- `src/lib/site.ts` — origem pública canônica e JSON-LD da corretora
- `src/lib/quote-links.ts` — montagem dos links do cotador com UTMs
- `src/lib/analytics.ts` — consentimento e eventos (sem PII)
