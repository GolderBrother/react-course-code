import React, { useCallback, useMemo, useState } from "react";
import { CSSTransition, SwitchTransition, Transition, TransitionGroup } from "react-transition-group";
import './app-react-transition-group-multiple.css';

export default function AppReactTransitionGroupMultiple() {
  const [items, setItems] = useState(new Array(2).fill(null).map((_, index) => ({
    id: index + 1,
    text: `Item ${index + 1}`,
  })));
  const handleAdd = useCallback(() => {
    const newId = Date.now();
    setItems([
      ...items,
      { id: newId, text: `Item ${newId}` }
    ]);
  }, [items]);
  const [show, setShow] = useState(false);
  const toggleShow = useCallback(() => {
    setShow(!show);
  }, [show]);
  const showText = useMemo(() => show ? '离开' : '进入', [show]);
  return (
    <div>
      <TransitionGroup className='item-box'>
        {
          items.map((item, index) => (
            <CSSTransition
              // 设置 in 的 props 来触发进入和离开动画
              in={show}
              // 需要设置 key，TransitionGroup 会在 children 变化的时候对比新旧 item，来自动设置 in，触发动画。
              key={item.id} timeout={1000}>
              <div className='item'>
                <span
                  className="del-btn"
                  onClick={() => {
                    setItems(items.filter((item2) => item2.id !== item.id));
                  }}
                >
                  x
                </span>
                {
                  item.text
                }
              </div>
            </CSSTransition>
          ))
        }
      </TransitionGroup>
      <div className="add-btn" onClick={handleAdd}>
        +
      </div>
      <Transition
        in={show}
        timeout={1000}
      >
        {/* status 最开始是从 entering 到 entered，从 exiting 到 exited 变化，但是不会设置 className：
        我们可以根据 status 的变化自己设置 className */}
        {
          (status: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined) => <div id="box">{status}</div>
        }
      </Transition>
      <SwitchTransition
        mode='in-out'
      >
        <CSSTransition
          key={String(show)}
          in={show}
          timeout={1000}
        >
          <div id="box"></div>
        </CSSTransition>

      </SwitchTransition>
      <button onClick={toggleShow}>{showText}</button>
    </div>
  );
}