import Link from "next/link";
import React from "react";

export default function AdminSidebar() {
  return (
    <nav
      style={{
        width: 220,
        background: "var(--sidebar-bg, #f7fafc)",
        borderRight: "1px solid var(--card-border, #e2e8f0)",
        minHeight: "100vh",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Admin</h3>
      <Link href="/admin/dashboard">Dashboard</Link>
      <Link href="/admin/agents">Agents</Link>
      <Link href="/admin/clients">Clients</Link>
      <Link href="/admin/requests">Requests</Link>
      <Link href="/admin/logs">Logs</Link>
      <Link href="/admin/settings">Settings</Link>
      <Link href="/admin/archive">Archive</Link>
    </nav>
  );
}
