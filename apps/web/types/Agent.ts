// Agent model used across Admin pages and store.
// Status must support "Active" to align with existing seed and UI.
export type AgentStatus = "Active" | "Pending" | "Suspended";

export interface Agent {
    id: string;
    name: string;
    email: string;
    status: AgentStatus;
}