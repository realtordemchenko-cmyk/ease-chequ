"use client";

// Agent details page:
// - Back to Agents button
// - Status select aligned to AgentStatus ("Active" | "Inactive" | "Deleted")
// - Editable fields (name, email, boardMemberNumber, accessUntil) for Admin/Super Admin
// - Invite link regeneration
// - Clients of this agent: table filtered by agentId with delete action for Admin/Super Admin
// All logic uses store methods; no local collection mutations.

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdmin } from "context/AdminStore";
import { Agent } from "types/Agent";
import { useEffect, useMemo, useState } from "react";

export default function AgentDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const {
        agents,
        clients,
        updateAgent,
        regenerateInviteLink,
        deleteClient,
        currentAdminRole,
    } = useAdmin();

    const agent = agents.find((a) => a.id === id);
    const isViewer = currentAdminRole === "Viewer";

    // Local editable state mirrors the agent; updated only by store on save.
    const [form, setForm] = useState<Omit<Agent, "id"> | null>(null);

    useEffect(() => {
        if (agent) {
            setForm({
                name: agent.name,
                email: agent.email,
                status: agent.status,
                boardMemberNumber: agent.boardMemberNumber,
                accessUntil: agent.accessUntil,
                inviteLink: agent.inviteLink,
            });
        }
    }, [agent]);

    // Filter clients belonging to this agent
    const agentClients = useMemo(
        () => clients.filter((c) => c.agentId === id),
        [clients, id]
    );

    if (!agent || !form) {
        return (
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Link href="/admin/agents">← Back to Agents</Link>
                    <h1 style={{ margin: 0 }}>Agent Details</h1>
                </div>
                <p>Agent not found</p>
            </div>
        );
    }

    const handleSave = () => {
        // Persist edits via store; id remains unchanged
        updateAgent({
            id: agent.id,
            ...form,
        });
    };

    return (
        <div style={{ display: "grid", gap: 24 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Link href="/admin/agents">← Back to Agents</Link>
                <h1 style={{ margin: 0 }}>Agent Details</h1>
            </div>

            {/* Agent info */}
            <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
                {/* Name */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span><strong>Name</strong></span>
                    {isViewer ? (
                        <span>{agent.name}</span>
                    ) : (
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    )}
                </label>

                {/* Email */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span><strong>Email</strong></span>
                    {isViewer ? (
                        <span>{agent.email}</span>
                    ) : (
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    )}
                </label>

                {/* Status (aligned to AgentStatus) */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span><strong>Status</strong></span>
                    {isViewer ? (
                        <span>{agent.status}</span>
                    ) : (
                        <select
                            value={form.status}
                            onChange={(e) =>
                                setForm({ ...form, status: e.target.value as Agent["status"] })
                            }
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Deleted">Deleted</option>
                        </select>
                    )}
                </label>

                {/* Membership number */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span><strong>Membership #</strong></span>
                    {isViewer ? (
                        <span>{agent.boardMemberNumber}</span>
                    ) : (
                        <input
                            type="text"
                            value={form.boardMemberNumber}
                            onChange={(e) =>
                                setForm({ ...form, boardMemberNumber: e.target.value })
                            }
                        />
                    )}
                </label>

                {/* Access until */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span><strong>Access Until</strong></span>
                    {isViewer ? (
                        <span>{agent.accessUntil}</span>
                    ) : (
                        <input
                            type="date"
                            value={form.accessUntil}
                            onChange={(e) => setForm({ ...form, accessUntil: e.target.value })}
                        />
                    )}
                </label>

                {/* Invite link and regeneration */}
                <div style={{ display: "grid", gap: 6 }}>
                    <span><strong>Invite Link</strong></span>
                    {agent.inviteLink ? (
                        <a href={agent.inviteLink} target="_blank" rel="noopener noreferrer">
                            {agent.inviteLink}
                        </a>
                    ) : (
                        <span>Not generated</span>
                    )}
                    {!isViewer && (
                        <button type="button" onClick={() => regenerateInviteLink(agent.id)}>
                            Regenerate Invite Link
                        </button>
                    )}
                </div>

                {/* Save button */}
                {!isViewer && (
                    <div style={{ display: "flex", gap: 8 }}>
                        <button type="button" onClick={handleSave}>
                            Save changes
                        </button>
                    </div>
                )}
            </div>

            {/* Clients of this agent */}
            <section>
                <h2 style={{ margin: "0 0 8px 0" }}>Clients of this agent</h2>
                {agentClients.length === 0 ? (
                    <p>No clients linked to this agent yet.</p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: "left" }}>Name</th>
                                <th style={{ textAlign: "left" }}>Email</th>
                                <th style={{ textAlign: "left" }}>Phone</th>
                                {!isViewer && <th style={{ textAlign: "left" }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {agentClients.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.name}</td>
                                    <td>{c.email}</td>
                                    <td>{c.phone || ""}</td>
                                    {!isViewer && (
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => deleteClient(c.id)}
                                                style={{ backgroundColor: "red", color: "white" }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}