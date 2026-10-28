# 💰 Painel Financeiro | Gestão de Renda, Eventos e Gastos

Sistema web para administrar renda, organizar as finanças e agendar trabalhos, criado como meu primeiro projeto na área de tecnologia. Reúne em um só lugar o **fluxo de caixa**, a **agenda de eventos com projeção de faturamento** e o **controle de despesas com leitura de cupons por OCR**.

O projeto roda **100% na nuvem**: páginas e API na **Vercel** e banco de dados **PostgreSQL no Neon**.

🔗 **Demo:** acesso restrito por login (as credenciais não são públicas).
https://projeto-financas-one.vercel.app/login.html

<img width="1968" height="1353" alt="image" src="https://github.com/user-attachments/assets/a90345dd-29f4-4da2-add6-e303e138aed1" />

## 📋 Sobre o projeto

Nasceu da necessidade de ter uma solução visual, intuitiva e prática para o controle financeiro e para a gestão de compromissos profissionais. A ideia é responder, de forma rápida, perguntas como:

- Quanto entrou e quanto saiu do caixa neste mês?
- Quanto ainda tenho a receber de eventos já realizados?
- Quanto vou faturar nos próximos meses com a agenda atual?
- Para onde está indo o meu dinheiro (por categoria de gasto)?

O projeto começou lendo dados do **Google Sheets** (com Google Apps Script) e foi migrado para um banco **PostgreSQL no Neon**, para ter mais robustez, segurança e desempenho.

## ✨ Funcionalidades

**🔐 Acesso protegido**
- Tela de login com usuário e senha
- Todas as páginas e rotas da API só abrem com sessão válida
- Botão de sair em todas as telas

**📊 Visão Geral (fluxo de caixa)**
- Quatro cartões no estilo cartão de banco: **Saldo em Caixa**, **Entradas (pagas)**, **Saídas (pagas)** e **A Receber (pendentes)**
- Valores animados, efeito 3D ao passar o mouse e extrato detalhado ao clicar em cada cartão
- Gráfico de **Entradas x Saídas por mês**
- Histórico geral só com movimentações efetivadas (pagas)
- Filtro por mês

**📅 Eventos e agendamentos**
- Cadastro de evento com cliente, valor, horário e **data única ou período** (início e fim)
- Status: Agendado, Concluído, Pago e Cancelado, alterados com um clique
- Indicadores: próximo evento, valor a projetar, valor a receber, caixa da empresa e volume de trabalhos
- **Alerta de conflito**: sinaliza eventos marcados para o mesmo dia e horário
- Gráficos: projeção mensal de faturamento, eventos por status, top 5 clientes e concentração de receita por status
- Busca por evento ou cliente e filtro por mês

<img width="1607" height="1304" alt="image" src="https://github.com/user-attachments/assets/f97975e4-9f3e-4d5a-9609-ab271053e674" />

**🧾 Gastos com leitura de cupons (OCR)**
- Cadastro manual de despesas ou **foto do cupom/comprovante**
- A leitura (OCR, em português) roda **direto no navegador**, localiza o valor total e preenche o campo; o usuário só confere e confirma
- Categorias (Fornecedores, Combustível, Alimentação, Equipamentos, Impostos e Outros) e status Pago/Pendente
- Indicadores: gasto total, pendente a pagar, despesas pagas e maior categoria
- Gráfico de gastos por categoria, busca e filtro por mês

<img width="2143" height="1396" alt="image" src="https://github.com/user-attachments/assets/1251796d-3829-4388-8afd-672312026e99" />

## 🧠 Regras de negócio

| Indicador | Regra |
|---|---|
| **Saldo em Caixa** | Receitas pagas − despesas pagas |
| **Entradas (pagas)** | Eventos com status *Pago* |
| **Saídas (pagas)** | Despesas com status *Pago* |
| **A Receber** | Eventos ainda não pagos (agendados ou concluídos), sem os cancelados |
| **A Projetar** | Eventos com status *Agendado* |
| **Evento em período** | Aparece em todos os meses que o período atravessa |

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Front-end | HTML5, CSS e JavaScript, com Tailwind CSS |
| Gráficos | Chart.js e chartjs-plugin-datalabels |
| OCR | Tesseract.js (leitura no navegador) |
| API | Funções serverless (Node.js) na Vercel |
| Banco de dados | PostgreSQL no Neon (`@neondatabase/serverless`) |
| Autenticação | Token assinado com HMAC-SHA256 em cookie `HttpOnly`, validado por Middleware da Vercel |
| Hospedagem | Vercel |

