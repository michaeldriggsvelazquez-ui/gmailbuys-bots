// =====================================================
// HANDLER: Flujo de venta de cuentas Gmail
// =====================================================
import { obtenerUsuario, insertarCuenta } from "../db.js";
import { enviarMensaje } from "../telegram.js";
import { MENU_PRINCIPAL, TECLADO_CANCELAR, inlineAprobarRechazarCuenta } from "../menus.js";
import { ESTADOS, precioCuentaSegunVip } from "../config.js";
import { setEstado, setDatos, getSesion, finSesion } from "../session.js";

export async function iniciarVenta(env, msg, config) {
  const userId = msg.from.id;
  await setEstado(env, userId, ESTADOS.VENDIENDO_USUARIO, {});
  await enviarMensaje(config.BOT_TOKEN, userId,
    "📤 *VENDER CUENTA GMAIL*\n\n" +
    "✍️ Por favor, envía el *USUARIO* de la cuenta:\n" +
    "✨ Ejemplo: `micuenta@gmail.com`\n" +
    "⚠️ *IMPORTANTE:* El usuario debe contener **SOLO LETRAS** (sin números)\n\n" +
    "❌ Presiona CANCELAR para salir",
    { reply_markup: TECLADO_CANCELAR }
  );
}

export async function recibirUsuario(env, msg, config) {
  const userId = msg.from.id;
  const texto = (msg.text || "").trim();

  if (!texto.endsWith("@gmail.com")) {
    await enviarMensaje(config.BOT_TOKEN, userId,
      "❌ *Formato incorrecto*\n\n" +
      "El usuario debe terminar en *@gmail.com*\n" +
      "Ejemplo: `micuenta@gmail.com`\n\n" +
      "Intenta de nuevo:",
      { reply_markup: TECLADO_CANCELAR }
    );
    return;
  }

  const nombreUsuario = texto.split("@")[0];
  if (!/^[a-zA-Z]+$/.test(nombreUsuario)) {
    await enviarMensaje(config.BOT_TOKEN, userId,
      "❌ *Usuario inválido*\n\n" +
      "El nombre de usuario debe contener **SOLO LETRAS** (sin números).\n" +
      "Ejemplos válidos: `mariagonzalez`, `carloslopez`\n\n" +
      "Intenta de nuevo:",
      { reply_markup: TECLADO_CANCELAR }
    );
    return;
  }

  await setDatos(env, userId, { usuario: texto });
  await setEstado(env, userId, ESTADOS.VENDIENDO_CONTRASENA, { usuario: texto });

  await enviarMensaje(config.BOT_TOKEN, userId,
    "🔑 *CONTRASEÑA*\n\n" +
    "Ahora envía la *contraseña* de la cuenta.\n" +
    "📌 *DEBE SER EXACTAMENTE:*\n" +
    `\`${config.CONTRASENA_OBLIGATORIA}\`\n\n` +
    "❌ Presiona CANCELAR para salir",
    { reply_markup: TECLADO_CANCELAR }
  );
}

export async function recibirContrasena(env, msg, config) {
  const userId = msg.from.id;
  const texto = (msg.text || "").trim();

  if (texto !== config.CONTRASENA_OBLIGATORIA) {
    await enviarMensaje(config.BOT_TOKEN, userId,
      "❌ *Contraseña incorrecta*\n\n" +
      "Debe ser exactamente:\n" +
      `\`${config.CONTRASENA_OBLIGATORIA}\`\n\n` +
      "Intenta de nuevo:",
      { reply_markup: TECLADO_CANCELAR }
    );
    return;
  }

  const sesion = await getSesion(env, userId);
  const usuarioGmail = sesion.datos?.usuario;
  if (!usuarioGmail) {
    await finSesion(env, userId);
    await enviarMensaje(config.BOT_TOKEN, userId,
      "❌ Hubo un error. Vuelve a empezar con 📤 VENDER.",
      { reply_markup: MENU_PRINCIPAL }
    );
    return;
  }

  // Calcular precio con el helper blindado
  const u = await obtenerUsuario(env, userId);
  const precio = precioCuentaSegunVip(u?.vip, u?.vip_activo);

  const cuentaId = await insertarCuenta(env, userId, usuarioGmail, texto, precio);

  const user = msg.from;
  const username = user.username ? `@${user.username}` : "Sin username";
  const adminMsg =
    `🆕 *NUEVA CUENTA PENDIENTE #${cuentaId}*\n\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `👤 *Vendedor:* ${user.first_name || "Usuario"}\n` +
    `🆔 *ID:* \`${userId}\`\n` +
    `📱 *Username:* ${username}\n` +
    `📧 *Usuario:* \`${usuarioGmail}\`\n` +
    `💰 *Precio:* ${precio} cup\n` +
    `━━━━━━━━━━━━━━━━━━`;

  try {
    await enviarMensaje(config.BOT_TOKEN, config.ADMIN_ID, adminMsg, {
      reply_markup: inlineAprobarRechazarCuenta(cuentaId),
    });
  } catch (e) { /* ignorar */ }

  await finSesion(env, userId);
  await enviarMensaje(config.BOT_TOKEN, userId,
    "✅ *¡CUENTA ENVIADA CON ÉXITO!*\n\n" +
    "📨 Tu cuenta está en revisión.\n" +
    "⏳ Te notificaremos cuando sea aprobada o rechazada.\n\n" +
    "✨ ¡Gracias por vender con nosotros!",
    { reply_markup: MENU_PRINCIPAL }
  );
                      }
