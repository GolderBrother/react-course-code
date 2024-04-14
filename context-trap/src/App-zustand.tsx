import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";
import { create } from "zustand";

interface State {
  aaa: number;
  bbb: number;
}

interface Action {
  setAaa: (value: number) => void;
  setBbb: (value: number) => void;
};

const useStore = create<State & Action>(set => ({
  aaa: 0,
  bbb: 0,
  setAaa: (aaa: number) => set(state => ({
    aaa
  })),
  setBbb: (bbb: number) => set(state => ({
    bbb
  })),
}));


const Aaa = () => {
  const aaa = useStore(state => state.aaa);
  const setAaa = useStore(state => state.setAaa);
  console.log('Aaa render');
  const handleAdd = useCallback(() => {
    setAaa(aaa + 1)
  }, [aaa, setAaa]);
  return <div>
    <span>{aaa}</span>
    <button onClick={handleAdd}>aaa加1</button>
  </div>
}

const Bbb = () => {
  const bbb = useStore(state => state.bbb);
  const setBbb = useStore(state => state.setBbb);
  const handleAdd = useCallback(() => {
    setBbb(bbb + 1)
  }, [bbb, setBbb]);
  console.log('Bbb render');
  return <div>
    <span>{bbb}</span>
    <button onClick={handleAdd}>bbb加1</button>
  </div>
};

// zustand 虽然也是集中存放的数据，但是内部做了处理，更新某个 state 不会导致依赖其它 state 的组件重新渲染
const App = () => {
  return <div>
    <Aaa />
    <Bbb />
  </div>;
};


export default App;
