from utils.notifications import log_event

if __name__ == "__main__":
    log_event(
        "test_email",
        "Test email notification: record in notification_log and email delivery.",
        scope="all"
    )
    print("✅ Test email notification triggered (check DB and mailbox).")
