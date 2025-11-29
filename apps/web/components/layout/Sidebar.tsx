// apps/web/components/layout/Sidebar.tsx
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Agents", href: "/admin/agents" },
  { name: "Requests", href: "/admin/requests" },
  { name: "Logs", href: "/admin/logs" },
  { name: "Settings", href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "220px",
        background: "var(--card-bg)",
        color: "var(--secondary-text)",
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid var(--card-border)`,
      }}
    >
      <div
        style={{
          padding: "16px",
          fontWeight: 600,
          fontSize: "18px",
          borderBottom: `1px solid var(--card-border)`,
        }}
      >
        Admin Panel
      </div>
      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={{
                    display: "block",
                    padding: "10px 16px",
                    textDecoration: "none",
                    color: active
                      ? "var(--primary-bg)"
                      : "var(--secondary-text)",
                    background: active ? "var(--card-border)" : "transparent",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
