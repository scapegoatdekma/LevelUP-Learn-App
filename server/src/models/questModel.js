const { all, get, run } = require("../db");

const QUEST_COLUMNS = `
  id,
  title,
  subject,
  difficulty,
  xp,
  status,
  deadline,
  notes,
  createdAt,
  updatedAt
`;

const findAll = async (filters = {}) => {
  const conditions = [];
  const params = [];

  if (filters.status) {
    conditions.push("status = ?");
    params.push(filters.status);
  }

  if (filters.difficulty) {
    conditions.push("difficulty = ?");
    params.push(filters.difficulty);
  }

  if (filters.search) {
    conditions.push(
      "(LOWER(title) LIKE LOWER(?) OR LOWER(subject) LIKE LOWER(?) OR LOWER(notes) LIKE LOWER(?))",
    );
    const likeValue = `%${filters.search}%`;
    params.push(likeValue, likeValue, likeValue);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  return all(
    `
      SELECT ${QUEST_COLUMNS}
      FROM quests
      ${whereClause}
      ORDER BY datetime(createdAt) DESC
    `,
    params,
  );
};

const findById = async (id) => {
  return get(
    `
      SELECT ${QUEST_COLUMNS}
      FROM quests
      WHERE id = ?
    `,
    [id],
  );
};

const create = async (payload) => {
  const timestamp = new Date().toISOString();

  const result = await run(
    `
      INSERT INTO quests (title, subject, difficulty, xp, status, deadline, notes, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      payload.title,
      payload.subject,
      payload.difficulty,
      payload.xp,
      payload.status,
      payload.deadline,
      payload.notes,
      timestamp,
      timestamp,
    ],
  );

  return findById(result.lastID);
};

const update = async (id, payload) => {
  const timestamp = new Date().toISOString();

  await run(
    `
      UPDATE quests
      SET
        title = ?,
        subject = ?,
        difficulty = ?,
        xp = ?,
        status = ?,
        deadline = ?,
        notes = ?,
        updatedAt = ?
      WHERE id = ?
    `,
    [
      payload.title,
      payload.subject,
      payload.difficulty,
      payload.xp,
      payload.status,
      payload.deadline,
      payload.notes,
      timestamp,
      id,
    ],
  );

  return findById(id);
};

const remove = async (id) => {
  return run("DELETE FROM quests WHERE id = ?", [id]);
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};

