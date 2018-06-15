import { trim } from '../utils';

const types: any = {
  map: {
    isMatch: (cmd: string) => /^(.*?)=>(.*)$/.test(cmd),
    parse: (cmd: string) => cmd.split('=>').map(s => trim(s))
  },
  update: {
    isMatch: (cmd: string) => /^(.*?)->(.*)$/.test(cmd),
    parse: (cmd: string) => cmd.split('->').map(s => trim(s))
  },
  exec: {
    isMatch: (cmd: string) => !/(->|=>)/.test(cmd),
    parse: (cmd: string) => [trim(cmd)]
  }
};

const TYPES: any = Object.keys(types).reduce((total: any, key: string) => {
  total[key] = key;
  return total;
}, {});

const cxtReg = new RegExp('(.*?):.*');

const parse = async (cmd: string) => {
  const ctx = getContext(cmd);
  const subCmd = trim(cmd.replace(ctx, ''));
  const type = getType(subCmd);
  return type ? { type, ctx, segs: types[type].parse(subCmd) } : null;
};

const getContext = (cmd: string) => {
  const match = cxtReg.exec(cmd);
  return match ? trim(match[1]) : '';
};

const getType = (cmd: string) => {
  const key = Object.keys(types).find(k => types[k].isMatch(cmd));
  return key;
};

export {
  parse,
  TYPES
};