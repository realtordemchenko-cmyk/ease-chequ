// D:\Projects\Ease Chequ\client\src\client\ClientPage2.jsx
// Step 2 (Documents): robust participant normalization, legacy buckets for compatibility,
// null-safe rendering, stable IDs, and clean navigation.

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';

// Create a stable pseudo-id from name/email to avoid React key churn across renders
function toStableId(p, index) {
    const base = `${(p.firstName || '').trim()}|${(p.lastName || '').trim()}|${(p.email || '').trim()}|${(p.role || '').trim()}`;
    // Simple hash
    let h = 0;
    for (let i = 0; i < base.length; i++) {
        h = (h << 5) - h + base.charCodeAt(i);
        h |= 0;
    }
    return `pid-${index}-${Math.abs(h)}`;
}

// Normalize participants from context:
// - Prefer page1.participants if present
// - Otherwise rebuild from applicants/occupants/guarantors, adding role
function normalizeParticipants(progress) {
    const page1 = progress?.page1 || {};
    const fromUnified = Array.isArray(page1.participants) ? page1.participants : [];

    if (fromUnified && fromUnified.length > 0) {
        return fromUnified.map((p, i) => ({
            id: toStableId(p, i),
            firstName: p.firstName || '',
            lastName: p.lastName || '',
            email: p.email || '',
            phone: p.phone || '',
            relation: p.relation || '',
            role: p.role || 'applicant',
        }));
    }

    const applicants = (page1.applicants || []).map((p, i) => ({
        id: toStableId({ ...p, role: 'applicant' }, i),
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        email: p.email || '',
        phone: p.phone || '',
        relation: p.relation || '',
        role: 'applicant',
    }));

    const occupants = (page1.occupants || []).map((p, i) => ({
        id: toStableId({ ...p, role: 'occupant' }, i),
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        email: p.email || '',
        phone: p.phone || '',
        relation: p.relation || '',
        role: 'occupant',
    }));

    const guarantors = (page1.guarantors || []).map((p, i) => ({
        id: toStableId({ ...p, role: 'guarantor' }, i),
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        email: p.email || '',
        phone: p.phone || '',
        relation: p.relation || '',
        role: 'guarantor',
    }));

    return [...applicants, ...occupants, ...guarantors];
}

// Derive legacy buckets from the normalized list to keep old components compatible
function deriveBuckets(list) {
    const applicants = [];
    const occupants = [];
    const guarantors = [];

    for (const p of list) {
        const record = {
            firstName: p.firstName,
            lastName: p.lastName,
            email: p.email,
            phone: p.phone,
            relation: p.relation,
        };
        if (p.role === 'applicant') applicants.push(record);
        else if (p.role === 'occupant') occupants.push(record);
        else if (p.role === 'guarantor') guarantors.push(record);
    }

    return { applicants, occupants, guarantors };
}

