// D:\Projects\Ease Chequ\client\src\main.tsx
// Финальная версия: точка входа React, монтирует App в #root из index.html

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Ищем корневой контейнер в index.html
const rootElement = document.getElementById('root');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error('❌ Root element not found in index.html');
}