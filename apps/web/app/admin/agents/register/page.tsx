// D:\Projects\Ease Chequ\apps\web\app\admin\agents\register\page.tsx
"use client";

import React, { useState } from "react";

/**
 * Agent Registration Page
 * - Collects name, email, phone, board member number, and status
 * - On submit, logs action into local audit log (placeholder)
 * - Ready for integration with backend and persistent audit logging
 */

type AuditLog = {
    id: number;
    action: string;
    user: string;
    timestamp: string;
};

export default function RegisterAgentPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [boardNumber, setBoardNumber] = useState("");
    const [status, setStatus] = useState("Active");
    const [submitted, setSubmitted] = useState(false);
    const [logs, setLogs] = useState<AuditLog[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Placeholder: here we would call API and persist agent + audit log
        console.log("Agent registered:", { name, email, phone, boardNumber, status });

        const newLog: AuditLog = {
            id: logs.length + 1,
            action: `Agent registered: ${name} (${email})`,
            user: "System",
            timestamp: new Date().toLocaleString(),
        };

        setLogs([...logs, newLog]);
        setSubmitted(true);

        // Reset form
        setName("");
        setEmail("");
        setPhone("");
        setBoardNumber("");
        setStatus("Active");
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Register New Agent</h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4 max-w-md border p-6 rounded bg-white shadow-sm"
            >
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Board Member Number</label>
                    <input
                        type="text"
                        value={boardNumber}
                        onChange={(e) => setBoardNumber(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Suspended">Suspended</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Register Agent
                </button>
            </form>

            {submitted && (
                <div className="p-4 bg-green-100 border border-green-300 rounded">
                    Agent successfully registered (placeholder).
                </div>
            )}

            {/* Local Audit Log Preview */}
            {logs.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-2">Audit Log (local)</h2>
                    <table className="w-full border-collapse border border-gray-300 bg-white shadow-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">User</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id}>
                                    <td className="border border-gray-300 px-4 py-2">{log.id}</td>
                                    <td className="border border-gray-300 px-4 py-2">{log.action}</td>
                                    <td className="border border-gray-300 px-4 py-2">{log.user}</td>
                                    <td className="border border-gray-300 px-4 py-2">{log.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}