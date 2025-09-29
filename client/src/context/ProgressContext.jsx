// client/src/context/ProgressContext.jsx
// Финальная версия: единый participants + buckets для обратной совместимости

import React, { createContext, useContext, useState } from 'react';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
    const [progress, setProgress] = useState({
        page1: {
            participants: [
                {
                    firstName: '',
                    lastName: '',
                    phone: '',
                    email: '',
                    relation: '',
                    role: 'applicant',
                },
            ],
            applicants: [],
            occupants: [],
            guarantors: [],
        },
        checkInDate: '',
        lastUpdatedAt: null,
        meta: {
            counts: {
                applicants: 0,
                occupants: 0,
                guarantors: 0,
                validApplicants: 0,
            },
        },
    });

    return (
        <ProgressContext.Provider value={{ progress, setProgress }}>
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgress() {
    return useContext(ProgressContext);
}