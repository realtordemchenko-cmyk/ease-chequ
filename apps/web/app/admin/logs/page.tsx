"use client";

import { useAdmin } from "context/AdminStore";
import LogsPagination from "@/components/logs/LogsPagination";

export default function LogsPage() {
    const { logs } = useAdmin();

    return (
        <div>
            <h1>Logs</h1>
            <LogsPagination logs={logs} pageSize={10} />
        </div>
    );
}