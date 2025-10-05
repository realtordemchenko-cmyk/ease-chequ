"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type AgentStatus = "Active" | "Pending" | "Inactive";

interface ClientRef {
    id: number;
    name: string;
    status: "New" | "In review" | "Approved" | "Rejected";
}

export interface Agent {
    id: number;
    name: string;
    email: string;
    phone: string;
    accessUntil: string;
    status: AgentStatus;
    memberNumber: string;
    clients: ClientRef[];
}

interface AgentsContextType {
    agents: Agent[];
    setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
}

const AgentsContext = createContext<AgentsContextType | undefined>(undefined);

export const AgentsProvider = ({ children }: { children: React.ReactNode }) => {
    const [agents, setAgents] = useState<Agent[]>([]);

    // Загружаем агентов из localStorage при старте
    useEffect(() => {
        const saved = localStorage.getItem("agents");
        if (saved) {
            try {
                setAgents(JSON.parse(saved));
            } catch {
                setAgents([]);
            }
        }
    }, []);

    // Сохраняем агентов в localStorage при изменении
    useEffect(() => {
        localStorage.setItem("agents", JSON.stringify(agents));
    }, [agents]);

    return (
        <AgentsContext.Provider value={{ agents, setAgents }}>
            {children}
        </AgentsContext.Provider>
    );
};

export const useAgents = () => {
    const ctx = useContext(AgentsContext);
    if (!ctx) throw new Error("useAgents must be used within AgentsProvider");
    return ctx;
};