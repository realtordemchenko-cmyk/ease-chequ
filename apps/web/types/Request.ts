// apps/web/types/Request.ts
export type RequestStatus = "Pending" | "Approved" | "Rejected";

export interface RequestBase {
    id: string;
    status: RequestStatus;
    createdAt: string;
}

/**
 * Agent registration request
 * This request is approved first, then agent is created with status "Pending".
 * Access remains restricted until verification and payment are completed.
 */
export interface AgentRequest extends RequestBase {
    type: "Agent";
    name: string;
    email?: string;
    boardMemberNumber?: string;
}

/**
 * Placeholder for other request kinds (extend as needed).
 */
export interface GenericRequest extends RequestBase {
    type: "Generic";
    title: string;
    description?: string;
}

export type Request = AgentRequest | GenericRequest;