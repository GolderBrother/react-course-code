import React from 'react';
import './App.css';
import { StoreApi, UseBoundStore, create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(logMiddleware(persist((set: Function) => ({
  aaa: '',
  bbb: '',
  updateAaa: (value: any) => set(() => ({
    aaa: value
  })),
  updateBbb: (value: any) => set(() => ({
    bbb: value
  }))
}), {
  name: 'zhang'
})));
function logMiddleware(fn: Function) {
  return function(set: Function , get: Function, store: UseBoundStore<StoreApi<any>> | any) {
    function newSet(...args: any[]) {
      console.log('调用了 set，新的 state：', get());
      return set(...args)
    }
    return fn(newSet, get, store);
  }
}
function App() {
  const aaa = useAppStore((state: any) => state.aaa);
  const updateAaa = useAppStore((state: any) => state.updateAaa);
  const onChange = (e: any) => {
    updateAaa(e.currentTarget.value)
  }
  useAppStore.subscribe(state => {
    console.log('subscribe state', state);
    console.log('subscribe useAppStore.getState()', useAppStore.getState());
  })
  return (
    <div className="App">
    <input
      onChange={onChange}
      value={aaa}
    />
    <Bbb></Bbb>
    </div>
  );
}
function Bbb() {
  return <div>
    <Ccc></Ccc>
  </div>
}

function Ccc() {
  const aaa = useAppStore((state: any) => state.aaa)
  return <p>hello, {aaa}</p>
}

export default App;