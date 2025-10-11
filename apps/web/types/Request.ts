// apps/web/types/Request.ts
export interface Request {
    id: number;
    clientId: number;
    agentId: number;
    status: "Pending" | "Approved" | "Rejected";
    createdAt: string; // ISO date string
}