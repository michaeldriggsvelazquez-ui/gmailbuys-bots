// =====================================================
// TEXTOS LARGOS DEL BOT
// =====================================================

export function textoBienvenida(firstName, contrasena) {
  return (
    `✨ *¡BIENVENIDO(A) A GMAIL BUY'S, ${firstName}!* ✨\n\n` +
    `💸 *¿Qué es Gmail Buy's?*\n` +
    `Es un bot donde puedes **VENDER** tus cuentas Gmail nuevas y **GANAR DINERO** de verdad.\n\n` +
    `📌 *Requisitos para vender:*\n` +
    `✅ Cuentas **NUEVAS** (recién creadas)\n` +
    `✅ Usuario con **SOLO LETRAS** (sin números)\n` +
    `✅ Contraseña exacta: \`${contrasena}\`\n` +
    `✅ Sin cambios de contraseña\n` +
    `✅ Sin datos borrados\n\n` +
    `👇 *Usa los botones del menú para comenzar:*`
  );
}

export function textoInfoCompleta(contrasena, numeroMitransfer) {
  return (
    "📚 *GUÍA COMPLETA DE GMAIL BUY'S*\n\n" +
    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

    "🎯 *¿QUÉ ES ESTE BOT?*\n" +
    "Es un bot donde puedes **VENDER** tus cuentas Gmail nuevas y ganar dinero.\n" +
    "El administrador compra cuentas en buen estado y tú recibes el pago.\n\n" +

    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

    "📤 *BOTÓN: VENDER*\n" +
    "• Presiona este botón para vender una cuenta\n" +
    "• **Paso 1:** Envía el USUARIO (ej: micuenta@gmail.com)\n" +
    "  ⚠️ *SOLO LETRAS, sin números*\n" +
    `• **Paso 2:** Envía la CONTRASEÑA exacta: \`${contrasena}\`\n` +
    "• **Paso 3:** Espera la revisión del administrador\n" +
    "• Si es aprobada, el dinero se suma a tu saldo\n\n" +

    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

    "📋 *BOTÓN: MIS CUENTAS*\n" +
    "• Aquí puedes ver **TODAS** las cuentas que has vendido\n" +
    "• Cada cuenta muestra su estado: ✅ Aprobada, ❌ Rechazada, ⏳ Pendiente\n\n" +

    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

    "💰 *BOTÓN: SALDO*\n" +
    "• Muestra tu saldo actual dividido en:\n" +
    "  💵 **Ventas:** dinero de cuentas aprobadas\n" +
    "  👥 **Referidos:** dinero de amigos que se unieron\n" +
    "• Desde aquí puedes presionar 💸 RETIRAR para sacar tu dinero\n" +
    "• Mínimo de retiro: **200 cup**\n\n" +

    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

    "👥 *BOTÓN: REFERIDOS*\n" +
    "• Aquí está tu **ENLACE PERSONAL** para invitar amigos\n" +
    "• Cuando alguien se registra con tu enlace, **GANAS**:\n" +
    "  👤 Normal: 15 cup por amigo\n" +
    "  👑 VIP 1: 70 cup por amigo\n" +
    "  ✨ VIP 2: 50 cup por amigo\n" +
    "  💫 VIP 3: 30 cup por amigo\n" +
    "• El dinero se acumula en tu saldo de referidos\n\n" +

    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

    "💳 *BOTÓN: PAGO*\n" +
    "• Configura cómo quieres **recibir tus pagos**\n" +
    "• Puedes elegir entre:\n" +
    "  🏦 **MiTransfer** (número de 8 dígitos)\n" +
    "  💳 **Tarjeta** (número de 16 dígitos)\n" +
    "• El **número de confirmación** es tu propio teléfono\n" +
    "• Si ya tienes un método, puedes **CAMBIARLO** fácilmente desde el mismo mensaje\n\n" +

    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

    "⭐ *BOTÓN: VIP*\n" +
    "• Mejora tus ganancias con membresías VIP\n\n" +
    "*✨ MEMBRESÍAS VIP:*\n" +
    "━━━━━━━━━━━━━━━━━━\n" +
    "👑 *VIP 1 — 2000 cup*\n" +
    "  • Por cada cuenta: **150 cup**\n" +
    "  • Por cada referido: **70 cup**\n\n" +
    "✨ *VIP 2 — 1500 cup*\n" +
    "  • Por cada cuenta: **100 cup**\n" +
    "  • Por cada referido: **50 cup**\n\n" +
    "💫 *VIP 3 — 1000 cup*\n" +
    "  • Por cada cuenta: **70 cup**\n" +
    "  • Por cada referido: **30 cup**\n\n" +
    "👤 *SIN VIP:*\n" +
    "  • Por cada cuenta: **60 cup**\n" +
    "  • Por cada referido: **15 cup**\n" +
    "━━━━━━━━━━━━━━━━━━\n\n" +
    `💰 *Para pagar:* Envía el monto a la bolsa monedero MiTransfer: \`${numeroMitransfer}\`\n` +
    "📸 *Importante:* Envía la captura del pago\n\n" +

    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

    "🆘 *BOTÓN: SOPORTE*\n" +
    "• Contacta directamente con el administrador\n" +
    "• Puedes enviar **TEXTO** o **FOTOS**\n" +
    "• El admin te responderá a la brevedad\n\n" +

    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

    "❓ *BOTÓN: AYUDA*\n" +
    "• Muestra esta misma información\n\n" +

    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

    "📱 *¿CÓMO CREAR UNA CUENTA GMAIL NUEVA?*\n\n" +
    "*Paso a paso:*\n" +
    "1️⃣ Abre la aplicación **Gmail** en tu dispositivo\n" +
    "2️⃣ Toca el ícono de tu perfil en la **parte superior derecha**\n" +
    "3️⃣ Selecciona **'Añadir otra cuenta'**\n" +
    "4️⃣ Elige **'Crear cuenta'** → **'Para mí mismo'**\n" +
    "5️⃣ **Nombre:** Escribe **SOLO UN NOMBRE** (ej: María, Carlos, Ana) — Sin apellidos\n" +
    "6️⃣ **Apellido:** DÉJALO VACÍO\n" +
    "7️⃣ **Fecha de nacimiento:** DEBE SER ENTRE **2000 Y 2005**\n" +
    "8️⃣ **Usuario:** SOLO LETRAS, sin números\n" +
    `9️⃣ **Contraseña:** DEBE SER EXACTAMENTE \`${contrasena}\`\n` +
    "🔟 Acepta términos y ¡LISTO!\n\n" +

    "⚠️ *RECUERDA:*\n" +
    "✅ La cuenta debe ser **RECIÉN CREADA**\n" +
    "✅ **NO** le cambies la contraseña después\n" +
    "✅ **NO** borres ningún dato\n" +
    "✅ Debe estar en su estado **ORIGINAL**\n\n" +

    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

    "✨ *¡GRACIAS POR SER PARTE DE GMAIL BUY'S!* ✨"
  );
}

