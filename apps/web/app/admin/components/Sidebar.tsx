"use client";

import React from "react";

type Section = "dashboard" | "agents" | "requests" | "logs" | "settings";

const styles: Record<string, React.CSSProperties> = {
    sidebar: {
        borderRight: "1px solid #649f83ff",
        padding: "16px",
        background: "#102722ff",
    },
    brand: {
        fontWeight: 700,
        marginBottom: "12px",
        fontSize: "18px",
        color: "#d3e8ff",
    },
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
        fontSize: "15px",
    },
    navItemActive: {
        background: "#17422aff",
        borderColor: "#d3e8ffff",
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "8px",
        fontWeight: 600,
    },
};

export default function Sidebar({
    section,
    onNavigate,
}: {
    section?: Section;
    onNavigate: (target: Section) => void;
}) {
    const navStyle = (key: Section) =>
        key === section
            ? { ...styles.navItem, ...styles.navItemActive }
            : styles.navItem;

    return (
        <aside style={styles.sidebar}>
            <div style={styles.brand}>Ease Chequ Admin</div>
            <nav>
                <button style={navStyle("dashboard")} onClick={() => onNavigate("dashboard")}>
                    Dashboard
                </button>
                <button style={navStyle("agents")} onClick={() => onNavigate("agents")}>
                    Agents
                </button>
                <button style={navStyle("requests")} onClick={() => onNavigate("requests")}>
                    Requests
                </button>
                <button style={navStyle("logs")} onClick={() => onNavigate("logs")}>
                    Logs
                </button>
                <button style={navStyle("settings")} onClick={() => onNavigate("settings")}>
                    Settings
                </button>
            </nav>
        </aside>
    );
}