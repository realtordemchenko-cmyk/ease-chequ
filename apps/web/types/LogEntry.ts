export interface LogEntry {
    id: string;
    type: "Agent" | "Client" | "Request" | "Access" | "System";
    message: string;
    timestamp: string;
}