"use client";
import React, { useState, useMemo } from "react";
import { LogEntry } from "../../types/LogEntry";

interface LogsPaginationProps {
  logs: LogEntry[];
  pageSize?: number;
}

export default function LogsPagination({
  logs,
  pageSize = 10,
}: LogsPaginationProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(logs.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageLogs = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return logs.slice(start, start + pageSize);
  }, [logs, safePage, pageSize]);

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
    downloadCsv(
      csv,
      `logs-${scope}-${new Date().toISOString().slice(0, 19)}.csv`
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
        <button onClick={() => exportCSV("current")}>
          Export current page CSV
        </button>
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

      <div
        style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}
      >
        <button
          disabled={safePage <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
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
function escapeCsv(value: string) {
  if (value == null) return "";
  const needsQuotes = /[",\n]/.test(value);
  const v = value.replace(/"/g, '""');
  return needsQuotes ? `"${v}"` : v;
}

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
