"use client";

import React from "react";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

const styles: Record<string, React.CSSProperties> = {
    app: {
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        minHeight: "100vh",
        background: "#456d5bff",
        color: "#e6edf3",
        fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    },
    main: {
        display: "grid",
        gridTemplateRows: "1fr auto",
    },
    content: {
        padding: "16px",
    },
};

type AdminLayoutProps = {
    children: React.ReactNode;
    section?: "dashboard" | "agents" | "requests" | "logs" | "settings";
};

export default function AdminLayoutClient({
    children,
    section,
}: AdminLayoutProps) {
    const go = (target: AdminLayoutProps["section"]) => {
        window.location.hash = target ?? "";
    };

    return (
        <div style={styles.app}>
            {/* Sidebar вынесен в отдельный компонент */}
            <Sidebar section={section} onNavigate={go} />

            {/* Main */}
            <div style={styles.main}>
                <main style={styles.content}>{children}</main>
                <Footer />
            </div>
        </div>
    );
}