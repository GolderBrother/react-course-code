import { Dayjs } from 'dayjs';
import { CalendarProps } from '..';
import classname from 'classnames';
import CalendarLocale from '../locale/zh-CN';

import './index.scss';
import LocaleContext from '../LocaleContext';
import { useContext } from 'react';
import allLocales from '../locale';
interface MonthCalendarProps extends CalendarProps {
  selectHandler?: (date: Dayjs) => void;
  curMonth: Dayjs;
}

function getAllDays(date: Dayjs) {
  const daysInMonth = date.daysInMonth();
  const startDate = date.startOf('month');
  const day = startDate.day()
  const daysInfo: Array<{ date: Dayjs, currentMonth: boolean }> = new Array(6 * 7);


  // 填充本月第一天之前的日期
  for (let i = 0; i < day; i++) {
    daysInfo[i] = {
      date: startDate.subtract(day - i, 'day'),
      currentMonth: false
    }
  }

  // 从第一天开始，填充剩下的日期的，从 startDate 开始 +1、+2、+3 计算日期
  for (let i = day; i < daysInfo.length; i++) {
    const calcDate = startDate.add(i - day, 'day');
    daysInfo[i] = {
      date: calcDate,
      currentMonth: calcDate.month() === date.month()
    }
  }
  debugger;
  return daysInfo;
}

function MonthCalendar(props: MonthCalendarProps) {
  const localeContext = useContext(LocaleContext);
  const CalendarLocale = allLocales[localeContext.locale ?? 'zh-CN'];
  const weekList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  // const weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const {
    value,
    curMonth,
    dateRender,
    dateInnerContent,
    selectHandler
  } = props;
  const allDays = getAllDays(curMonth);

  function renderDays(days: Array<{ date: Dayjs, currentMonth: boolean }>,
    // dateRender: MonthCalendarProps['dateRender'],
    // dateInnerContent: MonthCalendarProps['dateInnerContent'],
    // value: Dayjs,
    // selectHandler: MonthCalendarProps['selectHandler']
  ) {
    const rows = [];
    // 把 6 * 7 个日期，按照 6 行，每行 7 个来组织成 jsx。
    for (let i = 0; i < 6; i++) {
      const row = [];
      for (let j = 0; j < 7; j++) {
        const item = days[i * 7 + j];
        const className = ['calendar-month-body-cell'];
        if (item.currentMonth) className.push("calendar-month-body-cell-current");
        const classNameStr = className.join(' ');
        // 如果是当前日期，就加一个 xxx-selected 的 className
        const dateValueClassNameStr = classname("calendar-month-body-cell-date-value",
          value.format('YYYY-MM-DD') === item.date.format('YYYY-MM-DD')
            ? "calendar-month-body-cell-date-selected"
            : ""
        );
        const cellText = dateRender ? dateRender(item.date) : (<div className="calendar-month-body-cell-date">
          <div className={dateValueClassNameStr}>{item.date.date()}</div>
          <div className="calendar-month-body-cell-date-content">{dateInnerContent?.(item.date)}</div>
        </div>);
        row[j] = <div className={classNameStr}
          onClick={() => selectHandler?.(item.date)}
        >{cellText}</div>
      }
      rows.push(row);
    }
    return rows.map(row => <div className="calendar-month-body-row">{row}</div>)
  }
  return <div className="calendar-month">
    <div className="calendar-month-week-list">
      {weekList.map((week) => (
        <div className="calendar-month-week-list-item" key={week}>
          {CalendarLocale?.week?.[week]}
        </div>
      ))}
    </div>
    <div className="calendar-month-body">
      {
        renderDays(allDays)
        // renderDays(allDays, dateRender, dateInnerContent, value, selectHandler)
      }
    </div>
  </div>
}
export default MonthCalendar;