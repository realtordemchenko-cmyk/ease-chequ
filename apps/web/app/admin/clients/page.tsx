"use client";

import React, { useState } from "react";

interface Client {
    id: string;
    name: string;
    contact: string;
    status: string;
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([
        { id: "C001", name: "Acme Corp", contact: "alice@acme.com", status: "Active" },
        { id: "C002", name: "Globex Inc", contact: "bob@globex.com", status: "Inactive" },
    ]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h1
                style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "var(--text-main)",
                }}
            >
                Clients
            </h1>

            <p style={{ color: "var(--text-muted)" }}>
                Manage your client organizations here.
            </p>

            <div
                style={{
                    backgroundColor: "var(--card-bg)",
                    border: `1px solid var(--card-border)`,
                    borderRadius: "8px",
                    padding: "16px",
                }}
            >
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        color: "var(--text-main)",
                    }}
                >
                    <thead>
                        <tr style={{ backgroundColor: "var(--table-header-bg)" }}>
                            <th
                                style={{
                                    border: `1px solid var(--card-border)`,
                                    padding: "8px",
                                    textAlign: "left",
                                }}
                            >
                                ID
                            </th>
                            <th
                                style={{
                                    border: `1px solid var(--card-border)`,
                                    padding: "8px",
                                    textAlign: "left",
                                }}
                            >
                                Name
                            </th>
                            <th
                                style={{
                                    border: `1px solid var(--card-border)`,
                                    padding: "8px",
                                    textAlign: "left",
                                }}
                            >
                                Contact
                            </th>
                            <th
                                style={{
                                    border: `1px solid var(--card-border)`,
                                    padding: "8px",
                                    textAlign: "left",
                                }}
                            >
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td
                                    style={{
                                        border: `1px solid var(--card-border)`,
                                        padding: "8px",
                                    }}
                                >
                                    {client.id}
                                </td>
                                <td
                                    style={{
                                        border: `1px solid var(--card-border)`,
                                        padding: "8px",
                                    }}
                                >
                                    {client.name}
                                </td>
                                <td
                                    style={{
                                        border: `1px solid var(--card-border)`,
                                        padding: "8px",
                                    }}
                                >
                                    {client.contact}
                                </td>
                                <td
                                    style={{
                                        border: `1px solid var(--card-border)`,
                                        padding: "8px",
                                    }}
                                >
                                    {client.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}