// apps/web/components/agents/AgentForm.tsx
"use client";
import React from "react";
import { useState } from "react";

export default function AgentForm() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Agent saved: ${name} (${role})`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "400px",
      }}
    >
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "6px" }}
        />
      </label>
      <label>
        Role:
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: "100%", padding: "6px" }}
        />
      </label>
      <button type="submit" style={{ padding: "8px 12px" }}>
        Save Agent
      </button>
    </form>
  );
}
