"use client";

import { useAdmin } from "context/AdminStore";

export default function DashboardPage() {
    const { agents, clients, requests, logs } = useAdmin();

    return (
        <div>
            <h1>Dashboard</h1>

            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                <div style={{ padding: "12px", border: "1px solid var(--card-border)", borderRadius: 6 }}>
                    <h3>Agents</h3>
                    <p>{agents.length}</p>
                </div>
                <div style={{ padding: "12px", border: "1px solid var(--card-border)", borderRadius: 6 }}>
                    <h3>Clients</h3>
                    <p>{clients.length}</p>
                </div>
                <div style={{ padding: "12px", border: "1px solid var(--card-border)", borderRadius: 6 }}>
                    <h3>Requests</h3>
                    <p>{requests.length}</p>
                </div>
                <div style={{ padding: "12px", border: "1px solid var(--card-border)", borderRadius: 6 }}>
                    <h3>Logs</h3>
                    <p>{logs.length}</p>
                </div>
            </div>

            <h2>Recent Activity</h2>
            {logs.length === 0 ? (
                <p>No activity yet</p>
            ) : (
                <ul>
                    {logs
                        .slice(-5)
                        .reverse()
                        .map((log) => (
                            <li key={log.id}>
                                [{new Date(log.timestamp).toLocaleTimeString()}] {log.type}: {log.message}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
}