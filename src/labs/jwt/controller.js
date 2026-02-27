const jwt = require("jsonwebtoken");

const SECRET = "supersecret123"; // Clave débil intencionada para el lab

// Usuario de prueba
const USERS = [
  { id: 1, email: "user@cyberlab.com", password: "password123", role: "user" },
];

const indexPage = (req, res) => {
  if (!req.session.mode) req.session.mode = "vulnerable";

  res.render("labs/jwt/local", {
    title: "Laboratorio JWT Attacks",
    mode: req.session.mode,
    token: null,
    decodedPayload: null,
    message: null,
    jwtExploited: false,
  });
};

const switchMode = (req, res) => {
  req.session.mode =
    req.session.mode === "vulnerable" ? "secure" : "vulnerable";
  res.redirect("/labs/jwt");
};

const login = (req, res) => {
  const { email, password } = req.body;
  const mode = req.session.mode || "vulnerable";

  const user = USERS.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.render("labs/jwt/local", {
      title: "Laboratorio JWT Attacks",
      mode,
      token: null,
      decodedPayload: null,
      message: "❌ Credenciales incorrectas. Prueba con user@cyberlab.com / password123",
      jwtExploited: false,
    });
  }

  // Generamos el JWT con rol de usuario normal
  const payload = { id: user.id, email: user.email, role: user.role };
  const token = jwt.sign(payload, SECRET, { algorithm: "HS256", expiresIn: "1h" });

  // Decodificamos para mostrarlo al usuario
  const parts = token.split(".");
  const decodedHeader = JSON.parse(Buffer.from(parts[0], "base64").toString());
  const decodedPayload = JSON.parse(Buffer.from(parts[1], "base64").toString());

  res.render("labs/jwt/local", {
    title: "Laboratorio JWT Attacks",
    mode,
    token,
    decodedHeader: JSON.stringify(decodedHeader, null, 2),
    decodedPayload: JSON.stringify(decodedPayload, null, 2),
    message: `✅ Login correcto! Has iniciado sesión como: ${user.role.toUpperCase()}`,
    jwtExploited: false,
  });
};

const admin = (req, res) => {
  const mode = req.session.mode || "vulnerable";
  const token = req.query.token;

  if (!token) {
    return res.render("labs/jwt/local", {
      title: "Laboratorio JWT Attacks",
      mode,
      token: null,
      decodedHeader: null,
      decodedPayload: null,
      message: "⚠️ No has proporcionado ningún token. Inicia sesión primero.",
      jwtExploited: false,
    });
  }

  try {
    let payload;

    if (mode === "vulnerable") {
      // MODO VULNERABLE: acepta cualquier token incluyendo alg:none y payloads modificados
      const parts = token.split(".");
      const header = JSON.parse(Buffer.from(parts[0], "base64url").toString());

      if (header.alg === "none" || header.alg === "None" || header.alg === "NONE") {
        // Acepta token sin firma (algoritmo none)
        payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
      } else {
        // Verifica pero sin comprobar el rol
        payload = jwt.verify(token, SECRET);
      }

      if (payload.role === "admin") {
        return res.render("labs/jwt/admin", {
          title: "Panel de Administración",
          mode,
          payload: JSON.stringify(payload, null, 2),
          jwtExploited: true,
        });
      } else {
        return res.render("labs/jwt/local", {
          title: "Laboratorio JWT Attacks",
          mode,
          token,
          decodedHeader: null,
          decodedPayload: JSON.stringify(payload, null, 2),
          message: "🔒 Acceso denegado: tu rol es USER, necesitas ser ADMIN.",
          jwtExploited: false,
        });
      }

    } else {
      // MODO SEGURO: verifica firma y algoritmo estrictamente
      payload = jwt.verify(token, SECRET, { algorithms: ["HS256"] });

      if (payload.role === "admin") {
        return res.render("labs/jwt/admin", {
          title: "Panel de Administración",
          mode,
          payload: JSON.stringify(payload, null, 2),
          jwtExploited: false,
        });
      } else {
        return res.render("labs/jwt/local", {
          title: "Laboratorio JWT Attacks",
          mode,
          token,
          decodedHeader: null,
          decodedPayload: JSON.stringify(payload, null, 2),
          message: "🔒 Acceso denegado: tu rol es USER, necesitas ser ADMIN.",
          jwtExploited: false,
        });
      }
    }

  } catch (err) {
    return res.render("labs/jwt/local", {
      title: "Laboratorio JWT Attacks",
      mode,
      token,
      decodedHeader: null,
      decodedPayload: null,
      message: `⚠️ Token inválido: ${err.message}`,
      jwtExploited: false,
    });
  }
};

const showCode = (req, res) => {
  const code = `
🔹 Asi sería el codigo vulnerable:

- No se verifica la firma:

const header = JSON.parse(atob(token.split('.')[0]));
if (header.alg === 'none') {
  payload = JSON.parse(atob(token.split('.')[1]));
  // ⚠️ No se verifica la firma!
}

🔹 asi sería el codigo seguro: 

- Se verifica la firma y el algoritmo:

payload = jwt.verify(token, SECRET, { algorithms: ['HS256'] });
`;

  const explanation = `
Este Laboratorio muestra una vulnerabilidad de JSON Web Tokens (JWT).

  Un JSON Web Token (JWT) es un estándar para transmitir información entre partes
de forma segura. Se compone de tres partes separadas por puntos:
  - Header: algoritmo de firma
  - Payload: datos del usuario (rol, id, etc.)
  - Signature: firma que garantiza la integridad

🔹 ¿En qué consiste el ataque?
En modo vulnerable el servidor acepta tokens con algoritmo 'none',
lo que significa que no verifica la firma. Un atacante puede:
  1. Iniciar sesión y obtener su token JWT como usuario normal.
  2. Decodificar el payload (es solo Base64).
  3. Cambiar el rol de "user" a "admin".
  4. Eliminar la firma y cambiar el algoritmo a "none".
  5. Enviar el token manipulado y acceder al panel de admin.

🔹 Modo vulnerable:

- acepta algoritmo 'none' y no valida el rol.
- No se verifica la firma.
- Permite cualquier token con rol admin sin necesidad de clave.
- Un atacante puede modificar el payload y cambiar el rol a admin sin que 
  el servidor lo detecte.
- Un atacante puede manipular el payload para escalar privilegios.

🔹 Modo seguro:

- Fuerza algoritmo HS256 y verifica la firma.
- Valida la firma y el algoritmo.
- No permite el token con rol admin sin clave.
- Un atacante no puede modificar el payload sin que el servidor lo detecte.
- Un atacante no puede manipular el payload para escalar privilegios.

🔹 Impacto real:
- Escalada de privilegios sin necesidad de credenciales de admin.
- Acceso a paneles de administración y datos sensibles.
- Suplantación de identidad de cualquier usuario.

🔹 Prevención:
- Forzar siempre un algoritmo concreto (HS256, RS256).
- Nunca aceptar el algoritmo 'none'.
- Verificar siempre la firma antes de leer el payload.
- Usar claves secretas largas y aleatorias.
`;

  res.render("code", {
    title: "Código vulnerable - JWT Attacks",
    code,
    explanation,
    backLink: "/labs/jwt",
  });
};

module.exports = { indexPage, switchMode, login, admin, showCode };
