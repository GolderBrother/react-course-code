import { CopyToClipboard } from './CopyToClipboard';

export default function App() {
  return <CopyToClipboard text={'james'} onCopy={() => {
    console.log('done')
  }}>
    <div onClick={() => alert(1)}>复制</div>
    {/* <span>SDSD</span> */}
  </CopyToClipboard>
}
