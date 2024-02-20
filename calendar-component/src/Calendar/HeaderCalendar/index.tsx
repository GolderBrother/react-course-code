import { Dayjs } from 'dayjs';
import './index.scss';
interface HeaderProps {
    curMonth: Dayjs;
    prevMonthHandler: () => void;
    nextMonthHandler: () => void;
    todayHandler: () => void;
}
function HeaderCalendar(props: HeaderProps) {
    const {
        curMonth,
        todayHandler,
        prevMonthHandler,
        nextMonthHandler
    } = props;
    
    return <div className="calendar-header">
        <div className="calendar-header-left">
            <div className="calendar-header-icon" onClick={prevMonthHandler}>&lt;</div>
            <div className="calendar-header-value">{curMonth.format('YYYY 年 MM 月')}</div>
            <div className="calendar-header-icon" onClick={nextMonthHandler}>&gt;</div>
            <button className="calendar-header-btn" onClick={todayHandler}>今天</button>
        </div>
    </div>
}

export default HeaderCalendar;
