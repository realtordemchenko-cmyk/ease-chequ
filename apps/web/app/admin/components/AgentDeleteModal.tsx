//D:\Projects\Ease Chequ\apps\web\app\admin\components\AgentDeleteModal.tsx
"use client";

// Confirmation modal for deleting Agent.
// Minimal, reusable, props-based.

interface AgentDeleteModalProps {
    agentName: string;
    onConfirm: () => void;
    onClose: () => void;
}

export default function AgentDeleteModal({
    agentName,
    onConfirm,
    onClose
}: AgentDeleteModalProps) {
    return (
        <div
            role="dialog"
            aria-modal="true"
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.35)",
                display: "grid",
                placeItems: "center",
                zIndex: 1000
            }}
        >
            <div
                style={{
                    width: "420px",
                    background: "var(--card-bg, #fff)",
                    color: "var(--primary-text, #111)",
                    border: "1px solid var(--card-border, #ddd)",
                    borderRadius: 8,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    padding: 20
                }}
            >
                <h2 style={{ margin: "0 0 12px 0" }}>Delete agent</h2>
                <p style={{ marginBottom: 16 }}>
                    Are you sure you want to delete agent <strong>{agentName}</strong>? This action cannot be
                    undone.
                </p>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        style={{ background: "red", color: "#fff", border: "none", padding: "6px 12px" }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}