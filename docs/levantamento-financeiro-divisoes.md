# Levantamento das divisões do Financeiro do Sienge

Análise de 12/10/2026, comparada ao protótipo 0.7.0. Contas a Receber e Contas a Pagar estão incompletos no protótipo. A integração já entregue fecha determinados fluxos locais; ela não significa equivalência funcional ao Financeiro do Sienge.

Todos os ramos visíveis desses dois menus foram expandidos, incluindo subgrupos de relatórios. O inventário contém 106 entradas em Contas a Receber e 62 em Contas a Pagar. Entradas anteriores e novas, assim como o mesmo relatório em dois caminhos, são contadas separadamente; esses números não medem quantidade de funções únicas nem percentual de cobertura.

Os formulários principais foram abertos para conferir campos, filtros e ações. As demais entradas têm levantamento de menu; regras internas e etapas posteriores dependentes de selecionar títulos não foram homologadas. Não houve salvamento, baixa, autorização, remessa ou envio no ERP. Valores e pessoas da base real não integram este documento nem os dados de demonstração.

## Resultado da comparação

| Área | Existe no protótipo | Falta para acompanhar o Sienge |
|---|---|---|
| Títulos e parcelas | Cadastro manual, parcelas mensais em centavos, saldo e situação, vínculos com contratos, comissões e devoluções | Separar cadastro de títulos da consulta de parcelas; filtros completos; apropriações; informações de controle; documentos de previsão; indexadores além de REAL |
| Baixas | Baixa parcial, principal/juros/multa/desconto, operação e banco juntos, estorno com histórico | Tipos de baixa e regras próprias; seleção em lote; formas de pagamento; autorização; cartão, cheque e importações |
| Recebimento | Saldo aberto, vencidos e recebimentos integrados com contratos | Dashboard próprio, reparcelamento, repactuação, reajuste, cobrança, cessão, condomínio, adiantamento e seguros |
| Pagamento | Títulos manuais, comissões liberadas, devoluções e estornos | Alçadas, ciência, autorização por parcela, orçamento, rateios, previsão, documentos, programação, financiamento e administração de obra |
| Banco | Contas, saldo inicial, transferências locais e extrato | Arquivos de remessa/retorno, DDA, cobrança e pagamento escritural, conciliação, cheques e abertura/fechamento de caixa |
| Relatórios | Extrato bancário, previsão por vencimento, lista básica de vencidos e CSV de telas | Relatórios por cliente/credor, recebidas/pagas, saldos, apropriações, retenções, modelos e consultas analíticas/sintéticas específicas |

Nenhum item é classificado como reprodução completa. “Parcial” indica um comportamento correspondente no protótipo, sem equivalência de campos e regras. “Ausente” indica que não há a rotina financeira específica. Tabela Price/SAC e aditivos existentes no Comercial não equivalem, por si só, aos relatórios ou reparcelamentos financeiros. Transferência local não equivale ao pagamento escritural bancário.

## Formulários e diferenças conferidos

