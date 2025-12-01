"use client";
import React from "react";
import { useAdmin } from "../../store/AdminStore";
import { Request } from "../../../types/Request";

export default function RequestsClient() {
  const admin = useAdmin();
  const [mounted, setMounted] = React.useState
    ? React.useState(false)
    : [true, () => {}];
  React.useEffect &&
    React.useEffect(() => {
      setMounted(true);
    }, []);
  // Debug: log context
  console.log("Admin context:", admin);
  if (!mounted) return null;
  if (!admin) {
    return <div>AdminStore not available</div>;
  }
  const {
    requests,
    approveRequest,
    rejectRequest,
    addAgent,
    addLog,
    currentAdminRole,
  } = admin;
  const [processing, setProcessing] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const isViewer = currentAdminRole === "Viewer";

  // В Requests должны быть только pending заявки агентов
  const agentRequests = requests.filter(
    (r: Request) => r.type === "Agent Request" && r.status === "Pending"
  );

  const handleApprove = async (id: string) => {
    setProcessing(id);
    setError(null);
    try {
      const req = agentRequests.find((r) => r.id === id);
      if (!req || req.status !== "Pending") return;
      // Добавляем агента
      addAgent({
        name: req.name,
        email: req.email,
        membershipNumber: "", // Можно доработать форму заявки
        accessUntil: null,
        inviteLink: null,
        status: "active",
        clients: [],
      });
      approveRequest(id);
      addLog({
        id: `log-approve-${id}`,
        type: "Request",
        message: `approveRequest: ${req.name}`,
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      setError("Ошибка при подтверждении заявки");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    setError(null);
    try {
      const req = agentRequests.find((r) => r.id === id);
      if (!req || req.status !== "Pending") return;
      // Архивируем агента (type=rejected)
      rejectRequest(id);
      addLog({
        id: `log-reject-${id}`,
        type: "Request",
        message: `rejectRequest: ${req.name}`,
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      setError("Ошибка при отклонении заявки");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div>
      <h1>Requests</h1>
      {error && <div className="toast-error">{error}</div>}
      <table className="requestsTable">
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
          {agentRequests.map((req: Request) => (
            <tr key={req.id}>
              <td>{req.name}</td>
              <td>{req.email}</td>
              <td>{req.type}</td>
              <td>
                <span className="statusBadge statusBadge--pending">
                  Pending
                </span>
              </td>
              {!isViewer && (
                <td>
                  <button
                    className="buttonPrimary"
                    disabled={processing === req.id}
                    onClick={() => handleApprove(req.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="buttonDanger"
                    disabled={processing === req.id}
                    onClick={() => handleReject(req.id)}
                  >
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
