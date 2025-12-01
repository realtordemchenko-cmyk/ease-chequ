// D:\Projects\Ease Chequ\apps\web\context\AdminStore.tsx
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

  addAgent: (agent: Omit<Agent, "id">) => void;
  updateAgent: (agent: Agent) => void;

  deleteAgent: (_id: string) => void;
  removeAgent: (_id: string) => void; // ← добавлено

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
// Checks both active and archived agents by email and membershipNumber
const isDuplicateAgent = (
  email: string,
  membershipNumber: string,
  agents: Agent[],
  archivedAgents: Agent[]
): Agent | undefined => {
  const normalizedEmail = email.trim().toLowerCase();
  return (
    agents.find(
      (a) =>
        a.email.trim().toLowerCase() === normalizedEmail ||
        (!!membershipNumber && a.membershipNumber === membershipNumber)
    ) ||
    archivedAgents.find(
      (a) =>
        a.email.trim().toLowerCase() === normalizedEmail ||
        (!!membershipNumber && a.membershipNumber === membershipNumber)
    )
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
    const hasRequests = readJson<Request[]>("requests", []);

    if (
      hasAgents.length === 0 &&
      hasClients.length === 0 &&
      hasRequests.length === 0
    ) {
      const seedAgents: Agent[] = [
        {
          id: "a1",
          name: "Alice Agent",
          email: "alice@example.com",
          status: "Active",
          membershipNumber: "",
          accessUntil: "",
          inviteLink: "",
        },
        {
          id: "a2",
          name: "Bob Broker",
          email: "bob@example.com",
          status: "Active",
          membershipNumber: "",
          accessUntil: "",
          inviteLink: "",
        },
      ];
      const seedClients: Client[] = [
        {
          id: "c1",
          agentId: "a1",
          name: "Charlie Client",
          email: "charlie@example.com",
          phone: "+1-416-555-0101",
        },
        {
          id: "c2",
          agentId: "a2",
          name: "Dana Client",
          email: "dana@example.com",
          phone: "+1-416-555-0102",
        },
      ];
      const seedRequests: Request[] = [
        {
          id: "r1",
          name: "Charlie Client",
          email: "charlie@example.com",
          type: "Prequal-Rent",
          status: "Pending",
        },
        {
          id: "r2",
          name: "Dana Client",
          email: "dana@example.com",
          type: "Prequal-Rent",
          status: "Pending",
        },
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
  useEffect(
    () => writeJson("archivedAgents", archivedAgents),
    [archivedAgents]
  );
  useEffect(() => writeJson("requests", requests), [requests]);
  useEffect(
    () => writeJson("archivedRequests", archivedRequests),
    [archivedRequests]
  );
  useEffect(() => writeJson("clients", clients), [clients]);
  useEffect(() => writeJson("logs", logs), [logs]);
  // === Agents ===
  const addAgent = (agent: Omit<Agent, "id">) => {
    // Deduplication check
    const duplicate = isDuplicateAgent(
      agent.email,
      agent.membershipNumber,
      agents,
      archivedAgents
    );
    if (duplicate) {
      addLog({
        id: uid(),
        type: "Agent",
        message: `Duplicate agent detected (${agent.email}); add aborted`,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const safeAgent: Agent = {
      ...agent,
      id: uid(),
      membershipNumber: agent.membershipNumber || "",
      accessUntil: agent.accessUntil || "",
      inviteLink: agent.inviteLink || `https://easechequ.app/invite/${uid()}`,
    };
    setAgents((prev) => [...prev, safeAgent]);
    addLog({
      id: uid(),
      type: "Agent",
      message: `Agent ${safeAgent.name} added`,
      timestamp: new Date().toISOString(),
    });
  };

  const updateAgent = (agent: Agent) => {
    setAgents((prev) => {
      const idx = prev.findIndex((a) => a.id === agent.id);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = { ...prev[idx], ...agent };
      return next;
    });
    addLog({
      id: uid(),
      type: "Agent",
      message: `Agent ${agent.name} updated`,
      timestamp: new Date().toISOString(),
    });
  };

  const deleteAgent = (id: string) => {
    setAgents((prev) => {
      const agent = prev.find((a) => a.id === id);
      if (!agent) return prev;
      // Normalize status to Deleted before archiving
      const archivedCopy: Agent = { ...agent, status: "Deleted" };
      setArchivedAgents((arch) => [...arch, archivedCopy]);
      addLog({
        id: uid(),
        type: "Agent",
        message: `Agent ${agent.name} archived as Deleted`,
        timestamp: new Date().toISOString(),
      });
      return prev.filter((a) => a.id !== id);
    });
  };

  const restoreAgent = (id: string) => {
    setArchivedAgents((prev) => {
      const agent = prev.find((a) => a.id === id);
      if (!agent) return prev;

      // Deduplication check before restore
      const duplicate = isDuplicateAgent(
        agent.email,
        agent.membershipNumber,
        agents,
        []
      );
      if (duplicate) {
        addLog({
          id: uid(),
          type: "Agent",
          message: `Restore cancelled for ${agent.name} — active agent exists`,
          timestamp: new Date().toISOString(),
        });
        return prev;
      }

      setAgents((agents) => [...agents, agent]);
      addLog({
        id: uid(),
        type: "Agent",
        message: `Agent ${agent.name} restored from archive`,
        timestamp: new Date().toISOString(),
      });
      return prev.filter((a) => a.id !== id);
    });
  };

  const regenerateInviteLink = (id: string) => {
    setAgents((prev) => {
      const idx = prev.findIndex((a) => a.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        inviteLink: `https://easechequ.app/invite/${uid()}`,
      };
      addLog({
        id: uid(),
        type: "Agent",
        message: `Invite link regenerated for ${next[idx].name}`,
        timestamp: new Date().toISOString(),
      });
      return next;
    });
  };
  // === Requests ===
  const addRequest = (req: Request) => {
    const safeReq = {
      ...req,
      id: req.id || uid(),
      status: req.status || "Pending",
    };
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

      // Deduplication check across active and archived agents
      const duplicate = isDuplicateAgent(req.email, "", agents, archivedAgents);
      if (!duplicate) {
        const newAgent: Agent = {
          id: uid(),
          name: req.name,
          email: req.email,
          status: "Active",
          membershipNumber: "",
          accessUntil: "",
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
        if (
          archivedAgents.some(
            (a) => a.email.toLowerCase() === req.email.toLowerCase()
          )
        ) {
          addLog({
            id: uid(),
            type: "Agent",
            message: `Archived agent with email ${req.email} exists; no new agent created`,
            timestamp: new Date().toISOString(),
          });
        } else {
          addLog({
            id: uid(),
            type: "Agent",
            message: `Existing agent ${duplicate.name} matched; no duplicate created`,
            timestamp: new Date().toISOString(),
          });
        }
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
    // Validate agent existence
    const agentExists = agents.some((a) => a.id === client.agentId);
    if (!agentExists) {
      addLog({
        id: uid(),
        type: "Client",
        message: `Add client aborted — agent ${client.agentId} not found`,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const safeClient: Client = { ...client, id: client.id || uid() };
    setClients((prev) => [...prev, safeClient]);
    addLog({
      id: uid(),
      type: "Client",
      message: `Client ${safeClient.name} added to Agent ${client.agentId}`,
      timestamp: new Date().toISOString(),
    });
  };

  const deleteClient = (id: string) => {
    const client = clients.find((c) => c.id === id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    addLog({
      id: uid(),
      type: "Client",
      message: client
        ? `Client ${client.name} (Agent ${client.agentId}) deleted`
        : `Client ${id} deleted`,
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
        // алиас для совместимости с AgentsPage
        removeAgent: deleteAgent,
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
