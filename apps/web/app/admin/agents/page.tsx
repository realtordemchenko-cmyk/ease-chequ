"use client";
export const dynamic = "force-dynamic";

import { useAdmin } from "@/context/AdminStore";
import { Agent } from "@/types/Agent";
import { useState } from "react";
import Link from "next/link";
import AgentDeleteModal from "../components/AgentDeleteModal";
import AgentTable from "@/components/agents/AgentTable";

export default function AgentsPage() {
  const { agents, removeAgent } = useAdmin();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleDelete = () => {
    if (selectedAgent) {
      removeAgent(selectedAgent.id);
      setSelectedAgent(null);
    }
    setIsDeleteOpen(false);
  };

  return (
    <div>
      <h1>Agents</h1>
      <Link href="/admin/agents/new">Add Agent</Link>

      <AgentTable
        agents={agents}
        onDelete={(agent) => {
          setSelectedAgent(agent);
          setIsDeleteOpen(true);
        }}
        onEdit={(agent) => {
          // TODO: implement edit logic
          console.log("Edit agent", agent);
        }}
        onArchive={(agent) => {
          // TODO: implement archive logic
          console.log("Archive agent", agent);
        }}
        onRegenerateLink={(agent) => {
          // TODO: implement regenerate link logic
          console.log("Regenerate invite link", agent);
        }}
      />

      <AgentDeleteModal
        agentName={selectedAgent?.name ?? ""}
        isOpen={isDeleteOpen}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
