// =====================================================
// CONFIGURACIÓN CENTRAL DEL BOT
// =====================================================

export function getConfig(env) {
  return {
    BOT_TOKEN: env.BOT_TOKEN,
    ADMIN_ID: parseInt(env.ADMIN_ID, 10),
    CONTRASENA_OBLIGATORIA: env.CONTRASENA_OBLIGATORIA,
    NUMERO_MITRANSFER: env.NUMERO_MITRANSFER,
    WORKER_URL: env.WORKER_URL,
  };
}

// =====================================================
// ESTADOS DE CONVERSACIÓN (equivalente a ConversationHandler)
// =====================================================
export const ESTADOS = {
  IDLE: null,
  VENDIENDO_USUARIO: "VENDIENDO_USUARIO",
  VENDIENDO_CONTRASENA: "VENDIENDO_CONTRASENA",
  PAGO_METODO: "PAGO_METODO",
  PAGO_NUMERO: "PAGO_NUMERO",
  PAGO_TELEFONO: "PAGO_TELEFONO",
  RETIRO_MONTO: "RETIRO_MONTO",
  VIP_SELECCION: "VIP_SELECCION",
  VIP_LISTO: "VIP_LISTO",
  VIP_CAPTURA: "VIP_CAPTURA",
  SOPORTE_ESCRIBIENDO: "SOPORTE_ESCRIBIENDO",
  RESPUESTA_ESPERA: "RESPUESTA_ESPERA",
};

// =====================================================
// PRECIOS POR VIP
// =====================================================
export const PRECIOS_VIP = {
  normal: { cuenta: 60, referido: 15 },
  1: { cuenta: 150, referido: 70, costo: 2000 },
  2: { cuenta: 100, referido: 50, costo: 1500 },
  3: { cuenta: 70, referido: 30, costo: 1000 },
};

// =====================================================
// CONSTANTES GENERALES
// =====================================================
export const MINIMO_RETIRO = 200;
