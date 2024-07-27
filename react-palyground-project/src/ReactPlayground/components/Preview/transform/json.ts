import { File } from '../../../PlaygroundContext';
/**
 * json 文件的处理就是把 export 一下这个 json，然后作为 blob url 即可
 * @param file 
 * @returns 
 */
export const json2Js = (file: File) => {
    const js = `export default ${file.value}`
    return URL.createObjectURL(new Blob([js], { type: 'application/javascript' }))
}