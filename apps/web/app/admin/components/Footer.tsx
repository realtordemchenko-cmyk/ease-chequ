"use client";

import React from "react";

const styles: Record<string, React.CSSProperties> = {
    footer: {
        padding: "12px 16px",
        borderTop: "1px solid #e0eeffff",
        background: "#0d1117",
        color: "#8b949e",
        fontSize: "14px",
        textAlign: "center",
    },
};

export default function Footer() {
    return <footer style={styles.footer}>© 2023 Ease Chequ — Admin</footer>;
}