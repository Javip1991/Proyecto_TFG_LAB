const axios = require("axios");

const indexPage = (req, res) => {
  if (!req.session.mode)
    req.session.mode = "vulnerable";

  res.render("labs/ssrf/local", {
    title: "Laboratorio SSRF",
    mode: req.session.mode,
    result: null,
    ssrfExploited: false,
  });
};

const switchMode = (req, res) => {
  req.session.mode =
    req.session.mode === "vulnerable" ? "secure" : "vulnerable";
  res.redirect("/labs/ssrf");
};

const fetchUrl = async (req, res) => {
  const mode = req.session.mode || "vulnerable";
  const url = req.body.url;

  let ssrfExploited = false;
  let result = "";

  try {
    if (mode === "secure") {
      if (
        url.includes("localhost") ||
        url.includes("127.0.0.1") ||
        url.includes("0.0.0.0") ||
        url.includes("internal") ||
        url.includes("admin") ||
        url.includes("/secret")
      ) {
        return res.render("labs/ssrf/local", {
          title: "Laboratorio SSRF",
          mode,
          result: "⚠️ Acceso denegado: no tienes permiso para acceder a esta URL.",
          ssrfExploited: false,
        });
      }
    }

    const response = await axios.get(url);

    const rawData = typeof response.data === 'string'
      ? response.data
      : JSON.stringify(response.data, null, 2);
    
  if (response.headers['content-type']?.includes('text/html')) {
    result = `✅ Petición realizada con éxito a: ${url}\n\n` +
           `📄 El servidor respondió con una página HTML.\n` +
           `🔍 Código de estado: ${response.status}\n` +
           `📦 Tamaño de la respuesta: ${response.data.length} bytes\n\n` +
           `⚠️ En un ataque SSRF real, el atacante podría leer todo el contenido\n` +
           `   de esta respuesta, incluyendo datos sensibles o paneles de administración.\n\n` +
           `--- Contenido de la respuesta ---\n` +
           rawData.substring(0, 500);
} else {
    result = rawData.substring(0, 500);
}

    if (
      mode === "vulnerable" &&
      (url.includes("localhost") ||
        url.includes("127.0.0.1") ||
        url.includes("0.0.0.0") ||
        url.includes("internal") ||
        url.includes("admin") ||
        url.includes("/secret"))
    ) {
      ssrfExploited = true;
    }

  } catch (err) {
    result = `⚠️ Error al acceder a la URL: ${err.message}`;
  }

  res.render("labs/ssrf/local", {
    title: "Laboratorio SSRF",
    mode,
    result,
    ssrfExploited,
  });
};

const showCode = (req, res) => {
  const code = `
🔹 Asi sería el codigo vulnerable:

- Se hace la peticion directamente con la URL que manda el usuario.
- No se valida la URL.
- No se valida el tipo de contenido ni el código de estado de la respuesta.
- No se bloquean URLs sospechosas.
- No se implementa una whitelist de dominios permitidos.
- La peticion se hace antes de validar el tipo de contenido y llamar a axios.get():

const response = await axios.get(url);

🔹 Asi sería el codigo seguro:

- Se bloquean URLs sospechosas:

if (url.includes("localhost") ||
    url.includes("127.0.0.1") ||
    url.includes("admin") ||
    url.includes("/secret")) {
  return res.render("labs/ssrf/local", {
    title: "Laboratorio SSRF",
    mode,
    result: "⚠️ Acceso denegado: no tienes permiso para acceder a esta URL.",
    ssrfExploited: false,
  });

  - Despues de validar el tipo de contenido se llama a axios.get().
`;

  const explanation = `
Este Laboratorio muestra una vulnerabilidad de Server-Side Request Forgery (SSRF).

Server-Side Request Forgery permite a un atacante hacer que el servidor
realice peticiones a recursos internos. Esto puede permitir acceso a servicios internos, 
exposición de paneles de administración o incluso acceso a metadatos en entornos cloud.

🔹 Modo vulnerable:

- El servidor hace la petición directamente con la URL que envía el usuario, sin validación.
- No se valida el tipo de contenido ni el código de estado de la respuesta.
- No se bloquean URLs sospechosas ni se implementa una whitelist.

🔹 Modo seguro:

- Se valida la URL.
- Se valida que la URL sea permitida.
- Se valida que el servidor responda con un tipo de contenido adecuado.
- Se bloquean URLs sospechosas.
- Se implementa una blacklist de dominios no permitidos.

🔹 Impacto:

- Acceso a servicios internos.
- Exposición de paneles admin.
- Acceso a metadatos en entornos cloud.

🔹 Prevención:

- Validar dominios permitidos (whitelist).
- Bloquear localhost e IPs internas.
- No permitir protocolos no deseados.
`;

  res.render("code", {
    title: "Código vulnerable - SSRF",
    code,
    explanation,
    backLink: "/labs/ssrf",
  });
};

module.exports = {
  indexPage,
  switchMode,
  fetchUrl,
  showCode,
};