import psycopg2
from utils.notifications import DB_CONFIG

conn = psycopg2.connect(**DB_CONFIG)
cur = conn.cursor()
cur.execute(
    "SELECT id, event_type, message, created_at FROM notification_log ORDER BY created_at DESC LIMIT 5;")
rows = cur.fetchall()
for row in rows:
    print(row)
cur.close()
conn.close()
