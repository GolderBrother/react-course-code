import dayjs, { Dayjs } from 'dayjs';
import classnames from 'classnames';

import './index.scss';
import HeaderCalendar from './HeaderCalendar/index';
import MonthCalendar from './MonthCalendar/index';
import { CSSProperties, ReactNode, useState } from 'react';
import LocaleContext from './LocaleContext';

export interface CalendarProps {
	value: Dayjs;
	style?: CSSProperties;
	// 国际化相关
	locale?: 'zh-CN' | 'en-US';
	className?: string | string[];
	// 定制日期显示，会完全覆盖日期单元格
	dateRender?: (currentDate: Dayjs) => ReactNode;
	// 定制日期单元格，内容会被添加到单元格内，只在全屏日历模式下生效。
	dateInnerContent?: (currentDate: Dayjs) => ReactNode;
	onChange?: (date: Dayjs) => void;
}

function Calendar(props: CalendarProps) {
	const {
		value,
		style,
		locale,
		className,
		onChange
	} = props;
	const classNames = classnames("calendar", className);
	const [curValue, setCurValue] = useState<Dayjs>(value);
	const [curMonth, setCurMonth] = useState<Dayjs>(value);
	function changeDate(date: Dayjs) {
		setCurValue(date);
		setCurMonth(date);
		onChange?.(date);
	}
	
	function selectHandler(date: Dayjs) {
		changeDate(date);
	}
	function prevMonthHandler() {
		setCurMonth(curMonth.subtract(1, 'month'));
	}

	function nextMonthHandler() {
		setCurMonth(curMonth.add(1, 'month'));
	}

function todayHandler() {
    const date = dayjs(Date.now());
	changeDate(date);
}
	return <LocaleContext.Provider
		value={{
			locale: locale || navigator.language
		}}
	>
		<div className={classNames} style={style}>
			<HeaderCalendar curMonth={curMonth} prevMonthHandler={prevMonthHandler} nextMonthHandler={nextMonthHandler} todayHandler={todayHandler} />
			<MonthCalendar {...props} value={curValue} curMonth={curMonth} selectHandler={selectHandler} />
		</div>
	</LocaleContext.Provider>
}

export default Calendar;
