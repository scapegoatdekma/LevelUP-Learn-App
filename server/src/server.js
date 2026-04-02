const app = require("./app");
const { PORT } = require("./config/env");
const { initDb } = require("./db/init");
const { close } = require("./db");

const bootstrap = async () => {
  await initDb();

  const server = app.listen(PORT, () => {
    console.log(`[сервер] Запущен на http://localhost:${PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`\n[сервер] Получен сигнал ${signal}. Завершение работы...`);

    server.close(async () => {
      try {
        await close();
      } finally {
        process.exit(0);
      }
    });
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
};

bootstrap().catch((error) => {
  console.error("[сервер] Ошибка запуска:", error);
  process.exit(1);
});

