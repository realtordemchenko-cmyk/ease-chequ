"use client";
export const dynamic = "force-dynamic";

import { useParams, useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminStore";
import { useMemo, useState } from "react";
import { Agent } from "@/types/Agent";

export default function AgentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { agents, updateAgent } = useAdmin();

  const idParam = String(params?.id ?? "");
  // Не позволяем заходить сюда с "new"
  if (idParam === "new") {
    router.replace("/admin/agents/new");
    return null;
  }

  const agent = useMemo(
    () => agents.find((a) => String(a.id) === idParam) ?? null,
    [agents, idParam]
  );
  const [form, setForm] = useState<Agent | null>(agent);

  if (!agent || !form) {
    return <div>Agent not found</div>;
  }

  const handleChange = (field: keyof Agent, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = () => {
    if (!form) return;
    updateAgent(form); // канонично: обновление через стор
    router.push("/admin/agents");
  };

  // Клиенты: модалка удаления
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  const confirmDeleteClient = () => {
    if (!selectedClient || !form) return;
    const nextClients = (form.clients ?? []).filter(
      (c: any) => String(c.id) !== String(selectedClient.id)
    );
    const nextForm = { ...form, clients: nextClients };
    setForm(nextForm);
    updateAgent(nextForm);
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
          {form.inviteLink ? (
            <>
              <a href={form.inviteLink} target="_blank">
                Open
              </a>{" "}
              <button
                onClick={() => handleChange("inviteLink", `link-${Date.now()}`)}
              >
                Regenerate
              </button>
            </>
          ) : (
            <button
              onClick={() => handleChange("inviteLink", `link-${Date.now()}`)}
            >
              Generate
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => router.push("/admin/agents")}>Cancel</button>
        </div>
      </div>

      <hr style={{ margin: "24px 0" }} />

      <h2>Clients</h2>
      {form.clients && form.clients.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Name</th>
              <th style={{ textAlign: "left" }}>Status</th>
              <th style={{ textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {form.clients.map((client: any) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.status}</td>
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
