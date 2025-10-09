# Admin files manifest

Описывает структуру, роли, доступы, точки контроля и правила декомпозиции админ‑страниц. Любое изменение сначала фиксируется здесь.

---

## Access control

- Один **Super Admin** (Алексей) управляет правами.
- Права назначаются через **шаблоны ролей** и **бандлы прав**, без уникальных «сырых» наборов.
- **Default deny**, обязательная **2FA** для критических действий.
- Все изменения логируются, доступны откаты.

---

## Admin pages structure

### Layout
- `apps/web/components/layout/Sidebar.tsx` — боковая панель навигации (Dashboard, Agents, Requests, Logs, Settings).
- `apps/web/components/layout/Topbar.tsx` — верхняя панель с action‑кнопками.

### Dashboard
- `apps/web/app/admin/dashboard/page.tsx` — карточки с ключевыми метриками (агенты, запросы, логи, ошибки).

### Agents
- `apps/web/app/admin/agents/page.tsx` — список агентов + CRUD (добавление, редактирование, удаление, поиск, переход к деталям).
- `apps/web/app/admin/agents/[id]/page.tsx` — страница агента: карточка + список прикреплённых клиентов.
- `apps/web/components/agents/AgentForm.tsx` — форма добавления/редактирования агента.
- `apps/web/components/agents/AgentTable.tsx` — таблица агентов (используется внутри `page.tsx`).

### Clients
- `apps/web/app/admin/clients/[id]/page.tsx` — страница клиента: карточка клиента + история активности, возможность перепривязки к агенту.

### Requests
- `apps/web/app/admin/requests/page.tsx` — таблица входящих запросов с фильтрацией по статусу и действиями (Approve, Reject, Reset to Pending, повторное одобрение).

### Logs
- `apps/web/app/admin/logs/page.tsx` — журнал событий с фильтрацией по типу и поиском по сообщению.
- (план) `apps/web/components/logs/LogsFilters.tsx` — фильтры.
- (план) `apps/web/components/logs/LogsTable.tsx` — таблица.
- (план) `apps/web/components/logs/LogsPagination.tsx` — пагинация.
- (план) `apps/web/components/logs/LogsExport.tsx` — экспорт.

### Settings
- `apps/web/app/admin/settings/page.tsx` — (пока заглушка, планируется конфигурация системы).

---

## Enforcement points

- Route guards (App Router).
- Компонентные гварды (условный рендер по ролям).
- API‑проверки: роли, согласия, цели, юрисдикция.
- Document access mediator: метаданные вместо контента при ограничениях.

---

## Changelog

- [2025‑10‑08] Added: Requests workflow (`approveRequest`, `rejectRequest`, `setRequestStatus`) в `AdminStore.tsx`; обновлён `requests/page.tsx` с кнопками Approve/Reject/Reset.
- [2025‑10‑08] Added: `clients/[id]/page.tsx` для карточки клиента и перепривязки к агенту.
- [2025‑10‑08] Refactor: `AdminStore.tsx` теперь хранит agents, clients, requests, logs в localStorage; добавлены моки для всех сущностей.
- [2025‑10‑08] Fix: гарантированная инициализация мок‑данных даже при пустых массивов в localStorage.
- [2025‑10‑07] Added: created `docs/admin/FILES_ADMIN.md`; recorded access model and admin pages structure.
- [2025‑10‑07] Refactor: extracted add‑agent form into `apps/web/components/agents/AgentForm.tsx`; updated `agents/page.tsx` to import the component. Added validation in form (email, date, membership).
- [2025‑10‑07] Fix: aligned dependency baseline (Next.js 14.2.3 + React 18.2.0); removed React 18.3.1 conflict; project builds and runs without `useReducer` error.

---

## Dependency Baseline (2025-10-07)

- **Root `package.json`**
  - next: 14.2.3
  - react: 18.2.0
  - react-dom: 18.2.0
  - concurrently: ^8.2.0
  - typescript: ^5.2.0

- **apps/web/package.json**
  - next: 14.2.3
  - react: 18.2.0
  - react-dom: 18.2.0
  - sonner: ^1.4.41
  - @types/react: 18.2.73
  - @types/node: 20.19.19
  - eslint: ^8.57.0
  - eslint-config-next: 14.2.3
  - typescript: ^5.3.3

### Notes
- React/React-DOM зафиксированы на 18.2.0 (совместимая версия с Next.js 14.2.3).
- Убраны конфликты с React 18.3.1.
- `.next` и `node_modules` были пересобраны с нуля.
- Это стабильная точка восстановления: проект запускается без ошибки `useReducer`.

---

## Recovery Steps

1. Удалить кэш и зависимости:
   ```powershell
   Remove-Item -Recurse -Force "node_modules"
   Remove-Item -Recurse -Force "apps\web\node_modules"
   Remove-Item -Recurse -Force "apps\web\.next"
   git checkout admin-sync-2025-10-08