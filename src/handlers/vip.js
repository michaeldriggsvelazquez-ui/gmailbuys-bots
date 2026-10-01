// =====================================================
// HANDLER: Flujo de compra de VIP
// =====================================================
import { insertarSolicitudVip } from "../db.js";
import { enviarMensaje, enviarFoto } from "../telegram.js";
import {
  MENU_PRINCIPAL,
  TECLADO_CANCELAR,
  TECLADO_VIP_LISTO,
  inlineAprobarRechazarVip,
} from "../menus.js";
import { ESTADOS, PRECIOS_VIP } from "../config.js";
import { setEstado, setDatos, getSesion, finSesion } from "../session.js";

// ============ PASO 1: Elegir nivel VIP ============
export async function elegirVip(env, msg, config) {
  const userId = msg.from.id;
  const texto = (msg.text || "").trim();

  let vip = null, precio = null;
  if (texto.startsWith("VIP 1")) { vip = 1; precio = PRECIOS_VIP[1].costo; }
  else if (texto.startsWith("VIP 2")) { vip = 2; precio = PRECIOS_VIP[2].costo; }
  else if (texto.startsWith("VIP 3")) { vip = 3; precio = PRECIOS_VIP[3].costo; }

  if (!vip) {
    await enviarMensaje(config.BOT_TOKEN, userId,
      "⚠️ Por favor, elige un nivel VIP del teclado."
    );
    return;
  }

  await setEstado(env, userId, ESTADOS.VIP_LISTO, { vip, precio });

  await enviarMensaje(config.BOT_TOKEN, userId,
    `⭐ *MEMBRESÍA VIP ${vip} — ${precio} cup*\n\n` +
    `💰 *Envía ${precio} cup a la bolsa monedero MiTransfer:*\n` +
    `\`${config.NUMERO_MITRANSFER}\`\n\n` +
    `✅ *Cuando hayas realizado el pago, presiona LISTO*`,
    { reply_markup: TECLADO_VIP_LISTO }
  );
}

// ============ PASO 2: Usuario presionó LISTO ============
export async function vipListo(env, msg, config) {
  const userId = msg.from.id;
  const texto = (msg.text || "").trim();

  if (texto === "✅ LISTO") {
    const sesion = await getSesion(env, userId);
    await setEstado(env, userId, ESTADOS.VIP_CAPTURA, sesion.datos);
    await enviarMensaje(config.BOT_TOKEN, userId,
      "📸 *ENVIAR CAPTURA DE PAGO*\n\n" +
      "Por favor, envía la **foto del comprobante** de pago.\n\n" +
      "❌ Presiona CANCELAR para salir",
      { reply_markup: TECLADO_CANCELAR }
    );
  }
}

// ============ PASO 3: Recibir captura ============
export async function vipCaptura(env, msg, config) {
  const userId = msg.from.id;

  if (!msg.photo || !msg.photo.length) {
    await enviarMensaje(config.BOT_TOKEN, userId,
      "❌ *Solo se aceptan imágenes*\n\n" +
      "Por favor, envía una foto del comprobante:",
      { reply_markup: TECLADO_CANCELAR }
    );
    return;
  }

  const photo = msg.photo[msg.photo.length - 1];
  const fileId = photo.file_id;

  const sesion = await getSesion(env, userId);
  const vip = sesion.datos?.vip || 1;

  const solId = await insertarSolicitudVip(env, userId, vip, fileId);

  const user = msg.from;
  const username = user.username ? `@${user.username}` : "Sin username";
  const adminMsg =
    `⭐ *NUEVA SOLICITUD VIP #${solId}*\n\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `👤 *Usuario:* ${user.first_name || "Usuario"}\n` +
    `🆔 *ID:* \`${userId}\`\n` +
    `📱 *Username:* ${username}\n` +
    `🎯 *VIP solicitado:* ${vip}\n` +
    `━━━━━━━━━━━━━━━━━━`;

  try {
    await enviarFoto(config.BOT_TOKEN, config.ADMIN_ID, fileId, {
      caption: adminMsg,
      reply_markup: inlineAprobarRechazarVip(solId, vip, userId),
    });
  } catch (e) { /* ignorar */ }

  await finSesion(env, userId);
  await enviarMensaje(config.BOT_TOKEN, userId,
    "✅ *¡SOLICITUD VIP ENVIADA!*\n\n" +
    "📨 Tu solicitud con captura ha sido enviada al administrador.\n" +
    "⏳ Te notificaremos cuando sea aprobada.",
    { reply_markup: MENU_PRINCIPAL }
  );
}
