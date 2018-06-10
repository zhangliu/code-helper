import * as Sqlite3 from 'better-sqlite3';
import * as fs from 'fs';

const dbPath = `${__dirname}/../../db/cmd.db`;
const dbName = 'smart_cmd';
const createDbSql = `
CREATE TABLE ${dbName}(
   id INT PRIMARY KEY     NOT NULL,
   next           INT    NOT NULL,
   cmd            TEXT   NOT NULL,
   extendInfo     TEXT
);
`;
let sltDb: any;

const getDb = async (): Promise<any> => {
  if (sltDb) {
    return sltDb;
  }

  if (!fs.existsSync(dbPath)) {
    sltDb = new Sqlite3(dbPath);
    sltDb.exec(createDbSql);
  } else { sltDb = new Sqlite3(dbPath); }

  return sltDb;
};

const get = async (query: any) => {
  try {
    const db = await getDb();
    return db;
  } catch (err) {
    console.log(err);
  }
};

export {
  get
};