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

// ...удалены неиспользуемые uid и isDuplicateAgent...
export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [agents] = useState<Agent[]>([]);
  const [archivedAgents] = useState<Agent[]>([]);
  const [requests] = useState<Request[]>([]);
  const [archivedRequests] = useState<Request[]>([]);
  const [clients] = useState<Client[]>([]);
  const [logs] = useState<LogEntry[]>([]);
  const [currentAdminRole] = useState<Role>("Super Admin");

  // Helpers
  // ...удалены неиспользуемые readJson и writeJson...

  // Seed
  useEffect(() => {
    // ...удалены неиспользуемые hasAgents и hasClients...
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
  if (typeof window === "undefined") {
    // SSR guard: do not use context on server
    return null;
  }
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
};
