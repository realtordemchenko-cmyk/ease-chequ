// Request used in admin requests page and archive.
// Status literals must exactly match ArchivePage filtering: "Pending" | "Approved" | "Rejected".
export type RequestStatus = "Pending" | "Approved" | "Rejected";

export interface Request {
    id: string;
    name: string;   // typically client name
    email: string;  // client email
    type: string;   // e.g., "Prequal-Rent"
    status: RequestStatus;
}