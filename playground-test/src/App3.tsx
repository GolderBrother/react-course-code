import Editor from '@monaco-editor/react';
import Preview from './Preview';

function App() {

  const code = `import { useEffect, useState } from "react";

function App() {
    const [num, setNum] = useState(() => {
        const num1 = 1 + 2;
        const num2 = 2 + 3;
        return num1 + num2
    });

    return (
        <div onClick={() => setNum((prevNum) => prevNum + 1)}>{num}</div>
    );
}

export default App;
`;

  return (
    <div className='container' style={{
      display: 'flex'
    }}>
      <div style={{ width: '50%' }}>
        <p>编辑区</p>
        <Editor height="500px" defaultLanguage="javascript" defaultValue={code} />
      </div>
      <div style={{ width: '50%' }}>
        <p>预览区</p>
        <Preview />
      </div>
    </div>
  );
}

export default App;
