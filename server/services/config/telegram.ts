// D:\Projects\Ease Chequ\server\config\telegram.ts
// Конфигурация Telegram-бота для уведомлений

export const TELEGRAM_CONFIG = {
    botToken: process.env.TELEGRAM_BOT_TOKEN || "<PUT_YOUR_BOT_TOKEN_HERE>",
    adminUser: {
        id: 323988733,
        username: "RealtorDemchenko",
        name: "Alexp",
        language: "English"
    }
};