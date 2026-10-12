# Integração dos módulos — versão 0.7.0

Comercial, Contabilidade e Financeiro mantêm menus separados e compartilham contratos, parcelas, comissões, distratos e operações. O CRM permanece fora desta entrega.

## Fluxos entregues

- Recebimentos de contratos e pagamentos de comissões na interface encaminham ao Financeiro. A baixa atualiza a origem comercial e o movimento bancário na mesma transação.
- Distratos com devolução geram parcelas a pagar. Sem configuração personalizada, é gerada uma parcela conforme o prazo cadastrado. Pagamento parcial e estorno atualizam o distrato e o banco juntos. Distratos antigos sem cronograma são apontados e permitem programação explícita.
- Contabilidade recebe contratos, provisões e pagamentos de comissões, devoluções, títulos manuais e operações financeiras. A provisão e o pagamento têm origens distintas; pagamento de comissão não duplica a origem financeira. Contas e lote precisam ser escolhidos pelo usuário.
- Alterações de contratos, cancelamento de comissão e edição/cancelamento de títulos contabilizados exigem estorno prévio. Baixas contabilizadas também exigem estorno contábil antes do financeiro. Aditivos que alteram valor exigem revisão das comissões existentes.
- Estorno conserva o lançamento original e cria contrapartida. A origem fica disponível para nova contabilização sem duplicar lançamento ativo.
- Financeiro → Conferência de Integrações apresenta origens pendentes, divergências entre baixa e origem, inconsistências de movimentos, recebimentos/pagamentos antigos sem vínculo bancário e devoluções sem cronograma. Abrir origem leva ao módulo responsável.

## Validação e limites

69 testes automatizados aprovados, incluindo API, persistência, transações, centavos, baixas parciais, estornos e o ciclo contrato → recebimento → contabilização → distrato → devolução. Cancelamento de comissão contabilizada também é protegido nas APIs anteriores.

Registros antigos de recebimento direto continuam compatíveis e são sinalizados; não são criados movimentos bancários presumidos. As pendências de classificação devem ser resolvidas com o plano de contas real. Esta entrega não representa reprodução integral do Sienge nem homologação contábil/fiscal. Não inclui integração bancária externa, autenticação multiusuário ou CRM.
