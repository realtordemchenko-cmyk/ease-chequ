import React from 'react';

export default function DocumentTypeSelector({ role, value, onChange }) {
    return (
        <div style={styles.container}>
            <label style={styles.label}>
                {role} Document Type:
                <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.select}>
                    <option value="">-- Select --</option>
                    <option value="employee">Employee</option>
                    <option value="self">Self-Employed</option>
                    <option value="both">Both</option>
                </select>
            </label>

            {value === 'employee' && (
                <ul style={styles.list}>
                    <li>✓ Employment Letter</li>
                    <li>✓ Paystubs (multiple)</li>
                    <li>✓ Photo ID</li>
                    <li>✓ Credit Report (Equifax PDF)</li>
                </ul>
            )}
            {value === 'self' && (
                <ul style={styles.list}>
                    <li>✓ Bank Statements</li>
                    <li>✓ Photo ID</li>
                    <li>✓ NOA (Notice of Assessment)</li>
                    <li>✓ Credit Report (Equifax PDF)</li>
                </ul>
            )}
            {value === 'both' && (
                <ul style={styles.list}>
                    <li>✓ Employment Letter</li>
                    <li>✓ Paystubs (multiple)</li>
                    <li>✓ Bank Statements</li>
                    <li>✓ Photo ID</li>
                    <li>✓ NOA (Notice of Assessment)</li>
                    <li>✓ Credit Report (Equifax PDF)</li>
                </ul>
            )}
        </div>
    );
}

const styles = {
    container: { marginTop: 8, marginBottom: 12 },
    label: { display: 'block', marginBottom: 6, fontWeight: 600 },
    select: { padding: 6, borderRadius: 4, border: '1px solid #ccc' },
    list: { marginTop: 6, paddingLeft: 18, fontSize: 14 },
};