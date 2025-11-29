"use client";

import React, { useState, useEffect } from "react";
import { LogEntry } from "@/types/LogEntry";
import { useAdmin } from "@/context/AdminStore";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LogsPagination from "@/components/logs/LogsPagination";

interface LogsTableProps {
  logs: LogEntry[];
}

export default function LogsTable({ logs }: LogsTableProps) {
  return (
    <Table
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
            <td style={{ padding: 8 }}>{log.timestamp}</td>
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
    </Table>
  );
}
