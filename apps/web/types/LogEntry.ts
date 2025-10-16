// LogEntry for audit trail across admin actions.
export type LogType = "Agent" | "Request" | "Client" | "System";

export interface LogEntry {
    id: string;
    type: LogType;
    message: string;
    timestamp: string; // ISO string
}