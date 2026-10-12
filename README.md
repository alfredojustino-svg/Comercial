# Comercial imobiliário

Versão 0.7.0 com Comercial, Contabilidade e Financeiro integrados, baseada no levantamento funcional do ERP de referência. Aplicação local com Node.js 24, SQLite e interface web em português. Sem dependências externas.

O [levantamento de Vendas e Comissões](docs/levantamento-vendas-comissoes.md), atualizado em 11/10/2026, compara os formulários do ERP com esta versão e identifica campos, processos e validações que faltam. A aplicação ainda não reproduz integralmente o Comercial do ERP.

## Integração 0.7.0

Baixas de contratos e comissões pela interface seguem para o Financeiro. Distratos geram devoluções a pagar, com baixa parcial e estorno compartilhados. Origens contabilizadas exigem estorno antes de alterações; uma origem estornada pode ser contabilizada novamente preservando o histórico. A tela Financeiro → Conferência de Integrações mostra classificação pendente, diferenças bancárias e pagamentos antigos sem vínculo. 69 testes aprovados. Veja [o fechamento da integração e os limites](docs/fechamento-integracao.md).

## Ampliação 0.4

Contratos com várias unidades e clientes, abas cadastrais, autorização e emissão; condições e cronograma de parcelas; comissões com vários corretores, autorização, liberação e baixa manual; aditivos com aprovação; distratos com cálculo local de devolução; tabelas de preço e cadastros de apoio; importação com prévia e alteração de datas. A navegação segue os grupos e a comunicação visual observados no Sienge.

Consulte [a cobertura e as diferenças desta versão](docs/cobertura-v0.4.md). Os capítulos 0.2 e 0.3 abaixo são históricos; a implementação nova de Vendas amplia esses fluxos.

## Revisão de integração 0.4.1

O [diagnóstico de integração](docs/diagnostico-integracao.md) registra as conexões entre todas as áreas e as pendências. A revisão unifica as APIs antiga/nova de contratos e comissões, vincula reservas e propostas aos cadastros, permite converter reserva em proposta e corrige estoque, aditivos pendentes e filtros. 33 testes aprovados.

## Campos obrigatórios 0.5.0

[Campos com asterisco](docs/campos-obrigatorios.md) agora bloqueiam o salvamento na tela e na API. A verificação inclui abas fechadas e listas. Unidades e contratos foram conferidos no Sienge; cadastros antigos são preservados. Importações e emissão pela proposta também exigem os complementos obrigatórios. 41 testes aprovados.

## Executar

1. Instale o Node.js 24 ou mais recente e baixe este repositório.
2. Na pasta do projeto, execute `node server.mjs`.
3. Abra http://127.0.0.1:3210 no navegador.

No primeiro início, são criadas vinte unidades e uma reserva fictícias. Os dados persistem em `data/comercial.sqlite`; a pasta `data/` é ignorada pelo Git. Para encerrar, use Ctrl+C. A porta pode ser configurada pela variável de ambiente `PORT`.

## Implementado

- Cadastro de unidades com empreendimento, torre, pavimento, área, preço e estoques comercial, legal e de obra separados.
- Lista e Quadro Espelho por empreendimento, torre e pavimento, com filtros e busca.
- Indicadores de estoque e valor disponível calculados a partir dos preços de referência.
- Reservas com cliente, corretor, origem, validade e observação.
- Bloqueio de reserva duplicada e de unidades com estoque comercial indisponível.
- Validade inclusiva até o fim do dia em America/Sao_Paulo; vencimento reconciliado nas consultas e operações.
- Cancelamento com manutenção de histórico e liberação da unidade.
- Persistência SQLite, registro de eventos e API JSON para futura integração.

## Testes

Execute `node --test tests/*.test.mjs`. Os testes verificam exclusividade, cancelamento, vencimento, validação, persistência e respostas da API.

## Pró-Vendas e Vendas — versão 0.2

- Clientes com nome, e-mail, telefone e origem de captação.
- Atendimentos vinculados ao cliente, agenda por data, responsável e estados pendente, em andamento, realizado e cancelado.
- Propostas com cliente, unidade, corretor, preço, validade e observação. Uma proposta aberta bloqueia reservas e outras propostas da mesma unidade.
- Aprovações sequenciais: construção → comercial → crédito → aprovada. Reprovação exige motivo; vencimento libera a unidade. Este fluxo é uma regra inicial do novo programa, ainda não validada como reprodução integral do ERP.
- Emissão de contrato apenas a partir de proposta aprovada e vigente. A unidade passa a vendida.
- Parcelamento mensal de 1 a 120 parcelas, sem juros. A soma fecha em centavos e vencimentos no dia 31 se ajustam ao último dia do mês.
- Comissão percentual com autorização, liberação e registro de pagamento fictício. Não realiza transferência bancária.
- Distrato com motivo, cancelamento de parcelas e comissões e liberação da unidade. Havendo comissão paga, o distrato é bloqueado e exige tratamento financeiro externo.
- Histórico de transições; alterações sobre contrato e estoque são transacionais.

Para experimentar o fluxo: cadastre um cliente, crie uma proposta para unidade disponível, envie ao comercial, aprove o comercial e o crédito, emita contrato e consulte suas parcelas. Se existir uma reserva, cancele-a antes de criar a proposta nesta versão.

