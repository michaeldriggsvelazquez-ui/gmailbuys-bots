// =====================================================
// HELPERS PARA LA API DE TELEGRAM
// =====================================================

const API_BASE = "https://api.telegram.org";

// ============ ENVIAR MENSAJE DE TEXTO ============
export async function enviarMensaje(token, chatId, texto, opciones = {}) {
  const payload = {
    chat_id: chatId,
    text: texto,
    parse_mode: "Markdown",
    ...opciones,
  };
  const res = await fetch(`${API_BASE}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

// ============ ENVIAR FOTO ============
export async function enviarFoto(token, chatId, photo, opciones = {}) {
  const payload = {
    chat_id: chatId,
    photo,
    parse_mode: "Markdown",
    ...opciones,
  };
  const res = await fetch(`${API_BASE}/bot${token}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

// ============ EDITAR MENSAJE ============
export async function editarMensaje(token, chatId, messageId, texto, opciones = {}) {
  const payload = {
    chat_id: chatId,
    message_id: messageId,
    text: texto,
    parse_mode: "Markdown",
    ...opciones,
  };
  const res = await fetch(`${API_BASE}/bot${token}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

// ============ RESPONDER CALLBACK QUERY ============
export async function responderCallback(token, callbackQueryId, texto = null) {
  const payload = { callback_query_id: callbackQueryId };
  if (texto) payload.text = texto;
  const res = await fetch(`${API_BASE}/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

// ============ ELIMINAR MENSAJE ============
export async function eliminarMensaje(token, chatId, messageId) {
  const res = await fetch(`${API_BASE}/bot${token}/deleteMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
  });
  return await res.json();
}

// ============ CONFIGURAR WEBHOOK ============
export async function setWebhook(token, url) {
  const res = await fetch(`${API_BASE}/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, drop_pending_updates: true }),
  });
  return await res.json();
}

// ============ INFO DEL BOT ============
export async function getMe(token) {
  const res = await fetch(`${API_BASE}/bot${token}/getMe`);
  return await res.json();
    }
