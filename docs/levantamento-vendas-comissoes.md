# Levantamento de Vendas e Comissões

Referência funcional para completar o Comercial. Consulta em 11/10/2026, no ERP Sienge versão 9.0.5-15. A versão 0.3 do programa cobre apenas parte dos processos observados. O inventário abaixo separa formulários conferidos, funcionalidades identificadas no menu e regras que ainda precisam de validação.

O levantamento é somente de leitura. Nenhum contrato, aditivo, distrato, comissão ou configuração foi salvo. Não foi realizada migração. Foram omitidos clientes, documentos pessoais, valores de negócios, números de contratos e demais dados reais. Rotas são referências de navegação da interface, não APIs de integração.

## Cobertura e lacunas

| Área | Verificado no ERP | Situação do programa v0.3 |
| --- | --- | --- |
| Contratos | Cadastro e todas as seções de um contrato existente | Cadastro simplificado vinculado a proposta, um cliente e uma unidade |
| Condições de pagamento | Várias condições, periodicidade, correção e juros | Uma série mensal de até 120 parcelas sem juros |
| Clientes do contrato | Participação, seguro, principal e cônjuge | Um cliente por contrato |
| Unidades do contrato | Participação, principal e bloqueios para alteração | Uma unidade por contrato |
| Planos financeiros | Rateio por centro de custo e plano financeiro | Ausente |
| Corretores e avalistas | Listas próprias; cadastro de avalista e cônjuge | Corretor básico; avalista ausente |
| Encargos | Mora, pró-rata, multa, seguro, taxa administrativa e desconto | Ausente |
| Aditivos | Condições e unidades, aprovação e observação | Ausente |
| Distratos | Cancelamento, título de devolução e configuração de deduções | Cancelamento simplificado sem devolução financeira |
| Alterações e importação | Datas em lote, vínculo financeiro e dois arquivos de importação | Ausente |
| Novo Comissões | Vários corretores, base individual, indexador, apropriações e liberação automática | Uma comissão por contrato; parcelamento e estados básicos |
| Análise de Comissões | Por contrato e por corretor | Lista básica sem equivalência das análises |
| Comissões antigo | Registro e controle com previsões, autorização, cancelamento, liberação e reversão | Não reproduzido como fluxo legado |
| Tabelas de preço | Versões, vigência, condições, associação a corretores e emissão | Apenas preço de referência da unidade |
| Relatórios | Formulários dos 16 itens de Vendas, relatório configurável e dois de Comissões | CSV de listagens; sem equivalência com os relatórios do ERP |
| Comunicação visual | Menu por módulo, filtros, estados, abas, grades e ações | Base visual aproximada; faltam seções e controles completos |

Não existe porcentagem confiável de equivalência: quantidade de telas não mede cobertura das regras e integrações financeiras.

## Contratos

Entrada: `#/comercial/vendas/contratos`. Novo cadastro também foi observado em `#/common/page/649`.

Consulta por empresa, empreendimento, contrato, unidade, código do contrato, cliente e período da data do contrato. Filtros adicionais: períodos de distrato e emissão, ID externo, somente contratos sem comissão e somente vinculados ao crédito associativo. Situações: Aguardando autorização, Aguardando emissão, Emitido e Distratado, além de Todos. A grade oferece colunas, filtros, densidade, visões salvas, relatório e paginação. Há uma ação Análise IA anunciada como funcionalidade em evolução; seu processamento não foi acionado.

### Cadastro

Campos observados: código interno; identificador externo no registro existente; empresa; empreendimento; número do contrato; título no registro emitido; unidade principal; cliente principal; data do contrato; previsão de entrega; data de emissão no sistema; data contábil; valor total; preço total da venda; plano financeiro; tipo de correção Anual ou Mensal e detalhe; corretor vinculado ao cadastro de credores; observação; cláusula especial; categoria de venda; status do financiamento; entrega das chaves; data de registro do imóvel.

