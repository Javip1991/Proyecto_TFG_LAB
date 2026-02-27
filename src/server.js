const app = require("./app");
const sequelize = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Base de datos conectada correctamente");

    await sequelize.sync({ force: false });
    console.log("Base de datos sincronizada correctamente");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to DB:", error);
  }
}

start();

