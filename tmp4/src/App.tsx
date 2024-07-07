import dayjs from 'dayjs';
const { Calendar } = require('james-components');

function App() {
  return (
    <div>
      <Calendar value={dayjs('2024-07-01')}></Calendar>
    </div>
  );
}

export default App;
