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

### Agents
- `apps/web/app/admin/agents/page.tsx` — контейнер страницы.
- `apps/web/components/agents/AgentForm.tsx` — форма добавления агента.
- (план) `apps/web/components/agents/AgentTable.tsx` — таблица агентов.
- (план) `apps/web/components/agents/AgentEditForm.tsx` — форма редактирования.
- (план) `apps/web/components/agents/AgentDeleteModal.tsx` — модалка удаления.

### Logs
- `apps/web/app/admin/logs/page.tsx` — контейнер страницы.
- (план) `apps/web/components/logs/LogsFilters.tsx` — фильтры.
- (план) `apps/web/components/logs/LogsTable.tsx` — таблица.
- (план) `apps/web/components/logs/LogsPagination.tsx` — пагинация.
- (план) `apps/web/components/logs/LogsExport.tsx` — экспорт.

---

## Enforcement points

- Route guards (App Router).
- Компонентные гварды (условный рендер по ролям).
- API‑проверки: роли, согласия, цели, юрисдикция.
- Document access mediator: метаданные вместо контента при ограничениях.

---

## Changelog

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