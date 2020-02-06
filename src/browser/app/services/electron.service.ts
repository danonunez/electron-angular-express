import { Injectable } from '@angular/core';
import { ipcRenderer, webFrame, remote, BrowserWindow } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  public ipcRenderer: typeof ipcRenderer;
  public webFrame: typeof webFrame;
  public remote: typeof remote;
  public childProcess: typeof childProcess;
  public fs: typeof fs;
  public path: typeof path;
  public electronWindow: BrowserWindow;

  constructor() {
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.ipcRenderer.setMaxListeners(0);
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.path = window.require('path');

      this.electronWindow = remote.getCurrentWindow();
    }
  }

  get isElectron(): boolean {
    return window && window.process && window.process.type;
  }
}
