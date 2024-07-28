import classnames from 'classnames'
import React, { MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react'
import { Popconfirm } from 'antd'
import styles from './index.module.scss'

export interface FileNameItemProps {
  value: string
  activated: boolean
  creating?: boolean
  readonly?: boolean
  onClick: () => void
  onEditComplete: (value: string) => void
  onRemove: MouseEventHandler
}
const noop = () => { }
export const FileNameItem: React.FC<FileNameItemProps> = (props) => {
  const {
    value,
    activated = false,
    creating = false,
    readonly = false,
    onClick,
    onRemove
  } = props

  const [name, setName] = useState(value)
  const [editing, setEditing] = useState(creating)
  const inputRef = useRef<HTMLInputElement>(null)

  const canEdit = useMemo(() => !readonly, [readonly])
  const canRemove = useMemo(() => !readonly, [readonly])
  // 添加了 editing 的 state 来切换编辑状态，编辑状态下可以在 input 里修改名字，然后同步到 files 里。
  const handleDoubleClick = () => {
    setEditing(true)
    setTimeout(() => {
      inputRef?.current?.focus()
    }, 0)
  }
  const handleInputBlur = () => {
    setEditing(false);
    typeof props.onEditComplete === 'function' && props.onEditComplete(name)
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleInputBlur()
    }
  }

  useEffect(() => {
    if (creating) {
      inputRef?.current?.focus()
    }
  }, [creating]);



  return (
    <div
      className={classnames(styles['tab-item'], activated ? styles.activated : null)}
      onClick={onClick}
    >
      {
        editing ? (
          <input
            ref={inputRef}
            className={styles['tabs-item-input']}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleInputBlur}
            onKeyUp={handleKeyUp}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span onDoubleClick={canEdit ? handleDoubleClick : noop}>{name}</span>
            {
              canRemove ? (
                <Popconfirm
                  title="确认删除该文件吗？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    onRemove(e);
                  }}
                >
                  <span style={{ marginLeft: 5, display: 'flex' }}>
                    <svg width='12' height='12' viewBox='0 0 24 24'>
                      <line stroke='#999' x1='18' y1='6' x2='6' y2='18'></line>
                      <line stroke='#999' x1='6' y1='6' x2='18' y2='18'></line>
                    </svg>
                  </span>
                </Popconfirm>
              ) : null
            }
          </div>
        )
      }
    </div>
  )
}
