/**
 * Сервис для отправки данных формы через Telegram Bot API
 */
const sendTelegramNotification = async (formData) => {
  const BOT_TOKEN = "8687827459:AAE7S3fzZQNluADKYsSU3ulJz2HHTozgfh0";
  const CHAT_ID = "8943585403";
  
  // Формируем красивый текст для Telegram с поддержкой Markdown
  const message = `⚡️ **Новая заявка | Orbit Digital** ⚡️\n\n` +
                  `👤 **Имя:** ${formData.name}\n` +
                  `📞 **Телефон:** ${formData.phone || 'Не указан'}\n` +
                  `📧 **Email:** ${formData.email}\n` +
                  `📝 **Сообщение:** ${formData.message}`;

  const tgUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(tgUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      console.error('❌ Ошибка отправки в Telegram:', response.statusText);
    }
  } catch (tgError) {
    console.error('❌ Сбой сети при отправке в Telegram:', tgError.message);
  }
};

/**
 * Сервис для отправки данных формы через Make.com webhook
 */
export const sendWhatsAppViaMakeWebhook = async (formData) => {
  const webhookUrl = "https://hook.eu1.make.com/y8tfmjf6b734cbe3533dqokv3j818e9i";

  const payload = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    message: formData.message,
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Make webhook responded with ${response.status}: ${errorText}`);
  }

  return true;
};

/**
 * Главная функция отправки формы
 */
export const sendFormData = async (formData) => {
  try {
    if (!formData.name || !formData.email || !formData.message) {
      throw new Error('Заполните обязательные поля: имя, email и сообщение');
    }

    // 1. Отправляем в Make.com для WhatsApp
    await sendWhatsAppViaMakeWebhook(formData);
    console.log('✅ Form data sent via Make webhook');

    // 2. Параллельно отправляем дубликат в Telegram
    await sendTelegramNotification(formData);
    console.log('✅ Notification sent to Telegram');

    return { success: true };
  } catch (error) {
    // Если упал вебхук Make, всё равно пробуем отправить в Телегу, чтобы лид не потерялся
    console.error('❌ Ошибка основной отправки:', error.message);
    
    try {
      await sendTelegramNotification(formData);
    } catch (e) {
      console.error('❌ Не удалось отправить даже резервное уведомление в Telegram');
    }

    return { success: false, error: error.message };
  }
};