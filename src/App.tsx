// File: D:\Projects\Ease Chequ\src\App.tsx
// Purpose: Root component using strictly typed Layout, Card, and Footer with correct props.

import React from 'react';
import Layout from './components/Layout';
import Card from './components/Card';
import Button from './components/Button';
import Footer from './components/Footer';

const App: React.FC = () => {
    return (
        <Layout
            title="Ease Chequ Dashboard"
            actions={<div>{/* header actions placeholder */}</div>}
            footer={<Footer />}
        >
            <div className="container">
                <header className="header">
                    <h1>Ease Chequ</h1>
                    <p>Welcome to the dashboard</p>
                </header>

                <section>
                    <Card
                        title="System Status"
                        headerActions={<div>{/* optional header actions */}</div>}
                    >
                        <div className="status">
                            <strong>Status:</strong> All systems operational
                        </div>
                        <div className="actionsRow">
                            <Button
                                variant="primary"
                                onClick={() => console.log('Primary action')}
                                disabled={false}
                                ariaLabel="Continue"
                            >
                                Continue
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => console.log('Secondary action')}
                                disabled={false}
                                ariaLabel="Learn more"
                            >
                                Learn more
                            </Button>
                        </div>
                    </Card>

                    <Card
                        title="Services"
                        headerActions={<div>{/* optional header actions */}</div>}
                    >
                        <div className="linkBox">
                            <a href="#services">Manage services</a>
                        </div>
                    </Card>
                </section>
            </div>
        </Layout>
    );
};

export default App;