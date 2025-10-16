"use client";

import { useParams } from "next/navigation";
import { useAdmin } from "context/AdminStore";
import { Agent } from "types/Agent";

export default function AgentDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { agents, updateAgent, regenerateInviteLink, currentAdminRole } = useAdmin();

    const agent = agents.find((a) => a.id === id);
    const isViewer = currentAdminRole === "Viewer";

    if (!agent) {
        return <div>Agent not found</div>;
    }

    return (
        <div>
            <h1>Agent Details</h1>

            <div style={{ display: "grid", gap: "8px", maxWidth: "400px" }}>
                <div>
                    <strong>Name:</strong> {agent.name}
                </div>
                <div>
                    <strong>Email:</strong> {agent.email}
                </div>
                <div>
                    <strong>Status:</strong>{" "}
                    {isViewer ? (
                        agent.status
                    ) : (
                        <select
                            value={agent.status}
                            onChange={(e) =>
                                updateAgent({ ...agent, status: e.target.value as Agent["status"] })
                            }
                        >
                            <option value="Pending">Pending</option>
                            <option value="Active">Active</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                    )}
                </div>
                <div>
                    <strong>Invite Link:</strong>{" "}
                    {agent.inviteLink ? (
                        <a href={agent.inviteLink} target="_blank" rel="noopener noreferrer">
                            {agent.inviteLink}
                        </a>
                    ) : (
                        "Not generated"
                    )}
                </div>
                {!isViewer && (
                    <button onClick={() => regenerateInviteLink(agent.id)}>
                        Regenerate Invite Link
                    </button>
                )}
            </div>
        </div>
    );
}