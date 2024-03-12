import { useRef } from 'react';
import './App.css';
import { MessageProvider, MessageRef } from './Message';
import { ConfigProvider } from './Message/hooks/ConfigProvider';
import { useMessage } from './Message/hooks/useMessage';

function TestBtn() {
  const message = useMessage();

  return <button onClick={() => {
    message.add({
      content: '请求成功'
    })
  }}>成功</button>
}


function App() {
  // const messageRef = useRef<MessageRef>(null);
  return (
    <div className="App">
      {/* <MessageProvider ref={messageRef}></MessageProvider>
      <button onClick={() =>{
        messageRef.current?.add({
          content:'请求成功'
        })
      }}>成功</button> */}
      {/* 外层包裹 ConfigProvider 来设置 context，然后在 Aaa 组件里用 useMessage 拿到 message api */}
      <ConfigProvider>
        <div>
          <TestBtn></TestBtn>
        </div>
      </ConfigProvider>
    </div>
  );
}

export default App;
