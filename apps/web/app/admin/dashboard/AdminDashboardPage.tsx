"use client";
import React, { useState } from "react";
import Header from "../../Header";

export default function AdminDashboardPage() {
    const [message, setMessage] = useState<string | null>(null);

    const callBackend = async (action: string) => {
        try {
            const res = await fetch("http://localhost:4000/api/agent-action", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });

            const data = await res.json();
            setMessage(`${data.status.toUpperCase()}: ${data.message}`);
        } catch (err) {
            console.error(err);
            setMessage("ERROR: Failed to reach backend");
        }
    };

    return (
        <>
            <Header />
            <div style={{ padding: "2rem" }}>
                <h1>Admin Panel</h1>

                <section style={{ marginTop: "1.5rem" }}>
                    <h2>KPI</h2>
                    <ul>
                        <li>Active users: 120</li>
                        <li>New applications: 15</li>
                        <li>System errors: 0</li>
                    </ul>
                </section>

                <section style={{ marginTop: "1.5rem" }}>
                    <h2>Status</h2>
                    <p>All services are running smoothly ✅</p>
                </section>

                <section style={{ marginTop: "1.5rem" }}>
                    <h2>Actions</h2>
                    <button
                        onClick={() => callBackend("submit")}
                        style={{ marginRight: "1rem" }}
                    >
                        Refresh Data
                    </button>
                    <button onClick={() => callBackend("verify")}>
                        Verify Documents
                    </button>
                </section>

                {message && (
                    <div
                        style={{
                            marginTop: "1.5rem",
                            padding: "1rem",
                            border: "1px solid #ddd",
                            background: "#f9f9f9",
                        }}
                    >
                        <strong>Response:</strong> {message}
                    </div>
                )}
            </div>
        </>
    );
}