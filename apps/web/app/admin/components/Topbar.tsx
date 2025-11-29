"use client";
import React from "react";

import { useAdmin } from "@/store/AdminStore";

export default function Topbar() {
  const { currentAdminRole, setRole, addLog } = useAdmin();

  const handleRefresh = () => window.location.reload();

  const handleSave = () => {
    addLog({
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2),
      type: "System",
      message: "Manual save triggered",
      timestamp: new Date().toISOString(),
    });
    alert("Changes saved (simulated)");
  };

  const handleRoleChange = (role: "Super Admin" | "Admin" | "Viewer") => {
    setRole(role);
  };

  const isSuperAdmin = currentAdminRole === "Super Admin";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "56px",
        padding: "0 16px",
        background: "var(--topbar-bg)",
        borderBottom: "1px solid var(--card-border)",
        color: "var(--secondary-text)",
      }}
    >
      <h2 style={{ fontSize: 16, fontWeight: 600 }}>EaseChequ Admin</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={handleRefresh} style={{ padding: "6px 12px" }}>
          Refresh
        </button>
        <button onClick={handleSave} style={{ padding: "6px 12px" }}>
          Save
        </button>
        <button style={{ padding: "6px 12px" }}>Settings</button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: 14 }}>Access:</label>
          <select
            value={currentAdminRole}
            onChange={(e) =>
              handleRoleChange(
                e.target.value as "Super Admin" | "Admin" | "Viewer"
              )
            }
            disabled={!isSuperAdmin}
            style={{
              padding: "4px 8px",
              borderRadius: 4,
              border: "1px solid var(--card-border)",
              background: "var(--card-bg)",
              color: "var(--secondary-text)",
            }}
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
      </div>
    </div>
  );
}
