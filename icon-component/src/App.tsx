import React from 'react';
import './App.css';
import { IconAdd } from './Icon/icons/IconAdd';
import { IconEmail } from './Icon/icons/IconEmail';
import { createFromIconfont } from './Icon/createFrontIconfont';
const IconFont = createFromIconfont('http://at.alicdn.com/t/c/font_4443542_pv8ed3uok1c.js');
function App() {
  return (
    <>
      <div className="App">
        <IconAdd size='40px'></IconAdd>
        <IconEmail spin></IconEmail>
        <IconEmail style={{ color: 'blue', fontSize: '50px' }}></IconEmail>
      </div>


      <div className="App">
        <IconFont type='icon-yezi-01' size="30px"></IconFont>
        <IconFont type='icon-mangguo' size="40px"></IconFont>
        <IconFont type='icon-caomei' fill="blue" size="40px"></IconFont>
      </div>
    </>
  );
}

export default App;
