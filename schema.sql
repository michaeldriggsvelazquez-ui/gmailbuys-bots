-- =====================================================
-- ESQUEMA DE BASE DE DATOS - GMAIL BUY'S BOT
-- =====================================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    user_id INTEGER PRIMARY KEY,
    username TEXT,
    nombre TEXT,
    saldo REAL DEFAULT 0,
    saldo_ref REAL DEFAULT 0,
    codigo_ref TEXT UNIQUE,
    referido_por INTEGER,
    vip INTEGER DEFAULT 0,
    vip_activo INTEGER DEFAULT 0,
    baneado INTEGER DEFAULT 0,
    fecha TEXT
);

-- Tabla de cuentas vendidas
CREATE TABLE IF NOT EXISTS cuentas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    usuario TEXT,
    contrasena TEXT,
    estado TEXT DEFAULT 'pendiente',
    precio REAL,
    fecha TEXT
);

-- Tabla de métodos de pago
CREATE TABLE IF NOT EXISTS metodos_pago (
    user_id INTEGER PRIMARY KEY,
    tipo TEXT,
    numero TEXT,
    telefono TEXT,
    confirmado INTEGER DEFAULT 0
);

-- Tabla de retiros
CREATE TABLE IF NOT EXISTS retiros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    monto REAL,
    estado TEXT DEFAULT 'pendiente',
    fecha TEXT,
    comprobante_id TEXT
);

-- Tabla de solicitudes VIP
CREATE TABLE IF NOT EXISTS solicitudes_vip (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    vip INTEGER,
    estado TEXT DEFAULT 'pendiente',
    fecha TEXT,
    comprobante_id TEXT
);

-- Tabla de soporte
CREATE TABLE IF NOT EXISTS soporte (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    mensaje TEXT,
    foto_id TEXT,
    fecha TEXT,
    respondido INTEGER DEFAULT 0
);

-- Tabla de sesiones conversacionales (reemplaza ConversationHandler)
CREATE TABLE IF NOT EXISTS sesiones (
    user_id INTEGER PRIMARY KEY,
    estado TEXT,
    datos TEXT,
    actualizado TEXT
);

-- Índices para acelerar consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_cuentas_user ON cuentas(user_id);
CREATE INDEX IF NOT EXISTS idx_cuentas_estado ON cuentas(estado);
CREATE INDEX IF NOT EXISTS idx_retiros_estado ON retiros(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_vip_estado ON solicitudes_vip(estado);
CREATE INDEX IF NOT EXISTS idx_soporte_respondido ON soporte(respondido);
CREATE INDEX IF NOT EXISTS idx_usuarios_ref ON usuarios(referido_por);
