# 🏇 CRIAHUB - PLANEJAMENTO DE DESENVOLVIMENTO

**Versão:** 1.0.0  
**Data:** 29 de Janeiro de 2026  
**Stack:** Next.js 14+ | React 18+ | Tailwind CSS | Shadcn/ui | Supabase  
**Usuários:** Admin, Criador, Assessor

---

## 📋 ÍNDICE

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Estrutura de Usuários](#3-estrutura-de-usuários)
4. [Checklist de Infraestrutura](#4-checklist-de-infraestrutura)
5. [Checklist do Banco de Dados Supabase](#5-checklist-do-banco-de-dados-supabase)
6. [Checklist de Autenticação](#6-checklist-de-autenticação)
7. [Checklist do Módulo Admin](#7-checklist-do-módulo-admin)
8. [Checklist do Módulo Criador](#8-checklist-do-módulo-criador)
9. [Checklist do Módulo Assessor](#9-checklist-do-módulo-assessor)
10. [Checklist de Componentes Compartilhados](#10-checklist-de-componentes-compartilhados)
11. [Checklist de UI/UX](#11-checklist-de-uiux)
12. [Checklist de Integrações](#12-checklist-de-integrações)
13. [Checklist de Testes](#13-checklist-de-testes)
14. [Checklist de Deploy](#14-checklist-de-deploy)
15. [Cronograma](#15-cronograma)

---

## 1. VISÃO GERAL DO PROJETO

### 1.1 Descrição

O **CriaHub** é uma plataforma SaaS para gestão completa de haras de cavalos **Mangalarga Marchador**. O sistema oferece:

- Gestão de plantel de animais
- Controle reprodutivo completo
- Gestão financeira
- Agenda e eventos
- Relatórios e documentos
- Importação de dados ABCCMM

### 1.2 Usuários do Sistema

| Perfil | Descrição | Acesso |
|--------|-----------|--------|
| **Admin** | Administrador da plataforma CriaHub | Total sobre a plataforma |
| **Criador** | Dono do haras/cliente | Total sobre seu haras |
| **Assessor** | Auditor administrativo do haras | Importação ABCCMM, validação de pendências, ordens de serviço |

### 1.3 Objetivos Técnicos

- ✅ Aplicação web responsiva (mobile-first)
- ✅ Backend completo com Supabase
- ✅ Autenticação segura
- ✅ Design system consistente com Shadcn/ui
- ✅ Performance otimizada

---

## 2. STACK TECNOLÓGICA

### 2.1 Frontend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Next.js** | 14+ | Framework React com App Router |
| **React** | 18+ | Biblioteca UI |
| **TypeScript** | 5+ | Tipagem estática |
| **Tailwind CSS** | 3.4+ | Estilização utility-first |
| **Shadcn/ui** | latest | Componentes UI |
| **Lucide React** | latest | Ícones |
| **React Hook Form** | 7+ | Formulários |
| **Zod** | latest | Validação de schemas |
| **TanStack Query** | 5+ | Gerenciamento de estado servidor |
| **Recharts** | 2+ | Gráficos |
| **Sonner** | 2+ | Toasts/Notificações |

### 2.2 Backend (Supabase)

| Serviço | Uso |
|---------|-----|
| **PostgreSQL** | Banco de dados relacional |
| **Auth** | Autenticação e autorização |
| **Storage** | Armazenamento de arquivos |
| **Edge Functions** | Lógica backend serverless |
| **Realtime** | Atualizações em tempo real |

### 2.3 Estrutura de Pastas (Next.js App Router)

```
src/
├── app/                        # App Router (páginas)
│   ├── (auth)/                 # Rotas de autenticação
│   │   ├── login/
│   │   ├── forgot-password/
│   │   └── layout.tsx
│   ├── (dashboard)/            # Rotas protegidas
│   │   ├── admin/              # Módulo Admin
│   │   ├── criador/            # Módulo Criador
│   │   ├── assessor/           # Módulo Assessor
│   │   └── layout.tsx
│   ├── api/                    # API Routes
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/                  # Componentes Admin
│   ├── breeder/                # Componentes Criador
│   ├── advisor/                # Componentes Assessor
│   ├── shared/                 # Componentes compartilhados
│   └── ui/                     # Componentes Shadcn
├── lib/
│   ├── supabase/               # Cliente e tipos Supabase
│   ├── utils.ts                # Utilitários
│   └── validations/            # Schemas Zod
├── hooks/                      # Hooks customizados
├── services/                   # Serviços de API
├── types/                      # Tipos TypeScript
├── contexts/                   # Contextos React
└── styles/                     # Estilos globais
```

---

## 3. ESTRUTURA DE USUÁRIOS

### 3.1 Hierarquia

```
┌─────────────────────────────────────┐
│  ADMIN (Equipe CriaHub)             │
│  - Gerencia plataforma              │
│  - Gerencia assinaturas             │
│  - Monitora uso                     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  CRIADOR (Dono do Haras)            │
│  - Gerencia seu haras               │
│  - Controle total                   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  ASSESSOR (Auditor Administrativo)  │
│  - Importação ABCCMM                │
│  - Validação de pendências          │
│  - Ordens de serviço                │
└─────────────────────────────────────┘
```

### 3.2 Permissões por Perfil

| Funcionalidade | Admin | Criador | Assessor |
|----------------|-------|---------|----------|
| Gerenciar plataforma | ✅ | ❌ | ❌ |
| Gerenciar assinaturas | ✅ | ❌ | ❌ |
| Ver métricas globais | ✅ | ❌ | ❌ |
| Cadastrar animais | ❌ | ✅ | ❌ |
| Editar animais | ❌ | ✅ | ❌ |
| Visualizar plantel | ❌ | ✅ | ✅ (leitura) |
| Importar ABCCMM | ❌ | ✅ | ✅ |
| Registrar coberturas | ❌ | ✅ | ❌ |
| Gerenciar reprodução | ❌ | ✅ | ✅ (leitura) |
| Financeiro completo | ❌ | ✅ | ❌ |
| Ordens de serviço | ❌ | ✅ | ✅ |
| Validar pendências | ❌ | ❌ | ✅ |
| Gerenciar equipe | ❌ | ✅ | ✅ |
| Configurações haras | ❌ | ✅ | ❌ |
| Relatórios | ❌ | ✅ | ✅ (limitado) |

---

## 4. CHECKLIST DE INFRAESTRUTURA

### 4.1 Setup Inicial do Projeto

- [ ] **Criar projeto Next.js 14+ com App Router**
  - [ ] `npx create-next-app@latest criahub-web --typescript --tailwind --eslint --app --src-dir`
  - [ ] Configurar `next.config.js`
  - [ ] Configurar `tsconfig.json`

- [ ] **Configurar Tailwind CSS**
  - [ ] Configurar `tailwind.config.ts`
  - [ ] Definir cores personalizadas do CriaHub
  - [ ] Configurar dark mode

- [ ] **Instalar e configurar Shadcn/ui**
  - [ ] `npx shadcn@latest init`
  - [ ] Configurar `components.json`
  - [ ] Instalar componentes base (button, card, input, etc.)

- [ ] **Configurar Supabase Client**
  - [ ] Instalar `@supabase/supabase-js`
  - [ ] Instalar `@supabase/ssr`
  - [ ] Criar cliente para Server Components
  - [ ] Criar cliente para Client Components
  - [ ] Configurar variáveis de ambiente

- [ ] **Configurar ESLint e Prettier**
  - [ ] Configurar regras de linting
  - [ ] Configurar formatação automática

- [ ] **Configurar estrutura de pastas**
  - [ ] Criar estrutura conforme seção 2.3
  - [ ] Configurar path aliases

### 4.2 Variáveis de Ambiente

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Opcional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 5. CHECKLIST DO BANCO DE DADOS SUPABASE

### 5.1 Tabelas Principais

- [ ] **profiles** (extensão de auth.users)
  - [ ] id (UUID, FK auth.users)
  - [ ] role (enum: admin, breeder, advisor)
  - [ ] full_name
  - [ ] avatar_url
  - [ ] phone
  - [ ] cpf_cnpj
  - [ ] created_at
  - [ ] updated_at

- [ ] **haras**
  - [ ] id (UUID)
  - [ ] name
  - [ ] owner_id (FK profiles)
  - [ ] address (JSONB)
  - [ ] logo_url
  - [ ] phone
  - [ ] email
  - [ ] website
  - [ ] description
  - [ ] subscription_plan
  - [ ] subscription_status
  - [ ] subscription_expires_at
  - [ ] created_at
  - [ ] updated_at

- [ ] **haras_members** (relacionamento usuários-haras)
  - [ ] id (UUID)
  - [ ] haras_id (FK haras)
  - [ ] user_id (FK profiles)
  - [ ] role (enum: owner, advisor)
  - [ ] created_at

- [ ] **animals**
  - [ ] id (UUID)
  - [ ] haras_id (FK haras)
  - [ ] name
  - [ ] registry_abccmm (UNIQUE)
  - [ ] chip_rfid
  - [ ] marca
  - [ ] sex (enum: Macho, Fêmea)
  - [ ] birth_date
  - [ ] haras_origem
  - [ ] category (enum: Potro, Reprodutor, Reprodutora, Aposentado, Em Treinamento)
  - [ ] pelagem
  - [ ] altura
  - [ ] peso
  - [ ] status_atividade (enum: Ativo, Vendido, Falecido, Transferido)
  - [ ] status_atual
  - [ ] localizacao
  - [ ] tipo_reprodutivo
  - [ ] ativo_reproducao
  - [ ] father_id (FK animals, nullable)
  - [ ] mother_id (FK animals, nullable)
  - [ ] images (JSONB)
  - [ ] metadata (JSONB)
  - [ ] created_at
  - [ ] updated_at

- [ ] **reproductive_events** (coberturas, IAs)
  - [ ] id (UUID)
  - [ ] animal_id (FK animals)
  - [ ] type (enum: cobertura, ia, ovulacao)
  - [ ] date
  - [ ] partner_id (FK animals)
  - [ ] veterinarian
  - [ ] semen_type (enum: fresco, refrigerado, congelado)
  - [ ] details (JSONB)
  - [ ] status
  - [ ] created_by (FK profiles)
  - [ ] created_at

- [ ] **pregnancies** (gestações)
  - [ ] id (UUID)
  - [ ] mare_id (FK animals)
  - [ ] stallion_id (FK animals)
  - [ ] reproductive_event_id (FK reproductive_events)
  - [ ] coverage_date
  - [ ] confirmation_date
  - [ ] estimated_birth_date
  - [ ] confirmed
  - [ ] status (enum: ativa, finalizada, abortada)
  - [ ] birth_id (FK animals, nullable)
  - [ ] veterinarian
  - [ ] notes
  - [ ] created_at
  - [ ] updated_at

- [ ] **ovules** (óvulos coletados)
  - [ ] id (UUID)
  - [ ] donor_id (FK animals)
  - [ ] collection_date
  - [ ] quantity
  - [ ] quality
  - [ ] destination (enum: TE, criopreservacao, descartado)
  - [ ] veterinarian
  - [ ] notes
  - [ ] created_by (FK profiles)
  - [ ] created_at

- [ ] **embryos** (embriões)
  - [ ] id (UUID)
  - [ ] donor_id (FK animals)
  - [ ] stallion_id (FK animals)
  - [ ] production_date
  - [ ] quantity
  - [ ] quality_grade
  - [ ] status (enum: congelado, transferido, descartado)
  - [ ] recipient_id (FK animals, nullable)
  - [ ] veterinarian
  - [ ] notes
  - [ ] created_by (FK profiles)
  - [ ] created_at

- [ ] **veterinary_procedures** (procedimentos gerais)
  - [ ] id (UUID)
  - [ ] animal_id (FK animals)
  - [ ] type (enum: vacina, exame, consulta, cirurgia, outro)
  - [ ] date
  - [ ] veterinarian
  - [ ] description
  - [ ] cost
  - [ ] attachments (JSONB)
  - [ ] created_by (FK profiles)
  - [ ] created_at

- [ ] **vaccines** (vacinas específicas)
  - [ ] id (UUID)
  - [ ] animal_id (FK animals)
  - [ ] name
  - [ ] date
  - [ ] veterinarian
  - [ ] batch
  - [ ] expiry_date
  - [ ] next_dose_date
  - [ ] observations
  - [ ] created_at

- [ ] **exams** (exames)
  - [ ] id (UUID)
  - [ ] animal_id (FK animals)
  - [ ] type
  - [ ] date
  - [ ] veterinarian_lab
  - [ ] result (enum: normal, alterado, critico)
  - [ ] attachments (JSONB)
  - [ ] observations
  - [ ] recommendations
  - [ ] created_at

- [ ] **transactions** (financeiro)
  - [ ] id (UUID)
  - [ ] haras_id (FK haras)
  - [ ] type (enum: receita, despesa)
  - [ ] category
  - [ ] description
  - [ ] amount
  - [ ] date
  - [ ] payment_method
  - [ ] status (enum: pendente, pago, recebido, agendado)
  - [ ] animal_id (FK animals, nullable)
  - [ ] supplier
  - [ ] attachments (JSONB)
  - [ ] observations
  - [ ] created_by (FK profiles)
  - [ ] created_at

- [ ] **service_orders** (ordens de serviço)
  - [ ] id (UUID)
  - [ ] haras_id (FK haras)
  - [ ] number (UNIQUE, gerado)
  - [ ] type (enum: veterinario, ferrageamento, alimentacao, manutencao, transporte, outro)
  - [ ] description
  - [ ] estimated_value
  - [ ] final_value
  - [ ] supplier (JSONB)
  - [ ] status (enum: aberta, em_andamento, concluida, cancelada)
  - [ ] scheduled_date
  - [ ] completion_date
  - [ ] animals (JSONB - array de IDs)
  - [ ] attachments (JSONB)
  - [ ] notes
  - [ ] created_by (FK profiles)
  - [ ] created_at
  - [ ] updated_at

- [ ] **pending_validations** (pendências do campo)
  - [ ] id (UUID)
  - [ ] haras_id (FK haras)
  - [ ] type (enum: nascimento, ocorrencia)
  - [ ] data (JSONB)
  - [ ] photos (JSONB)
  - [ ] status (enum: pendente, validado, rejeitado, correcao_solicitada)
  - [ ] created_by (FK profiles)
  - [ ] validated_by (FK profiles, nullable)
  - [ ] validated_at
  - [ ] validation_notes
  - [ ] created_at

- [ ] **events** (agenda/eventos)
  - [ ] id (UUID)
  - [ ] haras_id (FK haras)
  - [ ] type (enum: servico, evento_publico)
  - [ ] title
  - [ ] description
  - [ ] date
  - [ ] time_start
  - [ ] time_end
  - [ ] location
  - [ ] animals (JSONB)
  - [ ] responsible
  - [ ] status (enum: pendente, concluido, cancelado)
  - [ ] created_by (FK profiles)
  - [ ] created_at

- [ ] **documents** (documentos)
  - [ ] id (UUID)
  - [ ] haras_id (FK haras)
  - [ ] animal_id (FK animals, nullable)
  - [ ] type (enum: GIA, certificado, laudo, contrato, nota_fiscal, outro)
  - [ ] name
  - [ ] url
  - [ ] status (enum: pendente, assinado, vencido)
  - [ ] expiry_date
  - [ ] created_by (FK profiles)
  - [ ] created_at

- [ ] **animal_awards** (premiações)
  - [ ] id (UUID)
  - [ ] animal_id (FK animals)
  - [ ] type (enum: exposicao, leilao, premiacao)
  - [ ] event_name
  - [ ] date
  - [ ] category
  - [ ] position
  - [ ] score
  - [ ] certificate_url
  - [ ] value (para leilões)
  - [ ] notes
  - [ ] created_at

- [ ] **animal_location_history** (histórico de localização)
  - [ ] id (UUID)
  - [ ] animal_id (FK animals)
  - [ ] previous_location
  - [ ] new_location
  - [ ] reason
  - [ ] changed_by (FK profiles)
  - [ ] changed_at

- [ ] **notifications** (notificações)
  - [ ] id (UUID)
  - [ ] user_id (FK profiles)
  - [ ] category (enum: saude, financeiro, servicos, reproducao, geral)
  - [ ] priority (enum: alta, media, baixa)
  - [ ] title
  - [ ] message
  - [ ] link
  - [ ] read
  - [ ] created_at

- [ ] **notification_preferences** (preferências)
  - [ ] id (UUID)
  - [ ] user_id (FK profiles, UNIQUE)
  - [ ] push_enabled
  - [ ] email_enabled
  - [ ] sound_enabled
  - [ ] quiet_hours_enabled
  - [ ] quiet_hours_start
  - [ ] quiet_hours_end
  - [ ] critical_alerts_always
  - [ ] email_summary_frequency (enum: daily, weekly, monthly, never)
  - [ ] categories_settings (JSONB)

- [ ] **import_logs** (logs de importação ABCCMM)
  - [ ] id (UUID)
  - [ ] haras_id (FK haras)
  - [ ] file_name
  - [ ] total_rows
  - [ ] success_count
  - [ ] error_count
  - [ ] duplicate_count
  - [ ] details (JSONB)
  - [ ] created_by (FK profiles)
  - [ ] created_at

- [ ] **subscriptions** (assinaturas - para Admin)
  - [ ] id (UUID)
  - [ ] haras_id (FK haras)
  - [ ] plan (enum: basic, professional, premium)
  - [ ] status (enum: active, trial, expired, cancelled)
  - [ ] start_date
  - [ ] end_date
  - [ ] trial_ends_at
  - [ ] amount
  - [ ] payment_method
  - [ ] stripe_subscription_id (para futura integração)
  - [ ] created_at
  - [ ] updated_at

### 5.2 Views e Functions

- [ ] **view_animal_with_parents** (animal com genealogia)
- [ ] **view_pregnancy_details** (gestação com detalhes)
- [ ] **view_financial_summary** (resumo financeiro por haras)
- [ ] **fn_generate_os_number** (gerar número de OS)
- [ ] **fn_calculate_gestation_days** (calcular dias de gestação)
- [ ] **fn_get_animal_offspring_count** (contar filhos)

### 5.3 Storage Buckets

- [ ] **avatars** - Fotos de perfil de usuários
- [ ] **haras-logos** - Logos dos haras
- [ ] **animal-images** - Fotos de animais
- [ ] **documents** - PDFs, contratos, GIAs
- [ ] **attachments** - Anexos diversos

### 5.4 Triggers e Automações

- [ ] **trigger_update_updated_at** - Atualizar updated_at automaticamente
- [ ] **trigger_create_notification** - Criar notificação em eventos importantes
- [ ] **trigger_update_animal_status** - Atualizar status do animal baseado em eventos

---

## 6. CHECKLIST DE AUTENTICAÇÃO

### 6.1 Supabase Auth

- [ ] **Configurar provedores**
  - [ ] Email/Senha
  - [ ] (Opcional) Google OAuth
  - [ ] (Opcional) Apple OAuth

- [ ] **Configurar templates de email**
  - [ ] Email de confirmação
  - [ ] Email de recuperação de senha
  - [ ] Email de convite

### 6.2 Páginas de Autenticação

- [ ] **Página de Login** (`/login`)
  - [ ] Formulário de email/senha
  - [ ] Validação com Zod
  - [ ] Mensagens de erro
  - [ ] Opção "Lembrar de mim"
  - [ ] Link "Esqueci minha senha"
  - [ ] Design responsivo
  - [ ] Dark/Light mode

- [ ] **Página de Recuperação de Senha** (`/forgot-password`)
  - [ ] Formulário de email
  - [ ] Validação
  - [ ] Feedback de envio
  - [ ] Link para voltar ao login

- [ ] **Página de Redefinição de Senha** (`/reset-password`)
  - [ ] Formulário de nova senha
  - [ ] Confirmação de senha
  - [ ] Validação de força da senha
  - [ ] Redirect após sucesso

### 6.3 Middleware e Proteção de Rotas

- [ ] **Middleware de autenticação**
  - [ ] Verificar sessão em rotas protegidas
  - [ ] Redirect para login se não autenticado
  - [ ] Verificar role do usuário

- [ ] **Guards por perfil**
  - [ ] Admin só acessa `/admin/*`
  - [ ] Criador só acessa `/criador/*`
  - [ ] Assessor só acessa `/assessor/*`
  - [ ] Redirect para dashboard correto

### 6.4 Hooks e Contextos

- [ ] **useAuth hook**
  - [ ] user
  - [ ] session
  - [ ] isLoading
  - [ ] signIn
  - [ ] signOut
  - [ ] resetPassword

- [ ] **AuthContext**
  - [ ] Prover dados de auth globalmente
  - [ ] Gerenciar estado da sessão

---

## 7. CHECKLIST DO MÓDULO ADMIN

### 7.1 Layout e Navegação

- [ ] **Layout Admin** (`/admin/layout.tsx`)
  - [ ] Sidebar com menu
  - [ ] Header com perfil
  - [ ] Breadcrumbs
  - [ ] Responsivo

- [ ] **Menu de navegação**
  - [ ] Dashboard
  - [ ] Assinaturas
  - [ ] Uso da Plataforma
  - [ ] Alertas Críticos
  - [ ] Configurações
  - [ ] Ajuda

### 7.2 Dashboard Admin

- [ ] **Página Dashboard** (`/admin/page.tsx`)
  - [ ] KPIs principais
    - [ ] Total de haras ativos
    - [ ] Receita mensal (MRR)
    - [ ] Novos clientes (mês)
    - [ ] Taxa de renovação
  - [ ] Gráfico de crescimento de usuários
  - [ ] Gráfico de distribuição de planos
  - [ ] Alertas recentes
  - [ ] Atividade recente

### 7.3 Gerenciamento de Assinaturas

- [ ] **Página de Assinaturas** (`/admin/assinaturas/page.tsx`)
  - [ ] Lista de todos os haras/clientes
  - [ ] Filtros (status, plano, busca)
  - [ ] Ordenação
  - [ ] Paginação

- [ ] **Card de cliente**
  - [ ] Nome do haras
  - [ ] Dono
  - [ ] Plano atual
  - [ ] Status (ativo, trial, vencido, cancelado)
  - [ ] Data de vencimento
  - [ ] Ações

- [ ] **Modal de detalhes do cliente**
  - [ ] Informações completas
  - [ ] Histórico de pagamentos
  - [ ] Uso (animais, usuários)
  - [ ] Alterar plano
  - [ ] Cancelar assinatura

- [ ] **Modal de gerenciar planos**
  - [ ] Criar/editar planos
  - [ ] Definir recursos por plano
  - [ ] Definir limites

### 7.4 Uso da Plataforma

- [ ] **Página de Métricas** (`/admin/uso/page.tsx`)
  - [ ] KPIs
    - [ ] Total de usuários ativos
    - [ ] Total de animais cadastrados
    - [ ] Usuários ativos hoje
    - [ ] Armazenamento usado
  - [ ] Gráfico de crescimento de usuários (linha)
  - [ ] Gráfico de distribuição de planos (pizza)
  - [ ] Gráfico de uso por funcionalidade (barras)
  - [ ] Top haras por uso

### 7.5 Alertas Críticos

- [ ] **Página de Alertas** (`/admin/alertas/page.tsx`)
  - [ ] Lista de alertas
  - [ ] Filtros (tipo, busca)
  - [ ] Prioridade visual

- [ ] **Tipos de alertas**
  - [ ] Sistema (servidor, banco)
  - [ ] Pagamento (faturas vencidas)
  - [ ] Suporte (tickets urgentes)
  - [ ] Dados (inconsistências)

- [ ] **Ações por alerta**
  - [ ] Marcar como resolvido
  - [ ] Ver detalhes
  - [ ] Tomar ação

### 7.6 Configurações Admin

- [ ] **Página de Configurações** (`/admin/configuracoes/page.tsx`)
  - [ ] Perfil do administrador
  - [ ] Alterar senha
  - [ ] Logs de conexão ABCCMM
  - [ ] Configurações do sistema
  - [ ] Versão da plataforma

### 7.7 Ajuda Admin

- [ ] **Página de Ajuda** (`/admin/ajuda/page.tsx`)
  - [ ] FAQ para administradores
  - [ ] Documentação técnica
  - [ ] Guias de troubleshooting
  - [ ] Contato de suporte técnico

---

## 8. CHECKLIST DO MÓDULO CRIADOR

### 8.1 Layout e Navegação

- [ ] **Layout Criador** (`/criador/layout.tsx`)
  - [ ] Sidebar com menu
  - [ ] Header com perfil e notificações
  - [ ] Breadcrumbs
  - [ ] Responsivo (mobile-first)

- [ ] **Menu de navegação**
  - [ ] Dashboard
  - [ ] Plantel
  - [ ] Reprodução
  - [ ] Financeiro
  - [ ] Agenda
  - [ ] Relatórios
  - [ ] Configurações
  - [ ] Ajuda

### 8.2 Dashboard Criador

- [ ] **Página Dashboard** (`/criador/page.tsx`)
  - [ ] Ações rápidas
    - [ ] Cadastrar Animal
    - [ ] Agendar Evento
    - [ ] Novo Colaborador
  - [ ] KPIs principais
    - [ ] Total de Animais
    - [ ] Gestações Ativas
    - [ ] Nascimentos (mês)
    - [ ] Alertas Importantes
  - [ ] Gráfico de crescimento do plantel
  - [ ] Gráfico de distribuição por categoria
  - [ ] Gráfico de distribuição por pelagem
  - [ ] Próximos eventos
  - [ ] Alertas importantes

### 8.3 Plantel

- [ ] **Página de Plantel** (`/criador/plantel/page.tsx`)
  - [ ] Modos de visualização (grid/lista)
  - [ ] Busca por nome, registro, chip, marca
  - [ ] Filtros avançados
    - [ ] Sexo
    - [ ] Status
    - [ ] Categoria
    - [ ] Idade
    - [ ] Pelagem
    - [ ] Localização
    - [ ] Filhos
    - [ ] Premiações
  - [ ] Botão "Cadastrar Animal"
  - [ ] Botão "Importar ABCCMM"
  - [ ] Paginação/infinite scroll

- [ ] **Card de Animal (Grid)**
  - [ ] Foto do animal
  - [ ] Nome
  - [ ] Registro ABCCMM
  - [ ] Idade
  - [ ] Status (badge colorido)
  - [ ] Badges (filhos, premiações, vídeos)
  - [ ] Menu de ações rápidas

- [ ] **Linha de Animal (Lista)**
  - [ ] Checkbox para seleção
  - [ ] Foto miniatura
  - [ ] Nome
  - [ ] Registro
  - [ ] Sexo
  - [ ] Idade
  - [ ] Categoria
  - [ ] Status
  - [ ] Localização
  - [ ] Ações

### 8.4 Detalhes do Animal

- [ ] **Página de Detalhes** (`/criador/plantel/[id]/page.tsx`)
  - [ ] Header com foto, nome, registro
  - [ ] Botões de ação (Editar, Excluir)
  - [ ] Navegação por tabs

- [ ] **Tab: Visão Geral**
  - [ ] Informações básicas completas
  - [ ] Galeria de fotos
  - [ ] Status atual
  - [ ] Localização
  - [ ] Informações reprodutivas
  - [ ] Contagem de filhos
  - [ ] Premiações

- [ ] **Tab: Saúde**
  - [ ] Dashboard de saúde (KPIs, gráficos)
  - [ ] Histórico veterinário (lista)
  - [ ] Calendário de vacinas
  - [ ] Histórico de exames
  - [ ] Botões para registrar (vacina, exame, procedimento)

- [ ] **Tab: Reprodução**
  - [ ] Histórico de coberturas
  - [ ] Histórico de inseminações
  - [ ] Gestações (ativas e históricas)
  - [ ] Óvulos coletados (se fêmea)
  - [ ] Embriões produzidos
  - [ ] Botões para registrar eventos

- [ ] **Tab: Genealogia**
  - [ ] Árvore genealógica visual
  - [ ] 3 gerações (pais, avós, bisavós)
  - [ ] Cards clicáveis para navegação
  - [ ] Informações por ancestral

- [ ] **Tab: Documentos**
  - [ ] Lista de documentos
  - [ ] Filtros por tipo
  - [ ] Upload de novo documento
  - [ ] Download
  - [ ] Gerar contrato

- [ ] **Tab: Localização**
  - [ ] Localização atual
  - [ ] Tipo de serviço (se aplicável)
  - [ ] Histórico de localizações
  - [ ] Alterar localização

- [ ] **Tab: Vídeos**
  - [ ] Lista de vídeos
  - [ ] Player integrado
  - [ ] Upload de vídeo
  - [ ] Metadados (título, descrição)

- [ ] **Tab: Premiações**
  - [ ] Exposições
  - [ ] Leilões
  - [ ] Premiações gerais
  - [ ] Registrar participação

- [ ] **Tab: Histórico**
  - [ ] Timeline de todos os eventos
  - [ ] Filtros por tipo
  - [ ] Busca

### 8.5 Cadastro de Animal

- [ ] **Página de Cadastro** (`/criador/plantel/novo/page.tsx`)
  - [ ] Formulário multi-step ou sections
  - [ ] Seção: Informações Básicas
  - [ ] Seção: Características
  - [ ] Seção: Genealogia (busca de pai/mãe)
  - [ ] Seção: Localização
  - [ ] Seção: Reprodução
  - [ ] Seção: Fotos (upload múltiplo)
  - [ ] Validação com Zod
  - [ ] Preview antes de salvar

### 8.6 Edição de Animal

- [ ] **Página de Edição** (`/criador/plantel/[id]/editar/page.tsx`)
  - [ ] Formulário pré-preenchido
  - [ ] Histórico de alterações
  - [ ] Confirmação de mudanças críticas

### 8.7 Módulo Reprodução

- [ ] **Página de Reprodução** (`/criador/reproducao/page.tsx`)
  - [ ] Tabs: Automação, Gestações

- [ ] **Tab: Automação de Reprodução**
  - [ ] Seção: Protocolos ativos
  - [ ] Seção: Protocolos personalizados
  - [ ] Seção: Calendário de protocolos
  - [ ] Seção: Biblioteca de templates
  - [ ] Botão: Aplicar protocolo

- [ ] **Tab: Gestações**
  - [ ] Lista de gestações ativas
  - [ ] Filtros (status, período, veterinário)
  - [ ] KPIs (total, próximas ao parto)
  - [ ] Alertas de partos próximos

- [ ] **Modais de Reprodução**
  - [ ] Registrar Cobertura
  - [ ] Registrar Inseminação
  - [ ] Registrar Óvulos
  - [ ] Registrar Embrião
  - [ ] Confirmar Gestação
  - [ ] Criar Protocolo
  - [ ] Aplicar Protocolo

### 8.8 Módulo Financeiro

- [ ] **Página Financeiro** (`/criador/financeiro/page.tsx`)
  - [ ] Tabs: Dashboard, Receitas, Despesas

- [ ] **Tab: Dashboard Financeiro**
  - [ ] KPIs (Saldo, Receitas, Despesas, Balanço)
  - [ ] Gráfico de Fluxo de Caixa
  - [ ] Gráfico de Receitas por Categoria
  - [ ] Gráfico de Despesas por Categoria
  - [ ] Últimas transações

- [ ] **Tab: Receitas**
  - [ ] Lista de receitas
  - [ ] Filtros (categoria, período, status)
  - [ ] Adicionar receita
  - [ ] Editar/Excluir

- [ ] **Tab: Despesas**
  - [ ] Lista de despesas
  - [ ] Filtros (categoria, período, status)
  - [ ] Adicionar despesa
  - [ ] Editar/Excluir

- [ ] **Modal de Transação**
  - [ ] Tipo (Receita/Despesa)
  - [ ] Categoria
  - [ ] Descrição
  - [ ] Valor
  - [ ] Data
  - [ ] Forma de pagamento
  - [ ] Status
  - [ ] Animal relacionado (opcional)
  - [ ] Anexos
  - [ ] Observações

### 8.9 Módulo Agenda

- [ ] **Página de Agenda** (`/criador/agenda/page.tsx`)
  - [ ] Tabs: Serviços Operacionais, Eventos Públicos

- [ ] **Tab: Serviços Operacionais**
  - [ ] Calendário mensal
  - [ ] Lista de serviços
  - [ ] Filtros (tipo, status, responsável)
  - [ ] Adicionar serviço

- [ ] **Tab: Eventos Públicos**
  - [ ] Lista de eventos
  - [ ] Adicionar evento
  - [ ] Filtros

- [ ] **Modais de Agenda**
  - [ ] Adicionar Serviço
  - [ ] Adicionar Evento Público
  - [ ] Editar Evento
  - [ ] Visualizar Detalhes

### 8.10 Módulo Relatórios

- [ ] **Página de Relatórios** (`/criador/relatorios/page.tsx`)
  - [ ] Cards para cada tipo de relatório
  - [ ] Acesso rápido

- [ ] **Modais de Relatório**
  - [ ] Relatório Individual de Animal
    - [ ] Seleção de animal
    - [ ] Formato de exportação
  - [ ] Relatório de Plantel
    - [ ] Filtros (categoria, localização, status)
    - [ ] Formato de exportação
  - [ ] Relatório Financeiro
    - [ ] Período
    - [ ] Tipo (Fluxo, DRE, Detalhado)
    - [ ] Formato de exportação
  - [ ] Relatório de Saúde
    - [ ] Animal ou todo plantel
    - [ ] Período
    - [ ] Formato de exportação

### 8.11 Configurações Criador

- [ ] **Página de Configurações** (`/criador/configuracoes/page.tsx`)
  - [ ] Tabs: Perfil, Haras, Assinatura, Equipe, Notificações, Preferências, Integrações, Segurança

- [ ] **Tab: Perfil**
  - [ ] Nome, email, telefone
  - [ ] CPF/CNPJ
  - [ ] Avatar
  - [ ] Alterar senha

- [ ] **Tab: Haras**
  - [ ] Nome do haras
  - [ ] Endereço
  - [ ] Contato
  - [ ] Logo
  - [ ] Descrição

- [ ] **Tab: Assinatura**
  - [ ] Plano atual
  - [ ] Valor e vencimento
  - [ ] Recursos incluídos
  - [ ] Histórico de faturas
  - [ ] Alterar forma de pagamento
  - [ ] Cancelar assinatura

- [ ] **Tab: Equipe**
  - [ ] Lista de colaboradores
  - [ ] Adicionar colaborador
  - [ ] Editar permissões
  - [ ] Remover colaborador

- [ ] **Tab: Notificações**
  - [ ] Canais (Push, Email)
  - [ ] Horário de silêncio
  - [ ] Alertas críticos
  - [ ] Resumo por email
  - [ ] Categorias personalizáveis

- [ ] **Tab: Preferências**
  - [ ] Tema (Light/Dark/Auto)
  - [ ] Idioma
  - [ ] Formato de data
  - [ ] Formato de moeda
  - [ ] Fuso horário

- [ ] **Tab: Integrações**
  - [ ] ABCCMM (status, sync)
  - [ ] (Futuro) WhatsApp Business
  - [ ] (Futuro) Google Calendar

- [ ] **Tab: Segurança**
  - [ ] Alterar senha
  - [ ] (Futuro) 2FA
  - [ ] Dispositivos conectados
  - [ ] Logs de acesso

### 8.12 Ajuda Criador

- [ ] **Página de Ajuda** (`/criador/ajuda/page.tsx`)
  - [ ] FAQ por categoria
  - [ ] Tutoriais em vídeo
  - [ ] Documentação
  - [ ] Contato de suporte
  - [ ] Novidades (changelog)

---

## 9. CHECKLIST DO MÓDULO ASSESSOR

### 9.1 Layout e Navegação

- [ ] **Layout Assessor** (`/assessor/layout.tsx`)
  - [ ] Sidebar com menu
  - [ ] Header com perfil e notificações
  - [ ] Destaque para pendências
  - [ ] Responsivo

- [ ] **Menu de navegação**
  - [ ] Dashboard
  - [ ] Plantel
  - [ ] Reprodução
  - [ ] Financeiro (Ordens de Serviço)
  - [ ] Tarefas
  - [ ] Equipe
  - [ ] Agenda
  - [ ] Documentos
  - [ ] Configurações
  - [ ] Ajuda

### 9.2 Dashboard Assessor

- [ ] **Página Dashboard** (`/assessor/page.tsx`)
  - [ ] **Alerta de Pendências (destacado)**
    - [ ] Card laranja/vermelho
    - [ ] Total de pendências
    - [ ] Breakdown (nascimentos, ocorrências)
    - [ ] Botão "Validar Pendências Agora"
  - [ ] Atalhos rápidos
    - [ ] Importar Planilha ABCCMM
    - [ ] Nova Ordem de Serviço
    - [ ] Gerenciar Equipe
    - [ ] Documentos Pendentes
  - [ ] Gráficos de status

### 9.3 Plantel (Modo Leitura + Importação)

- [ ] **Página de Plantel** (`/assessor/plantel/page.tsx`)
  - [ ] Visualização completa (grid/lista)
  - [ ] Filtros e busca
  - [ ] **Botão Principal: "Importar da ABCCMM"**
  - [ ] Ver detalhes (sem edição)

- [ ] **Modal de Importação ABCCMM**
  - [ ] Upload de arquivo Excel
  - [ ] Validação de formato
  - [ ] Pré-visualização de dados
  - [ ] Mapeamento de colunas
  - [ ] Validação de duplicidades
  - [ ] Relatório de validação
  - [ ] Confirmação
  - [ ] Log de resultados
  - [ ] Download do log

- [ ] **Página de Detalhes do Animal** (`/assessor/plantel/[id]/page.tsx`)
  - [ ] Todas as informações (somente leitura)
  - [ ] Sem botões de edição
  - [ ] Sem botões de ação reprodutiva

### 9.4 Validação de Pendências (FUNÇÃO PRINCIPAL)

- [ ] **Página de Pendências** (`/assessor/pendencias/page.tsx`)
  - [ ] Lista de pendências agrupadas por tipo
  - [ ] Filtros (tipo, período, animal)
  - [ ] Estatísticas

- [ ] **Card de Nascimento Pendente**
  - [ ] Data do registro
  - [ ] Nome provisório
  - [ ] Mãe/Pai
  - [ ] Sexo/Pelagem
  - [ ] Observações do campo
  - [ ] Foto
  - [ ] Status
  - [ ] Ações: Validar, Solicitar Correção, Rejeitar

- [ ] **Card de Ocorrência Pendente**
  - [ ] Data/Hora
  - [ ] Tipo de ocorrência
  - [ ] Animal
  - [ ] Descrição
  - [ ] Gravidade
  - [ ] Foto/Vídeo
  - [ ] Ações: Dar Tratativa, Resolver, Escalar

- [ ] **Modal de Validação de Nascimento**
  - [ ] Confirmar/corrigir dados
  - [ ] Adicionar informações extras
  - [ ] Registro provisório
  - [ ] Vincular ao plantel

- [ ] **Modal de Tratativa de Ocorrência**
  - [ ] Atribuir responsável
  - [ ] Criar ordem de serviço
  - [ ] Agendar atendimento
  - [ ] Observações

### 9.5 Reprodução (Modo Leitura)

- [ ] **Página de Reprodução** (`/assessor/reproducao/page.tsx`)
  - [ ] Tabs: Coberturas, Óvulos, Embriões, Gestações
  - [ ] Visualização somente leitura
  - [ ] Filtros e busca
  - [ ] Sem ações de registro

### 9.6 Financeiro (Ordens de Serviço)

- [ ] **Página Financeiro** (`/assessor/financeiro/page.tsx`)
  - [ ] Foco em Ordens de Serviço
  - [ ] Lista de OS
  - [ ] Filtros (tipo, status, período)
  - [ ] Botão "Nova Ordem de Serviço"

- [ ] **Modal de Ordem de Serviço**
  - [ ] Tipo de serviço
  - [ ] Descrição
  - [ ] Valor estimado
  - [ ] Animal(is) relacionado(s)
  - [ ] Fornecedor/Prestador
  - [ ] Data prevista
  - [ ] Anexos (orçamento, etc)

- [ ] **Acompanhamento de OS**
  - [ ] Visualizar detalhes
  - [ ] Atualizar status
  - [ ] Adicionar notas
  - [ ] Anexar documentos
  - [ ] Confirmar valor final
  - [ ] Anexar nota fiscal

### 9.7 Tarefas

- [ ] **Página de Tarefas** (`/assessor/tarefas/page.tsx`)
  - [ ] Lista de tarefas
  - [ ] Filtros (status, responsável, prioridade)
  - [ ] Criar tarefa
  - [ ] Atribuir responsável
  - [ ] Definir prazo e prioridade
  - [ ] Checklist
  - [ ] Comentários
  - [ ] Anexos

### 9.8 Equipe

- [ ] **Página de Equipe** (`/assessor/equipe/page.tsx`)
  - [ ] Tabs: Equipe, Escalas, Férias
  - [ ] Lista de funcionários
  - [ ] Adicionar membro
  - [ ] Editar informações
  - [ ] Definir cargo/função
  - [ ] Atribuir permissões

### 9.9 Agenda

- [ ] **Página de Agenda** (`/assessor/agenda/page.tsx`)
  - [ ] Calendário mensal
  - [ ] Todos os eventos do haras
  - [ ] Adicionar evento
  - [ ] Editar evento
  - [ ] Filtros por tipo

### 9.10 Documentos

- [ ] **Página de Documentos** (`/assessor/documentos/page.tsx`)
  - [ ] Gerenciar todos os documentos
  - [ ] Upload
  - [ ] Organização por tipo
  - [ ] Tags
  - [ ] Busca
  - [ ] Download
  - [ ] Compartilhamento

### 9.11 Configurações Assessor

- [ ] **Página de Configurações** (`/assessor/configuracoes/page.tsx`)
  - [ ] Perfil do assessor
  - [ ] Notificações
  - [ ] Preferências
  - [ ] (Sem acesso a configurações do haras)

### 9.12 Ajuda Assessor

- [ ] **Página de Ajuda** (`/assessor/ajuda/page.tsx`)
  - [ ] Como importar planilhas ABCCMM
  - [ ] Como validar pendências
  - [ ] Como criar ordens de serviço
  - [ ] FAQ

---

## 10. CHECKLIST DE COMPONENTES COMPARTILHADOS

### 10.1 Layout Components

- [ ] **MainLayout** - Layout base com sidebar
- [ ] **Sidebar** - Menu lateral colapsável
- [ ] **Header** - Barra superior com busca, notificações, perfil
- [ ] **Breadcrumbs** - Navegação hierárquica
- [ ] **PageHeader** - Título da página com ações
- [ ] **PageContainer** - Container padrão de página

### 10.2 Data Display

- [ ] **DataTable** - Tabela com sort, filter, pagination
- [ ] **DataGrid** - Grid de cards
- [ ] **EmptyState** - Estado vazio
- [ ] **LoadingState** - Estado de loading
- [ ] **ErrorState** - Estado de erro
- [ ] **StatsCard** - Card de estatística/KPI
- [ ] **Timeline** - Linha do tempo de eventos
- [ ] **Badge** - Badges de status coloridos

### 10.3 Forms

- [ ] **FormField** - Wrapper para campos de formulário
- [ ] **SearchInput** - Input de busca
- [ ] **DatePicker** - Seletor de data
- [ ] **DateRangePicker** - Seletor de período
- [ ] **Select** - Select customizado
- [ ] **MultiSelect** - Seleção múltipla
- [ ] **FileUpload** - Upload de arquivos
- [ ] **ImageUpload** - Upload de imagens com preview
- [ ] **CurrencyInput** - Input de moeda
- [ ] **PhoneInput** - Input de telefone

### 10.4 Feedback

- [ ] **Modal/Dialog** - Modais customizados
- [ ] **ConfirmDialog** - Dialog de confirmação
- [ ] **Toast** - Notificações toast (Sonner)
- [ ] **Alert** - Alertas inline
- [ ] **Tooltip** - Tooltips informativos

### 10.5 Navigation

- [ ] **Tabs** - Navegação em tabs
- [ ] **Pagination** - Paginação
- [ ] **BackButton** - Botão de voltar

### 10.6 Domain-Specific

- [ ] **AnimalCard** - Card de animal
- [ ] **AnimalMiniBadge** - Badge com foto e nome
- [ ] **GenealogyTree** - Árvore genealógica
- [ ] **CalendarView** - Visualização de calendário
- [ ] **ChartContainer** - Container para gráficos Recharts
- [ ] **NotificationsDropdown** - Dropdown de notificações
- [ ] **UserMenu** - Menu do usuário
- [ ] **ThemeToggle** - Toggle de tema

---

## 11. CHECKLIST DE UI/UX

### 11.1 Design System

- [ ] **Paleta de cores**
  - [ ] Light mode (background: #ffffff, primary: #333333)
  - [ ] Dark mode (background: #0d0d0d, primary: #ffffff)
  - [ ] Status colors (success, warning, error, info)

- [ ] **Tipografia**
  - [ ] Font family (System UI + fallbacks)
  - [ ] Escalas de tamanho
  - [ ] Pesos de fonte

- [ ] **Espaçamento**
  - [ ] Sistema de spacing (4px base)
  - [ ] Padrões de gap e margin

- [ ] **Border radius**
  - [ ] Padrão para cards (1rem)
  - [ ] Padrões de arredondamento

- [ ] **Shadows**
  - [ ] Light mode shadows
  - [ ] Dark mode shadows

### 11.2 Responsividade

- [ ] **Breakpoints definidos**
  - [ ] Mobile (< 640px)
  - [ ] Tablet (640px - 1024px)
  - [ ] Desktop (> 1024px)

- [ ] **Mobile-first approach**
  - [ ] Sidebar colapsável/drawer
  - [ ] Cards empilhados
  - [ ] Tabelas responsivas
  - [ ] Touch targets (44x44px mínimo)

### 11.3 Acessibilidade

- [ ] **WCAG 2.1 AA**
  - [ ] Contraste adequado
  - [ ] Navegação por teclado
  - [ ] ARIA labels
  - [ ] Focus indicators
  - [ ] Textos alternativos

### 11.4 Performance

- [ ] **Otimizações**
  - [ ] Imagens otimizadas (next/image)
  - [ ] Lazy loading de componentes
  - [ ] Code splitting por rota
  - [ ] Memoização onde necessário

---

## 12. CHECKLIST DE INTEGRAÇÕES

### 12.1 Supabase

- [ ] **Cliente configurado**
  - [ ] Server client
  - [ ] Browser client
  - [ ] Middleware client

- [ ] **Auth integrado**
  - [ ] Sign in/out
  - [ ] Session management
  - [ ] Protected routes

- [ ] **Storage integrado**
  - [ ] Upload de arquivos
  - [ ] Signed URLs
  - [ ] Public URLs

### 12.2 Importação ABCCMM

- [ ] **Parser de Excel**
  - [ ] Biblioteca (xlsx ou similar)
  - [ ] Validação de formato
  - [ ] Mapeamento de colunas

- [ ] **Processamento**
  - [ ] Validação de dados
  - [ ] Detecção de duplicados
  - [ ] Batch insert

---

## 13. CHECKLIST DE TESTES

### 13.1 Testes Unitários

- [ ] **Configurar Vitest ou Jest**
- [ ] **Testes de hooks**
  - [ ] useAuth
  - [ ] useAnimals
  - [ ] useTransactions
- [ ] **Testes de utils**

### 13.2 Testes de Componentes

- [ ] **Configurar Testing Library**
- [ ] **Testes de componentes UI**
- [ ] **Testes de formulários**

### 13.3 Testes E2E

- [ ] **Configurar Playwright ou Cypress**
- [ ] **Fluxos críticos**
  - [ ] Login/Logout
  - [ ] Cadastro de animal
  - [ ] Importação ABCCMM
  - [ ] Validação de pendência

---

## 14. CHECKLIST DE DEPLOY

### 14.1 Preparação

- [ ] **Variáveis de ambiente de produção**
- [ ] **Build de produção testado**
- [ ] **Migrações de banco aplicadas**

### 14.2 Vercel (Recomendado)

- [ ] **Projeto criado na Vercel**
- [ ] **Repositório Git conectado**
- [ ] **Variáveis de ambiente configuradas**
- [ ] **Domínio customizado (opcional)**

### 14.3 Supabase Production

- [ ] **Projeto de produção criado**
- [ ] **Migrações aplicadas**
- [ ] **RLS policies revisadas**
- [ ] **Storage policies revisadas**
- [ ] **Backups configurados**

---

## 15. CRONOGRAMA

### Fase 1: Fundação (Semanas 1-2)

| Tarefa | Duração |
|--------|---------|
| Setup do projeto Next.js | 1 dia |
| Configuração Tailwind + Shadcn | 1 dia |
| Configuração Supabase | 2 dias |
| Modelagem do banco de dados | 3 dias |
| Autenticação completa | 3 dias |

### Fase 2: Módulo Admin (Semana 3)

| Tarefa | Duração |
|--------|---------|
| Layout e navegação | 1 dia |
| Dashboard | 1 dia |
| Assinaturas | 2 dias |
| Uso da plataforma + Alertas | 1 dia |

### Fase 3: Módulo Criador - Core (Semanas 4-6)

| Tarefa | Duração |
|--------|---------|
| Layout e navegação | 1 dia |
| Dashboard | 2 dias |
| Plantel (lista, filtros) | 3 dias |
| Detalhes do animal (todas tabs) | 5 dias |
| Cadastro/Edição de animal | 3 dias |
| Módulo Reprodução | 4 dias |

### Fase 4: Módulo Criador - Extensões (Semanas 7-8)

| Tarefa | Duração |
|--------|---------|
| Módulo Financeiro | 3 dias |
| Módulo Agenda | 2 dias |
| Módulo Relatórios | 2 dias |
| Configurações | 3 dias |

### Fase 5: Módulo Assessor (Semanas 9-10)

| Tarefa | Duração |
|--------|---------|
| Layout e navegação | 1 dia |
| Dashboard com pendências | 1 dia |
| Importação ABCCMM | 3 dias |
| Validação de pendências | 3 dias |
| Ordens de serviço | 2 dias |

### Fase 6: Polimento (Semanas 11-12)

| Tarefa | Duração |
|--------|---------|
| Responsividade mobile | 3 dias |
| Testes e correções | 4 dias |
| Performance optimization | 2 dias |
| Deploy | 1 dia |

### Resumo

| Fase | Semanas | Total Estimado |
|------|---------|----------------|
| Fundação | 1-2 | 2 semanas |
| Módulo Admin | 3 | 1 semana |
| Criador - Core | 4-6 | 3 semanas |
| Criador - Extensões | 7-8 | 2 semanas |
| Módulo Assessor | 9-10 | 2 semanas |
| Polimento | 11-12 | 2 semanas |
| **TOTAL** | | **12 semanas (~3 meses)** |

---

## PRÓXIMOS PASSOS

1. **Aprovar este documento de planejamento**
2. **Iniciar setup do projeto Next.js**
3. **Configurar Supabase e criar tabelas**
4. **Implementar autenticação**
5. **Começar desenvolvimento dos módulos**

---

**Última atualização:** 29 de Janeiro de 2026  
**Versão do documento:** 1.0  
**Autor:** Equipe CriaHub
