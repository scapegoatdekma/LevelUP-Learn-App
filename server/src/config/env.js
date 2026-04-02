const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const NODE_ENV = process.env.NODE_ENV || "development";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "../../data/levelup.db");

module.exports = {
  PORT,
  NODE_ENV,
  CLIENT_ORIGIN,
  DB_PATH,
};

