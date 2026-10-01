// =====================================================
// MANEJO DE SESIONES CONVERSACIONALES (via D1)
// =====================================================

import {
  obtenerSesion as dbObtenerSesion,
  guardarSesion as dbGuardarSesion,
  limpiarSesion as dbLimpiarSesion,
} from "./db.js";

export async function getSession(env, userId) {
  return await dbObtenerSesion(env, userId);
}

export async function setSession(env, userId, estado, datos = {}) {
  return await dbGuardarSesion(env, userId, estado, datos);
}

export async function updateDatos(env, userId, nuevosDatos) {
  const ses = await dbObtenerSesion(env, userId);
  const datos = { ...ses.datos, ...nuevosDatos };
  return await dbGuardarSesion(env, userId, ses.estado, datos);
}

export async function clearSession(env, userId) {
  return await dbLimpiarSesion(env, userId);
                               }
