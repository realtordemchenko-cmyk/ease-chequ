export interface Agent {
    id: string; // строковый id для унификации
    name: string;
    email: string;
    membershipNumber: string;
    accessUntil: string | null;
    inviteLink: string | null;
    status: string; // e.g., "active" | "inactive" | "suspended"
    clients?: any[]; // упрощённо; позже заменим на тип Client
}