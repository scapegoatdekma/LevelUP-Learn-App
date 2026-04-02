const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { DB_PATH } = require("../config/env");

const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        lastID: this.lastID,
        changes: this.changes,
      });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(rows);
    });
  });
};

const close = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};

module.exports = {
  db,
  run,
  get,
  all,
  close,
};

