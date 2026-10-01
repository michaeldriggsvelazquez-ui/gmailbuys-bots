// =====================================================
// HANDLER: Flujo de solicitudes de retiro
// =====================================================
import {
  obtenerUsuario,
  obtenerMetodoPago,
  insertarRetiro,
} from "../db.js";
import { enviarMensaje } from "../telegram.js";
import {
  MENU_PRINCIPAL,
  TECLADO_CANCELAR,
  inlineAprobarRechazarRetiro,
} from "../menus.js";
import { MINIMO_RETIRO, ESTADOS } from "../config.js";
import { setEstado, finSesion } from "../session.js";

// ============ PASO 1: Iniciar retiro ============
export async function iniciarRetiro(env, msg, config) {
  const userId = msg.from.id;
  const u = await obtenerUsuario(env, userId);
  const total = (u?.saldo || 0) + (u?.saldo_ref || 0);

  if (total < MINIMO_RETIRO) {
    await enviarMensaje(config.BOT_TOKEN, userId,
      `❌ *No puedes retirar*\n\n` +
      `💰 Tu saldo actual: ${total} cup\n` +
      `📉 Mínimo requerido: ${MINIMO_RETIRO} cup\n` +
      `🎯 Te faltan ${MINIMO_RETIRO - total} cup\n\n` +
      `¡Sigue vendiendo! 💪`,
      { reply_markup: MENU_PRINCIPAL }
    );
    return;
  }

  const metodo = await obtenerMetodoPago(env, userId);
  if (!metodo || metodo.confirmado !== 1) {
    await enviarMensaje(config.BOT_TOKEN, userId,
      "❌ *No tienes método de pago*\n\n" +
      "Configura uno primero en '💳 PAGO' para poder retirar.",
      { reply_markup: MENU_PRINCIPAL }
    );
    return;
  }

  await setEstado(env, userId, ESTADOS.RETIRO_MONTO, {});
  await enviarMensaje(config.BOT_TOKEN, userId,
    `💸 *SOLICITAR RETIRO*\n\n` +
    `💰 Saldo disponible: ${total} cup\n` +
    `📉 Mínimo: ${MINIMO_RETIRO} cup\n\n` +
    `✍️ Envía el *monto* que deseas retirar (solo números):`,
    { reply_markup: TECLADO_CANCELAR }
  );
}

// ============ PASO 2: Recibir monto ============
export async function recibirMonto(env, msg, config) {
  const userId = msg.from.id;
  const texto = (msg.text || "").trim();

  const monto = parseFloat(texto);
  if (isNaN(monto) || monto <= 0) {
    await enviarMensaje(config.BOT_TOKEN, userId,
      "❌ *Monto inválido*\n\nEnvía solo números (ej: 200, 350.50):",
      { reply_markup: TECLADO_CANCELAR }
    );
    return;
  }

  const u = await obtenerUsuario(env, userId);
  const total = (u?.saldo || 0) + (u?.saldo_ref || 0);

  if (monto < MINIMO_RETIRO) {
    await enviarMensaje(config.BOT_TOKEN, userId,
      `❌ El monto mínimo es ${MINIMO_RETIRO} cup.\n` +
      `💰 Tu saldo: ${total} cup\n\nIntenta de nuevo:`,
      { reply_markup: TECLADO_CANCELAR }
    );
    return;
  }

  if (monto > total) {
    await enviarMensaje(config.BOT_TOKEN, userId,
      `❌ Saldo insuficiente.\n` +
      `💰 Tu saldo: ${total} cup\n` +
      `💵 Monto solicitado: ${monto} cup\n\nIntenta de nuevo:`,
      { reply_markup: TECLADO_CANCELAR }
    );
    return;
  }

  // Guardar la solicitud
  const retiroId = await insertarRetiro(env, userId, monto);
  const metodo = await obtenerMetodoPago(env, userId);

  // Avisar al admin
  const user = msg.from;
  const username = user.username ? `@${user.username}` : "Sin username";
  const adminMsg =
    `💸 *NUEVA SOLICITUD DE RETIRO #${retiroId}*\n\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `👤 *Usuario:* ${user.first_name || "Usuario"}\n` +
    `🆔 *ID:* \`${userId}\`\n` +
    `📱 *Username:* ${username}\n` +
    `💰 *Monto:* ${monto} cup\n` +
    `💳 *Método:* ${metodo ? metodo.tipo.toUpperCase() : "N/A"}\n` +
    `🔢 *Número:* ${metodo ? metodo.numero : "N/A"}\n` +
    `📞 *Teléfono:* ${metodo ? metodo.telefono : "N/A"}\n` +
    `━━━━━━━━━━━━━━━━━━`;

  try {
    await enviarMensaje(config.BOT_TOKEN, config.ADMIN_ID, adminMsg, {
      reply_markup: inlineAprobarRechazarRetiro(retiroId, userId),
    });
  } catch (e) { /* ignorar */ }

  await finSesion(env, userId);
  await enviarMensaje(config.BOT_TOKEN, userId,
    `✅ *¡SOLICITUD DE RETIRO ENVIADA!*\n\n` +
    `💰 Monto: ${monto} cup\n` +
    `⏳ Estado: En revisión\n\n` +
    `📨 Te notificaremos cuando sea procesada.`,
    { reply_markup: MENU_PRINCIPAL }
  );
    }
