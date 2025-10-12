// apps/web/context/AdminStore.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { Agent } from "../types/Agent";
import { Request, AgentRequest, RequestStatus } from "../types/Request";
import { LogEntry } from "../types/LogEntry";

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
    state: State;
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
            // Deduplicate by (date, type, message) to keep audit trail clean
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
    const [state, dispatch] = useReducer(reducer, { agents: [], requests: [], logs: [] });

    useEffect(() => {
        // initialize mocks or restore persisted state
        // (omitted for brevity)
    }, []);

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

            // Business rule: approved request creates agent in Pending (no access yet)
            dispatch({
                type: "ADD_AGENT",
                payload: {
                    name: ar.name,
                    email: ar.email ?? "",
                    boardMemberNumber: ar.boardMemberNumber,
                    accessUntil: "",
                    inviteLink: "", // will be set after verification/payment
                    status: "Pending",
                },
            });
        }

        // other request types handled here if needed
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
        () => ({ state, addAgent, setRequestStatus, approveRequest, rejectRequest, addLog }),
        [state]
    );

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error("AdminContext not found");
    return ctx;
};