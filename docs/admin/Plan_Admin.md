

## 🚀 План восстановления (по шагам)

### Шаг 1. Навигация
- Проверить `layout.tsx`: должен оборачивать страницы в `AdminProvider` и подключать `Sidebar`, `Topbar`.  
- Проверить `Sidebar.tsx`: все ссылки через `next/link`, маршруты совпадают с манифестом.  

### Шаг 2. AdminStore
- Восстановить `apps/web/context/AdminStore.tsx` с мок‑данными:  
  - `agents`, `archivedAgents`, `clients`, `requests`, `archivedRequests`, `logs`.  
- Методы: `add/update/delete/restore Agent`, `approve/reject/restore Request`, `addLog`, `generate/revoke Invite`.  

### Шаг 3. Компоненты
- Создать недостающие:  
  - `apps/web/components/agents/AgentForm.tsx`  
  - `apps/web/components/agents/AgentTable.tsx`  
  - `apps/web/components/requests/RequestStatusBadge.tsx`  
  - `apps/web/components/logs/LogsFilters.tsx`, `LogsTable.tsx`, `LogsPagination.tsx`, `LogsExport.tsx`  

### Шаг 4. Archive
- Проверить `archive/page.tsx`: поддержка query‑параметров `?page=agents`, `?page=requests&type=approved|rejected`.  
- Добавить условие «Нет данных», если архив пуст.  

### Шаг 5. Access
- Создать `apps/web/app/admin/access/page.tsx` для управления ролями.  

---

## 📌 Итог
- Канон зафиксирован.  
- Все будущие шаги будут сверяться с `FILES_ADMIN.md`.  
- Мы идём по плану: сначала **навигация**, потом **AdminStore**, потом **компоненты**, и только после этого — тесты.  

---
🔎 Шаг 6. Тестирование
- Smoke‑тесты: проверить, что все страницы открываются (/dashboard, /agents, /requests, /archive, /logs, /settings, /access).
- Функциональные тесты:
- Добавление агента → появляется в списке.
- Удаление агента → попадает в архив.
- Восстановление агента → возвращается в список.
- Approve заявки → создаётся агент, заявка уходит в архив (Approved).
- Reject заявки → заявка уходит в архив (Rejected).
- Все действия фиксируются в /logs.
- UI‑тесты: проверить работу Sidebar и Topbar (ссылки, кнопки).
📌 Шаг 7. Git‑фиксация
- После каждого шага:
- git add .
- git commit -m "Admin: Step X — описание изменений"
- git tag admin-step-X
- Это гарантирует, что можно откатиться на любой этап.
📊 Шаг 8. Контроль качества
- Сверка с FILES_ADMIN.md: структура должна совпадать.
- ESLint/TypeScript: проект должен собираться без ошибок.
- Визуальная проверка: UI соответствует DESIGN_ADMIN.md.
📅 Шаг 9. Будущее развитие
- Подключение реального API вместо моков.
- Настройка ролей и 2FA в access/page.tsx.
- Улучшение логов: фильтры, экспорт CSV.
- Подключение email/webhook для invite‑ссылок.
