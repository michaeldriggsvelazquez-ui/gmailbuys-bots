// =====================================================
// HANDLER: Sistema de soporte (usuario → admin)
// =====================================================
import { insertarSoporte, marcarSoporteRespondido } from "../db.js";
import { enviarMensaje, enviarFoto } from "../telegram.js";
import { MENU_PRINCIPAL, TECLADO_ATRAS, TECLADO_CANCELAR, inlineResponder } from "../menus.js";
import { ESTADOS } from "../config.js";
import { setEstado, finSesion } from "../session.js";

// ============ PASO 1: Iniciar soporte ============
export async function iniciarSoporte(env, msg, config) {
  const userId = msg.from.id;
  await setEstado(env, userId, ESTADOS.SOPORTE_ESCRIBIENDO, {});
  await enviarMensaje(config.BOT_TOKEN, userId,
    "🆘 *CENTRO DE SOPORTE*\n\n" +
    "✍️ Escribe tu mensaje o envía una foto.\n" +
    "📨 **Se enviará automáticamente al administrador.**\n\n" +
    "🔙 Presiona ATRÁS para salir sin enviar nada.",
    { reply_markup: TECLADO_ATRAS }
  );
}

// ============ PASO 2: Recibir mensaje del usuario ============
export async function recibirSoporte(env, msg, config) {
  const userId = msg.from.id;
  const user = msg.from;
  const username = user.username ? `@${user.username}` : "Sin username";
  const nombre = user.first_name || "Usuario";

  const esFoto = !!(msg.photo && msg.photo.length);
  const textoMensaje = esFoto ? (msg.caption || "[Foto sin texto]") : (msg.text || "");

  // Guardar en BD
  await insertarSoporte(env, userId, textoMensaje, esFoto ? msg.photo[msg.photo.length - 1].file_id : null);

  // Avisar al admin
  const adminMsg =
    `🆘 *NUEVO MENSAJE DE SOPORTE*\n\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `👤 *Usuario:* ${nombre}\n` +
    `📱 *Username:* ${username}\n` +
    `🆔 *ID:* \`${userId}\`\n` +
    `💬 *Mensaje:*\n${textoMensaje}\n` +
    `━━━━━━━━━━━━━━━━━━`;

  try {
    if (esFoto) {
      await enviarFoto(config.BOT_TOKEN, config.ADMIN_ID, msg.photo[msg.photo.length - 1].file_id, {
        caption: adminMsg,
        reply_markup: inlineResponder(userId),
      });
    } else {
      await enviarMensaje(config.BOT_TOKEN, config.ADMIN_ID, adminMsg, {
        reply_markup: inlineResponder(userId),
      });
    }
  } catch (e) { /* ignorar */ }

  await finSesion(env, userId);
  await enviarMensaje(config.BOT_TOKEN, userId,
    "✅ *¡MENSAJE ENVIADO CON ÉXITO!*\n\n" +
    "📨 Tu mensaje ha sido enviado al administrador.\n" +
    "⏳ Recibirás una respuesta a la brevedad posible.\n\n" +
    "✨ ¡Gracias por contactarnos!",
    { reply_markup: MENU_PRINCIPAL }
  );
}

// ============ PASO 3 (admin): Responder al usuario ============
export async function iniciarRespuesta(env, adminId, targetUserId, messageId, config) {
  await setEstado(env, adminId, ESTADOS.RESPUESTA_ESPERA, { targetUserId });
  await enviarMensaje(config.BOT_TOKEN, adminId,
    `📨 *RESPONDER A USUARIO*\n\n` +
    `🆔 ID: \`${targetUserId}\`\n\n` +
    `✍️ Escribe el mensaje que quieres enviarle:`,
    { reply_markup: TECLADO_CANCELAR }
  );
}

// ============ PASO 4 (admin): Enviar respuesta ============
export async function enviarRespuesta(env, msg, config) {
  const adminId = msg.from.id;
  const texto = msg.text || "";

  // Obtener el userId destino desde la sesión
  const { getSesion } = await import("../session.js");
  const sesion = await getSesion(env, adminId);
  const targetUserId = sesion.datos?.targetUserId;

  if (!targetUserId) {
    await finSesion(env, adminId);
    await enviarMensaje(config.BOT_TOKEN, adminId,
      "❌ No hay usuario destino. Vuelve a presionar RESPONDER en un mensaje.",
      { reply_markup: { keyboard: [[{ text: "🔙 VOLVER A MENÚ USUARIO" }]], resize_keyboard: true } }
    );
    return;
  }

  try {
    await enviarMensaje(config.BOT_TOKEN, targetUserId,
      `📨 *RESPUESTA DEL ADMINISTRADOR:*\n\n${texto}\n\n✨ Gracias por contactarnos.`
    );
    await marcarSoporteRespondido(env, targetUserId);

    await finSesion(env, adminId);
    await enviarMensaje(config.BOT_TOKEN, adminId,
      `✅ *¡RESPUESTA ENVIADA!*\n\n📨 Mensaje enviado al usuario \`${targetUserId}\``,
      { reply_markup: { keyboard: [
        [{ text: "📋 PENDIENTES" }, { text: "💸 RETIROS" }],
        [{ text: "⭐ VIP PENDIENTES" }, { text: "📨 MENSAJES" }],
        [{ text: "📊 ESTADÍSTICAS" }, { text: "🔙 VOLVER A MENÚ USUARIO" }],
      ], resize_keyboard: true } }
    );
  } catch (e) {
    await enviarMensaje(config.BOT_TOKEN, adminId,
      `❌ *Error al enviar*\n\n${e.message}`
    );
  }
                      }