Contrato com instituição financeira: número, data e indicação de vínculo com Crédito Associativo. Índices pré e pós entrega de chaves: indexadores e juros pós-chaves Nenhum, Price, S.A.C., Simples, Composto, Fixo ou Anual, com percentual mensal.

No registro emitido existe Salvar e Exclusão de emissão, esta desabilitada no exemplo consultado. As condições de autorização, emissão e exclusão em outros estados não foram exercitadas.

### Condições de Pagamento

Grade com tipo de condição, valor total, valor com juros, quantidade de parcelas, primeiro vencimento, indexador, data-base do indexador, data-base de juros, tipo de juros, carência e percentual ao período. O resumo distingue total das condições, total com juros, recursos próprios, pro-soluto e financiamento.

O cadastro de condições do Aditivo permitiu conferir também portador e a opção de vencimentos coincidirem com outras parcelas. Não assumir que todos os campos e regras do Aditivo sejam idênticos aos de uma condição de contrato nova: o contrato consultado tinha alterações bloqueadas.

### Planos Financeiros

Apropriação de receitas por centro de custo. Grade: centro de custo, plano financeiro, valor, percentual e principal. Não foi calculado ou alterado um rateio.

### Clientes do Contrato

Grade: código, nome, percentual de seguro, percentual de participação e principal. Ações Adicionar Cônjuge e Adicionar. O cadastro comporta mais de um participante, inclusive cônjuge.

### Unidades

Grade: unidade, tipo de imóvel, principal e percentual de participação. A tela informa que contratos com baixa, aditivo vinculado, contabilização ou reconhecimento no POC devem alterar unidades por Aditivo. Essa é uma regra exibida pela interface; cada cenário ainda precisa de testes próprios.

### Corretores e Avalistas

Corretores: código, corretor e principal, com adição e salvamento. A relação do corretor principal com a geração automática de comissão ainda precisa ser validada.

Avalistas: código, nome e CPF/CNPJ na lista. Formulário: CPF, CNPJ, RG, nascimento, nome, profissão, estado civil, nacionalidade, e-mail e endereço com município. Cônjuge: CPF, RG, nascimento, nome, e-mail e endereço, com opção de usar o mesmo endereço do avalista. Telefones: tipo, DDD, número, ramal, observação e principal. Não foram preenchidos dados pessoais.

### Acréscimos e Seguros

Mora mensal ou diária; indexador para pró-rata; taxa de juros; juros simples ou compostos; multa; opção de calcular multa sobre valor corrigido acrescido de juros. Seguro: cobrar, data de início, sobre saldo devedor ou valor fixo e valor. Taxa administrativa: cobrar e valor.

### Descontos

Tipo Mensal, Diário, Fixo ou Anual e percentual. A fórmula, base e momento de aplicação ainda precisam de exemplos de cálculo.

### Rescisão Contratual

Percentual mínimo de devolução e grade de deduções com código, descrição, tipo, intervalo de parcelas e valor. Esta seção parametriza deduções do contrato; não equivale à execução do Distrato.

### Anexos e Alteração de Código

Anexos: descrição e arquivo, com adição. Alteração de Código: número atual e novo número. Não foram enviados arquivos nem alterados identificadores.

### Regra confirmada na interface

O contrato consultado apresentava aviso de baixas e/ou reparcelamentos e orientava usar Aditivos para alterações. Não generalizar os bloqueios de um único contrato a todos os registros: permissões, estados e integrações podem alterar os controles disponíveis.

## Aditivos

Entrada: `#/comercial/vendas/aditivos`. Consulta por empresa, empreendimento, unidade, contrato, cliente, observação e período. Situações Todos, Aguardando Aprovação, Aprovado e Reprovado.

Novo Aditivo: contrato, cliente, centro de custo, data e observação; abas Condições e Unidades. Contrato selecionado preencheu cliente e centro de custo.

