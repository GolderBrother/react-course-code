import React, { useContext, useMemo } from 'react'
import styles from './index.module.scss';
import FileNameList from './FileNameList';
import Editor from './Editor';
import { PlaygroundContext } from '../../PlaygroundContext';
import { debounce } from 'lodash-es';

export default function CodeEditor() {
  const {
    files,
    theme,
    setFiles,
    selectedFileName,
    setSelectedFileName
  } = useContext(PlaygroundContext)
  const file = files[selectedFileName] || {
    name: 'james.tsx',
    value: 'import lodash from "lodash";\n\nconst a = <div>james</div>',
    language: 'typescript'
  };
  function onEditorChange(value = '') {
    if (files[file.name]) {
      files[file.name].value = value;
    }
    setFiles({
      ...files
    });
  }
  const onEditorChangeDebounce = debounce(onEditorChange, 100)
  const editorOptions = useMemo(() => ({
    theme: `vs-${theme}` 
  }), [theme])
  return (
    <div className={styles.codeEditorWrapper}>
      <FileNameList onChange={setSelectedFileName} />
      <Editor file={file} onChange={onEditorChangeDebounce} options={editorOptions} />
    </div>
  )
}
