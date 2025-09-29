import React, { useEffect, useState } from 'react';
import FinancialAnalysis from '../../../client/src/components/FinancialAnalysis';

const STORAGE_CLIENT_PROGRESS = 'client_progress_v1';

export default function AgentProgressSummary() {
    const [snapshot, setSnapshot] = useState({
        roles: {
            applicant: { netIncome: null, creditScore: null, documents: [], completed: false },
            occupant: { netIncome: null, creditScore: null, documents: [], completed: false },
            guarantor: { netIncome: null, creditScore: null, documents: [], completed: false },
        },
        uploadedDocuments: [],
        lastUpdatedAt: null,
    });

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_CLIENT_PROGRESS) || 'null');
            if (saved && saved.roles) {
                setSnapshot(saved);
            }
        } catch (e) {
            console.error('Failed to load snapshot', e);
        }
    }, []);

    function handleSwitchRoles() {
        try {
            const current = JSON.parse(localStorage.getItem(STORAGE_CLIENT_PROGRESS) || '{}');
            if (!current.roles || !current.roles.applicant || !current.roles.occupant) {
                alert('Switch failed: roles not initialized');
                return;
            }
            const newData = { ...current, roles: { ...current.roles } };
            const temp = newData.roles.applicant;
            newData.roles.applicant = newData.roles.occupant;
            newData.roles.occupant = temp;
            newData.lastUpdatedAt = Date.now();
            localStorage.setItem(STORAGE_CLIENT_PROGRESS, JSON.stringify(newData));
            setSnapshot(newData);
            alert('Roles switched: Occupant replaced Applicant');
        } catch (e) {
            console.error('Switch roles failed', e);
        }
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.h1}>Agent Progress Summary</h1>

            <section style={styles.card}>
                <h2 style={styles.h2}>Uploaded Documents</h2>
                {snapshot.uploadedDocuments?.length ? (
                    <ul>
                        {snapshot.uploadedDocuments.map((doc, i) => (
                            <li key={i}>✓ {doc}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No documents uploaded yet.</p>
                )}
            </section>

            <section style={styles.card}>
                <h2 style={styles.h2}>Financial Overview</h2>
                <FinancialAnalysis
                    applicant={snapshot.roles.applicant}
                    occupant={snapshot.roles.occupant}
                    guarantor={snapshot.roles.guarantor}
                    onSwitchRoles={handleSwitchRoles}
                />
            </section>

            <section style={styles.card}>
                <h2 style={styles.h2}>Completion Status</h2>
                <ul>
                    <li>Applicant: {snapshot.roles.applicant.completed ? 'Completed' : 'In progress'}</li>
                    <li>Occupant: {snapshot.roles.occupant.completed ? 'Completed' : 'In progress'}</li>
                    <li>Guarantor: {snapshot.roles.guarantor.completed ? 'Completed' : 'In progress'}</li>
                </ul>
            </section>

            <section style={styles.card}>
                <h2 style={styles.h2}>Last Update</h2>
                <p>{snapshot.lastUpdatedAt ? new Date(snapshot.lastUpdatedAt).toLocaleString() : 'Never'}</p>
            </section>
        </div>
    );
}

const styles = {
    container: { maxWidth: 900, margin: '20px auto', padding: 16, background: '#fff' },
    h1: { fontSize: 24, marginBottom: 16 },
    h2: { fontSize: 18, marginBottom: 8 },
    card: { border: '1px solid #ddd', borderRadius: 6, padding: 12, marginBottom: 16 },
};