// D:\Projects\Ease Chequ\client\src\components\Navigation.jsx
// Финальная версия: только React Router, никакого href на .html

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navigation() {
    const navigate = useNavigate();

    return (
        <nav style={styles.nav}>
            <div style={styles.left}>
                <Link to="/client" style={styles.link}>Client Step 1</Link>
                <Link to="/client/documents" style={styles.link}>Client Step 2</Link>
                <Link to="/client/final" style={styles.link}>Client Step 3</Link>
            </div>
            <div style={styles.right}>
                <button style={styles.btn} onClick={() => navigate('/client/application-summary')}>
                    Application Summary
                </button>
                <button style={styles.btn} onClick={() => navigate('/client/analysis')}>
                    Document Analysis
                </button>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 16px',
        background: '#111827',
    },
    left: { display: 'flex', gap: 12 },
    right: { display: 'flex', gap: 8 },
    link: { color: '#fff', textDecoration: 'none', fontSize: 14 },
    btn: {
        background: '#374151',
        color: '#fff',
        border: 'none',
        padding: '8px 10px',
        borderRadius: 6,
        cursor: 'pointer',
    },
};