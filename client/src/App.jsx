// D:\Projects\Ease Chequ\client\src\App.jsx
// Финальная версия: чистый SPA-роутинг, без упоминаний client-step2.html

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navigation from './components/Navigation';
import { ProgressProvider } from './context/ProgressContext';

import ClientPage1 from './client/ClientPage1';
import ClientPage2 from './client/ClientPage2';
import ClientPage3 from './client/ClientPage3';
import ApplicationSummary from './client/ApplicationSummary';
import DocumentAnalysis from './client/DocumentAnalysis';

export default function App() {
    return (
        <ProgressProvider>
            <Router>
                <div style={styles.app}>
                    <Navigation />
                    <div style={styles.body}>
                        <Routes>
                            <Route path="/" element={<Navigate to="/client" replace />} />

                            {/* Client routes */}
                            <Route path="/client" element={<ClientPage1 />} />
                            <Route path="/client/documents" element={<ClientPage2 />} />
                            <Route path="/client/final" element={<ClientPage3 />} />
                            <Route path="/client/application-summary" element={<ApplicationSummary />} />
                            <Route path="/client/analysis" element={<DocumentAnalysis />} />

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
    app: {
        minHeight: '100vh',
        background: '#f9fafb',
        fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
    },
    body: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: '20px',
    },
};