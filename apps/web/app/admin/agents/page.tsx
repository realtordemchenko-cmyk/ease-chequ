"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdmin } from "../../../context/AdminStore";
import { Agent } from "../../../types/Agent";
export default function AgentsPage() {
    const { agents, addAgent, updateAgent, deleteAgent, regenerateInviteLink } = useAdmin();

    const [search, setSearch] = useState("");
    const [formData, setFormData] = useState<Agent>({
        id: 0,
        name: "",
        email: "",
        boardMemberNumber: "",
        accessUntil: "",
        inviteLink: "",
        status: "Pending",
    });
    const [isEditing, setIsEditing] = useState(false);

    const filteredAgents = useMemo(
        () =>
            agents.filter(
                (a) =>
                    a.name.toLowerCase().includes(search.toLowerCase()) ||
                    a.email.toLowerCase().includes(search.toLowerCase()) ||
                    a.boardMemberNumber.toLowerCase().includes(search.toLowerCase())
            ),
        [agents, search]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, email, boardMemberNumber } = formData;
        if (!name.trim() || !email.trim() || !boardMemberNumber.trim()) return;

        if (isEditing) {
            if (window.confirm(`Save changes for agent ${formData.name}?`)) {
                updateAgent(formData);
            }
        } else {
            const { id, inviteLink, ...payload } = formData;
            addAgent({ ...payload, status: formData.status });
        }

        setFormData({
            id: 0,
            name: "",
            email: "",
            boardMemberNumber: "",
            accessUntil: "",
            inviteLink: "",
            status: "Pending",
        });
        setIsEditing(false);
    };

    const handleEdit = (agent: Agent) => {
        if (window.confirm(`Are you sure you want to edit the details of ${agent.name}?`)) {
            setFormData(agent);
            setIsEditing(true);
        }
    };

    const handleDelete = (id: number) => {
        const target = agents.find((a) => a.id === id);
        if (target && window.confirm(`Are you sure you want to delete ${target.name}?`)) {
            deleteAgent(id);
            if (formData.id === id) {
                setFormData({
                    id: 0,
                    name: "",
                    email: "",
                    boardMemberNumber: "",
                    accessUntil: "",
                    inviteLink: "",
                    status: "Pending",
                });
                setIsEditing(false);
            }
        }
    };

    const handleCancel = () => {
        setFormData({
            id: 0,
            name: "",
            email: "",
            boardMemberNumber: "",
            accessUntil: "",
            inviteLink: "",
            status: "Pending",
        });
        setIsEditing(false);
    };

    return (
        <section style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
            {/* Form */}
            <div>
                <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
                    {isEditing ? "Edit Agent" : "Add Agent"}
                </h1>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Board Member #"
                        value={formData.boardMemberNumber}
                        onChange={(e) => setFormData({ ...formData, boardMemberNumber: e.target.value })}
                    />
                    <input
                        type="date"
                        placeholder="Access Until"
                        value={formData.accessUntil}
                        onChange={(e) => setFormData({ ...formData, accessUntil: e.target.value })}
                    />
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as Agent["status"] })}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Expired">Expired</option>
                    </select>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button type="submit">{isEditing ? "Save" : "Add"}</button>
                        {isEditing && (
                            <button type="button" onClick={handleCancel}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Table */}
            <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Agents</h2>
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
                            <th style={{ textAlign: "left", padding: 8 }}>Name</th>
                            <th style={{ textAlign: "left", padding: 8 }}>Email</th>
                            <th style={{ textAlign: "left", padding: 8 }}>Board #</th>
                            <th style={{ textAlign: "left", padding: 8 }}>Access Until</th>
                            <th style={{ textAlign: "left", padding: 8 }}>Invite Link</th>
                            <th style={{ textAlign: "left", padding: 8 }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAgents.map((agent) => (

                            <tr key={agent.id}>
                                <td style={{ padding: 8 }}>{agent.id}</td>
                                <td style={{ padding: 8 }}>{agent.name}</td>
                                <td style={{ padding: 8 }}>{agent.email}</td>
                                <td style={{ padding: 8 }}>{agent.boardMemberNumber}</td>
                                <td style={{ padding: 8 }}>{agent.accessUntil ?? "—"}</td>
                                <td style={{ padding: 8 }}>
                                    <a href={agent.inviteLink} target="_blank" rel="noreferrer">
                                        {agent.inviteLink}
                                    </a>

                                </td>
                                <td style={{ padding: 8 }}>{agent.status ?? "—"}</td>
                                <td style={{ padding: 8, display: "flex", gap: 8 }}>
                                    <button
                                        onClick={() => handleEdit(agent)}
                                        style={{
                                            padding: "4px 8px",
                                            background: "var(--secondary-bg)",
                                            border: "none",
                                            borderRadius: 4,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(agent.id)}
                                        style={{
                                            padding: "4px 8px",
                                            background: "var(--danger-bg)",
                                            border: "none",
                                            borderRadius: 4,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Delete
                                    </button>
                                    <Link
                                        href={`/admin/agents/${agent.id}`}
                                        style={{
                                            padding: "4px 8px",
                                            background: "var(--primary-bg)",
                                            borderRadius: 4,
                                            textDecoration: "none",
                                            color: "white",
                                        }}
                                    >
                                        Open
                                    </Link>
                                    <button
                                        onClick={() => regenerateInviteLink(agent.id)}
                                        style={{
                                            padding: "4px 8px",
                                            background: "var(--secondary-bg)",
                                            border: "none",
                                            borderRadius: 4,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Regenerate Link
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredAgents.length === 0 && (
                            <tr>
                                <td
                                    colSpan={8}
                                    style={{
                                        padding: 12,
                                        textAlign: "center",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    No agents found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}