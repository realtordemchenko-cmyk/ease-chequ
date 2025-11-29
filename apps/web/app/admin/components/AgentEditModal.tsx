"use client";

// Lightweight, reusable edit modal for Agent entity.
// Props-based to keep component decoupled from context.
// Comments in English per manifest.

import { useState } from "react";
import { Agent } from "types/Agent";

interface AgentEditModalProps {
  agent: Agent;
  onSave: (updated: Agent) => void;
  onClose: () => void;
  disabled?: boolean; // optional: disable inputs for non-editable roles
}

export default function AgentEditModal({
  agent,
  onSave,
  onClose,
  disabled = false,
}: AgentEditModalProps) {
  const [form, setForm] = useState<Agent>(agent);

  const updateField = <K extends keyof Agent>(key: K, value: Agent[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "520px",
          background: "var(--card-bg, #fff)",
          color: "var(--primary-text, #111)",
          border: "1px solid var(--card-border, #ddd)",
          borderRadius: 8,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          padding: 20,
        }}
      >
        <h2 style={{ margin: "0 0 12px 0" }}>Edit agent</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              disabled={disabled}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              disabled={disabled}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Membership number</span>
            <input
              type="text"
              value={form.membershipNumber}
              onChange={(e) => updateField("membershipNumber", e.target.value)}
              disabled={disabled}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Access until</span>
            <input
              type="date"
              value={form.accessUntil ?? ""}
              onChange={(e) => updateField("accessUntil", e.target.value)}
              disabled={disabled}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Invite link</span>
            <input
              type="text"
              value={form.inviteLink ?? ""}
              onChange={(e) => updateField("inviteLink", e.target.value)}
              disabled={disabled}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Status</span>
            <select
              value={form.status}
              onChange={(e) =>
                updateField("status", e.target.value as Agent["status"])
              }
              disabled={disabled}
            >
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Busy">Busy</option>
            </select>
          </label>

          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={disabled}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
