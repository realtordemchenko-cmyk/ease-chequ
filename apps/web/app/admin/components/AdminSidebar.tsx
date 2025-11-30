"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/agents", label: "Agents" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/logs", label: "Logs" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/archive", label: "Archive" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="sidebar">
      <div className="brand">Ease Chequ Admin</div>
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={
            pathname === item.href ? "navItem navItemActive" : "navItem"
          }
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
