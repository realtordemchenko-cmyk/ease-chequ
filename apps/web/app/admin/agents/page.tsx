"use client";

import React, { useState } from "react";

interface Agent {
    id: string;
    name: string;
    email: string;
    phone: string;
    accessUntil: string;
    memberNumber: string;
}

export default function AgentsPage() {
    const [filters, setFilters] = useState({ search: "", status: "all" });
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        accessUntil: "",
        memberNumber: "",
    });
    const [agents, setAgents] = useState<Agent[]>([
        {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            phone: "123-456-7890",
            accessUntil: "2025-12-31",
            memberNumber: "A123",
        },
    ]);

    const [editing, setEditing] = useState<Agent | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Agent | null>(null);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddAgent = () => {
        const newAgent: Agent = {
            id: String(agents.length + 1),
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            accessUntil: form.accessUntil,
            memberNumber: form.memberNumber.trim(),
        };
        setAgents((prev) => [...prev, newAgent]);
        setForm({ name: "", email: "", phone: "", accessUntil: "", memberNumber: "" });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editing) return;
        const { name, value } = e.target;
        setEditing({ ...editing, [name]: value });
    };

    const saveEdit = () => {
        if (!editing) return;
        setAgents((prev) =>
            prev.map((a) => (a.id === editing.id ? editing : a))
        );
        setEditing(null);
    };

    const doDelete = () => {
        if (!confirmDelete) return;
        setAgents((prev) => prev.filter((a) => a.id !== confirmDelete.id));
        setConfirmDelete(null);
    };

    const filteredAgents = agents.filter((a) => {
        const q = filters.search.trim().toLowerCase();
        if (!q) return true;
        return (
            a.name.toLowerCase().includes(q) ||
            a.email.toLowerCase().includes(q) ||
            a.phone.toLowerCase().includes(q)
        );
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-main)" }}>
                Agents
            </h1>
            {/* Search & Filters */}
            <div
                style={{
                    backgroundColor: "var(--card-bg)",
                    border: `1px solid var(--card-border)`,
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                <h2 style={{ fontWeight: 600, marginBottom: "4px", color: "var(--text-main)" }}>
                    Search & Filters
                </h2>

                <input
                    type="text"
                    name="search"
                    placeholder="Search agents..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: `1px solid var(--input-border)`,
                        backgroundColor: "var(--input-bg)",
                        color: "var(--text-main)",
                    }}
                />

                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: `1px solid var(--input-border)`,
                        backgroundColor: "var(--input-bg)",
                        color: "var(--text-main)",
                    }}
                >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Add Agent */}
            <div
                style={{
                    backgroundColor: "var(--card-bg)",
                    border: `1px solid var(--card-border)`,
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                <h2 style={{ fontWeight: 600, marginBottom: "4px", color: "var(--text-main)" }}>
                    Add Agent
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <input
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "6px",
                            border: `1px solid var(--input-border)`,
                            backgroundColor: "var(--input-bg)",
                            color: "var(--text-main)",
                        }}
                    />
                    <input
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "6px",
                            border: `1px solid var(--input-border)`,
                            backgroundColor: "var(--input-bg)",
                            color: "var(--text-main)",
                        }}
                    />
                    <input
                        name="phone"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "6px",
                            border: `1px solid var(--input-border)`,
                            backgroundColor: "var(--input-bg)",
                            color: "var(--text-main)",
                        }}
                    />
                    <input
                        type="date"
                        name="accessUntil"
                        value={form.accessUntil}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "6px",
                            border: `1px solid var(--input-border)`,
                            backgroundColor: "var(--input-bg)",
                            color: "var(--text-main)",
                        }}
                    />
                    <input
                        name="memberNumber"
                        placeholder="Board membership number"
                        value={form.memberNumber}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "6px",
                            border: `1px solid var(--input-border)`,
                            backgroundColor: "var(--input-bg)",
                            color: "var(--text-main)",
                        }}
                    />

                    <button
                        onClick={handleAddAgent}
                        style={{
                            backgroundColor: "var(--primary-bg)",
                            color: "var(--primary-text)",
                            fontWeight: 600,
                            padding: "10px 16px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                            alignSelf: "flex-start",
                        }}
                    >
                        Add agent
                    </button>
                </div>
            </div>

            {/* Agents list */}
            <div
                style={{
                    backgroundColor: "var(--card-bg)",
                    border: `1px solid var(--card-border)`,
                    borderRadius: "8px",
                    padding: "16px",
                }}
            >
                <h2 style={{ fontWeight: 600, marginBottom: "12px", color: "var(--text-main)" }}>
                    Agents list
                </h2>

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        color: "var(--text-main)",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ padding: "8px", borderBottom: `1px solid var(--card-border)`, textAlign: "left" }}>ID</th>
                            <th style={{ padding: "8px", borderBottom: `1px solid var(--card-border)`, textAlign: "left" }}>Name</th>
                            <th style={{ padding: "8px", borderBottom: `1px solid var(--card-border)`, textAlign: "left" }}>Email</th>
                            <th style={{ padding: "8px", borderBottom: `1px solid var(--card-border)`, textAlign: "left" }}>Phone</th>
                            <th style={{ padding: "8px", borderBottom: `1px solid var(--card-border)`, textAlign: "left" }}>Access Until</th>
                            <th style={{ padding: "8px", borderBottom: `1px solid var(--card-border)`, textAlign: "left" }}>Board #</th>
                            <th style={{ padding: "8px", borderBottom: `1px solid var(--card-border)`, textAlign: "left" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAgents.map((agent) => (
                            <tr key={agent.id}>
                                <td style={{ padding: "8px", borderBottom: `1px solid var(--card-border)` }}>{agent.id}</td>
                                <td style={{ padding: "8px", borderBottom: `1px solid var(--card-border)` }}>{agent.name}</td>
                                <td style={{ padding: "8px", borderBottom: `1px solid var(--card-border)` }}>{agent.email}</td>
                                <td style={{ padding: "8px", borderBottom: `1px solid var(--card-border)` }}>{agent.phone}</td>
                                <td style={{ padding: "8px", borderBottom: `1px solid var(--card-border)` }}>{agent.accessUntil}</td>
                                <td style={{ padding: "8px", borderBottom: `1px solid var(--card-border)` }}>{agent.memberNumber}</td>
                                <td style={{ padding: "8px", borderBottom: `1px solid var(--card-border)` }}>
                                    <button onClick={() => setEditing(agent)} style={{ marginRight: "8px", padding: "6px 12px", borderRadius: "6px", border: "none", backgroundColor: "var(--secondary-bg)", color: "var(--secondary-text)", cursor: "pointer" }}>Edit</button>
                                    <button onClick={() => setConfirmDelete(agent)} style={{ padding: "6px 12px", borderRadius: "6px", border: "none", backgroundColor: "var(--danger-bg)", color: "var(--danger-text)", cursor: "pointer" }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Edit agent profile */}
            {editing && (
                <div
                    style={{
                        backgroundColor: "var(--card-bg)",
                        border: `1px solid var(--card-border)`,
                        borderRadius: "8px",
                        padding: "16px",
                        width: "520px",
                    }}
                >
                    <h2
                        style={{
                            fontWeight: 600,
                            marginBottom: "12px",
                            color: "var(--text-main)",
                        }}
                    >
                        Edit agent profile
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <input
                            name="name"
                            value={editing.name}
                            onChange={handleEditChange}
                            style={{
                                padding: "8px",
                                borderRadius: "6px",
                                border: `1px solid var(--input-border)`,
                                backgroundColor: "var(--input-bg)",
                                color: "var(--text-main)",
                            }}
                        />
                        <input
                            name="email"
                            value={editing.email}
                            onChange={handleEditChange}
                            style={{
                                padding: "8px",
                                borderRadius: "6px",
                                border: `1px solid var(--input-border)`,
                                backgroundColor: "var(--input-bg)",
                                color: "var(--text-main)",
                            }}
                        />
                        <input
                            name="phone"
                            value={editing.phone}
                            onChange={handleEditChange}
                            style={{
                                padding: "8px",
                                borderRadius: "6px",
                                border: `1px solid var(--input-border)`,
                                backgroundColor: "var(--input-bg)",
                                color: "var(--text-main)",
                            }}
                        />
                        <input
                            type="date"
                            name="accessUntil"
                            value={editing.accessUntil}
                            onChange={handleEditChange}
                            style={{
                                padding: "8px",
                                borderRadius: "6px",
                                border: `1px solid var(--input-border)`,
                                backgroundColor: "var(--input-bg)",
                                color: "var(--text-main)",
                            }}
                        />
                        <input
                            name="memberNumber"
                            value={editing.memberNumber}
                            onChange={handleEditChange}
                            style={{
                                padding: "8px",
                                borderRadius: "6px",
                                border: `1px solid var(--input-border)`,
                                backgroundColor: "var(--input-bg)",
                                color: "var(--text-main)",
                            }}
                        />

                        <div style={{ display: "flex", gap: "12px" }}>
                            <button
                                onClick={() => setEditing(null)}
                                style={{
                                    backgroundColor: "var(--secondary-bg)",
                                    color: "var(--secondary-text)",
                                    fontWeight: 600,
                                    padding: "8px 14px",
                                    borderRadius: "6px",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEdit}
                                style={{
                                    backgroundColor: "var(--primary-bg)",
                                    color: "var(--primary-text)",
                                    fontWeight: 600,
                                    padding: "8px 14px",
                                    borderRadius: "6px",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete agent */}
            {confirmDelete && (
                <div
                    style={{
                        backgroundColor: "var(--card-bg)",
                        border: `1px solid var(--card-border)`,
                        borderRadius: "8px",
                        padding: "16px",
                        width: "460px",
                    }}
                >
                    <h2
                        style={{
                            fontWeight: 600,
                            marginBottom: "12px",
                            color: "var(--text-main)",
                        }}
                    >
                        Delete agent
                    </h2>
                    <p style={{ marginBottom: "16px", color: "var(--text-muted)" }}>
                        Are you sure you want to delete{" "}
                        <strong>{confirmDelete.name}</strong>?
                    </p>
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button
                            onClick={() => setConfirmDelete(null)}
                            style={{
                                backgroundColor: "var(--secondary-bg)",
                                color: "var(--secondary-text)",
                                fontWeight: 600,
                                padding: "8px 14px",
                                borderRadius: "6px",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={doDelete}
                            style={{
                                backgroundColor: "var(--danger-bg)",
                                color: "var(--danger-text)",
                                fontWeight: 600,
                                padding: "8px 14px",
                                borderRadius: "6px",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}