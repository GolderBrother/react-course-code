import React from 'react'
import ReactPlayground from './ReactPlayground/index';
import './App.scss';
import { PlaygroundProvider } from './ReactPlayground/PlaygroundProvider';
function App() {

  return (
    // 这样就可以在任意组件用 useContext 读取 context 的值了
    <PlaygroundProvider>
      <ReactPlayground/>
    </PlaygroundProvider>
  )
}

export default App

