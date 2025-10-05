// D:\Projects\Ease Chequ\apps\web\app\admin\layout.tsx
"use client";
import React from "react";


export const styles: Record<string, React.CSSProperties> = {
    app: {
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        minHeight: "100vh",
        background: "#456d5bff",
        color: "#e6edf3",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    },
    sidebar: {
        borderRight: "1px solid #649f83ff",
        padding: "16px",
        background: "#102722ff",
    },
    brand: { fontWeight: 700, marginBottom: "12px" },
    navItem: {
        display: "block",
        width: "100%",
        textAlign: "left" as const,
        padding: "10px 12px",
        marginBottom: "6px",
        borderRadius: "8px",
        background: "transparent",
        color: "#e6edf3",
        border: "1px solid transparent",
        cursor: "pointer",
    },
    navItemActive: {
        background: "#17422aff",
        borderColor: "#d3e8ffff",   // светлый цвет
        borderWidth: "2px",         // толщина рамки
        borderStyle: "solid",       // тип линии
        borderRadius: "8px",        // чтобы совпадало с navItem
    },
    main: { display: "grid", gridTemplateRows: "1fr auto" },
    content: { padding: "16px" },
    card: {
        background: "#0d1117",
        border: "1px solid #bedbffff",
        borderRadius: "10px",
        padding: "16px",
        marginBottom: "16px",
    },
    cardTitle: { marginTop: 0, marginBottom: "12px", fontSize: "18px", fontWeight: 600 },
    list: { margin: 0, paddingLeft: "20px" },
    footer: {
        padding: "12px 16px",
        borderTop: "1px solid #e0eeffff",
        background: "#0d1117",
        color: "#8b949e",
    },
    // Inputs
    input: {
        padding: "8px 10px",
        borderRadius: "6px",
        border: "1px solid #30363d",
        background: "#a8ffd9ff",
        color: "#000000ff",
    },
    select: {
        padding: "8px 10px",
        borderRadius: "6px",
        border: "1px solid #30363d",
        background: "#0b0d12",
        color: "#e6edf3",
    },
    // Buttons
    buttonPrimary: {
        background: "#238636",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        padding: "8px 12px",
        cursor: "pointer",
    },
    buttonSecondary: {
        background: "#30363d",
        color: "#e6edf3",
        border: "none",
        borderRadius: "6px",
        padding: "8px 12px",
        cursor: "pointer",
    },
    buttonDanger: {
        background: "#da3633",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        padding: "8px 12px",
        cursor: "pointer",
    },
    // Rows
    row: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #30363d",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "8px",
    },
    col: { display: "flex", flexDirection: "column" },
    nameBold: { fontWeight: 600 },
    muted: { fontSize: "14px", color: "#9aa0a6" },
    // Grids
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" },
    grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" },
};

type AdminLayoutProps = {
    children: React.ReactNode;
    section?: "dashboard" | "agents" | "requests" | "logs" | "settings";
};

export default function AdminLayout({ children, section }: AdminLayoutProps) {
    const navStyle = (key: AdminLayoutProps["section"]) =>
        key === section ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem;

    const go = (target: AdminLayoutProps["section"]) => {
        window.location.hash = target ?? "";
    };

    return (
        <div style={styles.app}>
            {/* Sidebar */}
            <aside style={styles.sidebar}>
                <div style={styles.brand}>Ease Chequ Admin</div>
                <nav>
                    <button style={navStyle("dashboard")} onClick={() => go("dashboard")}>
                        Dashboard
                    </button>
                    <button style={navStyle("agents")} onClick={() => go("agents")}>
                        Agents
                    </button>
                    <button style={navStyle("requests")} onClick={() => go("requests")}>
                        Requests
                    </button>
                    <button style={navStyle("logs")} onClick={() => go("logs")}>
                        Logs
                    </button>
                    <button style={navStyle("settings")} onClick={() => go("settings")}>
                        Settings
                    </button>
                </nav>
            </aside>

            {/* Main */}
            <div style={styles.main}>
                <main style={styles.content}>{children}</main>
                <footer style={styles.footer}>© 2023 Ease Chequ — Admin</footer>
            </div>
        </div>
    );
}