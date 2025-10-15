"use client";

import { useAdmin } from "context/AdminStore";

export default function SettingsPage() {
    const { currentAdminRole, addLog } = useAdmin();

    if (currentAdminRole === "Viewer") {
        return <div>Access denied</div>;
    }

    const isSuperAdmin = currentAdminRole === "Super Admin";

    const handleSaveSettings = () => {
        if (isSuperAdmin) {
            addLog({ type: "System", message: "Settings updated by Super Admin" });
            alert("Settings saved (simulated)");
        }
    };

    return (
        <div>
            <h1>Settings</h1>

            <div style={{ marginBottom: "16px" }}>
                <label>
                    Theme:
                    <select>
                        <option value="default">Default</option>
                        <option value="dark">Dark</option>
                    </select>
                </label>
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label>
                    Notifications:
                    <input type="checkbox" defaultChecked />
                </label>
            </div>

            {isSuperAdmin ? (
                <button onClick={handleSaveSettings}>Save Settings</button>
            ) : (
                <p>Read-only mode: only Super Admin can change settings</p>
            )}
        </div>
    );
}