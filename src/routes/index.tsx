import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  Bike,
  BriefcaseBusiness,
  Building2,
  Car,
  CarFront,
  Check,
  ClipboardPenLine,
  Clock3,
  FileText,
  Heart,
  HeartPulse,
  HeartHandshake,
  House,
  KeyRound,
  Menu,
  MessageCircle,
  MousePointerClick,
  Plane,
  PlaneTakeoff,
  Plus,
  Shapes,
  Shield,
  ShieldCheck,
  Truck,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { openConsentPanel } from "@/components/CookieConsent";
import { buildQuoteUrl } from "@/lib/quote-links";
import { SITE_NAME, absoluteUrl, organizationJsonLd } from "@/lib/site";
import {
  trackQuoteClick,
  trackViewInsuranceOptions,
  trackWhatsAppClick,
  type WhatsAppPlacement,
} from "@/lib/analytics";
import pietyLogoNegativeAsset from "@/assets/piety-logo-negativa.png.asset.json";

const whatsappUrl =
  "https://wa.me/5561984120001?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20PIETY%20e%20gostaria%20de%20falar%20sobre%20seguros.";

type Product = {
  name: string;
  text: string;
  path: string;
  slug: string;
  icon: LucideIcon | typeof MotorcycleIcon;
  featured?: boolean;
};

function MotorcycleIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="5" cy="17" r="3" />
      <circle cx="19" cy="17" r="3" />
      <path d="M8 17h4l3-6h3l2 6M8 17l3-7h3M10 7h4M5 17l3-4h3" />
    </svg>
  );
}

const products: Array<{ number: string; title: string; items: Product[] }> = [
  {
    number: "01",
    title: "Veículos",
    items: [
      { name: "Auto", text: "Proteção para seu carro, do dia a dia às viagens.", path: "/auto", slug: "auto", icon: CarFront },
      { name: "Moto", text: "Cobertura para rodar com mais tranquilidade.", path: "/auto", slug: "moto", icon: MotorcycleIcon },
      { name: "Caminhão", text: "Segurança para o veículo que move o seu negócio.", path: "/auto", slug: "caminhao", icon: Truck },
      { name: "Bike", text: "Cobertura para sua bike em diferentes trajetos.", path: "/bike", slug: "bike", icon: Bike },
    ],
  },
  {
    number: "02",
    title: "Imóveis & Negócios",
    items: [
      { name: "Residencial", text: "Sua casa e o que importa dentro dela.", path: "/residence", slug: "residencial", icon: House },
      { name: "Empresa", text: "Proteção sob medida para o seu negócio.", path: "/business", slug: "empresa", icon: BriefcaseBusiness },
      { name: "Condomínio", text: "Coberturas para a estrutura e a rotina do condomínio.", path: "/condominium", slug: "condominio", icon: Building2 },
      { name: "Aluguel", text: "Soluções que trazem segurança à locação.", path: "/rent", slug: "aluguel", icon: KeyRound },
    ],
  },
  {
    number: "03",
    title: "Pessoas",
    items: [
      { name: "Vida Individual", text: "Cuidado financeiro para você e sua família.", path: "/life", slug: "vida_individual", icon: HeartHandshake },
      { name: "Vida Global", text: "Proteção coletiva para equipes e grupos.", path: "/lifeglobal", slug: "vida_global", icon: UsersRound },
      { name: "Acidentes Pessoais", text: "Amparo para os imprevistos da vida.", path: "/api", slug: "acidentes_pessoais", icon: HeartPulse },
      { name: "Viagem", text: "Suporte e proteção em cada destino.", path: "/travel", slug: "viagem", icon: PlaneTakeoff },
    ],
  },
  {
    number: "04",
    title: "Não achou o seu?",
    items: [
      { name: "Outros seguros", text: "Encontre uma solução para necessidades específicas.", path: "/several", slug: "diversos", icon: Shapes, featured: true },
    ],
  },
];

