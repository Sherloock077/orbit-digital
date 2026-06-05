/**
 * Сервис для отправки данных формы через Make.com webhook
 */

export const sendWhatsAppViaMakeWebhook = async (formData) => {
  // Используем жестко заданный webhook URL (по запросу пользователя).
  // При желании можно вернуть использование переменной окружения: import.meta.env.VITE_MAKE_WEBHOOK_URL
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

export const sendFormData = async (formData) => {
  try {
    if (!formData.name || !formData.email || !formData.message) {
      throw new Error('Заполните обязательные поля: имя, email и сообщение');
    }

    await sendWhatsAppViaMakeWebhook(formData);
    console.log('✅ Form data sent via Make webhook');
    return { success: true };
  } catch (error) {
    if (error.message.includes('VITE_MAKE_WEBHOOK_URL')) {
      console.error('❌ Webhook URL not found. Please set VITE_MAKE_WEBHOOK_URL in .env.local');
    } else {
      console.error('❌ Error sending form data:', error.message);
    }

    return { success: false, error: error.message };
  }
};
