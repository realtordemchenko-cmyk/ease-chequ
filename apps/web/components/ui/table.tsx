// Canonical Table component for admin logs and lists
// Minimal implementation for restoring build and UI
import React from "react";

export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {}

export const Table: React.FC<TableProps> = ({ children, ...props }) => (
  <table
    {...props}
    style={{ width: "100%", borderCollapse: "collapse", ...props.style }}
  >
    {children}
  </table>
);

export default Table;
