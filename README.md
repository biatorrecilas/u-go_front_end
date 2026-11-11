# U-Go Frontend

Aplicação web responsiva do U-Go, construída com React, TypeScript, Vite e Tailwind CSS. O frontend apresenta os fluxos do produto e consome a API Django; regras de autorização e dados persistentes continuam sob responsabilidade do backend.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura](#estrutura)
- [Instalação e execução](#instalação-e-execução)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Integração com a API](#integração-com-a-api)
- [Rotas da aplicação](#rotas-da-aplicação)
- [Padrões de desenvolvimento](#padrões-de-desenvolvimento)
- [Validação e build](#validação-e-build)
- [Publicação](#publicação)
- [Solução de problemas](#solução-de-problemas)

## Funcionalidades

- home com estatísticas reais carregadas do backend;
- cadastro institucional, código de verificação, login, “Lembrar de mim” e recuperação de senha;
- criação de carona avulsa ou recorrente;
- seleção de vagas, veículo, exclusividade e tolerância de desvio;
- busca com filtros, mapa, recomendados e outras opções ativas;
- acompanhamento como motorista ou passageiro;
- aprovação e confirmação em duas etapas;
- contato por WhatsApp liberado somente após o match final;
- notificações em tempo real com fallback por consulta periódica;
- perfil com foto ou avatar U-Go personalizável, capa, selos, certificados de conquista e avaliações por badges;
- termos, privacidade, feedback global de formulários e layout adaptado a celular.

## Tecnologias

- React 18 e React DOM 18
- TypeScript 5.7
- Vite 6
- Tailwind CSS 4
- React Router 7
- Radix UI e Material UI
- Lucide Icons
- Sonner para notificações de interface
- Motion para animações
- `@react-google-maps/api` para mapa e autocomplete

As versões exatas estão no `package.json` e no `package-lock.json`.

## Estrutura

```text
Website/
├── src/
│   ├── app/
│   │   ├── components/       # Blocos da home e componentes de interface
│   │   │   └── ui/           # Componentes básicos reutilizáveis
│   │   ├── pages/            # Páginas carregadas por rota
│   │   ├── App.tsx
│   │   ├── auth.ts           # Cliente da API, sessão e tipos compartilhados
│   │   └── routes.ts         # Definição e lazy loading das rotas
│   ├── styles/               # Tailwind, tokens e estilos globais
│   └── main.tsx              # Entrada da aplicação
├── index.html
├── package.json
├── package-lock.json
└── vite.config.ts
```

## Instalação e execução

### Pré-requisitos

- Node.js 20+
- npm
- backend Django em execução, por padrão em `http://127.0.0.1:8000`

No PowerShell, a partir da raiz do repositório:

```powershell
cd Website
npm ci
npm run dev
```

O Vite normalmente abre a aplicação em `http://127.0.0.1:5173`. `npm ci` reproduz exatamente as versões do lockfile; use `npm install` somente quando for necessário alterar dependências.

## Variáveis de ambiente

Crie `Website/.env.local` apenas quando precisar sobrescrever os padrões locais. Arquivos `.env.local` não devem ser versionados.

```env
VITE_BACKEND_ORIGIN=http://127.0.0.1:8000
VITE_API_BASE_URL=/api
VITE_WS_BASE_URL=
VITE_GOOGLE_MAPS_API_KEY=
```

| Variável | Uso |
| --- | --- |
| `VITE_BACKEND_ORIGIN` | Destino dos proxies `/api` e `/ws` durante `npm run dev`. Padrão: `http://127.0.0.1:8000`. |
| `VITE_API_BASE_URL` | Base usada pelo cliente REST. Padrão: `/api`. Em produção, prefira mesma origem. |
| `VITE_WS_BASE_URL` | Origem explícita do WebSocket. Quando vazia, deriva da origem atual/API. |
| `VITE_GOOGLE_MAPS_API_KEY` | Chave de navegador para mapa, Places/autocomplete e coordenadas. |

Variáveis iniciadas por `VITE_` são incorporadas ao bundle e ficam visíveis no navegador. Nunca coloque segredos, chaves privadas ou credenciais nelas. A chave do Google Maps deve ser restrita por domínio e apenas às APIs necessárias.

## Integração com a API

O cliente central em `src/app/auth.ts`:

- usa `VITE_API_BASE_URL` em todas as chamadas;
- envia cookies de sessão com as requisições;
- obtém e envia o token CSRF nas mutações;
- converte respostas da API em tipos utilizados pelas páginas;
- mantém somente uma cópia auxiliar da sessão no navegador;
- trata erros do backend e os apresenta na interface;
- conecta ao WebSocket de notificações e atualiza a lista pela API.

A sessão local não concede permissão. Toda autorização é revalidada pelo Django.

### Desenvolvimento com proxy

`vite.config.ts` encaminha:

```text
/api/* -> VITE_BACKEND_ORIGIN/api/*
/ws/*  -> VITE_BACKEND_ORIGIN/ws/*
```

Isso mantém frontend e backend sob uma única origem aparente no navegador durante o desenvolvimento e simplifica cookies e CSRF.

### Google Maps e match

Com `VITE_GOOGLE_MAPS_API_KEY`, a busca captura endereços e coordenadas e pode mostrar distância geográfica. Sem a chave, o formulário e o ranking continuam funcionando com endereços por texto, mas mapa, autocomplete e precisão por quilometragem ficam limitados.

O cálculo final de compatibilidade é feito pelo backend. O frontend apenas coleta filtros e apresenta “Recomendadas para você” e “Outras opções disponíveis”.

### Estatísticas da home

A home consome `/api/public/stats/`. Se a API estiver indisponível, a interface exibe um estado de indisponibilidade em vez de inventar usuários, caronas ou impacto ambiental. Não substitua esse fluxo por constantes demonstrativas em produção.

## Rotas da aplicação

| Caminho | Página |
| --- | --- |
| `/` | Home e métricas públicas |
| `/login` | Login, cadastro, verificação e recuperação de senha |
| `/cadastro` | Redireciona para `/login?mode=signup` |
| `/perfil` | Perfil do usuário autenticado e edição |
| `/perfil/:userId` | Perfil público engajado de outro usuário |
| `/criar-carona` | Criação avulsa ou recorrente |
| `/caronas` | Busca, filtros e recomendações |
| `/acompanhar-carona` | Gestão como motorista e acompanhamento como passageiro |
| `/sobre` | Apresentação do projeto |
| `/termos` | Termos de uso |
| `/privacidade` | Política de privacidade |

As páginas são carregadas sob demanda por `lazy import` em `src/app/routes.ts`.

### Perfil e conquistas

O perfil permite alternar entre a foto enviada e um avatar vetorial U-Go. `avatar_config` salva separadamente seis tons de pele; oito cores; estilos liso, ondulado, cacheado, crespo, afro, tranças, locs, coque, raspado ou sem cabelo; comprimento; expressão; barba ou bigode e sua cor; tipo e cor da roupa; e acessórios independentes para cabeça, olhos, orelhas e roupa. O editor oculta controles que não se aplicam, como tamanho para cabelo raspado ou ausente. A normalização mantém compatibilidade com configurações antigas. Trocar para o avatar não exclui a foto armazenada.

O resumo de impacto é um painel único e responsivo. Caronas, CO₂, distância e boas atitudes vêm do objeto `impact` retornado pela API; não há valores demonstrativos no perfil.

O botão **Gerar certificado** aparece somente em conquistas desbloqueadas do próprio usuário. O PNG é produzido localmente pelo navegador com nome, curso, universidade, descrição e data reais da conquista; nenhum dado privado é incluído.

## Padrões de desenvolvimento

### Componentes e páginas

- coloque páginas roteáveis em `src/app/pages`;
- reutilize componentes básicos de `src/app/components/ui`;
- mantenha chamadas REST e tipos compartilhados centralizados no cliente da API;
- preserve os tokens visuais e espaçamentos já usados pela plataforma;
- não replique regras de permissão como única proteção no navegador.

### Formulários

- mostre o erro junto ao campo e também uma notificação global quando a submissão falhar;
- desabilite ações enquanto a requisição estiver em andamento;
- use mensagens vindas da API quando forem seguras e compreensíveis;
- preserve os valores digitados após um erro recuperável;
- valide arquivo, tipo e tamanho antes do upload, sabendo que o backend valida novamente.

### Responsividade e acessibilidade

- desenvolva começando pela largura de celular;
- verifique pelo menos celular estreito, tablet e desktop;
- mantenha alvos de toque confortáveis e ações críticas legíveis;
- associe labels aos campos e preserve navegação por teclado;
- use texto alternativo em imagens informativas;
- não dependa somente de cor para comunicar estado;
- confira diálogos, menus, mapa, cards e tabelas com zoom e textos longos.

### Privacidade

- não renderize telefone, endereço, e-mail ou placa a partir de fontes não autorizadas;
- respeite o campo de liberação de contato retornado pelo backend;
- não grave respostas sensíveis em logs do navegador;
- trate URLs assinadas de imagens como temporárias.

## Validação e build

Antes de entregar mudanças:

```powershell
npm run typecheck
npm run build
```

Scripts disponíveis:

| Comando | Resultado |
| --- | --- |
| `npm run dev` | Servidor Vite com recarga automática e proxy local. |
| `npm run typecheck` | Verificação TypeScript sem gerar arquivos. |
| `npm run build` | Bundle otimizado em `dist/`. |

O projeto ainda não possui um script de testes automatizados do frontend. Mudanças em fluxos críticos devem ser validadas manualmente no navegador, além de typecheck e build. Ao adicionar uma suíte, registre o comando no `package.json` e atualize este documento.

Roteiro manual mínimo:

1. cadastrar e verificar um e-mail institucional;
2. entrar e sair com e sem “Lembrar de mim”;
3. solicitar recuperação de senha;
4. criar carona avulsa e recorrente;
5. pesquisar com e sem resultados recomendados;
6. concluir o fluxo motorista aprova → passageiro confirma;
7. confirmar o bloqueio de contato antes do match;
8. editar/cancelar nos prazos permitidos;
9. iniciar, finalizar e avaliar por badges;
10. editar perfil, enviar avatar/capa e abrir perfil público;
11. testar notificações com WebSocket disponível e indisponível;
12. repetir os fluxos em celular e desktop.

## Publicação

Gere o bundle:

```powershell
npm ci
npm run typecheck
npm run build
```

Publique o conteúdo de `dist/` em um servidor estático ou CDN. Como o app usa `createBrowserRouter`, o servidor deve devolver `index.html` para rotas que não correspondem a arquivos, como `/caronas` ou `/perfil/<id>`.

Configuração recomendada:

- frontend e API sob a mesma origem, com `/api/` e `/ws/` encaminhados ao Django;
- HTTPS em toda a navegação;
- cache longo para assets com hash e sem cache permanente para `index.html`;
- compressão Brotli ou gzip;
- cabeçalhos de segurança compatíveis com Google Maps e o backend;
- monitoramento de erros de JavaScript e falhas de API sem capturar dados pessoais.

Se frontend e API estiverem em origens diferentes, configure CORS, CSRF, cookies, `VITE_API_BASE_URL` e `VITE_WS_BASE_URL` em conjunto. Teste especialmente login, logout, uploads e WebSocket.

## Solução de problemas

### A API retorna erro de conexão

Confirme se o Django está em `127.0.0.1:8000` e se `VITE_BACKEND_ORIGIN` aponta para a origem correta. Reinicie o Vite após mudar `.env.local`.

### Recebo erro CSRF ou não permaneço logado

Não misture `localhost` e `127.0.0.1` durante o mesmo teste. Confira origens CSRF/CORS no backend e use HTTPS com cookies seguros em produção.

### Notificações só atualizam depois de alguns segundos

O fallback periódico continua funcionando quando o WebSocket falha. Verifique o proxy de `/ws`, o servidor ASGI, `REDIS_URL`, a origem do socket e os cookies de sessão.

### O mapa ou autocomplete não aparece

Confira `VITE_GOOGLE_MAPS_API_KEY`, APIs habilitadas, faturamento da conta Google e restrições de domínio. Reinicie o servidor Vite após configurar a chave.

### Uma rota funciona pelo menu, mas dá 404 ao atualizar

Configure o fallback de SPA no servidor para devolver `index.html` em rotas do React Router.

Veja também o [repositório do backend](https://github.com/biatorrecilas/u-go_back_end).
