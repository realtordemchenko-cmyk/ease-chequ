-- D:\Projects\Ease Chequ\server\database\notification_log.sql
-- Таблица для хранения событий уведомлений (email, telegram, system)

CREATE TABLE IF NOT EXISTS notification_log (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,              -- тип события (test, email, telegram, billing и т.д.)
    message TEXT NOT NULL,                  -- текст уведомления
    scope VARCHAR(20) NOT NULL,             -- область (all, agent, client, admin)
    transport VARCHAR(20) NOT NULL,         -- канал доставки (email, telegram, system)
    success BOOLEAN NOT NULL DEFAULT true,  -- статус доставки
    error TEXT,                             -- текст ошибки, если есть
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Индексы для ускорения поиска
CREATE INDEX IF NOT EXISTS idx_notification_log_type ON notification_log(type);
CREATE INDEX IF NOT EXISTS idx_notification_log_scope ON notification_log(scope);
CREATE INDEX IF NOT EXISTS idx_notification_log_created_at ON notification_log(created_at);