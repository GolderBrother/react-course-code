import React, { useMemo } from 'react'
import MonacoEditor, { EditorProps as MonacoEditorProps, OnMount } from '@monaco-editor/react';
import { createATA } from './ata';
import { editor } from 'monaco-editor'

export interface EditorFile {
    name: string
    value: string
    language: string
}

export interface EditorProps {
    file: EditorFile
    onChange?: MonacoEditorProps['onChange'],
    options?: editor.IStandaloneEditorConstructionOptions
}


export default function Editor(props: EditorProps) {
    const {
        file,
        onChange,
        options
    } = props;

    const handleEditorMount: OnMount = (editor, monaco) => {
        // 可以 cmd + j 的时候格式化代码
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
            editor.getAction('editor.action.formatDocument')?.run()

            const actions = editor.getSupportedActions().map((a) => a.id);
            console.log('actions', actions);
        });

        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            // 这里设置 jsx 为 preserve，也就是输入 <div> 输出 <div>，保留原样。
            jsx: monaco.languages.typescript.JsxEmit.Preserve,
            //  esModuleInterop，这个也是 ts 常用配置。默认 fs 要这么引入，因为它是 commonjs 的包，没有 default 属性
            // 设置 esModuleInterop 会在编译的时候自动加上 default 属性。
            esModuleInterop: true,
        })

        const ata = createATA((code, path) => {
            monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`)
        })

        editor.onDidChangeModelContent(() => {
            // 然后内容改变之后获取一次类型，获取类型之后用 addExtraLib 添加到 ts
            const value = editor.getValue();
            ata(value);
        });

        // 最开始获取一次类型
        ata(editor.getValue());

    }
    const editorOptions = useMemo(() => ({
        fontSize: 14,
        // scrollBeyondLastLine 是到了最后一行之后依然可以滚动一屏，关闭后就不会了。
        scrollBeyondLastLine: false,
        // minimap 就是缩略图，关掉就没了
        minimap: {
            enabled: false,
        },
        // scrollbar 是设置横向纵向滚动条宽度的。
        scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
        },
        ...options
    }), [options]);
    return <MonacoEditor
        height='100%'
        path={file.name}
        language={file.language}
        value={file.value}
        onChange={onChange}
        onMount={handleEditorMount}
        options={editorOptions}
    />
}
