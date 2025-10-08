// apps/web/app/admin/agents/[id]/page.tsx
"use client";
import Link from "next/link";

interface Agent {
    id: number;
    name: string;
    role: string;
}

interface Client {
    id: number;
    name: string;
    status: string;
}

function getAgentById(id: number): Agent | null {
    // Mock: replace with real data source later
    const agents: Agent[] = [
        { id: 1, name: "Alice", role: "Manager" },
        { id: 2, name: "Bob", role: "Support" },
        { id: 3, name: "Charlie", role: "Developer" },
    ];
    return agents.find((a) => a.id === id) ?? null;
}

function getClientsForAgent(id: number): Client[] {
    // Mock relations per agent
    const map: Record<number, Client[]> = {
        1: [
            { id: 101, name: "Contoso Ltd.", status: "Active" },
            { id: 102, name: "Northwind Inc.", status: "Pending" },
        ],
        2: [
            { id: 201, name: "Fabrikam Co.", status: "Active" },
        ],
        3: [
            { id: 301, name: "Adventure Works", status: "Suspended" },
            { id: 302, name: "Tailspin Toys", status: "Active" },
            { id: 303, name: "Woodgrove Bank", status: "Active" },
        ],
    };
    return map[id] ?? [];
}

export default function AgentDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const idNum = Number(params.id);
    const agent = getAgentById(idNum);
    const clients = getClientsForAgent(idNum);

    if (!agent) {
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
                    Agent not found
                </div>
            </section>
        );
    }

    return (
        <section style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
            {/* Agent summary */}
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
                    {agent.name}
                </h1>
                <div style={{ color: "var(--text-muted)", marginBottom: 16 }}>
                    ID: {agent.id} · Role: {agent.role}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <Link
                        href={`/admin/agents?edit=${agent.id}`}
                        style={{
                            background: "var(--primary-bg)",
                            color: "var(--primary-text)",
                            padding: "6px 10px",
                            borderRadius: 4,
                            textDecoration: "none",
                        }}
                    >
                        Edit in list
                    </Link>
                    <button
                        style={{
                            background: "var(--danger-bg)",
                            color: "var(--danger-text)",
                            padding: "6px 10px",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                        }}
                        onClick={() => alert("Delete flow will be wired to API later")}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Clients list */}
            <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: "var(--secondary-text)" }}>
                    Clients attached to {agent.name}
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
                            <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>Client ID</th>
                            <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>Name</th>
                            <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>Status</th>
                            <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((c) => (
                            <tr key={c.id}>
                                <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>{c.id}</td>
                                <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>{c.name}</td>
                                <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>{c.status}</td>
                                <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)`, display: "flex", gap: 8 }}>
                                    <button
                                        style={{
                                            background: "var(--secondary-bg)",
                                            color: "var(--secondary-text)",
                                            padding: "4px 8px",
                                            border: "none",
                                            borderRadius: 4,
                                            cursor: "pointer",
                                        }}
                                        onClick={() => alert("Open client details (to be implemented)")}
                                    >
                                        Open
                                    </button>
                                    <button
                                        style={{
                                            background: "var(--danger-bg)",
                                            color: "var(--danger-text)",
                                            padding: "4px 8px",
                                            border: "none",
                                            borderRadius: 4,
                                            cursor: "pointer",
                                        }}
                                        onClick={() => alert("Detach client (to be implemented)")}
                                    >
                                        Detach
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {clients.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: 12, textAlign: "center", color: "var(--text-muted)" }}>
                                    No clients attached
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}