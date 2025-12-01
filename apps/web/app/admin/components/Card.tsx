// Canonical Card component for admin UI
// apps/web/app/admin/components/Card.tsx

import React from "react";

interface CardProps {
  title: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, headerActions, children }) => {
  return (
    <div className="card">
      <h3 className="cardTitle">{title}</h3>
      {headerActions && <div className="card-actions">{headerActions}</div>}
      <div>{children}</div>
    </div>
  );
};

export default Card;
