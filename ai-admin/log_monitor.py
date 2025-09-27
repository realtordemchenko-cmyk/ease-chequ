import time
from actions import notify_admin, restart_service

LOG_PATH = "D:\\Projects\\Ease Chequ\\ai-admin\\app.log"  # путь к лог-файлу


def is_error(line: str) -> bool:
    return "ERROR" in line or "Exception" in line


def monitor_logs():
    print(f"📡 Мониторинг запущен: {LOG_PATH}")
    try:
        with open(LOG_PATH, "r") as f:
            f.seek(0, 2)  # перейти в конец файла
            while True:
                line = f.readline()
                if not line:
                    time.sleep(1)
                    continue
                if is_error(line):
                    print(f"⚠️ Обнаружена ошибка: {line.strip()}")
                    notify_admin(line.strip())
                    restart_service()
    except FileNotFoundError:
        print(f"❌ Файл не найден: {LOG_PATH}")
    except Exception as e:
        print(f"❌ Ошибка в мониторинге: {e}")


if __name__ == "__main__":
    monitor_logs()
