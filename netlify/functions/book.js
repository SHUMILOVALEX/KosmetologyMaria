// Принимает заявку с формы онлайн-записи и пересылает её мастеру в Telegram.
// Нужны переменные окружения TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID (настраиваются в Netlify).

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  if (!data.name || !data.phone) {
    return { statusCode: 400, body: 'Missing name or phone' };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { statusCode: 500, body: 'Server not configured' };
  }

  const text = [
    '📅 Новая заявка на запись',
    `Услуга: ${data.serviceLabel || '—'}`,
    `Дата: ${data.date || '—'}`,
    `Время: ${data.time || '—'}`,
    `Имя: ${data.name}`,
    `Телефон: ${data.phone}`,
    `Дата рождения: ${data.birthdate || '—'}`,
    `Проблема: ${Array.isArray(data.problems) && data.problems.length ? data.problems.join(', ') : '—'}`,
  ].join('\n');

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!res.ok) {
    return { statusCode: 502, body: 'Telegram delivery failed' };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
