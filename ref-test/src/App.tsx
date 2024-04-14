import React, { useRef, useEffect, useState, useImperativeHandle } from "react";

interface ForwardRefType {
  focusHandler: () => void
}

const ForwardRefMyInput = React.forwardRef((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // 可以使用 useImperativeHandle 自定义传给父元素的 ref
  useImperativeHandle(ref, () => ({
    focusHandler: () => {
      inputRef.current?.focus();
    }
  }));
  return <input ref={inputRef} type="text" {...props} />
})

export default function App() {
  // 函数组件里用 useRef 保存 dom 引用或者自定义的值
  const timerRef = useRef(null);
  const inputRef = useRef<ForwardRefType>(null);
  const [num, setNum] = useState<number>();

  useEffect(() => {
    inputRef.current?.focusHandler();
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setNum(num => (num || 0) + 1);
    }, 100)
  }, []);

  const clearTimerInterval = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }

  return <div>
    {num}
    {/* <input ref={inputRef} type="text" /> */}
    <ForwardRefMyInput ref={inputRef} />
    <button onClick={clearTimerInterval}>click</button>
  </div>
}
