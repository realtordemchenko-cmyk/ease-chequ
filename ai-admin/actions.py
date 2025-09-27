import subprocess
import requests

TELEGRAM_TOKEN = "8464405538:AAHWyFxxsP33lmGLBXSbUiAEcRJiCeTtff0"
TELEGRAM_CHAT_ID = "323988733"


def notify_admin(message: str):
    print(f"📨 Notification: {message}")
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
        payload = {"chat_id": TELEGRAM_CHAT_ID,
                   "text": f"⚠️ Log Error:\n{message}"}
        requests.post(url, json=payload)
    except Exception as e:
        print(f"❌ Telegram error: {e}")


def restart_service():
    print("🔄 Restarting service...")
    try:
        subprocess.run(["powershell", "-Command",
                        "Restart-Service -Name 'postgresql-x64-15'"], check=True)
    except Exception as e:
        print(f"❌ Restart error: {e}")
