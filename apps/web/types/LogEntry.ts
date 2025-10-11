// apps/web/types/LogEntry.ts
export interface LogEntry {
    id: number;
    date: string; // ISO date string
    type: "System" | "Agent" | "Client" | "Error";
    message: string;
}