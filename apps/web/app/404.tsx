"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect } from "react";
import AppProviders from "./AppProviders";
import { useAdmin } from "./store/AdminStore";

export default function NotFound404() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const admin = useAdmin();
  if (!mounted || admin === null) return null;
  return (
    <AppProviders>
      <div style={{ padding: 40, textAlign: "center" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#c00" }}>
          404 – Not Found
        </h1>
        <p style={{ color: "#666", marginTop: 16 }}>
          The page you are looking for does not exist.
        </p>
      </div>
    </AppProviders>
  );
}
