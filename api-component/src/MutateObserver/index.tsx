import React, { useLayoutEffect } from 'react';
import useMutateObserver from './useMutateObserver';

export interface MutationObserverProps {
    children: React.ReactNode;
    options?: MutationObserverInit;
    onMutate?: (mutations: MutationRecord[], observer: MutationObserver) => void;
  }

const MutateObserver: React.FC<MutationObserverProps> = props => {
  const { children, options, onMutate = () => {} } = props;


  const elementRef = React.useRef<HTMLElement>(null);

  const [target, setTarget] = React.useState<HTMLElement | null>(null);

  // 再次渲染的时候，调用 useMutateObserver 就有 dom 了，可以用 MutationObserver 来监听 dom 变化。
  useMutateObserver(target!, onMutate, options);

  // 在 useLayoutEffect 里拿到 ref 通过 setState 触发更新。
  useLayoutEffect(() => {
    if(elementRef.current) setTarget(elementRef.current);
  }, []);

  if (!children) return null;

  // 通过 React.cloneElement 给 children 加上 ref 来获取 dom 节点。
  return React.cloneElement(children as any, { ref: elementRef });
};

export default MutateObserver;