import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as http from 'http';
import ExpressApp from './backend/express-app';
import { Constants } from './common/constants';

export default class Base {
    static application;
    static BrowserWindow: typeof BrowserWindow;

    static mainWindow: BrowserWindow;

    static port: number|string|boolean;
    static server: http.Server;

    static main (app, browserWindow: typeof BrowserWindow) {
        try {
            Base.BrowserWindow = browserWindow;
            Base.application = app;
            Base.mainWindow = null;

            Base.application.commandLine.appendSwitch('disable-gpu');
            Base.application.commandLine.appendSwitch('enable-transparent-visuals');

            Base.application.on('window-all-closed', Base.onWindowAllClosed);
            Base.application.on('activate', Base.onActivate);
            Base.application.on('ready', Base.onReady);

            Base.bootServer();
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    }

    private static bootServer() {
        Base.port = Base.normalizePort(process.env.PORT || 5000);

        ExpressApp.set('port', Base.port);

        Base.server = http.createServer(ExpressApp);
        Base.server.listen(Base.port);
        Base.server.on('error', Base.onError);
        Base.server.on('listening', Base.onListening);
    }

    private static createMainWindow(): void {
        Base.mainWindow = new Base.BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: true
            },
            center: true,
            title: Constants.APP_NAME
        });

        // Open the DevTools.
        Base.mainWindow.webContents.openDevTools();

        Base.mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'browser/index.html'),
            protocol: 'file:',
            slashes: true
        }));

        Base.mainWindow.on('closed', function () {
            Base.mainWindow = null;
        });
    }

    private static normalizePort(val: number|string): number|string|boolean {
        const port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
        if (isNaN(port)) {
          return val; // named pipe
        } else if (port >= 0) {
          return port; // port number
        } else {
          return false;
        }
    }

    private static onActivate() {
        if (Base.mainWindow === null) {
            Base.onReady();
        }
    }

    private static onClose() {
        console.log('onClose()');
        Base.mainWindow = null;
        Base.server.close();
        Base.application.quit();
    }

    private static onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') {
          throw error;
        }
        const bind = (typeof Base.port === 'string') ? 'Pipe ' + Base.port : 'Port ' + Base.port;
        // handle specific listen errors with friendly messages
        switch (error.code) {
          case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
          case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
          default:
            throw error;
          }
    }

    private static onListening(): void {
        const addr = Base.server.address();
        const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
        console.log(`Listening on ${bind}`);
    }

    private static onReady() {
        Base.createMainWindow();

        Base.mainWindow.on('ready-to-show', () => {
            Base.mainWindow.show();
            Base.mainWindow.focus();
        });
        Base.mainWindow.on('closed', Base.onClose);
    }

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
          //  Main.application.quit();
        }
    }
}

Base.main(app, BrowserWindow);