Condições: total original do contrato e total atual do aditivo; tipo de condição, valor total, total com juros, número de parcelas, primeiro vencimento, status e ações editar/remover. Há consultas Condições com baixa e Condições do contrato. Nova condição apresenta tipo, valor total, número de parcelas, primeiro vencimento, portador, coincidência de vencimentos, indexador, data-base do indexador, tipo e data-base de juros, percentual e carência.

Unidades: comparação entre unidades do contrato e do aditivo, com unidade, participação e principal. A interface bloqueia Salvar enquanto nenhuma informação do contrato tiver sido alterada. Não foram confirmadas alterações, aprovações ou reprovações.

## Distratos e devoluções

Entrada `#/common/page/780`. Consulta por empresa, empreendimento, contrato, unidade, cliente e período do distrato; filtros adicionais; Todos, Ativos e Distratados. Editar abre Cancelamento de Contratos.

Cancelamento: empresa, empreendimento e contrato; data do cancelamento; motivo obrigatório; título de devolução e opção Gerar título de devolução. Apresenta cliente e unidade principais, data e total do contrato. O formulário de geração do título não foi acionado e a integração com Contas a Pagar permanece pendente.

Configuração `#/common/page/3946`: percentual mínimo de devolução; reajuste das parcelas Sim/Não; primeiro vencimento 30, 60, 90 ou 120 dias após o distrato; base para descontar a dedução total sobre recebido sem correção, recebido com correção ou recebido com correção e acréscimos. Grade de deduções: código, descrição, tipo, intervalo de parcelas e valor.

Tipos de Dedução `#/common/page/3950`: código, descrição e tipo. Tipos disponíveis: Fixo - Valor do ato; percentual do valor do contrato; percentual do valor pago; Fixo; percentual de fruição; intervalo de parcelas. Valores de configuração da empresa não foram copiados.

A devolução não pode ser implementada apenas como liberação da unidade. São necessárias simulação, memória de cálculo, parcelas de devolução, referências financeiras e histórico. A fórmula de fruição, prioridades de deduções, limites e reversão de distrato ainda precisam ser validados.

## Importação e alterações em lote

Importação `#/common/page/7600`: arquivos separados de contratos e condições de pagamento; plano financeiro; gerar resíduo e diluir resíduo; mapeamento do conteúdo das colunas para cada arquivo, com opção Tornar Padrão. A tela informa que a primeira linha da planilha é ignorada. Formatos aceitos, lista de colunas do mapeamento, tratamento de erros e atomicidade ainda não foram validados.

Alteração de Datas `#/common/page/8390`: empresa e empreendimento; período do contrato; condições de pagamento e período de vencimento. Resultado: seleção, contrato, cliente, CPF/CNPJ, data do contrato, condição e primeiro vencimento. Novas datas para contrato e primeiro vencimento. A ajuda na tela informa que alterar a data do contrato atualiza também sua data contábil.

Alteração de Contratos `#/common/page/8670`: empresa, empreendimento, período do contrato, período com instituição financeira, repasse Sim/Não e seleção de contratos com vínculo de crédito associativo, sem vínculo ou não enviados à certificadora. Resultado inclui contrato, unidade, cliente, título e informações do contrato financeiro. Permite nova data do contrato com instituição financeira. Não houve salvamento em lote.

## Novo Comissões

Cadastro `#/comercial/comissoes`; análise `#/comercial/comissoes/analise-de-comissoes`.

Há aviso de migração do Registro e Controle de Comissões antigos. A migração foi mantida sem execução. O guia oficial vinculado pela tela ficou indisponível nesta consulta, portanto não foi usado para inferir regras.

### Consulta e lista de parcelas

Filtros: empresa, empreendimento, contrato, unidades, corretor, cliente e período. Estados: Aguardando autorização, Aguardando liberação, Liberadas, Pagas e Canceladas, além de Todos os status.

