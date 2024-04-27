import React from 'react'
import styles from './index.module.scss';
import FileNameList from './FileNameList';
import Editor from './Editor';

export default function CodeEditor() {
  const file = {
    name: 'james.tsx',
    value: 'import lodash from "lodash";\n\nconst a = <div>james</div>',
    language: 'typescript'
  }

  function onEditorChange(...args) {
    // eslint-disable-next-line prefer-rest-params
    console.log('onEditorChange', ...args);
  }
  return (
    <div className={styles.codeEditorWrapper}>
      <FileNameList />
      <Editor file={file} onChange={onEditorChange} />
    </div>
  )
}
