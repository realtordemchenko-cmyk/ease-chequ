import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import FinancialAnalysis from '../components/FinancialAnalysis';

export default function AgentDashboard() {
    const navigate = useNavigate();
    const { progress, setProgress, switchRoles } = useProgress();

    const [lastSavedAt, setLastSavedAt] = useState(null);
    const [statusMsg, setStatusMsg] = useState(null);
    const [generatedLink, setGeneratedLink] = useState('');

    useEffect(() => {
        if (progress?.lastUpdatedAt) {
            setLastSavedAt(progress.lastUpdatedAt);
        }
    }, [progress]);

    function handleGenerateClientLink() {
        try {
            const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
            const agentEmail = progress?.agent?.email || 'realtordemchenko@gmail.com';
            const groupId = progress?.groupId || `grp-${Date.now()}`;
            const url = `${origin}/client.html?agent=${encodeURIComponent(agentEmail)}&group=${encodeURIComponent(groupId)}`;
            setGeneratedLink(url);
            setStatusMsg('Client link generated');
            setTimeout(() => setStatusMsg(null), 2000);
        } catch (e) {
            console.error('Failed to generate client link', e);
            setStatusMsg('Failed to generate link');
        }
    }

    async function copyLinkToClipboard() {
        try {
            if (!generatedLink) return;
            await navigator.clipboard.writeText(generatedLink);
            setStatusMsg('Link copied to clipboard');
            setTimeout(() => setStatusMsg(null), 2000);
        } catch {
            setStatusMsg('Copy failed');
        }
    }

    function handleUploadClientDocuments() {
        navigate('/agent/client-intake');
    }

    function handleSave() {
        try {
            const payload = { ...progress, lastUpdatedAt: Date.now() };
            setProgress(payload);
            setLastSavedAt(payload.lastUpdatedAt);
            setStatusMsg('Progress saved');
            setTimeout(() => setStatusMsg(null), 2000);
        } catch (e) {
            console.error('Failed to save agent dashboard', e);
            setStatusMsg('Save failed');
        }
    }

    const applicant = progress.roles?.applicant || {};
    const occupant = progress.roles?.occupant || {};
    const guarantor = progress.roles?.guarantor || {};

    function scoreTag(score) {
        if (score == null) return { label: 'Unknown', color: '#6b7280' };
        if (score >= 700) return { label: 'Excellent', color: '#16a34a' };
        if (score >= 680) return { label: 'Attention Required', color: '#ea580c' };
        return { label: 'Weak', color: '#b91c1c' };
    }

    function recommendationsForScore(score) {
        const recs = [];
        if (score == null) return recs;
        if (score >= 700) {
            recs.push('Strong application');
        } else if (score >= 680) {
            recs.push('Increase deposit from 2 to 4–6 months');
            recs.push('Add Guarantor to strengthen application');
            recs.push('Check with landlord about document acceptance before viewing');
        } else {
            recs.push('Increase deposit to 4–6 months');
            recs.push('Add Guarantor');
            recs.push('Provide comprehensive income proof and bank statements');
            recs.push('Confirm document acceptance with landlord before viewing');
        }
        return recs;
    }

    const totalNetIncome = useMemo(() => {
        const a = Number(applicant.netIncome || 0);
        const o = Number(occupant.netIncome || 0);
        const g = Number(guarantor.netIncome || 0);
        return a + o + g;
    }, [applicant.netIncome, occupant.netIncome, guarantor.netIncome]);

    const affordability = useMemo(() => {
        const income = totalNetIncome;
        if (!income || income <= 0) return { min: 0, max: 0 };
        const min = Math.round((income * 0.3) / 10) * 10;
        const max = Math.round((income * 0.4) / 10) * 10;
        return { min, max };
    }, [totalNetIncome]);

    const overallRisk = useMemo(() => {
        const scores = [applicant.creditScore, occupant.creditScore, guarantor.creditScore].filter(
            (s) => typeof s === 'number'
        );
        if (!scores.length) return 'Unknown';
        if (scores.some((s) => s < 680)) return 'High';
        if (scores.some((s) => s < 700)) return 'Medium';
        return 'Low';
    }, [applicant.creditScore, occupant.creditScore, guarantor.creditScore]);

    const occupantStronger =
        typeof occupant.creditScore === 'number' &&
        typeof applicant.creditScore === 'number' &&
        occupant.creditScore > applicant.creditScore;

    function handleSwitchRoles() {
        switchRoles('applicant', 'occupant');
        setStatusMsg('Roles switched');
        setTimeout(() => setStatusMsg(null), 2000);
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.h1}>Agent Dashboard</h1>
                <div style={styles.saveInfo}>
                    <button style={styles.secondary} onClick={handleSave}>Save Progress</button>
                    <span style={styles.lastSaved}>Last saved: {lastSavedAt ? new Date(lastSavedAt).toLocaleString() : 'Never'}</span>
                </div>
            </header>

            {statusMsg && <div style={styles.status}>{statusMsg}</div>}

            <section style={styles.card}>
                <h2 style={styles.h2}>Agent Actions</h2>
                <div style={styles.actionsRow}>
                    <button style={styles.primary} onClick={handleGenerateClientLink}>Generate Client Link</button>
                    <button style={styles.primary} onClick={handleUploadClientDocuments}>Upload Client Documents</button>
                    <button style={styles.secondary} onClick={() => navigate('/client/analysis')}>Complete Document Analysis</button>
                </div>
                {generatedLink && (
                    <div style={styles.linkBox}>
                        <div style={styles.linkLabel}>Client link:</div>
                        <code style={styles.linkCode}>{generatedLink}</code>
                        <button style={styles.secondary} onClick={copyLinkToClipboard}>Copy link</button>
                    </div>
                )}
            </section>

            <section style={styles.card}>
                <h2 style={styles.h2}>Applicant</h2>
                <div><strong>Name:</strong> {applicant.firstName || '—'} {applicant.lastName || ''}</div>
                <div><strong>Net income:</strong> ${Number(applicant.netIncome || 0).toLocaleString()}</div>
                <div>
                    <strong>Credit score:</strong>{' '}
                    <span style={{ color: scoreTag(applicant.creditScore).color }}>
                        {applicant.creditScore ?? 'Unknown'} ({scoreTag(applicant.creditScore).label})
                    </span>
                </div>
                <ul>
                    {recommendationsForScore(applicant.creditScore).map((r, i) => <li key={`a-rec-${i}`}>{r}</li>)}
                </ul>
            </section>

            <section style={styles.card}>
                <h2 style={styles.h2}>Occupant</h2>
                <div><strong>Name:</strong> {occupant.firstName || '—'} {occupant.lastName || ''}</div>
                <div><strong>Net income:</strong> ${Number(occupant.netIncome || 0).toLocaleString()}</div>
                <div>
                    <strong>Credit score:</strong>{' '}
                    <span style={{ color: scoreTag(occupant.creditScore).color }}>
                        {occupant.creditScore ?? 'Unknown'} ({scoreTag(occupant.creditScore).label})
                    </span>
                </div>
                <ul>
                    {recommendationsForScore(occupant.creditScore).map((r, i) => <li key={`o-rec-${i}`}>{r}</li>)}
                </ul>
                {occupantStronger && (
                    <div style={styles.switchBox}>
                        <div>Occupant appears stronger than Applicant. Consider switching roles.</div>
                        <button style={styles.primary} onClick={handleSwitchRoles}>Switch Roles</button>
                    </div>
                )}
            </section>

            <section style={styles.card}>
                <h2 style={styles.h2}>Guarantor</h2>
                <div><strong>Name:</strong> {guarantor.firstName || '—'} {guarantor.lastName || ''}</div>
                <div><strong>Net income:</strong> ${Number(guarantor.netIncome || 0).toLocaleString()}</div>
                <div>
                    <strong>Credit score:</strong>{' '}
                    <span style={{ color: scoreTag(guarantor.creditScore).color }}>
                        {guarantor.creditScore ?? 'Unknown'} ({scoreTag(guarantor.creditScore).label})
                    </span>
                </div>
                <ul>
                    {recommendationsForScore(guarantor.creditScore).map((r, i) => <li key={`g-rec-${i}`}>{r}</li>)}
                </ul>
            </section>

            <section style={styles.card}>
                <h2 style={styles.h2}>Financial Analysis & Role Optimization</h2>
                <FinancialAnalysis
                    applicant={applicant}
                    occupant={occupant}
                    guarantor={guarantor}
                    onSwitchRoles={switchRoles}
                />
            </section>

            <section style={styles.card}>
                <h2 style={styles.h2}>Summary Application</h2>
                <p>Estimated rent range: ${affordability.min} - ${affordability.max} (30–40% income rule)</p>
                <p>Risk of rejection: {overallRisk}</p>
                <p style={styles.subtle}>
                    To strengthen application: increase deposit, add guarantor, and confirm document acceptance with landlord prior to viewing.
                </p>
            </section>

            <footer style={styles.footer}>
                <button style={styles.secondary} onClick={handleSave}>Save Progress</button>
                <span style={styles.lastSaved}>Last saved: {lastSavedAt ? new Date(lastSavedAt).toLocaleString() : 'Never'}</span>
            </footer>
        </div>
    );
}

