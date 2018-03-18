import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import mysql from 'mysql';
import sqlGenerator from './lib/sqlGenerator';


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

// MySQL connection var
let connection;

/**
 * Open a db connection an perforn a query.
 *
 * @param {string} sql Query sql.
 * @param {function} callback Callback called when the data is fetched.
 * @return {array} Results
 */
function query(sql, callback) {
  connection.connect();

  connection.query(sql, (error, results) => {
    if (error) {
      connection.end();
      throw error;
    }

    callback(results);
  });

  connection.end();
}

/**
 * Creates a new window async.
 */
async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/frontend/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Listen for db connection ask from renderer process
  ipcMain.on('db-conection', (e, config) => {
    connection = mysql.createConnection(config);

    try {
      query('select TABLE_SCHEMA, TABLE_NAME from information_schema.columns group by TABLE_NAME', (results) => {
        e.sender.send('db-conected', results);
      });
    } catch (err) {
      e.sender.send('db-error', 'Query error: ' + err.message);
    }
  });

  // Listen for db connection ask from renderer process
  ipcMain.on('generate-sql', (e, data) => {
    if (connection === undefined) {
      e.sender.send('db-error', 'There\' no db connection.');
    } else {
      try {
        query(sqlGenerator(data.words, data.schemas), (results) => {
          console.log('The solution is: ', results.length);
        });
      } catch (err) {
        e.sender.send('db-error', 'Query error: ' + err.message);
      }
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});