- Títulos a receber e pagar: empresa, cliente/credor, documento, número, emissão, valor total, parcelas, data contábil, indexador, data base e primeiro vencimento possuem asterisco. O Sienge apresenta conta contábil, opção de contabilizar apenas a baixa, observação e apropriação de receitas/despesas por centro de custo e plano financeiro, com valor e percentual. O pagar também apresenta desconto e rateio padrão. A apropriação não possui asterisco no cabeçalho observado; sua obrigatoriedade condicional precisa ser conferida por configuração.
- Consulta de títulos: empresa, centro de custo, cliente/credor, documento, situação, emissão, mais filtros, modos sintético/analítico, colunas e visões salvas. No pagar também há limites de valor e vencimento. As datas de emissão são obrigatórias nas consultas observadas.
- Consulta de parcelas a receber: vencimento inicial/final, correção até e informações a processar são obrigatórios. Pode distinguir contas a receber, recebidas e outras informações; possui filtros de recebimento. A pagar: vencimentos e informação a apresentar obrigatórios, grupo de empresa, pagamento, documento, origem e valores bruto/líquido.
- Baixa a receber: data, tipo, empresa da conta e conta corrente obrigatórios; vencimento obrigatório na consulta. Há cartão, valor presente, Price/SAC, correção anual, portador e operação de cobrança. A tela informa processo pendente na base; não foi retomado ou concluído.
- Baixa a pagar: data, tipo, empresa pagadora e conta corrente obrigatórios; cheque e seleção de somente autorizados; filtros por título/parcela, credor, centro de custo, plano e forma de pagamento.
- Autorização a pagar: empresa, credor, período, valor, seleção por data, projeto, obra, unidade construtiva, departamento, documento, plano e origem. Correção até obrigatória. Seleção por parcela, marcação de autorizadas/não autorizadas e aviso ao cadastrante.
- Programação de pagamento: lote, conta, vencimento obrigatório, título/credor, centro de custo, plano e departamento. Dados da baixa exigem data, empresa e conta corrente. Há agrupamento de tributos com mesmo código de barras e destaque de credores com adiantamento.
- Reparcelamento anterior: data do reparcelamento e correção até obrigatórias; consulta, seleção e etapa seguinte. Tela nova: consulta com período obrigatório e estados Efetivado, Aguardando efetivação e Vencido; indicadores e ação de novo reparcelamento.
- Reajuste programado: mês, limite de reajuste, indexador, juros e cobrança de resíduo obrigatórios. A base exibe aviso de funcionalidade em fase de testes.
- Cobrança escritural/remessa: empresa, período, conta, correção, emissão, sequencial de remessa/nosso número, tipo de movimento e nome de arquivo obrigatórios. Há mensagens, boletos, e-mail, download e opções de inclusão de títulos. Nenhum arquivo foi gerado.
- Inadimplência: vencimento limite e correção até obrigatórios; inclui parcelas parcialmente pagas, resíduos e pagas enviadas ao Serasa, com marcação de inadimplentes. Nossa lista de vencidos não implementa essa gestão.
- Condomínios: títulos e geração de parcelas próprios, além de custos incorridos. Cessão: título obrigatório, cliente principal, data, participação, principal/atual e aprovação separada. Cheques: empresa, operação e data obrigatórios, situação, banco, agência e conta.
- Substituição de previsão: diferencia parcela prevista de título definitivo. A tela explica a geração de títulos a partir de previsões avulsas com opção de permitir substituição. Fluxo previsto por vencimento no protótipo não implementa isso.
- Documentos enviados: local atual/destino, data de envio, lote, usuário e agrupamento; envio para local e data obrigatórios quando aplicável. Financiamento e cobrança de administração de obra têm cadastros próprios; administração relaciona títulos CP e CR.
- Aprovação por orçamento: estado e consulta por títulos/parcelas, empresa, credor, documento, centro de custo, valor e vencimento. Alteração em massa tem seleção de parcelas e execução; não foi executada.
- Dashboard a receber: empresa e período obrigatórios, indicadores recebidos/a receber no prazo/vencidos, distribuição e situação dos clientes.
- Relatórios: parâmetros próprios, correção, agrupamento, ordem, colunas e exportação. Configuráveis exigem modelo e não equivalem a exportar uma tabela genérica.
- Verificação de Alterações: está desativada na base e menciona o parâmetro 256. Não foi ativada.

## Ordem de implementação proposta

1. Estrutura do menu e cadastros: Contas a Receber e Contas a Pagar como grupos, com títulos, consulta de parcelas, baixas e relatórios próprios. Criar apropriações por centro de custo/plano e os cadastros de apoio antes das rotinas dependentes. Preservar os vínculos existentes.
2. Contas a Pagar: alçadas, ciência, autorização por parcela, rateio, títulos de previsão, substituição, programação em lote e relatórios por credor. Autorização deve bloquear a baixa quando exigida pela configuração.
3. Contas a Receber: dashboard, extrato do cliente, reparcelamento com histórico e estorno, repactuação, reajustes, quitação, cessão e gestão de cobrança/inadimplência. Não alterar parcelas já liquidadas sem tratamento explícito.
4. Banco e arquivos: remessa/retorno, boletos, pagamento escritural, DDA e conciliação, usando configurações reais de banco/layout e arquivos de teste. Gerar arquivo ou simular localmente não comprova transmissão/aceite bancário.
5. Especializados: financiamento, administração de obra, condomínios, seguros, cheques, adiantamentos e relatórios de retenções/guias, com levantamento das etapas específicas antes de declarar equivalência.

## Cadastros de apoio e dependências

Apoio de Receber: Operações de Cobranças (1169), Portadores (862), Aditivos/Modelos (5374), Aditivos/Parâmetros (5378), Bandeiras (5720) e Configuração de Cartão (5722).

