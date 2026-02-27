const bcrypt = require("bcrypt");

const usersDB = [
  {
    id: 1,
    username: "admin",
    password: "admin",
    email: "admin@lab.com",
    hashedPassword: bcrypt.hashSync("123456", 10),
    failedAttempts: 0,
    locked: false,
  },
  {
    id: 2,
    username: "user",
    password: "user",
    email: "user@lab.com",
    hashedPassword: bcrypt.hashSync("user", 10),
    failedAttempts: 0,
    locked: false,
  },
  {
    id: 3,
    username: "guest",
    password: "guest",
    email: "guest@lab.com",
    hashedPassword: bcrypt.hashSync("guest", 10),
    failedAttempts: 0,
    locked: false,
  },
];

const fakeLogin = (req, res) => {
    req.session.userId = parseInt(req.params.id);
    res.redirect("/labs/idor");
}

const indexPage = (req, res) => {
  if (!req.session.mode) 
    req.session.mode = "vulnerable";
  if (!req.session.userId) 
    req.session.userId = 1; // Simula que el usuario "user" está logado
  
  req.session.lastVisitedId = undefined;

  res.render("labs/idor/index", {
    title: "Laboratorio IDOR",
    mode: req.session.mode,
    userId: req.session.userId,
    usersDB,
  });
};

const switchMode = (req, res) => {
  req.session.mode =
    req.session.mode === "vulnerable" ? "secure" : "vulnerable";
  res.redirect("/labs/idor");
};

const profilePage = (req, res) => {
  const mode = req.session.mode || "vulnerable";
  const requestedId = parseInt(req.query.id);

  

  const requestedUser = usersDB.find(u => u.id === requestedId);
  if (!requestedUser) {
    return res.send("No se encontró el usuario.");
  };

const lastVisitedId = req.session.lastVisitedId;
const idWasManipulated = lastVisitedId !== undefined && requestedId !== lastVisitedId;

  req.session.lastVisitedId = requestedId;

  if (mode === "vulnerable") {
    // Solo en vulnerable activamos el banner si accedes a otro perfil
    return res.render("labs/idor/profile", {
      title: "Perfil de usuario",
      mode,
      user: requestedUser,
      idorExploited: idWasManipulated,
    });

  } else {
    // En modo seguro, bloqueamos el acceso si no es tu propio perfil
    if (idWasManipulated) {
      return res.send("⚠️ Acceso denegado: no tienes permiso para ver este perfil.");
    }
  }

    res.render("labs/idor/profile", {
      title: "Perfil de usuario",
      mode,
      user: requestedUser,
      idorExploited: false,
    });
};

const showCode = (req, res) => {
  const code = `

  🔹Asi seria el código vulnerable:

- En modo vulnerable, no se valida si el usuario logueado tiene permiso para acceder al perfil solicitado.
- Puede acceder a cualquier perfil simplemente cambiando el ID en la URL (por ejemplo, ?id=2 → ?id=3).
- codigo: 
  const requestedId = parseInt(req.query.id);
  const requestedUser = usersDB.find(u => u.id === requestedId);
  res.render("labs/idor/profile", { user: requestedUser });

  🔹 Asi seria el código seguro:
  
- En modo seguro, se bloquea el acceso si el ID no coincide con el usuario logueado.
- codigo:

  const requestedId = parseInt(req.query.id);
  const requestedUser = usersDB.find(u => u.id === requestedId);
  if (!requestedUser) {
    return res.send("No se encontró el usuario.");
  };

  `;

  const explanation = `
  Este Laboratorio muestra una vulnerabilidad Insecure Direct Object Reference (IDOR).

  La vulnerabilidad IDOR permite que un atacante acceda a recursos de otros usuarios
  simplemente cambiando parámetros en la URL (por ejemplo, ?id=2 → ?id=3).

  🔹 modo vulnerable:

  - No se valida si el usuario logueado tiene permiso para acceder al perfil solicitado.
  - Puede acceder a cualquier perfil simplemente cambiando el ID en la URL (por ejemplo, ?id=2 → ?id=3).
  - Esto puede exponer información sensible de otros usuarios.

  🔹 modo seguro:

  - Se bloquea el acceso si el ID no coincide con el usuario logueado.
  - Solo puedes acceder a tu propio perfil, incluso si intentas cambiar el ID en la URL.
  - Esto previene que los usuarios accedan a información de otros usuarios sin autorización.
  
  🔹 Riesgo:

  - Una vez que el atacante puede manipular la URL, puede acceder a perfiles de otros usuarios.
  - Esto puede exponer datos sensibles de otros usuarios.

  
  🔹 Mitigacion:
  - Validar siempre en el backend que el usuario logueado tiene permisos sobre el recurso.
  - No exponer identificadores directos secuenciales.
  - Implementar controles de acceso basados en roles o ownership.

  `;

  res.render("code", {
    title: "Código y explicación – IDOR",
    code,
    explanation,
    backLink: "/labs/idor",
  });
};

module.exports = {
  indexPage,
  switchMode,
  profilePage,
  fakeLogin,
  showCode,
};
