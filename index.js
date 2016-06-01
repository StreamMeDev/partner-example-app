var electron = require('electron');
var config = require('./config')(electron.app);

// Our main app window
var appWindow;

electron.app.on('ready', createAppWindow);
electron.app.on('window-all-closed', allWindowsClosed);
electron.app.on('activate', onActivate);

function createAppWindow () {
	appWindow = new electron.BrowserWindow({
		width: config.width,
		height: config.height,
		x: config.x,
		y: config.y,
		titleBarStyle: 'hidden'
	});
	appWindow.loadURL('file://' + config.cwd + '/index.html');
	appWindow.on('closed', function () {
		appWindow = null;
	});
	appWindow.webContents.openDevTools();
}

function allWindowsClosed () {
	if (process.platform !== 'darwin') {
		electron.app.quit();
	}
}

function onActivate () {
	if (!appWindow) {
		createAppWindow();
	}
}