Colunas disponíveis: status da parcela; status do cliente; comissão; empresa; empreendimento; unidade; cliente; contrato; título do contrato; corretor; título da comissão; credor de faturamento; valor; parcela; percentual pago do contrato; vencimento; liberação automática; liberação para pagamento; ações. Grade com filtros, busca, densidade, visões salvas, relatório e paginação.

O percentual pago do contrato e o status do cliente são indicadores próprios: não substituí-los pelo estado da comissão. A consulta realizada permaneceu vazia, sem permitir examinar ações de registros existentes.

### Nova comissão e múltiplos corretores

Cabeçalho: empreendimento, cliente principal, contrato e valor do contrato. Opção Liberar automaticamente. Lista de corretores: nome, percentual, valor da comissão, número de parcelas e primeiro vencimento.

Adicionar corretor abre formulário com corretor, valor-base do contrato, valor da comissão, percentual, número de parcelas, indexador para correção, data-base e primeiro vencimento. Apropriações: departamento, obra, unidade construtiva e item de orçamento. Os dois últimos ficaram desabilitados no contexto inicial. Prévia: número da parcela, vencimento e valor, com soma. A adição ao formulário e o cadastro final não foram confirmados.

Diferença estrutural: o programa atual impõe uma comissão por contrato e vincula o cálculo ao valor integral do contrato. Precisa suportar contrato → comissões/corretores → parcelas, com base individual, valor informado ou percentual, indexador, apropriações e liberação automática. Não basta acrescentar campos na interface sem alterar o banco e as regras.

### Análise

Por contrato: empresa, empreendimento, contrato, cliente, datas e Considerar somente contratos sem comissão. Por corretor acrescenta corretor e tipo de comissão. Ambas têm grade e relatório. Detalhes das linhas, totais completos e opções do tipo de comissão não foram validados com um resultado preenchido.

### Pendências do novo fluxo

Confirmar: autorização e sua reversão; liberação e sua reversão; cancelamento e reativação; edição após geração; pagamentos parciais; credor de faturamento; títulos de Contas a Pagar; efeitos de inadimplência e distrato; critérios e momento da liberação automática; permissões por usuário; arredondamento e correção monetária. Os nomes de estados estão confirmados, mas não demonstram por si só as transições permitidas.

## Comissões antigo

O ERP identifica o primeiro menu Comissões como novo e informa que Registro e Controle antigos serão descontinuados. O legado deve orientar importação e continuidade de histórico; a decisão de reproduzir sua operação separada ainda não está fechada.

| Tela | Rota | Campos e controles conferidos |
| --- | --- | --- |
| Registro de Comissão | `#/common/page/798` | Empresa, empreendimento e corretor na consulta; contrato, corretor, base, percentual e valor no cadastro; lista indica Pago |
| Configuração | `#/common/page/8014` | Indexador padrão; base livre ou valor do contrato; data-base atual ou do contrato; número de parcelas |
| Previsão por Contratos | `#/common/page/8013` | Empresa, empreendimento, contrato, cliente, emissão e somente contratos sem previsão; número e total de previsões |
| Previsão de Comissões | `#/common/page/918` | Contrato, corretor, base, percentual/valor, indexador, parcelas, primeiro vencimento, data-base e tipo Venda/Gerenciamento |
| Cancelamento de Previsões | `#/common/page/8072` | Situação aberta/cancelada, autorização, atraso, cancelamento do contrato e tipo; seleção por parcela e Salvar |
| Autorização de Previsões | `#/common/page/8063` | Situação aberta/liberada/cancelada, autorização, atraso, contrato cancelado e tipo; autorização individual na grade |
| Liberação de Comissões | `#/common/page/913` | Empresa, empreendimento, corretor, contrato, tipo, atraso, contrato cancelado e vencimento; seleção de parcelas |
| Exclusão de Liberação | `#/common/page/1438` | Empresa, empreendimento, corretor e vencimento; seleção por título/parcela e Excluir |
| Relatório de Registro | `#/common/page/728` | Empresa, empreendimento, vencimento, corretor, contrato e unidade |
| Relatório de Controle | `#/common/page/1030` | Empresa, empreendimento, corretor, cliente e vencimento; por empreendimento ou equipe Pró-Vendas; estados autorizada, pendente, cancelada, liberada paga/não paga |

