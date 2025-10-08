// apps/web/app/admin/logs/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useAdmin } from "../../../context/AdminStore";

export default function LogsPage() {
    const { logs } = useAdmin();
    const [typeFilter, setTypeFilter] = useState<"All" | "System" | "Agent" | "Client" | "Error">("All");
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        return logs.filter((log) => {
            const matchesType = typeFilter === "All" || log.type === typeFilter;
            const matchesSearch =
                log.message.toLowerCase().includes(search.toLowerCase()) ||
                log.date.toLowerCase().includes(search.toLowerCase());
            return matchesType && matchesSearch;
        });
    }, [logs, typeFilter, search]);

    return (
        <section>
            <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Logs</h1>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {["All", "System", "Agent", "Client", "Error"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTypeFilter(t as any)}
                        style={{
                            padding: "6px 12px",
                            borderRadius: 4,
                            border: "none",
                            cursor: "pointer",
                            background: typeFilter === t ? "var(--primary-bg)" : "var(--secondary-bg)",
                            color: typeFilter === t ? "var(--primary-text)" : "var(--secondary-text)",
                        }}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <input
                type="text"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    marginBottom: 16,
                    padding: 6,
                    width: "100%",
                    border: `1px solid var(--card-border)`,
                    background: "var(--input-bg)",
                }}
            />

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "var(--card-bg)",
                    color: "var(--secondary-text)",
                    border: `1px solid var(--card-border)`,
                }}
            >
                <thead>
                    <tr>
                        <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>Date</th>
                        <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>Type</th>
                        <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((log) => (
                        <tr key={log.id}>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>{log.date}</td>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>{log.type}</td>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>{log.message}</td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan={3} style={{ padding: 12, textAlign: "center", color: "var(--text-muted)" }}>
                                No logs found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
}