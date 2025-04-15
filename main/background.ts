import path from 'path'
import fs from 'fs'
import { app, ipcMain, Menu, MenuItem, shell } from 'electron'
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
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    // autoHideMenuBar: true,
  })

  const newMenu = new Menu()
  newMenu.append(new MenuItem({
    label: 'View',
    submenu: [
      { role: 'reload' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }))
  newMenu.append(new MenuItem({
    label: 'About',
    submenu: [
      { label: 'developer blog', click: async() => { shell.openExternal('https://memory.with-1f.work') } },
      { label: 'report issue', click: async() => { shell.openExternal('https://github.com/1fworks/my_calendar/issues/new') } }
    ]
  }))
  if(!isProd) {
    newMenu.append(new MenuItem({
      label: 'Dev Mode',
      role: 'toggleDevTools'
    }))
  }
  mainWindow.setMenu(newMenu)

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

ipcMain.handle("load-file", async(_, filename:string)=>{
  if(fs.existsSync(filename)) {
    const buffer = fs.readFileSync(filename, 'utf-8')
    const json_data = JSON.parse(buffer)
    return json_data
  }
  return undefined
})

ipcMain.handle("save-file", async(_, filename:string, data:object)=>{
  const dir = path.dirname(filename);
  if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filename, JSON.stringify(data, null, 2))
})

ipcMain.handle("rm-file", async(_, filename:string)=>{
  if(fs.existsSync(filename)){
    fs.rmSync(filename)
  }
})