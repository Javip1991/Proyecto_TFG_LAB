const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

console.log("DB CONFIG:");
console.log("DATABASE:", process.env.DB_NAME);
console.log("USER:", process.env.DB_USER);
console.log("HOST:", process.env.DB_HOST);
console.log("PORT:", process.env.DB_PORT);

module.exports = sequelize;