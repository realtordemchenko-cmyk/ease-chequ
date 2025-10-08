// apps/web/app/admin/agents/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface Agent {
    id: number;
    name: string;
    role: string;
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([
        { id: 1, name: "Alice", role: "Manager" },
        { id: 2, name: "Bob", role: "Support" },
        { id: 3, name: "Charlie", role: "Developer" },
    ]);

    const [search, setSearch] = useState("");
    const [formData, setFormData] = useState({ id: 0, name: "", role: "" });
    const [isEditing, setIsEditing] = useState(false);

    // Optional: support deep-link editing via ?edit=ID
    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        const editId = Number(params.get("edit"));
        if (editId) {
            const target = agents.find((a) => a.id === editId);
            if (target) {
                setFormData(target);
                setIsEditing(true);
            }
        }
    }, []);

    const filteredAgents = useMemo(
        () =>
            agents.filter(
                (a) =>
                    a.name.toLowerCase().includes(search.toLowerCase()) ||
                    a.role.toLowerCase().includes(search.toLowerCase())
            ),
        [agents, search]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.role.trim()) return;

        if (isEditing) {
            setAgents((prev) =>
                prev.map((a) => (a.id === formData.id ? { ...formData } as Agent : a))
            );
        } else {
            setAgents((prev) => [
                ...prev,
                { id: Date.now(), name: formData.name, role: formData.role },
            ]);
        }

        setFormData({ id: 0, name: "", role: "" });
        setIsEditing(false);
        // clear query param if present
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.delete("edit");
            window.history.replaceState(null, "", url.toString());
        }
    };

    const handleEdit = (agent: Agent) => {
        setFormData(agent);
        setIsEditing(true);
        // set deep-link param for consistency
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set("edit", String(agent.id));
            window.history.replaceState(null, "", url.toString());
        }
    };

    const handleDelete = (id: number) => {
        setAgents((prev) => prev.filter((a) => a.id !== id));
        if (formData.id === id) {
            setFormData({ id: 0, name: "", role: "" });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setFormData({ id: 0, name: "", role: "" });
        setIsEditing(false);
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.delete("edit");
            window.history.replaceState(null, "", url.toString());
        }
    };

    return (
        <section style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
            {/* Form */}
            <div>
                <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
                    {isEditing ? "Edit Agent" : "Add Agent"}
                </h1>
                <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}
                >
                    <label>
                        Name:
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: "100%", padding: 6 }}
                        />
                    </label>
                    <label>
                        Role:
                        <input
                            type="text"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
                    Agents List
                </h2>
                <input
                    type="text"
                    placeholder="Search agents..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        marginBottom: 12,
                        padding: 6,
                        width: "100%",
                        border: `1px solid var(--card-border)`,
                        background: "var(--input-bg)",
                    }}
                />
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
                            <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>
                                ID
                            </th>
                            <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>
                                Name
                            </th>
                            <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>
                                Role
                            </th>
                            <th style={{ textAlign: "left", padding: 8, borderBottom: `1px solid var(--card-border)` }}>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAgents.map((agent) => (
                            <tr key={agent.id}>
                                <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>{agent.id}</td>
                                <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>{agent.name}</td>
                                <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)` }}>{agent.role}</td>
                                <td style={{ padding: 8, borderBottom: `1px solid var(--card-border)`, display: "flex", gap: 8 }}>
                                    <button
                                        onClick={() => handleEdit(agent)}
                                        style={{
                                            padding: "4px 8px",
                                            background: "var(--secondary-bg)",
                                            color: "var(--secondary-text)",
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
                                            color: "var(--danger-text)",
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
                                            color: "var(--primary-text)",
                                            borderRadius: 4,
                                            textDecoration: "none",
                                        }}
                                    >
                                        Open
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {filteredAgents.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: 12, textAlign: "center", color: "var(--text-muted)" }}>
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