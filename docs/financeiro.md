# Financeiro — primeira versão

Versão 0.6.0, 12/10/2026. Módulo separado de Comercial e Contabilidade no menu, no mesmo repositório e banco local.

## Levantamento no Sienge

Consulta somente de leitura ao menu Financeiro e aos cadastros de títulos a receber e a pagar. Os dois formulários identificam como obrigatórios empresa, cliente/credor, documento, número do documento, emissão, valor total, parcelas, data contábil, indexador, data-base e primeiro vencimento. Esses dados são exigidos na interface e API do cadastro manual. A consulta oferece empresa, documento, cliente/credor, situação e datas; o menu inclui Contas a Receber, Contas a Pagar, Caixa e Bancos e outros submódulos.

Nenhum título foi salvo nem nenhuma baixa foi realizada no ERP. Dados reais de consultas não são copiados para o protótipo ou publicados no GitHub.

## Implementado

- Credores e contas bancárias por empresa, inicialização de saldo e ativação. Contas movimentadas preservam empresa, código, data e saldo inicial. Permissão de saldo devedor é explícita.
- Títulos manuais a receber/pagar com parcelas mensais, divisão em centavos, edição antes da baixa e cancelamento com motivo. Documento duplicado para a mesma empresa, natureza e pessoa é bloqueado.
- Consulta unificada de parcelas: títulos manuais, contratos comerciais e comissões. Contratos não emitidos são identificados e não podem ser baixados; comissões exigem liberação no Comercial. Não existe cópia independente dessas parcelas.
- Baixas parciais de títulos e contratos. Principal, juros, multa e desconto informados ficam separados; a parcela baixa pelo principal e a conta movimenta o valor líquido. Limites, empresa da conta e saldo disponível são validados.
- Comissões têm pagamento integral sem acréscimos nesta versão. A baixa modifica a mesma parcela do Comercial.
- Operação, baixa comercial e movimento bancário são gravados na mesma transação. Identificador de requisição impede dupla baixa ou transferência repetida.
- Estorno cria movimento inverso e preserva o original e o histórico. Recebimento de contrato reabre o saldo comercial; pagamento de comissão estornado retorna à liberação. Comissões pagas precisam ser estornadas antes de reverter recebimentos que afetem sua liberação. Lançamento contábil vinculado deve ser estornado antes da operação financeira.
- Transferência local entre contas da mesma empresa, com duas pontas atômicas, verificação de saldo e estorno.
- Extrato com saldo anterior, inicialização dentro do período, movimentos e saldo final. Fluxo previsto por vencimento, saldos abertos e parcelas vencidas; comissões ainda não liberadas também aparecem na previsão.
- Contabilidade passa a listar recebimentos/pagamentos financeiros e transferências como origens para classificação explícita. Pagamento de comissão usa sua origem já existente, sem gerar outra origem duplicada. Histórico e estornos permanecem rastreáveis.

## Uso e limites

Cadastre credores quando necessários e contas bancárias da empresa. Crie títulos ou consulte as parcelas de contratos/comissões já existentes; selecione a parcela, conta e data para registrar a baixa local. Consulte operações, extrato e previsão. Para estorno, confira primeiro eventuais lançamentos na Contabilidade.

Títulos manuais trabalham com REAL; correção por outros indexadores ainda não está implementada. Juros, multa e desconto da baixa são valores explicitamente informados, sem cálculo automático de política tributária ou contratual. Não há rateios, retenções de impostos, arquivos CNAB, boletos, PIX, integração bancária, conciliação de extrato, remessa/retorno, reparcelamento, crédito, folha, financiamento, caixa por operador ou cheques. Também falta conferir cada subformulário restante do ERP. Não há movimentação bancária real ou envio externo.

Baixas antigas realizadas diretamente no Comercial aparecem na consulta pelo seu estado original, mas não recebem movimento bancário inventado. Devoluções de distrato não geram títulos automaticamente nesta etapa. Estornos de recebimentos antigos sem identificador de operação financeira exigem levantamento específico; a interface financeira estorna somente suas próprias operações.

Esta é uma base funcional para testes, não a reprodução completa do Financeiro do Sienge nem uma implantação de produção.

## Validação

62 testes aprovados: os 50 anteriores e 12 de Financeiro, abrangendo obrigatórios, parcelas/centavos, baixa parcial e valor líquido, estorno, idempotência, conta de outra empresa, saldo insuficiente, transferência, atualização do Comercial, reversão integral em falhas, integração contábil, extrato e API, incluindo retirada da liberação automática após estorno de recebimento. Conferência da prévia com conta/título fictícios recebimento e pagamento parciais.
