"use client";
import React from "react";
import { AdminProvider } from "./store/AdminStore";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProvider>{children}</AdminProvider>;
}
