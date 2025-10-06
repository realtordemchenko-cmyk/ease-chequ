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
        <div style={{ padding: "16px" }}>
            {activeSection === "dashboard" && <DashboardSection />}
            {activeSection === "agents" && <AgentsPage />}
            {activeSection === "clients" && <ClientsPage />}
            {activeSection === "requests" && <RequestsSection />}
            {activeSection === "logs" && <LogsPage />}
        </div>
    );
}