import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value)
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
  openExternal: (url:string) => ipcRenderer.invoke("open-external", url),
  loadFile: (filename:string) => ipcRenderer.invoke("load-file", filename),
  saveFile: (filename:string, data:object) => ipcRenderer.invoke("save-file", filename, data),
  rmFile: (filename:string) => ipcRenderer.invoke("rm-file", filename),
}

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
