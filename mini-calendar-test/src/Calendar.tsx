import React, { useCallback, useImperativeHandle, useMemo, useState } from 'react';
import './calendar.css';

const monthNames = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];
export interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
}
export interface CalendarRef {
  getDate: () => Date,
  setDate: (date: Date) => void,
};
const InternalCalendar: React.ForwardRefRenderFunction<CalendarRef, CalendarProps> = (props: CalendarProps, ref) => {
  const { value = new Date(), onChange } = props;
  const [date, setDate] = useState(value);
  const handlePrevMonth = useCallback(() => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  }, [date]);
  const handleNextMonth = useCallback(() => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  }, [date]);
  const currentMonthText = useMemo(() => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return `${year} 年 ${monthNames[month]}`
  }, [date]);

  // 每月第一天是几号
  const daysOfMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  // 每月第一天是周几
  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  //  上个月最后一天是几号
  const lastDate0fLastMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };
  //  最后一天是星期几
  const lastDay0fThisMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDay();
  };

  const renderDays = useCallback(() => {
    const days = [];

    const daysCount = daysOfMonth(date.getFullYear(), date.getMonth());
    const firstDay = firstDayOfMonth(date.getFullYear(), date.getMonth());

    const lastDate = lastDate0fLastMonth(date.getFullYear(), date.getMonth());
    for (let i = 0; i < firstDay; i++) {
      // 填充上月
      days.push(<div key={`gray-${i}`} className="gray">{lastDate - (firstDay - i - 1)}</div>);
    }

    // for (let i = 0; i < firstDay; i++) {
    //   days.push(<div key={`empty-${i}`} className="empty"></div>);
    // }


    for (let i = 1; i <= daysCount; i++) {
      const clickHandler = onChange?.bind(null, new Date(date.getFullYear(), date.getMonth(), i));

      if (i === date.getDate()) {
        days.push(<div key={i} className="day selected" onClick={clickHandler}>{i}</div>);
      } else {
        days.push(<div key={i} className="day" onClick={clickHandler}>{i}</div>);
      }
    }

    const leftDays = lastDay0fThisMonth(date.getFullYear(), date.getMonth());
    for (let i = 0; i < leftDays; i++) {
      // 填充下个月
      days.push(<div key={`next-gray-${i}`} className="gray">{i + 1}</div>);
    }

    return days;
  }, [date, onChange]);

  // expose
  useImperativeHandle(ref, () => {
    return {
      getDate: () => date,
      setDate: (date: Date) => setDate(date),
    }
  });
  return (
    <div className="calendar">
      <div className="header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <div>{currentMonthText}</div>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="days">
        <div className="day">日</div>
        <div className="day">一</div>
        <div className="day">二</div>
        <div className="day">三</div>
        <div className="day">四</div>
        <div className="day">五</div>
        <div className="day">六</div>
        <div className="empty"></div>
        <div className="empty"></div>
        {renderDays()}
      </div>
    </div>
  );
};
const Calendar = React.forwardRef(InternalCalendar);
export default Calendar;