Apoio de Pagar: Intervalo de Vencimento, Calendário de Vencimentos (5927), Download de Anexos (7209), Formas de Pagamento (1839), Locais (4138), Emissão de Guias/Modelos (1699) e Parâmetros (1698). Também existem Folgas/Feriados (1171), Configurações de Autorização (6069), Parâmetros do Plano Financeiro (1405) e Serviços (3084).

Caixa e Bancos possui inicialização (1048), movimentações (1115), conciliação, abertura (1215), reabertura (1216), fechamento (1217), cheques, consultas e relatórios. Folha e Gestão de Crédito aparecem como grupos separados; não fazem parte do levantamento detalhado de Pagar/Receber deste documento.

## Inventário de Contas a Receber

| Divisão | Rotina | Rota observada | Nosso sistema |
|---|---|---|---|
| Principal | Dashboard | `financeiro/contas-receber/dashboard` | Parcial |
| Principal | Títulos | `common/page/9071` | Parcial |
| Principal | Consulta de parcelas | `financeiro/contas-receber/consulta-parcelas` | Parcial |
| Baixa | Inclusão | `common/page/1601` | Parcial |
| Baixa | Alteração/Exclusão | `common/page/1721` | Parcial |
| Baixa / Leitura CIELO | Identificação de Parcelas | `common/page/7810` | Ausente |
| Baixa / Leitura CIELO | Leitura | `common/page/4914` | Ausente |
| Baixa / Importação de Arquivos | Identificação de Contratos | `common/page/7534` | Ausente |
| Baixa / Importação de Arquivos | Leitura do Arquivo Crédito Associativo | `common/page/7317` | Ausente |
| Reparcelamentos | Reparcelamento novo | `financeiro/contas-receber/reparcelamentos/reparcelamento` | Ausente |
| Reparcelamentos | Inclusão anterior | `common/page/1047` | Ausente |
| Reparcelamentos | Exclusão | `common/page/1057` | Ausente |
| Reparcelamentos | Relatório anterior | `common/page/2458` | Ausente |
| Reparcelamentos | Relatório novo | `financeiro/contas-receber/reparcelamentos/relatorio` | Ausente |
| Reparcelamentos | Gestão de Simulações | `common/page/8792` | Ausente |
| Reajuste Programado | Inclusão | `common/page/7605` | Ausente |
| Reajuste Programado | Exclusão | `common/page/7628` | Ausente |
| Outras Funções | Acompanhamento Correção Monetária | `common/page/3934` | Ausente |
| Outras Funções | Alocação de Parcelas | `common/page/1686` | Ausente |
| Outras Funções | Alteração na Taxa Administrativa | `common/page/5609` | Ausente |
| Outras Funções | Distratos | `common/page/1820` | Parcial no Comercial |
| Outras Funções | Importação de Títulos | `financeiro/contas-receber/outras-funcoes/importar-titulos` | Ausente |
| Outras Funções | Entrega de Chaves Inclusão | `common/page/3876` | Ausente |
| Outras Funções | Entrega de Chaves Exclusão | `common/page/3881` | Ausente |
| Outras Funções | Quitações | `common/page/1913` | Ausente |
| Outras Funções | Repactuações | `common/page/1898` | Ausente |
| Outras Funções | Substituições | `common/page/1638` | Ausente |
| Outras Funções | Reenvio de E-mail | `common/page/8501` | Ausente |
| Cobrança Escritural | Geração de Arquivo Remessa | `common/page/1919` | Ausente |
| Cobrança Escritural | Impressão de 2ª Via | `common/page/5607` | Ausente |
| Cobrança Escritural | Leitura | `common/page/1127` | Ausente |
| Cobrança Escritural | Situação das Parcelas | `common/page/1784` | Ausente |
| Cobrança Escritural | Rateio de Crédito | `common/page/7589` | Ausente |
| Cobrança Escritural | Download de Arquivo Remessa | `common/page/8103` | Ausente |
| Cobrança Escritural | Notificação de Cobrança | `common/page/8297` | Ausente |
| Cobrança Escritural / Configuração | Cadastro de Mensagens | `common/page/7771` | Ausente |
| Cobrança Escritural / Configuração | Configuração de Layout | `common/page/8630` | Ausente |
| Cobrança Escritural / Configuração | Configuração da Cobrança Escritural | `common/page/8232` | Ausente |
| Cobrança Escritural / Configuração | Configuração de Envio de E-mail | `common/page/4940` | Ausente |
| Controle de Inadimplência | Inadimplência | `common/page/1829` | Parcial |
| Controle de Inadimplência | Títulos em Cobrança | `common/page/1939` | Ausente |
| Controle de Inadimplência | Configuração | `common/page/7012` | Ausente |
| Controle de Inadimplência | Configuração de Notificação de Inadimplência | `common/page/8095` | Ausente |
| Controle de Inadimplência / Serasa | Configuração | `common/page/7198` | Ausente |
| Controle de Inadimplência / Serasa | Exportação PEFIN | `common/page/5896` | Ausente |
| Controle de Inadimplência / Serasa | Remessa Informacional | `common/page/5912` | Ausente |
| Controle de Inadimplência / Serasa | Leitura PEFIN | `common/page/5915` | Ausente |
| Condomínios | Títulos | `common/page/2933` | Ausente |
| Condomínios | Geração de Parcelas | `common/page/2944` | Ausente |
| Cessão de Direitos | Solicitação | `common/page/2063` | Ausente |
| Cessão de Direitos | Aprovação | `common/page/5065` | Ausente |
| Controle de Cheques Recebidos | Operação com Cheques | `common/page/5692` | Ausente |
| Controle de Cheques Recebidos | Situação dos Cheques | `common/page/5690` | Ausente |
| Controle de Cheques Recebidos | Recibo de Resgate | `common/page/5700` | Ausente |
| Consultas e controle | Verificação de Alterações | `common/page/1632` | Ausente |
| Consultas e controle | Consultas de Títulos | `common/page/2513` | Ausente |
| Relatórios | Contas a Receber | `common/page/4803` | Ausente |
| Relatórios | Contas Recebidas | `common/page/4929` | Ausente |
| Relatórios / Extratos | Extrato de Cliente anterior | `common/page/1535` | Ausente |
| Relatórios / Extratos | Extrato de Cliente Histórico | `common/page/3012` | Ausente |
| Relatórios / Extratos | Extrato de Cliente novo | `financeiro/contas-receber/relatorios/extratos/extrato-cliente` | Ausente |
| Relatórios / Extratos | Saldo Devedor Presente anterior | `common/page/1579` | Ausente |
| Relatórios / Extratos | Saldo Devedor Presente novo | `financeiro/contas-receber/relatorios/saldo-devedor` | Ausente |
| Relatórios / Extratos | Tabela Price / SAC | `common/page/1537` | Ausente |
| Relatórios / Extratos | Portador | `common/page/5557` | Ausente |
| Relatórios / Contratos Anuais | Repactuação | `common/page/2817` | Ausente |
| Relatórios / Contratos Anuais | Demonstrativo de Resíduo | `common/page/1581` | Ausente |
| Relatórios / Contratos Anuais | Títulos Repactuados | `common/page/5743` | Ausente |
| Relatórios / Contratos Anuais | Reajuste Programado | `common/page/7616` | Ausente |
| Relatórios / Condomínios | Custos Incorridos | `common/page/5300` | Ausente |
| Relatórios / Seguros | Cálculo | `common/page/5086` | Ausente |
| Relatórios / Seguros | Extrato | `common/page/5617` | Ausente |
| Relatórios / Saldo de Adiantamento | Saldo/Extrato de Adiantamento | `common/page/2426` | Ausente |
| Relatórios / Cobrança | Boletos | `common/page/1449` | Ausente |
| Relatórios / Cobrança | Mala Direta | `common/page/2613` | Ausente |
| Relatórios / Cobrança | Recibos | `common/page/2485` | Ausente |
| Relatórios / Cobrança | Etiquetas | `common/page/2785` | Ausente |
| Relatórios / Cobrança | Situação das Parcelas | `common/page/2710` | Ausente |
| Relatórios / Outros / Títulos | Distratados / Cancelados | `common/page/4140` | Ausente |
| Relatórios / Outros / Títulos | Quitados | `common/page/4145` | Ausente |
| Relatórios / Outros / Títulos | Custos Incorridos | `common/page/5300` | Ausente |
| Relatórios / Outros / Receita Federal | Imposto de Renda | `common/page/2701` | Ausente |
| Relatórios / Outros / Cessão de Direitos | Cessão de Direitos | `common/page/2803` | Ausente |
| Relatórios / Outros / Cessão de Direitos | Extrato de Cliente | `common/page/3159` | Ausente |
| Relatórios / Outros / Controle de Inadimplência | Títulos em Cobrança | `common/page/3041` | Ausente |
| Relatórios / Outros / Controle de Inadimplência | Clientes Sub Judice | `common/page/3050` | Ausente |
| Relatórios / Outros / Controle de Inadimplência | Atividades Pendentes | `common/page/3055` | Ausente |
| Relatórios / Outros / Controle de Inadimplência | Títulos Inadimplentes | `common/page/2559` | Ausente |
| Relatórios / Outros / Controle de Inadimplência | Posição de Inadimplência | `common/page/2872` | Ausente |
| Relatórios / Outros / Controle de Inadimplência | Parcelas a Receber/Recebidas por Cliente e Avalista | `common/page/8195` | Ausente |
| Relatórios / Outros / Reparcelamentos | Impressão de Aditivos | `common/page/5380` | Ausente |
| Relatórios / Outros / Saldos | Posição de Saldos | `common/page/1575` | Ausente |
| Relatórios / Outros / Saldos | Valores Médios | `common/page/4150` | Ausente |
| Relatórios / Outros / Saldos | Saldo Devedor Mensal | `common/page/4152` | Ausente |
| Relatórios / Outros / Outros Relatórios | Faturamento | `common/page/1577` | Ausente |
| Relatórios / Outros / Outros Relatórios | Envio de E-mail | `common/page/8253` | Ausente |
| Relatórios / Outros / Outros Relatórios | Antecipações / Inadimplências | `common/page/2698` | Ausente |
| Relatórios / Outros / Outros Relatórios | Valor Presente | `common/page/1573` | Ausente |
| Relatórios / Outros / Outros Relatórios | Cálculo de Descontos | `common/page/2637` | Ausente |
| Relatórios / Outros / Outros Relatórios | Formas de Recebimentos | `common/page/2633` | Ausente |
| Relatórios / Outros / Outros Relatórios | Impostos Retidos | `common/page/3694` | Ausente |
| Relatórios / Outros / Outros Relatórios | Alocação de Parcelas | `common/page/5598` | Ausente |
| Relatórios / Outros / Outros Relatórios | Posição de Comercialização | `common/page/2826` | Ausente |
| Relatórios / Outros / Outros Relatórios | Previsão de Recebimento Mensal | `common/page/7973` | Ausente |
| Relatórios Configuráveis | Contas a Receber | `common/page/4855` | Ausente |
| Relatórios Configuráveis | Contas Recebidas | `common/page/4863` | Ausente |

