// File: D:\Projects\Ease Chequ\src\components\Card.tsx
// Purpose: Card component with title and optional header actions.

import React from 'react';

interface CardProps {
    title: string;
    headerActions: React.ReactNode;
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, headerActions, children }) => {
    return (
        <div className="card">
            <div className="card-header">
                <h2>{title}</h2>
                <div className="card-actions">{headerActions}</div>
            </div>
            <div className="card-body">{children}</div>
        </div>
    );
};

export default Card;