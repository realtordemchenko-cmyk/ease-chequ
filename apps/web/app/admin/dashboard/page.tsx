// apps/web/app/admin/dashboard/page.tsx
export default function DashboardPage() {
    const cards = [
        { title: "Active Agents", value: 12 },
        { title: "Pending Requests", value: 34 },
        { title: "System Logs Today", value: 128 },
        { title: "Errors", value: 2 },
    ];

    return (
        <section style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            {cards.map((card) => (
                <div
                    key={card.title}
                    style={{
                        background: "var(--card-bg)",
                        border: `1px solid var(--card-border)`,
                        borderRadius: "8px",
                        padding: "16px",
                        color: "var(--secondary-text)",
                    }}
                >
                    <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{card.title}</div>
                    <div style={{ fontSize: "24px", fontWeight: 600 }}>{card.value}</div>
                </div>
            ))}
        </section>
    );
}