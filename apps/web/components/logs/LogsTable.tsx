// apps/web/components/logs/LogsTable.tsx
"use client";

import { LogEntry } from "../../types/LogEntry";

interface LogsTableProps {
    logs: LogEntry[];
}

export default function LogsTable({ logs }: LogsTableProps) {
    return (
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
                {logs.map((log) => (
                    <tr key={log.id}>
                        <td style={{ padding: 8 }}>{log.date}</td>
                        <td style={{ padding: 8 }}>{log.type}</td>
                        <td style={{ padding: 8 }}>{log.message}</td>
                    </tr>
                ))}
                {logs.length === 0 && (
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
    );
}