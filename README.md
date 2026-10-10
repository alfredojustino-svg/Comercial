# Comercial imobiliário

Primeira versão independente de Gestão de Unidades, baseada no levantamento funcional do ERP de referência. Aplicação local com Node.js 24, SQLite e interface web em português. Sem dependências externas.

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

Uso local para testes: o servidor escuta apenas em 127.0.0.1 e ainda não possui autenticação, perfis de acesso ou suporte de produção para múltiplos usuários. Clientes e corretores são textos nesta etapa; os vínculos cadastrais serão implementados no Pró-Vendas. Valores são preços de referência, sem cálculo de juros ou parcelas.

Ainda pendentes: edição de unidades, posição histórica do Quadro Espelho, campos completos de registro e áreas, agenda, clientes, interesses, propostas e aprovações, contratos, distratos, comissões e integração financeira. Não há conexão automática com o ERP. As opções de estoque são um subconjunto inicial do levantamento.

## Integração futura

A camada de regras (`domain.mjs`) é separada da API (`server.mjs`) e da interface (`public/`). A integração com o projeto do escritório deverá definir identidade compartilhada, códigos de empresas e empreendimentos, clientes, corretores e contrato de comunicação com o financeiro. Alterar tecnologia deve preservar essas regras e seus testes.

Use dados fictícios nos testes. Não publique banco de dados, credenciais ou dados reais no repositório.
