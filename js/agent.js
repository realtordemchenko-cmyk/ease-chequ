// D:\Projects\Ease Chequ\js\agent.js

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('[data-action]');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const action = button.getAttribute('data-action');
            console.log(`Кнопка нажата: ${action}`);

            fetch('/api/agent-action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            })
                .then(res => res.json())
                .then(data => {
                    console.log('Ответ от сервера:', data);
                    alert(`Действие "${action}" выполнено`);
                })
                .catch(err => {
                    console.error('Ошибка запроса:', err);
                    alert('Ошибка при выполнении действия');
                });
        });
    });
});