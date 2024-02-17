import { Dayjs } from 'dayjs';
import './index.scss';
import HeaderCalendar from './HeaderCalendar/index';
import MonthCalendar from './MonthCalendar/index';

export interface CalendarProps {
	value: Dayjs
};
function Calendar(props: CalendarProps) {
	return <div className="calendar">
		<HeaderCalendar />
		<MonthCalendar {...props} />
	</div>
}

export default Calendar;
