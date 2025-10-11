// apps/web/types/Client.ts
export interface Client {
    id: number;
    name: string;
    status: string; // e.g. "Active" | "Pending" | "Suspended"
    agentId?: number; // optional link to Agent
}