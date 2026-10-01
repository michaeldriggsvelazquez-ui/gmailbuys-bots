// =====================================================
// HANDLER: Botones inline (callbacks)
// =====================================================
import {
  obtenerCuenta,
  actualizarEstadoCuenta,
  sumarSaldo,
  obtenerRetiro,
  actualizarEstadoRetiro,
  ajustarSaldosRetiro,
  actualizarEstadoVip,
  activarVip,
  obtenerUsuario,
} from "../db.js";
import {
  enviarMensaje,
  responderCallback,
  editarMensaje,
  eliminarMensaje,
} from "../telegram.js";
import { TECLADO_PAGO_NUEVO, MENU_ADMIN } from "../menus.js";
import { textoInfoCompleta } from "../texts.js";
import { ESTADOS, PRECIOS_VIP } from "../config.js";
import { setEstado } from "../session.js";

// ============ PUNTO DE ENTRADA ============
export async function handleCallback(env, cb, config) {
  const data = cb.data || "";
  const userId = cb.from.id;
  const messageId = cb.message?.message_id;
  const chatId = cb.message?.chat?.id || userId;

  // Responder siempre al callback para quitar el "cargando"
  await responderCallback(config.BOT_TOKEN, cb.id);

  // ============ CAMBIAR MÉTODO ============
  if (data === "cambiar_metodo") {
    await eliminarMensaje(config.BOT_TOKEN, chatId, messageId).catch(() => {});
    await setEstado(env, userId, ESTADOS.PAGO_METODO, {});
    await enviarMensaje(config.BOT_TOKEN, userId,
      "🔄 *CAMBIAR MÉTODO DE PAGO*\n\nSelecciona el nuevo método que deseas configurar:",
      { reply_markup: TECLADO_PAGO_NUEVO }
    );
    return;
  }

  // ============ INFO COMPLETA ============
  if (data === "info_completa") {
    await enviarMensaje(config.BOT_TOKEN, userId,
      textoInfoCompleta(config.CONTRASENA_OBLIGATORIA, config.NUMERO_MITRANSFER)
    );
    return;
  }

  // ============ APROBAR CUENTA ============
  if (data.startsWith("aprobar_cuenta_")) {
    const cid = parseInt(data.split("_")[2], 10);
    const cuenta = await obtenerCuenta(env, cid);
    if (!cuenta) return;

    await actualizarEstadoCuenta(env, cid, "aprobada");
    await sumarSaldo(env, cuenta.user_id, cuenta.precio);

    await enviarMensaje(config.BOT_TOKEN, cuenta.user_id,
      `✅ *¡FELICIDADES! TU CUENTA FUE APROBADA* 🎉\n\n` +
      `💰 Se han sumado **+${cuenta.precio} cup** a tu saldo.\n` +
      `✨ ¡Gracias por vender con nosotros!`
    );

    await editarMensaje(config.BOT_TOKEN, chatId, messageId,
      (cb.message.caption || cb.message.text) + "\n\n✅ *APROBADA* - El usuario ya recibió su pago."
    );
    return;
  }

  // ============ RECHAZAR CUENTA ============
  if (data.startsWith("rechazar_cuenta_")) {
    const cid = parseInt(data.split("_")[2], 10);
    const cuenta = await obtenerCuenta(env, cid);
    if (!cuenta) return;

    await actualizarEstadoCuenta(env, cid, "rechazada");

    await enviarMensaje(config.BOT_TOKEN, cuenta.user_id,
      "❌ *CUENTA RECHAZADA*\n\n" +
      "Lo sentimos, la cuenta no cumple con los requisitos:\n" +
      "✅ Debe ser **NUEVA**\n" +
      "✅ Usuario con **SOLO LETRAS**\n" +
      `✅ Contraseña exacta: \`${config.CONTRASENA_OBLIGATORIA}\`\n` +
      "✅ Sin cambios de contraseña\n" +
      "✅ Sin datos borrados\n\n" +
      "Puedes intentar con otra cuenta. ¡Ánimo! 💪"
    );

    await editarMensaje(config.BOT_TOKEN, chatId, messageId,
      (cb.message.text || "") + "\n\n❌ *RECHAZADA*"
    );
    return;
  }

  // ============ APROBAR RETIRO ============
  if (data.startsWith("aprobar_retiro_")) {
    const partes = data.split("_");
    const rid = parseInt(partes[2], 10);
    const uid = parseInt(partes[3], 10);

    const retiro = await obtenerRetiro(env, rid);
    if (!retiro) return;

    await ajustarSaldosRetiro(env, uid, retiro.monto);
    await actualizarEstadoRetiro(env, rid, "confirmado");

    await enviarMensaje(config.BOT_TOKEN, uid,
      `✅ *¡RETIRO CONFIRMADO!*\n\n` +
      `💰 Monto: ${retiro.monto} cup\n` +
      `📨 El administrador enviará el comprobante.\n\n` +
      `✨ ¡Gracias por confiar en nosotros!`
    );

    await editarMensaje(config.BOT_TOKEN, chatId, messageId,
      (cb.message.text || "") + "\n\n✅ *CONFIRMADO* - Notificación enviada al usuario."
    );
    return;
  }

  // ============ RECHAZAR RETIRO ============
  if (data.startsWith("rechazar_retiro_")) {
    const partes = data.split("_");
    const rid = parseInt(partes[2], 10);
    const uid = parseInt(partes[3], 10);

    await actualizarEstadoRetiro(env, rid, "rechazado");

    await enviarMensaje(config.BOT_TOKEN, uid,
      "❌ *RETIRO RECHAZADO*\n\n" +
      "Lo sentimos, tu solicitud de retiro ha sido rechazada.\n" +
      "Contacta a soporte para más información."
    );

    await editarMensaje(config.BOT_TOKEN, chatId, messageId,
      (cb.message.text || "") + "\n\n❌ *RECHAZADO*"
    );
    return;
  }

  // ============ APROBAR VIP ============
  if (data.startsWith("aprobar_vip_")) {
    const partes = data.split("_");
    const sid = parseInt(partes[2], 10);
    const vip = parseInt(partes[3], 10);
    const uid = parseInt(partes[4], 10);

    await actualizarEstadoVip(env, sid, "aprobado");
    await activarVip(env, uid, vip);

    const pc = PRECIOS_VIP[vip].cuenta;
    const pr = PRECIOS_VIP[vip].referido;

    await enviarMensaje(config.BOT_TOKEN, uid,
      `✨ *¡FELICIDADES! VIP ${vip} ACTIVADO* ✨\n\n` +
      `🎉 Ahora disfrutas de mejores precios:\n` +
      `💰 *Cuentas:* **${pc} cup** cada una\n` +
      `👥 *Referidos:* **${pr} cup** por amigo\n\n` +
      `⭐ ¡Sigue vendiendo y gana más!`
    );

    await editarMensaje(config.BOT_TOKEN, chatId, messageId,
      (cb.message.caption || cb.message.text) + "\n\n✅ *APROBADO* - Usuario notificado."
    );
    return;
  }

  // ============ RECHAZAR VIP ============
  if (data.startsWith("rechazar_vip_")) {
    const partes = data.split("_");
    const sid = parseInt(partes[2], 10);
    const uid = parseInt(partes[3], 10);

    await actualizarEstadoVip(env, sid, "rechazado");

    await enviarMensaje(config.BOT_TOKEN, uid,
      "❌ *SOLICITUD VIP RECHAZADA*\n\n" +
      "Verifica el comprobante e intenta nuevamente.\n" +
      "Si el problema persiste, contacta a soporte."
    );

    await editarMensaje(config.BOT_TOKEN, chatId, messageId,
      (cb.message.caption || cb.message.text) + "\n\n❌ *RECHAZADO*"
    );
    return;
  }

  // ============ RESPONDER MENSAJE (soporte) ============
  if (data.startsWith("responder_")) {
    const targetUserId = parseInt(data.split("_")[1], 10);
    await setEstado(env, userId, ESTADOS.RESPUESTA_ESPERA, { targetUserId });

    await editarMensaje(config.BOT_TOKEN, chatId, messageId,
      (cb.message.caption || cb.message.text) + "\n\n✍️ *Escribe tu respuesta:*"
    );

    await enviarMensaje(config.BOT_TOKEN, userId,
      `📨 *RESPONDER A USUARIO*\n\n🆔 ID: \`${targetUserId}\`\n\nEscribe el mensaje:`,
      { reply_markup: { keyboard: [[{ text: "❌ CANCELAR" }]], resize_keyboard: true } }
    );
    return;
  }
      }
