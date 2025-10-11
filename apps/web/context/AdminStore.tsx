// apps/web/context/AdminStore.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Agent } from "../types/Agent";
import { Client } from "../types/Client";
import { Request } from "../types/Request";
import { LogEntry } from "../types/LogEntry";

interface AdminContextType {
    agents: Agent[];
    clients: Client[];
    requests: Request[];
    logs: LogEntry[];
    addLog: (entry: Omit<LogEntry, "id">) => void;
    addAgent: (agent: Omit<Agent, "id">) => void;
    updateAgent: (agent: Agent) => void;
    deleteAgent: (id: number) => void;
    setRequestStatus: (id: number, status: Request["status"]) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// ID генератор (числовой, чтобы совпадал с типами)
let __idCounter = 1;
const mkId = () => __idCounter++;
const nowISO = () => new Date().toISOString();
const genInvite = (agentId: number) => `https://easechequ.example/invite/${agentId}`;

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [requests, setRequests] = useState<Request[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    // Добавление лога
    const addLog: AdminContextType["addLog"] = (entry) => {
        setLogs((prev) => {
            const newLog: LogEntry = { id: mkId(), ...entry };
            return [newLog, ...prev];
        });
    };

    // Добавление агента
    const addAgent: AdminContextType["addAgent"] = (agent) => {
        setAgents((prev) => {
            const id = mkId();
            const next: Agent = {
                ...agent,
                id,
                inviteLink:
                    agent.status === "Active"
                        ? genInvite(id)
                        : agent.inviteLink || "",
            };
            addLog({
                date: nowISO(),
                type: "Agent",
                message: `Agent created: ${agent.name}`,
            });
            return [...prev, next];
        });
    };

    // Обновление агента
    const updateAgent: AdminContextType["updateAgent"] = (agent) => {
        setAgents((prev) =>
            prev.map((a) => {
                if (a.id !== agent.id) return a;
                const updated: Agent = {
                    ...a,
                    ...agent,
                    inviteLink:
                        agent.status === "Active" && !agent.inviteLink
                            ? genInvite(agent.id)
                            : agent.inviteLink,
                };
                return updated;
            })
        );
        addLog({
            date: nowISO(),
            type: "Agent",
            message: `Agent updated: ${agent.name}`,
        });
    };

    // Удаление агента
    const deleteAgent: AdminContextType["deleteAgent"] = (id) => {
        setAgents((prev) => prev.filter((a) => a.id !== id));
        addLog({
            date: nowISO(),
            type: "Agent",
            message: `Agent deleted: ${id}`,
        });
    };

    // Обновление статуса заявки
    const setRequestStatus: AdminContextType["setRequestStatus"] = (
        id,
        status
    ) => {
        setRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status } : r))
        );

        const req = requests.find((r) => r.id === id);
        if (!req) {
            addLog({
                date: nowISO(),
                type: "Error",
                message: `Request not found: ${id}`,
            });
            return;
        }

        addLog({
            date: nowISO(),
            type: "System",
            message: `Request ${id} → ${status}`,
        });

        if (status === "Approved" && req.type === "Agent") {
            addAgent({
                name: req.name,
                email: req.email || "",
                boardMemberNumber: req.boardMemberNumber || "",
                accessUntil: "",
                inviteLink: "",
                status: "Pending",
            });
        }
    };

    return (
        <AdminContext.Provider
            value={{
                agents,
                clients,
                requests,
                logs,
                addLog,
                addAgent,
                updateAgent,
                deleteAgent,
                setRequestStatus,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
    return ctx;
};