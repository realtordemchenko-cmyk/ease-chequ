"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdmin } from "../../../store/AdminStore";
import { Agent } from "../../../../types/Agent";
import { Client } from "../../../../types/Client";

export default function AgentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const admin = useAdmin();
  function hasFallback(obj: unknown): obj is { __fallback: boolean } {
    return typeof obj === "object" && obj !== null && "__fallback" in obj;
  }
  if (!admin || hasFallback(admin)) {
    return <div>AdminStore not available</div>;
  }
  const { agents, clients, updateAgent, regenerateInviteLink, deleteClient } =
    admin;
  // Hydration guard
  const [isMounted, setIsMounted] = useState(false);
  const idParam = String(params?.id ?? "");
  const agent = useMemo(
    () => agents.find((a) => String(a.id) === idParam) ?? null,
    [agents, idParam]
  );
  const [form, setForm] = useState<Agent | null>(agent);
  const agentClients = useMemo(
    () => clients.filter((c) => c.agentId === agent?.id),
    [clients, agent?.id]
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    setForm(agent ?? null);
  }, [agent]);

  if (!isMounted) return null;
  if (idParam === "new") {
    router.replace("/admin/agents/new");
    return null;
  }
  if (!agent || !form) {
    return <div>Agent not found</div>;
  }

  const handleChange = <K extends keyof Agent>(field: K, value: Agent[K]) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = () => {
    if (!form) return;
    updateAgent(form);
    router.push("/admin/agents");
  };

  const handleInvite = () => {
    regenerateInviteLink(agent.id);
  };

  const confirmDeleteClient = () => {
    if (!selectedClient) return;
    deleteClient(selectedClient.id);
    setSelectedClient(null);
    setIsDeleteOpen(false);
  };

  return (
    <div>
      <h1>Agent Details</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 420,
        }}
      >
        <label>
          Name:
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </label>
        <label>
          Membership #:
          <input
            type="text"
            value={form.membershipNumber ?? ""}
            onChange={(e) => handleChange("membershipNumber", e.target.value)}
          />
        </label>
        <label>
          Status:
          <select
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </label>
        <label>
          Access until:
          <input
            type="date"
            value={form.accessUntil ?? ""}
            onChange={(e) => handleChange("accessUntil", e.target.value)}
          />
        </label>
        <div>
          Invite link:{" "}
          {agent.inviteLink ? (
            <>
              <a
                href={agent.inviteLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open
              </a>{" "}
              <button onClick={handleInvite}>Regenerate</button>
            </>
          ) : (
            <button onClick={handleInvite}>Generate</button>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => router.push("/admin/agents")}>Cancel</button>
        </div>
      </div>
      <hr style={{ margin: "24px 0" }} />
      <h2>Clients</h2>
      {agentClients.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Name</th>
              <th style={{ textAlign: "left" }}>Email</th>
              <th style={{ textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agentClients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedClient(client);
                      setIsDeleteOpen(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No clients assigned.</p>
      )}
      {isDeleteOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
            <p>
              Delete client <strong>{selectedClient?.name}</strong>?
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={confirmDeleteClient}>Confirm</button>
              <button onClick={() => setIsDeleteOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <hr style={{ margin: "24px 0" }} />
      <h2>Statistics</h2>
      <p>TODO</p>
    </div>
  );
}