As grades de controle incluem título, parcela/total, vencimento, situação, corretor, contrato, dias em atraso e valor, conforme a tela. As consultas sem parâmetros permaneceram vazias. Não foram acionados Salvar ou Excluir.

## Tabelas de preço e dependências

Associação de Unidades por Corretor `#/common/page/895`: empreendimento e corretor, lista de unidade/tipo de imóvel. Associação de Corretor por Unidade `#/common/page/1024`: empreendimento e unidade, lista de corretores.

Emissão `#/common/page/947`: empreendimento, tabela, versão, mês e corretor. Correção: sem correção, indexador da unidade na data vigente ou desde a data-base das condições até o mês da tabela. Relatório Simplificado, Detalhado ou Tipo de Imóvel. Opções de quantidade indexada, juros Price e seleção dos estoques comercial, legal e de obra.

Cadastro em Apoio `#/common/page/2521`: consulta por empreendimento e tabela; código, versão, vigência. Novo: nome da versão, empreendimento, tabela e período de vigência. Condições: ordem, tipo, quantidade de parcelas, série, início após, tipo de juros, percentual ao período, percentual do valor da unidade, indexador e data-base; observação. Existem exclusão da tabela e exclusão da versão. Os efeitos dessas ações não foram testados.

Tipos de Condição em Apoio `#/common/page/614`: código, descrição, quantidade, intervalo e período Mensal/Semanal. Opções: cobrança escritural, vencimento nas promissórias, correção sempre mensal, sinal e permuta. Finalidade: Recursos Próprios, Pro Soluto, Financiamento ou Bonificação; texto. Quantidades máximas são configuráveis no cadastro, não necessariamente o limite fixo de 120 usado pelo programa.

Informações para Viabilidade `#/common/page/5528`: empreendimento e emissão de relatório, com opções. Reajustes do VGV `#/common/page/5570`: empreendimento e tipo de imóvel; grade com tabela, versão, reajuste e ordem; Salvar. Fórmulas e efeitos dos reajustes permanecem pendentes.

Modelos de Contrato `#/common/page/785`: código, descrição e rascunho na lista. Detalhe: descrição, empresa, empreendimento, anexar arquivo e baixar modelo; textos por tipo de condição. Não foram baixados modelos nem copiados textos contratuais reais. Parâmetros de contrato `#/common/page/775` abriu com conteúdo vazio nesta sessão.

## Relatórios de Vendas

Foram conferidos os formulários abaixo. Não foram emitidos documentos com dados reais. Conteúdo de saída, fórmulas, subtotais e modelos não devem ser considerados homologados apenas pela conferência dos parâmetros.

