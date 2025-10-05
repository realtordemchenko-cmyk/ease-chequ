"use client";
import React, { useState } from "react";
import Header from "../../Header";   // <-- исправленный путь

type User = {
    id: number;
    name: string;
    status: string;
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([
        { id: 1, name: "Alice Johnson", status: "Active" },
        { id: 2, name: "Bob Smith", status: "Pending" },
        { id: 3, name: "Charlie Brown", status: "Suspended" },
    ]);

    const handleEdit = (id: number) => {
        alert(`Edit user with ID: ${id}`);
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter((user) => user.id !== id));
        }
    };

    return (
        <>
            <Header />
            <div style={{ padding: "2rem" }}>
                <h1>Users</h1>
                <p>Manage platform users below:</p>

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "1.5rem",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>
                                ID
                            </th>
                            <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>
                                Name
                            </th>
                            <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>
                                Status
                            </th>
                            <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                                    {user.id}
                                </td>
                                <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                                    {user.name}
                                </td>
                                <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                                    {user.status}
                                </td>
                                <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                                    <button
                                        onClick={() => handleEdit(user.id)}
                                        style={{ marginRight: "0.5rem" }}
                                    >
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}