## Inventário de Contas a Pagar

| Divisão | Rotina | Rota observada | Nosso sistema |
|---|---|---|---|
| Principal | Títulos | `common/page/1604` | Parcial |
| Principal | Consulta de parcelas | `common/page/9102` | Parcial |
| Principal | Alteração de Títulos/Parcelas | `financeiro/contas-pagar/alteracao-de-titulos-em-massa` | Ausente |
| Principal | Substituição de Previsão Financeira | `common/page/8293` | Ausente |
| Principal | Documentos Enviados | `common/page/2598` | Ausente |
| Principal | Rateio Padrão | `common/page/1245` | Ausente |
| Principal | Aprovação de Títulos por Orçamento | `financeiro/contas-pagar/aprovacao-de-titulos` | Ausente |
| Financiamento Bancário | Financiamento Bancário | `common/page/2848` | Ausente |
| Financiamento Bancário | Juros Pós-fixado | `common/page/7975` | Ausente |
| Financiamento Bancário | Relatório de Financiamento Bancário | `common/page/8078` | Ausente |
| Autorização de Pagamento | Alçadas de Autorização de Pagamento | `common/page/4865` | Ausente |
| Autorização de Pagamento | Ciência de Títulos | `common/page/8498` | Ausente |
| Autorização de Pagamento | Autorização de Pagamento | `common/page/1777` | Ausente |
| Autorização de Pagamento | Autorizações da Parcela | `common/page/4871` | Ausente |
| Baixas | Inclusão | `common/page/1256` | Parcial |
| Baixas | Alteração/Exclusão | `common/page/1428` | Parcial |
| Baixas | Estorno Inclusão | `common/page/4054` | Parcial |
| Baixas | Estorno Exclusão | `common/page/4055` | Parcial |
| Pagamento Escritural | Alçada | `common/page/1845` | Ausente |
| Pagamento Escritural | Configuração | `common/page/1786` | Ausente |
| Pagamento Escritural | Transferências Bancárias | `common/page/1797` | Ausente |
| Pagamento Escritural | Programações de Pagamento | `common/page/1806` | Ausente |
| Pagamento Escritural | Autorização de Pagamento | `common/page/1856` | Ausente |
| Pagamento Escritural | Gerações de Arquivo | `common/page/1909` | Ausente |
| Pagamento Escritural | Leitura de Arquivo de Retorno | `common/page/1918` | Ausente |
| Pagamento Escritural | Leitura de Arquivo DDA | `common/page/3222` | Ausente |
| Pagamento Escritural | Cancelamentos de Lote | `common/page/1882` | Ausente |
| Pagamento Escritural / Relatórios | Lote de Pagamento Escritural anterior | `common/page/1943` | Ausente |
| Pagamento Escritural / Relatórios | Lote de Pagamento Escritural novo | `financeiro/contas-pagar/pagamento-escritural/relatorios/lote-pagamento-escritural` | Ausente |
| Pagamento Escritural / Relatórios | Relatório de Autorizações Pendentes | `common/page/5842` | Ausente |
| Pagamento Escritural / Relatórios | Transferências Bancárias | `common/page/8318` | Ausente |
| Administração de Obra | Cobrança | `common/page/2617` | Ausente |
| Administração de Obra | Importação de Títulos | `common/page/552` | Ausente |
| Administração de Obra | Análise do Comprometido da Obra | `common/page/5448` | Ausente |
| Consultas | Títulos | `common/page/104` | Parcial |
| Consultas | Parcelas | `common/page/1382` | Parcial |
| Relatórios | Contas a Pagar | `common/page/1674` | Ausente |
| Relatórios | Contas Pagas | `common/page/1843` | Ausente |
| Relatórios | Extrato do Credor | `common/page/1780` | Ausente |
| Relatórios | Ficha de Compromisso | `common/page/1651` | Ausente |
| Relatórios | Autorização de Pagamento | `common/page/1609` | Ausente |
| Relatórios | Demonstrativo de Pagamento | `common/page/1815` | Ausente |
| Relatórios | Saldos de Credores | `common/page/2423` | Ausente |
| Relatórios | Títulos por Data | `common/page/373` | Ausente |
| Relatórios | Documentos por Fornecedor | `common/page/123` | Ausente |
| Relatórios | Totais por Fornecedor | `common/page/35` | Ausente |
| Relatórios | Emissão de Mala Direta | `common/page/2625` | Ausente |
| Relatórios | Fiscal | `common/page/37` | Ausente |
| Relatórios | Baixas sem Cheques | `common/page/4076` | Ausente |
| Relatórios | Administração de Obras Contas a Pagar | `common/page/133` | Ausente |
| Relatórios | Documentos com Numeração Repetida | `common/page/5903` | Ausente |
| Relatórios / Impostos | Relatório de ISS | `common/page/1653` | Ausente |
| Relatórios / Impostos | Retenções | `common/page/1669` | Ausente |
| Relatórios / Impostos | Consulta de Retenções nova | `financeiro/contas-pagar/relatorios/impostos/retencoes` | Ausente |
| Relatórios / Impostos | Retenções por Fornecedor | `common/page/1672` | Ausente |
| Relatórios / Impostos | Emissão de Guias | `common/page/1812` | Ausente |
| Relatórios / Impostos | Títulos por Guia de Imposto | `common/page/4916` | Ausente |
| Relatórios / Adiantamentos | Saldo de Adiantamentos | `common/page/1165` | Ausente |
| Relatórios / Adiantamentos | Saldo de Adiantamentos Vinculados | `common/page/660` | Ausente |
| Relatórios / Adiantamentos | Detalhamento dos Saldos de Credores | `common/page/2927` | Ausente |
| Relatórios Configuráveis | Contas a Pagar | `common/page/3978` | Ausente |
| Relatórios Configuráveis | Contas Pagas | `common/page/4891` | Ausente |

## Critério de conclusão

O próximo fechamento deve verificar cada rotina implementada em tela, API, persistência e integração, incluindo obrigatórios com asterisco e estados intermediários. Rotina apenas listada no menu continua ausente. A inspeção de uma tela inicial não confirma regras de cálculo nem todo o fluxo; as entradas com levantamento somente de menu precisam de conferência do formulário antes de implementação equivalente.
