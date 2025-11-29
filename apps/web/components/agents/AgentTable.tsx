"use client";

import Link from "next/link";
import { Agent } from "@/types/Agent";

interface AgentTableProps {
  agents: Agent[];
  onDelete: (agent: Agent) => void;
  onEdit: (agent: Agent) => void;
  onArchive: (agent: Agent) => void;
  onRegenerateLink: (agent: Agent) => void;
}
export default function AgentTable({
  agents,
  onDelete,
  onEdit,
  onArchive,
  onRegenerateLink,
}: AgentTableProps) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>Name</th>
          <th style={{ textAlign: "left" }}>Membership #</th>
          <th style={{ textAlign: "left" }}>Email</th>
          <th style={{ textAlign: "left" }}>Status</th>
          <th style={{ textAlign: "left" }}>Access until</th>
          <th style={{ textAlign: "left" }}>Invite link</th>
          <th style={{ textAlign: "left" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {agents.map((agent) => (
          <tr key={agent.id}>
            <td>
              <Link href={`/admin/agents/${agent.id}`}>{agent.name}</Link>
            </td>
            <td>{agent.membershipNumber}</td>
            <td>{agent.email}</td>
            <td>{agent.status}</td>
            <td>{agent.accessUntil ?? "—"}</td>
            <td>
              {agent.inviteLink ? (
                <>
                  <a href={agent.inviteLink} target="_blank">
                    Open
                  </a>{" "}
                  |{" "}
                  <button onClick={() => onRegenerateLink(agent)}>
                    Regenerate
                  </button>
                </>
              ) : (
                <button onClick={() => onRegenerateLink(agent)}>
                  Generate
                </button>
              )}
            </td>
            <td>
              <button onClick={() => onEdit(agent)} style={{ marginRight: 8 }}>
                Edit
              </button>
              <button
                onClick={() => onArchive(agent)}
                style={{ marginRight: 8 }}
              >
                Archive
              </button>
              <button onClick={() => onDelete(agent)}>Delete</button>
            </td>
          </tr>
        ))}
        {agents.length === 0 && (
          <tr>
            <td colSpan={7} style={{ padding: 12, color: "#666" }}>
              No agents found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
