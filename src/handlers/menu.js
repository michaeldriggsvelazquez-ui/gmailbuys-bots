// =====================================================
// HANDLER: Botones generales del menú
// =====================================================
import {
  obtenerUsuario,
  cuentasDeUsuario,
  contarReferidos,
  obtenerMetodoPago,
} from "../db.js";
import { enviarMensaje } from "../telegram.js";
import {
  MENU_PRINCIPAL,
  TECLADO_SALDO,
  TECLADO_PAGO_NUEVO,
  inlineCambiarMetodo,
  tecladoVip,
} from "../menus.js";
import { textoAyuda, textoInfoVip } from "../texts.js";
import { PRECIOS_VIP, MINIMO_RETIRO } from "../config.js";
import { setEstado, finSesion } from "../session.js";
import { ESTADOS } from "../config.js";

// ============ MIS CUENTAS ============
export async function verMisCuentas(env, msg, config) {
  const userId = msg.from.id;
  const cuentas = await cuentasDeUsuario(env, userId);

  if (!cuentas.length) {
    await enviarMensaje(config.BOT_TOKEN, userId,
      "📋 *No tienes cuentas vendidas todavía*\n\n" +
      "¿Qué esperas? ¡Vende tu primera cuenta con el botón 📤 VENDER! 💪"
    );
    return;
  }

  let texto = "📋 *TUS CUENTAS VENDIDAS*\n\n";
  for (const c of cuentas) {
    let emoji, estadoTxt;
    if (c.estado === "aprobada") { emoji = "✅"; estadoTxt = "APROBADA"; }
    else if (c.estado === "rechazada") { emoji = "❌"; estadoTxt = "RECHAZADA"; }
    else { emoji = "⏳"; estadoTxt = "PENDIENTE"; }
    const fecha = c.fecha ? new Date(c.fecha).toLocaleDateString("es-ES") : "—";
    texto += `${emoji} \`${c.usuario}\`\n   📅 ${fecha} | ${estadoTxt} | ${c.precio} cup\n\n`;
  }
  await enviarMensaje(config.BOT_TOKEN, userId, texto);
}

// ============ SALDO ============
export async function verSaldo(env, msg, config) {
  const userId = msg.from.id;
  const u = await obtenerUsuario(env, userId);
  const s = u?.saldo || 0;
  const sr = u?.saldo_ref || 0;
  const total = s + sr;

  const texto =
    `💰 *TU SALDO ACTUAL*\n\n` +
    `💵 *Por ventas:* ${s} cup\n` +
    `👥 *Por referidos:* ${sr} cup\n` +
    `━━━━━━━━━━━━━━━━\n` +
    `💎 *Saldo total:* ${total} cup\n\n` +
    `👇 *¿Qué deseas hacer?*`;

  await enviarMensaje(config.BOT_TOKEN, userId, texto, { reply_markup: TECLADO_SALDO });
}

// ============ REFERIDOS ============
export async function verReferidos(env, msg, config) {
  const userId = msg.from.id;
  const u = await obtenerUsuario(env, userId);
  if (!u) return;

  const total = await contarReferidos(env, userId);

  let bono;
  if (u.vip_activo && u.vip === 1) bono = PRECIOS_VIP[1].referido;
  else if (u.vip_activo && u.vip === 2) bono = PRECIOS_VIP[2].referido;
  else if (u.vip_activo && u.vip === 3) bono = PRECIOS_VIP[3].referido;
  else bono = PRECIOS_VIP.normal.referido;

  // Obtener username del bot desde la API
  const meRes = await fetch(`https://api.telegram.org/bot${config.BOT_TOKEN}/getMe`);
  const me = await meRes.json();
  const botUsername = me.ok ? me.result.username : "GmailBuysBot";

  const enlace = `https://t.me/${botUsername}?start=${u.codigo_ref}`;

  const texto =
    `👥 *SISTEMA DE REFERIDOS*\n\n` +
    `📊 *Tus referidos:* ${total}\n` +
    `💰 *Ganado por referidos:* ${u.saldo_ref} cup\n` +
    `🎁 *Bono actual por referido:* ${bono} cup\n` +
    `🎯 *Meta para retirar:* ${MINIMO_RETIRO} cup\n\n` +
    `🔗 *Tu enlace personal:*\n` +
    `\`${enlace}\`\n\n` +
    `✨ *Comparte este enlace con tus amigos y gana dinero!*`;

  await enviarMensaje(config.BOT_TOKEN, userId, texto);
}

// ============ AYUDA ============
export async function verAyuda(env, msg, config) {
  const texto = textoAyuda(config.CONTRASENA_OBLIGATORIA, config.NUMERO_MITRANSFER);
  await enviarMensaje(config.BOT_TOKEN, msg.from.id, texto);
}

// ============ PAGO (menú visual) ============
export async function verPago(env, msg, config) {
  const userId = msg.from.id;
  const m = await obtenerMetodoPago(env, userId);

  if (m && m.confirmado === 1) {
    const texto =
      `💳 *TU MÉTODO DE PAGO ACTUAL*\n\n` +
      `📌 *Método:* ${m.tipo.toUpperCase()}\n` +
      `🔢 *Número:* \`${m.numero}\`\n` +
      `📞 *Teléfono:* \`${m.telefono}\`\n` +
      `✅ *Número de confirmación:* \`${m.telefono}\` (tu teléfono)\n\n` +
      `👇 *¿Deseas cambiar tu método de pago?*`;

    await enviarMensaje(config.BOT_TOKEN, userId, texto, {
      reply_markup: { keyboard: [[{ text: "🔙 ATRÁS" }]], resize_keyboard: true },
    });
    await enviarMensaje(config.BOT_TOKEN, userId,
      "Presiona el botón para cambiar:",
      { reply_markup: inlineCambiarMetodo() }
    );
    return;
  }

  const texto =
    "💳 *CONFIGURAR MÉTODO DE PAGO*\n\n" +
    "Para poder recibir tus pagos, necesitas configurar un método.\n" +
    "Selecciona el que prefieras:";

  await enviarMensaje(config.BOT_TOKEN, userId, texto, { reply_markup: TECLADO_PAGO_NUEVO });
  await setEstado(env, userId, ESTADOS.PAGO_METODO);
}

// ============ VIP (menú visual) ============
export async function verVip(env, msg, config) {
  const userId = msg.from.id;
  const u = await obtenerUsuario(env, userId);
  const vip = u?.vip || 0;
  const act = u?.vip_activo || 0;

  let encabezado;
  if (act && vip > 0) {
    encabezado = `⭐ *TU MEMBRESÍA ACTUAL: VIP ${vip}*\n\n¿Te gustaría cambiar a otro nivel?`;
  } else {
    encabezado = "⭐ *MEMBRESÍAS VIP*\n\nSelecciona el nivel que deseas adquirir:";
  }

  const texto = encabezado + textoInfoVip();
  await enviarMensaje(config.BOT_TOKEN, userId, texto, { reply_markup: tecladoVip(vip, act) });
  await setEstado(env, userId, ESTADOS.VIP_SELECCION);
}

// ============ CANCELAR / ATRÁS ============
export async function volverMenu(env, msg, config) {
  await finSesion(env, msg.from.id);
  await enviarMensaje(config.BOT_TOKEN, msg.from.id,
    "✅ Volviendo al menú principal...",
    { reply_markup: MENU_PRINCIPAL }
  );
}