const faqItems = [
  {
    question: "A cotação é gratuita?",
    answer:
      "Sim. A cotação é gratuita e não gera obrigação de contratação. Você só avança se quiser.",
  },
  {
    question: "Quanto tempo leva para receber as opções?",
    answer:
      "Muitas cotações podem chegar em alguns minutos, mas o prazo varia conforme a modalidade, o perfil informado e a análise das seguradoras.",
  },
  {
    question: "Preencher o formulário já significa contratar o seguro?",
    answer:
      "Não. A contratação só ocorre após proposta, análise, aceite e conforme as condições da seguradora.",
  },
  {
    question: "Como meus dados serão utilizados?",
    answer:
      "Os dados são utilizados para elaborar a cotação e prestar atendimento, com o compartilhamento necessário às seguradoras e prestadores envolvidos.",
    privacyLink: true,
  },
  {
    question: "Posso falar com um especialista?",
    answer:
      "Sim. O atendimento humano da PIETY está disponível pelo WhatsApp oficial (61) 98412-0001.",
  },
  {
    question: "Quais informações podem ser solicitadas?",
    answer:
      "As informações variam conforme o seguro escolhido. Em geral, são dados de contato e dados relacionados ao que será protegido, como veículo, imóvel, atividade ou viagem.",
  },
];

const homeTitle = "PIETY Seguros | Cotação Online";
const homeDescription =
  "Encontre o seguro ideal com a PIETY. Faça sua cotação online de Auto, Residencial, Vida, Viagem, Empresa e muito mais.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: homeTitle },
      { name: "description", content: homeDescription },
      { property: "og:title", content: homeTitle },
      { property: "og:description", content: homeDescription },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:url", content: absoluteUrl("/") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: homeTitle },
      { name: "twitter:description", content: homeDescription },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(organizationJsonLd),
      },
    ],
  }),
  component: Index,
});

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a className={`brand${footer ? " brand-footer" : ""}`} href="#inicio" aria-label="PIETY Seguros — início">
      <img className="brand-signature" src={pietyLogoNegativeAsset.url} alt="PIETY Corretora de Seguros" />
    </a>
  );
}

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <span className={`eyebrow${dark ? " eyebrow-dark" : ""}`}><span />{children}</span>;
}

