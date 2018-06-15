import { mVscode } from './libs/mVscode';
import { trim } from './libs/utils';
import * as db from './libs/db';
import { parse, TYPES } from './libs/smartParse';

const LINE_END = 200;

const run = async () => {
  try {
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
      case TYPES.exec:
        handleCmd(taskInfo);
        return;
      case TYPES.map:
        handleMap(taskInfo);
        break;
      case TYPES.udpate:
        handleUpdate(taskInfo);
        break;
      default: break;
    }
    mVscode.log('job has done!');
  } catch (err) {
    mVscode.log(err);
  }
};

// info = {}
const handleMap = (info: any) => {
  const { segs, ctx } = info;
  const endSeg = segs[segs.length - 1];
  if (endSeg === '@') { // 添加命令
    return db.add(ctx, segs[segs.length - 2]);
  }
  if (endSeg === '#') { // 删除命令
    return db.del(ctx, segs[segs.length - 2]);
  }
  return db.map(ctx, segs.filter((s: string) => !!s));
};

const handleCmd = (info: any) => {
  const datas = db.getAll(info.ctx, info.segs[0]);
  if (!datas.length) {
    return mVscode.log('没有找到相匹配的命令！');
  }
  const data = db.getEndOne(datas[0]);
  return mVscode.exec(data.cmd);
};

const handleUpdate = (info: any) => {

};

export {
  run
};