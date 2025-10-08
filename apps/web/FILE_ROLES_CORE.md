# 📂 FILE_ROLES.md — Назначение файлов проекта Ease Chequ

Этот документ фиксирует список файлов и их предназначение, чтобы исключить путаницу и дублирование.

---

## 🌐 Глобальные файлы

- **app/layout.tsx**  
  Глобальный layout для всего приложения.  
  Оборачивает все страницы, содержит `<html>`, `<body>`, глобальные стили и metadata.  

- **app/page.tsx**  
  Главная страница приложения (`/`).  

---

## 🔐 Админка

- **app/admin/layout.tsx**  
  Layout для всех страниц админки (`/admin/...`).  
  Экспортирует только `metadata` и `default`.  
  ⚠️ Важно: запрещены кастомные экспорты (`styles`, `use client`).  

- **app/admin/page.tsx**  
  Корневая страница админки (`/admin`).  

- **app/admin/agents/page.tsx**  
  Список агентов (`/admin/agents`).  

- **app/admin/agents/register/page.tsx**  
  Регистрация агента (`/admin/agents/register`).  

- **app/admin/clients/page.tsx**  
  Клиенты (`/admin/clients`).  

- **app/admin/dashboard/page.tsx**  
  Дашборд администратора (`/admin/dashboard`).  

- **app/admin/logs/page.tsx**  
  Логи (`/admin/logs`).  

- **app/admin/settings/page.tsx**  
  Настройки (`/admin/settings`).  

- **app/admin/users/page.tsx**  
  Пользователи (`/admin/users`).  

---

## ⚙️ Конфигурация

- **package.json** (в `apps/web/`)  
  Управляет запуском фронтенда.  
  - `start:frontend` — запускает Next.js.  
  - `start:backend` — заглушка.  

---