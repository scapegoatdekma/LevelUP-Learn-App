const express = require("express");
const cors = require("cors");
const { CLIENT_ORIGIN } = require("./config/env");
const questRoutes = require("./routes/questRoutes");
const notFoundHandler = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "API работает стабильно",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

app.use("/api/quests", questRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

