import * as db from './db';

const parse = async (cmd: string) => {
  const result = await db.get({});
  console.log(result);
  return cmd;
};

export {
  parse
};