| Relatório | Rota | Parâmetros específicos, além de empresa/empreendimento quando presentes |
| --- | --- | --- |
| Impressão de Contratos | `742` | Contrato e modelo |
| Notas Promissórias | `829` | Contrato, cliente, modelo, condição, vencimentos, intervalo de parcelas, ordem e quebra de página |
| Termo de Rescisão | `7420` | Contrato e modelo |
| Reserva de Unidades | `1142` | Corretor; ativa/inativa; agrupamento corretor/empreendimento; ordem localização/data/unidade; excluir vendidas; observação |
| Clientes | `833` | Formato cadastral/endereço/telefones/resumido; cliente, município, profissão, tipo/subtipo, PF/PJ, sexo, nascimento, ordem, inativos, cancelados e parcelas abertas |
| Etiquetas | `3156` | Cliente, município, profissão, tipo/subtipo, PF/PJ, sexo, nascimento, inativos e somente principal |
| Comparativo de Vendas | `692` | Período, tipo de imóvel, ordem data/cliente, atualização dos valores e propostas |
| Demonstrativo de Vendas | `704` | Período, imóvel, avaliação mensal/quinzenal/semanal, atualização, propostas, áreas e cancelados |
| Vendas | `708` | Empreendimento/período/município; ordem; imóvel; contrato/alienação/permuta; indexador; atualização; área do m²; propostas, cancelados e área principal; agendamento |
| Preço Total de Vendas | `723` | Cliente, período, imóvel, atualização e cancelados |
| Produtividade de Vendas | `818` | Empreendimento/corretor/corretor detalhado; imóvel, corretor, período e ordem |
| Mapa de Vendas | `5084` | Período, atualização e propostas |
| Acompanhamento de Vendas | `5095` | Propostas e unidades sem características |
| Lista de Contratos | `816` | Período contratual e contábil, imóvel, simplificado/detalhado/reativados, ordem, atualização, cancelados e solicitados/autorizados |
| Ranking de Vendas | `5099` | Corretor, período; ordenar por corretor, quantidade ou VGV; atualização, propostas e agrupamento por imobiliária |
| Velocidade de Vendas | `5534` | Período, UF, município e propostas |
| Vendas configurável | `4897` | Modelo, empresa, empreendimento, cliente, imóvel, portador, UF, município, indexador, período, propostas e cancelados; gestão de modelos |

Rotas numéricas desta tabela usam o prefixo `#/common/page/`. Há 16 entradas no menu Relatórios e uma em Relatórios Configuráveis.

## Ordem de implementação proposta

1. Completar estrutura contratual: empresa/empreendimento, clientes e unidades múltiplas, corretores, condições por tipo e periodicidade, planos financeiros e histórico. Retirar a exigência de proposta como única origem somente após definir os fluxos de autorização e emissão.
2. Completar Comissões novo: vários corretores, base individual, valor ou percentual, parcelas, indexadores, apropriações, liberação automática e análises. Confirmar transições e integração financeira antes de apresentar pagamento como operação real.
3. Aditivos: preservar versão anterior, comparar condições/unidades, submeter à aprovação e tratar parcelas já baixadas. Validar emissão financeira em ambiente de teste.
4. Distratos: simulação de deduções e devolução, memória de cálculo, título e parcelas de devolução, auditoria e reversões. Não transportar percentuais reais da configuração consultada para padrões do novo sistema.
5. Tabelas/versionamento, vínculos corretor/unidade e relatórios, começando por lista de contratos, comissões, mapa e ranking. Emissão documental por modelos em etapa própria.
6. Importação com prévia e validação, alterações em lote, integração com o programa do escritório, autenticação e permissões.

## Validação que falta

| Pendência | Como fechar |
| --- | --- |
| Ações e transições do novo Comissões | Consultar registro já cadastrado ou usar homologação com comissão fictícia; conferir reversões sem executá-las em produção |
| Cálculos de juros, indexadores, seguro, desconto, resíduos e fruição | Exemplos fictícios com memória de cálculo e resultado esperado aprovado |
| Autorização/emissão, exclusão de emissão e reativação de contrato | Registros de cada estado, permissões e ambiente de teste |
| Título de devolução e Contas a Pagar | Formulário e documentação da integração em homologação |
| Relatórios e modelos | Saídas fictícias/sanitizadas para comparar colunas, totais e fórmulas |
| Importação | Conferir lista de mapeamentos, arquivos aceitos e erros com arquivos fictícios |
| Apoio e configurações | Validar cálculos de VGV, saídas de Viabilidade, variáveis de modelos e parâmetros que abriram vazios |
| Pró-Vendas completo | Retomar propostas e aprovações com usuário cadastrado como colaborador; o bloqueio observado anteriormente impediu conferir todo o formulário |

As regras atuais de proposta sequencial, emissão apenas por proposta, limite de 120 parcelas e bloqueio de distrato com comissão paga são escolhas da demonstração. Não foram confirmadas como regras equivalentes do ERP.
