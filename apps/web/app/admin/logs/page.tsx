"use client";

import { useAdmin } from "context/AdminStore";
import { useMemo, useState } from "react";

// Pagination settings
const PAGE_SIZE = 10;

export default function LogsPage() {
    const { logs } = useAdmin();
    const [page, setPage] = useState(1);

    // Total pages calculation
    const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));

    // Clamp page if logs change (e.g., new actions)
    const safePage = Math.min(page, totalPages);

    // Current page slice
    const pageLogs = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        return logs.slice(start, start + PAGE_SIZE);
    }, [logs, safePage]);

    // Export CSV of current logs (or full set if preferred)
    const exportCSV = (scope: "current" | "all" = "current") => {
        const target = scope === "current" ? pageLogs : logs;
        const headers = ["id", "type", "message", "timestamp"];
        const rows = target.map((l) =>
            [
                escapeCsv(l.id),
                escapeCsv(l.type),
                escapeCsv(l.message),
                escapeCsv(l.timestamp),
            ].join(",")
        );
        const csv = [headers.join(","), ...rows].join("\n");
        downloadCsv(csv, `logs-${scope}-${new Date().toISOString().slice(0, 19)}.csv`);
    };

    return (
        <div>
            <h1>Logs</h1>

            <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
                <button onClick={() => exportCSV("current")}>Export current page CSV</button>
                <button onClick={() => exportCSV("all")}>Export all logs CSV</button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: "left" }}>Type</th>
                        <th style={{ textAlign: "left" }}>Message</th>
                        <th style={{ textAlign: "left" }}>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {pageLogs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.type}</td>
                            <td>{log.message}</td>
                            <td>{log.timestamp}</td>
                        </tr>
                    ))}

                    {pageLogs.length === 0 && (
                        <tr>
                            <td colSpan={3} style={{ padding: 12, color: "#666" }}>
                                No logs on this page.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
                <button disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    Prev
                </button>
                <span>
                    Page {safePage} / {totalPages}
                </span>
                <button
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

// ---- Helpers (CSV) ----
// Escape commas, quotes and newlines for CSV safety
function escapeCsv(value: string) {
    if (value == null) return "";
    const needsQuotes = /[",\n]/.test(value);
    const v = value.replace(/"/g, '""');
    return needsQuotes ? `"${v}"` : v;
}

// Trigger browser download for CSV content
function downloadCsv(content: string, filename: string) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}