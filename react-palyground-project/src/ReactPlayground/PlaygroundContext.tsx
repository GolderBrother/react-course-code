import { createContext } from 'react'

export interface File {
    name: string
    value: string
    language: string
}

export interface Files {
    /** 键值对方式保存的文件信息，键是文件名，值是文件的信息，包括 name、value、language */
    [key: string]: File
}

export type Theme = 'light' | 'dark'

export interface IPlaygroundContext {
    files: Files
    selectedFileName: string
    theme: Theme
    setTheme: (theme: Theme) => void
    setSelectedFileName: (fileName: string) => void
    setFiles: (files: Files) => void
    addFile: (fileName: string) => void
    removeFile: (fileName: string) => void
    updateFileName: (oldFieldName: string, newFieldName: string) => void
}

export const PlaygroundContext = createContext<IPlaygroundContext>({
    selectedFileName: 'App.tsx',
} as IPlaygroundContext)