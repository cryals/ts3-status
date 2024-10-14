const serverAddress = "ts.stopco.ru"; // Используем URL сервера
const statusDiv = document.getElementById('status');
const notificationButton = document.getElementById('notification-button');
const favicon = document.getElementById('favicon'); // Получаем элемент фавиконки

// Функция для получения статуса сервера
async function fetchServerStatus() {
    try {
        favicon.href = "media/blue.ico"; // Изменяем фавиконку на "Загрузка"
        const response = await fetch(`https://api.cleanvoice.ru/ts3/?address=${serverAddress}`);
        const data = await response.json();
        updateStatus(data);
    } catch (error) {
        console.error('Ошибка при получении статуса сервера:', error);
        statusDiv.innerText = "Ошибка при получении статуса.";
        favicon.href = "media/red.ico"; // Если ошибка, устанавливаем "Офлайн"
    }
}

// Функция для обновления статуса на странице
function updateStatus(data) {
    if (data.can_connect) {
        statusDiv.innerText = "Сервер онлайн!";
        console.log("Отправка уведомления о том, что сервер онлайн."); // Лог
        sendNotification("Сервер TeamSpeak онлайн!");
        favicon.href = "media/green.ico"; // Устанавливаем фавиконку "Онлайн"
    } else {
        statusDiv.innerText = "Сервер офлайн.";
        console.log("Сервер офлайн."); // Лог
        favicon.href = "media/red.ico"; // Устанавливаем фавиконку "Офлайн"
    }
}

// Функция для отправки уведомления
function sendNotification(message) {
    if (Notification.permission === "granted") {
        new Notification(message);
    } else if (Notification.permission !== "denied") {
        // Если разрешение ещё не запрашивалось, отправляем запрос
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(message);
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

// Проверяем статус сервера каждые 30 секунд
setInterval(fetchServerStatus, 30000);
fetchServerStatus(); // Первоначальный запрос статуса
