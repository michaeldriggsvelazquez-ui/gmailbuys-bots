// =====================================================
// HANDLER: Panel de administración
// =====================================================
import {
  cuentasPendientes,
  retirosPendientes,
  solicitudesVipPendientes,
  mensajesSoporteNuevos,
  obtenerEstadisticas,
} from "../db.js";
import { enviarMensaje } from "../telegram.js";
import {
  MENU_ADMIN,
  inlineAprobarRechazarCuenta,
  inlineAprobarRechazarRetiro,
  inlineAprobarRechazarVip,
  inlineResponder,
} from "../menus.js";

// ============ PENDIENTES (cuentas) ============
export async function verPendientes(env, msg, config) {
  const lista = await cuentasPendientes(env);
  const adminId = msg.from.id;

  if (!lista.length) {
    await enviarMensaje(config.BOT_TOKEN, adminId, "✅ No hay cuentas pendientes en este momento.");
    return;
  }

  await enviarMensaje(config.BOT_TOKEN, adminId, `📋 *${lista.length} cuentas pendientes de revisión:*`);

  for (const d of lista) {
    const texto =
      `🆔 *Cuenta #${d.id}*\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `👤 *Vendedor:* ${d.nombre || "Usuario"}\n` +
      `📱 *Username:* @${d.username || "Sin username"}\n` +
      `📧 *Usuario Gmail:* \`${d.usuario}\`\n` +
      `💰 *Precio:* ${d.precio} cup\n` +
      `━━━━━━━━━━━━━━━━`;
    await enviarMensaje(config.BOT_TOKEN, adminId, texto, {
      reply_markup: inlineAprobarRechazarCuenta(d.id),
    });
  }
}

// ============ RETIROS ============
export async function verRetiros(env, msg, config) {
  const lista = await retirosPendientes(env);
  const adminId = msg.from.id;

  if (!lista.length) {
    await enviarMensaje(config.BOT_TOKEN, adminId, "✅ No hay solicitudes de retiro pendientes.");
    return;
  }

  await enviarMensaje(config.BOT_TOKEN, adminId, `💸 *${lista.length} solicitudes de retiro:*`);

  for (const d of lista) {
    const texto =
      `💰 *Retiro #${d.id}*\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `👤 *Solicitante:* ${d.nombre || "Usuario"}\n` +
      `📱 *Username:* @${d.username || "Sin username"}\n` +
      `💵 *Monto:* ${d.monto} cup\n` +
      `🆔 *ID:* \`${d.user_id}\`\n` +
      `━━━━━━━━━━━━━━━━`;
    await enviarMensaje(config.BOT_TOKEN, adminId, texto, {
      reply_markup: inlineAprobarRechazarRetiro(d.id, d.user_id),
    });
  }
}

// ============ VIP PENDIENTES ============
export async function verVipPendientes(env, msg, config) {
  const lista = await solicitudesVipPendientes(env);
  const adminId = msg.from.id;

  if (!lista.length) {
    await enviarMensaje(config.BOT_TOKEN, adminId, "✅ No hay solicitudes VIP pendientes.");
    return;
  }

  await enviarMensaje(config.BOT_TOKEN, adminId, `⭐ *${lista.length} solicitudes VIP:*`);

  for (const d of lista) {
    const texto =
      `⭐ *Solicitud VIP #${d.id}*\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `👤 *Usuario:* ${d.nombre || "Usuario"}\n` +
      `📱 *Username:* @${d.username || "Sin username"}\n` +
      `🎯 *VIP solicitado:* ${d.vip}\n` +
      `🆔 *ID:* \`${d.user_id}\`\n` +
      `━━━━━━━━━━━━━━━━`;
    await enviarMensaje(config.BOT_TOKEN, adminId, texto, {
      reply_markup: inlineAprobarRechazarVip(d.id, d.vip, d.user_id),
    });
  }
}

// ============ MENSAJES DE SOPORTE ============
export async function verMensajes(env, msg, config) {
  const lista = await mensajesSoporteNuevos(env);
  const adminId = msg.from.id;

  if (!lista.length) {
    await enviarMensaje(config.BOT_TOKEN, adminId, "✅ No hay mensajes de soporte nuevos.");
    return;
  }

  await enviarMensaje(config.BOT_TOKEN, adminId, `📨 *${lista.length} mensajes de soporte:*`);

  for (const d of lista) {
    const texto =
      `📨 *Mensaje #${d.id}*\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `👤 *De:* ${d.nombre || "Usuario"}\n` +
      `📱 *Username:* @${d.username || "Sin username"}\n` +
      `🆔 *ID:* \`${d.user_id}\`\n` +
      `💬 *Mensaje:*\n${d.mensaje}\n` +
      `━━━━━━━━━━━━━━━━`;
    await enviarMensaje(config.BOT_TOKEN, adminId, texto, {
      reply_markup: inlineResponder(d.user_id),
    });
  }
}

// ============ ESTADÍSTICAS ============
export async function verEstadisticas(env, msg, config) {
  const e = await obtenerEstadisticas(env);
  const texto =
    `📊 *ESTADÍSTICAS COMPLETAS*\n\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `👥 *Usuarios registrados:* ${e.users}\n` +
    `📧 *Total cuentas vendidas:* ${e.cuentas}\n` +
    `✅ *Cuentas aprobadas:* ${e.aprobadas}\n` +
    `💰 *Total pagado a usuarios:* ${e.pagado} cup\n` +
    `💸 *Total retirado por usuarios:* ${e.retirado} cup\n` +
    `━━━━━━━━━━━━━━━━━━`;
  await enviarMensaje(config.BOT_TOKEN, msg.from.id, texto);
  }
