const bcrypt = require("bcrypt");

// Base de datos simulada
const usersDB = [
  {
    username: "admin",
    password: "123456", // texto plano (modo vulnerable)
    hashedPassword: bcrypt.hashSync("123456", 10), // modo seguro
    failedAttempts: 0,
    locked: false,
  },
  {
    username: "user1",
    password: "password",
    hashedPassword: bcrypt.hashSync("password", 10),
    failedAttempts: 0,
    locked: false,
  },
];

const loginPage = (req, res) => {
  if (!req.session.mode) req.session.mode = "vulnerable";
  res.render("labs/broken-auth/auth", {
    mode: req.session.mode,
    title: "Laboratorio Broken Authentication"
  });
};

const switchMode = (req, res) => {
  req.session.mode =
    req.session.mode === "vulnerable" ? "secure" : "vulnerable";
  res.redirect("/labs/broken-auth");
};

const loginSubmit = async (req, res) => {
  const { username, password } = req.body;
  const mode = req.session.mode || "vulnerable";

  const user = usersDB.find((u) => u.username === username);

  let success = false;
  let message = "";

  if (!user) {
    message = "Usuario no encontrado.";
  } else {
    if (mode === "vulnerable") {
      // ❌ Vulnerable: solo verifica username
      success = true;
      message =
        "Modo vulnerable: el sistema NO verifica la contraseña.";
    } else {
      // 🔐 Seguro: comprobar bloqueo
      if (user.locked) {
        message = "Cuenta bloqueada por demasiados intentos fallidos.";
      } else {
        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );

        if (passwordMatch) {
          success = true;
          user.failedAttempts = 0;
          message = "Contraseña verificada con bcrypt.";
        } else {
          user.failedAttempts++;

          if (user.failedAttempts >= 3) {
            user.locked = true;
            message =
              "Cuenta bloqueada tras 3 intentos fallidos.";
          } else {
            message =
              "Contraseña incorrecta (modo seguro).";
          }
        }
      }
    }
  }

  if (success) {
    req.session.user = username;
  }

  const isVulnerableSuccess = success && mode === "vulnerable";

  res.render("labs/broken-auth/auth", {
    mode,
    title: "Laboratorio Broken Authentication",
    lastResult: success
      ? `Login exitoso (${mode.toUpperCase()})`
      : `Login fallido (${mode.toUpperCase()})`,
    explanation: message,
    isVulnerableSuccess,
  });
};

const showCode = (req, res) => {
  const code = `
🔹 Asi seria el código vulnerable:

- si no se verifica la contraseña, se establece success = false;

const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
if (passwordMatch) {
   success = false;  // No se verifica contraseña
}

🔹 Asi seria el código seguro:

- si se verifica la contraseña, se establece success = true;

const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
if (passwordMatch) {
   success = true;  // Se verifica contraseña

}
  `;

  const explanation = `
Este laboratorio muestra una vulnerabilidad de Broken Authentication.

🔹 Modo vulnerable:

- El sistema NO verifica la contraseña.
- Cualquiera puede iniciar sesión como cualquier usuario sin conocer la contraseña.
- No hay bloqueos tras intentos fallidos.
- Las contraseñas se almacenan en texto plano, lo que es extremadamente inseguro.


🔹 Modo seguro:

- El sistema verifica la contraseña.
- Se utiliza bcrypt para almacenar contraseñas de forma segura.
- Se implementan bloqueos tras múltiples intentos fallidos.
- Se recomienda utilizar autenticación multifactor (MFA) para mayor seguridad.

🔹 Riesgo: 

- Un atacante puede inyectar SQL y acceder a datos no autorización.
- Una vez que el atacante puede manipular la consulta, puede extraer datos sensibles 
 o ejecutar comandos arbitrarios.

🔹 Mitigación: 

- Usar funciones de encriptación robustas.
- Implementar bloqueos tras múltiples intentos fallidos.
- Utilizar autenticación multifactor (MFA).

  `;
  res.render("code", { 
    title: "Laboratorio Broken Authentication: Código vulnerable",
    code,
    explanation,
   backLink: "/labs/broken-auth"
  });
};

module.exports = {
  loginPage,
  loginSubmit,
  switchMode,
  showCode,
};