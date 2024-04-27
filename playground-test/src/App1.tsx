import { useRef } from 'react'
import { transform } from '@babel/standalone'

function App() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  // 点击编译按钮的时候，拿到内容用 babel.transform 编译，指定 typescript 和 react 的 preset
  const handleCompile = () => {
    if (!textareaRef.current) return;
    const code = textareaRef.current?.value ?? '';
    const res = transform(code, {
      presets: ['react', 'typescript'],
      filename: 'james.tsx'
    });
    const newCode = res.code;
    console.log('transform after newCode is: ', newCode);
  }
  const code = `
    import { useEffect, useState } from "react";

    function App() {
      const [num, setNum] = useState(() => {
        const num1 = 1 + 2;
        const num2 = 2 + 3;
        return num1 + num2
      });
    
      return (
        <div onClick={() => setNum((prevNum) => prevNum + 1)}>{num}</div>
      )
    }
  `;
  return (
    <div>
    {/* <textarea ref={textareaRef} style={{ width: '500px', height: '300px'}} defaultValue={code}></textarea> */}
    <button onClick={handleCompile}>编译</button>
  </div>
  )
}

export default App
