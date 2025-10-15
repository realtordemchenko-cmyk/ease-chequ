export interface Request {
    id: string;
    type: "Access" | "Update" | "Other";
    name: string;
    email: string;
    boardMemberNumber: string;
    date: string;
    status: "Pending" | "Approved" | "Rejected";
}