// apps/web/context/AdminStore.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Agent } from "../types/Agent";

// --- Types ---


export interface Client {
    id: number;
    name: string;
    status: string;
    agentId?: number;
}

export interface Request {
    id: number;
    type: "Agent" | "Client";
    name: string;
    email?: string;
    boardMemberNumber?: string;
    status: "Pending" | "Approved" | "Rejected";
    date: string;
}

export interface LogEntry {
    id: number;
    date: string;
    type: "System" | "Agent" | "Client" | "Error";
    message: string;
}

interface AdminContextType {
    // Agents
    agents: Agent[];
    addAgent: (agent: Omit<Agent, "id" | "inviteLink">) => void;
    updateAgent: (agent: Agent) => void;
    deleteAgent: (id: number) => void;
    regenerateInviteLink: (id: number) => void;

    // Clients
    clients: Client[];
    attachClient: (clientId: number, agentId: number) => void;
    detachClient: (clientId: number) => void;

    // Requests
    requests: Request[];
    setRequestStatus: (id: number, status: "Pending" | "Approved" | "Rejected") => void;
    approveRequest: (id: number) => void;
    rejectRequest: (id: number) => void;

    // Logs
    logs: LogEntry[];
    addLog: (entry: Omit<LogEntry, "id" | "date">) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// --- Helpers ---
function generateInviteLink(boardMemberNumber: string): string {
    const token = Math.random().toString(36).substring(2, 10);
    return `/register?bm=${boardMemberNumber}&token=${token}`;
}

export function AdminProvider({ children }: { children: ReactNode }) {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [requests, setRequests] = useState<Request[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    // --- INIT with localStorage or mocks ---
    useEffect(() => {
        const storedAgents = localStorage.getItem("admin_agents");
        const storedClients = localStorage.getItem("admin_clients");
        const storedRequests = localStorage.getItem("admin_requests");
        const storedLogs = localStorage.getItem("admin_logs");

        // Agents
        if (storedAgents) {
            const parsed = JSON.parse(storedAgents);
            setAgents(parsed.length > 0 ? parsed : [
                {
                    id: 1,
                    name: "Alice",
                    email: "alice@example.com",
                    boardMemberNumber: "BM-001",
                    accessUntil: "2025-12-31",
                    inviteLink: generateInviteLink("BM-001"),
                },
            ]);
        } else {
            setAgents([
                {
                    id: 1,
                    name: "Alice",
                    email: "alice@example.com",
                    boardMemberNumber: "BM-001",
                    accessUntil: "2025-12-31",
                    inviteLink: generateInviteLink("BM-001"),
                },
            ]);
        }

        // Clients
        if (storedClients) {
            const parsed = JSON.parse(storedClients);
            setClients(parsed.length > 0 ? parsed : [
                { id: 101, name: "Contoso Ltd.", status: "Active", agentId: 1 },
                { id: 102, name: "Northwind Inc.", status: "Pending", agentId: 1 },
                { id: 103, name: "Fabrikam Co.", status: "Active" },
            ]);
        } else {
            setClients([
                { id: 101, name: "Contoso Ltd.", status: "Active", agentId: 1 },
                { id: 102, name: "Northwind Inc.", status: "Pending", agentId: 1 },
                { id: 103, name: "Fabrikam Co.", status: "Active" },
            ]);
        }

        // Requests
        if (storedRequests) {
            const parsed = JSON.parse(storedRequests);
            setRequests(parsed.length > 0 ? parsed : [
                {
                    id: 201,
                    type: "Agent",
                    name: "Bob",
                    email: "bob@example.com",
                    boardMemberNumber: "BM-002",
                    status: "Pending",
                    date: new Date().toISOString().slice(0, 10),
                },
                {
                    id: 202,
                    type: "Client",
                    name: "Adventure Works",
                    status: "Pending",
                    date: new Date().toISOString().slice(0, 10),
                },
            ]);
        } else {
            setRequests([
                {
                    id: 201,
                    type: "Agent",
                    name: "Bob",
                    email: "bob@example.com",
                    boardMemberNumber: "BM-002",
                    status: "Pending",
                    date: new Date().toISOString().slice(0, 10),
                },
                {
                    id: 202,
                    type: "Client",
                    name: "Adventure Works",
                    status: "Pending",
                    date: new Date().toISOString().slice(0, 10),
                },
            ]);
        }

        // Logs
        if (storedLogs) {
            const parsed = JSON.parse(storedLogs);
            setLogs(parsed.length > 0 ? parsed : [
                {
                    id: 1,
                    date: new Date().toISOString(),
                    type: "System",
                    message: "Admin panel initialized with mock data",
                },
            ]);
        } else {
            setLogs([
                {
                    id: 1,
                    date: new Date().toISOString(),
                    type: "System",
                    message: "Admin panel initialized with mock data",
                },
            ]);
        }
    }, []);

    // --- Persist ---
    useEffect(() => { localStorage.setItem("admin_agents", JSON.stringify(agents)); }, [agents]);
    useEffect(() => { localStorage.setItem("admin_clients", JSON.stringify(clients)); }, [clients]);
    useEffect(() => { localStorage.setItem("admin_requests", JSON.stringify(requests)); }, [requests]);
    useEffect(() => { localStorage.setItem("admin_logs", JSON.stringify(logs)); }, [logs]);

    // --- Logs ---
    const addLog = (entry: Omit<LogEntry, "id" | "date">) => {
        setLogs((prev) => [
            ...prev,
            { id: Date.now(), date: new Date().toISOString(), ...entry },
        ]);
    };

    // --- Agents ---
    const addAgent = (agent: Omit<Agent, "id" | "inviteLink">) => {
        // Устойчивый вариант без побочных эффектов внутри setState:
        // - проверка дубликатов
        // - единичный setAgents
        // - логирование после обновления
        if (!agent.boardMemberNumber) {
            addLog({ type: "Agent", message: "Add skipped: invalid boardMemberNumber" });
            return;
        }

        const duplicate = agents.some((a) => a.boardMemberNumber === agent.boardMemberNumber);
        if (duplicate) {
            addLog({ type: "Agent", message: `Add skipped: Agent ${agent.boardMemberNumber} already exists` });
            return;
        }

        const inviteLink = generateInviteLink(agent.boardMemberNumber);
        const newAgent: Agent = {
            ...agent,
            id: Date.now(),
            inviteLink,
            status: "Pending", // ручной контроль доступа
        };

        setAgents((prev) => [...prev, newAgent]);
        addLog({ type: "Agent", message: `Agent added: ${newAgent.name}` });
    };

    const updateAgent = (agent: Agent) => {
        const exists = agents.some((a) => a.id === agent.id);
        if (!exists) {
            addLog({ type: "Agent", message: `Update skipped: agent ${agent.id} not found` });
            return;
        }

        setAgents((prev) => prev.map((a) => (a.id === agent.id ? agent : a)));
        addLog({ type: "Agent", message: `Agent updated: ${agent.name}` });
    };

    const deleteAgent = (id: number) => {
        const target = agents.find((a) => a.id === id);
        setAgents((prev) => prev.filter((a) => a.id !== id));
        addLog({ type: "Agent", message: `Agent deleted: ${target?.name ?? id}` });
    };

    const regenerateInviteLink = (id: number) => {
        const target = agents.find((a) => a.id === id);
        if (!target) {
            addLog({ type: "Agent", message: `Invite regeneration skipped: agent ${id} not found` });
            return;
        }

        const updated = { ...target, inviteLink: generateInviteLink(target.boardMemberNumber) };
        setAgents((prev) => prev.map((a) => (a.id === id ? updated : a)));

        // Логируем по факту, без временных переменных с неочевидным типом
        addLog({ type: "Agent", message: `Invite link regenerated for ${updated.name}` });
    };
    // --- Clients ---

    // --- Clients ---
    const attachClient = (clientId: number, agentId: number) => {
        setClients((prev) =>
            prev.map((c) => (c.id === clientId ? { ...c, agentId } : c))
        );
        addLog({ type: "Client", message: `Client ${clientId} attached to agent ${agentId}` });
    };

    const detachClient = (clientId: number) => {
        setClients((prev) =>
            prev.map((c) => (c.id === clientId ? { ...c, agentId: undefined } : c))
        );
        addLog({ type: "Client", message: `Client ${clientId} detached from agent` });
    };

    // --- Requests workflow ---
    const setRequestStatus = (id: number, status: "Pending" | "Approved" | "Rejected") => {
        setRequests((prev) => {
            const updated = prev.map((r) => (r.id === id ? { ...r, status } : r));
            const req = prev.find((r) => r.id === id); // ← используем prev, не requests

            if (req) {
                if (status === "Approved") {
                    if (req.type === "Agent" && req.email && req.boardMemberNumber) {
                        // Проверка: агент с таким boardMemberNumber уже существует?
                        const exists = agents.some(
                            (a) => a.boardMemberNumber === req.boardMemberNumber
                        );

                        if (!exists) {
                            addAgent({
                                name: req.name,
                                email: req.email,
                                boardMemberNumber: req.boardMemberNumber,
                                accessUntil: "2025-12-31",
                            });
                            addLog({ type: "Agent", message: `Request approved: Agent ${req.name} added` });
                        } else {
                            addLog({ type: "Agent", message: `Request approved: Agent ${req.name} already exists` });
                        }
                    } else if (req.type === "Client") {
                        const exists = clients.some((c) => c.name === req.name); if (!exists) {
                            setClients((prev) => [
                                ...prev,
                                { id: Date.now(), name: req.name, status: "Active" },
                            ]);
                            addLog({ type: "Client", message: `Request approved: Client ${req.name} added` });
                        } else {
                            addLog({ type: "Client", message: `Request approved: Client ${req.name} already exists` });
                        }
                    }
                } else if (status === "Rejected") {
                    addLog({ type: req.type, message: `${req.type} request rejected: ${req.name}` });
                } else if (status === "Pending") {
                    addLog({ type: req.type, message: `Request reset to Pending: ${req.name}` });
                }
            }

            return updated;
        });
    };
    return (
        <AdminContext.Provider
            value={{
                // Agents
                agents,
                addAgent,
                updateAgent,
                deleteAgent,
                regenerateInviteLink,
                // Clients
                clients,
                attachClient,
                detachClient,
                // Requests
                requests,
                setRequestStatus,
                approveRequest: (id) => setRequestStatus(id, "Approved"),
                rejectRequest: (id) => setRequestStatus(id, "Rejected"),
                // Logs
                logs,
                addLog,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

// Hook
export function useAdmin() {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
    return ctx;
}