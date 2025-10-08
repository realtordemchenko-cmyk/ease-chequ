// apps/web/app/admin/layout.tsx
import React from "react";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <Topbar />
                <main style={{ flex: 1, overflowY: "auto", padding: 16 }}>{children}</main>
            </div>
        </div>
    );
}