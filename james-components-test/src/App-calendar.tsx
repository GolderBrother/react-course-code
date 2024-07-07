import dayjs from 'dayjs';
import {Calendar} from 'james-components';
import 'james-components/dist/esm/Calendar/index.css';

function App() {
  return (
    <div>
      <Calendar value={dayjs('2024-07-01')}></Calendar>
    </div>
  );
}

export default App;
