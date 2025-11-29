"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminStore";
import { Agent } from "@/types/Agent";

export default function NewAgentPage() {
  const { addAgent } = useAdmin(); // каноничный API стора: addAgent
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [membershipNumber, setMembershipNumber] = useState("");
  const [accessUntil, setAccessUntil] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    setError(null);

    // Minimal required validation по канону
    if (!name.trim()) return setError("Name is required");
    if (!email.trim()) return setError("Email is required");
    if (!membershipNumber.trim())
      return setError("Membership number is required");

    const newAgent: Agent = {
      id: String(Date.now()), // временный строковый id для надёжного сравнения
      name: name.trim(),
      email: email.trim(),
      membershipNumber: membershipNumber.trim(),
      accessUntil: accessUntil || null,
      inviteLink: null,
      status: "active",
      clients: [], // канонично: вложенные клиенты
    };

    try {
      addAgent(newAgent);
      router.push("/admin/agents");
    } catch (e: any) {
      setError(e?.message ?? "Failed to add agent");
    }
  };

  return (
    <div>
      <h1>Add Agent</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 420,
        }}
      >
        {error && <div style={{ color: "crimson" }}>{error}</div>}

        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Membership #:
          <input
            type="text"
            value={membershipNumber}
            onChange={(e) => setMembershipNumber(e.target.value)}
          />
        </label>

        <label>
          Access until:
          <input
            type="date"
            value={accessUntil}
            onChange={(e) => setAccessUntil(e.target.value)}
          />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => router.push("/admin/agents")}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
