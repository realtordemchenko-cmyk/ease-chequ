// apps/web/app/admin/agents/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdmin, Agent } from "../../../context/AdminStore";

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
            if (window.confirm(`Сохранить изменения для агента ${formData.name}?`)) {
                updateAgent(formData);
            }
        } else {
            const { id, inviteLink, ...payload } = formData;
            addAgent(payload);
        }

        setFormData({ id: 0, name: "", email: "", boardMemberNumber: "", accessUntil: "", inviteLink: "" });
        setIsEditing(false);
    };

    const handleEdit = (agent: Agent) => {
        if (window.confirm(`Редактировать данные агента ${agent.name}?`)) {
            setFormData(agent);
            setIsEditing(true);
        }
    };

    const handleDelete = (id: number) => {
        const target = agents.find((a) => a.id === id);
        if (target && window.confirm(`Удалить агента ${target.name}?`)) {
            deleteAgent(id);
            if (formData.id === id) {
                setFormData({ id: 0, name: "", email: "", boardMemberNumber: "", accessUntil: "", inviteLink: "" });
                setIsEditing(false);
            }
        }
    };

    const handleCancel = () => {
        setFormData({ id: 0, name: "", email: "", boardMemberNumber: "", accessUntil: "", inviteLink: "" });
        setIsEditing(false);
    };

    return (
        <section style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
            {/* Form */}
            <div>
                <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
                    {isEditing ? "Edit Agent" : "Add Agent"}
                </h1>
                <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 520 }}
                >
                    <label style={{ display: "grid", gap: 6 }}>
                        <span>Name:</span>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: "100%", padding: 6 }}
                        />
                    </label>

                    <label style={{ display: "grid", gap: 6 }}>
                        <span>Email:</span>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ width: "100%", padding: 6 }}
                        />
                    </label>

                    <label style={{ display: "grid", gap: 6 }}>
                        <span>Board member #:</span>
                        <input
                            type="text"
                            value={formData.boardMemberNumber}
                            onChange={(e) => setFormData({ ...formData, boardMemberNumber: e.target.value })}
                            style={{ width: "100%", padding: 6 }}
                        />
                    </label>

                    <label style={{ display: "grid", gap: 6 }}>
                        <span>Access until:</span>
                        <input
                            type="date"
                            value={formData.accessUntil ?? ""}
                            onChange={(e) => setFormData({ ...formData, accessUntil: e.target.value })}
                            style={{ width: "100%", padding: 6 }}
                        />
                    </label>

                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            type="submit"
                            style={{
                                padding: "8px 12px",
                                background: "var(--primary-bg)",
                                color: "var(--primary-text)",
                                border: "none",
                                borderRadius: 4,
                                cursor: "pointer",
                            }}
                        >
                            {isEditing ? "Update" : "Save"}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                style={{
                                    padding: "8px 12px",
                                    background: "var(--secondary-bg)",
                                    color: "var(--secondary-text)",
                                    border: "none",
                                    borderRadius: 4,
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Table */}
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600 }}>Agents List</h2>
                    <input
                        type="text"
                        placeholder="Search agents..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            padding: 6,
                            width: "280px",
                            border: `1px solid var(--card-border)`,
                            background: "var(--input-bg)",
                        }}
                    />
                </div>

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
                            <th style={{ textAlign: "left", padding: 8 }}>Access until</th>
                            <th style={{ textAlign: "left", padding: 8 }}>Invite Link</th>
                            <th style={{ textAlign: "left", padding: 8 }}>Actions</th>
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
                                <td style={{ padding: 8, display: "flex", gap: 8 }}>
                                    <button
                                        onClick={() => handleEdit(agent)}
                                        style={{ padding: "4px 8px", background: "var(--secondary-bg)", border: "none", borderRadius: 4 }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(agent.id)}
                                        style={{ padding: "4px 8px", background: "var(--danger-bg)", border: "none", borderRadius: 4 }}
                                    >
                                        Delete
                                    </button>
                                    <Link
                                        href={`/admin/agents/${agent.id}`}
                                        style={{ padding: "4px 8px", background: "var(--primary-bg)", borderRadius: 4, textDecoration: "none" }}
                                    >
                                        Open
                                    </Link>
                                    <button
                                        onClick={() => regenerateInviteLink(agent.id)}
                                        style={{ padding: "4px 8px", background: "var(--secondary-bg)", border: "none", borderRadius: 4 }}
                                    >
                                        Regenerate Link
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredAgents.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
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