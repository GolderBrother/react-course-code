import React, { useEffect, useRef } from 'react';
import Calendar, { CalendarRef } from './Calendar';
// import reportWebVitals from './reportWebVitals';

const Test = () => {
  const calendarRef = useRef<CalendarRef | null>(null);
  // const onChange = (date: Date) => {
  //   console.log('onChange date', date);
  // };
  useEffect(() => {
    console.log(calendarRef.current?.getDate().toLocaleDateString());
    setTimeout(() => {
      calendarRef.current?.setDate(new Date(2024, 3, 1));
    }, 3000);
  }, []);
  return <div>
    {/* <Calendar value={new Date('2024-03-01')} onChange={onChange} /> */}
    <Calendar ref={calendarRef} value={new Date('2024-07-23')} />
  </div>;
}

export default Test;