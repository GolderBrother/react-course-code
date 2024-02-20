import React from 'react';
import ColorPickerPanel from './ColorPicker/ColorPickerPanel';
import './App.css';

function App() {
  return (
    <div className="App">
      <ColorPickerPanel value="rgb(166 57 57)"></ColorPickerPanel>
    </div>
  );
}

export default App;
