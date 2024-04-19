import { useEffect, useRef, useState } from 'react'
import './App.css'
import { useMountedState } from './hooks/useMountedState';
import { useLifeCycles } from './hooks/useLifeCycles';
import useScrolling from './hooks/useScrolling';

function App() {

  const isMounted = useMountedState();
  const [, setNum] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrolling = useScrolling(scrollRef);
  
  useLifeCycles(() => console.log('MOUNTED'), () => console.log('UNMOUNTED'));
  useEffect(() => {
    setTimeout(() => {
      setNum(1);
    }, 1000);
  });

  return <div>
    <p>{isMounted() ? 'mounted' : 'pending'}</p>
    {<div>{scrolling ? "滚动中.." : "没有滚动"}</div>}

    <div ref={scrollRef} style={{height: '200px', overflow: 'auto'}}>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
      <div>james</div>
    </div>
  </div>
}

export default App
