"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { useAdmin } from "@/store/AdminStore";

export default function AdminDashboardPage() {
  const { agents, clients, requests, archivedAgents, archivedRequests } =
    useAdmin();

  const approvedArchived = archivedRequests.filter(
    (r) => r.status === "Approved"
  ).length;
  const rejectedArchived = archivedRequests.filter(
    (r) => r.status === "Rejected"
  ).length;

  return (
    <div
      style={{
        display: "grid",
        gap: 24,
        gridTemplateColumns: "repeat(3, 1fr)",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "#fff",
          border: "1px solid #456d5bff",
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          padding: 20,
        }}
      >
        <h3 style={{ color: "#456d5bff", fontWeight: 700 }}>Agents</h3>
        <p style={{ fontSize: 22, fontWeight: 600 }}>{agents.length}</p>
      </div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #456d5bff",
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          padding: 20,
        }}
      >
        <h3 style={{ color: "#456d5bff", fontWeight: 700 }}>Clients</h3>
        <p style={{ fontSize: 22, fontWeight: 600 }}>{clients.length}</p>
      </div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #456d5bff",
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          padding: 20,
        }}
      >
        <h3 style={{ color: "#456d5bff", fontWeight: 700 }}>Requests</h3>
        <p style={{ fontSize: 22, fontWeight: 600 }}>{requests.length}</p>
      </div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #456d5bff",
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          padding: 20,
        }}
      >
        <h3 style={{ color: "#456d5bff", fontWeight: 700 }}>
          Deleted Agents (Archive)
        </h3>
        <p style={{ fontSize: 22, fontWeight: 600 }}>{archivedAgents.length}</p>
      </div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #456d5bff",
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          padding: 20,
        }}
      >
        <h3 style={{ color: "#456d5bff", fontWeight: 700 }}>
          Approved Requests (Archive)
        </h3>
        <p style={{ fontSize: 22, fontWeight: 600 }}>{approvedArchived}</p>
      </div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #456d5bff",
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          padding: 20,
        }}
      >
        <h3 style={{ color: "#456d5bff", fontWeight: 700 }}>
          Rejected Requests (Archive)
        </h3>
        <p style={{ fontSize: 22, fontWeight: 600 }}>{rejectedArchived}</p>
      </div>
    </div>
  );
}
