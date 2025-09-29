import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';

export default function ApplicationSummary() {
    const navigate = useNavigate();
    const { progress } = useProgress();

    const [summary, setSummary] = useState({
        totalNetIncome: 0,
        affordability: { min: 0, max: 0 },
        risk: 'Unknown',
        recommendations: [],
        lastUpdatedAt: null,
    });

    useEffect(() => {
        if (progress?.roles) {
            const applicant = progress.roles.applicant || {};
            const occupant = progress.roles.occupant || {};
            const guarantor = progress.roles.guarantor || {};

            const totalNetIncome =
                (applicant.netIncome || 0) +
                (occupant.netIncome || 0) +
                (guarantor.netIncome || 0);

            const affordability = computeAffordability(totalNetIncome);
            const risk = computeOverallRisk([
                applicant.creditScore,
                occupant.creditScore,
                guarantor.creditScore,
            ]);
            const recommendations = collectRecommendations([
                applicant.creditScore,
                occupant.creditScore,
                guarantor.creditScore,
            ]);

            setSummary({
                totalNetIncome,
                affordability,
                risk,
                recommendations,
                lastUpdatedAt: progress.lastUpdatedAt || null,
            });
        }
    }, [progress]);

    function computeAffordability(income) {
        if (!income || income <= 0) return { min: 0, max: 0 };
        const min = Math.round((income * 0.3) / 10) * 10;
        const max = Math.round((income * 0.4) / 10) * 10;
        return { min, max };
    }

    function computeOverallRisk(scores) {
        const validScores = scores.filter((s) => typeof s === 'number');
        if (!validScores.length) return 'Unknown';
        if (validScores.some((s) => s < 680)) return 'High';
        if (validScores.some((s) => s < 700)) return 'Medium';
        return 'Low';
    }

    function collectRecommendations(scores) {
        const recs = new Set();
        scores.forEach((score) => {
            if (score == null) return;
            if (score >= 700) {
                recs.add('Strong application');
            } else if (score >= 680) {
                recs.add('Consider increasing deposit from 2 to 4–6 months');
                recs.add('Recommend adding Guarantor to strengthen application');
                recs.add('Advise checking with landlord about document acceptance before viewing');
            } else {
                recs.add('HIGH probability of rejection');
                recs.add('STRONGLY recommend: Increase deposit + Add Guarantor + Consult landlord before viewing');
            }
        });
        return Array.from(recs);
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.h1}>Application Summary</h1>

            <section style={styles.card}>
                <h2 style={styles.h2}>Affordability</h2>
                <p>
                    Estimated affordable rent: ${summary.affordability.min} – ${summary.affordability.max} (30–40% income rule)
                </p>
            </section>

            <section style={styles.card}>
                <h2 style={styles.h2}>Risk of Rejection</h2>
                <p>{summary.risk}</p>
            </section>

            <section style={styles.card}>
                <h2 style={styles.h2}>Recommendations</h2>
                {summary.recommendations.length ? (
                    <ul>
                        {summary.recommendations.map((r, i) => (
                            <li key={i}>{r}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No recommendations available.</p>
                )}
            </section>

            <section style={styles.card}>
                <h2 style={styles.h2}>Last Update</h2>
                <p>{summary.lastUpdatedAt ? new Date(summary.lastUpdatedAt).toLocaleString() : 'Never'}</p>
            </section>

            <div style={styles.actionsRow}>
                <button style={styles.secondary} onClick={() => navigate('/agent')}>
                    Back to Agent Page
                </button>
                <button style={styles.secondary} onClick={() => navigate('/client')}>
                    Back to Client Page
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: 900, margin: '20px auto', padding: 16, background: '#fff' },
    h1: { fontSize: 24, marginBottom: 16 },
    h2: { fontSize: 18, marginBottom: 8 },
    card: { border: '1px solid #ddd', borderRadius: 6, padding: 12, marginBottom: 16 },
    actionsRow: { display: 'flex', gap: 12, marginTop: 16 },
    secondary: { background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: 6, padding: '8px 12px' },
};