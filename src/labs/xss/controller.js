// src/labs/xss/controller.js

// Mostrar formulario
const showForm = (req, res) => {
  if (!req.session.mode) {
    req.session.mode = "vulnerable";
  }

  res.render("labs/xss/input", { 
    mode: req.session.mode,
    userInput: "",
    result: "",
    title: "Laboratorio XSS"
  });
};

// Cambiar modo
const switchMode = (req, res) => {
  req.session.mode = req.session.mode === "vulnerable" ? "secure" : "vulnerable";
  res.redirect("/labs/xss");
};

// Procesar input
const submitForm = (req, res) => {
  const { userInput } = req.body;
  const mode = req.session.mode || "vulnerable";
  let result;

  if (mode === "vulnerable") {
    // Modo vulnerable: inyección directa en HTML
    result = userInput;
  } else {
    // Modo seguro: escapamos caracteres especiales para evitar XSS
    result = userInput
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function isXSS(payload) {
  if (!payload) return false;
  const lower = payload.toLowerCase();
  // Buscamos patrones comunes de XSS
  return (
    lower.includes("<script") ||            // <script>alert('XSS')</script>
    lower.includes("onerror") ||            // <img src=x onerror=...>
    lower.includes("onfocus") ||            // <input autofocus onfocus=...>
    lower.includes("javascript:") ||        // href="javascript:alert(1)"
    lower.includes("onmouseover")           // eventos inline peligrosos
  );
}

  const xssTriggered = isXSS(userInput) && mode === "vulnerable";

  res.render("labs/xss/input", {
    mode,
    userInput,
    result,
    title: "Laboratorio XSS",
    lastInput: userInput,
    xssTriggered,
  });
};



// Mostrar código vulnerable
const showCode = (req, res) => {

  const code = `
🔹 Asi seria el código vulnerable:

<div>
  ${"<%- userInput %>"}  <!-- inyección directa -->
</div>

🔹 Asi seria el código seguro:
<div>
  ${"&lt;% userInput.replace(...) %>"}  <!-- escape de caracteres -->
</div>
  `;

const explanation = `
Este laboratorio muestra vulnerabilidad XSS.

🔹 Modo vulnerable: 

- La variable input se inyecta directamente en el HTML.
- No se escapa el input para evitar que se interprete como HTML.

🔹 Modo seguro: 

- La variable input se escapa para evitar que se interprete como HTML.
- Se reemplazan caracteres especiales por sus entidades HTML correspondientes.

🔹 Riesgo: 

- Una vez que el atacante puede manipular la variable input, puede inyectar código malicioso en el navegador de la víctima.
- Esto puede llevar a robo de cookies, redirecciones maliciosas, o incluso control total del navegador.

🔹 Mitigación:

- Escapar siempre los inputs o usar funciones de sanitización.
- Validar siempre los inputs.
- Implementar controles de acceso adecuados.

  `;

  res.render("code", {
    title: "Laboratorio XSS: Código vulnerable",
    code,
    explanation,
    backLink: "/labs/xss"
  });
};  


module.exports = {
  showForm,
  submitForm,
  switchMode,
  showCode,
};