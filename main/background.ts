import path from 'path'
import fs from 'fs'
import { app, ipcMain, shell } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})

ipcMain.handle("open-external", async(_, url:string)=>{
  await shell.openExternal(url)
})

ipcMain.handle("heart-toggle", async(_, date:string)=>{
  console.log(date)
})

ipcMain.handle("load-file", async(_, filename:string)=>{
  console.log(filename)
})

ipcMain.handle("save-file", async(_, filename:string, data:object)=>{
  if(!fs.existsSync('savfiles/')) fs.mkdirSync('savfiles', { recursive: true })
  console.log(filename, JSON.stringify(data))
})