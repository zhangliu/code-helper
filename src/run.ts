import { mVscode } from './libs/mVscode';
import { trim } from './libs/utils';
import { parse } from './libs/smartParse';

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
  const task = await parse(cmd);
  mVscode.exec(task);
};

export {
  run
};