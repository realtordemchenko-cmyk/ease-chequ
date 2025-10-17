// apps/web/types/Agent.ts

export type AgentStatus = "Active" | "Inactive" | "Deleted";

export interface Agent {
    id: string;
    name: string;
    email: string;
    status: AgentStatus;
    boardMemberNumber: string;
    accessUntil: string;
    inviteLink: string;
}