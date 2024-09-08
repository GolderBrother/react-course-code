import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate"
import saveAs from "file-saver"
import JSZip from "jszip"
import { Files } from "./PlaygroundContext"

/**
 * 根据不同的后缀名返回 language
 * @param name 
 * @returns 
 */
export const fileName2Language = (name: string) => {
    const suffix = name.split('.').pop() || ''
    if (['js', 'jsx'].includes(suffix)) return 'javascript'
    if (['ts', 'tsx'].includes(suffix)) return 'typescript'
    if (['json'].includes(suffix)) return 'json'
    if (['css'].includes(suffix)) return 'css'
    return 'javascript'
}


/**
 * 字符串压缩
 * @param data 
 * @returns 
 */
export function compress(data: string): string {
    // 调用 fflate 包的 strToU8 把字符串转为字节数组，然后 zlibSync 压缩，之后 strFromU8 转为字符串
    const buffer = strToU8(data)
    const zipped = zlibSync(buffer, { level: 9 })
    const str = strFromU8(zipped, true)
    // 用 btoa 把这个 base64 编码的字符串转为 asc 码
    return btoa(str)
}

/**
 * 字符串解压缩
 * @param base64 
 * @returns 
 */
export function unCompress(base64: string): string {
    const binary = atob(base64)

    const buffer = strToU8(binary, true)
    const unzipped = unzlibSync(buffer)
    return strFromU8(unzipped)
}

/**
 * 下载文件
 * @param files 
 */
export async function downloadFiles(files: Files) {
    // 在浏览器里把多个文件打成 zip 包
    const zip = new JSZip()

    Object.keys(files).forEach((name) => {
        zip.file(name, files[name].value)
    })

    const blob = await zip.generateAsync({ type: 'blob' })
    // 触发代码下载
    saveAs(blob, `code${Math.random().toString().slice(2, 8)}.zip`)
}
