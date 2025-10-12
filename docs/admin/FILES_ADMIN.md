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
- `apps/web/app/admin/agents/[id]/page.tsx` — страница агента: карточка + список прикреплённых клиентов.  
- `apps/web/components/agents/AgentForm.tsx` — форма добавления/редактирования агента.  
- `apps/web/components/agents/AgentTable.tsx` — таблица агентов.  

### Clients
- `apps/web/app/admin/clients/[id]/page.tsx` — карточка клиента + история активности.  

### Requests
- `apps/web/app/admin/requests/page.tsx` — таблица входящих запросов с фильтрацией по статусу и действиями (Approve, Reject, Reset).  
- `apps/web/components/requests/RequestStatusBadge.tsx` — визуальный индикатор статуса заявки.  

### Logs
- ✅ `apps/web/app/admin/logs/page.tsx` — журнал событий с фильтрацией, поиском, пагинацией (10 записей/страница) и экспортом CSV/JSON.  
- (план) `apps/web/components/logs/LogsFilters.tsx` — фильтры.  
- (план) `apps/web/components/logs/LogsTable.tsx` — таблица.  
- (план) `apps/web/components/logs/LogsPagination.tsx` — пагинация.  
- (план) `apps/web/components/logs/LogsExport.tsx` — экспорт.  

### Settings
- `apps/web/app/admin/settings/page.tsx` — заглушка, планируется конфигурация системы.  

---

## 📦 Types & Store
- `apps/web/types/Agent.ts` — тип агента (`id`, `name`, `status`).  
- `apps/web/types/Request.ts` — тип запроса (`id`, `clientId`, `agentId`, `status`, `createdAt`).  
- `apps/web/types/LogEntry.ts` — тип лога (`id`, `date`, `type`, `message`).  
- `apps/web/context/AdminStore.tsx` — глобальное состояние (агенты, клиенты, запросы, логи).  

---

## ⚙️ Enforcement Points
- Route guards (App Router).  
- Компонентные гварды (условный рендер по ролям).  
- API‑проверки: роли, согласия, цели, юрисдикция.  
- Document access mediator: метаданные вместо контента при ограничениях.  

---

## 📜 Changelog
- **2025‑10‑11** Removed: legacy `apps/web/app/logs/page.tsx` (не использовался, заменён на `apps/web/app/admin/logs/page.tsx`).  
- **2025‑10‑11** Added: pagination (10 записей/страница) и экспорт CSV/JSON в `apps/web/app/admin/logs/page.tsx`.  
- **2025‑10‑11** Fix: заполнен `apps/web/types/LogEntry.ts`; приведена типизация в `Request.ts` и `Agent.ts` к строгим литералам.  
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

   📝 Примечания
• 	Управление статусами агентов централизовано через Requests.
• 	В  убрана колонка .
• 	Все изменения логируются через .
• 	Типизация статусов приведена к строгим литералам ().
• 	Для логов используется только .

### Logs

| Файл/Компонент                          | Статус        | Назначение                                                                 |
|-----------------------------------------|---------------|-----------------------------------------------------------------------------|
| `apps/web/app/admin/logs/page.tsx`      | ✅ Реализован | Журнал событий: фильтрация, поиск, пагинация (10/стр), экспорт CSV/JSON.    |
| `apps/web/components/logs/LogsFilters.tsx` | ⏳ План       | Вынести фильтры из `page.tsx` в отдельный компонент.                        |
| `apps/web/components/logs/LogsTable.tsx`   | ⏳ План       | Вынести таблицу логов в отдельный компонент.                                |
| `apps/web/components/logs/LogsPagination.tsx` | ⏳ План     | Вынести пагинацию в отдельный компонент.                                    |
| `apps/web/components/logs/LogsExport.tsx`   | ⏳ План       | Вынести экспорт (CSV/JSON) в отдельный компонент.                           |

## 🗂 Admin Pages Structure

