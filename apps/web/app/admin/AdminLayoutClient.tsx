"use client";

import { AdminProvider } from "../store/AdminStore";
import AdminSidebar from "./components/AdminSidebar";
import Topbar from "./components/Topbar";
import React from "react";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div
        style={{ display: "flex", minHeight: "100vh", background: "#f7fafc" }}
      >
        <AdminSidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Topbar />
          <main style={{ flex: 1, padding: 24 }}>{children}</main>
        </div>
      </div>
    </AdminProvider>
  );
}
