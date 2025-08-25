const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron')
const path = require('path')
const { autoUpdater } = require('electron-updater')

let mainWindow
let distribution = 'wayneos'

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'icon.png'),
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1a1a2e'
  })

  // Load the React app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000')
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'))
  }

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Create application menu
  createMenu()

  // Check for updates
  autoUpdater.checkForUpdatesAndNotify()
}

function createMenu() {
  const template = [
    {
      label: 'WayneOS',
      submenu: [
        {
          label: 'About WayneOS',
          click: () => {
            shell.openExternal('https://wayneos.ai')
          }
        },
        { type: 'separator' },
        {
          label: 'Preferences',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            // Open preferences
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Distribution',
      submenu: [
        {
          label: 'WayneOS Base',
          type: 'radio',
          checked: distribution === 'wayneos',
          click: () => setDistribution('wayneos')
        },
        {
          label: 'TOP Automotive',
          type: 'radio',
          checked: distribution === 'wayneos-top',
          click: () => setDistribution('wayneos-top')
        },
        {
          label: 'SS-PB Healthcare',
          type: 'radio',
          checked: distribution === 'wayneos-sspb',
          click: () => setDistribution('wayneos-sspb')
        },
        {
          label: 'Financial Modeling',
          type: 'radio',
          checked: distribution === 'wayneos-financial',
          click: () => setDistribution('wayneos-financial')
        },
        {
          label: 'Enterprise Edition',
          type: 'radio',
          checked: distribution === 'wayneos-enterprise',
          click: () => setDistribution('wayneos-enterprise')
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://docs.wayneos.ai')
          }
        },
        {
          label: 'Support',
          click: () => {
            shell.openExternal('https://support.wayneos.ai')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function setDistribution(dist) {
  distribution = dist
  mainWindow.webContents.send('distribution-changed', dist)
}

// App event handlers
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// IPC handlers
ipcMain.handle('get-distribution', () => distribution)
ipcMain.handle('get-version', () => app.getVersion())

// Auto-updater events
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update-available')
})

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded')
})