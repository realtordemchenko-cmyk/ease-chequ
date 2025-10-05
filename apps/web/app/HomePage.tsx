"use client";
import React from "react";
import Link from "next/link";
import Header from "./Header";

export default function HomePage() {
    return (
        <>
            <Header />
            <div style={{ padding: "2rem" }}>
                <h1>Welcome to Ease Chequ</h1>
                <p style={{ marginTop: "1rem" }}>
                    This is the entry point of the platform.
                </p>
                <Link href="/admin/dashboard">
                    <button style={{ marginTop: "1.5rem", padding: "0.5rem 1rem" }}>
                        Go to Admin Dashboard
                    </button>
                </Link>
            </div>
        </>
    );
}