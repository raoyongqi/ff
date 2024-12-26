import { contextBridge, ipcRenderer } from 'electron';

// Define the types for the parameters in fetchPlaylistTracks
contextBridge.exposeInMainWorld('electronAPI', {

    mergeAudio: (fileId: string) => ipcRenderer.invoke('merge-audio',fileId) // 通过 ipcRenderer 发送请求}, 

  
}, 
);
