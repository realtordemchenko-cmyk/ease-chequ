"use client";

import { useParams } from "next/navigation";
import { useAdmin } from "context/AdminStore";
import { Agent } from "types/Agent";

export default function AgentDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { agents, updateAgent, deleteAgent, clients, detachClient, currentAdminRole } =
        useAdmin();

    const agent = agents.find((a) => a.id === id);
    const isViewer = currentAdminRole === "Viewer";

    if (!agent) {
        return <div>Agent not found</div>;
    }

    const agentClients = clients.filter((c) => c.agentId === agent.id);

    return (
        <div>
            <h1>Agent Details</h1>
            <p><strong>Name:</strong> {agent.name}</p>
            <p><strong>Email:</strong> {agent.email}</p>
            <p><strong>Membership #:</strong> {agent.boardMemberNumber}</p>
            <p><strong>Access Until:</strong> {agent.accessUntil}</p>
            <p><strong>Invite Link:</strong> {agent.inviteLink}</p>

            <div style={{ margin: "12px 0" }}>
                <label>Status: </label>
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
            </div>

            {!isViewer && (
                <button
                    style={{ marginTop: "12px", background: "red", color: "white", padding: "6px 12px" }}
                    onClick={() => deleteAgent(agent.id)}
                >
                    Delete Agent
                </button>
            )}

            <h2 style={{ marginTop: "24px" }}>Clients</h2>
            {agentClients.length === 0 ? (
                <p>No clients assigned</p>
            ) : (
                <ul>
                    {agentClients.map((client) => (
                        <li key={client.id}>
                            {client.name} ({client.status})
                            {!isViewer && (
                                <button style={{ marginLeft: "8px" }} onClick={() => detachClient(client.id)}>
                                    Detach
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}