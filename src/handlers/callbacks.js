// ============ APROBAR CUENTA ============
if (data.startsWith("aprobar_cuenta_")) {
  const cid = parseInt(data.split("_")[2], 10);
  const cuenta = await obtenerCuenta(env, cid);
  if (!cuenta) {
    console.error("Cuenta no encontrada:", cid);
    return;
  }

  const precio = Number(cuenta.precio) || 0;
  const uidVendedor = Number(cuenta.user_id);

  console.log("APROBAR cuenta:", cid, "user:", uidVendedor, "precio:", precio);

  // 1. Marcar cuenta como aprobada
  await actualizarEstadoCuenta(env, cid, "aprobada");

  // 2. Sumar saldo al vendedor
  await env.GDB
    .prepare("UPDATE usuarios SET saldo = COALESCE(saldo,0) + ? WHERE user_id = ?")
    .bind(precio, uidVendedor)
    .run();

  // 3. Verificación
  const check = await env.GDB
    .prepare("SELECT saldo FROM usuarios WHERE user_id = ?")
    .bind(uidVendedor)
    .first();
  console.log("Saldo después:", check?.saldo);

  // 4. Notificar al vendedor
  await enviarMensaje(config.BOT_TOKEN, uidVendedor,
    `✅ *¡FELICIDADES! TU CUENTA FUE APROBADA* 🎉\n\n` +
    `💰 Se han sumado **+${precio} cup** a tu saldo.\n` +
    `✨ ¡Gracias por vender con nosotros!`
  );

  await editarMensaje(config.BOT_TOKEN, chatId, messageId,
    (cb.message.caption || cb.message.text) + "\n\n✅ *APROBADA* - El usuario ya recibió su pago."
  );
  return;
    }
