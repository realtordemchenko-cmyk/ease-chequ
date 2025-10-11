// apps/web/components/logs/LogsFilters.tsx
"use client";

import { useState } from "react";
import { LogEntry } from "../../types/LogEntry";

interface LogsFiltersProps {
    onChange: (next: { type: LogEntry["type"] | "All"; search: string }) => void;
}

export default function LogsFilters({ onChange }: LogsFiltersProps) {
    const [type, setType] = useState<LogEntry["type"] | "All">("All");
    const [search, setSearch] = useState("");

    return (
        <div style={{ marginBottom: 12 }}>
            <label>
                Type:
                <select
                    value={type}
                    onChange={(e) => {
                        const next = e.target.value as LogEntry["type"] | "All";
                        setType(next);
                        onChange({ type: next, search });
                    }}
                >
                    <option value="All">All</option>
                    <option value="INFO">INFO</option>
                    <option value="WARN">WARN</option>
                    <option value="ERROR">ERROR</option>
                </select>
            </label>
            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                    const next = e.target.value;
                    setSearch(next);
                    onChange({ type, search: next });
                }}
                style={{ marginLeft: 10 }}
            />
        </div>
    );
}