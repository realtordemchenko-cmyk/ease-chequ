// apps/web/app/admin/requests/page.tsx
"use client";

import { useAdmin } from "../../../context/AdminStore";
import { RequestStatusBadge } from "@/components/requests/RequestStatusBadge";

export default function RequestsPage() {
    const { requests, setRequestStatus } = useAdmin();

    return (
        <section>
            <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Requests</h1>
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "var(--card-bg)",
                    color: "var(--secondary-text)",
                    border: `1px solid var(--card-border)`,
                }}
            >
                <thead>
                    <tr>
                        <th style={{ textAlign: "left", padding: 8 }}>ID</th>
                        <th style={{ textAlign: "left", padding: 8 }}>Type</th>
                        <th style={{ textAlign: "left", padding: 8 }}>Name</th>
                        <th style={{ textAlign: "left", padding: 8 }}>Email</th>
                        <th style={{ textAlign: "left", padding: 8 }}>Board #</th>
                        <th style={{ textAlign: "left", padding: 8 }}>Date</th>
                        <th style={{ textAlign: "left", padding: 8 }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((r) => {
                        const status = r.status.toLowerCase();
                        return (
                            <tr key={r.id}>
                                <td style={{ padding: 8 }}>{r.id}</td>
                                <td style={{ padding: 8 }}>{r.type}</td>
                                <td style={{ padding: 8 }}>{r.name}</td>
                                <td style={{ padding: 8 }}>{r.email ?? "—"}</td>
                                <td style={{ padding: 8 }}>{r.boardMemberNumber ?? "—"}</td>
                                <td style={{ padding: 8 }}>{r.date}</td>
                                <td style={{ padding: 8 }}>
                                    <RequestStatusBadge status={status as "pending" | "approved" | "rejected"} />
                                    <div style={{ marginTop: 6 }}>
                                        <select
                                            value={r.status}
                                            onChange={(e) =>
                                                setRequestStatus(r.id, e.target.value as "Pending" | "Approved" | "Rejected")
                                            } style={{
                                                padding: "4px 6px",
                                                borderRadius: 4,
                                                border: "1px solid var(--card-border)",
                                                background: "var(--card-bg)",
                                                color: "var(--secondary-text)",
                                            }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {requests.length === 0 && (
                        <tr>
                            <td colSpan={7} style={{ padding: 12, textAlign: "center", color: "var(--text-muted)" }}>
                                No requests found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
}