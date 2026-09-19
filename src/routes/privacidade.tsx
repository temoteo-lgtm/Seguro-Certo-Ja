import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { openConsentPanel } from "@/components/CookieConsent";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade | PIETY Corretora de Seguros" },
      {
        name: "description",
        content:
          "Como a PIETY Corretora de Seguros trata dados pessoais em cotações e atendimento, cookies e direitos do titular.",
      },
      { property: "og:title", content: "Política de Privacidade | PIETY Corretora de Seguros" },
      {
        property: "og:description",
        content: "Tratamento de dados, cookies e direitos do titular na PIETY Corretora de Seguros.",
      },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/privacidade") },
      { property: "og:site_name", content: SITE_NAME },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/privacidade") }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="container legal-inner">
        <Link className="legal-back" to="/">
          <ArrowLeft aria-hidden="true" /> Voltar ao site
        </Link>

        <h1>Política de Privacidade</h1>
        <p className="legal-meta">Última atualização: 19/09/2026</p>

        <section>
          <h2>Quem somos</h2>
          <p>
            PIETY Corretora de Seguros Ltda.
            <br />
            CNPJ 57.596.795/0001-60
            <br />
            Registro SUSEP 242162581
            <br />
            Brasília/DF
            <br />
            Contato: (61) 98412-0001
          </p>
        </section>

        <section>
          <h2>Quais dados podemos tratar</h2>
          <p>
            Tratamos apenas os dados necessários para atender ao seu pedido, que podem incluir dados
            de contato (como nome, telefone e e-mail informados por você), dados necessários à
            cotação conforme a modalidade de seguro (por exemplo, informações sobre o veículo, o
            imóvel, a atividade da empresa ou a viagem) e dados técnicos de navegação, como páginas
            acessadas e informações de cookies, quando autorizados por você.
          </p>
        </section>

        <section>
          <h2>Para que utilizamos</h2>
          <p>
            Utilizamos os dados para elaborar cotações, prestar atendimento, esclarecer dúvidas,
            encaminhar propostas às seguradoras, cumprir obrigações legais e regulatórias aplicáveis
            à atividade de corretagem e melhorar a experiência do site.
          </p>
        </section>

        <section>
          <h2>Compartilhamento</h2>
          <p>
            Para viabilizar a cotação e a eventual contratação, os dados podem ser compartilhados
            com seguradoras e com prestadores de serviço que apoiam nossa operação (por exemplo, a
            plataforma de cotação utilizada pela PIETY). O formulário de cotação é processado na
            plataforma de cotação utilizada pela PIETY (Aggilizador). Também podemos compartilhar
            dados quando houver exigência legal, regulatória ou determinação de autoridade
            competente.
          </p>
        </section>

        <section>
          <h2>Base legal</h2>
          <p>
            Em regra, o tratamento se apoia na execução de procedimentos preliminares e na execução
            de contrato a pedido do titular, no cumprimento de obrigação legal ou regulatória e, em
            situações específicas, no legítimo interesse ou no consentimento — este último aplicado,
            por exemplo, a cookies de análise e marketing. A base legal aplicável é avaliada conforme
            o caso concreto.
          </p>
        </section>

        <section>
          <h2>Retenção</h2>
          <p>
            Mantemos os dados pelo período necessário às finalidades descritas e ao cumprimento de
            obrigações legais, regulatórias ou para o exercício regular de direitos. Encerrado esse
            período, os dados são eliminados ou anonimizados.
          </p>
        </section>

        <section>
          <h2>Direitos do titular</h2>
          <p>
            Você pode solicitar confirmação de tratamento, acesso, correção, anonimização, bloqueio,
            eliminação, portabilidade e informações sobre compartilhamento, além de revogar o
            consentimento quando este for a base utilizada. Para exercer seus direitos, fale conosco
            pelo telefone (61) 98412-0001.
          </p>
        </section>

        <section>
          <h2>Cookies e ferramentas de medição</h2>
          <p>
            <strong>Cookies e recursos técnicos necessários.</strong> Para exibir as páginas com
            estabilidade e segurança, a infraestrutura de hospedagem e proteção utilizada pelo site
            pode processar dados técnicos de acesso e de sessão, como endereço IP, identificadores
            de requisição, tipo de dispositivo e navegador e registros de log. Esse processamento é
            necessário ao funcionamento do site e não depende de consentimento.
          </p>
          <p>
            <strong>Ferramentas opcionais de análise e marketing.</strong> Google Analytics 4 e Meta
            Pixel só são carregados se estiverem configurados neste site e somente depois do seu
            consentimento. Enquanto não houver consentimento — ou enquanto essas ferramentas não
            estiverem configuradas — nenhum script delas é carregado e nenhum evento é enviado.
            Quando ativas, elas recebem apenas dados de uso das páginas, sem nome, telefone, e-mail,
            CPF ou CNPJ. Você pode alterar ou revogar a sua escolha a qualquer momento.{" "}
            <button type="button" className="legal-inline-button" onClick={openConsentPanel}>
              Gerenciar preferências de cookies
            </button>
            .
          </p>
        </section>

        <section>
          <h2>Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais razoáveis para proteger os dados pessoais
            contra acessos não autorizados e situações acidentais ou ilícitas. Nenhum sistema,
            contudo, é imune a incidentes, e não é possível garantir segurança absoluta.
          </p>
        </section>

        <section>
          <h2>Atualizações</h2>
          <p>
            Esta política pode ser atualizada para refletir mudanças em nossos processos ou na
            legislação aplicável. A data de atualização acima indica a versão vigente.
          </p>
        </section>
      </div>
    </main>
  );
}
