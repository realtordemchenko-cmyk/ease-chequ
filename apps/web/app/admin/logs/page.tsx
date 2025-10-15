"use client";

import { useAdmin } from "context/AdminStore";
import { LogEntry } from "types/LogEntry";

export default function LogsPage() {
    const { logs } = useAdmin();

    return (
        <div>
            <h1>Logs</h1>

            {logs.length === 0 ? (
                <p>No logs yet</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Type</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs
                            .slice()
                            .reverse()
                            .map((log: LogEntry) => (
                                <tr key={log.id}>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>{log.type}</td>
                                    <td>{log.message}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}