"use client";
import React from "react";
export const dynamic = "force-dynamic";
import Link from "next/link";

export default function ClientsPage() {
  // TODO: Replace with real data from context/store
  return (
    <div style={{ padding: 24 }}>
      <h1>Clients</h1>
      <p>Client list will appear here.</p>
      <Link href="/admin/clients/101">View Client 101</Link>
    </div>
  );
}
