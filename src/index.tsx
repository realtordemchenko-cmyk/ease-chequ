// File: D:\Projects\Ease Chequ\src\index.tsx
// Purpose: Application entry point that ensures global CSS is loaded and the app mounts correctly.
// Comments: Import globals.css here to guarantee style application across the app.

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import global styles once at the app entry point
import './styles/globals.css';

const container = document.getElementById('root');
if (!container) {
    throw new Error('Root container not found. Ensure index.html has <div id="root"></div>');
}

const root = createRoot(container);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);