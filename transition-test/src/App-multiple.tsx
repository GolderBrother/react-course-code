import React, { useState } from 'react';
import './App-multiple.css';
import { animated, useTransition } from '@react-spring/web';

function AppMultiple() {
  const [items, setItems] = useState(new Array(2).fill(null).map((_, index) => ({
    id: index + 1,
    text: `item ${index + 1}`
  })));
  const transitions = useTransition(items, {
    // 只是想在增删元素的时候才有动画
    initial: { transform: 'translate3d(0%,0,0)' },
    // 第一个参数就是会变化的状态，当状态变化的时候就会触发进入、离开动画
    // 分别指定了初始状态（from），进入的时候（enter），离开的时候（leave）会变化的 style
    from: { transform: 'translate3d(100%,0,0)' },
    enter: { transform: 'translate3d(0%,0,0)' },
    leave: { transform: 'translate3d(-100%,0,0)' },
  })
  return (
    <div className="item-container">
      <div className="item-box">
        {
          transitions((style, i) => {
            return <animated.div className='item' style={style}>
              <span className="del-btn" onClick={() => setItems(items.filter(item => item.id !== i.id))}>X</span>
              {i.text}
            </animated.div>
          })
        }
      </div>
      <div className="add-btn" onClick={() => setItems([...items, {
          id: Date.now(),
          text: `item ${Date.now()}`
      }])}>add</div>
    </div>
  );
}

export default AppMultiple;
