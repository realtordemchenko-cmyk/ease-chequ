"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface LogEntry {
    id: string;
    timestamp: string;
    action: string;
    details?: string;
}

interface LogsContextType {
    logs: LogEntry[];
    addLog: (entry: Omit<LogEntry, "id" | "timestamp">) => void;
}

const LogsContext = createContext<LogsContextType>({
    logs: [],
    addLog: () => { },
});

export function LogsProvider({ children }: { children: React.ReactNode }) {
    const [logs, setLogs] = useState<LogEntry[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("admin-logs");
        if (saved) {
            try {
                setLogs(JSON.parse(saved));
            } catch {
                setLogs([]);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("admin-logs", JSON.stringify(logs));
    }, [logs]);

    const addLog = (entry: Omit<LogEntry, "id" | "timestamp">) => {
        const newEntry: LogEntry = {
            id: String(Date.now()),
            timestamp: new Date().toISOString(),
            ...entry,
        };
        setLogs((prev) => [...prev, newEntry]);
    };

    return (
        <LogsContext.Provider value= {{ logs, addLog }
}>
    { children }
    </LogsContext.Provider>
  );
}

export function useLogs(): LogsContextType {
    return useContext(LogsContext);
}