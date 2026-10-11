# Campos obrigatórios no Comercial

Versão 0.4.2, 11/10/2026. Campos com asterisco são obrigatórios: a tela identifica o campo e impede salvar; a API aplica a regra mesmo quando acionada diretamente. A verificação de contratos, comissões e tabelas percorre todas as abas e os registros de suas listas.

## Conferência no Sienge

Consulta somente de leitura nas telas Cadastro de Unidades e Cadastro de Contrato. Nenhum dado foi preenchido ou salvo no ERP.

Unidades: empreendimento, unidade, área privativa, área comum, área comum de divisão não proporcional, fração ideal, fração ideal em m², tipo de imóvel, indexador, quantidade indexada, data e estoques comercial, legal e de obra têm asterisco. Esses campos estão presentes e obrigatórios no cadastro novo. Torre, pavimento e preço de referência permanecem campos locais opcionais; quando omitidos, o programa usa Sem bloco, pavimento 0 e preço de referência 0. A quantidade indexada é armazenada; sua conversão monetária não foi implementada.

Contratos: empresa, empreendimento, contrato, unidade principal, cliente principal, data do contrato, previsão de entrega, data contábil, valor total, preço total da venda, plano financeiro e tipo de correção têm asterisco. O programa exige clientes/unidades com principal e participação, pelo menos um plano financeiro válido e os demais dados. Corretor, observação, cláusula, categoria e dados financeiros complementares não têm asterisco nessa tela e não foram tornados obrigatórios no contrato.

Os demais formulários mostram suas exigências locais existentes e as operações condicionais: referência/data ao registrar baixa de comissão, motivo ao cancelar comissão/reprovar aditivo e dados da devolução quando solicitada. Ainda é necessária conferência dos asteriscos de cada formulário restante do ERP; esta versão não afirma equivalência de todos eles.

## Comportamento

- Campos vazios e textos somente com espaços não atendem à obrigatoriedade. Zero atende ao preenchimento numérico; limites e regras de negócio continuam sendo verificados separadamente.
- Ao faltar dado em outra aba, a tela abre a primeira aba pendente e mostra campos e registros faltantes.
- Asteriscos acompanham os controles obrigatórios, com informação acessível de obrigatoriedade e indicação visual do erro.
- A emissão pela proposta pede os complementos obrigatórios do contrato; falha na validação desfaz contrato, comissão e alteração do estoque.
- A importação usa a mesma política. Cabeçalho dos contratos CSV: company;project;code;date;delivery;accountingDate;amount;salePrice;correction;planId;clientId;unitId. planId é o identificador de um plano financeiro cadastrado. Mantém-se o arquivo de condições descrito na tela.
- Dados complementares das unidades usam os mesmos atributos obrigatórios do estoque, preenchidos a partir da unidade quando existentes; o salvamento mantém as duas representações alinhadas.

## Dados anteriores

Novas colunas de unidades são adicionadas sem inventar valores nos registros existentes. Registros históricos continuam consultáveis e não são apagados. Cadastros antigos incompletos precisam dos dados faltantes para salvar como cadastro novo/alterado ou emitir contrato pendente. Aditivos preservam os dados históricos, validam suas alterações e não inventam previsão de entrega ou plano financeiro ausentes no contrato original.

## Verificação

41 testes automatizados aprovados: 33 anteriores e 8 novos para obrigatoriedade, zero versus vazio, espaços, abas fechadas, registros repetidos, API direta, importação e reversão de emissão inválida. Conferência visual dos asteriscos e do bloqueio de salvamento no navegador local.
