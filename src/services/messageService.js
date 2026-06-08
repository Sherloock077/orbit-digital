/**
 * Сервис для отправки данных формы через Make.com webhook
 * Теперь этот вебхук принимает данные и сам отправляет их в WhatsApp и Telegram
 */
export const sendFormToMakeWebhook = async (formData) => {
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
 * Главная функция отправки формы, которую ты вызываешь при сабмите
 */
export const sendFormData = async (formData) => {
  try {
    if (!formData.name || !formData.email || !formData.message) {
      throw new Error('Заполните обязательные поля: имя, email и сообщение');
    }

    // Отправляем данные на один единый вебхук Make
    await sendFormToMakeWebhook(formData);
    console.log('✅ Данные успешно переданы в Make.com');

    return { success: true };
  } catch (error) {
    console.error('❌ Ошибка при отправке формы:', error.message);
    return { success: false, error: error.message };
  }
};