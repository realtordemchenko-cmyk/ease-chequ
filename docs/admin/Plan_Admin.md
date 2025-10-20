# 🚀 План восстановления админки Ease Chequ

## Шаг 1. Навигация
- Проверить `apps/web/app/admin/layout.tsx`:  
  - Должен оборачивать страницы в `AdminProvider`.  
  - Подключать `Sidebar`, `Topbar`.  
- Проверить `apps/web/app/admin/components/Sidebar.tsx`:  
  - Все ссылки через `next/link`.  
  - Маршруты совпадают с `FILES_ADMIN.md`.  
- Проверить `apps/web/app/admin/components/Topbar.tsx`:  
  - Кнопки Refresh, Save, Settings, Role selector.  

---

## Шаг 2. AdminStore
- Восстановить `apps/web/context/AdminStore.tsx` с мок‑данными:  
  - `agents`, `archivedAgents`, `clients`, `requests`, `archivedRequests`, `logs`.  
- Методы:  
  - `addAgent`, `updateAgent`, `deleteAgent`, `restoreAgent`.  
  - `approveRequest`, `rejectRequest`, `restoreRequest`.  
  - `addClient`, `detachClient`.  
  - `addLog`.  
  - `generateInvite`, `revokeInvite`.  
- Проверить, что все действия логируются.  

---

## Шаг 3. Компоненты
Создать недостающие компоненты:  
- `apps/web/components/agents/AgentForm.tsx` — форма добавления агента.  
- `apps/web/components/agents/AgentTable.tsx` — таблица агентов.  
- `apps/web/components/requests/RequestStatusBadge.tsx` — индикатор статуса заявки.  
- `apps/web/components/logs/LogsFilters.tsx` — фильтры.  
- `apps/web/components/logs/LogsTable.tsx` — таблица.  
- `apps/web/components/logs/LogsPagination.tsx` — пагинация.  
- `apps/web/components/logs/LogsExport.tsx` — экспорт CSV.  

---

## Шаг 4. Archive
- Проверить `apps/web/app/admin/archive/page.tsx`:  
  - Поддержка query‑параметров:  
    - `?page=agents`  
    - `?page=requests&type=approved`  
    - `?page=requests&type=rejected`  
- Добавить условие: если архив пуст → показывать «Нет данных».  

---

## Шаг 5. Access
- Создать `apps/web/app/admin/access/page.tsx`:  
  - Управление ролями: Super Admin, Admin, Viewer.  
  - Viewer = read‑only.  
  - Default deny + 2FA для критических действий.  

---

## Шаг 6. Тестирование
### Smoke‑тесты
- Проверить, что открываются все страницы:  
  - `/admin/dashboard`  
  - `/admin/agents`  
  - `/admin/agents/[id]`  
  - `/admin/requests`  
  - `/admin/archive`  
  - `/admin/logs`  
  - `/admin/settings`  
  - `/admin/access`  

### Функциональные тесты
- Добавление агента → появляется в списке.  
- Удаление агента → попадает в архив.  
- Восстановление агента → возвращается в список.  
- Approve заявки → создаётся агент, заявка уходит в архив (Approved).  
- Reject заявки → заявка уходит в архив (Rejected).  
- Все действия фиксируются в `/admin/logs`.  

### UI‑тесты
- Проверить работу `Sidebar` и `Topbar`:  
  - Все ссылки кликабельны.  
  - Кнопки выполняют действия.  

---

## Шаг 7. Git‑фиксация
- После каждого шага:  
  ```bash
  git add .
  git commit -m "Admin: Step X — описание изменений"
  git tag admin-step-X

  Шаг 8. Контроль качества
• 	Сверка с : структура должна совпадать.
• 	Проверка ESLint и TypeScript: проект должен собираться без ошибок.
• 	Визуальная проверка: UI соответствует .

Шаг 9. Будущее развитие
• 	Подключение реального API вместо моков.
• 	Настройка ролей и 2FA в .
• 	Улучшение логов: фильтры, экспорт CSV.
• 	Подключение email/webhook для invite‑ссылок.
• 	Поддержка платёжных реквизитов и продления .