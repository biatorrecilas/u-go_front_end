import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

const content = {
  terms: {
    eyebrow: "Versão 2026.1",
    title: "Termos de Uso",
    intro: "Ao usar a U-Go, você concorda em informar dados verdadeiros, respeitar as regras de segurança e utilizar a plataforma exclusivamente para organizar caronas universitárias.",
    sections: [
      ["Conta universitária", "O acesso é pessoal e depende da validação do e-mail institucional. Você é responsável por manter sua senha segura e seus dados atualizados."],
      ["Caronas e confirmações", "Uma solicitação só se torna um match após aprovação do motorista e confirmação do passageiro. Contatos são liberados apenas depois dessa confirmação mútua."],
      ["Cancelamentos e conduta", "Edições e cancelamentos devem respeitar a antecedência mínima exibida na plataforma. Assédio, discriminação, fraude ou uso indevido podem levar à suspensão da conta."],
      ["Responsabilidade", "A U-Go facilita conexões entre membros da comunidade universitária, mas não é transportadora. Motoristas e passageiros continuam responsáveis por suas decisões e pelo cumprimento da legislação."],
    ],
  },
  privacy: {
    eyebrow: "Versão 2026.1",
    title: "Política de Privacidade",
    intro: "A U-Go usa somente os dados necessários para validar a comunidade, recomendar caronas e viabilizar matches com segurança.",
    sections: [
      ["Dados coletados", "Cadastro, universidade, curso, gênero de visibilidade, preferências, rotas, solicitações, notificações e badges de avaliação."],
      ["Proteção antes do match", "Nome do motorista, placa e telefone não ficam públicos na busca. O perfil é revelado após a aprovação e o WhatsApp somente após a confirmação do passageiro."],
      ["Exclusividade", "O gênero de visibilidade é usado para impedir que caronas exclusivas apareçam ou sejam solicitadas por perfis incompatíveis."],
      ["Seus direitos", "Você pode solicitar correção ou exclusão dos seus dados e obter informações sobre o tratamento pelo canal de contato disponível no rodapé."],
    ],
  },
} as const;

export function Legal({ type }: { type: keyof typeof content }) {
  const page = content[type];
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white">
      <Header />
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-6">
        <div className="rounded-[2rem] border border-green-100 bg-white p-7 shadow-sm sm:p-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-green-600">{page.eyebrow}</p>
          <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">{page.title}</h1>
          <p className="mt-5 text-base leading-7 text-gray-600">{page.intro}</p>
          <div className="mt-10 space-y-8">
            {page.sections.map(([title, body]) => (
              <section key={title}>
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <p className="mt-2 leading-7 text-gray-600">{body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