Rotas adicionais: `GET/POST /api/clients`, `GET/POST /api/activities`, `GET/POST /api/proposals`, `POST /api/activities/:id/state`, `POST /api/proposals/:id/state`, `POST /api/proposals/:id/issue`, `GET /api/contracts`, `GET /api/contracts/:id/details`, `POST /api/contracts/:id/terminate`, `GET /api/commissions`, `POST /api/commissions/:id/state`.

As tabelas novas são criadas automaticamente ao abrir um banco da versão 0.1, preservando unidades e reservas existentes.

## Comunicação visual e módulos — versão 0.3

Interface baseada na organização visual das telas observadas do Sienge: barra superior branca, faixa escura de módulos, menu branco agrupado, indicação vermelha do item selecionado, ações azuis, filtros compactos, situações em botões e tabelas de consulta. O nome e a marca da aplicação continuam próprios.

- Pró-Vendas: clientes com edição, interesses com orçamento e situação, atendimentos, agenda por data, corretores/imobiliárias, campanhas com canal de captação e oportunidades derivadas de interesses em negociação.
- Vendas: consulta e emissão de contrato a partir de proposta aprovada, parcelas e histórico, distratos.
- Comissões: cadastro manual em contrato sem comissão, percentual, parcelamento mensal, análise e mudança de situação por parcela. Comissão automática de contrato também ganha parcelas. O status geral reflete as parcelas pendentes. Se as parcelas estiverem em situações diferentes, a atualização em lote é bloqueada.
- Pagamento de qualquer parcela de comissão bloqueia o distrato, mesmo quando outras parcelas ainda não foram autorizadas.
- Consulta, filtros por situação, escolha de colunas, densidade da tabela e exportação CSV dos dados visíveis.
- Ao iniciar com dados de demonstração e sem clientes, o programa inclui cliente, corretor, campanha, interesse, atendimento, proposta e contrato fictícios.

As campanhas e oportunidades são funcionalidades iniciais próprias; ainda não reproduzem todas as regras do ERP. Não foram implementados múltiplos beneficiários por contrato, aditivos, índices, juros, liquidação de parcelas da venda, integração bancária nem perfis de aprovação.

Novas rotas: `GET/POST /api/brokers`, `GET/POST /api/interests`, `POST /api/interests/:id/state`, `GET/POST /api/campaigns`, `POST /api/campaigns/:id/state`, `POST /api/clients/:id/edit`, `POST /api/commissions`, `GET /api/commissions/:id/details`, `POST /api/commission-installments/:id/state`.

## API inicial

| Método | Rota | Comportamento |
| --- | --- | --- |
| GET | `/api/units` | Lista unidades e situação atual |
| POST | `/api/units` | Cadastra unidade |
| GET | `/api/reservations` | Lista reservas e histórico |
| POST | `/api/reservations` | Reserva uma unidade disponível |
| POST | `/api/reservations/:id/cancel` | Cancela reserva ativa |

Exemplo de unidade: `{"project":"Exemplo","name":"A-101","tower":"A","floor":1,"area":68.5,"price":350000,"commercial":"Disponível","legal":"Livre","construction":"Projeto"}`.

Exemplo de reserva: `{"unitId":"ID da unidade","client":"Cliente fictício","broker":"Corretor fictício","origin":"Vendas","expires":"2026-12-31","note":""}`.

## Limites desta versão

Uso local para testes: o servidor escuta apenas em 127.0.0.1 e ainda não possui autenticação, perfis de acesso ou suporte de produção para múltiplos usuários. Clientes de propostas e atendimentos usam vínculo cadastral; corretores e clientes das reservas antigas ainda são textos. Contratos geram parcelas mensais sem juros ou correção. Aprovações não possuem separação de perfis nesta demonstração.

Ainda pendentes: edição de unidades e clientes, posição histórica do Quadro Espelho, campos completos de registro e áreas, interesses, campanhas completas, juros e correção monetária, aditivos, perfis de aprovação e integração financeira. Não há conexão automática com o ERP. As opções de estoque são um subconjunto inicial do levantamento.

## Integração futura

A camada de regras (`domain.mjs`) é separada da API (`server.mjs`) e da interface (`public/`). A integração com o projeto do escritório deverá definir identidade compartilhada, códigos de empresas e empreendimentos, clientes, corretores e contrato de comunicação com o financeiro. Alterar tecnologia deve preservar essas regras e seus testes.

Use dados fictícios nos testes. Não publique banco de dados, credenciais ou dados reais no repositório.

## Contabilidade — versão 0.5.0

Plano de contas, lotes por empresa/período, lançamentos com partidas, contabilização, estorno, Diário, Razão e Balancete. Integração explícita com contratos emitidos e baixas de comissões, com escolha de contas e prevenção de duplicidade. Campos obrigatórios são validados na tela e API; lotes fechados bloqueiam escrita. Escopo implementado e recursos restantes em [docs/contabilidade.md](docs/contabilidade.md).

## Financeiro — versão 0.6.0

Módulo separado no menu: Contas a Receber, Contas a Pagar, Caixa e Bancos, Credores, Baixas e Estornos, Transferências, Extrato, Fluxo de Caixa e Inadimplência. Parcelas de contratos/comissões usam os mesmos registros do Comercial; operações financeiras são origens para classificação explícita na Contabilidade. Baixas, estornos e transferências são transacionais e têm prevenção de duplicidade. São registros locais, sem conexão bancária ou ERP. Escopo e limitações em [docs/financeiro.md](docs/financeiro.md).
