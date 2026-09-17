# PIETY Seguros — Cotação Online

Portal institucional, responsivo e acessível para direcionar clientes aos fluxos oficiais de cotação da PIETY Corretora de Seguros.

## Visão geral

- 13 modalidades de seguro organizadas por categoria.
- Links diretos para o cotador Aggilizador.
- Cards com efeito 3D leve, brilho e microinterações.
- Elemento 3D em CSS no hero, sem dependências pesadas.
- Layout mobile-first, navegação por teclado e suporte a `prefers-reduced-motion`.
- CTA e botão flutuante para WhatsApp.
- Sem banco de dados, autenticação ou coleta local de dados.

## Rodar localmente

O projeto é estático e não exige instalação de pacotes.

```bash
python3 -m http.server 8080
```

Depois, acesse `http://localhost:8080`.

## Mapa dos links do cotador

| Modalidade | Destino |
| --- | --- |
| Auto | `https://pietycorretora.aggilizador.com.br/auto` |
| Moto | `https://pietycorretora.aggilizador.com.br/auto` |
| Caminhão | `https://pietycorretora.aggilizador.com.br/auto` |
| Residencial | `https://pietycorretora.aggilizador.com.br/residence` |
| Empresa | `https://pietycorretora.aggilizador.com.br/business` |
| Condomínio | `https://pietycorretora.aggilizador.com.br/condominium` |
| Vida Individual | `https://pietycorretora.aggilizador.com.br/life` |
| Vida Global | `https://pietycorretora.aggilizador.com.br/lifeglobal` |
| Acidentes Pessoais | `https://pietycorretora.aggilizador.com.br/api` |
| Viagem | `https://pietycorretora.aggilizador.com.br/travel` |
| Bike | `https://pietycorretora.aggilizador.com.br/bike` |
| Aluguel | `https://pietycorretora.aggilizador.com.br/rent` |
| Diversos | `https://pietycorretora.aggilizador.com.br/several` |

## Estrutura

- `index.html`: conteúdo e semântica da página.
- `styles.css`: identidade visual, responsividade, motion e efeitos 3D.
- `script.js`: menu móvel, reveal on scroll e tilt progressivo.
- `favicon.svg`: ícone da marca.

## Publicação

Pode ser publicado diretamente em GitHub Pages, Netlify, Cloudflare Pages ou importado no Lovable. Em GitHub Pages, selecione a branch `main` e a pasta raiz nas configurações de Pages.

## Observação

A contratação está sujeita à análise e às condições das seguradoras.
