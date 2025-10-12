// apps/web/types/LogEntry.ts
// Reasoning: unify id type with usage (UUID string) and align domain event types with actual logging needs.

export type LogType = "System" | "Agent" | "Client" | "Request" | "Error";

export interface LogEntry {
    id: string;          // use UUID string from crypto.randomUUID()
    date: string;        // ISO timestamp
    type: LogType;       // includes "Request" to allow request lifecycle logs
    message: string;
}