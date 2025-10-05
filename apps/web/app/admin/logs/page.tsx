"use client";

import React, { useMemo, useState } from "react";

interface LogEntry {
    id: string;
    timestamp: string; // ISO string
    actor: string;     // e.g., "admin@company.com"
    action: string;    // e.g., "UPDATE_AGENT"
    target: string;    // e.g., "agent: A123"
    status: "SUCCESS" | "FAILURE";
    ip: string;
    details: string;
}

export default function LogsPage() {
    // Demo dataset
    const [logs] = useState<LogEntry[]>([
        {
            id: "L-001",
            timestamp: "2025-10-04T15:43:12Z",
            actor: "admin@easechequ.com",
            action: "CREATE_AGENT",
            target: "agent: A123",
            status: "SUCCESS",
            ip: "192.168.1.10",
            details: "Created agent John Doe with board number A123",
        },
        {
            id: "L-002",
            timestamp: "2025-10-04T16:02:01Z",
            actor: "admin@easechequ.com",
            action: "UPDATE_AGENT",
            target: "agent: A123",
            status: "SUCCESS",
            ip: "192.168.1.10",
            details: "Updated accessUntil to 2025-12-31",
        },
        {
            id: "L-003",
            timestamp: "2025-10-04T17:25:39Z",
            actor: "ops@easechequ.com",
            action: "DELETE_AGENT",
            target: "agent: A122",
            status: "FAILURE",
            ip: "192.168.1.20",
            details: "Delete prevented: agent has pending settlements",
        },
        {
            id: "L-004",
            timestamp: "2025-10-05T09:12:05Z",
            actor: "ops@easechequ.com",
            action: "LOGIN",
            target: "console",
            status: "SUCCESS",
            ip: "192.168.1.30",
            details: "User authenticated via SSO",
        },
    ]);

    // Filters
    const [filters, setFilters] = useState({
        search: "",
        status: "all" as "all" | "SUCCESS" | "FAILURE",
        dateStart: "",
        dateEnd: "",
    });

    // UI state
    const [expanded, setExpanded] = useState<string | null>(null);

    // Pagination
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Handlers
    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setPage(1); // reset to first page on filter change
    };

    const toggleExpanded = (id: string) => {
        setExpanded((prev) => (prev === id ? null : id));
    };

    // Date helpers
    const parseDate = (s: string) => (s ? new Date(s) : null);

    // Derived view: filters
    const filteredLogs = useMemo(() => {
        const q = filters.search.trim().toLowerCase();
        const start = parseDate(filters.dateStart);
        const end = parseDate(filters.dateEnd);

        return logs.filter((l) => {
            // Status filter
            if (filters.status !== "all" && l.status !== filters.status) return false;

            // Date range filter (inclusive of entire end day)
            const ts = new Date(l.timestamp);
            if (start && ts < start) return false;
            if (end) {
                const endInclusive = new Date(end);
                endInclusive.setHours(23, 59, 59, 999);
                if (ts > endInclusive) return false;
            }

            // Text search across fields
            if (q) {
                const hay =
                    `${l.id} ${l.actor} ${l.action} ${l.target} ${l.status} ${l.ip} ${l.details}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }

            return true;
        });
    }, [logs, filters.search, filters.status, filters.dateStart, filters.dateEnd]);

    // Pagination slice
    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
    const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

    // CSV export for current filtered set
    const exportCSV = () => {
        const header = ["ID", "Timestamp", "Actor", "Action", "Target", "Status", "IP", "Details"];
        const rows = filteredLogs.map((l) => [
            l.id,
            l.timestamp,
            l.actor,
            l.action,
            l.target,
            l.status,
            l.ip,
            // Basic sanitize of line breaks
            l.details.replace(/\r?\n/g, " "),
        ]);
        const csv = [header, ...rows]
            .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "logs.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    // Pagination controls
    const goPrev = () => setPage((p) => Math.max(1, p - 1));
    const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Page Title */}
            <h1
                style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "var(--text-main)",
                }}
            >
                Audit logs
            </h1>

            {/* Filters */}
            <div
                style={{
                    backgroundColor: "var(--card-bg)",
                    border: `1px solid var(--card-border)`,
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                <h2
                    style={{
                        fontWeight: 600,
                        marginBottom: "4px",
                        color: "var(--text-main)",
                    }}
                >
                    Search & Filters
                </h2>

                <input
                    type="text"
                    name="search"
                    placeholder="Search logs..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: `1px solid var(--input-border)`,
                        backgroundColor: "var(--input-bg)",
                        color: "var(--text-main)",
                    }}
                />

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        style={{
                            minWidth: "200px",
                            padding: "8px",
                            borderRadius: "6px",
                            border: `1px solid var(--input-border)`,
                            backgroundColor: "var(--input-bg)",
                            color: "var(--text-main)",
                        }}
                    >
                        <option value="all">All statuses</option>
                        <option value="SUCCESS">Success</option>
                        <option value="FAILURE">Failure</option>
                    </select>

                    <input
                        type="date"
                        name="dateStart"
                        value={filters.dateStart}
                        onChange={handleFilterChange}
                        style={{
                            minWidth: "180px",
                            padding: "8px",
                            borderRadius: "6px",
                            border: `1px solid var(--input-border)`,
                            backgroundColor: "var(--input-bg)",
                            color: "var(--text-main)",
                        }}
                    />
                    <input
                        type="date"
                        name="dateEnd"
                        value={filters.dateEnd}
                        onChange={handleFilterChange}
                        style={{
                            minWidth: "180px",
                            padding: "8px",
                            borderRadius: "6px",
                            border: `1px solid var(--input-border)`,
                            backgroundColor: "var(--input-bg)",
                            color: "var(--text-main)",
                        }}
                    />
                </div>
            </div>

            {/* Actions bar */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <button
                    onClick={exportCSV}
                    style={{
                        padding: "10px 16px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "var(--secondary-bg)",
                        color: "var(--secondary-text)",
                        cursor: "pointer",
                        fontWeight: 600,
                    }}
                >
                    Export CSV
                </button>

                <div style={{ color: "var(--text-muted)" }}>
                    Showing{" "}
                    <strong style={{ color: "var(--text-main)" }}>
                        {paginatedLogs.length}
                    </strong>{" "}
                    of{" "}
                    <strong style={{ color: "var(--text-main)" }}>
                        {filteredLogs.length}
                    </strong>{" "}
                    results • Page {page} / {totalPages}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        onClick={goPrev}
                        disabled={page <= 1}
                        style={{
                            padding: "8px 14px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: page <= 1 ? "var(--disabled-bg)" : "var(--input-bg)",
                            color: page <= 1 ? "var(--disabled-text)" : "var(--text-main)",
                            cursor: page <= 1 ? "default" : "pointer",
                            fontWeight: 600,
                        }}
                    >
                        Previous
                    </button>
                    <button
                        onClick={goNext}
                        disabled={page >= totalPages}
                        style={{
                            padding: "8px 14px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: page >= totalPages ? "var(--disabled-bg)" : "var(--input-bg)",
                            color: page >= totalPages ? "var(--disabled-text)" : "var(--text-main)",
                            cursor: page >= totalPages ? "default" : "pointer",
                            fontWeight: 600,
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Logs table */}
            <div
                style={{
                    backgroundColor: "var(--card-bg)",
                    border: `1px solid var(--card-border)`,
                    borderRadius: "8px",
                    padding: "16px",
                }}
            >
                <h2
                    style={{
                        fontWeight: 600,
                        marginBottom: "12px",
                        color: "var(--text-main)",
                    }}
                >
                    Logs
                </h2>

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        color: "var(--text-main)",
                    }}
                >
                    <thead>
                        <tr style={{ backgroundColor: "var(--table-header-bg)" }}>
                            <th
                                style={{
                                    padding: "8px",
                                    borderBottom: `1px solid var(--card-border)`,
                                    textAlign: "left",
                                }}
                            >
                                Time
                            </th>
                            <th
                                style={{
                                    padding: "8px",
                                    borderBottom: `1px solid var(--card-border)`,
                                    textAlign: "left",
                                }}
                            >
                                Actor
                            </th>
                            <th
                                style={{
                                    padding: "8px",
                                    borderBottom: `1px solid var(--card-border)`,
                                    textAlign: "left",
                                }}
                            >
                                Action
                            </th>
                            <th
                                style={{
                                    padding: "8px",
                                    borderBottom: `1px solid var(--card-border)`,
                                    textAlign: "left",
                                }}
                            >
                                Target
                            </th>
                            <th
                                style={{
                                    padding: "8px",
                                    borderBottom: `1px solid var(--card-border)`,
                                    textAlign: "left",
                                }}
                            >
                                Status
                            </th>
                            <th
                                style={{
                                    padding: "8px",
                                    borderBottom: `1px solid var(--card-border)`,
                                    textAlign: "left",
                                }}
                            >
                                IP
                            </th>
                            <th
                                style={{
                                    padding: "8px",
                                    borderBottom: `1px solid var(--card-border)`,
                                    textAlign: "left",
                                }}
                            >
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLogs.map((l) => {
                            const time = new Date(l.timestamp).toLocaleString();
                            const isExpanded = expanded === l.id;

                            return (
                                <tr key={l.id}>
                                    <td style={{ padding: "8px", borderBottom: `1px solid var(--card-border)` }}>
                                        {time}
                                    </td>
                                    <td style={{ padding: "8px", borderBottom: `1px solid var(--card-border)` }}>
                                        {l.actor}
                                    </td>
                                    <td style={{ padding: "8px", borderBottom: `1px solid var(--card-border)` }}>
                                        {l.action}
                                    </td>
                                    <td style={{ padding: "8px", borderBottom: `1px solid var(--card-border)` }}>
                                        {l.target}
                                    </td>
                                    <td
                                        style={{
                                            padding: "8px",
                                            borderBottom: `1px solid var(--card-border)`,
                                            color: l.status === "SUCCESS" ? "var(--success-text)" : "var(--danger-text)",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {l.status}
                                    </td>
                                    <td style={{ padding: "8px", borderBottom: `1px solid var(--card-border)` }}>
                                        {l.ip}
                                    </td>
                                    <td style={{ padding: "8px", borderBottom: `1px solid var(--card-border)` }}>
                                        <button
                                            onClick={() => toggleExpanded(l.id)}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: "6px",
                                                border: "none",
                                                backgroundColor: "var(--secondary-bg)",
                                                color: "var(--secondary-text)",
                                                cursor: "pointer",
                                                marginBottom: isExpanded ? "8px" : "0",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {isExpanded ? "Hide" : "View"}
                                        </button>
                                        {isExpanded && (
                                            <div
                                                style={{
                                                    marginTop: "8px",
                                                    padding: "10px",
                                                    borderRadius: "6px",
                                                    backgroundColor: "var(--input-bg)",
                                                    border: `1px solid var(--input-border)`,
                                                    color: "var(--text-main)",
                                                    whiteSpace: "pre-wrap",
                                                }}
                                            >
                                                {l.details}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}