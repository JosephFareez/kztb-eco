<?php
// Указываем кодировку
header('Content-Type: text/html; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // ВАШ E-MAIL ДЛЯ ЗАЯВОК
    $to = "kztbt@mail.ru";

    // Получаем и очищаем базовые данные из формы
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

    // Проверяем, пришла ли заявка из Калькулятора (по наличию поля ITOGO)
    $isCalculator = isset($_POST['ITOGO']);

    // Меняем тему письма в зависимости от формы
    $subject = $isCalculator ? "Новый расчет с калькулятора KZTB" : "Новая заявка с сайта KZTB";

    // Формируем базовое тело письма
    $email_content = "Вам поступила новая заявка с сайта:\n\n";
    $email_content .= "Имя: $name\n";
    $email_content .= "Телефон: $phone\n";
    if (!empty($email)) {
        $email_content .= "Email: $email\n";
    }
    if (!empty($message) && !$isCalculator) {
        $email_content .= "Сообщение: $message\n";
    }

    // Если это заявка с Калькулятора, добавляем все расчеты!
    if ($isCalculator) {
        $email_content .= "\n====================================\n";
        $email_content .= "ДАННЫЕ РАСЧЕТА (КАЛЬКУЛЯТОР):\n";
        $email_content .= "====================================\n";
        $email_content .= "Толщина блока: ТБ-" . ($_POST['Block_type'] ?? '400') . " мм\n";
        $email_content .= "Площадь стен дома: " . ($_POST['PZVOD_total'] ?? '0') . " м²\n";
        $email_content .= "Общее количество блоков: " . ($_POST['Itogo_kolichestvo_blokov'] ?? '0') . " шт.\n";
        $email_content .= "Объем блоков: " . ($_POST['Obiem_blokov'] ?? '0') . " м³\n";
        $email_content .= "Количество поддонов: " . ($_POST['Poddoni_i_upakovka'] ?? '0') . " шт.\n";

        $trucks = $_POST['Dostavka_fura'] ?? 0;
        if ($trucks > 0) {
            $email_content .= "\n--- ДОСТАВКА ---\n";
            $email_content .= "Необходимо фур: " . $trucks . " шт.\n";
            $email_content .= "Расстояние от завода: " . ($_POST['Delivery_km'] ?? '0') . " км\n";
            $email_content .= "Адрес объекта: " . ($_POST['Delivery_address'] ?? 'Не указан') . "\n";
        } else {
            $email_content .= "\n--- ДОСТАВКА ---\n";
            $email_content .= "Самовывоз\n";
        }

        $email_content .= "\n--- СТОИМОСТЬ ---\n";
        $email_content .= "Блоки + Упаковка: " . ($_POST['Itogo_stoimost_materialov'] ?? '0') . " руб.\n";
        $email_content .= "ИТОГО ПО СМЕТЕ (Дом + Блоки + Доставка): " . ($_POST['ITOGO'] ?? '0') . " руб.\n";
    }

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