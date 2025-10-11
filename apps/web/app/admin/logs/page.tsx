// apps/web/app/admin/logs/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useAdmin } from "../../../context/AdminStore";
import { LogEntry } from "../../../types/LogEntry";

export default function LogsPage() {
    const { logs } = useAdmin();

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<LogEntry["type"] | "All">("All");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // фильтрация
    const filteredLogs = useMemo(() => {
        const q = search.trim().toLowerCase();
        return logs.filter((log) => {
            const matchesType = typeFilter === "All" || log.type === typeFilter;
            const matchesSearch =
                !q ||
                log.message.toLowerCase().includes(q) ||
                log.date.toLowerCase().includes(q);
            return matchesType && matchesSearch;
        });
    }, [logs, search, typeFilter]);

    // страницы
    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages]);

    const startIndex = (currentPage - 1) * pageSize;
    const currentLogs = filteredLogs.slice(startIndex, startIndex + pageSize);

    // экспорт CSV
    const exportCSV = () => {
        const header = "id,date,type,message";
        const rows = logs.map(
            (log) =>
                `"${log.id}","${log.date}","${log.type}","${log.message.replace(/"/g, '""')}"`
        );
        const csvContent = [header, ...rows].join("\n");
        const blob = new Blob(["\uFEFF" + csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "logs.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    // экспорт JSON
    const exportJSON = () => {
        const blob = new Blob([JSON.stringify(logs, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "logs.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h1 style={{ fontSize: 20, fontWeight: 600 }}>Logs</h1>

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <select
                    value={typeFilter}
                    onChange={(e) =>
                        setTypeFilter(e.target.value as LogEntry["type"] | "All")
                    }
                >
                    <option value="All">All Types</option>
                    <option value="Agent">Agent</option>
                    <option value="Request">Request</option>
                    <option value="System">System</option>
                    <option value="Error">Error</option>
                </select>

                <input
                    type="text"
                    placeholder="Search logs..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    style={{ flex: 1 }}
                />
            </div>

            {/* Table */}
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
                        <th style={{ textAlign: "left", padding: 8 }}>Date</th>
                        <th style={{ textAlign: "left", padding: 8 }}>Type</th>
                        <th style={{ textAlign: "left", padding: 8 }}>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {currentLogs.map((log) => (
                        <tr key={log.id}>
                            <td style={{ padding: 8 }}>{log.date}</td>
                            <td style={{ padding: 8 }}>{log.type}</td>
                            <td style={{ padding: 8 }}>{log.message}</td>
                        </tr>
                    ))}
                    {currentLogs.length === 0 && (
                        <tr>
                            <td
                                colSpan={3}
                                style={{
                                    padding: 12,
                                    textAlign: "center",
                                    color: "var(--text-muted)",
                                }}
                            >
                                No logs found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination + Export */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 12,
                    alignItems: "center",
                }}
            >
                <span style={{ color: "var(--text-muted)" }}>
                    Page {currentPage} of {totalPages} ({filteredLogs.length} logs)
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </button>
                    <button onClick={exportCSV}>Export CSV</button>
                    <button onClick={exportJSON}>Export JSON</button>
                </div>
            </div>
        </section>
    );
}