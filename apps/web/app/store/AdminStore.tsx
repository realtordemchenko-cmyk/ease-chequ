// D:\Projects\Ease Chequ\apps\web\app\store\AdminStore.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Agent } from "../../types/Agent";
import { Request } from "../../types/Request";
import { LogEntry } from "../../types/LogEntry";
import { Client } from "../../types/Client";

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
  deleteAgent: (id: string) => void;
  removeAgent: (id: string) => void;
  archiveAgent: (id: string) => void;
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

// UID generator & helpers from consolidated store
const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

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
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      // ignore persistence errors (private mode / quota)
    }
  };

  useEffect(() => {
    const hasAgents = readJson<Agent[]>("agents", []);
    const hasClients = readJson<Client[]>("clients", []);
    const hasRequests = readJson<Request[]>("requests", []);
    if (
      hasAgents.length === 0 &&
      hasClients.length === 0 &&
      hasRequests.length === 0
    ) {
      writeJson("agents", [
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
      ]);
      writeJson("clients", [
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
      ]);
      writeJson("requests", [
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
      ]);
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

  const addAgent = (agent: Omit<Agent, "id">) => {
    const duplicate = isDuplicateAgent(
      agent.email,
      agent.membershipNumber,
      agents,
      archivedAgents
    );
    if (duplicate) {
      // If duplicate exists in active list: merge/update
      if (agents.some((a) => a.id === duplicate.id)) {
        const updated: Agent = { ...duplicate, ...agent, id: duplicate.id };
        setAgents((p) => p.map((a) => (a.id === updated.id ? updated : a)));
        addLog({
          id: uid(),
          type: "Agent",
          message: `Agent ${updated.email} updated (dedupe active)`,
          timestamp: new Date().toISOString(),
        });
        return;
      }
      // If duplicate only in archived: restore & update (merge) then remove from archive
      if (archivedAgents.some((a) => a.id === duplicate.id)) {
        const restored: Agent = { ...duplicate, ...agent, id: duplicate.id };
        setArchivedAgents((prev) => prev.filter((x) => x.id !== duplicate.id));
        setAgents((p) => [...p, restored]);
        addLog({
          id: uid(),
          type: "Agent",
          message: `Agent ${restored.email} restored & updated from archive`,
          timestamp: new Date().toISOString(),
        });
        return;
      }
      // Fallback: should not reach here but safe guard
      addLog({
        id: uid(),
        type: "Agent",
        message: `Duplicate handling fallthrough for ${duplicate.email}`,
        timestamp: new Date().toISOString(),
      });
      return;
    }
    const safe: Agent = {
      ...agent,
      id: uid(),
      membershipNumber: agent.membershipNumber || "",
      accessUntil: agent.accessUntil || "",
      inviteLink: agent.inviteLink || undefined,
    };
    setAgents((p) => [...p, safe]);
    addLog({
      id: uid(),
      type: "Agent",
      message: `Agent ${safe.email} added`,
      timestamp: new Date().toISOString(),
    });
  };
  const updateAgent = (agent: Agent) => {
    setAgents((p) => {
      const i = p.findIndex((a) => a.id === agent.id);
      if (i === -1) return p;
      const n = [...p];
      n[i] = { ...p[i], ...agent };
      return n;
    });
    addLog({
      id: uid(),
      type: "Agent",
      message: `Agent ${agent.name} updated`,
      timestamp: new Date().toISOString(),
    });
  };
  // Permanent delete: remove from active and archived
  const deleteAgent = (id: string) => {
    const a =
      agents.find((x) => x.id === id) ||
      archivedAgents.find((x) => x.id === id);
    setAgents((p) => p.filter((x) => x.id !== id));
    setArchivedAgents((ar) => ar.filter((x) => x.id !== id));
    addLog({
      id: uid(),
      type: "Agent",
      message: a ? `Agent ${a.email} deleted` : `Agent ${id} deleted`,
      timestamp: new Date().toISOString(),
    });
  };

  // Archive: move from active to archived (recoverable). Prevent duplicates in archived.
  const archiveAgent = (id: string) => {
    const a = agents.find((x) => x.id === id);
    if (!a) return;
    const already = archivedAgents.find(
      (x) =>
        x.id === a.id ||
        x.email.trim().toLowerCase() === a.email.trim().toLowerCase()
    );
    // Remove from active regardless; add to archived only if not present
    setAgents((p) => p.filter((x) => x.id !== id));
    if (!already) {
      setArchivedAgents((ar) => [...ar, { ...a }]);
      addLog({
        id: uid(),
        type: "Agent",
        message: `Agent ${a.email} archived`,
        timestamp: new Date().toISOString(),
      });
    } else {
      addLog({
        id: uid(),
        type: "Agent",
        message: `Agent ${a.email} archive skipped (exists)`,
        timestamp: new Date().toISOString(),
      });
    }
  };
  const restoreAgent = (id: string) => {
    const archived = archivedAgents.find((x) => x.id === id);
    if (!archived) return;
    // If active has same email or id, merge by id; else move
    const active = agents.find(
      (a) =>
        a.id === id ||
        a.email.trim().toLowerCase() === archived.email.trim().toLowerCase()
    );
    if (active) {
      setAgents((p) =>
        p.map((a) =>
          a.id === active.id ? { ...active, ...archived, id: active.id } : a
        )
      );
      setArchivedAgents((ar) => ar.filter((x) => x.id !== archived.id));
      addLog({
        id: uid(),
        type: "Agent",
        message: `Agent ${archived.email} merged from archive`,
        timestamp: new Date().toISOString(),
      });
      return;
    }
    setAgents((p) => [...p, archived]);
    setArchivedAgents((ar) => ar.filter((x) => x.id !== archived.id));
    addLog({
      id: uid(),
      type: "Agent",
      message: `Agent ${archived.email} restored`,
      timestamp: new Date().toISOString(),
    });
  };
  const regenerateInviteLink = (id: string) => {
    setAgents((p) => {
      const i = p.findIndex((a) => a.id === id);
      if (i === -1) return p;
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://easechequ.app";
      const url = new URL("/invite", origin);
      url.searchParams.set("agent", p[i].id);
      const n = [...p];
      n[i] = { ...n[i], inviteLink: url.toString() };
      return n;
    });
    addLog({
      id: uid(),
      type: "Agent",
      message: `Invite link regenerated for ${id}`,
      timestamp: new Date().toISOString(),
    });
  };
  const addRequest = (req: Request) => {
    const safe = {
      ...req,
      id: req.id || uid(),
      status: req.status || "Pending",
    };
    setRequests((p) => [...p, safe]);
    addLog({
      id: uid(),
      type: "Request",
      message: `Request ${safe.name} added`,
      timestamp: new Date().toISOString(),
    });
  };
  const approveRequest = (id: string) => {
    setRequests((p) => {
      const r = p.find((x) => x.id === id);
      if (!r) return p;
      const approved = { ...r, status: "Approved" as const };
      setArchivedRequests((ar) => [...ar, approved]);
      const dup = isDuplicateAgent(r.email, "", agents, archivedAgents);
      if (!dup) {
        const newAgentId = uid();
        const origin =
          typeof window !== "undefined"
            ? window.location.origin
            : "https://easechequ.app";
        const inviteUrl = new URL("/invite", origin);
        inviteUrl.searchParams.set("agent", newAgentId);
        const newA: Agent = {
          id: newAgentId,
          name: r.name,
          email: r.email,
          status: "Active",
          membershipNumber: "",
          accessUntil: "",
          inviteLink: inviteUrl.toString(),
        };
        setAgents((a) => [...a, newA]);
        addLog({
          id: uid(),
          type: "Agent",
          message: `Agent ${newA.name} created from request`,
          timestamp: new Date().toISOString(),
        });
      } else {
        addLog({
          id: uid(),
          type: "Agent",
          message: `Existing/archived agent match for ${r.email}`,
          timestamp: new Date().toISOString(),
        });
      }
      addLog({
        id: uid(),
        type: "Request",
        message: `Request ${r.name} approved`,
        timestamp: new Date().toISOString(),
      });
      return p.filter((x) => x.id !== id);
    });
  };
  const rejectRequest = (id: string) => {
    setRequests((p) => {
      const r = p.find((x) => x.id === id);
      if (!r) return p;
      const rejected = { ...r, status: "Rejected" as const };
      setArchivedRequests((ar) => [...ar, rejected]);
      addLog({
        id: uid(),
        type: "Request",
        message: `Request ${r.name} rejected`,
        timestamp: new Date().toISOString(),
      });
      return p.filter((x) => x.id !== id);
    });
  };
  const restoreRequest = (id: string) => {
    setArchivedRequests((prev) => {
      const r = prev.find((x) => x.id === id);
      if (!r) return prev;
      const restored = { ...r, status: "Pending" as const };
      setRequests((reqs) => [...reqs, restored]);
      addLog({
        id: uid(),
        type: "Request",
        message: `Request ${r.name} restored`,
        timestamp: new Date().toISOString(),
      });
      return prev.filter((x) => x.id !== id);
    });
  };
  const addClient = (client: Client) => {
    const exists = agents.some((a) => a.id === client.agentId);
    if (!exists) {
      addLog({
        id: uid(),
        type: "Client",
        message: `Agent ${client.agentId} not found`,
        timestamp: new Date().toISOString(),
      });
      return;
    }
    const safe = { ...client, id: client.id || uid() };
    setClients((p) => [...p, safe]);
    addLog({
      id: uid(),
      type: "Client",
      message: `Client ${safe.name} added`,
      timestamp: new Date().toISOString(),
    });
  };
  const deleteClient = (id: string) => {
    const c = clients.find((x) => x.id === id);
    setClients((p) => p.filter((x) => x.id !== id));
    addLog({
      id: uid(),
      type: "Client",
      message: c ? `Client ${c.name} deleted` : `Client ${id} deleted`,
      timestamp: new Date().toISOString(),
    });
  };
  const addLog = (log: LogEntry) => setLogs((p) => [...p, log]);
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
        archiveAgent,
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
        removeAgent: deleteAgent,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// Safe hook: returns null instead of throw, allowing guards in components
export const useAdmin = (): AdminContextType | null => {
  if (typeof window === "undefined") return null; // SSR safe
  const ctx = useContext(AdminContext);
  return ctx || null;
};
