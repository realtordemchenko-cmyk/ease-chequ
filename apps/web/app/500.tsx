"use client";
export const dynamic = "force-dynamic";
import React from "react";
import AppProviders from "./AppProviders";

export default function Error500() {
  return (
    <AppProviders>
      <div style={{ padding: 40, textAlign: "center" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#c00" }}>
          500  Server Error
        </h1>
        <p style={{ color: "#666", marginTop: 16 }}>
          An unexpected error occurred. Please try again later.
        </p>
      </div>
    </AppProviders>
  );
}
