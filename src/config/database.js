const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    ssl: true,
  });

console.log("DB CONFIG:");
console.log("DATABASE:", process.env.DB_NAME);
console.log("USER:", process.env.DB_USER);
console.log("HOST:", process.env.DB_HOST);
console.log("PORT:", process.env.DB_PORT);

module.exports = sequelize;