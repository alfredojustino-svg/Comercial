# Comercial

Módulo comercial imobiliário em desenvolvimento, baseado no levantamento das telas e dos fluxos de Gestão de Unidades, Pró-Vendas e Vendas do ERP de referência. Este repositório contém o escopo inicial; ainda não contém uma aplicação executável.

## Objetivo

Desenvolver um módulo separado, preparado para integração com o sistema existente. A tecnologia, autenticação, banco de dados e contratos de integração serão definidos após inspecionar o projeto principal.

## Levantamento funcional

### Gestão de Unidades

- Cadastro vinculado a empreendimento, com identificação, áreas, fração ideal, localização, registro, endereço, valores e datas de entrega.
- Controles separados de estoque comercial, legal e de obra.
- Consulta por empresa, empreendimento, unidade, tipo de imóvel, localização e previsão de entrega.
- Quadro Espelho com grade, lista, filtros e posição histórica.
- Reservas vinculadas à unidade, cliente e corretor, com origem, data, validade e observação.
- Parâmetros de reserva observados: obrigatoriedade de cliente, prazo, bloqueio de alteração da validade e consideração de dias úteis. Valores e comportamento efetivo ainda precisam ser validados.

### Pró-Vendas

- Consultas de clientes, interesses e atendimentos.
- Menus de agenda, colaboradores, captação, campanhas e oportunidades identificados; detalhes ainda precisam ser levantados.
- Atendimentos: pendente, em andamento, realizado e cancelado.
- Propostas vinculadas a empreendimento, unidade, cliente, corretor e imobiliária.
- Situações de proposta observadas: em construção, em aprovação comercial, reprovada pelo comercial, em aprovação de crédito, aprovada, reprovada pelo crédito, contrato e vencida.
- A abertura de novos clientes e propostas exige vínculo do usuário com um colaborador no ERP; os formulários completos não foram acessados no levantamento inicial.

### Vendas

- Cadastro de contrato: empresa, empreendimento, unidade e cliente principais, datas, valores, plano financeiro e corretor.
- Correção mensal ou anual; indexadores pré e pós-chaves; opções de juros Price, SAC, simples, composto, fixo e anual.
- Campos de financiamento, entrega de chaves, registro do imóvel, observação e cláusula especial.
- Situações de consulta: aguardando autorização, aguardando emissão, emitido e distratado.
- Menus de aditivos, distratos, importação e alterações de contratos identificados; regras detalhadas pendentes.
- Comissões com parcelas e situações: aguardando autorização, aguardando liberação, liberadas, pagas e canceladas.
- Tabela de preços: associação de unidades por corretor, associação de corretor por unidade e emissão identificadas no menu.

## Fluxo proposto para validação

Cliente → Atendimento/Interesse → Proposta → Reserva → Contrato → Comissões.

Essa sequência é uma proposta de organização do novo módulo. A ordem obrigatória, transições e efeitos sobre disponibilidade e financeiro devem ser validados antes da implementação.

## Próximos passos

1. Inspecionar o código do sistema principal e suas instruções de desenvolvimento.
2. Definir interfaces de integração para empresas, empreendimentos, clientes, usuários e financeiro.
3. Validar regras de disponibilidade, concorrência de reservas, aprovação, parcelamento, comissões e distratos.
4. Implementar em etapas: unidades e reservas; clientes e atendimentos; propostas; contratos e comissões.
5. Validar cálculos e transições com dados fictícios e apresentar alterações por pull request.

## Dados

O levantamento registra funcionalidades, sem dados reais de clientes, contratos ou credenciais. Dados de demonstração devem ser fictícios.
