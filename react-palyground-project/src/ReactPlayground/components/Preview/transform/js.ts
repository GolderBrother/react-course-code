import { File, Files } from '../../../PlaygroundContext';
import { babelTransform } from '../compiler';

/**
 * ts 文件的处理就是用 babel 编译下，然后用 URL.createObjectURL 把编译后的文件内容作为 url
 * @param file 
 * @param files 
 * @returns 
 */
export const jsTransform = (file: File, files: Files) => {
    return URL.createObjectURL(
        new Blob([babelTransform(file.name, file.value, files)], {
            type: 'application/javascript',
        })
    )
}
