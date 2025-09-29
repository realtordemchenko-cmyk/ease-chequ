import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';

/**
 * DocumentAnalysis
 * - Полный анализ документов (мок данных ИИ + редактируемые поля)
 * - Автозаполнение Ontario Rental Application Form из ранее введённых данных
 * - Ручные правки недостающих полей
 * - Валидация и подсказки
 * - Проверка несоответствий имени (AKA в кредитном отчёте vs ID vs форма)
 * - Кнопка Complete Document Analysis
 * - Кнопки Back to First Page / Back to Agent Page
 */
export default function DocumentAnalysis() {
    const navigate = useNavigate();
    const { progress, setProgress } = useProgress();

    // Seed base data from roles/page1
    const applicantBase = progress?.roles?.applicant || {};
    const occupantBase = progress?.roles?.occupant || {};
    const guarantorBase = progress?.roles?.guarantor || {};

    // Mock AI extracted fields (replace with actual AI pipeline later)
    const [aiExtract, setAiExtract] = useState({
        applicantNameFromID: `${applicantBase.firstName || ''} ${applicantBase.lastName || ''}`.trim(),
        applicantAKAFromCredit: applicantBase.aka || '', // ожидаем поле aka если кредит-отчёт это дал
        applicantCreditScore: typeof applicantBase.creditScore === 'number' ? applicantBase.creditScore : null,
        occupantCreditScore: typeof occupantBase.creditScore === 'number' ? occupantBase.creditScore : null,
        guarantorCreditScore: typeof guarantorBase.creditScore === 'number' ? guarantorBase.creditScore : null,
        netIncomeApplicant: Number(applicantBase.netIncome || 0),
        netIncomeOccupant: Number(occupantBase.netIncome || 0),
        netIncomeGuarantor: Number(guarantorBase.netIncome || 0),
    });

    // Editable rental application form (Ontario standard subset)
    const [form, setForm] = useState({
        applicantFirstName: applicantBase.firstName || '',
        applicantLastName: applicantBase.lastName || '',
        applicantPhone: applicantBase.phone || '',
        applicantEmail: applicantBase.email || '',
        currentAddress: progress?.analysis?.currentAddress || '',
        monthlyIncome: aiExtract.netIncomeApplicant || 0,
        preferredMoveInDate: progress?.analysis?.preferredMoveInDate || '',
        occupantsCount: (progress?.page1?.occupants || []).filter((o) => !!(o.firstName || o.lastName)).length,
        guarantorPresent: !!(progress?.page1?.guarantors || []).filter((g) => !!(g.firstName || g.lastName)).length,
    });

    const [statusMsg, setStatusMsg] = useState('');
    const [lastSavedAt, setLastSavedAt] = useState(null);

    // Name discrepancy detection: compare form names vs ID vs AKA from credit
    const nameFromForm = `${form.applicantFirstName} ${form.applicantLastName}`.trim();
    const nameFromID = aiExtract.applicantNameFromID?.trim();
    const akaFromCredit = aiExtract.applicantAKAFromCredit?.trim();
    const nameDiscrepancy =
        (nameFromID && nameFromForm && nameFromForm.toLowerCase() !== nameFromID.toLowerCase()) ||
        (akaFromCredit && nameFromForm && akaFromCredit.toLowerCase() !== nameFromForm.toLowerCase());

    useEffect(() => {
        if (progress?.lastUpdatedAt) setLastSavedAt(progress.lastUpdatedAt);
    }, [progress]);

    function updateForm(field, value) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    // Credit score recommendations under role blocks
    function scoreBand(score) {
        if (score == null) return 'Unknown';
        if (score >= 700) return 'Excellent';
        if (score >= 680) return 'Attention Required';
        return 'Weak';
    }
    function scoreRecommendations(score) {
        if (score == null) return [];
        if (score >= 700) return ['Strong application'];
        if (score >= 680) {
            return [
                'Increase deposit from 2 to 4–6 months',
                'Add Guarantor to strengthen application',
                'Check with landlord about document acceptance before viewing',
            ];
        }
        return [
            'Increase deposit to 4–6 months',
            'Add Guarantor',
            'Provide comprehensive income proof and bank statements',
            'Confirm document acceptance with landlord before viewing',
        ];
    }

    // Affordability and risk
    const totalNetIncome = useMemo(() => {
        return Number(aiExtract.netIncomeApplicant || 0) + Number(aiExtract.netIncomeOccupant || 0) + Number(aiExtract.netIncomeGuarantor || 0);
    }, [aiExtract]);
    const affordability = useMemo(() => {
        if (!totalNetIncome) return { min: 0, max: 0 };
        const min = Math.round((totalNetIncome * 0.3) / 10) * 10;
        const max = Math.round((totalNetIncome * 0.4) / 10) * 10;
        return { min, max };
    }, [totalNetIncome]);
    const overallRisk = useMemo(() => {
        const scores = [aiExtract.applicantCreditScore, aiExtract.occupantCreditScore, aiExtract.guarantorCreditScore].filter(
            (s) => typeof s === 'number'
        );
        if (!scores.length) return 'Unknown';
        if (scores.some((s) => s < 680)) return 'High';
        if (scores.some((s) => s < 700)) return 'Medium';
        return 'Low';
    }, [aiExtract]);

    const occupantStronger =
        typeof aiExtract.occupantCreditScore === 'number' &&
        typeof aiExtract.applicantCreditScore === 'number' &&
        aiExtract.occupantCreditScore > aiExtract.applicantCreditScore;

    function handleSaveAnalysis() {
        const payload = {
            ...progress,
            analysis: {
                ...(progress.analysis || {}),
                form,
                aiExtract,
                nameDiscrepancy: !!nameDiscrepancy,
            },
            lastUpdatedAt: Date.now(),
        };
        setProgress(payload);
        setLastSavedAt(payload.lastUpdatedAt);
        setStatusMsg('Analysis saved');
        setTimeout(() => setStatusMsg(''), 2000);
    }

    function completeAnalysis() {
        handleSaveAnalysis();
        setStatusMsg('Document analysis completed');
        setTimeout(() => setStatusMsg(''), 2500);
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.h1}>Full Document Analysis</h1>
            <p style={styles.subtle}>AI-assisted analysis with editable Ontario Rental Application fields.</p>

            {/* Name discrepancy warnings */}
            {nameDiscrepancy && (
                <div style={styles.warnBox}>
                    <div><strong>Name discrepancy detected between documents</strong></div>
                    <div>Please verify name consistency across all documents (ID, credit report AKA, and application form).</div>
                </div>
            )}

            {/* Roles credit and net income */}
            <section style={styles.card}>
                <h2 style={styles.h2}>Applicant</h2>
                <div style={styles.roleRow}>
                    <div style={styles.roleCol}>
                        <div><strong>Net income:</strong> ${Number(aiExtract.netIncomeApplicant || 0).toLocaleString()}</div>
                        <div><strong>Credit score:</strong> {aiExtract.applicantCreditScore ?? 'Unknown'} ({scoreBand(aiExtract.applicantCreditScore)})</div>
                    </div>
                    <div style={styles.roleCol}>
                        <strong>Recommendations:</strong>
                        <ul style={styles.list}>
                            {scoreRecommendations(aiExtract.applicantCreditScore).map((r, i) => <li key={`a-rec-${i}`}>• {r}</li>)}
                        </ul>
                    </div>
                </div>
            </section>

            <section style={styles.card}>
                <h2 style={styles.h2}>Occupant</h2>
                <div style={styles.roleRow}>
                    <div style={styles.roleCol}>
                        <div><strong>Net income:</strong> ${Number(aiExtract.netIncomeOccupant || 0).toLocaleString()}</div>
                        <div><strong>Credit score:</strong> {aiExtract.occupantCreditScore ?? 'Unknown'} ({scoreBand(aiExtract.occupantCreditScore)})</div>
                    </div>
                    <div style={styles.roleCol}>
                        <strong>Recommendations:</strong>
                        <ul style={styles.list}>
                            {scoreRecommendations(aiExtract.occupantCreditScore).map((r, i) => <li key={`o-rec-${i}`}>• {r}</li>)}
                        </ul>
                    </div>
                </div>
                {occupantStronger && (
                    <div style={styles.switchBox}>
                        <div>Occupant appears stronger than Applicant. Consider switching roles to strengthen application.</div>
                    </div>
                )}
            </section>

            <section style={styles.card}>
                <h2 style={styles.h2}>Guarantor</h2>
                <div style={styles.roleRow}>
                    <div style={styles.roleCol}>
                        <div><strong>Net income:</strong> ${Number(aiExtract.netIncomeGuarantor || 0).toLocaleString()}</div>
                        <div><strong>Credit score:</strong> {aiExtract.guarantorCreditScore ?? 'Unknown'} ({scoreBand(aiExtract.guarantorCreditScore)})</div>
                    </div>
                    <div style={styles.roleCol}>
                        <strong>Recommendations:</strong>
                        <ul style={styles.list}>
                            {scoreRecommendations(aiExtract.guarantorCreditScore).map((r, i) => <li key={`g-rec-${i}`}>• {r}</li>)}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Ontario Rental Application subset */}
            <section style={styles.card}>
                <h2 style={styles.h2}>Ontario Rental Application (auto-filled)</h2>
                <div style={styles.grid2}>
                    <input
                        placeholder="Applicant First Name"
                        value={form.applicantFirstName}
                        onChange={(e) => updateForm('applicantFirstName', e.target.value)}
                    />
                    <input
                        placeholder="Applicant Last Name"
                        value={form.applicantLastName}
                        onChange={(e) => updateForm('applicantLastName', e.target.value)}
                    />
                    <input
                        placeholder="Applicant Phone"
                        value={form.applicantPhone}
                        onChange={(e) => updateForm('applicantPhone', e.target.value)}
                    />
                    <input
                        placeholder="Applicant Email"
                        value={form.applicantEmail}
                        onChange={(e) => updateForm('applicantEmail', e.target.value)}
                    />
                    <input
                        placeholder="Current Address"
                        value={form.currentAddress}
                        onChange={(e) => updateForm('currentAddress', e.target.value)}
                    />
                    <input
                        placeholder="Preferred Move-In Date (YYYY-MM-DD)"
                        value={form.preferredMoveInDate}
                        onChange={(e) => updateForm('preferredMoveInDate', e.target.value)}
                    />
                    <input
                        placeholder="Monthly Income"
                        type="number"
                        value={form.monthlyIncome}
                        onChange={(e) => updateForm('monthlyIncome', Number(e.target.value || 0))}
                    />
                    <input
                        placeholder="Number of Occupants"
                        type="number"
                        value={form.occupantsCount}
                        onChange={(e) => updateForm('occupantsCount', Number(e.target.value || 0))}
                    />
                    <label style={styles.checkboxRow}>
                        <input
                            type="checkbox"
                            checked={!!form.guarantorPresent}
                            onChange={(e) => updateForm('guarantorPresent', e.target.checked)}
                        />
                        Guarantor present
                    </label>
                </div>
            </section>

            {/* Summary & risk */}
            <section style={styles.card}>
                <h2 style={styles.h2}>Summary & Risk</h2>
                <p><strong>Estimated rent range:</strong> ${affordability.min} - ${affordability.max} (30–40% income rule)</p>
                <p><strong>Risk of rejection:</strong> {overallRisk}</p>
                <p style={styles.subtle}>
                    To strengthen application: increase deposit, add guarantor, and confirm document acceptance with landlord prior to viewing.
                </p>
            </section>

            {/* Actions */}
            {statusMsg && <div style={styles.status}>{statusMsg}</div>}
            <div style={styles.actionsRow}>
                <button style={styles.secondary} onClick={() => navigate('/client')}>Back to First Page</button>
                <button style={styles.secondary} onClick={() => navigate('/agent')}>Back to Agent Page</button>
                <button style={styles.primary} onClick={handleSaveAnalysis}>Save Analysis</button>
                <button style={styles.success} onClick={completeAnalysis}>Complete Document Analysis</button>
            </div>

            <div style={styles.lastRow}>
                <span style={styles.lastSaved}>Last saved: {lastSavedAt ? new Date(lastSavedAt).toLocaleString() : 'Never'}</span>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: 1000, margin: '20px auto', padding: 16, background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb' },
    h1: { fontSize: 22, marginBottom: 8 },
    h2: { fontSize: 18, marginBottom: 8 },
    subtle: { fontSize: 13, color: '#6b7280', marginBottom: 10 },
    card: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 16 },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
    list: { marginTop: 6, paddingLeft: 18 },
    roleRow: { display: 'flex', gap: 20, flexWrap: 'wrap' },
    roleCol: { flex: '1 1 320px' },
    warnBox: { padding: 10, borderRadius: 8, background: '#fff7ed', color: '#9a3412', border: '1px solid #fdba74', marginBottom: 12, fontSize: 13 },
    switchBox: { marginTop: 8, fontSize: 13, color: '#334155' },
    status: { marginTop: 8, padding: 8, background: '#ecfdf5', border: '1px solid #10b981', borderRadius: 6, color: '#065f46' },
    actionsRow: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 },
    lastRow: { display: 'flex', justifyContent: 'flex-end', marginTop: 10 },
    lastSaved: { fontSize: 12, color: '#6b7280' },
    primary: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 14px', cursor: 'pointer' },
    success: { background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 14px', cursor: 'pointer' },
    secondary: { background: '#f3f4f6', color: '#111827', border: '1px solid #d1d5db', borderRadius: 6, padding: '10px 14px', cursor: 'pointer' },
    checkboxRow: { display: 'flex', alignItems: 'center', gap: 8 },
};