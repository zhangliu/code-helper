import { mVscode } from './libs/mVscode';
import { trim } from './libs/utils';
import * as db from './libs/db';
import { parse, TYPES } from './libs/smartParse';

const LINE_END = 200;

const run = async () => {
  const position: any = mVscode.cursorPosition;
  const text = trim(mVscode.getText(0, position.line, LINE_END, position.line));
  const reg = /^\/\/\s+(.*)$/;
  const isCmd = reg.test(text);
  if (!isCmd) {
    return;
  }
  const cmd = text.replace(reg, '$1');
  mVscode.log(`开始解析命令：${cmd} ...`);
  const taskInfo = await parse(cmd);
  if (!taskInfo) {
    return mVscode.log('无法识别的命令，处理失败！');
  }
  mVscode.log(`解析出命令类型为：${taskInfo.type}`);
  switch (taskInfo.type) {
    case TYPES.CMD:
      handleCmd(taskInfo);
      break;
    case TYPES.MAP:
      handleMap(taskInfo);
      break;
    default: break;
  }
  // mVscode.log('job has done!');
};

const handleMap = (info: any) => {
  if (info.rightCmd === '@') {
    return db.add(info.leftCmd);
  }
  return db.map(info.leftCmd, info.rightCmd);
};

const handleCmd = (info: any) => {
  const data = db.get(info.cmd);
  if (!data.length) {
    return mVscode.log('没有找到相匹配的命令！');
  }
  return mVscode.log(JSON.stringify(data));
  // return mVscode.exec(data.cmd);
};

export {
  run
};