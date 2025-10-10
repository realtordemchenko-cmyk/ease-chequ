Отлично, Алексей ⚡. Сейчас у тебя в `docs/admin/FILES_ADMIN.md` перемешаны несколько разных слоёв: структура страниц, доступы, changelog, recovery steps и даже дублирующийся кусок про Requests. Чтобы документ был удобным для онбординга и аудита, я предлагаю привести его к чёткой иерархии:

---

# 📂 Admin Files Manifest

Описывает структуру, роли, доступы, enforcement‑точки и правила декомпозиции админ‑страниц. Любое изменение сначала фиксируется здесь.

---

## 🔐 Access Control
- Один **Super Admin** (Алексей) управляет правами.  
- Права назначаются через **шаблоны ролей** и **бандлы прав**, без уникальных «сырых» наборов.  
- **Default deny**, обязательная **2FA** для критических действий.  
- Все изменения логируются, доступны откаты.  

---

## 🗂 Admin Pages Structure

### Layout
- `apps/web/components/layout/Sidebar.tsx` — боковая панель навигации (Dashboard, Agents, Requests, Logs, Settings).  
- `apps/web/components/layout/Topbar.tsx` — верхняя панель с action‑кнопками.  

### Dashboard
- `apps/web/app/admin/dashboard/page.tsx` — карточки с ключевыми метриками (агенты, запросы, логи, ошибки).  

### Agents
- `apps/web/app/admin/agents/page.tsx` — список агентов (CRUD, поиск, переход к деталям).  
  - Колонка `Action` удалена, управление статусами централизовано через Requests.  
- `apps/web/app/admin/agents/[id]/page.tsx` — страница агента: карточка + список прикреплённых клиентов.  
- `apps/web/components/agents/AgentForm.tsx` — форма добавления/редактирования агента.  
- `apps/web/components/agents/AgentTable.tsx` — таблица агентов (используется внутри `page.tsx`).  

### Clients
- `apps/web/app/admin/clients/[id]/page.tsx` — карточка клиента + история активности.  
  - Возможна будущая перепривязка к другому агенту.  
  - Текущая версия — только просмотр.  

### Requests
- `apps/web/app/admin/requests/page.tsx` — таблица входящих запросов с фильтрацией по статусу и действиями (Approve, Reject, Reset).  
- `apps/web/components/requests/RequestStatusBadge.tsx` — визуальный индикатор статуса заявки.  

### Logs
- `apps/web/app/admin/logs/page.tsx` — журнал событий с фильтрацией и поиском.  
- (план) `apps/web/components/logs/LogsFilters.tsx` — фильтры.  
- (план) `apps/web/components/logs/LogsTable.tsx` — таблица.  
- (план) `apps/web/components/logs/LogsPagination.tsx` — пагинация.  
- (план) `apps/web/components/logs/LogsExport.tsx` — экспорт.  

### Settings
- `apps/web/app/admin/settings/page.tsx` — заглушка, планируется конфигурация системы.  

---

## ⚙️ Enforcement Points
- Route guards (App Router).  
- Компонентные гварды (условный рендер по ролям).  
- API‑проверки: роли, согласия, цели, юрисдикция.  
- Document access mediator: метаданные вместо контента при ограничениях.  

---

## 📜 Changelog
- **2025‑10‑09** Fix: убрана колонка `Action` и дублирование статуса в `agents/page.tsx`.  
- **2025‑10‑09** Fix: типизация `status` в `agents/[id]/page.tsx` приведена к `Agent["status"]`.  
- **2025‑10‑08** Added: Requests workflow (`approveRequest`, `rejectRequest`, `setRequestStatus`) в `AdminStore.tsx`; обновлён `requests/page.tsx`.  
- **2025‑10‑08** Added: `clients/[id]/page.tsx` для карточки клиента.  
- **2025‑10‑08** Refactor: `AdminStore.tsx` хранит agents, clients, requests, logs в localStorage; добавлены моки.  
- **2025‑10‑08** Fix: гарантированная инициализация мок‑данных.  
- **2025‑10‑07** Added: создан `docs/admin/FILES_ADMIN.md`.  
- **2025‑10‑07** Refactor: вынесена форма агента в `AgentForm.tsx`.  
- **2025‑10‑07** Fix: baseline зависимостей (Next.js 14.2.3 + React 18.2.0).  

---

## 📦 Dependency Baseline (2025‑10‑07)
- **Root `package.json`**: next 14.2.3, react 18.2.0, react-dom 18.2.0, concurrently ^8.2.0, typescript ^5.2.0.  
- **apps/web/package.json**: next 14.2.3, react 18.2.0, react-dom 18.2.0, sonner ^1.4.41, @types/react 18.2.73, @types/node 20.19.19, eslint ^8.57.0, eslint-config-next 14.2.3, typescript ^5.3.3.  

Notes:  
- React/React-DOM зафиксированы на 18.2.0.  
- Убраны конфликты с React 18.3.1.  
- `.next` и `node_modules` пересобраны.  
- Стабильная точка восстановления: проект запускается без ошибки `useReducer`.  

---

## 🛠 Recovery Steps
1. Удалить кэш и зависимости:
   ```powershell
   Remove-Item -Recurse -Force "node_modules"
   Remove-Item -Recurse -Force "apps\web\node_modules"
   Remove-Item -Recurse -Force "apps\web\.next"
   git checkout admin-sync-2025-10-08
   ```

---

## 📝 Примечания
- Управление статусами агентов централизовано через Requests.  
- В `AgentsPage` убрана колонка `Action`.  
- Все изменения логируются через `addLog`.  
- Типизация статусов приведена к строгим литералам (`Agent["status"]`).  

---

👉 Теперь документ структурирован: сверху модель доступа, затем структура страниц, enforcement, changelog, зависимости, recovery, примечания.  
Хочешь, я добавлю ещё раздел **"Operational Rules"** (например: «каждый новый файл открывается через VS Code командой», «все изменения фиксируются в логах»), чтобы у тебя был полный operational manifest?
