"use client";

import { useAdmin } from "context/AdminStore";
import { Request } from "types/Request";

export default function RequestsPage() {
    const { requests, approveRequest, rejectRequest, currentAdminRole } = useAdmin();
    const isViewer = currentAdminRole === "Viewer";

    return (
        <div>
            <h1>Requests</h1>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Membership #</th>
                        <th>Date</th>
                        <th>Status</th>
                        {!isViewer && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req: Request) => (
                        <tr key={req.id}>
                            <td>{req.type}</td>
                            <td>{req.name}</td>
                            <td>{req.email}</td>
                            <td>{req.boardMemberNumber}</td>
                            <td>{new Date(req.date).toLocaleString()}</td>
                            <td>{req.status}</td>
                            {!isViewer && req.status === "Pending" && (
                                <td>
                                    <button style={{ marginRight: "8px" }} onClick={() => approveRequest(req.id)}>
                                        Approve
                                    </button>
                                    <button style={{ background: "red", color: "white" }} onClick={() => rejectRequest(req.id)}>
                                        Reject
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}