export default function ClientPage2() {
    const navigate = useNavigate();
    const { progress, setProgress } = useProgress();

    const participants = useMemo(() => normalizeParticipants(progress), [progress]);
    const buckets = useMemo(() => deriveBuckets(participants), [participants]);

    const [infoMessage, setInfoMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Optional sanity sync: ensure progress.page1.participants populated for downstream pages
    useEffect(() => {
        const page1 = progress?.page1 || {};
        const hasUnified = Array.isArray(page1.participants) && page1.participants.length > 0;

        if (!hasUnified && participants.length > 0) {
            const payload = {
                ...progress,
                page1: {
                    ...page1,
                    participants: participants.map((p) => ({
                        firstName: p.firstName,
                        lastName: p.lastName,
                        email: p.email,
                        phone: p.phone,
                        relation: p.relation,
                        role: p.role,
                    })),
                    applicants: buckets.applicants,
                    occupants: buckets.occupants,
                    guarantors: buckets.guarantors,
                },
                lastUpdatedAt: Date.now(),
            };
            setProgress(payload);
            setInfoMessage('Participants normalized for compatibility.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [participants]);

    const countsText = useMemo(() => {
        const a = buckets.applicants.length;
        const o = buckets.occupants.length;
        const g = buckets.guarantors.length;
        return `Applicants: ${a} • Occupants: ${o} • Guarantors: ${g}`;
    }, [buckets]);

    function handleBack() {
        navigate('/client');
    }

    function handleContinue() {
        // In a full flow, we'd validate document uploads here.
        // For now, continue to final step.
        navigate('/client/final');
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.h1}>Rental Intake — Step 2 (Documents)</h1>
            <p style={styles.subtle}>
                Attach required documents per participant. The summary below shows the unified participant list (source of truth)
                and legacy buckets for backward compatibility.
            </p>

            {(infoMessage || errorMessage) && (
                <div style={errorMessage ? styles.error : styles.info}>
                    {errorMessage || infoMessage}
                </div>
            )}

            {/* Participants Summary */}
            <section style={styles.card}>
                <h2 style={styles.h2}>Participants summary (normalized)</h2>
                {participants.length === 0 ? (
                    <div style={styles.empty}>No participants found. Go back to Step 1 and add at least one applicant.</div>
                ) : (
                    <div style={styles.jsonWrap}>
                        {participants.map((p) => (
                            <div key={p.id} style={styles.row}>
                                <span style={styles.badge}>{p.role}</span>
                                <span>
                                    {p.firstName || '-'} {p.lastName || '-'}
                                </span>
                                <span style={styles.dim}>{p.email || 'no email'}</span>
                                {p.relation ? <span style={styles.dim}>relation: {p.relation}</span> : null}
                            </div>
                        ))}
                    </div>
                )}
                <div style={styles.counts}>{countsText}</div>
            </section>

            {/* Legacy buckets */}
            <section style={styles.card}>
                <h2 style={styles.h2}>Legacy buckets (for compatibility)</h2>

                <div style={styles.grid3}>
                    <div style={styles.bucket}>
                        <h3 style={styles.h3}>Applicants</h3>
                        {buckets.applicants.length === 0 ? (
                            <div style={styles.empty}>No applicants</div>
                        ) : (
                            buckets.applicants.map((p, i) => (
                                <div key={`a-${i}`} style={styles.row}>
                                    <span>
                                        {p.firstName || '-'} {p.lastName || '-'}
                                    </span>
                                    <span style={styles.dim}>{p.email || 'no email'}</span>
                                </div>
                            ))
                        )}
                    </div>

                    <div style={styles.bucket}>
                        <h3 style={styles.h3}>Occupants</h3>
                        {buckets.occupants.length === 0 ? (
                            <div style={styles.empty}>No occupants</div>
                        ) : (
                            buckets.occupants.map((p, i) => (
                                <div key={`o-${i}`} style={styles.row}>
                                    <span>
                                        {p.firstName || '-'} {p.lastName || '-'}
                                    </span>
                                    <span style={styles.dim}>{p.email || 'no email'}</span>
                                    {p.relation ? <span style={styles.dim}>relation: {p.relation}</span> : null}
                                </div>
                            ))
                        )}
                    </div>

                    <div style={styles.bucket}>
                        <h3 style={styles.h3}>Guarantors</h3>
                        {buckets.guarantors.length === 0 ? (
                            <div style={styles.empty}>No guarantors</div>
                        ) : (
                            buckets.guarantors.map((p, i) => (
                                <div key={`g-${i}`} style={styles.row}>
                                    <span>
                                        {p.firstName || '-'} {p.lastName || '-'}
                                    </span>
                                    <span style={styles.dim}>{p.email || 'no email'}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Navigation actions */}
            <div style={styles.actionsRow}>
                <button style={styles.secondary} onClick={handleBack}>Back to Step 1</button>
                <button style={styles.primary} onClick={handleContinue}>Continue to Final</button>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: 960, margin: '20px auto', padding: 16, background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb' },
    h1: { fontSize: 22, marginBottom: 6 },
    h2: { fontSize: 18, marginBottom: 8 },
    h3: { fontSize: 16, margin: '0 0 6px 0' },
    subtle: { fontSize: 13, color: '#4b5563', marginBottom: 12 },
    card: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 16 },
    jsonWrap: { display: 'flex', flexDirection: 'column', gap: 6 },
    row: { display: 'flex', alignItems: 'center', gap: 12, padding: '6px 8px', border: '1px dashed #d1d5db', borderRadius: 6 },
    badge: { fontSize: 12, background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 6, padding: '2px 6px', textTransform: 'capitalize' },
    dim: { fontSize: 12, color: '#6b7280' },
    counts: { marginTop: 8, fontSize: 12, color: '#6b7280' },
    empty: { fontSize: 13, color: '#6b7280', fontStyle: 'italic' },
    grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 },
    bucket: { border: '1px dashed #d1d5db', borderRadius: 6, padding: 10 },
    actionsRow: { display: 'flex', justifyContent: 'space-between', marginTop: 16 },
    primary: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 14px', cursor: 'pointer' },
    secondary: { background: '#f3f4f6', color: '#111827', border: '1px solid #d1d5db', borderRadius: 6, padding: '10px 14px', cursor: 'pointer' },
};