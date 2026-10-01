<?php
// Указываем кодировку
header('Content-Type: text/html; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "joy.life86@mail.ru";

    // Получаем и очищаем данные из формы
    $name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
    $phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
    $email = isset($_POST['email']) ? strip_tags(trim($_POST['email'])) : '';
    $message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

    // Проверяем обязательные поля
    if (empty($name) || empty($phone)) {
        http_response_code(400);
        echo "Пожалуйста, заполните обязательные поля (имя и телефон).";
        exit;
    }

    $subject = "Новая заявка с сайта KZTB";

    // Тело письма
    $email_content = "Вам поступила новая заявка с сайта:\n\n";
    $email_content .= "Имя: $name\n";
    $email_content .= "Телефон: $phone\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Сообщение: $message\n";

    // Заголовки письма
    $headers = "From: noreply@ecoblocki.ru\r\n";
    if (!empty($email)) {
        $headers .= "Reply-To: $email\r\n";
    }
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Отправка
    if (mail($to, $subject, $email_content, $headers)) {
        http_response_code(200);
        echo "Спасибо! Ваша заявка успешно отправлена.";
    } else {
        http_response_code(500);
        echo "Ошибка сервера при отправке сообщения.";
    }
} else {
    http_response_code(403);
    echo "Доступ запрещен.";
}
?>