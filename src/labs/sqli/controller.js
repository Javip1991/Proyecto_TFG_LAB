// src/labs/sqli/controller.js
const sequelize = require("../../config/database");
const { QueryTypes } = require("sequelize");

// --- Funciones del laboratorio ---

// Mostrar formulario de login vulnerable
const loginPage = (req, res) => {
  if (!req.session.mode) {
    req.session.mode = "vulnerable"; //modo por defecto
  } 

  res.render("labs/sqli/login", { mode: req.session.mode }

  );
};

const switchMode = (req, res) => {
  req.session.mode = req.session.mode === "vulnerable" ? "secure" : "vulnerable";
  res.redirect("/labs/sqli");
};

// Procesar login vulnerable

const loginSubmit = async (req, res) => {
  const { email, password } = req.body;
  const mode = req.session.mode || "vulnerable";

  try {
    let users;
    let query;

    if (mode === "vulnerable") {
      query = `
        SELECT * FROM lab_sqli_users
        WHERE email = '${email}'
      `;
      console.log("QUERY VULNERABLE:", query);

      users = await sequelize.query(query, { type: QueryTypes.SELECT });

    } else {
      query = `
        SELECT * FROM lab_sqli_users
        WHERE email = :email
        AND password = :password
      `;
      console.log("QUERY SEGURA (parametrizada)");

      users = await sequelize.query(query, {
        replacements: { email, password },
        type: QueryTypes.SELECT,
      });
    }

    const isVulnerableSuccess = users.length > 0 && mode === "vulnerable";

    res.render("labs/sqli/login", {
      mode,
      title: "Laboratorio SQLi",
      lastQuery: query,
      lastResult: users.length > 0 
      ? `Login exitoso (${mode.toUpperCase()})`
      : `Login fallido (${mode.toUpperCase()})`,
      isVulnerableSuccess,
    });

  } catch (error) {
    console.error("ERROR SQL:", error);
    res.send("Error en laboratorio");
  }
};

// Mostrar código vulnerable
const showCode = (req, res) => {
  const code = `
🔹 Asi seria el código vulnerable:

const query = \`SELECT * FROM lab_sqli_users 
               WHERE email = '\${email}' 
               AND password = '\${password}'\`;

🔹 Asi seria el código seguro (parametrizada):

const query = \`SELECT * FROM lab_sqli_users 
               WHERE email = :email 
               AND password = :password\`;
  `;

const explanation = `
Este laboratorio muestra una vulnerabilidad de SQL Injection.

🔹 Modo vulnerable: 

- La consulta concatena directamente los inputs del usuario.
- No se valida ni sanitiza la entrada del usuario.
- Se ejecuta directamente la consulta SQL.


🔹 Modo seguro: 

- La consulta se ejecuta con parámetros parametrizados.
- Se utiliza la librería Sequelize para ejecutar consultas parametrizadas.
- Se valida siempre los inputs del usuario.
- Se implementan controles de acceso adecuados.
- Se utiliza funciones de encriptación robustas.

🔹 Riesgo: 

- Una vez que el atacante puede manipular la consulta, puede extraer datos sensibles 
 o ejecutar comandos arbitrarios.

🔹 Mitigación: 

- Validar siempre los inputs del usuario.
- Utilizar funciones de encriptación robustas.
- Implementar controles de acceso adecuados.

  `;

  res.render("code", {
    title: "Laboratorio SQL injection: Código vulnerable",
    code,
    explanation,
    backLink: "/labs/sqli"
  });   
};

// --- Exportar funciones correctamente ---
module.exports = {
  loginPage,
  loginSubmit,
  showCode,
  switchMode,
};