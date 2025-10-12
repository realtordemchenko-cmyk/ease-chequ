// apps/web/components/logs/LogsFilters.tsx
"use client";

import { LogEntry } from "../../types/LogEntry";

interface LogsFiltersProps {
    search: string;
    setSearch: (value: string) => void;
    typeFilter: LogEntry["type"] | "All";
    setTypeFilter: (value: LogEntry["type"] | "All") => void;
}

export default function LogsFilters({
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
}: LogsFiltersProps) {
    return (
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>Type:</span>
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as LogEntry["type"] | "All")}
                >
                    <option value="All">All</option>
                    <option value="Agent">Agent</option>
                    <option value="Request">Request</option>
                    <option value="System">System</option>
                    <option value="Error">Error</option>
                </select>
            </label>

            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1 }}
            />
        </div>
    );
}