const serverAddress = "ts.stopco.ru"; // Используем URL сервера
const statusDiv = document.getElementById('status');
const notificationButton = document.getElementById('notification-button');
const favicon = document.getElementById('favicon'); // Фавиконка

// Функция для получения статуса сервера
async function fetchServerStatus() {
    favicon.href = "media/blue.ico"; // Фавиконка "загрузка"
    document.body.classList.add('status-loading');
    document.body.classList.remove('status-online', 'status-offline');
    
    try {
        const response = await fetch(`https://api.cleanvoice.ru/ts3/?address=${serverAddress}`);
        const data = await response.json();
        updateStatus(data);
    } catch (error) {
        console.error('Ошибка при получении статуса сервера:', error);
        statusDiv.innerText = "Ошибка при получении статуса.";
        favicon.href = "media/red.ico"; // Фавиконка "оффлайн"
        document.body.classList.add('status-offline');
    }
}

// Обновление статуса на странице
function updateStatus(data) {
    if (data.can_connect) {
        statusDiv.innerText = "Сервер онлайн!";
        favicon.href = "media/green.ico"; // Фавиконка "онлайн"
        document.body.classList.add('status-online');
        sendNotification("Сервер TeamSpeak онлайн!");
    } else {
        statusDiv.innerText = "Сервер офлайн.";
        favicon.href = "media/red.ico"; // Фавиконка "оффлайн"
        document.body.classList.add('status-offline');
    }
}

// Функция отправки уведомлений
function sendNotification(message) {
    if (Notification.permission === "granted") {
        const notification = new Notification(message, { icon: 'media/green.ico' });
        notification.classList.add('notify-popup');
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                const notification = new Notification(message, { icon: 'media/green.ico' });
                notification.classList.add('notify-popup');
            }
        });
    }
}

// Запрашиваем разрешение на уведомления
notificationButton.addEventListener('click', () => {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            alert("Разрешение на уведомления получено!");
        } else {
            alert("Разрешение на уведомления отклонено.");
        }
    });
});

// Периодическая проверка статуса
setInterval(fetchServerStatus, 30000);
fetchServerStatus(); // Первый запуск
