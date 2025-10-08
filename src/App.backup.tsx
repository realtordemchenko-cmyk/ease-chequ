// src/App.tsx
import React, { useEffect, useState } from 'react';
import './styles/design-tokens.css';
import './styles/base.css';

import Layout from './components/Layout';
import Card from './components/Card';
import Button from './components/Button';

type Theme = 'light' | 'dark';
const THEME_KEY = 'easechequ_theme';

export default function App() {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        // hydrate theme from localStorage
        const saved = (localStorage.getItem(THEME_KEY) as Theme) || 'light';
        setTheme(saved);
    }, []);

    useEffect(() => {
        // apply theme to <html> for CSS variables
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

    return (
        <Layout
            title="Ease Chequ"
            actions={
                <Button variant="secondary" ariaLabel="Toggle theme" onClick={toggleTheme}>
                    {theme === 'light' ? 'Dark mode' : 'Light mode'}
                </Button>
            }
            footer={
                <>
                    <div className="left">Theme: {theme}</div>
                    <Button variant="secondary">Cancel</Button>
                    <Button variant="primary">Save</Button>
                </>
            }
        >
            {/* Place your existing app content below.
         If you use a router, render it here (e.g., <Router>...</Router>).
         The sample cards are for visual verification and can be removed after integration. */}
            <Card title="Welcome">
                <p>This is the unified design baseline. Replace this block with your app routes/components.</p>
            </Card>

            <Card title="Quick actions">
                <div className="actionsRow">
                    <div className="linkBox">
                        <span className="linkLabel">Client link</span>
                        <code className="linkCode">https://easechequ.com/client?agentId=123</code>
                    </div>
                    <Button variant="secondary">Copy link</Button>
                    <Button variant="primary">New case</Button>
                </div>
            </Card>
        </Layout>
    );
}