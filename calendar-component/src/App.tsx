import React from 'react';
import Calendar from './Calendar';
import './App.css';
import dayjs from 'dayjs';

function App() {
  return (
    <div className="App">
      <Calendar value={dayjs('2023-11-01')}></Calendar>
    </div>
  );
}

export default App;
