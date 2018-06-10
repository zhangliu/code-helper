import * as vscode from 'vscode';
import * as moment from 'moment';
const chan = vscode.window.createOutputChannel('code-helper');
const tml = vscode.window.createTerminal('code-helper');

class MVscode {
  public log(str: string, line: boolean = true) {
    chan.show(true);
    const log = line ? chan.appendLine : chan.append;
    const pre = `${moment().format('HH:mm:ss')} => `;
    log.call(chan, `${pre}${str}`);
  }

  public exec(cmd: string) {
    tml.show(true);
    tml.sendText(cmd);
  }

  public get selectedText() {
    const editor: any = vscode.window.activeTextEditor;
    const selection = editor.selection;
    return editor.document.getText(selection) || '';
  }

  public get currentEditor() {
    return vscode.window.activeTextEditor;
  }

  public get rootPath() {
    return vscode.workspace.rootPath || '';
  }

  public get languageId() {
    return this.currentEditor ? this.currentEditor.document.languageId : '';
  }

  public get filePath() {
    return this.currentEditor ? this.currentEditor.document.fileName : '';
  }

  public get documentText() {
    return this.currentEditor ? this.currentEditor.document.getText() : '';
  }

  public get cursorPosition() {
    return this.currentEditor ? this.currentEditor.selection.end : null;
  }

  public getText(startChar: number, startLine: number, endChar: number, endLine: number) {
    if (!this.currentEditor) {
      return '';
    }
    const range = new vscode.Range(startLine, startChar, endLine, endChar);
    return this.currentEditor.document.getText(range);
  }
}

const mVscode: MVscode = new MVscode();

export {
  mVscode
};