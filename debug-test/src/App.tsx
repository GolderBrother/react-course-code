import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
async function queryData(): Promise<number> {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(666);
    }, 2000);
  })
}
function App() {
  const [num, setNum] = useState(0);
  useEffect(() => {
    (async () => {
      const data = await queryData();
      setNum(data);
    })();
  }, []);
  return (
    <div onClick={(e) => {
      setNum((prevNum) => prevNum + 1)
    }}>{num}</div>
  );
}

export default App;
