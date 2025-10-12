// apps/web/context/AdminStore.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { Agent } from "../types/Agent";
import { Request, AgentRequest, RequestStatus } from "../types/Request";
import { LogEntry } from "../types/LogEntry";
// If Clients are not a standalone section in this snapshot, omit Client types here.

interface State {
    agents: Agent[];
    requests: Request[];
    logs: LogEntry[];
}

type Action =
    | { type: "ADD_AGENT"; payload: Omit<Agent, "id"> }
    | { type: "SET_REQUEST_STATUS"; payload: { id: string; status: RequestStatus } }
    | { type: "ADD_LOG"; payload: Omit<LogEntry, "id"> }
    | { type: "INIT"; payload: State };

const AdminContext = createContext<{
    // Expose arrays directly to match pages contract
    agents: Agent[];
    requests: Request[];
    logs: LogEntry[];
    // Also expose state for internal use if needed
    state: State;
    // Actions
    addAgent: (agent: Omit<Agent, "id">) => void;
    setRequestStatus: (id: string, status: RequestStatus) => void;
    approveRequest: (id: string) => void;
    rejectRequest: (id: string) => void;
    addLog: (log: Omit<LogEntry, "id">) => void;
} | null>(null);

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "ADD_AGENT": {
            const next: Agent = { id: crypto.randomUUID(), ...action.payload };
            return { ...state, agents: [next, ...state.agents] };
        }
        case "SET_REQUEST_STATUS": {
            return {
                ...state,
                requests: state.requests.map((r) =>
                    r.id === action.payload.id ? { ...r, status: action.payload.status } : r
                ),
            };
        }
        case "ADD_LOG": {
            const next: LogEntry = { id: crypto.randomUUID(), ...action.payload };
            const exists = state.logs.some(
                (l) => l.date === next.date && l.type === next.type && l.message === next.message
            );
            return exists ? state : { ...state, logs: [next, ...state.logs] };
        }
        case "INIT":
            return action.payload;
        default:
            return state;
    }
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
    // Ensure arrays are initialized, not undefined
    const [state, dispatch] = useReducer(reducer, { agents: [], requests: [], logs: [] });

    useEffect(() => {
        // Optional: if the snapshot expects seeded data, restore here.
        // Keep empty to avoid shape drift; pages must not crash on empty arrays.
    }, []);

    // Actions
    const addAgent = (agent: Omit<Agent, "id">) => {
        dispatch({ type: "ADD_AGENT", payload: agent });
        dispatch({
            type: "ADD_LOG",
            payload: {
                date: new Date().toISOString(),
                type: "Agent",
                message: `Agent created (Pending): ${agent.name}`,
            },
        });
    };

    const setRequestStatus = (id: string, status: RequestStatus) => {
        dispatch({ type: "SET_REQUEST_STATUS", payload: { id, status } });
        dispatch({
            type: "ADD_LOG",
            payload: {
                date: new Date().toISOString(),
                type: "Request",
                message: `Request ${id} set to ${status}`,
            },
        });
    };

    const approveRequest = (id: string) => {
        const req = state.requests.find((r) => r.id === id);
        if (!req) return;

        setRequestStatus(id, "Approved");

        if (req.type === "Agent") {
            const ar = req as AgentRequest;
            if (!ar.name) {
                dispatch({
                    type: "ADD_LOG",
                    payload: {
                        date: new Date().toISOString(),
                        type: "Error",
                        message: `Approve failed: missing agent name in request ${id}`,
                    },
                });
                return;
            }

            dispatch({
                type: "ADD_AGENT",
                payload: {
                    name: ar.name,
                    email: ar.email ?? "",
                    boardMemberNumber: ar.boardMemberNumber,
                    accessUntil: "",
                    inviteLink: "",
                    status: "Pending",
                },
            });
        }
    };

    const rejectRequest = (id: string) => {
        setRequestStatus(id, "Rejected");
        dispatch({
            type: "ADD_LOG",
            payload: {
                date: new Date().toISOString(),
                type: "Request",
                message: `Request ${id} rejected`,
            },
        });
    };

    const addLog = (log: Omit<LogEntry, "id">) => {
        dispatch({ type: "ADD_LOG", payload: log });
    };

    const value = useMemo(
        () => ({
            // Expose arrays directly
            agents: state.agents,
            requests: state.requests,
            logs: state.logs,
            // Also expose full state
            state,
            // Actions
            addAgent,
            setRequestStatus,
            approveRequest,
            rejectRequest,
            addLog,
        }),
        [state]
    );

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error("AdminContext not found");
    return ctx;
}