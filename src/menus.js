// =====================================================
// TECLADOS DEL BOT (Reply e Inline)
// =====================================================

// ============ MENÚS PRINCIPALES ============
export const MENU_PRINCIPAL = {
  keyboard: [
    [{ text: "📤 VENDER" }, { text: "📋 MIS CUENTAS" }],
    [{ text: "💰 SALDO" }, { text: "👥 REFERIDOS" }],
    [{ text: "💳 PAGO" }, { text: "⭐ VIP" }],
    [{ text: "🆘 SOPORTE" }, { text: "❓ AYUDA" }],
  ],
  resize_keyboard: true,
};

export const MENU_ADMIN = {
  keyboard: [
    [{ text: "📋 PENDIENTES" }, { text: "💸 RETIROS" }],
    [{ text: "⭐ VIP PENDIENTES" }, { text: "📨 MENSAJES" }],
    [{ text: "📊 ESTADÍSTICAS" }, { text: "🔙 VOLVER A MENÚ USUARIO" }],
  ],
  resize_keyboard: true,
};

// ============ TECLADOS AUXILIARES ============
export const TECLADO_CANCELAR = {
  keyboard: [[{ text: "❌ CANCELAR" }]],
  resize_keyboard: true,
};

export const TECLADO_ATRAS = {
  keyboard: [[{ text: "🔙 ATRÁS" }]],
  resize_keyboard: true,
};

export const TECLADO_SALDO = {
  keyboard: [[{ text: "💸 RETIRAR" }, { text: "🔙 ATRÁS" }]],
  resize_keyboard: true,
};

export const TECLADO_PAGO_NUEVO = {
  keyboard: [
    [{ text: "🏦 MiTransfer" }, { text: "💳 TARJETA" }],
    [{ text: "🔙 ATRÁS" }],
  ],
  resize_keyboard: true,
};

export const TECLADO_VIP_LISTO = {
  keyboard: [[{ text: "✅ LISTO" }, { text: "❌ CANCELAR" }]],
  resize_keyboard: true,
};

// ============ INLINE KEYBOARDS ============
export function inlineInfoCompleta() {
  return {
    inline_keyboard: [
      [{ text: "ℹ️ Toca aquí para más información", callback_data: "info_completa" }],
    ],
  };
}

export function inlineCambiarMetodo() {
  return {
    inline_keyboard: [
      [{ text: "🔄 CAMBIAR MÉTODO DE PAGO", callback_data: "cambiar_metodo" }],
    ],
  };
}

export function inlineAprobarRechazarCuenta(cuentaId) {
  return {
    inline_keyboard: [[
      { text: "✅ APROBAR", callback_data: `aprobar_cuenta_${cuentaId}` },
      { text: "❌ RECHAZAR", callback_data: `rechazar_cuenta_${cuentaId}` },
    ]],
  };
}

export function inlineAprobarRechazarRetiro(retiroId, userId) {
  return {
    inline_keyboard: [[
      { text: "✅ APROBAR", callback_data: `aprobar_retiro_${retiroId}_${userId}` },
      { text: "❌ RECHAZAR", callback_data: `rechazar_retiro_${retiroId}_${userId}` },
    ]],
  };
}

export function inlineAprobarRechazarVip(solId, vip, userId) {
  return {
    inline_keyboard: [[
      { text: "✅ APROBAR", callback_data: `aprobar_vip_${solId}_${vip}_${userId}` },
      { text: "❌ RECHAZAR", callback_data: `rechazar_vip_${solId}_${userId}` },
    ]],
  };
}

export function inlineResponder(userId) {
  return {
    inline_keyboard: [[
      { text: "📨 RESPONDER", callback_data: `responder_${userId}` },
    ]],
  };
}

// ============ TECLADO DINÁMICO PARA VIP ============
export function tecladoVip(vipActual, vipActivo) {
  const filas = [];
  if (!vipActivo || vipActual !== 1) filas.push([{ text: "VIP 1 - 2000 cup" }]);
  if (!vipActivo || vipActual !== 2) filas.push([{ text: "VIP 2 - 1500 cup" }]);
  if (!vipActivo || vipActual !== 3) filas.push([{ text: "VIP 3 - 1000 cup" }]);
  filas.push([{ text: "🔙 ATRÁS" }]);
  return { keyboard: filas, resize_keyboard: true };
    }
