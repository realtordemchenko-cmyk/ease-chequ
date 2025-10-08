// apps/web/components/ui/input.tsx
"use client";

import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export function Input({ className, ...props }: InputProps) {
    const base =
        "flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600";
    return <input className={`${base} ${className ?? ""}`} {...props} />;
}