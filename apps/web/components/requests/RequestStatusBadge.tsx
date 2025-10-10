// D:\Projects\Ease Chequ\apps\web\components\requests\RequestStatusBadge.tsx
import React from "react";

type RequestStatus = "pending" | "approved" | "rejected";

export const RequestStatusBadge = ({ status }: { status: RequestStatus }) => {
    const colorMap = {
        pending: "#9CA3AF",   // gray-400
        approved: "#10B981",  // green-500
        rejected: "#EF4444",  // red-500
    };

    const labelMap = {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
                style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: colorMap[status],
                }}
            />
            <span style={{ fontSize: 14, color: "#4B5563" }}>{labelMap[status]}</span>
        </div>
    );
};