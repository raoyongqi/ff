
declare global {
  interface Window {
    electronAPI: {
      mergeAudio: (fileId: string) => Promise<any>;
    };

 
  }
}

// 这个文件必须有一个 export 语句来让 TypeScript 识别为模块
export {};
