"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useAdmin } from "./store/AdminStore";

export default function Page() {
  // Mounted guard to avoid SSR context usage
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const admin = useAdmin();
  if (!mounted || admin === null) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "var(--text-main)",
        }}
      >
        Admin Dashboard
      </h1>

      <p style={{ color: "var(--text-muted)" }}>
        Welcome to the administration panel.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--card-bg)",
            border: `1px solid var(--card-border)`,
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              fontWeight: 600,
              marginBottom: "8px",
              color: "var(--text-main)",
            }}
          >
            Agents
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Manage your agents here.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "var(--card-bg)",
            border: `1px solid var(--card-border)`,
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              fontWeight: 600,
              marginBottom: "8px",
              color: "var(--text-main)",
            }}
          >
            Clients
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Manage your clients here.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "var(--card-bg)",
            border: `1px solid var(--card-border)`,
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              fontWeight: 600,
              marginBottom: "8px",
              color: "var(--text-main)",
            }}
          >
            Audit Logs
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Review system activity and logs.
          </p>
        </div>
      </section>
    </div>
  );
}
