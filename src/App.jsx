import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ProgressProvider } from './context/ProgressContext';
import Navigation from '../client/src/components/Navigation';

import AgentDashboard from './client/agent/AgentDashboard';
import AgentProgressSummary from './client/agent/AgentProgressSummary';
import AgentClientIntake from './client/agent/AgentClientIntake';

import ClientPage1 from '../client/src/client/ClientPage1';
import ClientPage2 from '../client/src/client/ClientPage2';
import ClientPage3 from '../client/src/client/ClientPage3';
import DocumentAnalysis from '../client/src/client/DocumentAnalysis';
import ApplicationSummary from '../client/src/client/ApplicationSummary';

export default function App() {
    return (
        <ProgressProvider>
            <Router>
                <div style={styles.appContainer}>
                    <Navigation />
                    <div style={styles.pageContainer}>
                        <Routes>
                            {/* Default route → Agent Dashboard */}
                            <Route path="/" element={<Navigate to="/agent" replace />} />

                            {/* Agent routes */}
                            <Route path="/agent" element={<AgentDashboard />} />
                            <Route path="/agent/summary" element={<AgentProgressSummary />} />
                            <Route path="/agent/client-intake" element={<AgentClientIntake />} />

                            {/* Client routes */}
                            <Route path="/client" element={<ClientPage1 />} />
                            <Route path="/client/documents" element={<ClientPage2 />} />
                            <Route path="/client/final" element={<ClientPage3 />} />
                            <Route path="/client/analysis" element={<DocumentAnalysis />} />
                            <Route path="/client/application-summary" element={<ApplicationSummary />} />

                            {/* Fallback */}
                            <Route path="*" element={<h1 style={{ padding: 20 }}>404 - Page Not Found</h1>} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </ProgressProvider>
    );
}

const styles = {
    appContainer: {
        fontFamily: 'Arial, sans-serif',
        background: '#f9fafb',
        minHeight: '100vh',
    },
    pageContainer: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: '20px',
    },
};