function WhatsAppLink({
  placement,
  className,
  children,
  onClick,
  ariaLabel,
}: {
  placement: WhatsAppPlacement;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <a
      className={className}
      aria-label={ariaLabel}
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackWhatsAppClick(placement);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

function InsuranceCard({
  item,
  group,
  position,
  search,
}: {
  item: Product;
  group: string;
  position: number;
  search: string;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--rx", `${((0.5 - y) * 9).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--ry", `${((x - 0.5) * 10).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--glow-x", `${(x * 100).toFixed(1)}%`);
    event.currentTarget.style.setProperty("--glow-y", `${(y * 100).toFixed(1)}%`);
  };
  const resetTilt = () => {
    cardRef.current?.style.setProperty("--rx", "0deg");
    cardRef.current?.style.setProperty("--ry", "0deg");
  };
  const Icon = item.icon;
  const href = buildQuoteUrl(item.path, item.slug, search);
  return (
    <a
      ref={cardRef}
      className={`insurance-card reveal${item.featured ? " insurance-card-featured" : ""}`}
      href={href}
      aria-label={`Cotar Seguro ${item.name} agora`}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
      onBlur={resetTilt}
      onClick={() =>
        trackQuoteClick({
          insurance_type: item.slug,
          insurance_group: group,
          destination_path: item.path,
          card_position: position,
        })
      }
    >
      <span className="card-icon"><Icon aria-hidden="true" /><i className="card-icon-accent" /></span>
      <span className="card-kicker">Seguro</span><h4>{item.name}</h4>
      <p>{item.text}</p>
      <span className="card-action">{item.featured ? "Conhecer opções" : "Cotar agora"}<ArrowRight aria-hidden="true" /></span>
    </a>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const search = useRouterState({ select: (state) => state.location.searchStr });
  const productsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const updateHeader = () => setScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = document.querySelectorAll(".reveal");
    if (reduced || !("IntersectionObserver" in window)) elements.forEach((element) => element.classList.add("is-visible"));
    else {
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { rootMargin: "0px 0px -7% 0px", threshold: 0.08 });
      elements.forEach((element) => observer.observe(element));
      return () => { observer.disconnect(); window.removeEventListener("scroll", updateHeader); };
    }
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  // view_insurance_options: dispara uma única vez, quando a seção dos cards aparece.
  useEffect(() => {
    const section = productsRef.current;
    if (!section || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          trackViewInsuranceOptions();
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => { document.body.classList.toggle("menu-open", menuOpen); return () => document.body.classList.remove("menu-open"); }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="container header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Navegação principal"><a href="#seguros">Seguros</a><a href="#como-funciona">Como funciona</a><a href="#por-que-piety">Por que a PIETY</a><a href="#perguntas">Dúvidas</a></nav>
          <WhatsAppLink placement="header" className="button button-small button-outline header-cta">Falar com especialista</WhatsAppLink>
          <Button variant="ghost" size="icon" className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
        <nav className={`mobile-menu${menuOpen ? " is-open" : ""}`} id="mobile-menu" aria-label="Navegação móvel"><a href="#seguros" onClick={() => setMenuOpen(false)}>Seguros</a><a href="#como-funciona" onClick={() => setMenuOpen(false)}>Como funciona</a><a href="#por-que-piety" onClick={() => setMenuOpen(false)}>Por que a PIETY</a><a href="#perguntas" onClick={() => setMenuOpen(false)}>Dúvidas</a><WhatsAppLink placement="mobile_menu" onClick={() => setMenuOpen(false)}>Falar no WhatsApp</WhatsAppLink></nav>
      </header>

      <main id="conteudo">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-glow hero-glow-one" aria-hidden="true" /><div className="hero-glow hero-glow-two" aria-hidden="true" />
          <div className="container hero-grid">
            <div className="hero-copy reveal is-visible">
              <Eyebrow>Proteção para cada momento</Eyebrow>
              <h1 id="hero-title">Seu seguro,<br /><em>do seu jeito.</em></h1>
              <p>Escolha a proteção ideal e comece sua cotação online. Simples, rápido e com o atendimento de quem entende.</p>
              <div className="hero-actions"><a className="button button-primary" href="#seguros">Ver opções de seguro<ArrowRight /></a><WhatsAppLink placement="hero" className="text-link">Prefere falar com alguém? <span>WhatsApp</span></WhatsAppLink></div>
              <ul className="trust-list" aria-label="Vantagens"><li><Check /> Cotação digital</li><li><Check /> Atendimento humano</li><li><Check /> Diversas modalidades</li></ul>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="orbit-scene"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><div className="orb"><div className="orb-sheen" /><div className="shield-core"><Shield className="shield-outline" /><img src="/piety-symbol.png" alt="" /></div></div><span className="floating-chip chip-car orbit-near"><Car /></span><span className="floating-chip chip-home orbit-near"><House /></span><span className="floating-chip chip-heart orbit-near"><Heart /></span><span className="floating-chip chip-business orbit-far"><BriefcaseBusiness /></span><span className="floating-chip chip-plane orbit-far"><Plane /></span><span className="floating-chip chip-key orbit-far"><KeyRound /></span></div>
              <div className="visual-caption"><span className="caption-dot" /><div><strong>13 modalidades</strong><small>Uma escolha para cada necessidade</small></div></div>
            </div>
          </div>
        </section>

        <section className="products-section" id="seguros" aria-labelledby="products-title" ref={productsRef}>
          <div className="container">
            <header className="section-heading reveal"><Eyebrow dark>Encontre sua proteção</Eyebrow><div><h2 id="products-title">Qual seguro você precisa?</h2><p>Selecione uma opção para ir direto à cotação.</p></div></header>
            {products.map((group) => <section className="product-group" aria-labelledby={`group-${group.number}`} key={group.number}><div className="group-heading reveal"><span>{group.number}</span><h3 id={`group-${group.number}`}>{group.title}</h3><i /></div><div className="cards-grid cards-grid-four">{group.items.map((item, index) => <InsuranceCard item={item} group={group.title} position={index + 1} search={search} key={item.slug} />)}</div></section>)}
          </div>
        </section>

        <section className="steps-section" id="como-funciona" aria-labelledby="steps-title"><div className="container"><div className="steps-heading reveal"><Eyebrow>Simples de verdade</Eyebrow><h2 id="steps-title">Sua cotação em 3 passos.</h2></div><ol className="steps-grid"><li className="step-card reveal"><span className="step-number">01</span><span className="step-icon" aria-hidden="true"><MousePointerClick /></span><div><h3>Escolha seu seguro</h3><p>Selecione a proteção ideal entre as opções disponíveis.</p></div></li><li className="step-card reveal"><span className="step-number">02</span><span className="step-icon" aria-hidden="true"><ClipboardPenLine /></span><div><h3>Preencha seus dados</h3><p>Informe os dados necessários no cotador de forma rápida e segura.</p></div></li><li className="step-card step-card-whatsapp reveal"><span className="step-number">03</span><span className="step-icon" aria-hidden="true"><MessageCircle /></span><div><h3>Receba sua cotação no WhatsApp</h3><p>Em alguns minutos, a PIETY envia as opções diretamente para você.</p></div></li></ol></div></section>

        <section className="benefits-section" id="por-que-piety" aria-labelledby="benefits-title"><div className="container benefits-grid"><div className="benefits-copy reveal"><Eyebrow dark>PIETY com você</Eyebrow><h2 id="benefits-title">Tecnologia para facilitar. Pessoas para cuidar.</h2><p>Uma jornada digital clara, com o suporte de especialistas quando você precisar.</p><WhatsAppLink placement="benefits" className="button button-dark">Falar com especialista<ArrowRight /></WhatsAppLink></div><ul className="benefits-list"><li className="reveal"><span><ShieldCheck /></span><div><h3>Atendimento especializado</h3><p>Orientação para tornar a escolha mais segura e tranquila.</p></div></li><li className="reveal"><span><FileText /></span><div><h3>Processo digital</h3><p>Você inicia sua cotação online, onde estiver.</p></div></li><li className="reveal"><span><Clock3 /></span><div><h3>Opções para cada momento</h3><p>Proteção para pessoas, patrimônio, mobilidade e negócios.</p></div></li></ul></div></section>

        <section className="trust-strip" aria-labelledby="trust-title">
          <div className="container">
            <h2 id="trust-title" className="sr-only">Informações institucionais da PIETY</h2>
            <ul className="trust-facts">
              <li className="reveal"><strong>Registro SUSEP</strong><span>242162581</span></li>
              <li className="reveal"><strong>CNPJ</strong><span>57.596.795/0001-60</span></li>
              <li className="reveal"><strong>13 modalidades</strong><span>de seguro disponíveis</span></li>
              <li className="reveal"><strong>Atendimento humano</strong><span>pelo WhatsApp</span></li>
            </ul>
          </div>
        </section>

        <section className="faq-section" id="perguntas" aria-labelledby="faq-title">
          <div className="container faq-inner">
            <div className="faq-heading reveal">
              <Eyebrow dark>Perguntas frequentes</Eyebrow>
              <h2 id="faq-title">Dúvidas comuns antes de cotar.</h2>
            </div>
            <div className="faq-list">
              {faqItems.map((item) => (
                <details className="faq-item reveal" key={item.question}>
                  <summary>
                    <span>{item.question}</span>
                    <Plus aria-hidden="true" />
                  </summary>
                  <div className="faq-answer">
                    <p>
                      {item.answer}
                      {item.privacyLink ? (
                        <>
                          {" "}
                          <Link to="/privacidade">Leia a Política de Privacidade</Link>.
                        </>
                      ) : null}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta" aria-labelledby="cta-title"><div className="container final-cta-inner reveal"><div><Eyebrow>Vamos começar?</Eyebrow><h2 id="cta-title">A proteção certa está a poucos cliques.</h2></div><div className="final-actions"><a className="button button-gold" href="#seguros">Escolher meu seguro<ArrowRight /></a><WhatsAppLink placement="final_cta" className="button button-ghost">WhatsApp</WhatsAppLink></div></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-main"><Brand footer /><div className="footer-legal"><strong>PIETY Corretora de Seguros</strong><span>CNPJ 57.596.795/0001-60</span><span>Registro SUSEP: 242162581</span></div><div className="footer-contact"><strong>Brasília / DF</strong><a href="tel:+5561984120001">(61) 98412-0001</a></div><nav aria-label="Links do rodapé"><a href="#seguros">Seguros</a><a href="#como-funciona">Como funciona</a><a href="#por-que-piety">A PIETY</a><Link to="/privacidade">Política de Privacidade</Link><button type="button" className="footer-link-button" onClick={openConsentPanel}>Preferências de cookies</button></nav></div><div className="container footer-bottom"><p>© {new Date().getFullYear()} PIETY Corretora de Seguros. Todos os direitos reservados.</p><p>A contratação está sujeita à análise e às condições das seguradoras.</p></div></footer>
      <WhatsAppLink placement="floating" className="whatsapp-float" ariaLabel="Conversar com a PIETY no WhatsApp"><HeartHandshake aria-hidden="true" /><span>Fale conosco</span></WhatsAppLink>
    </>
  );
}
