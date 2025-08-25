const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getDistribution: () => ipcRenderer.invoke('get-distribution'),
  getVersion: () => ipcRenderer.invoke('get-version'),
  onDistributionChanged: (callback) => {
    ipcRenderer.on('distribution-changed', (event, distribution) => {
      callback(distribution)
    })
  },
  onUpdateAvailable: (callback) => {
    ipcRenderer.on('update-available', () => {
      callback()
    })
  },
  onUpdateDownloaded: (callback) => {
    ipcRenderer.on('update-downloaded', () => {
      callback()
    })
  }
})