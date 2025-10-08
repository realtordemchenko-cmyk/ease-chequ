// apps/web/app/admin/clients/[id]/page.tsx
"use client";

import Link from "next/link";

interface Client {
    id: number;
    name: string;
    status: string;
    contact: string;
    notes: string;
}

function getClientById(id: number): Client | null {
    // Mock data — заменить на API позже
    const clients: Client[] = [
        { id: 101, name: "Contoso Ltd.", status: "Active", contact: "contoso@example.com", notes: "VIP client" },
        { id: 102, name: "Northwind Inc.", status: "Pending", contact: "northwind@example.com", notes: "Awaiting approval" },
        { id: 201, name: "Fabrikam Co.", status: "Active", contact: "fabrikam@example.com", notes: "Long-term partner" },
        { id: 301, name: "Adventure Works", status: "Suspended", contact: "adventure@example.com", notes: "Payment issues" },
    ];
    return clients.find((c) => c.id === id) ?? null;
}

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
    const idNum = Number(params.id);
    const client = getClientById(idNum);

    if (!client) {
        return (
            <section style={{ color: "var(--secondary-text)" }}>
                <div style={{ marginBottom: 12 }}>
                    <Link
                        href="/admin/agents"
                        style={{
                            textDecoration: "none",
                            background: "var(--secondary-bg)",
                            color: "var(--secondary-text)",
                            padding: "6px 10px",
                            borderRadius: 4,
                        }}
                    >
                        ← Back to Agents
                    </Link>
                </div>
                <div
                    style={{
                        background: "var(--card-bg)",
                        border: `1px solid var(--card-border)`,
                        borderRadius: 8,
                        padding: 16,
                    }}
                >
                    Client not found
                </div>
            </section>
        );
    }

    return (
        <section style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
            {/* Client summary */}
            <div
                style={{
                    background: "var(--card-bg)",
                    border: `1px solid var(--card-border)`,
                    borderRadius: 8,
                    padding: 16,
                    color: "var(--secondary-text)",
                    height: "fit-content",
                }}
            >
                <div style={{ marginBottom: 12 }}>
                    <Link
                        href="/admin/agents"
                        style={{
                            textDecoration: "none",
                            background: "var(--secondary-bg)",
                            color: "var(--secondary-text)",
                            padding: "6px 10px",
                            borderRadius: 4,
                        }}
                    >
                        ← Back to Agents
                    </Link>
                </div>
                <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
                    {client.name}
                </h1>
                <div style={{ color: "var(--text-muted)", marginBottom: 16 }}>
                    ID: {client.id} · Status: {client.status}
                </div>
                <div style={{ marginBottom: 8 }}>📧 {client.contact}</div>
                <div style={{ fontStyle: "italic", color: "var(--text-muted)" }}>
                    {client.notes}
                </div>
            </div>

            {/* Activity / history */}
            <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: "var(--secondary-text)" }}>
                    Activity History
                </h2>
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
                            <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>Date</th>
                            <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>Event</th>
                            <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>2025-10-01</td>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>Request Submitted</td>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>New service request created</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>2025-10-03</td>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>Agent Assigned</td>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>Assigned to Alice</td>
                        </tr>
                        <tr>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>2025-10-05</td>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>Status Updated</td>
                            <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>Changed to Active</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
}