// =====================================================
// CAPA DE ACCESO A LA BASE DE DATOS D1
// =====================================================

// ============ USUARIOS ============
export async function obtenerUsuario(env, userId) {
  return await env.GDB
    .prepare("SELECT * FROM usuarios WHERE user_id = ?")
    .bind(userId)
    .first();
}

export async function crearUsuario(env, userId, username, nombre, codigoRef, referidoPor) {
  const fecha = new Date().toISOString();
  await env.GDB
    .prepare(`INSERT INTO usuarios (user_id, username, nombre, codigo_ref, referido_por, fecha)
              VALUES (?, ?, ?, ?, ?, ?)`)
    .bind(userId, username, nombre, codigoRef, referidoPor, fecha)
    .run();
}

export async function sumarSaldo(env, userId, cantidad) {
  await env.GDB
    .prepare("UPDATE usuarios SET saldo = saldo + ? WHERE user_id = ?")
    .bind(cantidad, userId)
    .run();
}

export async function sumarSaldoRef(env, userId, cantidad) {
  await env.GDB
    .prepare("UPDATE usuarios SET saldo_ref = saldo_ref + ? WHERE user_id = ?")
    .bind(cantidad, userId)
    .run();
}

export async function contarReferidos(env, userId) {
  const r = await env.GDB
    .prepare("SELECT COUNT(*) as total FROM usuarios WHERE referido_por = ?")
    .bind(userId)
    .first();
  return r ? r.total : 0;
}

// ============ CUENTAS ============
export async function insertarCuenta(env, userId, usuario, contrasena, precio) {
  const fecha = new Date().toISOString();
  const r = await env.GDB
    .prepare(`INSERT INTO cuentas (user_id, usuario, contrasena, precio, fecha)
              VALUES (?, ?, ?, ?, ?)`)
    .bind(userId, usuario, contrasena, precio, fecha)
    .run();
  return r.meta.last_row_id;
}

export async function obtenerCuenta(env, id) {
  return await env.GDB
    .prepare("SELECT * FROM cuentas WHERE id = ?")
    .bind(id)
    .first();
}

export async function actualizarEstadoCuenta(env, id, estado) {
  await env.GDB
    .prepare("UPDATE cuentas SET estado = ? WHERE id = ?")
    .bind(estado, id)
    .run();
}

export async function cuentasDeUsuario(env, userId) {
  const r = await env.GDB
    .prepare("SELECT usuario, estado, precio, fecha FROM cuentas WHERE user_id = ? ORDER BY fecha DESC")
    .bind(userId)
    .all();
  return r.results || [];
}

export async function cuentasPendientes(env) {
  const r = await env.GDB
    .prepare(`SELECT c.id, u.nombre, u.username, c.usuario, c.precio
              FROM cuentas c JOIN usuarios u ON c.user_id = u.user_id
              WHERE c.estado = 'pendiente'`)
    .all();
  return r.results || [];
}

// ============ MÉTODOS DE PAGO ============
export async function obtenerMetodoPago(env, userId) {
  return await env.GDB
    .prepare("SELECT * FROM metodos_pago WHERE user_id = ?")
    .bind(userId)
    .first();
}

export async function guardarMetodoPago(env, userId, tipo, numero, telefono) {
  await env.GDB
    .prepare(`INSERT INTO metodos_pago (user_id, tipo, numero, telefono, confirmado)
              VALUES (?, ?, ?, ?, 1)
              ON CONFLICT(user_id) DO UPDATE SET
                tipo = excluded.tipo,
                numero = excluded.numero,
                telefono = excluded.telefono,
                confirmado = 1`)
    .bind(userId, tipo, numero, telefono)
    .run();
}

// ============ RETIROS ============
export async function insertarRetiro(env, userId, monto) {
  const fecha = new Date().toISOString();
  const r = await env.GDB
    .prepare("INSERT INTO retiros (user_id, monto, fecha) VALUES (?, ?, ?)")
    .bind(userId, monto, fecha)
    .run();
  return r.meta.last_row_id;
}

export async function obtenerRetiro(env, id) {
  return await env.GDB
    .prepare("SELECT * FROM retiros WHERE id = ?")
    .bind(id)
    .first();
}

export async function actualizarEstadoRetiro(env, id, estado) {
  await env.GDB
    .prepare("UPDATE retiros SET estado = ? WHERE id = ?")
    .bind(estado, id)
    .run();
}

export async function retirosPendientes(env) {
  const r = await env.GDB
    .prepare(`SELECT r.id, u.nombre, u.username, r.monto, u.user_id
              FROM retiros r JOIN usuarios u ON r.user_id = u.user_id
              WHERE r.estado = 'pendiente'`)
    .all();
  return r.results || [];
}

export async function restarSaldo(env, userId, monto) {
  await env.GDB
    .prepare("UPDATE usuarios SET saldo = saldo - ? WHERE user_id = ?")
    .bind(monto, userId)
    .run();
}

