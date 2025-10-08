// apps/web/components/layout/Topbar.tsx
"use client";

export default function Topbar() {
    return (
        <header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                borderBottom: `1px solid var(--card-border)`,
                background: "var(--card-bg)",
                color: "var(--secondary-text)",
            }}
        >
            <div style={{ fontWeight: 600, fontSize: "16px" }}>Admin Panel</div>
            <nav style={{ display: "flex", gap: "8px" }}>
                <button
                    style={{
                        background: "var(--primary-bg)",
                        color: "var(--primary-text)",
                        border: "none",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        cursor: "pointer",
                    }}
                >
                    New
                </button>
                <button
                    style={{
                        background: "var(--secondary-bg)",
                        color: "var(--secondary-text)",
                        border: "none",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        cursor: "pointer",
                    }}
                >
                    Save
                </button>
                <button
                    style={{
                        background: "var(--danger-bg)",
                        color: "var(--danger-text)",
                        border: "none",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        cursor: "pointer",
                    }}
                >
                    Refresh
                </button>
            </nav>
        </header>
    );
}