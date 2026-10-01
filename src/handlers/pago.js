// =====================================================
// HANDLER: Configuración de método de pago
// =====================================================
import { guardarMetodoPago, obtenerMetodoPago } from "../db.js";
import { enviarMensaje } from "../telegram.js";
import { MENU_PRINCIPAL, TECLADO_CANCELAR } from "../menus.js";
import { ESTADOS } from "../config.js";
import { setEstado, setDatos, getSesion, finSesion } from "../session.js";

// ============ PASO 1: Elegir tipo (MiTransfer / Tarjeta) ============
export async function elegirMetodo(env, msg, config) {
  const userId = msg.from.id;
  const texto = (msg.text || "").trim();

  if (texto === "🏦 MiTransfer") {
    await setEstado(env, userId, ESTADOS.PAGO_NUMERO, { tipo: "mitransfer" });
    await enviarMensaje(config.BOT_TOKEN, userId,
      "🏦 *MiTransfer*\n\n" +
      "✍️ Por favor, ingresa tu **número de MiTransfer** (8 dígitos):\n" +
      "✨ Ejemplo: `12345678`\n\n" +
      "❌ Presiona CANCELAR para salir",
      { reply_markup: TECLADO_CANCELAR }
    );
    return;
  }

  if (texto === "💳 TARJETA") {
    await setEstado(env, userId, ESTADOS.PAGO_NUMERO, { tipo: "tarjeta" });
    await enviarMensaje(config.BOT_TOKEN, userId,
      "💳 *Tarjeta*\n\n" +
      "✍️ Por favor, ingresa tu **número de tarjeta** (16 dígitos):\n" +
      "✨ Ejemplo: `1234567890123456`\n\n" +
      "❌ Presiona CANCELAR para salir",
      { reply_markup: TECLADO_CANCELAR }
    );
    return;
  }

  // Texto no reconocido → volver a pedir
  await enviarMensaje(config.BOT_TOKEN, userId,
    "⚠️ Por favor, elige una opción del teclado.",
    { reply_markup: { keyboard: [[{ text: "🏦 MiTransfer" }, { text: "💳 TARJETA" }], [{ text: "🔙 ATRÁS" }]], resize_keyboard: true } }
  );
}

// ============ PASO 2: Recibir número de pago ============
export async function recibirNumero(env, msg, config) {
  const userId = msg.from.id;
  const num = (msg.text || "").replace(/\s/g, "");

  if (!/^\d+$/.test(num)) {
    await enviarMensaje(config.BOT_TOKEN, userId,
      "❌ *Solo se permiten números*\n\nIntenta de nuevo:",
      { reply_markup: TECLADO_CANCELAR }
    );
    return;
  }

  const sesion = await getSesion(env, userId);
  const tipo = sesion.datos?.tipo || "mitransfer";
  const requerido = tipo === "mitransfer" ? 8 : 16;

  if (num.length !== requerido) {
    await enviarMensaje(config.BOT_TOKEN, userId,
      `❌ El número debe tener ${requerido} dígitos.\n\nIntenta de nuevo:`,
      { reply_markup: TECLADO_CANCELAR }
    );
    return;
  }

  await setDatos(env, userId, { numero: num });
  await setEstado(env, userId, ESTADOS.PAGO_TELEFONO, { tipo, numero: num });

  await enviarMensaje(config.BOT_TOKEN, userId,
    "📞 *TELÉFONO*\n\n" +
    "✍️ Ahora ingresa tu **número de teléfono** (8 dígitos):\n" +
    "✨ Ejemplo: `55556666`\n\n" +
    "❌ Presiona CANCELAR para salir",
    { reply_markup: TECLADO_CANCELAR }
  );
}

// ============ PASO 3: Recibir teléfono y guardar ============
export async function recibirTelefono(env, msg, config) {
  const userId = msg.from.id;
  const tel = (msg.text || "").replace(/\s/g, "");

  if (!/^\d+$/.test(tel) || tel.length !== 8) {
    await enviarMensaje(config.BOT_TOKEN, userId,
      "❌ El teléfono debe tener 8 dígitos.\n\nIntenta de nuevo:",
      { reply_markup: TECLADO_CANCELAR }
    );
    return;
  }

  const sesion = await getSesion(env, userId);
  const tipo = sesion.datos?.tipo;
  const numero = sesion.datos?.numero;

  if (!tipo || !numero) {
    await finSesion(env, userId);
    await enviarMensaje(config.BOT_TOKEN, userId,
      "❌ Hubo un error. Vuelve a configurar tu método de pago desde 💳 PAGO.",
      { reply_markup: MENU_PRINCIPAL }
    );
    return;
  }

  // ¿Ya existe el mismo método?
  const existe = await obtenerMetodoPago(env, userId);
  if (existe && existe.tipo === tipo && existe.numero === numero && existe.telefono === tel) {
    await finSesion(env, userId);
    await enviarMensaje(config.BOT_TOKEN, userId,
      "⚠️ *DATOS DUPLICADOS*\n\n" +
      "Estos datos ya están registrados en el bot.\n" +
      "No se realizaron cambios.\n\n" +
      "✅ Tu método de pago sigue siendo el mismo.",
      { reply_markup: MENU_PRINCIPAL }
    );
    return;
  }

  await guardarMetodoPago(env, userId, tipo, numero, tel);
  await finSesion(env, userId);

  const accion = existe ? "ACTUALIZADO" : "CONFIGURADO";
  await enviarMensaje(config.BOT_TOKEN, userId,
    `✅ *¡MÉTODO DE PAGO ${accion} CON ÉXITO!*\n\n` +
    `📌 *Método:* ${tipo.toUpperCase()}\n` +
    `🔢 *Número:* \`${numero}\`\n` +
    `📞 *Teléfono:* \`${tel}\`\n` +
    `✅ *Número de confirmación:* \`${tel}\` (tu teléfono)\n\n` +
    `✨ ¡Ya puedes solicitar retiros!`,
    { reply_markup: MENU_PRINCIPAL }
  );
  }
