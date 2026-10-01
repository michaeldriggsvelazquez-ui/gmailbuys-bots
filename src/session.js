// =====================================================
// GESTIÓN DE SESIONES CONVERSACIONALES
// =====================================================
import { obtenerSesion, guardarSesion, limpiarSesion } from "./db.js";

// Devuelve el estado actual del usuario (o null si está en idle)
export async function getEstado(env, userId) {
  const s = await obtenerSesion(env, userId);
  return s.estado || null;
}

// Devuelve el objeto completo de la sesión {estado, datos}
export async function getSesion(env, userId) {
  return await obtenerSesion(env, userId);
}

// Establece el estado + datos opcionales
export async function setEstado(env, userId, estado, datos = {}) {
  await guardarSesion(env, userId, estado, datos);
}

// Actualiza solo el campo datos sin tocar el estado
export async function setDatos(env, userId, nuevosDatos) {
  const s = await obtenerSesion(env, userId);
  const datos = { ...s.datos, ...nuevosDatos };
  await guardarSesion(env, userId, s.estado, datos);
}

// Termina la conversación
export async function finSesion(env, userId) {
  await limpiarSesion(env, userId);
}

// Comprueba si el usuario está en el estado dado
export async function enEstado(env, userId, estado) {
  const actual = await getEstado(env, userId);
  return actual === estado;
  }
