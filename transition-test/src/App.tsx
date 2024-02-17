import React, { CSSProperties, useState } from 'react';
import './App.css';
import { AnimatedProps, animated, useTransition } from '@react-spring/web';

interface PageItem {
  (props: AnimatedProps<{ style: CSSProperties }>): React.ReactElement
}

const pages: Array<PageItem> = [
  ({ style }) => <animated.div style={{ ...style, background: 'lightpink' }}>A</animated.div>,
  ({ style }) => <animated.div style={{ ...style, background: 'lightblue' }}>B</animated.div>,
  ({ style }) => <animated.div style={{ ...style, background: 'lightgreen' }}>C</animated.div>,
]

function App() {
  const [index, setIndex] = useState(0);
  const onClick = () => setIndex(state => (state + 1) % 3);
  const transitions = useTransition(index, {
    // 第一个参数就是会变化的状态，当状态变化的时候就会触发进入、离开动画
    // 分别指定了初始状态（from），进入的时候（enter），离开的时候（leave）会变化的 style
    from: { transform: 'translate3d(100%,0,0)' },
    enter: { transform: 'translate3d(0%,0,0)' },
    leave: { transform: 'translate3d(-100%,0,0)' },
  })
  return (
    <div className="container" onClick={onClick}>
      {
        transitions((style, i) => {
          // 当 index 变化的时候，这些 style 就会变，从而触发动画
          const Page = pages[i];
          return <Page style={style}></Page>
        })
      }
    </div>
  );
}

export default App;
