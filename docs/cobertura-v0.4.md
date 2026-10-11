# Cobertura Comercial v0.4

Data: 11/10/2026. Implementação independente baseada no levantamento de telas do Sienge. Não há equivalência integral validada.

| Área | Implementado | Validação ou ampliação pendente |
|---|---|---|
| Contratos | Cadastro direto, várias unidades/clientes, participação e principal, abas, bloqueio de estoque, autorização/emissão/reversão, histórico | Regras completas de permissões e aprovação do ERP; todos os campos complementares |
| Condições | Parcelamento em centavos, vencimentos mensais/semanais, juros simples/compostos/Price/SAC/fixos/anuais | Comparação de fórmulas, datas-base e arredondamentos com casos reais do ERP |
| Complementos | Avalistas, apropriações, corretor, encargos, seguros, desconto e anexos textuais | Encargos, seguro, desconto, correção e pós-chaves são informações cadastrais; não alteram o cálculo das parcelas. Anexos binários ainda não suportados |
| Comissões | Vários corretores e grupos por contrato, parcelas, autorização, liberação/reversão, cancelamento/reativação e baixa manual local; liberação por percentual recebido | Correção por indexador, integração financeira e equivalência da regra automática. Registro e Controle é consulta das parcelas, sem reproduzir todo o fluxo legado |
| Aditivos | Proposta de alteração, aprovação/reprovação, revisão de contrato e estoque atômica | Alterações com parcelas recebidas são bloqueadas; reparcelamento/conciliação ainda pendentes |
| Distratos | Deduções fixas, % do recebido ou do contrato, piso de devolução, parcelas locais de restituição e liberação de estoque | Fruição, dedução do ato, intervalos de financiamento e correção; bloqueio com comissão paga |
| Apoio | Tabelas/versões, condições, indexadores, departamentos, obras, planos, modelos, deduções, equipes e captação | Cadastros não replicam todas as integrações e validações do ERP |
| Importação | Prévia, validação e gravação atômica de contratos JSON ou CSV simples com cabeçalho definido | Mapeamento livre de colunas, CSV com separadores dentro de aspas e formatos do ERP |
| Relatórios | Consultas locais, parcelas, comissões, estoque, clientes, reservas, agrupamentos por mês/corretor, modelos textuais, CSV e impressão | Os nomes do menu espelham o levantamento; vários modelos usam consultas comuns. Layouts, filtros e fórmulas específicos ainda precisam de reprodução e validação |
| Pró-Vendas | Clientes, agenda, interesses, campanhas, propostas e fluxo inicial de aprovação | Acesso do ERP bloqueou parte do levantamento. Não considerar o fluxo inicial equivalente ao Pró-Vendas completo |
| Operação | SQLite persistente, API local, revisões e histórico | Autenticação, perfis, auditoria identificada, backups e integração com sistema do escritório |

## Verificação

23 testes automatizados: fluxo anterior e novo, estoque compartilhado, participações e totais, comissões parceladas, reversão, aditivos, recebimentos, distrato, importação atômica, calendários e API. Verificação no navegador do cadastro com troca de abas, bloqueio de unidade com proposta ativa, salvamento e consulta com parcelas.

Dados demonstrativos apenas. Baixas e devoluções são registros locais; nenhum pagamento é executado. Não conectar esta versão a operações reais antes de validar as regras acima.
