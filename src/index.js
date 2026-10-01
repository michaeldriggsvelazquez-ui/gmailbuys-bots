// =====================================================
// PUNTO DE ENTRADA PRINCIPAL DEL WORKER
// =====================================================
import { getConfig, ESTADOS } from "./config.js";
import { enviarMensaje } from "./telegram.js";
import { getEstado, finSesion } from "./session.js";
import { handleStart } from "./handlers/start.js";
import {
  verMisCuentas,
  verSaldo,
  verReferidos,
  verAyuda,
  verPago,
  verVip,
  volverMenu,
} from "./handlers/menu.js";
import { iniciarVenta, recibirUsuario, recibirContrasena } from "./handlers/vender.js";
import { elegirMetodo, recibirNumero, recibirTelefono } from "./handlers/pago.js";
import { iniciarRetiro, recibirMonto } from "./handlers/retiro.js";
import { elegirVip, vipListo, vipCaptura } from "./handlers/vip.js";
import {
  iniciarSoporte,
  recibirSoporte,
  enviarRespuesta,
} from "./handlers/soporte.js";
import {
  verPendientes,
  verRetiros,
  verVipPendientes,
  verMensajes,
  verEstadisticas,
} from "./handlers/admin.js";
import { handleCallback } from "./handlers/callbacks.js";

// =====================================================
// ROUTER PRINCIPAL
// =====================================================
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const config = getConfig(env);

    // Ruta para configurar el webhook (llamarla 1 vez desde el navegador)
    if (url.pathname === "/set-webhook") {
      const webhookUrl = `${config.WORKER_URL}/webhook`;
      const res = await fetch(`https://api.telegram.org/bot${config.BOT_TOKEN}/setWebhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: webhookUrl, drop_pending_updates: true }),
      });
      const data = await res.json();
      return new Response(JSON.stringify(data, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ruta para ver el estado del webhook
    if (url.pathname === "/webhook-info") {
      const res = await fetch(`https://api.telegram.org/bot${config.BOT_TOKEN}/getWebhookInfo`);
      const data = await res.json();
      return new Response(JSON.stringify(data, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ruta raíz (por si abren el Worker directo en el navegador)
    if (url.pathname === "/") {
      return new Response("🤖 Gmail Buy's Bot activo", { status: 200 });
    }

    // Webhook de Telegram
    if (url.pathname === "/webhook" && request.method === "POST") {
      try {
        const update = await request.json();
        ctx.waitUntil(procesarUpdate(env, config, update));
      } catch (e) {
        console.error("Error procesando update:", e);
      }
      return new Response("OK", { status: 200 });
    }

    return new Response("Not found", { status: 404 });
  },
};

// =====================================================
// PROCESADOR DE ACTUALIZACIONES
// =====================================================
async function procesarUpdate(env, config, update) {
  // Callback query (botones inline)
  if (update.callback_query) {
    return await handleCallback(env, update.callback_query, config);
  }

  const msg = update.message;
  if (!msg) return;

  const userId = msg.from.id;
  const texto = (msg.text || "").trim();
  const esAdmin = userId === config.ADMIN_ID;

  // ============ /start ============
  if (texto.startsWith("/start")) {
    await finSesion(env, userId);
    return await handleStart(env, msg, config);
  }

  // ============ CANCELAR / ATRÁS (siempre) ============
  if (texto === "❌ CANCELAR" || texto === "🔙 ATRÁS") {
    return await volverMenu(env, msg, config);
  }

  // ============ BOTONES DEL MENÚ ADMIN ============
  if (esAdmin) {
    if (texto === "📋 PENDIENTES") return await verPendientes(env, msg, config);
    if (texto === "💸 RETIROS") return await verRetiros(env, msg, config);
    if (texto === "⭐ VIP PENDIENTES") return await verVipPendientes(env, msg, config);
    if (texto === "📨 MENSAJES") return await verMensajes(env, msg, config);
    if (texto === "📊 ESTADÍSTICAS") return await verEstadisticas(env, msg, config);
    if (texto === "🔙 VOLVER A MENÚ USUARIO") return await volverMenu(env, msg, config);
  }

  // ============ ESTADO ACTUAL DEL USUARIO ============
  const estado = await getEstado(env, userId);

  // ---------- VENDER ----------
  if (estado === ESTADOS.VENDIENDO_USUARIO) return await recibirUsuario(env, msg, config);
  if (estado === ESTADOS.VENDIENDO_CONTRASENA) return await recibirContrasena(env, msg, config);

  // ---------- PAGO ----------
  if (estado === ESTADOS.PAGO_METODO) return await elegirMetodo(env, msg, config);
  if (estado === ESTADOS.PAGO_NUMERO) return await recibirNumero(env, msg, config);
  if (estado === ESTADOS.PAGO_TELEFONO) return await recibirTelefono(env, msg, config);

  // ---------- RETIRO ----------
  if (estado === ESTADOS.RETIRO_MONTO) return await recibirMonto(env, msg, config);

  // ---------- VIP ----------
  if (estado === ESTADOS.VIP_SELECCION) return await elegirVip(env, msg, config);
  if (estado === ESTADOS.VIP_LISTO) return await vipListo(env, msg, config);
  if (estado === ESTADOS.VIP_CAPTURA) return await vipCaptura(env, msg, config);

  // ---------- SOPORTE ----------
  if (estado === ESTADOS.SOPORTE_ESCRIBIENDO) return await recibirSoporte(env, msg, config);

  // ---------- RESPUESTA ADMIN ----------
  if (estado === ESTADOS.RESPUESTA_ESPERA) return await enviarRespuesta(env, msg, config);

  // ============ BOTONES DEL MENÚ PRINCIPAL ============
  if (texto === "📤 VENDER") return await iniciarVenta(env, msg, config);
  if (texto === "📋 MIS CUENTAS") return await verMisCuentas(env, msg, config);
  if (texto === "💰 SALDO") return await verSaldo(env, msg, config);
  if (texto === "👥 REFERIDOS") return await verReferidos(env, msg, config);
  if (texto === "💳 PAGO") return await verPago(env, msg, config);
  if (texto === "⭐ VIP") return await verVip(env, msg, config);
  if (texto === "🆘 SOPORTE") return await iniciarSoporte(env, msg, config);
  if (texto === "❓ AYUDA") return await verAyuda(env, msg, config);
  if (texto === "💸 RETIRAR") return await iniciarRetiro(env, msg, config);

  // ============ MENSAJE NO RECONOCIDO ============
  await enviarMensaje(config.BOT_TOKEN, userId,
    "🤔 No entendí ese mensaje.\n\nUsa los botones del menú o envía /start para reiniciar."
  );
        }
