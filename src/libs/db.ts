import * as Sqlite3 from 'better-sqlite3';
import * as fs from 'fs';

const dbPath = `${__dirname}/../../db/cmd.db`;
const tableName = 'smart_cmd';
const createTableSql = `
CREATE TABLE ${tableName}(
   id INTEGER PRIMARY KEY        AUTOINCREMENT,
   context            CHAR(50)   NOT NULL,
   cmd                TEXT       NOT NULL,
   type               CHAR(50)   NOT NULL,
   next               INT        NOT NULL,
   extendInfo         TEXT
);
`;
const createIndexSql = `
  CREATE UNIQUE INDEX unique_index on ${tableName} (context, cmd, type);
`;
const TYPES = {
  COMMON: 'common',
  REG: 'reg',
};

const insertSql = `INSERT INTO ${tableName}(context, cmd, type, next, extendInfo) VALUES (?, ?, ?, ?, ?)`;
const selectSql = `SELECT * from ${tableName} where context=? and cmd=?`;
let sltDb: any;

const getDb = (): Sqlite3 => {
  if (sltDb) {
    return sltDb;
  }

  if (!fs.existsSync(dbPath)) {
    sltDb = new Sqlite3(dbPath);
    sltDb.exec(createTableSql);
    sltDb.exec(createIndexSql);
  } else { sltDb = new Sqlite3(dbPath); }

  return sltDb;
};

const getAll = (ctx: string, cmd: string) => {
  const db = getDb();
  const data = db.prepare(selectSql).all(ctx, cmd);
  return data;
};

const getEndOne = (data: any) => {
  const db = getDb();
  while (data.next !== 0) {
    data = db.prepare(`SELECT * from ${tableName} where id=?`).get(data.next);
    if (!data) {
      return null;
    }
  }
  return data;
};

const add = (ctx: string, cmd: string, next: number = 0, extendInfo: any = {}) => {
  const db = getDb();
  extendInfo = JSON.stringify(extendInfo);
  const result = db.prepare(insertSql).run([ctx, cmd, TYPES.COMMON, next, extendInfo]);
  return result.lastInsertROWID;
};

const del = (ctx: string, cmd: string) => {
  const db = getDb();
  const result = db.prepare(`delete from ${tableName} where ctx=? and cmd=?`).run(ctx, cmd);
  return result;
};

const map = (ctx: string, segs: string[]) => {
  const db = getDb();
  const endSeg = segs[segs.length - 1];
  let data = db.prepare(selectSql).get(ctx, endSeg);
  if (!data) {
    throw new Error('can not found right cmd');
  }
  let nextId = data.id;
  for (let i = segs.length - 2; i >= 0; i--) {
    const result = db.prepare(insertSql).run(ctx, segs[i], TYPES.COMMON, nextId, '');
    nextId = result.lastInsertROWID;
  }
};

export {
  getEndOne,
  getAll,
  add,
  del,
  map
};