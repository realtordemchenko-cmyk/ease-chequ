import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';

export default function ClientPage3() {
    const navigate = useNavigate();
    const { progress, setProgress, markCompleted } = useProgress();

    const [status, setStatus] = useState('');
    const [lastSavedAt, setLastSavedAt] = useState(null);

    useEffect(() => {
        if (progress?.page3?.status) {
            setStatus(progress.page3.status);
            setLastSavedAt(progress.lastUpdatedAt || null);
        }
    }, [progress]);

    function handleSave() {
        try {
            const payload = {
                ...progress,
                page3: { status },
                lastUpdatedAt: Date.now(),
            };
            setProgress(payload);
            setLastSavedAt(payload.lastUpdatedAt);
        } catch (e) {
            console.error('Failed to save page3', e);
        }
    }

    function handleSendDocuments() {
        setStatus('Documents sent to agent successfully.');
        markCompleted('applicant');
        handleSave();
    }

    function handleSubmitApplication() {
        setStatus('Rental application submitted successfully.');
        markCompleted('applicant');
        handleSave();
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.h1}>Finalize Application</h1>

            <div style={styles.actionsRow}>
                <button style={styles.secondary} onClick={() => navigate('/client/documents')}>
                    Back to Documents
                </button>
                <button style={styles.secondary} onClick={() => navigate('/agent')}>
                    Back to Agent Page
                </button>
            </div>

            <section style={styles.card}>
                <h2 style={styles.h2}>Final Actions</h2>
                <button style={styles.primary} onClick={handleSendDocuments}>
                    Send Documents to Agent
                </button>
                <button style={styles.primary} onClick={handleSubmitApplication}>
                    Submit Rental Application
                </button>
                <p style={styles.subtle}>
                    2FA authentication is prepared but currently bypassed for testing.
                </p>
            </section>

            {status && <div style={styles.status}>{status}</div>}

            <div style={styles.saveInfo}>
                <button style={styles.secondary} onClick={handleSave}>
                    Save Progress
                </button>
                <span style={styles.lastSaved}>
                    Last saved: {lastSavedAt ? new Date(lastSavedAt).toLocaleString() : 'Never'}
                </span>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: 800, margin: '20px auto', padding: 16, background: '#fff' },
    h1: { fontSize: 22, marginBottom: 16 },
    h2: { fontSize: 18, marginBottom: 8 },
    card: { border: '1px solid #ddd', borderRadius: 6, padding: 12, marginBottom: 16 },
    actionsRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 16, gap: 8 },
    primary: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 14px', marginRight: 8, cursor: 'pointer' },
    secondary: { background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: 6, padding: '10px 14px', cursor: 'pointer' },
    subtle: { fontSize: 12, color: '#6b7280', marginTop: 8 },
    status: { marginTop: 12, padding: 8, background: '#ecfdf5', border: '1px solid #10b981', borderRadius: 6, color: '#065f46' },
    saveInfo: { marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' },
    lastSaved: { fontSize: 12, color: '#6b7280' },
};