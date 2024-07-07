import { CSSProperties, FC, ReactNode, useEffect, useImperativeHandle, useMemo, forwardRef } from "react";
import useStore from "./hooks/useStore";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import './index.scss';
import { createPortal } from "react-dom";
import { useTimer } from "./hooks/useTimer";

export type Position = 'top' | 'bottom';

export interface MessageProps {
  style?: CSSProperties;
  className?: string | string[];
  content?: ReactNode | string;
  duration?: number;
  onClose?: (...args: any) => void;
  id?: number;
  position?: Position;
}
export interface MessageRef {
  add: (messageProps: MessageProps) => number;
  update: (id: number, messageProps: MessageProps) => void
  remove: (id: number) => void
  clearAll: () => void
}
const MessageItem: FC<MessageProps> = (props) => {
  // const messageItemStyle = useMemo<CSSProperties>(() => ({
  //   width: 100, lineHeight: '30px', border: '1px solid #000', margin: '20px'
  // }), [])
  const { onMouseEnter, onMouseLeave } = useTimer({
    id: props.id!,
    duration: props.duration,
    remove: props.onClose!,
  });

  return <div className="message-item" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    {props.content}
  </div>
}

// 使用 forwardRef + useImperative 转发 ref
export const MessageProvider = forwardRef<MessageRef, {}>((props, ref) => {
  const { messageList, add, update, remove, clearAll } = useStore('top');
  // const messageItemStyle = useMemo<CSSProperties>(() => ({
  //   width: 100, lineHeight: '30px', border: '1px solid #000', margin: '20px'
  // }), [])
  if ('current' in ref!) {
    ref.current = {
      add,
      update,
      remove,
      clearAll
    }
  }

  // 用 useImperative 的一个问题，它并不是立刻修改 ref，而是会在之后的某个时间来修改
  // useImperativeHandle(ref, () => {
  //   return {
  //     add,
  //     update,
  //     remove,
  //     clearAll
  //   }
  // }, []);
  const positions = Object.keys(messageList) as Position[];
  useEffect(() => {
    setInterval(() => {
      add({
        content: Math.random().toString().slice(2, 8)
      })
    }, 2000);
  }, []);
  const messageRootElement = useMemo(() => {
    const el = document.createElement('div');
    el.className = 'message-root';
    document.body.appendChild(el);
    return el;
  }, []);
  const messageWrapper = <div className="message-wrapper">
    {
      positions.map(direction => (
        <TransitionGroup className={`message-wrapper-${direction}`} key={direction}>
          {
            messageList[direction].map(item => {
              return <CSSTransition key={item.id} timeout={1000} classNames='message'>
                <MessageItem onClose={remove} {...item}></MessageItem>
              </CSSTransition>
            })
          }
        </TransitionGroup>
      ))
    }
  </div>
  // 通过 createPortal 把它渲染到 body 下
  return createPortal(messageWrapper, messageRootElement);
});
