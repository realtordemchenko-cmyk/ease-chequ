"use client";
import React from "react";
export const dynamic = "force-dynamic";
import { useAdmin } from "../../store/AdminStore";
import LogsPagination from "../../../components/logs/LogsPagination";

export default function LogsPage() {
  const admin = useAdmin();
  if (!admin) {
    if (typeof window === "undefined") return null; // SSR: do not render
    // Client but context not available: show fallback or error
    return (
      <div style={{ color: "red", padding: 8 }}>Admin context unavailable</div>
    );
  }
  const { logs } = admin;

  return (
    <div>
      <h1>Logs</h1>
      <LogsPagination logs={logs} pageSize={10} />
    </div>
  );
}
