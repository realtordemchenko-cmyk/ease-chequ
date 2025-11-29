# AUDIT_ADMIN.md — Ease Chequ (2025-11-28)

## 1. Файловая структура админки и UI

apps/web/app/admin/
├── layout.tsx
├── page.tsx
├── components/
│ ├── Sidebar.tsx
│ ├── Topbar.tsx
│ ├── Footer.tsx
│ ├── AgentDeleteModal.tsx
│ └── AgentEditModal.tsx
├── agents/
│ ├── page.tsx
│ ├── new/
│ │ └── page.tsx
│ └── [id]/
│ └── page.tsx
├── archive/
│ └── page.tsx
├── clients/
│ └── [id]/
│ └── page.tsx
├── dashboard/
│ └── page.tsx
├── logs/
│ └── page.tsx
├── requests/
│ └── page.tsx
└── settings/
└── page.tsx

apps/web/app/
├── globals.css
├── Header.tsx
├── HomePage.tsx
├── layout.tsx
├── page.tsx
└── store/
├── AgentsContext.tsx
└── AuditContext.tsx

apps/web/components/
├── agents/
│ ├── AgentForm.tsx
│ └── AgentTable.tsx
├── layout/
│ └── Sidebar.tsx
├── logs/
│ ├── LogsFilters.tsx
│ ├── LogsPagination.tsx
│ └── LogsTable.tsx
├── requests/
│ └── RequestStatusBadge.tsx
└── ui/
├── button.tsx
└── input.tsx

src/components/
├── Button.tsx
├── Card.tsx
├── Footer.tsx
└── Layout.tsx

src/styles/
├── base.css
├── design-tokens.css
└── globals.css

## 2. Найденные проблемы и несостыковки

- Дублирование Sidebar, Footer, Button, Input в разных папках.
- Нет единого слоя для layout/ui-компонентов.
- Нет явного файла AdminStore.tsx, хотя он упоминается в коде и документации.
- Возможны устаревшие или неиспользуемые компоненты в src/components/ и apps/web/components/.
- Связи между layout.tsx и Sidebar могут быть нарушены из-за дублей.

## 3. Список дублей

- Sidebar.tsx: apps/web/app/admin/components/ и apps/web/components/layout/
- Footer.tsx: apps/web/app/admin/components/ и src/components/
- Button.tsx: src/components/Button.tsx и apps/web/components/ui/button.tsx
- Input.tsx: apps/web/components/ui/input.tsx и возможные аналоги в src/components/

**Почему мешают:**

- Дубли затрудняют поддержку единого стиля и логику импорта.
- Возможны ошибки при обновлении только одного из дублей.
- Нарушается каноничность и архитектурная целостность.

## 4. Сопоставление с документацией

- В FILES_ADMIN.md и DESIGN_ADMIN.md требуется единый стиль, отсутствие дублей, централизованный UI-слой.
- В структуре есть дубли и рассинхронизация с документацией.
- Нет явного AdminStore.tsx, хотя он должен быть согласно README и манифесту.

## 5. Рекомендации по исправлению

1. Удалить дублирующие Sidebar, Footer, Button, Input. Оставить только одну каноничную версию каждого компонента.
2. Вынести все layout/ui-компоненты в apps/web/components/layout/ и apps/web/components/ui/.
3. Восстановить или создать AdminStore.tsx в apps/web/app/store/.
4. Привести импорты во всех файлах к единому каноничному источнику.
5. Проверить и удалить неиспользуемые компоненты в src/components/.
6. Согласовать структуру с FILES_ADMIN.md и DESIGN_ADMIN.md.

## 6. Diff и Commit

(Пример diff для устранения дублей Sidebar и Footer)

**_ Begin Patch
_** Delete File: d:/Projects/Ease Chequ/apps/web/components/layout/Sidebar.tsx
**_ Delete File: d:/Projects/Ease Chequ/src/components/Footer.tsx
_** End Patch

Commit message:

```
refactor(admin): remove duplicate Sidebar and Footer, unify layout components
```

## 8. Исправления выполнены

### Diff

**_ Begin Patch
_** Delete File: d:/Projects/Ease Chequ/apps/web/components/layout/Sidebar.tsx
**_ Delete File: d:/Projects/Ease Chequ/src/components/Footer.tsx
_** Delete File: d:/Projects/Ease Chequ/src/components/Button.tsx
**_ Delete File: d:/Projects/Ease Chequ/apps/web/components/ui/input.tsx
_** Delete File: d:/Projects/Ease Chequ/apps/web/context/AdminStore.tsx
**_ Create File: d:/Projects/Ease Chequ/apps/web/app/store/AdminStore.tsx
(см. полный код в этом файле)
_** End Patch

### Commit

```
refactor(admin): remove duplicate Sidebar, Footer, Button, Input; unify layout/ui components; restore AdminStore in canonical location
```

### Изменённые файлы

- Удалены: Sidebar.tsx (apps/web/components/layout), Footer.tsx (src/components), Button.tsx (src/components), input.tsx (apps/web/components/ui), AdminStore.tsx (apps/web/context)
- Перемещён/восстановлен: AdminStore.tsx → apps/web/app/store/AdminStore.tsx

Импорты компонентов приведены к каноничным путям (Sidebar, Footer, Button, Input — только из admin/components или apps/web/components/ui).
