# Diagnóstico de integração do Comercial

A revisão encontrou conexões parciais e divergências entre o fluxo antigo de propostas e as novas telas de Vendas. A versão 0.4.1 corrige as divergências do fluxo principal. O sistema inteiro ainda não está totalmente interligado.

Data: 11/10/2026. Escopo: todos os arquivos de domínio, servidor, interface e testes do Comercial deste repositório. O programa do escritório e as integrações externas não fazem parte desta base e não foram validados.

## Fluxo principal

Cliente e corretor cadastrados → reserva vinculada → proposta → aprovação → contrato → parcelas e comissões. Aditivo altera contrato e estoque; distrato encerra contrato, cancela comissões pendentes e libera unidades. Consultas e relatórios leem esses registros.

## Mapa das conexões

| Área | Conexão atual | Situação |
|---|---|---|
| Gestão de unidades e Quadro Espelho | Mesmo estoque, com reservas, propostas e contratos | Integrada no fluxo principal |
| Reservas | Unidade, cliente e corretor por identificador; conversão atômica em proposta | Integrada para novos cadastros. Reservas antigas em texto livre precisam ser canceladas/recriadas para conversão |
| Clientes e dados complementares | Cliente comum em atendimentos, interesses, propostas e contratos; perfil retornado junto ao cadastro | Integrada em dados; nem todas as consultas mostram todos os complementos |
| Atendimentos e Agenda | Mesmas atividades vinculadas ao cliente | Parcial: responsável continua como texto; sem ligação obrigatória com corretor/equipe |
| Interesses e Oportunidades | Oportunidades são os interesses em negociação, vinculados ao cliente e empreendimento | Parcial: marcar Convertido não cria nem vincula proposta |
| Colaboradores e Equipes | Corretores comuns a propostas, contratos, comissões e membros de equipes | Parcial: equipes não determinam responsáveis, permissões ou aprovações |
| Campanhas e Local de Captação | Cadastros próprios; origem do cliente e canal da campanha são textos | Pendente: vínculos por identificador e análise de origem/conversão |
| Propostas | Cliente, unidade, corretor e reserva de origem; contrato preserva a proposta | Integrada no fluxo inicial de aprovação, ainda sem equivalência integral com o ERP |
| Contratos | Cadastro direto ou originado em proposta; clientes, unidades e corretores comuns | Integrada: APIs antiga e nova consultam a mesma situação, parcelas e baixas |
| Comissões e análises | Contrato comum, corretores por identificador, operações por parcela e recebimentos para liberação automática | Integrada localmente; não gera pagamentos bancários nem apropriação em outro sistema |
| Aditivos | Versão do contrato, condições e unidades; aprovação atualiza estoque | Integrada para contratos sem baixas; distrato encerra solicitações pendentes |
| Distratos e configuração | Recebimentos, deduções do contrato, piso configurado, parcelas de devolução, estoque e comissões | Integrada nas regras locais suportadas; sem correção ou estorno de comissão paga |
| Associação de corretores e unidades | Filtro de unidades na emissão de tabela de preços | Parcial: não restringe nem preenche automaticamente corretor em proposta/contrato |
| Tabelas de preço e emissão | Empreendimento, unidades, preços de referência, versões e condições | Parcial: não alimentam automaticamente o preço e as condições da proposta/contrato |
| Tipos de condição | Opções do formulário de condições | Parcial: limites e periodicidade do cadastro não são automaticamente aplicados ao contrato |
| Planos, departamentos e obras | Identificadores de planos no contrato e apropriações da comissão validados | Parcial: vínculos locais; sem lançamento contábil, orçamento ou financeiro externo |
| Indexadores, encargos, seguros e descontos | Campos armazenados | Pendente: aplicação nos cálculos e comparação com fórmulas do ERP |
| Tipos de dedução | Cadastro separado; distrato usa deduções contratuais ou inseridas explicitamente | Parcial: falta seleção assistida do catálogo e regras avançadas |
| Modelos de documento e anexos | Modelos textuais aplicados na impressão; anexos textuais no contrato | Parcial: sem documentos binários e sem validação dos modelos jurídicos |
| Relatórios | Contratos, parcelas, recebimentos, comissões, estoque, reservas e clientes comuns | Parcial: filtros de empreendimento/corretor corrigidos; vários modelos ainda compartilham consultas genéricas |
| Importação e alteração de datas | Mesmos contratos, validações e bloqueios de estoque; gravação atômica | Integrada no formato próprio; datas de contratos distratados bloqueadas |
| Sistema do escritório | Sem código ou API disponível neste repositório | Não integrado |

## Correções aplicadas

- APIs históricas de contratos e comissões passaram a consultar e operar sobre os registros de Vendas. Emitir pela proposta também registra os vínculos novos na mesma transação.
- Contratos originados em propostas preservam corretor e origem. Corretores com nomes iguais conservam seus identificadores.
- Distrato atualiza o contrato histórico que sustentava a exclusividade da unidade, permitindo nova venda. Aditivo atualiza a unidade principal nessa representação.
- Distrato encerra aditivos pendentes. Renomear contrato distratado não recria bloqueio de estoque; alteração de datas não recria parcelas canceladas.
- Reservas e propostas novas selecionam clientes/corretores existentes. Conversão exige o mesmo cliente e corretor da reserva e mantém o vínculo da origem.
- Perfis complementares têm unicidade por cliente/unidade; equipes e apropriações rejeitam referências inexistentes.
- Relatórios de estoque e reservas respeitam empreendimento; filtro de corretor afeta contratos e totais. Ranking distribui o VGV igualmente entre os corretores cadastrados no contrato, em centavos, sem duplicar o valor total. Essa distribuição é regra local e precisa de validação com o ERP; número de unidades representa participações em vendas.
- Formulário de distrato usa as deduções do contrato e a configuração de piso; cadastros globais de tipos de dedução não são descontados automaticamente.
- O botão Nova reserva abre o formulário de reserva, com seleção de unidade, cliente e corretor.

## Evidências e limites

33 testes automatizados aprovados, incluindo dez testes de integração: conversão de reserva; consultas entre APIs; baixa e distrato; bloqueio de comissão paga; aditivo e nova venda; encerramento de aditivo; vínculos inválidos; filtros e VGV; persistência após reabrir; corretores homônimos; configuração e liberação automática.

No navegador, uma reserva fictícia da A-201 foi salva e convertida em proposta; a reserva aparece como Convertida e a proposta mantém o cliente/corretor selecionados. A revisão da base de demonstração encontrou 20 unidades, 1 cliente, 3 propostas, 2 contratos, 1 comissão e 3 reservas; nenhuma inconsistência nos vínculos de clientes/unidades dos contratos, bloqueios de estoque, vínculo da comissão ou situação de aditivos pendentes examinados. Esse resultado se refere a essa amostra, não prova ausência de todos os defeitos.

## Próximas integrações por prioridade

1. Vincular interesses, campanhas, captação e responsável da agenda por identificador, com conversão rastreável em proposta.
2. Aplicar tabela de preço e tipo de condição à negociação, com validação de vigência e regras aprovadas.
3. Validar e implementar correção, encargos, seguros, descontos e eventos financeiros.
4. Concluir filtros e modelos específicos dos relatórios, permissões e auditoria por usuário.
5. Definir a interface e testar a unificação com o programa do escritório.
