"use client";
import React, { useState } from "react";
import Header from "../../Header";

export default function SettingsPage() {
    const [systemName, setSystemName] = useState("Ease Chequ");
    const [notifications, setNotifications] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Settings saved successfully:
- System Name: ${systemName}
- Notifications: ${notifications ? "Enabled" : "Disabled"}`);
    };

    return (
        <>
            <Header />
            <div style={{ padding: "2rem" }}>
                <h1>Settings</h1>
                <p>Here you can configure system preferences and admin options.</p>

                <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label>
                            System Name:{" "}
                            <input
                                type="text"
                                value={systemName}
                                onChange={(e) => setSystemName(e.target.value)}
                                style={{ marginLeft: "0.5rem" }}
                            />
                        </label>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <label>
                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={(e) => setNotifications(e.target.checked)}
                            />{" "}
                            Enable Notifications
                        </label>
                    </div>

                    <button type="submit">Save Settings</button>
                </form>
            </div>
        </>
    );
}