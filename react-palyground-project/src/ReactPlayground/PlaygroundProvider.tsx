import { initFiles } from "./files";
import { Files, PlaygroundContext, Theme } from "./PlaygroundContext";
import { PropsWithChildren, useEffect, useState } from 'react';
import { compress, fileName2Language, unCompress } from "./utils";
const getFilesFromUrl = () => {
    let files: Files = {};
    try {
        const hash = unCompress(window.location.hash.slice(1));
        files  = JSON.parse(hash);
    } catch (error) {
        console.error('error', error);
    }
    return files;
}
/**
 * 对 Context.Provider 的封装，注入了这些增删改文件的方法的实现
 * @returns 
 */
export const PlaygroundProvider = (props: PropsWithChildren) => {
    const { children } = props;
    // 在 Context 中保存全局数据，比如 files、selectedFileName，还有对应的增删改的方法
    // const [files, setFiles] = useState<Files>(initFiles);
    const [files, setFiles] = useState<Files>(getFilesFromUrl() || initFiles);
    const [selectedFileName, setSelectedFileName] = useState('App.tsx');
    const [theme, setTheme] = useState<Theme>('dark');
    const addFile = (name: string) => {
        const language = fileName2Language(name);
        files[name] = {
            name,
            language,
            value: ''
        };
        setFiles({
            ...files
        })
    }
    const removeFile = (name: string) => {
        delete files[name];
        setFiles({
            ...files
        })
    }
    const updateFileName = (oldFieldName: string, newFieldName: string) => {
        // if (!files[oldFieldName] || files[newFieldName] === null || files[newFieldName] === undefined) return;
        if (!files[oldFieldName]) return;
        const {
            [oldFieldName]: oldFieldValue,
            ...rest
        } = files;
        const newFile = {
            [newFieldName]: {
                ...oldFieldValue,
                language: fileName2Language(newFieldName),
                name: newFieldName
            }
        }
        setFiles({
            ...rest,
            ...newFile
        })
    }
    useEffect(() => {
        const hash = compress(JSON.stringify(files));
        window.location.hash = hash;
    }, [files])
    // 对 Context.Provider 封装了一层来注入初始化数据和方法
    return <PlaygroundContext.Provider
        value={{
            theme,
            setTheme,
            files,
            setFiles,
            addFile,
            removeFile,
            updateFileName,
            selectedFileName,
            setSelectedFileName,
        }}

    >
        {children}
    </PlaygroundContext.Provider>

}