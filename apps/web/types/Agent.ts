export interface Agent {
    id: string;
    name: string;
    email: string;
    boardMemberNumber: string;
    accessUntil: string;
    inviteLink: string;
    status: "Pending" | "Active" | "Inactive" | "Busy";
}