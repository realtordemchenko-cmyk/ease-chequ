"use client";

import React, { useEffect, useState } from "react";
import AgentsPage from "./agents/page";
import ClientsPage from "./clients/page";
import LogsPage from "./logs/page";

// Заглушки для других секций
function DashboardSection() {
    return <div style={{ padding: "16px" }}>Dashboard section content</div>;
}
function RequestsSection() {
    return <div style={{ padding: "16px" }}>Requests section content</div>;
}

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState("dashboard");

    // Следим за изменением hash
    useEffect(() => {
        const updateSection = () => {
            const hash = window.location.hash.replace("#", "");
            setActiveSection(hash || "dashboard");
        };
        updateSection();
        window.addEventListener("hashchange", updateSection);
        return () => window.removeEventListener("hashchange", updateSection);
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Навигация */}
            <nav style={{ display: "flex", gap: "16px", padding: "12px" }}>
                <a href="#dashboard">Dashboard</a>
                <a href="#agents">Agents</a>
                <a href="#clients">Clients</a>
                <a href="#requests">Requests</a>
                <a href="#logs">Logs</a>
            </nav>

            {/* Контент секций */}
            <div style={{ padding: "16px" }}>
                {activeSection === "dashboard" && <DashboardSection />}
                {activeSection === "agents" && <AgentsPage />}
                {activeSection === "clients" && <ClientsPage />}
                {activeSection === "requests" && <RequestsSection />}
                {activeSection === "logs" && <LogsPage />}
            </div>
        </div>
    );
}