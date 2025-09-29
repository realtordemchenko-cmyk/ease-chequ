import React from 'react';
import { useNavigate } from 'react-router-dom';
import ClientPage1 from '../../../client/src/client/ClientPage1';

/**
 * AgentClientIntake
 * Полная копия первой страницы клиента (ClientPage1),
 * дополненная кнопкой "Back to Agent Page".
 */
export default function AgentClientIntake() {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            {/* Кнопка возврата к агенту */}
            <div style={styles.topBar}>
                <button style={styles.backBtn} onClick={() => navigate('/agent')}>
                    ← Back to Agent Page
                </button>
            </div>

            {/* Встраиваем клиентскую страницу */}
            <ClientPage1 />
        </div>
    );
}

const styles = {
    container: { maxWidth: 1100, margin: '0 auto', padding: 16 },
    topBar: { marginBottom: 12 },
    backBtn: {
        background: '#f3f4f6',
        border: '1px solid #d1d5db',
        borderRadius: 6,
        padding: '8px 12px',
        cursor: 'pointer',
    },
};