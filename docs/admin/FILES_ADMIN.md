
# 📂 Admin Files Manifest (актуальная версия)

Описывает структуру, роли, доступы, enforcement‑точки и правила декомпозиции админ‑страниц. Любое изменение сначала фиксируется здесь.

---

## 🔐 Access Control
- Один **Super Admin** (Алексей) управляет правами.  
- Роли: **Super Admin**, **Admin**, **Viewer**.  
- **Viewer**: только просмотр (UI disabled).  
- **Default deny**, обязательная **2FA** для критических действий.  
- Все изменения логируются, доступны откаты.  

---

## 🗂 Admin Pages Structure

### Layout
- `apps/web/app/admin/layout.tsx` — вложенный layout, содержит `AdminProvider`, `Sidebar`, `Topbar`.  
- `apps/web/app/admin/components/Sidebar.tsx` — боковая панель навигации (Dashboard, Agents, Requests, Logs, Archive, Settings, Access).  
- `apps/web/app/admin/components/Topbar.tsx` — верхняя панель с action‑кнопками (Refresh, Save, Settings, Role selector).  

### Dashboard
- `apps/web/app/admin/dashboard/page.tsx` — карточки с ключевыми метриками (агенты, запросы, архив, логи).  
- Счётчики Deleted Agents и Rejected Requests ведут на `/admin/archive` с query‑параметрами.  

### Agents
- `apps/web/app/admin/agents/page.tsx` — список агентов (CRUD, переход к деталям).  
- `apps/web/app/admin/agents/[id]/page.tsx` — страница агента: карточка, клиенты, invite‑ссылка, кнопки Edit/Delete/Generate/Regenerate/Revoke.  
- `apps/web/app/admin/components/AgentEditModal.tsx` — модалка редактирования агента.  
- `apps/web/app/admin/components/AgentDeleteModal.tsx` — модалка удаления агента (архивирование).  
- `apps/web/components/agents/AgentForm.tsx` — форма добавления агента.  
- `apps/web/components/agents/AgentTable.tsx` — таблица агентов.  

### Clients
- `apps/web/app/admin/clients/[id]/page.tsx` — карточка клиента + история активности.  
- (план) `apps/web/components/clients/ClientCard.tsx` — карточка клиента.  
- Моки клиентов привязаны к агентам для теста.  

### Requests
- `apps/web/app/admin/requests/page.tsx` — таблица входящих запросов (только Pending).  
- `apps/web/components/requests/RequestStatusBadge.tsx` — индикатор статуса заявки.  
- Логика:  
  - Approve → создаёт агента (Pending), переносит заявку в `archivedRequests` (Approved).  
  - Reject → переносит заявку в `archivedRequests` (Rejected).  
  - Rejected нельзя одобрить напрямую, только через восстановление в Pending.  

### Archive
- `apps/web/app/admin/archive/page.tsx` — централизованный архив.  
  - Deleted Agents: список + Restore.  
  - Archived Requests: Approved/Rejected + Restore.  
  - Поддержка query‑параметров: `?page=agents`, `?page=requests&type=approved|rejected`.  

### Logs
- `apps/web/app/admin/logs/page.tsx` — журнал событий: фильтрация, поиск, пагинация (10/стр), экспорт CSV.  
- (план) `apps/web/components/logs/LogsFilters.tsx` — фильтры.  
- (план) `apps/web/components/logs/LogsTable.tsx` — таблица.  
- (план) `apps/web/components/logs/LogsPagination.tsx` — пагинация.  
- (план) `apps/web/components/logs/LogsExport.tsx` — экспорт.  

### Settings
- `apps/web/app/admin/settings/page.tsx` — заглушка.  
- (будущее) конфигурация системы: платёжные реквизиты агентов, счёт администратора, email‑сервис, webhooks.  

### Access
- `apps/web/app/admin/access/page.tsx` — управление ролями и уровнями доступа.  

---

## 📦 Types & Store
- `apps/web/types/Agent.ts` — тип агента.  
- `apps/web/types/Request.ts` — тип заявки.  
- `apps/web/types/LogEntry.ts` — тип лога.  
- `apps/web/context/AdminStore.tsx` — глобальное состояние (agents, archivedAgents, clients, requests, archivedRequests, logs, currentAdminRole).  

---

## ⚙️ Enforcement Points
- Route guards (App Router).  
- Компонентные гварды (условный рендер по ролям).  
- API‑проверки: роли, согласия, цели, юрисдикция.  
- Document access mediator: метаданные вместо контента при ограничениях.  

---

## 📜 Changelog
- **2025‑10‑16** Refactor: централизованный архив `/admin/archive`, удалены дубли `archived/`.  
- **2025‑10‑12** Added: финальная версия Clients.  
- **2025‑10‑12** Added: финальная версия Logs.  
- **2025‑10‑11** Added: pagination и экспорт CSV в Logs.  
- **2025‑10‑11** Fix: строгая типизация в Agent/Request/LogEntry.  
- **2025‑10‑09** Fix: убрана колонка Action и дублирование статуса в Agents.  
- **2025‑10‑08** Added: Requests workflow.  
- **2025‑10‑08** Added: Clients/[id]/page.tsx.  
- **2025‑10‑08** Refactor: AdminStore хранит agents, clients, requests, logs; добавлены моки.  
- **2025‑10‑07** Added: создан docs/admin/FILES_ADMIN.md.  
- **2025‑10‑07** Refactor: вынесена форма агента в AgentForm.tsx.  

---


