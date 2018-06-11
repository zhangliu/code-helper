import { trim } from './utils';

const cxtReg = new RegExp('^(.*?):(.*)$');
const typeReg = new RegExp('^(.*?)=>(.*)$');
const TYPES = {
  CMD: 'cmd',
  MAP: 'map',
};

const parse = async (cmd: string) => {
  const ctx = getContext(cmd);
  const subCmd = trim(cmd.replace(ctx, ''));
  const type = getType(subCmd);
  switch (type) {
    case TYPES.MAP:
      const match: any = typeReg.exec(cmd) || {};
      const leftCmd = trim(match[1]);
      const rightCmd = trim(match[2]);
      return { ctx, type, leftCmd, rightCmd };
    case TYPES.CMD:
      return { type, ctx, cmd: subCmd };
    default: return null;
  }
};

const getContext = (cmd: string) => {
  const match = cxtReg.exec(cmd);
  return match ? trim(match[1]) : '';
};

const getType = (cmd: string) => {
  return typeReg.test(cmd) ? TYPES.MAP : TYPES.CMD;
};

export {
  parse,
  TYPES
};