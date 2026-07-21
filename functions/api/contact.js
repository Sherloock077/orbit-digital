// Cloudflare Pages Function — принимает заявку с формы:
// 1) проверяет токен Cloudflare Turnstile (антиспам),
// 2) пересылает данные в Make-вебхук (URL хранится в секрете на сервере).
//
// Переменные окружения (Cloudflare Pages → Settings → Environment variables):
//   TURNSTILE_SECRET  — секретный ключ Turnstile
//   MAKE_WEBHOOK_URL  — https://hook.eu1.make.com/xxxxxxxx

export async function onRequestPost(context) {
  const { request, env } = context;

  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: 'bad_request' }, 400);
  }

  const { name, email, phone, message, token } = body || {};

  // --- 1. Проверка Turnstile ---
  if (!env.TURNSTILE_SECRET) {
    return json({ success: false, error: 'server_misconfigured' }, 500);
  }
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET);
  form.append('response', token || '');
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) form.append('remoteip', ip);

  try {
    const verifyRes = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body: form },
    );
    const outcome = await verifyRes.json();
    if (!outcome.success) {
      return json({ success: false, error: 'captcha_failed', codes: outcome['error-codes'], build: 2 }, 400);
    }
  } catch {
    return json({ success: false, error: 'captcha_error' }, 502);
  }

  // --- 2. Пересылка в Make ---
  if (!env.MAKE_WEBHOOK_URL) {
    return json({ success: false, error: 'server_misconfigured' }, 500);
  }
  try {
    const res = await fetch(env.MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, message }),
    });
    if (!res.ok) {
      return json({ success: false, error: 'webhook_failed' }, 502);
    }
  } catch {
    return json({ success: false, error: 'webhook_error' }, 502);
  }

  return json({ success: true });
}
