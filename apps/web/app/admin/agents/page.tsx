"use client";

import { useAdmin } from "context/AdminStore";
import { Agent } from "types/Agent";
import { useState } from "react";

export default function AgentsPage() {
    const { agents, addAgent, updateAgent, deleteAgent, currentAdminRole } = useAdmin();
    const [newAgent, setNewAgent] = useState<Omit<Agent, "id">>({
        name: "",
        email: "",
        boardMemberNumber: "",
        accessUntil: "",
        inviteLink: "",
        status: "Pending"
    });

    const isViewer = currentAdminRole === "Viewer";

    const handleAdd = () => {
        if (!newAgent.name || !newAgent.email || !newAgent.boardMemberNumber) {
            alert("Name, Email and Membership number are required");
            return;
        }
        addAgent(newAgent);
        setNewAgent({
            name: "",
            email: "",
            boardMemberNumber: "",
            accessUntil: "",
            inviteLink: "",
            status: "Pending"
        });
    };

    return (
        <div>
            <h1>Agents</h1>

            {!isViewer && (
                <div style={{ marginBottom: "16px", display: "grid", gap: 8 }}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newAgent.name}
                        onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newAgent.email}
                        onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Membership Number"
                        value={newAgent.boardMemberNumber}
                        onChange={(e) =>
                            setNewAgent({ ...newAgent, boardMemberNumber: e.target.value })
                        }
                    />
                    <input
                        type="date"
                        value={newAgent.accessUntil}
                        onChange={(e) => setNewAgent({ ...newAgent, accessUntil: e.target.value })}
                    />
                    <button onClick={handleAdd}>Add Agent</button>
                </div>
            )}

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Membership #</th>
                        <th>Access Until</th>
                        <th>Status</th>
                        {!isViewer && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {agents.map((agent) => (
                        <tr key={agent.id}>
                            <td>{agent.name}</td>
                            <td>{agent.email}</td>
                            <td>{agent.boardMemberNumber}</td>
                            <td>{agent.accessUntil}</td>
                            <td>
                                {!isViewer ? (
                                    <select
                                        value={agent.status}
                                        onChange={(e) =>
                                            updateAgent({ ...agent, status: e.target.value as Agent["status"] })
                                        }
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Busy">Busy</option>
                                    </select>
                                ) : (
                                    agent.status
                                )}
                            </td>
                            {!isViewer && (
                                <td>
                                    <button onClick={() => deleteAgent(agent.id)}>Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}