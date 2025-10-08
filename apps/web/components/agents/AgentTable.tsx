// apps/web/components/agents/AgentTable.tsx
"use client";

interface Agent {
    id: number;
    name: string;
    role: string;
}

const mockAgents: Agent[] = [
    { id: 1, name: "Alice", role: "Manager" },
    { id: 2, name: "Bob", role: "Support" },
    { id: 3, name: "Charlie", role: "Developer" },
];

export default function AgentTable() {
    return (
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
                    <th style={{ textAlign: "left", padding: "8px", borderBottom: `1px solid var(--card-border)` }}>ID</th>
                    <th style={{ textAlign: "left", padding: "8px", borderBottom: `1px solid var(--card-border)` }}>Name</th>
                    <th style={{ textAlign: "left", padding: "8px", borderBottom: `1px solid var(--card-border)` }}>Role</th>
                </tr>
            </thead>
            <tbody>
                {mockAgents.map((agent) => (
                    <tr key={agent.id}>
                        <td style={{ padding: "8px", borderBottom: `1px solid var(--card-border)` }}>{agent.id}</td>
                        <td style={{ padding: "8px", borderBottom: `1px solid var(--card-border)` }}>{agent.name}</td>
                        <td style={{ padding: "8px", borderBottom: `1px solid var(--card-border)` }}>{agent.role}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}