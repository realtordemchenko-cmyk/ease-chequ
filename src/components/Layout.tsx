// File: D:\Projects\Ease Chequ\src\components\Layout.tsx
// Purpose: Layout wrapper with header, content, and fixed footer className alignment.
// Comments: ClassNames match globals.css (.layout, .layout-header, .layout-content, .footer).

import React from 'react';

interface LayoutProps {
    title: string;
    actions: React.ReactNode;
    children: React.ReactNode;
    footer: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, actions, children, footer }) => {
    return (
        <div className="layout">
            <header className="layout-header">
                <h1>{title}</h1>
                <div className="layout-actions">{actions}</div>
            </header>
            <main className="layout-content">{children}</main>
            <footer className="footer">{footer}</footer>
        </div>
    );
};

export default Layout;