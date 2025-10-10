export type Agent = {
    id: number;
    name: string;
    email: string;
    boardMemberNumber: string;
    accessUntil: string;
    inviteLink: string;
    status?: "Pending" | "Active" | "Suspended" | "Expired"; // ← обязательно
};