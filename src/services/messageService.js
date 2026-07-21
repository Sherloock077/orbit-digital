/**
 * Отправка формы через собственную серверную функцию Cloudflare (/api/contact),
 * которая проверяет капчу Turnstile и пересылает данные в Make.
 * Вебхук Make на клиенте больше не светится.
 */
export const sendFormData = async (formData) => {
  try {
    if (!formData.name || !formData.email || !formData.message) {
      throw new Error('Заполните обязательные поля: имя, email и сообщение');
    }

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        token: formData.token, // токен Cloudflare Turnstile
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('❌ Ошибка при отправке формы:', error.message);
    return { success: false, error: error.message };
  }
};
