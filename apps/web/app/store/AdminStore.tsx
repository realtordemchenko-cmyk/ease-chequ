// D:\Projects\Ease Chequ\apps\web\app\store\AdminStore.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Agent } from "@/types/Agent";
import { Request } from "@/types/Request";
import { LogEntry } from "@/types/LogEntry";
import { Client } from "@/types/Client";

type Role = "Super Admin" | "Admin" | "Viewer";

interface AdminContextType {
  agents: Agent[];
  archivedAgents: Agent[];
  requests: Request[];
  archivedRequests: Request[];
  clients: Client[];
  logs: LogEntry[];
  currentAdminRole: Role;

  addAgent: (agent: Omit<Agent, "id">) => void;
  updateAgent: (agent: Agent) => void;

  deleteAgent: (_id: string) => void;
  removeAgent: (_id: string) => void;

  restoreAgent: (_id: string) => void;
  regenerateInviteLink: (_id: string) => void;

  addRequest: (_req: Request) => void;
  approveRequest: (_id: string) => void;
  rejectRequest: (_id: string) => void;
  restoreRequest: (_id: string) => void;

  addClient: (_client: Client) => void;
  deleteClient: (_id: string) => void;

  addLog: (_log: LogEntry) => void;
  setRole: (_role: Role) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// UID generator
const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// === Deduplication helper ===
// Checks both active and archived agents by email and boardMemberNumber
const isDuplicateAgent = (
  email: string,
  boardMemberNumber: string,
  agents: Agent[],
  archivedAgents: Agent[]
): Agent | undefined => {
  const normalizedEmail = email.trim().toLowerCase();
  return (
    agents.find((a) => a.email.trim().toLowerCase() === normalizedEmail) ||
    archivedAgents.find((a) => a.email.trim().toLowerCase() === normalizedEmail)
  );
};
export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
      const raw =
        typeof window !== "undefined" ? localStorage.getItem(key) : null;
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  };
  const writeJson = (key: string, value: unknown) => {
    try {
      if (typeof window !== "undefined")
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignored: localStorage write failed (private mode or storage quota)
    }
  };

  // Seed
  useEffect(() => {
    const hasAgents = readJson<Agent[]>("agents", []);
    const hasClients = readJson<Client[]>("clients", []);
    // ...existing code...
  }, []);

  // ...existing code...

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
        addAgent: () => {},
        updateAgent: () => {},
        deleteAgent: () => {},
        removeAgent: () => {},
        restoreAgent: () => {},
        regenerateInviteLink: () => {},
        addRequest: () => {},
        approveRequest: () => {},
        rejectRequest: () => {},
        restoreRequest: () => {},
        addClient: () => {},
        deleteClient: () => {},
        addLog: () => {},
        setRole: () => {},
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