### Dashboard
| Файл/Компонент                              | Статус        | Назначение                                                                 |
|---------------------------------------------|---------------|-----------------------------------------------------------------------------|
| `apps/web/app/admin/dashboard/page.tsx`     | ✅ Реализован | Карточки с ключевыми метриками (агенты, запросы, логи, ошибки).             |
| (план) `apps/web/components/dashboard/*`    | ⏳ План       | Вынести карточки и метрики в отдельные компоненты для переиспользования.    |

---

### Agents
| Файл/Компонент                              | Статус        | Назначение                                                                 |
|---------------------------------------------|---------------|-----------------------------------------------------------------------------|
| `apps/web/app/admin/agents/page.tsx`        | ✅ Реализован | Список агентов (CRUD, поиск, переход к деталям).                           |
| `apps/web/app/admin/agents/[id]/page.tsx`   | ✅ Реализован | Страница агента: карточка + список клиентов.                               |
| `apps/web/components/agents/AgentForm.tsx`  | ✅ Реализован | Форма добавления/редактирования агента.                                    |
| `apps/web/components/agents/AgentTable.tsx` | ✅ Реализован | Таблица агентов.                                                           |
| (план) `apps/web/components/agents/AgentCard.tsx` | ⏳ План | Вынести карточку агента в отдельный компонент.                             |

---

### Clients
| Файл/Компонент                              | Статус        | Назначение                                                                 |
|---------------------------------------------|---------------|-----------------------------------------------------------------------------|
| `apps/web/app/admin/clients/[id]/page.tsx`  | ✅ Реализован | Карточка клиента + история активности.                                     |
| (план) `apps/web/components/clients/ClientCard.tsx` | ⏳ План | Вынести карточку клиента в отдельный компонент.                            |

---

### Requests
| Файл/Компонент                                   | Статус        | Назначение                                                                 |
|--------------------------------------------------|---------------|-----------------------------------------------------------------------------|
| `apps/web/app/admin/requests/page.tsx`           | ✅ Реализован | Таблица входящих запросов с фильтрацией и действиями (Approve, Reject, Reset). |
| `apps/web/components/requests/RequestStatusBadge.tsx` | ✅ Реализован | Визуальный индикатор статуса заявки.                                       |
| (план) `apps/web/components/requests/RequestTable.tsx` | ⏳ План | Вынести таблицу запросов в отдельный компонент.                            |

---

### Logs
| Файл/Компонент                                   | Статус        | Назначение                                                                 |
|--------------------------------------------------|---------------|-----------------------------------------------------------------------------|
| `apps/web/app/admin/logs/page.tsx`               | ✅ Реализован | Журнал событий: фильтрация, поиск, пагинация (10/стр), экспорт CSV/JSON.   |
| (план) `apps/web/components/logs/LogsFilters.tsx`    | ⏳ План       | Вынести фильтры из `page.tsx` в отдельный компонент.                       |
| (план) `apps/web/components/logs/LogsTable.tsx`      | ⏳ План       | Вынести таблицу логов в отдельный компонент.                               |
| (план) `apps/web/components/logs/LogsPagination.tsx` | ⏳ План       | Вынести пагинацию в отдельный компонент.                                   |
| (план) `apps/web/components/logs/LogsExport.tsx`     | ⏳ План       | Вынести экспорт (CSV/JSON) в отдельный компонент.                          |

---

### Settings
| Файл/Компонент                              | Статус        | Назначение                                                                 |
|---------------------------------------------|---------------|-----------------------------------------------------------------------------|
| `apps/web/app/admin/settings/page.tsx`      | ✅ Реализован | Заглушка, планируется конфигурация системы.                                |
| (план) `apps/web/components/settings/*`     | ⏳ План       | Вынести формы и настройки в отдельные компоненты.                          |

## 📌 Операционные правила домена (программная логика)
- **Логирование:** любое действие в админке фиксируется через `addLog` (дата, тип, сообщение; дедупликация по тройке).
- **Управление статусами агентов:** все переходы статусов выполняются только через Requests. При approve Agent создаётся со статусом "Pending"; доступ выдается после проверки оплаты и данных.

- ✅ `apps/web/components/logs/LogsPagination.tsx` — вынесена пагинация.