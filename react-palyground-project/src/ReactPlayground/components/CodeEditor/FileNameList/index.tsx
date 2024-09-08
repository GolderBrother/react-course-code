import React, { useContext, useEffect, useState } from 'react'
import { PlaygroundContext } from '../../../PlaygroundContext'
import { FileNameItem } from './FileNameItem'
import styles from './index.module.scss'
import { APP_COMPONENT_FILE_NAME, ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME } from '../../../files'
export interface FileNameProps {
  onChange: (item: string) => void
}
export default function FileNameList(props: FileNameProps) {
  const {
    files,
    addFile,
    removeFile,
    updateFileName,
    selectedFileName,
    setSelectedFileName,
  } = useContext(PlaygroundContext)
  const [tabs, setTabs] = useState([''])
  const [creating, setCreating] = useState(false)
  useEffect(() => setTabs(files && typeof files === 'object' ? Object.keys(files) : []), [files])
  const handleEditComplete = (name: string, prevName: string) => {
    console.log('handleEditComplete', name, prevName)
    updateFileName(prevName, name);
    setSelectedFileName(name);
    setCreating(false)
  }

  const addTab = () => {
    // 添加了 creating 的 props 来控制 editing 状态，新增的时候添加一个 file ，然后设置 creating 参数为 true 就可以了。
    const newFileName = 'Comp' + Math.random().toString().slice(2, 6) + '.tsx';
    addFile(newFileName);
    setSelectedFileName(newFileName);
    setCreating(true)
  }

  const removeTab = (name: string) => {
    // 删除就是从 files 里把对应文件名删除，然后切换到 main.tsx
    removeFile(name)
    setSelectedFileName(ENTRY_FILE_NAME)
  }
  // main.tsx、App.tsx、import-map.json 设置为 readonly，不可编辑和修改
  const readonlyFileNames = [ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME, APP_COMPONENT_FILE_NAME];

  return (
    // 读取 context 里的 files 来渲染文件列表
    <div className={styles.tabs}>
      {
        tabs.map((item, index) => (
          <FileNameItem
            key={item + index}
            value={item}
            activated={item === selectedFileName}
            creating={creating && index === tabs.length - 1}
            readonly={readonlyFileNames.includes(item)}
            onClick={() => props.onChange(item)}
            onEditComplete={(name) => handleEditComplete(name, item)}
            onRemove={() => {
              removeTab(item)
            }}


          />
        ))
      }
      <div className={styles.add} onClick={addTab}>
        +
      </div>
    </div>

  )
}
