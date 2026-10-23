const { useState } = React;

      const labs = [
        {
          name: "SQL Injection",
          tag: "SQLi",
          icon: "🗄️",
          difficulty: "Fácil",
          badge: "badge-facil",
          desc: "Manipula consultas SQL para extraer datos de la base de datos, saltarte autenticaciones y comprender por qué las consultas parametrizadas son esenciales.",
          url: "/labs/sqli",
        },
        {
          name: "Cross-Site Scripting",
          tag: "XSS",
          icon: "💉",
          difficulty: "Fácil",
          badge: "badge-facil",
          desc: "Inyecta scripts maliciosos en páginas web para robar cookies, redirigir usuarios o ejecutar código arbitrario en el navegador de la víctima.",
          url: "/labs/xss",
        },
        {
          name: "Broken Authentication",
          tag: "BROKEN-AUTH",
          icon: "🔐",
          difficulty: "Fácil",
          badge: "badge-facil",
          desc: "Explota fallos en los mecanismos de autenticación y gestión de sesiones para acceder a cuentas sin credenciales válidas.",
          url: "/labs/broken-auth",
        },
        {
          name: "Insecure Direct Object Reference",
          tag: "IDOR",
          icon: "📂",
          difficulty: "Fácil",
          badge: "badge-facil",
          desc: "Accede a objetos o recursos de otros usuarios simplemente modificando referencias directas en la URL o en los parámetros de la petición.",
          url: "/labs/idor",
        },
        //{
        //name: "Server-Side Request Forgery",
        //tag: "SSRF",
        //icon: "🌐",
        //difficulty: "Medio",
        //badge: "badge-medio",
        //desc: "Engaña al servidor para que realice peticiones a recursos internos inaccesibles desde el exterior, comprometiendo servicios internos.",
        //url: "/labs/ssrf",
        //},
        {
          name: "JSON Web Tokens",
          tag: "JWT",
          icon: "🔐",
          difficulty: "Dificil",
          badge: "badge-dificil",
          desc: "Explota fallos en el mecanismo de autenticación y gestión de sesiones para acceder a cuentas sin credenciales válidas.",
          url: "/labs/jwt",
        },
      ];

      function LabCard({ lab }) {
        const [hovered, setHovered] = useState(false);

        return React.createElement(
          "div",
          {
            className: "lab-card",
            onMouseEnter: () => setHovered(true),
            onMouseLeave: () => setHovered(false),
          },
          // Front
          React.createElement(
            "div",
            { className: "lab-card-inner" },
            React.createElement(
              "div",
              null,
              React.createElement("div", { className: "lab-icon" }, lab.icon),
              React.createElement("div", { className: "lab-name" }, lab.name),
              React.createElement("div", { className: "lab-tag" }, lab.tag),
            ),
            React.createElement(
              "span",
              { className: `lab-badge ${lab.badge}` },
              lab.difficulty,
            ),
          ),
          // Hover
          React.createElement(
            "div",
            { className: "lab-card-hover" },
            React.createElement("p", { className: "lab-desc" }, lab.desc),
            React.createElement(
              "a",
              { href: lab.url, className: "lab-link" },
              "→ ENTRAR AL LAB",
            ),
          ),
        );
      }

      function LabsGrid() {
        return React.createElement(
          "div",
          { className: "labs-grid" },
          labs.map((lab, i) => React.createElement(LabCard, { key: i, lab })),
        );
      }

      const root = ReactDOM.createRoot(document.getElementById("labs-root"));
      root.render(React.createElement(LabsGrid));