## 📁 Estrutura do projeto

```
financas/
├── api/
│   ├── eventos.js        # Listar, criar, atualizar e excluir eventos
│   ├── gastos.js         # Listar, criar, atualizar e excluir gastos
│   ├── login.js          # Valida as credenciais e cria a sessão
│   └── logout.js         # Encerra a sessão
├── financeiro.html       # Visão Geral (fluxo de caixa)
├── index.html            # Eventos e agenda
├── gastos.html           # Gastos e leitor de cupons
├── login.html            # Tela de login
├── middleware.js         # Protege todas as rotas
├── package.json
└── LICENSE
```

## 🗄️ Banco de dados

| Tabela | Campos |
|---|---|
| `eventos` | `id`, `evento`, `cliente`, `data`, `hora`, `status`, `valor` |
| `gastos` | `id`, `data`, `descricao`, `categoria`, `valor`, `status` |

Quando o evento é um período, a data é salva como texto no formato `dd/mm/aaaa a dd/mm/aaaa`. O front-end interpreta tanto esse formato quanto `aaaa-mm-dd` e valores numéricos no padrão brasileiro e internacional.

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/eventos` | Lista todos os eventos |
| `POST` | `/api/eventos` | Executa a ação enviada em `action`: `create`, `update` (status) ou `delete` |
| `GET` | `/api/gastos` | Lista todos os gastos |
| `POST` | `/api/gastos` | Executa a ação enviada em `action`: `create`, `update` (status) ou `delete` |
| `POST` | `/api/login` | Autentica e cria a sessão |
| `POST` | `/api/logout` | Encerra a sessão |

Todas as rotas, exceto login e logout, exigem sessão válida.

## 🔐 Autenticação e segurança

- No login, o servidor gera um token com a **data de expiração** assinado com **HMAC-SHA256** e o grava em um cookie `HttpOnly`, `Secure` e `SameSite=Strict`, com validade de 7 dias.
- O **Middleware da Vercel** roda antes de qualquer página ou rota de API: se o token estiver ausente, adulterado ou expirado, o usuário é redirecionado para o login.
- Usuário, senha, chave de assinatura e conexão com o banco ficam **somente em variáveis de ambiente**. Não existe valor padrão no código: se alguma faltar, o login retorna erro em vez de aceitar uma credencial qualquer.
- As consultas usam *tagged templates* do driver do Neon, que enviam os valores como parâmetros e evitam SQL injection.

## ⚙️ Variáveis de ambiente

Configure em **Vercel > Settings > Environment Variables**:

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão do Neon (PostgreSQL) |
| `AUTH_USER` | Usuário de acesso |
| `AUTH_PASS` | Senha de acesso |
| `AUTH_SECRET` | Chave secreta longa e aleatória para assinar a sessão |

## 🚀 Como publicar

1. Crie um projeto no [Neon](https://neon.tech) e as tabelas `eventos` e `gastos` com os campos acima.
2. Suba o repositório no GitHub.
3. Na [Vercel](https://vercel.com), importe o repositório. Se o projeto estiver dentro de uma pasta, defina o **Root Directory** como `financas`.
4. Cadastre as variáveis de ambiente.
5. Faça o deploy e acesse `/login.html`.

## 🔮 Próximos passos

- [ ] Integração com a **Google Agenda** para notificações automáticas dos eventos e trabalhos do dia
- [ ] Aprimorar o OCR para ler também descrição e data dos comprovantes
- [ ] Novos filtros e relatórios exportáveis
- [ ] Atualizar e excluir registros pelo `id` (hoje usam data e descrição como referência)
- [ ] Limite de tentativas de login


## 👤 Autor

**Gabriel** | Analista de Dados
