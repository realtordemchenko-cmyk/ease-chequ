"use client";

import React from "react";
import { AdminProvider, useAdmin } from "../../context/AdminStore";

function DashboardContent() {
    const {
        agents,
        clients,
        requests,
        archivedAgents,
        archivedRequests,
    } = useAdmin();

    const approvedArchived = archivedRequests.filter((r) => r.status === "Approved").length;
    const rejectedArchived = archivedRequests.filter((r) => r.status === "Rejected").length;

    return (
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(3, 1fr)", padding: 16 }}>
            <div style={{ padding: 12, border: "1px solid var(--card-border)", borderRadius: 6 }}>
                <h3>Agents</h3>
                <p>{agents.length}</p>
            </div>

            <div style={{ padding: 12, border: "1px solid var(--card-border)", borderRadius: 6 }}>
                <h3>Clients</h3>
                <p>{clients.length}</p>
            </div>

            <div style={{ padding: 12, border: "1px solid var(--card-border)", borderRadius: 6 }}>
                <h3>Requests</h3>
                <p>{requests.length}</p>
            </div>

            <div style={{ padding: 12, border: "1px solid var(--card-border)", borderRadius: 6 }}>
                <h3>Deleted Agents (Archive)</h3>
                <p>{archivedAgents.length}</p>
            </div>

            <div style={{ padding: 12, border: "1px solid var(--card-border)", borderRadius: 6 }}>
                <h3>Approved Requests (Archive)</h3>
                <p>{approvedArchived}</p>
            </div>

            <div style={{ padding: 12, border: "1px solid var(--card-border)", borderRadius: 6 }}>
                <h3>Rejected Requests (Archive)</h3>
                <p>{rejectedArchived}</p>
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    // Local provider wrap to avoid reliance on layout while we restore it safely
    return (
        <AdminProvider>
            <DashboardContent />
        </AdminProvider>
    );
}