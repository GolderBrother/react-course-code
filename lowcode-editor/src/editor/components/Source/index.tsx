import MonacoEditor, { OnMount } from '@monaco-editor/react'
import { useComponentsStore } from '../../stores/components';
import { useMemo } from 'react';

export function Source() {
    const { components } = useComponentsStore();

    const handleEditorMount: OnMount = (editor, monaco) => {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
            editor.getAction('editor.action.formatDocument')?.run()
        });
    }
    const options = {
        fontSize: 14,
        scrollBeyondLastLine: false,
        minimap: {
            enabled: false,
        },
        scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
        }
    };
    const value = useMemo(() => JSON.stringify(components, null, 2), [components]);
    return <MonacoEditor
        height={'100%'}
        // 100 的视口高度减去 header、tab 还有 padding 之后剩下的
        className='h-[calc(100vh-60px-32px-20px)]'
        path='components.json'
        language='json'
        onMount={handleEditorMount}
        value={value}
        options={options}
    />
}
