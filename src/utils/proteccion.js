import { logger } from "./logger";

// Escudo de emergencia del incidente del 2026-09-16.
// El atacante fue saltando de ruta: login, luego forgotPassword, newPassword y
// full-info. Esto limita el ritmo de peticiones y cierra las rutas que permitian
// tomar cuentas o leer datos de clientes sin autenticacion.

const contadores = new Map();

function excedido(clave, maximo, ventanaMs) {
  const ahora = Date.now();
  const previos = (contadores.get(clave) || []).filter((t) => ahora - t < ventanaMs);
  previos.push(ahora);
  contadores.set(clave, previos);
  return previos.length > maximo;
}

setInterval(() => {
  const ahora = Date.now();
  for (const [clave, marcas] of contadores) {
    const vivas = marcas.filter((t) => ahora - t < 3600000);
    if (vivas.length === 0) contadores.delete(clave);
    else contadores.set(clave, vivas);
  }
}, 300000).unref();

export function ipDe(req) {
  return (
    req.header("cf-connecting-ip") ||
    req.header("x-forwarded-for") ||
    (req.socket ? req.socket.remoteAddress : null) ||
    "desconocida"
  );
}

// Limite generico por IP. Se aplica a toda la API como red de seguridad, para que
// si el atacante se mueve a otra ruta tampoco pueda machacarla.
export function limiteGlobal(maximo = 120, ventanaMs = 60000) {
  return (req, res, next) => {
    if (excedido("global:" + ipDe(req), maximo, ventanaMs)) {
      logger.warn(`[proteccion]: limite global superado por ${ipDe(req)} en ${req.originalUrl}`);
      return res.status(429).json({ msg: "Demasiadas peticiones. Intenta de nuevo en un momento." });
    }
    next();
  };
}

// Limite estricto para rutas que mandan correos o cambian credenciales.
export function limiteEstricto(nombre, porIp, porObjetivo, ventanaMs = 60000) {
  return (req, res, next) => {
    const objetivo = String(
      (req.body && (req.body.email_user || req.body.email)) || req.params.email_user || ""
    ).toLowerCase();
    if (
      excedido(`${nombre}:ip:${ipDe(req)}`, porIp, ventanaMs) ||
      (objetivo && excedido(`${nombre}:obj:${objetivo}`, porObjetivo, ventanaMs))
    ) {
      logger.warn(`[proteccion]: limite de ${nombre} superado por ${ipDe(req)} sobre ${objetivo}`);
      return res.status(429).json({ msg: "Demasiados intentos. Espera unos minutos." });
    }
    next();
  };
}

// Ruta deshabilitada temporalmente.
export function deshabilitada(motivo) {
  return (req, res) => {
    logger.warn(`[proteccion]: ruta deshabilitada ${req.originalUrl} desde ${ipDe(req)}`);
    return res.status(503).json({ msg: motivo });
  };
}

// El cambio de contrasena SIN la contrasena anterior permitia tomar cualquier
// cuenta: el codigo enviado por correo solo se validaba en el navegador. Hasta que
// la validacion del codigo se haga en el servidor, solo se permite el cambio desde
// el perfil, que si envia la contrasena anterior.
export function exigirPasswordAnterior(req, res, next) {
  const anterior = req.body ? req.body.last_password : undefined;
  if (typeof anterior !== "string" || anterior.trim() === "") {
    logger.warn(
      `[proteccion]: intento de cambio de contrasena sin contrasena anterior sobre ${
        req.body && req.body.email_user
      } desde ${ipDe(req)}`
    );
    return res.status(503).json({
      msg: "La recuperacion de contrasena esta temporalmente deshabilitada. Contacta con atencion al cliente.",
    });
  }
  next();
}

// full-info devuelve la ficha completa del cliente (datos personales y de
// documentos). Estaba abierta sin autenticacion: cualquiera podia pedir la de
// cualquier correo. Ahora exige sesion iniciada y que sea la del propio usuario.
export function soloSuPropiaFicha(req, res, next) {
  const pedido = String(req.params.email_user || "").toLowerCase();
  const enSesion = String(
    (req.user && (req.user.email_user || req.user)) || ""
  ).toLowerCase();
  if (!req.isAuthenticated() || !enSesion || enSesion !== pedido) {
    logger.warn(`[proteccion]: acceso denegado a full-info de ${pedido} desde ${ipDe(req)}`);
    return res.status(403).json({ msg: "No autorizado." });
  }
  next();
}
