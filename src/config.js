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
// HELPERS DE PRECIOS
// =====================================================

// Devuelve SOLO el número de precio de cuenta (nunca undefined)
export function precioCuentaSegunVip(vip, vipActivo) {
  const v = Number(vip) || 0;
  const a = Number(vipActivo) || 0;
  if (a === 1 && v === 1) return PRECIOS_VIP[1].cuenta;
  if (a === 1 && v === 2) return PRECIOS_VIP[2].cuenta;
  if (a === 1 && v === 3) return PRECIOS_VIP[3].cuenta;
  return PRECIOS_VIP.normal.cuenta;
}

// Devuelve SOLO el número de precio de referido
export function precioReferidoSegunVip(vip, vipActivo) {
  const v = Number(vip) || 0;
  const a = Number(vipActivo) || 0;
  if (a === 1 && v === 1) return PRECIOS_VIP[1].referido;
  if (a === 1 && v === 2) return PRECIOS_VIP[2].referido;
  if (a === 1 && v === 3) return PRECIOS_VIP[3].referido;
  return PRECIOS_VIP.normal.referido;
}

export const MINIMO_RETIRO = 200;