const styles = {
    container: { maxWidth: 1100, margin: '20px auto', padding: '0 16px' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    h1: { margin: 0, fontSize: 24 },
    h2: { margin: '0 0 12px 0', fontSize: 20 },
    card: {
        background: '#fff', border: '1px solid '#e5e7eb', borderRadius: 8, padding: 16, marginBottom: 16 },
  status: { marginBottom: 12, padding: 8, background: '#f0f9ff', border: '1px solid #93c5fd', color: '#1e40af', borderRadius: 6, fontSize: 13 },
        saveInfo: { display: 'flex', gap: 12, alignItems: 'center' },
        lastSaved: { fontSize: 12, color: '#6b7280' },
        actionsRow: { display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 },
        linkBox: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, flexWrap: 'wrap' },
        linkLabel: { fontSize: 12, color: '#334155' },
        linkCode: { background: '#0f172a', color: '#e2e8f0', padding: '6px 8px', borderRadius: 6 },
        switchBox: { marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
        subtle: { fontSize: 12, color: '#6b7280' },
        footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, paddingTop: 12, borderTop: '1px solid #eee' },
        primary: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 14px', cursor: 'pointer' },
        secondary: { background: '#f3f4f6', color: '#111827', border: '1px solid #d1d5db', borderRadius: 6, padding: '10px 14px', cursor: 'pointer' },
    };