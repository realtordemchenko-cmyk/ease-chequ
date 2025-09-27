from utils.notifications import log_event


if __name__ == "__main__":
    log_event(
        "test",
        "Test notification: record in notification_log and Telegram delivery.",
        scope="all"
    )

    print("✅ Тестовое уведомление отправлено (проверь БД и Telegram).")
