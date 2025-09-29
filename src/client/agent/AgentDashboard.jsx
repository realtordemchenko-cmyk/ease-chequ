import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import FinancialAnalysis from '../../../client/src/components/FinancialAnalysis';

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

    // --- Generate Client Link ---
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

    // --- Upload Client Documents ---
    function handleUploadClientDocuments() {
        // Теперь ведём на агентскую копию клиентской страницы
        navigate('/agent/client-intake');
    }

    // --- Save progress ---
    function handleSave() {
        try {
            const payload = {
                ...progress,
                lastUpdatedAt: Date.now(),
            };
            setProgress(payload);
            setLastSavedAt(payload.lastUpdatedAt);
            setStatusMsg('Progress saved');
            setTimeout(() => setStatusMsg(null), 2000);
        } catch (e) {
            console.error('Failed to save agent dashboard', e);
            setStatusMsg('Save failed');
        }
    }

    // --- Derived data & recommendations ---
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

            {/* Actions */}
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

            {/* Roles overview */}
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
                <div><strong>Name:</strong> {guarantor.firstName || '—'} {guarantor.lastName