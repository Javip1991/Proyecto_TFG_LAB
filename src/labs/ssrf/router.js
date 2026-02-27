const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get("/", controller.indexPage);
router.get("/switch-mode", controller.switchMode);
router.post("/fetch-url", controller.fetchUrl);
router.get("/code", controller.showCode);

//flags SSRF explotada

router.get("/secret", (req, res) => {
    res.json({ flag: "🚩 FLAG{ssrf_nivel_1} - Has accedido al recurso interno básico!" });
});

router.get("/secret/secret", (req, res) => {
    res.json({ flag: "🚩 FLAG{ssrf_nivel_2} - Has accedido a un recurso interno más profundo!" });
});

router.get("/secret/secret/secret", (req, res) => {
    res.json({ flag: "🚩 FLAG{ssrf_nivel_3} - Has comprometido por completo el servidor!" });
});

router.get("/admin", (req, res) => {
    res.json({ flag: "🚩 FLAG{ssrf_nivel_4} - Has accedido al panel de administración interno!" });
});


module.exports = router;