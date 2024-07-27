import { initFiles } from "./files";
import { Files, PlaygroundContext } from "./PlaygroundContext";
import { PropsWithChildren, useState } from 'react';
/**
 * 对 Context.Provider 的封装，注入了这些增删改文件的方法的实现
 * @returns 
 */
export const PlaygroundProvider = (props: PropsWithChildren) => {
    const { children } = props;
    // 在 Context 中保存全局数据，比如 files、selectedFileName，还有对应的增删改的方法
    const [files, setFiles] = useState<Files>(initFiles);
    const [selectedFileName, setSelectedFileName] = useState('App.tsx');
    const addFile = (name: string) => {
        files[name] = {
            name,
            language: '',
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
        if (!files[oldFieldName] || files[newFieldName] === null || files[newFieldName] === undefined) return;
        const {
            [oldFieldName]: oldFieldValue,
            ...rest
        } = files;
        const newFile = {
            ...oldFieldValue,
            language: fileName2Language(newFieldName),
            name: newFieldName
        }
        setFiles({
            ...rest,
            ...newFile
        })
    }
    // 对 Context.Provider 封装了一层来注入初始化数据和方法
    return <PlaygroundContext.Provider
        value={{
            files,
            selectedFileName,
            setSelectedFileName,
            setFiles,
            addFile,
            removeFile,
            updateFileName,
        }}

    >
        {children}
    </PlaygroundContext.Provider>

}