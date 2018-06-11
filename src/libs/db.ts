import * as Sqlite3 from 'better-sqlite3';
import * as fs from 'fs';

const dbPath = `${__dirname}/../../db/cmd.db`;
const tableName = 'smart_cmd';
const createDbSql = `
CREATE TABLE ${tableName}(
   id INTEGER PRIMARY KEY        AUTOINCREMENT,
   next               INT        NOT NULL,
   cmd                TEXT       NOT NULL,
   context            CHAR(50)   NOT NULL,
   extendInfo         TEXT
);
`;

const insertSql = `INSERT INTO ${tableName}(next, cmd, context, extendInfo) VALUES (?, ?, ?, ?)`;
let sltDb: any;

const getDb = (): Sqlite3 => {
  if (sltDb) {
    return sltDb;
  }

  if (!fs.existsSync(dbPath)) {
    sltDb = new Sqlite3(dbPath);
    sltDb.exec(createDbSql);
  } else { sltDb = new Sqlite3(dbPath); }

  return sltDb;
};

const get = (cmd: string) => {
  const db = getDb();
  const data = db.prepare(`SELECT * from ${tableName} where cmd=? and next=0`).all(cmd);
  return data;
};

const add = (cmd: string) => {
  const db = getDb();
  const result = db.prepare(insertSql).run([0, cmd, '', '']);
  return result.lastInsertROWID;
};

const map = (cmd1: string, cmd2: string) => {
  const db = getDb();
  const data = db.prepare(`SELECT * from ${tableName} where cmd=?`).get(cmd2);
  return data;
};

export {
  get,
  add,
  map
};