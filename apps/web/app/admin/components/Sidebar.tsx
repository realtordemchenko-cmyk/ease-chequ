"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const navStyle = (path: string) => ({
        display: "block",
        width: "100%",
        textAlign: "left" as const,
        padding: "12px 20px",
        marginBottom: "4px",
        borderRadius: "6px",
        background: pathname === path ? "var(--sidebar-active)" : "transparent",
        color: pathname === path ? "var(--primary-text)" : "var(--secondary-text)",
        border: "none",
        cursor: "pointer",
        fontWeight: pathname === path ? 600 : 400,
        transition: "background 0.2s, color 0.2s"
    });

    const hoverStyle: React.CSSProperties = {
        background: "var(--sidebar-hover)",
        color: "var(--primary-text)"
    };

    const handleNav = (path: string) => {
        router.push(path);
    };

    return (
        <div
            style={{
                width: "240px",
                height: "100%",
                background: "var(--sidebar-bg)",
                display: "flex",
                flexDirection: "column",
                padding: "16px",
                boxSizing: "border-box"
            }}
        >
            <div
                style={{
                    fontWeight: 700,
                    fontSize: "18px",
                    marginBottom: "24px",
                    color: "var(--primary-text)"
                }}
            >
                Ease Chequ Admin
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                    style={navStyle("/admin")}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, navStyle("/admin"))}
                    onClick={() => handleNav("/admin")}
                >
                    Dashboard
                </button>
                <button
                    style={navStyle("/admin/agents")}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, navStyle("/admin/agents"))}
                    onClick={() => handleNav("/admin/agents")}
                >
                    Agents
                </button>
                <button
                    style={navStyle("/admin/requests")}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, navStyle("/admin/requests"))}
                    onClick={() => handleNav("/admin/requests")}
                >
                    Requests
                </button>
                <button
                    style={navStyle("/admin/logs")}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, navStyle("/admin/logs"))}
                    onClick={() => handleNav("/admin/logs")}
                >
                    Logs
                </button>
                <button
                    style={navStyle("/admin/settings")}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, navStyle("/admin/settings"))}
                    onClick={() => handleNav("/admin/settings")}
                >
                    Settings
                </button>
            </nav>
        </div>
    );
}