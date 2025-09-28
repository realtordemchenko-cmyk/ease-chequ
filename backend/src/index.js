// D:\Projects\Ease Chequ\backend\src\index.js

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 🔐 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🌐 Статические файлы из корня проекта
app.use(express.static(path.join(__dirname, '../../')));

// 🧠 Маршрут для действий агента
app.post('/api/agent-action', (req, res) => {
    const { action } = req.body;

    console.log(`Получено действие агента: ${action}`);

    // Пример обработки действия
    switch (action) {
        case 'submit':
            return res.json({ status: 'успешно', message: 'Данные агента приняты' });
        case 'verify':
            return res.json({ status: 'успешно', message: 'Документы агента проверены' });
        default:
            return res.status(400).json({ status: 'ошибка', message: 'Неизвестное действие' });
    }
});

// 🟢 Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});