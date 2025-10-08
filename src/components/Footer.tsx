// File: D:\Projects\Ease Chequ\src\components\Footer.tsx
// Purpose: Fixed footer component that stays at the bottom of the viewport.
// Comments: Responsive and consistent with global design variables.

import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <small>© {new Date().getFullYear()} Ease Chequ</small>
        </footer>
    );
};

export default Footer;