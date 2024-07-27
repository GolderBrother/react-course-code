import React, { useContext, useEffect, useState } from 'react'
import { PlaygroundContext } from '../../../PlaygroundContext'
import { FileNameItem } from './FileNameItem'
import styles from './index.module.scss'
export interface FileNameProps {
  onChange: (item: string) => void
}
export default function FileNameList(props: FileNameProps) {
  const {
    files,
    selectedFileName,
  } = useContext(PlaygroundContext)
  const [tabs, setTabs] = useState([''])
  useEffect(() => setTabs(files && typeof files === 'object' ? Object.keys(files) : []), [files])
  return (
    // 读取 context 里的 files 来渲染文件列表
    <div className={styles.tabs}>
      {
        tabs.map((item, index) => (
          <FileNameItem
            key={item + index}
            value={item}
            activated={item === selectedFileName}
            onClick={() => props.onChange(item)}
          />
        ))
      }

    </div>
    
  )
}
