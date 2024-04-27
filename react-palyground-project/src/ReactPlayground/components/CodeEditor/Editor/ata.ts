import { setupTypeAcquisition } from '@typescript/ata'
import typescript from 'typescript';

export function createATA(onDownloadFile: (code: string, path: string) => void) {
  // 用 ts 包去分析代码，然后自动下载用到的类型包，有个 receivedFile 的回调函数里可以拿到下载的代码和路径
  const ata = setupTypeAcquisition({
    projectName: 'my-ata',
    typescript: typescript,
    logger: console,
    delegate: {
      receivedFile: (code: string, path: string) => {
        console.log('自动下载的包', path);
        onDownloadFile(code, path);
      },
    },
  })

  return ata;
}
