// D:\Projects\Ease Chequ\apps\web\app\admin\requests\page.tsx

"use client";
import React from "react";
export const dynamic = "force-dynamic";
import { useAdmin } from "../../store/AdminStore";
import { Request } from "types/Request";

export default function RequestsPage() {
  const { requests, approveRequest, rejectRequest, currentAdminRole } =
    useAdmin();

  const isViewer = currentAdminRole === "Viewer";

  return (
    <div>
      <h1>Requests</h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Status</th>
            {!isViewer && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map((req: Request) => (
            <tr key={req.id}>
              <td>{req.name}</td>
              <td>{req.email}</td>
              <td>{req.type}</td>
              <td>{req.status}</td>
              {!isViewer && (
                <td style={{ display: "flex", gap: "8px" }}>
                  {req.status === "Pending" && (
                    <>
                      <button onClick={() => approveRequest(req.id)}>
                        Approve
                      </button>
                      <button
                        onClick={() => rejectRequest(req.id)}
                        style={{ backgroundColor: "red", color: "white" }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
