// apps/web/app/admin/agents/[id]/page.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdmin } from "../../../../context/AdminStore";
import { Agent } from "../../../../types/Agent";

export default function AgentDetailsPage() {
    const { id } = useParams() as { id: string };
    const { agents, deleteAgent, updateAgent, addLog, clients, detachClient } = useAdmin();

    const agent = agents.find((a) => a.id === id);
    const attachedClients = clients.filter((c) => c.agentId === id);

    if (!agent) {
        return (
            <section style={{ color: "var(--secondary-text)" }}>
                <div style={{ marginBottom: 12 }}>
                    <Link href="/admin/agents" style={{ textDecoration: "none", background: "var(--secondary-bg)", color: "var(--secondary-text)", padding: "6px 10px", borderRadius: 4 }}>← Back to Agents</Link>
                </div>
                <div style={{ background: "var(--card-bg)", border: `1px solid var(--card-border)`, borderRadius: 8, padding: 16 }}>Agent not found</div>
            </section>
        );
    }

    const handleDetach = (clientId: string) => {
        if (window.confirm("Detach this client from agent?")) {
            detachClient(clientId);
            addLog({ type: "Agent", message: `Client ${clientId} detached from ${agent.name}` });
        }
    };

    const handleDeleteAgent = () => {
        if (window.confirm(`Delete agent ${agent.name}?`)) {
            deleteAgent(agent.id);
        }
    };

    return (
        <section style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
            {/* Agent summary */}
            <div style={{ background: "var(--card-bg)", border: `1px solid var(--card-border)`, borderRadius: 8, padding: 16, color: "var(--secondary-text)", height: "fit-content" }}>
                <div style={{ marginBottom: 12 }}>
                    <Link href="/admin/agents" style={{ textDecoration: "none", background: "var(--secondary-bg)", color: "var(--secondary-text)", padding: "6px 10px", borderRadius: 4 }}>← Back to Agents</Link>
                </div>
                <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{agent.name}</h1>
                <div style={{ color: "var(--text-muted)", marginBottom: 16 }}>
                    Email: {agent.email} <br />
                    Board #: {agent.boardMemberNumber} <br />
                    Status: {agent.status ?? "—"} <br />
                    Access until: {agent.accessUntil ?? "—"}
                </div>
                <div style={{ marginBottom: 8 }}>
                    Invite link: {agent.inviteLink ? <a href={agent.inviteLink} target="_blank" rel="noreferrer">{agent.inviteLink}</a> : "—"}
                </div>

                {/* Status editor */}
                <div style={{ marginTop: 16 }}>
                    <label style={{ display: "block", marginBottom: 4 }}>Change Status:</label>
                    <select
                        value={agent.status}
                        onChange={(e) => updateAgent({ ...agent, status: e.target.value as Agent["status"] })}
                        style={{ padding: "6px 10px", borderRadius: 4, border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--secondary-text)" }}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Busy">Busy</option>
                    </select>
                </div>

                <div style={{ marginTop: 16 }}>
                    <button onClick={handleDeleteAgent} style={{ padding: "6px 10px", background: "var(--danger-bg)", color: "var(--danger-text)", border: "none", borderRadius: 4, cursor: "pointer" }}>
                        Delete agent
                    </button>
                </div>
            </div>

            {/* Clients list */}
            <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: "var(--secondary-text)" }}>Clients attached to {agent.name}</h2>
                <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--card-bg)", color: "var(--secondary-text)", border: `1px solid var(--card-border)` }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left", padding: 8 }}>Client ID</th>
                            <th style={{ textAlign: "left", padding: 8 }}>Name</th>
                            <th style={{ textAlign: "left", padding: 8 }}>Status</th>
                            <th style={{ textAlign: "left", padding: 8 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attachedClients.map((c) => (
                            <tr key={c.id}>
                                <td style={{ padding: 8 }}>{c.id}</td>
                                <td style={{ padding: 8 }}>{c.name}</td>
                                <td style={{ padding: 8 }}>{c.status}</td>
                                <td style={{ padding: 8, display: "flex", gap: 8 }}>
                                    <button onClick={() => handleDetach(c.id)} style={{ padding: "4px 8px", background: "var(--danger-bg)", color: "var(--danger-text)", border: "none", borderRadius: 4, cursor: "pointer" }}>
                                        Detach
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {attachedClients.length === 0 && (
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