// src/app.js
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const expressLayouts = require("express-ejs-layouts");
const axios = require("axios");

const app = express();
app.set("trust proxy", 1);

// --- Log inicial para debug ---
console.log("✅ app.js cargado correctamente");

// --- Seguridad básica ---
//app.use(helmet({
  //contentSecurityPolicy: false  // Desactivamos CSP para facilitar la explotación en los labs, pero en producción siempre debe estar habilitado{
    
  // --- Seguridad HTTP con Helmet ---
// CSP habilitada para toda la aplicación excepto el laboratorio XSS.
// La excepción permite conservar el ejercicio educativo vulnerable.

// --- Seguridad básica: Helmet y CSP ---

const helmetWithCsp = helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
    },
  },
});

const helmetWithoutCsp = helmet({
  contentSecurityPolicy: false,
});

// Desactivamos solo la CSP en el laboratorio XSS
// para permitir las pruebas educativas de ese laboratorio.
app.use((req, res, next) => {
  const isXssLab = req.path.startsWith("/labs/xss");

  if (isXssLab) {
    return helmetWithoutCsp(req, res, next);
  }

  return helmetWithCsp(req, res, next);
});

app.use((req, res, next) => {
  const isXssLab = req.path.startsWith("/labs/xss");

  const securityMiddleware = isXssLab
    ? helmetWithoutCsp
    : helmetWithCsp;

  securityMiddleware(req, res, next);
});


// --- CORS para futuro frontend o APIs ---
app.use(cors());

// --- Configuración de sesiones ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cyberlab_secret",
    resave: false,
    saveUninitialized: false,
  })
);

// --- Parseo de JSON y URL-encoded ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rate limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500,
});
app.use(limiter);

// --- Configurar motor de vistas EJS ---
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layouts", "layout");


// --- Servir archivos estáticos ---
// Por ejemplo: CSS, JS, imágenes, assets
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.status(200).send("OK"); // Para probar que todo funciona bien
});

// --- Ruta principal (inicio) ---

app.get("/", (req, res) => {
  res.render("index", { layout: false });
});

// --- Laboratorios (routers) ---
// Mientras debugueas, comenta si no existen
const sqliRouter = require("./labs/sqli/router");
app.use("/labs/sqli", sqliRouter);
app.use("/labs/xss", require("./labs/xss/router"));
const brokenAuthRouter = require("./labs/broken-auth/router");
app.use("/labs/broken-auth", require("./labs/broken-auth/router"));
const idorRouter = require("./labs/idor/router");
app.use("/labs/idor", idorRouter);
//const ssrfRouter = require("./labs/ssrf/router");
//app.use("/labs/ssrf", ssrfRouter);
const jwtRouter = require("./labs/jwt/router");
app.use("/labs/jwt", jwtRouter);

// --- Otras rutas ---
const diccionario = require("./Diccionario/router");
app.use("/Diccionario", require("./Diccionario/router"));

// --- Ruta fallback para 404 ---
app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

module.exports = app;