export async function ajustarSaldosRetiro(env, userId, monto) {
  const u = await obtenerUsuario(env, userId);
  if (!u) return;
  if (u.saldo >= monto) {
    await env.GDB
      .prepare("UPDATE usuarios SET saldo = saldo - ? WHERE user_id = ?")
      .bind(monto, userId)
      .run();
  } else {
    const restante = monto - u.saldo;
    await env.GDB
      .prepare("UPDATE usuarios SET saldo = 0, saldo_ref = saldo_ref - ? WHERE user_id = ?")
      .bind(restante, userId)
      .run();
  }
}

// ============ VIP ============
export async function insertarSolicitudVip(env, userId, vip, comprobanteId) {
  const fecha = new Date().toISOString();
  const r = await env.GDB
    .prepare(`INSERT INTO solicitudes_vip (user_id, vip, comprobante_id, fecha)
              VALUES (?, ?, ?, ?)`)
    .bind(userId, vip, comprobanteId, fecha)
    .run();
  return r.meta.last_row_id;
}

export async function actualizarEstadoVip(env, id, estado) {
  await env.GDB
    .prepare("UPDATE solicitudes_vip SET estado = ? WHERE id = ?")
    .bind(estado, id)
    .run();
}

export async function activarVip(env, userId, vip) {
  await env.GDB
    .prepare("UPDATE usuarios SET vip = ?, vip_activo = 1 WHERE user_id = ?")
    .bind(vip, userId)
    .run();
}

export async function solicitudesVipPendientes(env) {
  const r = await env.GDB
    .prepare(`SELECT s.id, u.nombre, u.username, s.vip, u.user_id
              FROM solicitudes_vip s JOIN usuarios u ON s.user_id = u.user_id
              WHERE s.estado = 'pendiente'`)
    .all();
  return r.results || [];
}

// ============ SOPORTE ============
export async function insertarSoporte(env, userId, mensaje, fotoId = null) {
  const fecha = new Date().toISOString();
  await env.GDB
    .prepare("INSERT INTO soporte (user_id, mensaje, foto_id, fecha) VALUES (?, ?, ?, ?)")
    .bind(userId, mensaje, fotoId, fecha)
    .run();
}

export async function mensajesSoporteNuevos(env) {
  const r = await env.GDB
    .prepare(`SELECT s.id, u.nombre, u.username, u.user_id, s.mensaje
              FROM soporte s JOIN usuarios u ON s.user_id = u.user_id
              WHERE s.respondido = 0 ORDER BY s.fecha DESC`)
    .all();
  return r.results || [];
}

export async function marcarSoporteRespondido(env, userId) {
  await env.GDB
    .prepare("UPDATE soporte SET respondido = 1 WHERE user_id = ? AND respondido = 0")
    .bind(userId)
    .run();
}

// ============ ESTADÍSTICAS ============
export async function obtenerEstadisticas(env) {
  const users = await env.GDB.prepare("SELECT COUNT(*) as t FROM usuarios").first();
  const cuentas = await env.GDB.prepare("SELECT COUNT(*) as t FROM cuentas").first();
  const aprob = await env.GDB.prepare("SELECT COUNT(*) as t FROM cuentas WHERE estado = 'aprobada'").first();
  const pagado = await env.GDB.prepare("SELECT SUM(precio) as t FROM cuentas WHERE estado = 'aprobada'").first();
  const retirado = await env.GDB.prepare("SELECT SUM(monto) as t FROM retiros WHERE estado = 'confirmado'").first();
  return {
    users: users?.t || 0,
    cuentas: cuentas?.t || 0,
    aprobadas: aprob?.t || 0,
    pagado: pagado?.t || 0,
    retirado: retirado?.t || 0,
  };
}

// ============ SESIONES CONVERSACIONALES ============
export async function obtenerSesion(env, userId) {
  const s = await env.GDB
    .prepare("SELECT estado, datos FROM sesiones WHERE user_id = ?")
    .bind(userId)
    .first();
  if (!s) return { estado: null, datos: {} };
  let datos = {};
  try { datos = s.datos ? JSON.parse(s.datos) : {}; } catch { datos = {}; }
  return { estado: s.estado, datos };
}

export async function guardarSesion(env, userId, estado, datos = {}) {
  const fecha = new Date().toISOString();
  await env.GDB
    .prepare(`INSERT INTO sesiones (user_id, estado, datos, actualizado)
              VALUES (?, ?, ?, ?)
              ON CONFLICT(user_id) DO UPDATE SET
                estado = excluded.estado,
                datos = excluded.datos,
                actualizado = excluded.actualizado`)
    .bind(userId, estado, JSON.stringify(datos), fecha)
    .run();
}

export async function limpiarSesion(env, userId) {
  await guardarSesion(env, userId, null, {});
}
