# Contabilidade — primeira versão

Versão 0.5.0, 12/10/2026. O módulo fica no mesmo repositório e banco local do Comercial.

## Levantamento do Sienge

Consulta somente de leitura ao menu Contabilidade/Fiscal e às telas Lotes e Registro de Lançamentos. Empresa, Lote, Data, Valor e Tipo do lançamento têm asterisco no lançamento. Também foram observados conta debitada, conta creditada, histórico, complemento, documento, cliente, credor, sistema/origem e conciliação. Lotes oferecem filtros por empresa, código, descrição, tipo e período, com situações aberto, em manutenção e fechado. Nenhum registro foi criado ou alterado no ERP.

## Implementado

- Plano de contas com hierarquia, contas sintéticas/analíticas, natureza e ativação. Contas usadas preservam código, tipo, natureza e hierarquia.
- Lotes por empresa e período; fechamento após contabilização de todos os rascunhos e igualdade entre débitos e créditos. Reabertura exige motivo e fica no histórico.
- Lançamentos com duas ou mais partidas, valor por partida, centro de custo, histórico, complemento e documento. Os valores usam centavos inteiros. Contas sintéticas/inativas, data fora do lote e empresa divergente são rejeitadas.
- Rascunhos podem ser alterados. Contabilizados não são editados: estorno cria partidas invertidas, preserva o original e impede repetir o estorno. Fechamento bloqueia escrita.
- Integração explícita de contratos emitidos e baixas de comissões pagas. A pessoa seleciona lote, data, tipo e contas de débito/crédito; o sistema usa o valor da origem. Não escolhe classificação contábil automaticamente. Origem já vinculada não pode ser contabilizada outra vez. Mudanças posteriores ou indisponibilidade da origem aparecem para revisão, sem alterar o lançamento registrado.
- Diário, Razão e Balancete por empresa/período. Saldo anterior e final são apresentados como débito menos crédito. Rascunhos não entram nos relatórios; original e estorno entram e se compensam.
- API aplica as mesmas regras, controle de revisão e transações. Interface usa os componentes visuais existentes e asteriscos nos campos exigidos.

## Uso

Cadastre contas analíticas, crie um lote da empresa para o período e registre lançamentos ou abra Integração com o Comercial. Confira as partidas e contabilize. Consulte os relatórios e feche o lote quando a conferência terminar. Para correção, reabra com motivo quando necessário e estorne, preservando o histórico.

## Escopo restante

Esta é a base contábil do protótipo, não a reprodução completa do módulo Contabilidade/Fiscal. Permanecem para levantamento e implementação: históricos padronizados, tipos de lançamento cadastráveis, conciliação, rateios percentuais, grupos de empresas, consolidação, encerramento/zeramento, balanço/DRE, custos e POC, imposto diferido, obrigações fiscais, SPED, importações e integrações com outros módulos. Recebimentos de parcelas não geram lançamentos automáticos nesta versão. Planos financeiros comerciais e plano de contas contábil permanecem cadastros distintos.

Não há envio fiscal, comunicação com o ERP ou importação de dados reais. As exigências locais de plano de contas e lotes ainda precisam ser comparadas campo a campo com seus cadastros no Sienge. As classificações contábeis são explicitamente informadas pelo usuário.
