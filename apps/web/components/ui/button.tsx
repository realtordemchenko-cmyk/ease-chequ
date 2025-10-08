// apps/web/components/ui/button.tsx
"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline";
}

export function Button({ variant = "default", className, ...props }: ButtonProps) {
    const base =
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-3 py-2";
    const styles =
        variant === "outline"
            ? "border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-50"
            : "bg-blue-600 text-white hover:bg-blue-700";
    return <button className={`${base} ${styles} ${className ?? ""}`} {...props} />;
}