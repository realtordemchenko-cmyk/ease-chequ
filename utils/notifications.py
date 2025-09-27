import psycopg2
import smtplib
from email.mime.text import MIMEText
import requests

# Database connection settings
DB_CONFIG = {
    "dbname": "prequalrent",
    "user": "postgres",
    "password": "Leviophan13!",
    "host": "localhost",
    "port": 5432
}

# Telegram settings
TELEGRAM_BOT_TOKEN = "8464405538:AAHWyFxxsP33lmGLBXSbUiAEcRJiCeTtff0"
TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"

# Email settings (disabled until mailbox is ready)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "easicheqcknotifications@gmail.com"
SMTP_PASS = "<app_password>"  # use app password when ready


def log_event(event_type, message, scope="all"):
    """Insert event into notification_log and send notifications"""
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    # 1) Insert into log (single insert, default is_read = false)
    cur.execute(
        """
        INSERT INTO notification_log (event_type, message, created_at, scope, is_read)
        VALUES (%s, %s, NOW(), %s, false)
        """,
        (event_type, message, scope)
    )
    conn.commit()
    print("✅ Record inserted into notification_log")

    # 2) Get active recipients by scope/all
    cur.execute(
        "SELECT type, value FROM notification_recipients WHERE active = true AND (scope = %s OR scope = 'all')",
        (scope,)
    )
    recipients = cur.fetchall()

    cur.close()
    conn.close()

    # 3) Send notifications
    for r_type, r_value in recipients:
        if r_type == "telegram":
            try:
                requests.post(
                    TELEGRAM_API_URL,
                    json={"chat_id": int(r_value),
                          "text": f"[{event_type.upper()}] {message}"},
                    timeout=5,
                )
            except Exception as e:
                print(f"Telegram send error: {e}")

        # Email block is commented out until mailbox is ready
        # elif r_type == "email":
        #     try:
        #         msg = MIMEText(f"[{event_type.upper()}] {message}")
        #         msg["Subject"] = f"Notification: {event_type}"
        #         msg["From"] = SMTP_USER
        #         msg["To"] = r_value
        #
        #         with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        #             server.starttls()
        #             server.login(SMTP_USER, SMTP_PASS)
        #             server.sendmail(SMTP_USER, r_value, msg.as_string())
        #     except Exception as e:
        #         print(f"Email send error: {e}")


def mark_as_read(notification_id):
    """Mark notification as read"""
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute(
        "UPDATE notification_log SET is_read = true WHERE id = %s",
        (notification_id,)
    )
    conn.commit()
    cur.close()
    conn.close()
