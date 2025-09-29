import React from 'react';

export default function FinancialAnalysis({ applicant, occupant, guarantor, onSwitchRoles }) {
    function riskLevel(score) {
        if (score == null) return 'Unknown';
        if (score >= 700) return 'Low';
        if (score >= 680) return 'Medium';
        return 'High';
    }

    function recommendations(score) {
        if (score == null) return ['No credit score available'];
        if (score >= 700) return ['Strong application'];
        if (score >= 680) {
            return [
                'Consider increasing deposit from 2 to 4–6 months',
                'Recommend adding Guarantor to strengthen application',
                'Advise checking with landlord about document acceptance before viewing',
            ];
        }
        return [
            'HIGH probability of rejection',
            'STRONGLY recommend: Increase deposit + Add Guarantor + Consult landlord before viewing',
        ];
    }

    function colorForScore(score) {
        if (score == null) return '#6b7280';
        if (score >= 700) return '#10b981'; // green
        if (score >= 680) return '#f59e0b'; // amber
        return '#ef4444'; // red
    }

    const switchable =
        occupant?.creditScore != null &&
        applicant?.creditScore != null &&
        occupant.creditScore > applicant.creditScore;

    return (
        <div style={styles.container}>
            <h2 style={styles.h2}>Financial Analysis</h2>

            <div style={styles.grid}>
                <RoleCard title="Applicant" role={applicant} recommendations={recommendations(applicant?.creditScore)} />
                <RoleCard title="Occupant" role={occupant} recommendations={recommendations(occupant?.creditScore)} />
                <RoleCard title="Guarantor" role={guarantor} recommendations={recommendations(guarantor?.creditScore)} />
            </div>

            {switchable && (
                <div style={styles.switchBox}>
                    <p>
                        Occupant has a stronger credit score than Applicant.
                        Recommend switching roles for stronger application.
                    </p>
                    <button style={styles.primary} onClick={onSwitchRoles}>
                        Switch Roles
                    </button>
                </div>
            )}
        </div>
    );
}

function RoleCard({ title, role, recommendations }) {
    return (
        <div style={styles.card}>
            <h3 style={styles.h3}>{title}</h3>
            <p>Net Income: {role?.netIncome != null ? `$${role.netIncome}` : '—'}</p>
            <p style={{ color: role?.creditScore ? colorForScore(role.creditScore) : '#6b7280' }}>
                Credit Score: {role?.creditScore ?? '—'}
            </p>
            <p>Risk: {role?.creditScore != null ? riskLevel(role.creditScore) : 'Unknown'}</p>
            <h4 style={styles.h4}>Recommendations:</h4>
            <ul>
                {recommendations.map((r, i) => (
                    <li key={i}>{r}</li>
                ))}
            </ul>
        </div>
    );
}

// Helpers
function riskLevel(score) {
    if (score == null) return 'Unknown';
    if (score >= 700) return 'Low';
    if (score >= 680) return 'Medium';
    return 'High';
}
function colorForScore(score) {
    if (score == null) return '#6b7280';
    if (score >= 700) return '#10b981';
    if (score >= 680) return '#f59e0b';
    return '#ef4444';
}

const styles = {
    container: { marginTop: 20 },
    h2: { fontSize: 20, marginBottom: 12 },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 },
    card: { border: '1px solid #ddd', borderRadius: 6, padding: 12, background: '#fafafa' },
    h3: { margin: '0 0 8px 0' },
    h4: { margin: '8px 0 4px 0' },
    switchBox: { marginTop: 16, padding: 12, border: '1px solid #f59e0b', borderRadius: 6, background: '#fff7ed' },
    primary: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer' },
};