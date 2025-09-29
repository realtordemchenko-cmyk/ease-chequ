// D:\Projects\Ease Chequ\client\src\client\ClientPage1.jsx
// Исправлен синтаксис в styles (без лишних кавычек), логика add и валидации корректна.

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';

const ROLE_LIMITS = { applicant: 2, occupant: 3, guarantor: 3 };
const OCCUPANT_RELATIONS = ['Son', 'Daughter', 'Mother', 'Father', 'Wife', 'Husband', 'Other'];

export default function ClientPage1() {
    const navigate = useNavigate();
    const { progress, setProgress } = useProgress();

    const [checkInDate, setCheckInDate] = useState('');
    const [participants, setParticipants] = useState([
        { firstName: '', lastName: '', phone: '', email: '', relation: '', role: 'applicant' },
    ]);
    const [infoMessage, setInfoMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [lastSavedAt, setLastSavedAt] = useState(null);

    useEffect(() => {
        const p = progress?.page1;
        if (Array.isArray(p?.participants) && p.participants.length) {
            setParticipants(p.participants);
        }
        if (progress?.lastUpdatedAt) setLastSavedAt(progress.lastUpdatedAt);
        if (progress?.checkInDate) setCheckInDate(progress.checkInDate);
    }, [progress]);

    function digitsOnly(str) {
        return (str || '').replace(/\D/g, '');
    }
    function validatePhone(phone) {
        const digits = digitsOnly(phone);
        return digits.length >= 10;
    }

    function validatePerson(p) {
        const hasAny = !!(p.firstName || p.lastName || p.phone || p.email || p.relation);
        if (!hasAny) return 'empty';
        const hasName = !!p.firstName?.trim() && !!p.lastName?.trim();

        if (p.role === 'applicant' || p.role === 'guarantor') {
            return hasName && validatePhone(p.phone) && !!p.email?.trim();
        }
        if (p.role === 'occupant') {
            return hasName;
        }
        return false;
    }

    const counts = useMemo(() => {
        const applicants = participants.filter((p) => p.role === 'applicant').length;
        const occupants = participants.filter((p) => p.role === 'occupant').length;
        const guarantors = participants.filter((p) => p.role === 'guarantor').length;
        const validApplicants = participants.filter((p) => p.role === 'applicant' && validatePerson(p) === true).length;
        return { applicants, occupants, guarantors, validApplicants };
    }, [participants]);

    const canContinue = counts.validApplicants >= 1;

    function withinLimit(role) {
        const current =
            role === 'applicant'
                ? counts.applicants
                : role === 'occupant'
                    ? counts.occupants
                    : counts.guarantors;
        return current < ROLE_LIMITS[role];
    }

    function updateField(index, field, value) {
        const next = [...participants];
        next[index] = { ...next[index], [field]: value };
        setParticipants(next);
    }

    function changeRole(index, roleNext) {
        setErrorMessage('');
        setInfoMessage('');
        if (!withinLimit(roleNext)) {
            setErrorMessage(`Limit reached for ${roleNext}s (max ${ROLE_LIMITS[roleNext]}).`);
            return;
        }
        const next = [...participants];
        next[index] = { ...next[index], role: roleNext };
        setParticipants(next);
    }

    function removePerson(index) {
        const next = participants.filter((_, i) => i !== index);
        setParticipants(next.length ? next : [{ firstName: '', lastName: '', phone: '', email: '', relation: '', role: 'applicant' }]);
    }

    function handleAddAnother() {
        setErrorMessage('');
        setInfoMessage('');

        if (counts.applicants < ROLE_LIMITS.applicant) {
            setParticipants([...participants, { firstName: '', lastName: '', phone: '', email: '', relation: '', role: 'applicant' }]);
            setInfoMessage('Added Applicant.');
            return;
        }
        if (counts.occupants < ROLE_LIMITS.occupant) {
            setParticipants([...participants, { firstName: '', lastName: '', phone: '', email: '', relation: '', role: 'occupant' }]);
            setInfoMessage('Added Occupant.');
            return;
        }
        if (counts.guarantors < ROLE_LIMITS.guarantor) {
            setParticipants([...participants, { firstName: '', lastName: '', phone: '', email: '', relation: '', role: 'guarantor' }]);
            setInfoMessage('Added Guarantor.');
            return;
        }
        setErrorMessage('All participant limits reached (2 applicants, 3 occupants, 3 guarantors).');
    }

    function stripRole(p) {
        const { role, ...rest } = p;
        return rest;
    }

    function handleSave() {
        const applicants = participants.filter((p) => p.role === 'applicant').map(stripRole);
        const occupants = participants.filter((p) => p.role === 'occupant').map(stripRole);
        const guarantors = participants.filter((p) => p.role === 'guarantor').map(stripRole);

        const payload = {
            ...progress,
            page1: {
                participants,
                applicants,
                occupants,
                guarantors,
            },
            checkInDate,
            meta: {
                ...progress?.meta,
                counts: {
                    applicants: counts.applicants,
                    occupants: counts.occupants,
                    guarantors: counts.guarantors,
                    validApplicants: counts.validApplicants,
                },
            },
            lastUpdatedAt: Date.now(),
        };
        setProgress(payload);
        setLastSavedAt(payload.lastUpdatedAt);
        setInfoMessage('Progress saved.');
    }

    function handleContinue() {
        handleSave();
        if (canContinue) {
            navigate('/client/documents');
        } else {
            setErrorMessage('Add at least 1 valid applicant (name, phone, email).');
        }
    }

    const readinessText = canContinue
        ? `Ready to continue • ${counts.validApplicants} valid applicant${counts.validApplicants > 1 ? 's' : ''}`
        : 'Not ready • add at least 1 valid applicant';
    const countsText = `Applicants: ${counts.applicants}/2 • Occupants: ${counts.occupants}/3 • Guarantors: ${counts.guarantors}/3`;

    return (
        <div style={styles.container}>
            <div style={styles.dateRow}>
                <label style={styles.dateLabel}>Move-in date</label>
                <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    style={styles.dateInput}
                />
            </div>

            <h1 style={styles.h1}>Rental Intake — Step 1</h1>
            <p style={styles.subtle}>
                Minimum 1 Applicant required. Occupants and Guarantors do not block the transition if they are incomplete.
            </p>

            <div style={canContinue ? styles.readyBox : styles.notReadyBox}>{readinessText}</div>
            <div style={styles.countBadge}>{countsText}</div>

            <section style={styles.card}>
                <h2 style={styles.h2}>Add another person</h2>
                <button style={styles.secondary} onClick={handleAddAnother}>+ Add Another Person</button>
                {infoMessage && <div style={styles.info}>{infoMessage}</div>}
                {errorMessage && <div style={styles.error}>{errorMessage}</div>}
            </section>

            <section style={styles.card}>
                <h2 style={styles.h2}>Participants</h2>
                {participants.map((p, i) => {
                    const valid = validatePerson(p);
                    const showError = valid === false;
                    return (
                        <div key={`participant-${i}`} style={styles.personCard}>
                            <div style={styles.personHeader}>
                                <div style={styles.roleRow}>
                                    <label style={styles.inlineLabel}>Role:</label>
                                    <select
                                        value={p.role}
                                        onChange={(e) => changeRole(i, e.target.value)}
                                        style={styles.select}
                                    >
                                        <option value="applicant">Applicant</option>
                                        <option value="occupant">Occupant</option>
                                        <option value="guarantor">Guarantor</option>
                                    </select>
                                </div>
                                <button style={styles.linkLike} onClick={() => removePerson(i)}>Remove</button>
                            </div>

                            <div style={styles.grid2}>
                                <input
                                    placeholder="First Name*"
                                    value={p.firstName}
                                    onChange={(e) => updateField(i, 'firstName', e.target.value)}
                                />
                                <input
                                    placeholder="Last Name*"
                                    value={p.lastName}
                                    onChange={(e) => updateField(i, 'lastName', e.target.value)}
                                />

                                {(p.role === 'applicant' || p.role === 'guarantor') && (
                                    <>
                                        <input
                                            placeholder="Phone*"
                                            value={p.phone}
                                            onChange={(e) => updateField(i, 'phone', e.target.value)}
                                        />
                                        <input
                                            placeholder="Email*"
                                            value={p.email}
                                            onChange={(e) => updateField(i, 'email', e.target.value)}
                                        />
                                    </>
                                )}

                                {p.role === 'occupant' && (
                                    <>
                                        <div style={styles.relationRow}>
                                            <label style={styles.inlineLabel}>Relation:</label>
                                            <select
                                                value={OCCUPANT_RELATIONS.includes(p.relation) ? p.relation : 'Other'}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    updateField(i, 'relation', val === 'Other' ? '' : val);
                                                }}
                                                style={styles.select}
                                            >
                                                {OCCUPANT_RELATIONS.map((r) => (
                                                    <option key={r} value={r}>{r}</option>
                                                ))}
                                            </select>
                                            {(!p.relation || !OCCUPANT_RELATIONS.includes(p.relation)) && (
                                                <input
                                                    placeholder="Custom relation (optional)"
                                                    value={p.relation}
                                                    onChange={(e) => updateField(i, 'relation', e.target.value)}
                                                    style={styles.inputInline}
                                                />
                                            )}
                                        </div>
                                        <input
                                            placeholder="Phone (optional)"
                                            value={p.phone}
                                            onChange={(e) => updateField(i, 'phone', e.target.value)}
                                        />
                                    </>
                                )}
                            </div>

                            {showError && (
                                <div style={styles.error}>
                                    {p.role === 'applicant' && 'Applicant requires first & last name, phone, and email.'}
                                    {p.role === 'occupant' && 'Occupant requires first & last name. Relation is optional.'}
                                    {p.role === 'guarantor' && 'Guarantor requires first & last name, phone, and email.'}
                                </div>
                            )}
                        </div>
                    );
                })}
            </section>

            <div style={styles.actionsRow}>
                <button style={styles.secondary} onClick={handleSave}>Save Progress</button>
                <button
                    style={canContinue ? styles.primary : styles.disabled}
                    disabled={!canContinue}
                    onClick={handleContinue}
                >
                    Continue to Documents
                </button>
            </div>

            <div style={styles.lastRow}>
                <span style={styles.lastSaved}>
                    Last saved: {lastSavedAt ? new Date(lastSavedAt).toLocaleString() : 'Never'}
                </span>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: 960, margin: '20px auto', padding: 16, background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb' },
    dateRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, justifyContent: 'flex-start' },
    dateLabel: { fontSize: 12, color: '#374151' },
    dateInput: { width: '20%', minWidth: 160, padding: 6, borderRadius: 6, border: '1px solid #d1d5db' },
    h1: { fontSize: 22, marginBottom: 6 },
    h2: { fontSize: 18, marginBottom: 8 },
    subtle: { fontSize: 13, color: '#4b5563', marginBottom: 8 },
    card: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 16 },
    personCard: { border: '1px dashed #d1d5db', borderRadius: 6, padding: 10, marginTop: 10 },
    personHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    roleRow: { display: 'flex', alignItems: 'center', gap: 8 },
    relationRow: { display: 'flex', alignItems: 'center', gap: 8, gridColumn: '1 / span 2' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
    inputInline: { padding: '6px 8px', borderRadius: 6, border: '1px solid #d1d5db', minWidth: 160 },
    error: { marginTop: 6, color: '#b91c1c', fontSize: 13 },
    info: { marginTop: 6, color: '#0f766e', fontSize: 13 },
    countBadge: { fontSize: 12, color: '#6b7280' },
    inlineLabel: { fontSize: 13, color: '#374151' },
    select: { padding: '6px 8px', borderRadius: 6, border: '1px solid #d1d5db' },
    actionsRow: { display: 'flex', justifyContent: 'space-between', marginTop: 16 },
    lastRow: { display: 'flex', justifyContent: 'flex-end', marginTop: 10 },
    lastSaved: { fontSize: 12, color: '#6b7280' },
    linkLike: { background: 'transparent', border: '1px solid transparent', color: '#2563eb', cursor: 'pointer' },
    primary: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 14px', cursor: 'pointer' },
    disabled: { background: '#9ca3af', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 14px', cursor: 'not-allowed' },
    secondary: { background: '#f3f4f6', color: '#111827', border: '1px solid #d1d5db', borderRadius: 6, padding: '10px 14px', cursor: 'pointer' },
};