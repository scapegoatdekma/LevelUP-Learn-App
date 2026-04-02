const { run, get } = require("./index");
const {
  QUEST_DIFFICULTIES,
  QUEST_STATUSES,
} = require("../constants/questDictionary");

const SCHEMA_VERSION = 2;

const seedQuests = [
  {
    title: "Глубокое погружение в Async/Await",
    subject: "JavaScript",
    difficulty: "средне",
    xp: 120,
    status: "к_выполнению",
    deadline: null,
    notes: "Разобрать callback-подход и сравнить с Promise",
  },
  {
    title: "Собрать CRUD на Express",
    subject: "Бэкенд",
    difficulty: "сложно",
    xp: 180,
    status: "в_работе",
    deadline: null,
    notes: "Сделать разделение: route/controller/service/model",
  },
  {
    title: "Паттерны управления состоянием в React",
    subject: "Фронтенд",
    difficulty: "легко",
    xp: 80,
    status: "выполнено",
    deadline: null,
    notes: "Сравнить локальный state и подъем состояния наверх",
  },
];

const createQuestTable = async () => {
  const difficultyConstraint = QUEST_DIFFICULTIES.map((value) => `'${value}'`).join(", ");
  const statusConstraint = QUEST_STATUSES.map((value) => `'${value}'`).join(", ");

  await run(`
    CREATE TABLE IF NOT EXISTS quests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK (difficulty IN (${difficultyConstraint})),
      xp INTEGER NOT NULL CHECK (xp >= 10 AND xp <= 500),
      status TEXT NOT NULL CHECK (status IN (${statusConstraint})),
      deadline TEXT,
      notes TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);
};

const getSchemaVersion = async () => {
  const row = await get("PRAGMA user_version");
  return Number(row?.user_version || 0);
};

const migrateSchemaIfNeeded = async () => {
  const currentVersion = await getSchemaVersion();

  if (currentVersion >= SCHEMA_VERSION) {
    return;
  }

  await run("DROP TABLE IF EXISTS quests");
  await createQuestTable();
  await run(`PRAGMA user_version = ${SCHEMA_VERSION}`);
};

const seedIfEmpty = async () => {
  const row = await get("SELECT COUNT(*) as count FROM quests");

  if (row?.count > 0) {
    return;
  }

  const now = new Date().toISOString();
  for (const quest of seedQuests) {
    await run(
      `
      INSERT INTO quests (title, subject, difficulty, xp, status, deadline, notes, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        quest.title,
        quest.subject,
        quest.difficulty,
        quest.xp,
        quest.status,
        quest.deadline,
        quest.notes,
        now,
        now,
      ],
    );
  }
};

const initDb = async () => {
  await migrateSchemaIfNeeded();
  await createQuestTable();
  await seedIfEmpty();
};

module.exports = {
  initDb,
};

