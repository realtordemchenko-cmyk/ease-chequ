"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Agent } from "../types/Agent";
import { Request } from "../types/Request";
import { LogEntry } from "../types/LogEntry";
import { Client } from "../types/Client";

type Role = "Super Admin" | "Admin" | "Viewer";

interface AdminContextType {
    agents: Agent[];
    archivedAgents: Agent[];
    requests: Request[];
    archivedRequests: Request[];
    clients: Client[];
    logs: LogEntry[];
    currentAdminRole: Role;
    addAgent: (agent: Agent) => void;
    updateAgent: (agent: Agent) => void;
    deleteAgent: (id: string) => void;
    restoreAgent: (id: string) => void;
    regenerateInviteLink: (id: string) => void;
    addRequest: (req: Request) => void;
    approveRequest: (id: string) => void;
    rejectRequest: (id: string) => void;
    restoreRequest: (id: string) => void;
    addClient: (client: Client) => void;
    deleteClient: (id: string) => void;
    addLog: (log: LogEntry) => void;
    setRole: (role: Role) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// UID generator
const uid = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [archivedAgents, setArchivedAgents] = useState<Agent[]>([]);
    const [requests, setRequests] = useState<Request[]>([]);
    const [archivedRequests, setArchivedRequests] = useState<Request[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [currentAdminRole, setCurrentAdminRole] = useState<Role>("Super Admin");

    // Helpers
    const readJson = <T,>(key: string, fallback: T): T => {
        try {
            const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
            return raw ? (JSON.parse(raw) as T) : fallback;
        } catch {
            return fallback;
        }
    };
    const writeJson = (key: string, value: unknown) => {
        try {
            if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value));
        } catch { }
    };

    // Seed
    useEffect(() => {
        const hasAgents = readJson<Agent[]>("agents", []);
        const hasClients = readJson<Client[]>("clients", []);
        const hasRequests = readJson<Request[]>("requests", []);

        if (hasAgents.length === 0 && hasClients.length === 0 && hasRequests.length === 0) {
            const seedAgents: Agent[] = [
                { id: "a1", name: "Alice Agent", email: "alice@example.com", status: "Active" },
                { id: "a2", name: "Bob Broker", email: "bob@example.com", status: "Active" },
            ];
            const seedClients: Client[] = [
                { id: "c1", name: "Charlie Client", email: "charlie@example.com", phone: "+1-416-555-0101" },
                { id: "c2", name: "Dana Client", email: "dana@example.com", phone: "+1-416-555-0102" },
            ];
            const seedRequests: Request[] = [
                { id: "r1", name: "Charlie Client", email: "charlie@example.com", type: "Prequal-Rent", status: "Pending" },
                { id: "r2", name: "Dana Client", email: "dana@example.com", type: "Prequal-Rent", status: "Pending" },
            ];

            writeJson("agents", seedAgents);
            writeJson("clients", seedClients);
            writeJson("requests", seedRequests);
            writeJson("archivedAgents", []);
            writeJson("archivedRequests", []);
            writeJson("logs", []);
        }

        setAgents(readJson<Agent[]>("agents", []));
        setArchivedAgents(readJson<Agent[]>("archivedAgents", []));
        setRequests(readJson<Request[]>("requests", []));
        setArchivedRequests(readJson<Request[]>("archivedRequests", []));
        setClients(readJson<Client[]>("clients", []));
        setLogs(readJson<LogEntry[]>("logs", []));
    }, []);

    // Persistence
    useEffect(() => writeJson("agents", agents), [agents]);
    useEffect(() => writeJson("archivedAgents", archivedAgents), [archivedAgents]);
    useEffect(() => writeJson("requests", requests), [requests]);
    useEffect(() => writeJson("archivedRequests", archivedRequests), [archivedRequests]);
    useEffect(() => writeJson("clients", clients), [clients]);
    useEffect(() => writeJson("logs", logs), [logs]);

    // === Agents ===
    const addAgent = (agent: Agent) => {
        const safeAgent = { ...agent, id: agent.id || uid() };
        setAgents((prev) => [...prev, safeAgent]);
        addLog({ id: uid(), type: "Agent", message: `Agent ${safeAgent.name} added`, timestamp: new Date().toISOString() });
    };

    const updateAgent = (agent: Agent) => {
        setAgents((prev) => {
            const idx = prev.findIndex((a) => a.id === agent.id);
            if (idx === -1) return prev;
            const next = [...prev];
            next[idx] = { ...prev[idx], ...agent };
            return next;
        });
        addLog({ id: uid(), type: "Agent", message: `Agent ${agent.name} updated`, timestamp: new Date().toISOString() });
    };

    const deleteAgent = (id: string) => {
        setAgents((prev) => {
            const agent = prev.find((a) => a.id === id);
            if (!agent) return prev;
            setArchivedAgents((arch) => [...arch, agent]);
            addLog({ id: uid(), type: "Agent", message: `Agent ${agent.name} deleted (archived)`, timestamp: new Date().toISOString() });
            return prev.filter((a) => a.id !== id);
        });
    };

    const restoreAgent = (id: string) => {
        setArchivedAgents((prev) => {
            const agent = prev.find((a) => a.id === id);
            if (!agent) return prev;
            setAgents((agents) => [...agents, agent]);
            addLog({ id: uid(), type: "Agent", message: `Agent ${agent.name} restored from archive`, timestamp: new Date().toISOString() });
            return prev.filter((a) => a.id !== id);
        });
    };

    const regenerateInviteLink = (id: string) => {
        setAgents((prev) => {
            const idx = prev.findIndex((a) => a.id === id);
            if (idx === -1) return prev;
            const next = [...prev];
            next[idx] = { ...prev[idx], inviteLink: `https://easechequ.app/invite/${uid()}` };
            addLog({ id: uid(), type: "Agent", message: `Invite link regenerated for ${next[idx].name}`, timestamp: new Date().toISOString() });
            return next;
        });
    };

    // === Requests ===
    const addRequest = (req: Request) => {
        const safeReq = { ...req, id: req.id || uid(), status: req.status || "Pending" };
        setRequests((prev) => [...prev, safeReq]);
        addLog({
            id: uid(),
            type: "Request",
            message: `Request ${safeReq.name} added`,
            timestamp: new Date().toISOString(),
        });
    };

    const approveRequest = (id: string) => {
        setRequests((prev) => {
            const req = prev.find((r) => r.id === id);
            if (!req) return prev;

            const approvedReq = { ...req, status: "Approved" as const };
            setArchivedRequests((arch) => [...arch, approvedReq]);

            // Dedup by email
            const existing = agents.find((a) => a.email.toLowerCase() === req.email.toLowerCase());
            if (!existing) {
                const newAgent: Agent = {
                    id: uid(),
                    name: req.name,
                    email: req.email,
                    status: "Active",
                    inviteLink: `https://easechequ.app/invite/${uid()}`,
                };
                setAgents((agents) => [...agents, newAgent]);
                addLog({
                    id: uid(),
                    type: "Agent",
                    message: `Agent ${newAgent.name} created from approved request`,
                    timestamp: new Date().toISOString(),
                });
            } else {
                addLog({
                    id: uid(),
                    type: "Agent",
                    message: `Existing agent ${existing.name} matched; no duplicate created`,
                    timestamp: new Date().toISOString(),
                });
            }

            addLog({
                id: uid(),
                type: "Request",
                message: `Request ${req.name} approved (archived)`,
                timestamp: new Date().toISOString(),
            });

            return prev.filter((r) => r.id !== id);
        });
    };

    const rejectRequest = (id: string) => {
        setRequests((prev) => {
            const req = prev.find((r) => r.id === id);
            if (!req) return prev;
            const rejectedReq = { ...req, status: "Rejected" as const };
            setArchivedRequests((arch) => [...arch, rejectedReq]);
            addLog({
                id: uid(),
                type: "Request",
                message: `Request ${req.name} rejected (archived)`,
                timestamp: new Date().toISOString(),
            });
            return prev.filter((r) => r.id !== id);
        });
    };

    const restoreRequest = (id: string) => {
        setArchivedRequests((prev) => {
            const req = prev.find((r) => r.id === id);
            if (!req) return prev;
            const restoredReq = { ...req, status: "Pending" as const };
            setRequests((requests) => [...requests, restoredReq]);
            addLog({
                id: uid(),
                type: "Request",
                message: `Request ${req.name} restored to Pending`,
                timestamp: new Date().toISOString(),
            });
            return prev.filter((r) => r.id !== id);
        });
    };

    // === Clients ===
    const addClient = (client: Client) => {
        const safeClient = { ...client, id: client.id || uid() };
        setClients((prev) => [...prev, safeClient]);
        addLog({
            id: uid(),
            type: "Client",
            message: `Client ${safeClient.name} added`,
            timestamp: new Date().toISOString(),
        });
    };

    const deleteClient = (id: string) => {
        setClients((prev) => prev.filter((c) => c.id !== id));
        addLog({
            id: uid(),
            type: "Client",
            message: `Client ${id} deleted`,
            timestamp: new Date().toISOString(),
        });
    };

    // === Logs & Role ===
    const addLog = (log: LogEntry) => {
        setLogs((prev) => [...prev, log]);
    };

    const setRole = (role: Role) => {
        setCurrentAdminRole(role);
        addLog({
            id: uid(),
            type: "System",
            message: `Role switched to ${role}`,
            timestamp: new Date().toISOString(),
        });
    };

    return (
        <AdminContext.Provider
            value={{
                agents,
                archivedAgents,
                requests,
                archivedRequests,
                clients,
                logs,
                currentAdminRole,
                addAgent,
                updateAgent,
                deleteAgent,
                restoreAgent,
                regenerateInviteLink,
                addRequest,
                approveRequest,
                rejectRequest,
                restoreRequest,
                addClient,
                deleteClient,
                addLog,
                setRole,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) throw new Error("useAdmin must be used within AdminProvider");
    return context;
};