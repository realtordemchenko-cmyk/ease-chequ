"use client";

import React from "react";
import Link from "next/link";

export default function Header() {
    return (
        <header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 2rem",
                background: "#f5f5f5",
                borderBottom: "1px solid #ddd",
            }}
        >
            <h2>Ease Chequ</h2>
            <nav style={{ display: "flex", gap: "1.5rem" }}>
                <Link href="/">Home</Link>
                <Link href="/admin/dashboard">Dashboard</Link>
                <Link href="/admin/users">Users</Link>
                <Link href="/admin/settings">Settings</Link>
            </nav>
        </header>
    );
}