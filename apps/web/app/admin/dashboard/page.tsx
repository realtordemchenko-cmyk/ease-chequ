"use client";

import { useAdmin } from "context/AdminStore";

export default function DashboardPage() {
    const { agents, archivedAgents, requests, archivedRequests } = useAdmin();

    const activeAgents = agents.filter((a) => a.status === "Active").length;
    const deletedAgents = archivedAgents.length;

    const pendingRequests = requests.filter((r) => r.status === "Pending").length;
    const approvedRequests = archivedRequests.filter((r) => r.status === "Approved").length;
    const rejectedRequests = archivedRequests.filter((r) => r.status === "Rejected").length;

    return (
        <div>
            <h1>Dashboard</h1>
            <div style={{ display: "grid", gap: "12px", maxWidth: "400px" }}>
                <div style={{ padding: "8px", border: "1px solid #ccc" }}>
                    <strong>Active Agents:</strong> {activeAgents}
                </div>
                <div style={{ padding: "8px", border: "1px solid #ccc" }}>
                    <strong>Deleted Agents:</strong> {deletedAgents}
                </div>
                <div style={{ padding: "8px", border: "1px solid #ccc" }}>
                    <strong>Pending Requests:</strong> {pendingRequests}
                </div>
                <div style={{ padding: "8px", border: "1px solid #ccc" }}>
                    <strong>Approved Requests:</strong> {approvedRequests}
                </div>
                <div style={{ padding: "8px", border: "1px solid #ccc" }}>
                    <strong>Rejected Requests:</strong> {rejectedRequests}
                </div>
            </div>
        </div>
    );
}