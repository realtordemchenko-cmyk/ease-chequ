"use client";

import React, { createContext, useContext, useState } from "react";
import { Agent } from "types/Agent";
import { Request } from "types/Request";
import { LogEntry } from "types/LogEntry";

export interface Client {
    id: string;
    name: string;
    status: string;
    agentId: string;
}

interface AdminContextType {
    agents: Agent[];
    clients: Client[];
    requests: Request[];
    logs: LogEntry[];

    addAgent: (agent: Omit<Agent, "id">) => void;
    updateAgent: (agent: Agent) => void;
    deleteAgent: (id: string) => void;

    addClient: (client: Omit<Client, "id">) => void;
    detachClient: (clientId: string) => void;

    approveRequest: (id: string) => void;
    rejectRequest: (id: string) => void;

    addLog: (log: Omit<LogEntry, "id" | "timestamp">) => void;

    currentAdminRole: "Super Admin" | "Admin" | "Viewer";
    setAdminRole: (role: "Super Admin" | "Admin" | "Viewer") => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const [agents, setAgents] = useState<Agent[]>([
        {
            id: crypto.randomUUID(),
            name: "Alice Johnson",
            email: "alice@example.com",
            boardMemberNumber: "B123",
            accessUntil: "2025-12-31",
            inviteLink: "https://example.com/invite/alice",
            status: "Active"
        },
        {
            id: crypto.randomUUID(),
            name: "Bob Smith",
            email: "bob@example.com",
            boardMemberNumber: "B456",
            accessUntil: "2025-11-30",
            inviteLink: "https://example.com/invite/bob",
            status: "Pending"
        }
    ]);

    const [clients, setClients] = useState<Client[]>([]);

    const [requests, setRequests] = useState<Request[]>([
        {
            id: crypto.randomUUID(),
            type: "Access",
            name: "Charlie",
            email: "charlie@example.com",
            boardMemberNumber: "B789",
            date: new Date().toISOString(),
            status: "Pending"
        },
        {
            id: crypto.randomUUID(),
            type: "Update",
            name: "Diana",
            email: "diana@example.com",
            boardMemberNumber: "B321",
            date: new Date().toISOString(),
            status: "Pending"
        }
    ]);

    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [currentAdminRole, setCurrentAdminRole] = useState<"Super Admin" | "Admin" | "Viewer">(
        "Super Admin"
    );

    const addLog = (log: Omit<LogEntry, "id" | "timestamp">) => {
        setLogs((prev) => [
            ...prev,
            { ...log, id: crypto.randomUUID(), timestamp: new Date().toISOString() }
        ]);
    };

    const addAgent = (agent: Omit<Agent, "id">) => {
        const newAgent = { ...agent, id: crypto.randomUUID() };
        setAgents((prev) => [...prev, newAgent]);
        addLog({ type: "Agent", message: `Agent ${newAgent.name} created` });
    };

    const updateAgent = (agent: Agent) => {
        setAgents((prev) => prev.map((a) => (a.id === agent.id ? agent : a)));
        addLog({ type: "Agent", message: `Agent ${agent.name} updated (status: ${agent.status})` });
    };

    const deleteAgent = (id: string) => {
        const target = agents.find((a) => a.id === id);
        setAgents((prev) => prev.filter((a) => a.id !== id));
        if (target) addLog({ type: "Agent", message: `Agent ${target.name} deleted` });
    };

    const addClient = (client: Omit<Client, "id">) => {
        setClients((prev) => [...prev, { ...client, id: crypto.randomUUID() }]);
        addLog({ type: "Client", message: `Client ${client.name} added to agent ${client.agentId}` });
    };

    const detachClient = (clientId: string) => {
        setClients((prev) => prev.filter((c) => c.id !== clientId));
        addLog({ type: "Client", message: `Client ${clientId} detached` });
    };

    const approveRequest = (id: string) => {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r)));
        const req = requests.find((r) => r.id === id);
        if (req) {
            addAgent({
                name: req.name,
                email: req.email,
                boardMemberNumber: req.boardMemberNumber,
                accessUntil: "",
                inviteLink: "",
                status: "Pending"
            });
            addLog({ type: "Request", message: `Request ${id} approved → agent created (${req.name})` });
        }
    };

    const rejectRequest = (id: string) => {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r)));
        addLog({ type: "Request", message: `Request ${id} rejected` });
    };

    return (
        <AdminContext.Provider
            value={{
                agents,
                clients,
                requests,
                logs,
                addAgent,
                updateAgent,
                deleteAgent,
                addClient,
                detachClient,
                approveRequest,
                rejectRequest,
                addLog,
                currentAdminRole,
                setAdminRole: (role) => {
                    setCurrentAdminRole(role);
                    addLog({ type: "Access", message: `Admin role changed to ${role}` });
                }
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
    return ctx;
}