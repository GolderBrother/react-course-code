import { FC, PropsWithChildren, createContext, memo, useContext, useState } from "react";
interface CounterContext {
  aaa: number;
  bbb: number;
  setAaa: (aaa: number) => void;
  setBbb: (bbb: number) => void;
}

const counterContext = createContext<CounterContext>({
  aaa: 0,
  bbb: 0,
  setAaa: () => { },
  setBbb: () => { },
});

const ProviderCounter: FC<PropsWithChildren> = ({ children }) => {
  const [aaa, setAaa] = useState(0);
  const [bbb, setBbb] = useState(0);
  return <counterContext.Provider
    value={{
      aaa,
      bbb,
      setAaa,
      setBbb,
    }}
  >{children}</counterContext.Provider>
}

interface AaaProps {
  aaa: number;
  setAaa: (aaa: number) => void
}
interface BbbProps {
  bbb: number;
  setBbb: (aaa: number) => void
}
const Aaa = memo((props: AaaProps) => {
  const { aaa, setAaa } = props;
  console.log('Aaa render');
  return <div>
    <span>{aaa}</span>
    <button onClick={() => setAaa(aaa + 1)}>aaa加1</button>
  </div>
});
const Bbb = memo((props: BbbProps) => {
  const { bbb, setBbb } = props;
  console.log('Bbb render');
  return <div>
    <span>{bbb}</span>
    <button onClick={() => setBbb(bbb + 1)}>bbb加1</button>
  </div>
});
const WrapperAaa = () => {
  const { aaa, setAaa } = useContext(counterContext);
  return <Aaa aaa={aaa} setAaa={setAaa} />
}
const WrapperBbb = () => {
  const { bbb, setBbb } = useContext(counterContext);
  return <Bbb bbb={bbb} setBbb={setBbb} />
};

const App = () => (
  <ProviderCounter>
    <WrapperAaa />
    <WrapperBbb />
  </ProviderCounter>
);

export default App;
