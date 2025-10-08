// apps/web/app/admin/requests/page.tsx
"use client";

import { useState } from "react";

interface Request {
    id: number;
    client: string;
    agent: string;
    date: string;
    status: "Pending" | "Approved" | "Rejected";
}

const mockRequests: Request[] = [
    { id: 1, client: "Contoso Ltd.", agent: "Alice", date: "2025-10-01", status: "Pending" },
    { id: 2, client: "Northwind Inc.", agent: "Bob", date: "2025-10-02", status: "Approved" },
    { id: 3, client: "Fabrikam Co.", agent: "Charlie", date: "2025-10-03", status: "Rejected" },
    { id: 4, client: "Adventure Works", agent: "Alice", date: "2025-10-04", status: "Pending" },
];

export default function RequestsPage() {
    const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");

    const filtered = statusFilter === "All"
        ? mockRequests
        : mockRequests.filter((r) => r.status === statusFilter);

    return (
        <section>
            <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Requests</h1>

            {/* Фильтры */}
            <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
                {["All", "Pending", "Approved", "Rejected"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s as any)}
                        style={{
                            padding: "6px 12px",
                            borderRadius: 4,
                            border: "none",
                            cursor: "pointer",
                            background: statusFilter === s ? "var(--primary-bg)" : "var(--secondary-bg)",
                            color: statusFilter === s ? "var(--primary-text)" : "var(--secondary-text)",
                        }}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Таблица */}
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
                        <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>ID</th>
                        <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>Client</th>
                        <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>Agent</th>
                        <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>Date</th>
                        <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((r) => (
                        <tr key={r.id}>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>{r.id}</td>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>{r.client}</td>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>{r.agent}</td>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>{r.date}</td>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>{r.status}</td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{ padding: 12, textAlign: "center", color: "var(--text-muted)" }}>
                                No requests found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
}