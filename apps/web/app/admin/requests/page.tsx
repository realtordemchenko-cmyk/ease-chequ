// apps/web/app/admin/requests/page.tsx
"use client";

import { useAdmin } from "../../../context/AdminStore";

export default function RequestsPage() {
    const { requests, approveRequest, rejectRequest, setRequestStatus } = useAdmin();

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
                        <th style={{ textAlign: "left", padding: 8 }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((r) => (
                        <tr key={r.id}>
                            <td style={{ padding: 8 }}>{r.id}</td>
                            <td style={{ padding: 8 }}>{r.type}</td>
                            <td style={{ padding: 8 }}>{r.name}</td>
                            <td style={{ padding: 8 }}>{r.email ?? "—"}</td>
                            <td style={{ padding: 8 }}>{r.boardMemberNumber ?? "—"}</td>
                            <td style={{ padding: 8 }}>{r.date}</td>
                            <td style={{ padding: 8 }}>{r.status}</td>
                            <td style={{ padding: 8, display: "flex", gap: 8 }}>
                                {r.status === "Pending" && (
                                    <>
                                        <button
                                            onClick={() => approveRequest(r.id)}
                                            style={{
                                                padding: "4px 8px",
                                                background: "var(--primary-bg)",
                                                color: "var(--primary-text)",
                                                border: "none",
                                                borderRadius: 4,
                                                cursor: "pointer",
                                            }}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => rejectRequest(r.id)}
                                            style={{
                                                padding: "4px 8px",
                                                background: "var(--danger-bg)",
                                                color: "var(--danger-text)",
                                                border: "none",
                                                borderRadius: 4,
                                                cursor: "pointer",
                                            }}
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                {r.status === "Rejected" && (
                                    <>
                                        <button
                                            onClick={() => approveRequest(r.id)}
                                            style={{
                                                padding: "4px 8px",
                                                background: "var(--primary-bg)",
                                                color: "var(--primary-text)",
                                                border: "none",
                                                borderRadius: 4,
                                                cursor: "pointer",
                                            }}
                                        >
                                            Approve Again
                                        </button>
                                        <button
                                            onClick={() => setRequestStatus(r.id, "Pending")}
                                            style={{
                                                padding: "4px 8px",
                                                background: "var(--warning-bg)",
                                                color: "var(--warning-text)",
                                                border: "none",
                                                borderRadius: 4,
                                                cursor: "pointer",
                                            }}
                                        >
                                            Reset to Pending
                                        </button>
                                    </>
                                )}
                                {r.status === "Approved" && (
                                    <button
                                        onClick={() => setRequestStatus(r.id, "Pending")}
                                        style={{
                                            padding: "4px 8px",
                                            background: "var(--warning-bg)",
                                            color: "var(--warning-text)",
                                            border: "none",
                                            borderRadius: 4,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Reset to Pending
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {requests.length === 0 && (
                        <tr>
                            <td
                                colSpan={8}
                                style={{ padding: 12, textAlign: "center", color: "var(--text-muted)" }}
                            >
                                No requests found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
}