"use client";
import React from "react";
export const dynamic = "force-dynamic";

// Dashboard page (updated):
// - Shows counts for agents, requests, archived agents, archived requests
// - Provides "View all" links to centralized Archive page with query params
// - Lightweight: only counters and navigation, no long lists

import Link from "next/link";
import { useAdmin } from "../../store/AdminStore";

export default function DashboardPage() {
  const { agents, requests, archivedAgents, archivedRequests } = useAdmin();

  const activeAgents = agents.filter((a) => a.status === "Active").length;
  const deletedAgents = archivedAgents.length;
  const pendingRequests = requests.filter((r) => r.status === "Pending").length;
  const approvedRequests = archivedRequests.filter(
    (r) => r.status === "Approved"
  ).length;
  const rejectedRequests = archivedRequests.filter(
    (r) => r.status === "Rejected"
  ).length;

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <h1>Dashboard</h1>

      <div style={{ display: "grid", gap: 16, maxWidth: 480 }}>
        {/* Agents */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Active Agents</span>
          <span>{activeAgents}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Deleted Agents</span>
          <span>
            {deletedAgents}{" "}
            <Link href="/admin/archive?page=agents" style={{ marginLeft: 8 }}>
              View all
            </Link>
          </span>
        </div>

        {/* Requests */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Pending Requests</span>
          <span>{pendingRequests}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Approved Requests</span>
          <span>
            {approvedRequests}{" "}
            <Link
              href="/admin/archive?page=requests&type=approved"
              style={{ marginLeft: 8 }}
            >
              View all
            </Link>
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Rejected Requests</span>
          <span>
            {rejectedRequests}{" "}
            <Link
              href="/admin/archive?page=requests&type=rejected"
              style={{ marginLeft: 8 }}
            >
              View all
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
