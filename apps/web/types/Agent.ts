// apps/web/types/Agent.ts
export interface Agent {
    id: number;
    name: string;
    status: "Active" | "Inactive" | "Busy";
}