export function textoAyuda(contrasena, numeroMitransfer) {
  return (
    "❓ CENTRO DE AYUDA - GMAIL BUY'S\n\n" +
    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

    "📤 *¿CÓMO VENDER?*\n" +
    "1. Presiona '📤 VENDER'\n" +
    "2. Envía el **USUARIO** (ej: micuenta@gmail.com)\n" +
    "   ⚠️ *SOLO LETRAS, sin números*\n" +
    `3. Envía la **CONTRASEÑA** exacta: \`${contrasena}\`\n` +
    "4. Espera la revisión del administrador\n\n" +

    "📌 *REQUISITOS DE LAS CUENTAS:*\n" +
    "✅ Deben ser **NUEVAS** (recién creadas)\n" +
    "✅ Usuario con **SOLO LETRAS** (sin números)\n" +
    `✅ Contraseña exacta: \`${contrasena}\`\n` +
    "✅ Sin cambios de contraseña\n" +
    "✅ Sin datos borrados\n\n" +

    "💰 *PAGOS POR CUENTA:*\n" +
    "• Sin VIP: **60 cup**\n" +
    "• VIP 1: **150 cup**\n" +
    "• VIP 2: **100 cup**\n" +
    "• VIP 3: **70 cup**\n\n" +

    "👥 *REFERIDOS:*\n" +
    "• Comparte tu enlace personal\n" +
    "• Gana por cada amigo que se registre\n" +
    "• Los bonos varían según tu VIP:\n" +
    "  👤 Normal: **15 cup**\n" +
    "  👑 VIP 1: **70 cup**\n" +
    "  ✨ VIP 2: **50 cup**\n" +
    "  💫 VIP 3: **30 cup**\n\n" +

    "💳 *PAGO:*\n" +
    "• Configura tu método para recibir pagos\n" +
    "• Puedes elegir MiTransfer o Tarjeta\n" +
    "• Si ya tienes uno, puedes **CAMBIARLO** desde el mismo mensaje\n" +
    "• El número de confirmación es tu teléfono\n\n" +

    "💸 *RETIROS:*\n" +
    "• Mínimo para retirar: **200 cup**\n" +
    "• El admin confirmará y enviará comprobante\n\n" +

    "⭐ *VIP:*\n" +
    "• Mejora tus ganancias\n" +
    "• Precios especiales en ventas y referidos\n" +
    `• Paga a: \`${numeroMitransfer}\`\n\n` +

    "🆘 *SOPORTE:*\n" +
    "• Contacto directo con el admin\n" +
    "• Puedes enviar texto o fotos\n\n" +

    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

    "📱 *¿CÓMO CREAR UNA CUENTA GMAIL?*\n\n" +
    "1️⃣ Abre la app **Gmail**\n" +
    "2️⃣ Toca tu perfil → 'Añadir otra cuenta'\n" +
    "3️⃣ 'Crear cuenta' → 'Para mí mismo'\n" +
    "4️⃣ **Nombre:** SOLO UN NOMBRE (sin apellidos)\n" +
    "5️⃣ **Fecha nacimiento:** Entre 2000 y 2005\n" +
    "6️⃣ **Usuario:** SOLO LETRAS\n" +
    `7️⃣ **Contraseña:** \`${contrasena}\`\n\n` +

    "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +

    "✨ *¡GRACIAS POR VENDER CON NOSOTROS!* ✨"
  );
}

export function textoInfoVip() {
  return (
    "\n\n*✨ BENEFICIOS POR NIVEL:*\n" +
    "━━━━━━━━━━━━━━━━━━\n" +
    "👑 *VIP 1 — 2000 cup*\n" +
    "  • Por cada cuenta: **150 cup**\n" +
    "  • Por cada referido: **70 cup**\n\n" +
    "✨ *VIP 2 — 1500 cup*\n" +
    "  • Por cada cuenta: **100 cup**\n" +
    "  • Por cada referido: **50 cup**\n\n" +
    "💫 *VIP 3 — 1000 cup*\n" +
    "  • Por cada cuenta: **70 cup**\n" +
    "  • Por cada referido: **30 cup**\n\n" +
    "👤 *SIN VIP (GRATIS)*\n" +
    "  • Por cada cuenta: **60 cup**\n" +
    "  • Por cada referido: **15 cup**"
  );
    }
