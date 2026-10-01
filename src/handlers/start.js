// =====================================================
// HANDLER: /start  +  Registro de usuario
// =====================================================
import {
  obtenerUsuario,
  crearUsuario,
  sumarSaldoRef,
  contarReferidos,
} from "../db.js";
import { enviarMensaje } from "../telegram.js";
import { MENU_PRINCIPAL, MENU_ADMIN, inlineInfoCompleta } from "../menus.js";
import { textoBienvenida } from "../texts.js";
import { PRECIOS_VIP } from "../config.js";

// Calcula el bono del referidor según su VIP
function calcularBono(vip, vipActivo) {
  if (vipActivo && vip === 1) return PRECIOS_VIP[1].referido;
  if (vipActivo && vip === 2) return PRECIOS_VIP[2].referido;
  if (vipActivo && vip === 3) return PRECIOS_VIP[3].referido;
  return PRECIOS_VIP.normal.referido;
}

export async function handleStart(env, msg, config) {
  const user = msg.from;
  const userId = user.id;
  const username = user.username || null;
  const nombre = user.first_name || "Usuario";
  const token = config.BOT_TOKEN;

  // ¿Viene con código de referido?
  let referidoPor = null;
  if (msg.text && msg.text.includes(" ")) {
    const arg = msg.text.split(" ")[1];
    if (arg && arg.startsWith("REF")) {
      try {
        const partes = arg.split("_");
        const refId = parseInt(partes[0].replace("REF", ""), 10);
        if (!isNaN(refId) && refId !== userId) referidoPor = refId;
      } catch (e) { /* ignorar */ }
    }
  }

  // ¿Ya existe?
  let u = await obtenerUsuario(env, userId);
  if (!u) {
    const codigoRef = `REF${userId}_${Math.floor(1000 + Math.random() * 9000)}`;
    await crearUsuario(env, userId, username, nombre, codigoRef, referidoPor);

    // Bono al referidor
    if (referidoPor) {
      const ref = await obtenerUsuario(env, referidoPor);
      if (ref) {
        const bono = calcularBono(ref.vip, ref.vip_activo);
        await sumarSaldoRef(env, referidoPor, bono);
        // Notificar al referidor
        try {
          await enviarMensaje(token, referidoPor,
            `🎉 *¡Felicidades!* 🎉\n\n` +
            `👤 **${nombre}** se ha unido usando tu enlace de referido.\n` +
            `💰 Has recibido **+${bono} cup** en tu saldo de referidos.\n\n` +
            `✨ ¡Sigue compartiendo tu enlace para ganar más!`
          );
        } catch (e) { /* ignorar */ }
      }
    }
  }

  // ¿Es admin?
  if (userId === config.ADMIN_ID) {
    await enviarMensaje(token, userId,
      `👋 *¡BIENVENIDO ADMIN, ${nombre}!* 🎉\n\n📊 Panel de Administración`,
      { reply_markup: MENU_ADMIN }
    );
    return;
  }

  // Bienvenida normal
  await enviarMensaje(token, userId,
    textoBienvenida(nombre, config.CONTRASENA_OBLIGATORIA),
    { reply_markup: inlineInfoCompleta() }
  );
  await enviarMensaje(token, userId, "📌 *Menú principal:*",
    { reply_markup: MENU_PRINCIPAL }
  );
}
