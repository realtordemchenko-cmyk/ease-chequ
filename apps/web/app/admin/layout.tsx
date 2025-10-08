// apps/web/app/admin/layout.tsx
"use client";

import { AdminProvider } from "../../context/AdminStore";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh", background: "var(--app-bg)" }}>
                <AdminProvider>
                    <aside style={{ borderRight: `1px solid var(--card-border)`, background: "var(--sidebar-bg)" }}>
                        <Sidebar />
                    </aside>
                    <main style={{ display: "grid", gridTemplateRows: "56px 1fr" }}>
                        <div style={{ borderBottom: `1px solid var(--card-border)`, background: "var(--topbar-bg)" }}>
                            <Topbar />
                        </div>
                        <section style={{ padding: "16px" }}>{children}</section>
                    </main>
                </AdminProvider>
            </body>
        </html>
    );
}