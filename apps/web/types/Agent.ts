// apps/web/types/Agent.ts
export type AgentStatus = "Pending" | "Active" | "Inactive" | "Busy";

export interface Agent {
    id: string;
    name: string;
    email: string;
    boardMemberNumber?: string;
    accessUntil: string;   // ISO date or empty until granted
    inviteLink?: string;   // created only after verification/payment
    status: AgentStatus;   // starts as "Pending" until verification is complete
}