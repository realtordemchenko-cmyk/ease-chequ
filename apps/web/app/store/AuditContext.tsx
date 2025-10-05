"use client";

import React, { createContext, useContext, useState } from "react";

export type AuditCategory = "agent" | "client" | "system" | "security" | "other";

export interface AuditEvent {
    id: number;
    ts: string;
    category: AuditCategory;
    action: string;
    details: string;
}

interface AuditContextType {
    events: AuditEvent[];
    log: (category: AuditCategory, action: string, details: string) => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const AuditProvider = ({ children }: { children: React.ReactNode }) => {
    const [events, setEvents] = useState<AuditEvent[]>([]);

    const log = (category: AuditCategory, action: string, details: string) => {
        setEvents((prev) => [
            ...prev,
            {
                id: prev.length ? prev[prev.length - 1].id + 1 : 1,
                ts: new Date().toISOString(),
                category,
                action,
                details,
            },
        ]);
    };

    return (
        <AuditContext.Provider value={{ events, log }}>
            {children}
        </AuditContext.Provider>
    );
};

export const useAudit = () => {
    const ctx = useContext(AuditContext);
    if (!ctx) throw new Error("useAudit must be used within AuditProvider");
    return ctx;
};